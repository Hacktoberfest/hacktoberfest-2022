import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';

const copy = my.dashboard.checkInCode;

/* The strings a host reads on the check-in code card. The intro is also
   pinned by fest-dashboard-page.test.mjs, which proves the card never bakes
   into the static export. */

test('the card tells hosts where attendees redeem the code', () => {
  assert.equal(copy.url, 'mlh.com/checkin');
  assert.equal(copy.href, 'https://mlh.com/checkin');
  assert.ok(copy.hint.includes(copy.url));
});

test('the three steps read as briefed', () => {
  assert.equal(copy.steps.visit, 'On their phone or laptop, go to:');
  assert.equal(copy.steps.enter, 'They enter your code');
  assert.equal(
    copy.steps.done,
    'They’re checked into your Fest! They’ll receive virtual stickers and a certificate on My Hacktoberfest.',
  );
});

test('the code is read out a character at a time', () => {
  assert.equal(copy.codeLabel('K7RQ2W'), 'Check-in code K 7 R Q 2 W');
});
