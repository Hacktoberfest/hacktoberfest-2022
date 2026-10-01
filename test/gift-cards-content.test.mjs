import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';

/* The strings a host reads about digital gift cards, pinned to the spec
   (2026-10-01-digital-gift-cards-design.md, section 4), which is final
   copy: the Event pack chip and hint, the Useful info row and prize
   lines, and step 2 of "Get reimbursed". fest-dashboard-page.test.mjs
   checks none of them is baked into the static export. */

const { pack } = my.dashboard;

/* A line of pieces as a host reads it: a string is text, { strong } bold,
   { email } the team's inbox as a mailto link. */
const flatten = (pieces) =>
  pieces
    .map((piece) =>
      typeof piece === 'string' ? piece : piece.strong || piece.email,
    )
    .join('');

test('the Event pack lists the gift cards with their count', () => {
  assert.equal(pack.box.giftCards.label, 'Digital gift cards');
  assert.equal(pack.box.giftCards.count(4), '× 4');
  assert.equal(pack.box.giftCards.count(1), '× 1');
});

test('the Event pack says the gift cards are not in the box', () => {
  assert.equal(
    pack.box.giftCards.hint,
    'Digital gift cards will be sent directly to your winners after your Fest. Please keep track of any winners who do not receive physical prizes.',
  );
});

/* Step 2 of "Get reimbursed": "Award digital gift cards". */

const step = my.dashboard.reimbursement.giftCards;

test('step 2 is called Award digital gift cards, and folds as Requested', () => {
  assert.equal(step.title, 'Award digital gift cards');
  assert.equal(my.dashboard.reimbursement.status.requested, 'Requested');
  assert.equal(my.dashboard.reimbursement.stepCounter(2, 4), 'Step 2 of 4');
});

test('step 2 says who the cards are for, and how many', () => {
  assert.equal(
    step.intro(4),
    'We expect that some winners of your Fest did not receive physical prizes. We will email digital gift cards to up to 4 individuals who won an MLH-provided prize category at your Fest but did not receive a physical prize.',
  );
  assert.match(step.intro(1), / up to 1 individual who won /);
  assert.equal(
    step.instructions,
    'Add the email address of each person who won an MLH-provided prize category but didn’t receive a physical prize. MLH will email them a digital gift card within 7 business days.',
  );
});

test('step 2 numbers its cards and counts them against the limit', () => {
  assert.equal(step.rowLabel(1), 'Card 1');
  assert.equal(step.rowLabel(2), 'Card 2');
  assert.equal(step.removeLabel(2), 'Remove card 2');
  assert.equal(step.addCta, 'Add another card');
  assert.equal(step.meter(2, 4), '2 of 4 cards');
  assert.equal(step.meter(1, 1), '1 of 1 card');
});

test('step 2 can only be sent once', () => {
  assert.equal(step.onceLead, 'You can only request gift cards once.');
  assert.equal(
    flatten(step.onceBody),
    'Check every address first. To change anything afterwards, email hacktoberfest@mlh.io.',
  );
  assert.deepEqual(
    step.onceBody.filter((piece) => typeof piece === 'object'),
    [{ email: 'hacktoberfest@mlh.io' }],
  );
});

test('the request button counts the cards it asks for', () => {
  assert.equal(step.requestCta(2), 'Request 2 gift cards');
  assert.equal(step.requestCta(1), 'Request 1 gift card');
  assert.equal(step.requestingCta, 'Requesting…');
});

test('a row says what is wrong with it', () => {
  assert.deepEqual(step.rowErrors, {
    invalid: 'That isn’t a full email address.',
    duplicate: 'That person is already receiving a gift card from your Fest.',
  });
  assert.equal(step.errors.rows, 'Fix the highlighted cards first.');
  assert.equal(step.errors.empty, 'Add at least one email address.');
});

test('a failed request says what to do next, as the payee form does', () => {
  const { payee } = my.dashboard.reimbursement;
  assert.equal(step.errors.changed, payee.errors.changed);
  assert.equal(step.errors.unavailable, payee.errors.unavailable);
  assert.equal(
    step.errors.invalid,
    'Check every address and try again. If it still won’t send, reload the page.',
  );
});

test('folded, step 2 says what was requested, when, and how to change it', () => {
  assert.equal(
    flatten(step.summary(3, 4, 'October 25', true)),
    'You requested 3 of your 4 gift cards on October 25. To change anything, email hacktoberfest@mlh.io.',
  );
  assert.equal(
    flatten(step.summary(1, 1, 'October 25', true)),
    'You requested 1 of your 1 gift card on October 25. To change anything, email hacktoberfest@mlh.io.',
  );
  /* A co-host's request, read off byYou like the sent card's "Sent by". */
  assert.equal(
    flatten(step.summary(2, 4, 'October 25', false)),
    'A co-host requested 2 of your 4 gift cards on October 25. To change anything, email hacktoberfest@mlh.io.',
  );
  assert.equal(
    flatten(step.summary(2, 4, null, true)),
    'You requested 2 of your 4 gift cards. To change anything, email hacktoberfest@mlh.io.',
  );
});

/* Every string the gift card copy can render, with the functions called
   at the counts a host can see. */
const rendered = (blocks) => {
  const strings = [];
  const walk = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (typeof value === 'function') {
      for (const count of [1, 4]) {
        walk(value(count, 4, 'October 25', count === 1));
      }
    } else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object')
      Object.values(value).forEach(walk);
  };
  blocks.forEach(walk);
  return strings;
};

const blocks = () => [
  pack.box.giftCards,
  my.dashboard.usefulInfo.giftCards,
  step,
  my.dashboard.reimbursement.status.requested,
];

test('no gift card string carries an em dash or a straight apostrophe', () => {
  for (const string of rendered(blocks())) {
    assert.ok(!string.includes('—'), `an em dash in: ${string}`);
    assert.ok(!string.includes("'"), `a straight apostrophe in: ${string}`);
  }
});

test('people are hosts, never organizers', () => {
  for (const string of rendered(blocks())) {
    assert.ok(!/organi[sz]er/i.test(string), `"organizer" in: ${string}`);
  }
});
