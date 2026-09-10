import assert from 'node:assert/strict';
import test from 'node:test';

import { EARLIEST_SHOWN, formatEarnedDate } from '../src/lib/earnedDate.mjs';

/* The one date formatter both sticker renderers share: nothing reads as
   earned before Hacktoberfest began. */

test('the floor is the first of October, in UTC', () => {
  assert.equal(EARLIEST_SHOWN, '2026-10-01T00:00:00.000Z');
});

test('a completion from before October shows as October 1', () => {
  assert.equal(formatEarnedDate('2026-08-01T09:30:00.000Z'), 'October 1');
  assert.equal(formatEarnedDate('2026-09-20T09:00:00.000Z'), 'October 1');
  assert.equal(formatEarnedDate('2026-09-30T23:59:59.999Z'), 'October 1');
});

test('October 1 itself and anything later show their own day', () => {
  assert.equal(formatEarnedDate('2026-10-01T00:00:00.000Z'), 'October 1');
  assert.equal(formatEarnedDate('2026-10-01T18:00:00.000Z'), 'October 1');
  assert.equal(formatEarnedDate('2026-10-05T19:12:00.000Z'), 'October 5');
  assert.equal(formatEarnedDate('2026-10-31T23:00:00.000Z'), 'October 31');
});

test('a Date works the same as its ISO string', () => {
  assert.equal(formatEarnedDate(new Date('2026-09-21T09:00:00Z')), 'October 1');
  assert.equal(
    formatEarnedDate(new Date('2026-10-12T00:00:00Z')),
    'October 12',
  );
});

test('the day is read in UTC, so a late-evening completion does not slip a day', () => {
  assert.equal(formatEarnedDate('2026-10-02T23:30:00.000Z'), 'October 2');
});

test('junk is null, never a date', () => {
  assert.equal(formatEarnedDate('October-ish'), null);
  assert.equal(formatEarnedDate(''), null);
  assert.equal(formatEarnedDate(null), null);
  assert.equal(formatEarnedDate(undefined), null);
  assert.equal(formatEarnedDate(1760000000000), null);
});
