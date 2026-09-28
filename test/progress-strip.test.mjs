import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES } from '../src/data/eligibility.mjs';
import { mergeActivities } from '../src/lib/eligibility.mjs';
import { stripSlots } from '../src/lib/progressStrip.mjs';

/* The strip's pure half: one slot per catalogue entry, in catalogue order,
   carrying the type (which colours the slot) and whether it is earned. */
test('one slot per activity, in catalogue order, unearned by default', () => {
  const slots = stripSlots(mergeActivities([]));
  assert.deepEqual(
    slots.map((slot) => slot.id),
    ACTIVITIES.map((activity) => activity.id),
  );
  slots.forEach((slot, index) => {
    assert.equal(slot.earned, false);
    assert.equal(slot.type, ACTIVITIES[index].type);
    assert.equal(slot.label, ACTIVITIES[index].label);
  });
});

test('a completed activity is an earned slot', () => {
  const slots = stripSlots(
    mergeActivities([{ id: 'ghw', completed: true, completedAt: null }]),
  );
  assert.deepEqual(
    slots.filter((slot) => slot.earned).map((slot) => slot.id),
    ['ghw'],
  );
});

test('nothing to merge is four empty slots, never a crash', () => {
  assert.equal(stripSlots(null).length, ACTIVITIES.length);
  assert.equal(
    stripSlots(undefined).every((slot) => !slot.earned),
    true,
  );
});
