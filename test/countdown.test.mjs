import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import { HACKTOBERFEST_START, PREPTEMBER } from '../src/data/preptember.mjs';
import { countdownParts } from '../src/lib/countdown.mjs';

/* The component re-renders every second and derives all four numbers from
   the same subtraction, so the pure function is where the arithmetic is
   pinned: unit boundaries, clamping, and flooring. */

test('splits the remaining time into days, hours, minutes and seconds', () => {
  const target = new Date(2026, 9, 1); // local midnight, October 1st
  const now = new Date(2026, 8, 28, 21, 30, 15); // Sept 28, 21:30:15

  assert.deepEqual(countdownParts(target, now), {
    days: 2,
    hours: 2,
    minutes: 29,
    seconds: 45,
  });
});

test('a whole number of days has zeroed smaller units', () => {
  const target = new Date(2026, 9, 1);
  const now = new Date(2026, 8, 1);

  assert.deepEqual(countdownParts(target, now), {
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

test('partial seconds floor rather than round up', () => {
  const target = new Date(2026, 9, 1);
  const now = new Date(target.getTime() - 1500);

  assert.deepEqual(countdownParts(target, now), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 1,
  });
});

test('the moment of the target itself is all zeros', () => {
  const target = new Date(2026, 9, 1);

  assert.deepEqual(countdownParts(target, target), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

/* If Preptember mode outlives October 1st, the countdown clamps at zero
   rather than counting negative — the flag is flipped by a deploy, and the
   page must not look broken in the gap. */
test('a target in the past clamps to all zeros', () => {
  const target = new Date(2026, 9, 1);
  const now = new Date(2026, 9, 2, 12, 0, 0);

  assert.deepEqual(countdownParts(target, now), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

/* The date the whole feature counts to. Pinned by parts, not by string —
   the constant is a local-time Date on purpose (Hacktoberfest starts when
   October does wherever the participant is), so a UTC ISO comparison would
   be wrong in every timezone but one. */
test('the countdown target is local midnight, October 1st 2026', () => {
  assert.equal(HACKTOBERFEST_START.getFullYear(), 2026);
  assert.equal(HACKTOBERFEST_START.getMonth(), 9);
  assert.equal(HACKTOBERFEST_START.getDate(), 1);
  assert.equal(HACKTOBERFEST_START.getHours(), 0);
});

test('the Preptember flag is a real boolean, not truthy leftovers', () => {
  assert.equal(typeof PREPTEMBER, 'boolean');
});

/* Unlike the other bands, the countdown's heading lives inside the card,
   centered above the digits — so the copy is a single title, not the
   lead/accent pair. Every unit the component renders has a label; a bare
   number with no unit under it is meaningless. */
test('the countdown copy carries an in-card title and all four unit labels', () => {
  assert.ok(my.countdown.title);
  assert.equal(my.countdown.heading, undefined);

  ['days', 'hours', 'minutes', 'seconds'].forEach((unit) =>
    assert.ok(my.countdown.labels[unit], `missing label for ${unit}`),
  );
});
