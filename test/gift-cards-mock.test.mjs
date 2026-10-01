import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'mocked';

const { requestGiftCards } = await import('../src/lib/giftCards.mjs');

/* The modules read process.env at import time, so the sentinel must be set
   before this file's first import of them. node:test runs files in isolated
   processes, so setting it here is safe. */

test('the mocked build requests without a backend, after a beat', async () => {
  let fetched = false;
  globalThis.fetch = async () => {
    fetched = true;
    throw new Error('the mocked build must not call the network');
  };

  const started = Date.now();
  const request = await requestGiftCards('fest-review-gift-cards', [
    ' jamie@sharkhacks.ca ',
    '',
    'priya@utoronto.ca',
  ]);

  assert.equal(fetched, false);
  assert.ok(Date.now() - started >= 500, 'the requesting state should show');
  assert.ok(!Number.isNaN(Date.parse(request.submittedAt)));
  assert.equal(request.byYou, true);
  assert.deepEqual(request.emails, [
    'jamie@sharkhacks.ca',
    'priya@utoronto.ca',
  ]);
});

/* The mocked build's gift card review links, reachable at
   /my/fest/?id=… but listed on no scenario's /my: a Hack Day before its
   Fest (the pack chip and the prize lines), an ended one with step 2 open,
   an ended one with step 2 requested and step 3 open, and a Meet Up whose
   payload carries a gift card block anyway (nothing shows). */

const { getFestDashboard, normalizeDashboard } = await import(
  '../src/lib/festDashboard.mjs'
);
const { REVIEW_FESTS, SCENARIOS, UPCOMING_REVIEW_FESTS } = await import(
  '../src/data/fixtures.mjs'
);
const { festHasEnded, hasFestDashboard } = await import('../src/lib/fests.mjs');
const { giftCardsFor } = await import('../src/lib/giftCards.mjs');
const { openingStep, railSteps } = await import('../src/lib/reimbursement.mjs');
const { usefulInfo } = await import('../src/lib/usefulInfo.mjs');

/* After every ended review Fest, and before the upcoming ones: the last
   day before October, and the last hour of October's Fests. */
const SEPTEMBER = Date.parse('2026-09-30T12:00:00.000Z');
const OCTOBER_END = Date.parse('2026-10-30T20:00:00.000Z');

const IDS = {
  upcoming: 'fest-review-gift-cards-upcoming',
  open: 'fest-review-gift-cards',
  requested: 'fest-review-gift-cards-requested',
  meetUp: 'fest-review-gift-cards-meetup',
};

const here = (dashboard) =>
  railSteps(dashboard.reimbursement, giftCardsFor(dashboard)).find(
    (step) => step.state === 'here',
  );

test('every gift card review Fest is reachable, a host’s own, and read as a live payload is', async () => {
  for (const id of Object.values(IDS)) {
    const { fest, dashboard } = await getFestDashboard(id);
    assert.equal(fest.id, id);
    assert.ok(hasFestDashboard(fest), id);
    assert.deepEqual(
      normalizeDashboard({ fest, dashboard }).dashboard,
      dashboard,
      id,
    );
  }
});

test('the upcoming review Fests are upcoming, and on no scenario’s /my', () => {
  const listed = Object.values(SCENARIOS).flatMap((scenario) =>
    (scenario.fests || []).map((fest) => fest.id),
  );
  assert.deepEqual(
    UPCOMING_REVIEW_FESTS.map((fest) => fest.id),
    [IDS.upcoming, IDS.meetUp],
  );
  for (const fest of UPCOMING_REVIEW_FESTS) {
    assert.ok(!listed.includes(fest.id), fest.id);
    assert.ok(!festHasEnded(fest, SEPTEMBER), fest.id);
    assert.ok(!festHasEnded(fest, OCTOBER_END), fest.id);
  }
  for (const id of [IDS.open, IDS.requested]) {
    assert.ok(
      REVIEW_FESTS.some((fest) => fest.id === id),
      id,
    );
    assert.ok(!listed.includes(id), id);
  }
});

test('before the Fest: a Gemma Hack Day with 4 gift cards, a shipped pack and both prize lines', async () => {
  const { dashboard } = await getFestDashboard(IDS.upcoming);
  assert.equal(giftCardsFor(dashboard).limit, 4);
  assert.equal(dashboard.giftCards.request, null);
  assert.ok(dashboard.packContents.length > 0);
  assert.ok(dashboard.trackingNumbers.length > 0);
  assert.deepEqual(usefulInfo(dashboard), {
    deck: 'gemma',
    lines: ['openSourceAi', 'gemma'],
  });
});

test('step 2 open: step 1 done, no request yet', async () => {
  const { fest, dashboard } = await getFestDashboard(IDS.open);
  assert.ok(festHasEnded(fest, SEPTEMBER));
  assert.equal(openingStep(dashboard.reimbursement), 2);
  assert.equal(giftCardsFor(dashboard).limit, 4);
  assert.deepEqual(here(dashboard), {
    id: 'giftCards',
    number: 2,
    state: 'here',
  });
});

test('step 2 requested: three of four cards, step 3 open', async () => {
  const { fest, dashboard } = await getFestDashboard(IDS.requested);
  const { request, limit } = giftCardsFor(dashboard);
  assert.ok(festHasEnded(fest, SEPTEMBER));
  assert.equal(limit, 4);
  assert.equal(request.emails.length, 3);
  assert.equal(request.byYou, true);
  assert.deepEqual(here(dashboard), { id: 'claim', number: 3, state: 'here' });
});

test('a Meet Up whose payload carries gift cards shows none', async () => {
  const { dashboard } = await getFestDashboard(IDS.meetUp);
  assert.equal(dashboard.format, 'meetUp');
  assert.equal(dashboard.giftCards.limit, 4);
  assert.equal(giftCardsFor(dashboard), null);
  assert.deepEqual(usefulInfo(dashboard), { deck: 'meetUp', lines: [] });
});
