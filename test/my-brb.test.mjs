import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import { MY_BRB } from '../src/data/myBrb.mjs';

/* BRB mode (data/myBrb.mjs): a switch flipped by a deploy, never by the
   clock, and the words every /my page says while it is on. */

test('BRB mode is a plain switch, not a date', () => {
  assert.equal(typeof MY_BRB, 'boolean');
});

test('the BRB screen has its words, in the house style', () => {
  const { eyebrow, title, accent, body } = my.brb;

  for (const line of [eyebrow, title, accent, body]) {
    assert.equal(typeof line, 'string');
    assert.ok(line.trim().length > 0, 'a BRB line is empty');
    assert.doesNotMatch(line, /—/, `em dash in "${line}"`);
  }
});

/* Flipped by hand, so the screen promises no time it cannot keep. */
test('the BRB screen names no time', () => {
  const { eyebrow, title, accent, body } = my.brb;

  for (const line of [eyebrow, title, accent, body]) {
    assert.doesNotMatch(line, /\d/, `"${line}" promises a time or a date`);
  }
});
