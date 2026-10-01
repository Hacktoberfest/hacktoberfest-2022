import assert from 'node:assert/strict';
import test from 'node:test';

import {
  giftCardRowProblems,
  giftCardsFor,
  normalizeGiftCardRequest,
  normalizeGiftCards,
} from '../src/lib/giftCards.mjs';

/* dashboard.giftCards, read for the page: the Fest's limit from MLH's
   shipping sheet, and its one request. Anything the page cannot show
   truthfully turns the feature off rather than inventing a number. */

const REQUEST = {
  submittedAt: '2026-10-25T15:12:00.000Z',
  byYou: true,
  emails: ['jamie@sharkhacks.ca', 'priya@utoronto.ca'],
};

test('a limit and no request pass through', () => {
  assert.deepEqual(normalizeGiftCards({ limit: 4, request: null }), {
    limit: 4,
    request: null,
  });
});

test('a limit and a request pass through', () => {
  assert.deepEqual(normalizeGiftCards({ limit: 4, request: REQUEST }), {
    limit: 4,
    request: REQUEST,
  });
});

test('no usable limit is no gift cards at all', () => {
  for (const limit of [0, -1, 2.5, '4', null, undefined, NaN, Infinity]) {
    assert.equal(
      normalizeGiftCards({ limit, request: null }),
      null,
      String(limit),
    );
  }
});

test('a value that is not a block is no gift cards', () => {
  for (const value of [null, undefined, 4, 'yes', [], true]) {
    assert.equal(normalizeGiftCards(value), null, String(value));
  }
});

test('a missing request reads as not requested', () => {
  assert.deepEqual(normalizeGiftCards({ limit: 2 }), {
    limit: 2,
    request: null,
  });
});

test('a request with no readable time is no request', () => {
  for (const submittedAt of [null, '', 'yesterday', 42]) {
    assert.equal(
      normalizeGiftCardRequest({ ...REQUEST, submittedAt }),
      null,
      String(submittedAt),
    );
  }
  assert.equal(normalizeGiftCardRequest(null), null);
  assert.equal(normalizeGiftCardRequest('sent'), null);
});

test('byYou holds only on a literal true', () => {
  for (const byYou of [false, 'true', 1, undefined]) {
    assert.equal(
      normalizeGiftCardRequest({ ...REQUEST, byYou }).byYou,
      false,
      String(byYou),
    );
  }
});

test('the emails are kept in order, trimmed, and only when readable', () => {
  assert.deepEqual(
    normalizeGiftCardRequest({
      ...REQUEST,
      emails: [' jamie@sharkhacks.ca ', '', 42, null, 'sam@queensu.ca'],
    }).emails,
    ['jamie@sharkhacks.ca', 'sam@queensu.ca'],
  );
  assert.deepEqual(
    normalizeGiftCardRequest({ ...REQUEST, emails: 'jamie@sharkhacks.ca' })
      .emails,
    [],
  );
});

/* The one rule every surface asks: a Hack Day whose block survived the
   seam. The API already sends null for anything else; the page holds the
   rule again, as it does for a Meet Up's partners. */

test('a Hack Day with gift cards has them', () => {
  const giftCards = { limit: 4, request: null };
  assert.equal(giftCardsFor({ format: 'hackDay', giftCards }), giftCards);
});

test('a Meet Up never has gift cards, whatever the API sends', () => {
  assert.equal(
    giftCardsFor({ format: 'meetUp', giftCards: { limit: 4, request: null } }),
    null,
  );
});

test('a format nobody could place has none', () => {
  assert.equal(
    giftCardsFor({ format: null, giftCards: { limit: 4, request: null } }),
    null,
  );
});

test('an API from before gift cards, or a Fest without any, has none', () => {
  assert.equal(giftCardsFor({ format: 'hackDay' }), null);
  assert.equal(giftCardsFor({ format: 'hackDay', giftCards: null }), null);
  assert.equal(giftCardsFor(null), null);
});

/* Step 2's rows, held to the API's own rules before the request: each
   address is the payee email rule (254 at most, one @ with a dot after it,
   no whitespace or control characters), and no two are the same person
   ignoring case. Empty rows are skipped, unless every row is empty. */

test('good rows pass, trimmed, in the order they were typed', () => {
  assert.deepEqual(
    giftCardRowProblems([' jamie@sharkhacks.ca ', 'priya@utoronto.ca']),
    {
      problems: [null, null],
      emails: ['jamie@sharkhacks.ca', 'priya@utoronto.ca'],
      empty: false,
    },
  );
});

test('an empty row is skipped while another has an address', () => {
  assert.deepEqual(giftCardRowProblems(['', 'sam@queensu.ca', '   ']), {
    problems: [null, null, null],
    emails: ['sam@queensu.ca'],
    empty: false,
  });
});

test('every row empty is nothing to send', () => {
  assert.deepEqual(giftCardRowProblems(['']), {
    problems: [null],
    emails: [],
    empty: true,
  });
  assert.equal(giftCardRowProblems(['  ', '']).empty, true);
  assert.equal(giftCardRowProblems([]).empty, true);
});

test('an address the payee form would refuse is not a full address', () => {
  for (const value of [
    'priya at utoronto',
    'priya@utoronto',
    '@utoronto.ca',
    'priya@.ca',
    'pri ya@utoronto.ca',
    'priya@utoronto.ca\u0000',
    `${'a'.repeat(245)}@example.com`,
  ]) {
    assert.deepEqual(
      giftCardRowProblems(['jamie@sharkhacks.ca', value]).problems,
      [null, 'invalid'],
      JSON.stringify(value),
    );
  }
});

test('the same person twice, ignoring case, is a duplicate after the first', () => {
  assert.deepEqual(
    giftCardRowProblems([
      'jamie@sharkhacks.ca',
      'priya@utoronto.ca',
      ' Jamie@SharkHacks.ca',
    ]).problems,
    [null, null, 'duplicate'],
  );
});

test('a bad address is not a duplicate of anything', () => {
  assert.deepEqual(
    giftCardRowProblems(['priya at utoronto', 'priya at utoronto']).problems,
    ['invalid', 'invalid'],
  );
});

test('values that are not strings read as empty rows', () => {
  assert.deepEqual(giftCardRowProblems([null, 42, 'sam@queensu.ca']), {
    problems: [null, null, null],
    emails: ['sam@queensu.ca'],
    empty: false,
  });
});
