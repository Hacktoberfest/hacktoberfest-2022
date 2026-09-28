import assert from 'node:assert/strict';
import test from 'node:test';

import { schedule } from '../src/data/content.mjs';
import { SCHEDULE_LOCKED } from '../src/data/scheduleLock.mjs';

/* The schedule lock (data/scheduleLock.mjs): a switch flipped by a deploy,
   never by the clock, and the words /schedule says while it is on. */

test('the lock is a plain switch, not a date', () => {
  assert.equal(typeof SCHEDULE_LOCKED, 'boolean');
});

test('the Coming soon panel has its words, in the house style', () => {
  const { title, copy, badge } = schedule.locked;

  for (const line of [title, copy, badge]) {
    assert.equal(typeof line, 'string');
    assert.ok(line.trim().length > 0, 'a locked line is empty');
    assert.doesNotMatch(line, /—/, `em dash in "${line}"`);
  }
  assert.equal(badge, 'Coming soon');
});

/* The switch is flipped by hand, so the panel promises no day it cannot
   keep: "soon", never a date that would outlive a late flip. */
test('the panel names no date', () => {
  const { title, copy, badge } = schedule.locked;

  for (const line of [title, copy, badge]) {
    assert.doesNotMatch(
      line,
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d/,
      `"${line}" promises a date`,
    );
  }
});
