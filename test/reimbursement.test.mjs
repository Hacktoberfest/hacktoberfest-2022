import assert from 'node:assert/strict';
import test from 'node:test';

import {
  festDeadlines,
  formatSentDate,
  formatUsd,
  openingStep,
  payeeInvalidFields,
  railSteps,
  submitOutcome,
  wrapUpChecks,
} from '../src/lib/reimbursement.mjs';

/* Money, in the handbook's currency. */

test('an amount reads as US dollars to the cent', () => {
  assert.equal(formatUsd(243.6), '$243.60');
  assert.equal(formatUsd(5.8), '$5.80');
  assert.equal(formatUsd(290), '$290.00');
  assert.equal(formatUsd(0), '$0.00');
  assert.equal(formatUsd(1450), '$1,450.00');
});

test('an amount that is not one reads as null', () => {
  for (const value of [null, undefined, '243.6', Number.NaN, -1, Infinity]) {
    assert.equal(formatUsd(value), null, String(value));
  }
});

/* The deadlines count from the Fest's own calendar date, so no zone can
   move them a day. */

test('receipts are due 30 days after the Fest, and Ramp closes after 60', () => {
  assert.deepEqual(festDeadlines('2026-10-24'), {
    receipts: 'November 23',
    rampCloses: 'December 23',
  });
});

test('the deadlines cross a month end and a year end', () => {
  assert.deepEqual(festDeadlines('2026-10-31'), {
    receipts: 'November 30',
    rampCloses: 'December 30',
  });
  assert.deepEqual(festDeadlines('2026-11-15'), {
    receipts: 'December 15',
    rampCloses: 'January 14',
  });
});

test('a Fest with no usable date has no deadlines to show', () => {
  for (const value of [null, undefined, '', 'October 24', '2026-13-01']) {
    assert.equal(festDeadlines(value), null, String(value));
  }
});

/* The day it was sent, in the Fest's zone like everything else on the
   page. 02:30Z on the 26th is still the 25th in Toronto. */

test('the sent date reads in the Fest’s zone', () => {
  assert.equal(
    formatSentDate('2026-10-26T02:30:00.000Z', 'America/Toronto'),
    'October 25',
  );
  assert.equal(
    formatSentDate('2026-10-26T02:30:00.000Z', 'Europe/Lisbon'),
    'October 26',
  );
});

test('an unusable zone falls back to the reader’s clock rather than throwing', () => {
  assert.match(
    formatSentDate('2026-10-25T15:00:00.000Z', 'Not/AZone'),
    /^October 2[56]$/,
  );
  assert.match(
    formatSentDate('2026-10-25T15:00:00.000Z', null),
    /^October 2[56]$/,
  );
});

test('an unreadable time has no date', () => {
  assert.equal(formatSentDate('yesterday', 'America/Toronto'), null);
  assert.equal(formatSentDate(null, 'America/Toronto'), null);
});

/* Step 1's four rows, in the order the card lists them. */

const ALL_PASS = {
  checkIns: true,
  submissions: true,
  winners: { missing: [] },
  photos: { count: 86 },
};

test('every check passing', () => {
  assert.deepEqual(wrapUpChecks(ALL_PASS), [
    { id: 'checkIns', verdict: 'pass' },
    { id: 'submissions', verdict: 'pass' },
    { id: 'winners', verdict: 'pass', missing: [] },
    { id: 'photos', verdict: 'pass', count: 86 },
  ]);
});

test('every check failing', () => {
  assert.deepEqual(
    wrapUpChecks({
      checkIns: false,
      submissions: false,
      winners: { missing: ['Best Use of Gemma 4'] },
      photos: { count: 0 },
    }),
    [
      { id: 'checkIns', verdict: 'fail' },
      { id: 'submissions', verdict: 'fail' },
      { id: 'winners', verdict: 'fail', missing: ['Best Use of Gemma 4'] },
      { id: 'photos', verdict: 'fail', count: 0 },
    ],
  );
});

test('three checks still waiting on FestNet; check-ins never wait', () => {
  assert.deepEqual(
    wrapUpChecks({
      checkIns: true,
      submissions: null,
      winners: null,
      photos: null,
    }),
    [
      { id: 'checkIns', verdict: 'pass' },
      { id: 'submissions', verdict: 'pending' },
      { id: 'winners', verdict: 'pending' },
      { id: 'photos', verdict: 'pending' },
    ],
  );
});

/* Which step the card opens on. Steps 2 to 3 are the page's own state, so
   a reload before sending lands on 2 again. */

const reimbursement = (overrides) => ({
  checks: ALL_PASS,
  forceApproved: false,
  eligible: true,
  limit: null,
  submission: null,
  ...overrides,
});

test('a Fest not yet wrapped up opens on step 1', () => {
  assert.equal(openingStep(reimbursement({ eligible: false })), 1);
});

test('an eligible Fest opens on step 2', () => {
  assert.equal(openingStep(reimbursement()), 2);
});

test('a force-approved Fest opens on step 2', () => {
  assert.equal(
    openingStep(
      reimbursement({
        eligible: true,
        forceApproved: true,
        checks: { ...ALL_PASS, photos: null },
      }),
    ),
    2,
  );
});

test('a sent Fest opens on the sent state, whatever else it says', () => {
  const submission = {
    submittedAt: '2026-10-25T15:12:00.000Z',
    byYou: false,
    payee: { firstName: 'Jamie', lastName: 'Rivera', email: 'j@x.ca' },
  };

  assert.equal(openingStep(reimbursement({ submission })), 'sent');
  assert.equal(
    openingStep(reimbursement({ submission, eligible: false })),
    'sent',
  );
});

/* The rail, in order: three steps without gift cards, four with them, the
   gift cards second. A step is done, the one the host is on (here), or
   still to come (todo); the step counter and every fold come from this. */

const rail = (steps) => steps.map(({ id, state }) => `${id}:${state}`);

const LIMIT = {
  country: 'Canada',
  perCheckIn: 5.8,
  checkIns: 42,
  checkInsCounted: 42,
  amount: 243.6,
};

const GIFT_CARDS = { limit: 4, request: null };

const REQUESTED = {
  limit: 4,
  request: {
    submittedAt: '2026-10-25T15:12:00.000Z',
    byYou: true,
    emails: ['jamie@sharkhacks.ca'],
  },
};

test('without gift cards the rail is the three steps it was', () => {
  const steps = railSteps(reimbursement({ eligible: false }), null);
  assert.deepEqual(rail(steps), ['wrapUp:here', 'claim:todo', 'payee:todo']);
  assert.deepEqual(
    steps.map((step) => step.number),
    [1, 2, 3],
  );
  assert.deepEqual(rail(railSteps(reimbursement({ limit: LIMIT }), null)), [
    'wrapUp:done',
    'claim:here',
    'payee:todo',
  ]);
  assert.deepEqual(
    rail(railSteps(reimbursement({ limit: LIMIT }), null, { advanced: true })),
    ['wrapUp:done', 'claim:done', 'payee:here'],
  );
});

test('with gift cards there are four steps, the gift cards second', () => {
  const steps = railSteps(reimbursement({ eligible: false }), GIFT_CARDS);
  assert.deepEqual(rail(steps), [
    'wrapUp:here',
    'giftCards:todo',
    'claim:todo',
    'payee:todo',
  ]);
  assert.deepEqual(
    steps.map((step) => step.number),
    [1, 2, 3, 4],
  );
});

test('the gift cards open once step 1 is done, checks or MLH’s approval', () => {
  for (const overrides of [
    { eligible: true },
    { eligible: true, forceApproved: true },
  ]) {
    assert.deepEqual(
      rail(
        railSteps(reimbursement({ ...overrides, limit: LIMIT }), GIFT_CARDS),
      ),
      ['wrapUp:done', 'giftCards:here', 'claim:todo', 'payee:todo'],
    );
  }
});

test('Continue cannot skip the gift cards', () => {
  assert.deepEqual(
    rail(
      railSteps(reimbursement({ limit: LIMIT }), GIFT_CARDS, {
        advanced: true,
      }),
    ),
    ['wrapUp:done', 'giftCards:here', 'claim:todo', 'payee:todo'],
  );
});

test('requested gift cards fold, and the reimbursement opens', () => {
  assert.deepEqual(
    rail(railSteps(reimbursement({ limit: LIMIT }), REQUESTED)),
    ['wrapUp:done', 'giftCards:done', 'claim:here', 'payee:todo'],
  );
  assert.deepEqual(
    rail(
      railSteps(reimbursement({ limit: LIMIT }), REQUESTED, {
        advanced: true,
      }),
    ),
    ['wrapUp:done', 'giftCards:done', 'claim:done', 'payee:here'],
  );
});

test('a request stays done even if step 1 is open again', () => {
  /* MLH can clear a force-approval after the request went: the request
     was still sent, so the rail says so. */
  assert.deepEqual(
    rail(railSteps(reimbursement({ eligible: false }), REQUESTED)),
    ['wrapUp:here', 'giftCards:done', 'claim:todo', 'payee:todo'],
  );
});

test('with no rate, Continue never opens the payee step', () => {
  assert.deepEqual(
    rail(
      railSteps(reimbursement({ limit: null }), REQUESTED, { advanced: true }),
    ),
    ['wrapUp:done', 'giftCards:done', 'claim:here', 'payee:todo'],
  );
});

/* The payee form, held to the API's own body rules so a host hears about a
   typo before the request rather than after it. */

const JAMIE = {
  firstName: 'Jamie',
  lastName: 'Rivera',
  email: 'jamie@sharkhacks.ca',
};

test('a complete payee is valid', () => {
  assert.deepEqual(payeeInvalidFields(JAMIE), []);
  assert.deepEqual(
    payeeInvalidFields({
      firstName: '  Jamie ',
      lastName: ' Rivera',
      email: ' jamie@sharkhacks.ca ',
    }),
    [],
  );
});

test('names must be 1 to 100 characters once trimmed', () => {
  assert.deepEqual(payeeInvalidFields({ ...JAMIE, firstName: '   ' }), [
    'firstName',
  ]);
  assert.deepEqual(
    payeeInvalidFields({ ...JAMIE, lastName: 'x'.repeat(101) }),
    ['lastName'],
  );
  assert.deepEqual(
    payeeInvalidFields({ ...JAMIE, lastName: 'x'.repeat(100) }),
    [],
  );
});

test('an email needs one @ with a dot after it, and fits in 254', () => {
  for (const email of [
    '',
    'jamie',
    'jamie@sharkhacks',
    'jamie.rivera@ca',
    'jamie@@sharkhacks.ca',
    'jamie@shark@hacks.ca',
    `${'x'.repeat(250)}@x.ca`,
  ]) {
    assert.deepEqual(payeeInvalidFields({ ...JAMIE, email }), ['email'], email);
  }
});

/* The API is a little stricter than the spec, and the form mirrors it:
   no control characters in a name, no whitespace in an email. */
test('a name with a line break, a tab or another control character is refused', () => {
  for (const firstName of [
    'Ja\nmie',
    'Ja\tmie',
    'Ja\rmie',
    'Ja\u0000mie',
    'Ja\u007Fmie',
    'Ja\u0085mie',
  ]) {
    assert.deepEqual(
      payeeInvalidFields({ ...JAMIE, firstName }),
      ['firstName'],
      JSON.stringify(firstName),
    );
  }
  assert.deepEqual(payeeInvalidFields({ ...JAMIE, lastName: 'Rivera\nX' }), [
    'lastName',
  ]);
});

test('a name with spaces, accents or apostrophes inside is fine', () => {
  assert.deepEqual(
    payeeInvalidFields({
      ...JAMIE,
      firstName: 'Mary Ann',
      lastName: 'O’Brien-Núñez',
    }),
    [],
  );
});

test('an email with whitespace inside is refused', () => {
  for (const email of [
    'jamie @sharkhacks.ca',
    'jamie@shark hacks.ca',
    'jamie@sharkhacks.ca\tx',
    'ja\nmie@sharkhacks.ca',
  ]) {
    assert.deepEqual(
      payeeInvalidFields({ ...JAMIE, email }),
      ['email'],
      JSON.stringify(email),
    );
  }
});

/* The API's own email rule (submit.service.ts): something before the @,
   and after it a dot with something on both sides. */
test('an email the API would refuse is refused here too', () => {
  for (const email of [
    '@example.com',
    'a@b.',
    'a@.com',
    'jamie\u0001@sharkhacks.ca',
    'jamie@sharkhacks.ca\u007F',
    'jamie@shark\u0085hacks.ca',
  ]) {
    assert.deepEqual(
      payeeInvalidFields({ ...JAMIE, email }),
      ['email'],
      JSON.stringify(email),
    );
  }
});

test('an email the API takes is taken here too', () => {
  for (const email of ['a@b.co', 'jamie.rivera+fest@mail.sharkhacks.ca']) {
    assert.deepEqual(payeeInvalidFields({ ...JAMIE, email }), [], email);
  }
});

test('every bad field is named, in form order', () => {
  assert.deepEqual(payeeInvalidFields({}), ['firstName', 'lastName', 'email']);
});

/* What the card does with a failed send. */

const failure = (status, body = null) => {
  const error = new Error(`Request failed: ${status}`);
  error.status = status;
  error.body = body;
  return error;
};

test('someone else got there first: refetch and show what they sent', () => {
  assert.equal(
    submitOutcome(failure(409, { error: 'ALREADY_SUBMITTED' })),
    'refetch',
  );
  /* The API's error bodies are flat, with a message beside the code. */
  assert.equal(
    submitOutcome(
      failure(409, {
        error: 'ALREADY_SUBMITTED',
        message: 'This Fest’s reimbursement has already been submitted.',
      }),
    ),
    'refetch',
  );
});

test('a dead session or a Fest that is no longer theirs: refetch, and the page says why', () => {
  for (const status of [401, 403, 404]) {
    assert.equal(submitOutcome(failure(status)), 'refetch', String(status));
  }
});

test('gift cards the page did not know it needed: refetch, and step 2 appears', () => {
  /* The reimbursement POST's 409 when the Fest has gift cards and no
     forwarded request: gift cards turned on after the page loaded, or a
     request that was still being forwarded when the page read it and then
     failed. Either way the fresh dashboard shows the step. */
  assert.equal(
    submitOutcome(failure(409, { error: 'GIFT_CARDS_NOT_REQUESTED' })),
    'refetch',
  );
});

test('gift cards the page cannot show: say so, rather than refetch into the same form', () => {
  /* The page reads no usable gift cards (normalizeGiftCards gave null), so
     a refetch would bring back the same payee form with nothing said. */
  assert.equal(
    submitOutcome(failure(409, { error: 'GIFT_CARDS_NOT_REQUESTED' }), {
      giftCardsOn: false,
    }),
    'changed',
  );
  assert.equal(
    submitOutcome(failure(409, { error: 'GIFT_CARDS_NOT_REQUESTED' }), {
      giftCardsOn: true,
    }),
    'refetch',
  );
});

test('a body the API refused: check the details', () => {
  assert.equal(
    submitOutcome(failure(400, { error: 'INVALID_REQUEST' })),
    'invalid',
  );
});

test('any other conflict: something changed', () => {
  for (const error of [
    'NOT_ENDED',
    'NOT_HACK_DAY',
    'NOT_ELIGIBLE',
    'NO_RATE',
  ]) {
    assert.equal(submitOutcome(failure(409, { error })), 'changed', error);
  }
  assert.equal(submitOutcome(failure(409)), 'changed');
});

test('MLH’s form, the network or anything else: try again', () => {
  assert.equal(
    submitOutcome(failure(502, { error: 'FORM_UNAVAILABLE' })),
    'unavailable',
  );
  assert.equal(submitOutcome(failure(500)), 'unavailable');
  assert.equal(submitOutcome(new TypeError('Failed to fetch')), 'unavailable');
  assert.equal(submitOutcome(null), 'unavailable');
});
