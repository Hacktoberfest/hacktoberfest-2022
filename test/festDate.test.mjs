import assert from 'node:assert/strict';
import test from 'node:test';

import { formatFestDate, sortByDateAsc } from '../src/lib/festDate.mjs';

test('formatFestDate renders a valid ISO date as "Month D"', () => {
  assert.equal(formatFestDate('2026-10-03'), 'October 3');
  assert.equal(formatFestDate('2026-01-25'), 'January 25');
});

test('formatFestDate returns null for malformed input', () => {
  assert.equal(formatFestDate('not-a-date'), null);
  assert.equal(formatFestDate(undefined), null);
  assert.equal(formatFestDate('2026-13-01'), null);
});

test('sortByDateAsc orders earliest first and pushes malformed dates last', () => {
  const fests = [
    { id: 'c', date: '2026-10-20' },
    { id: 'a', date: '2026-10-03' },
    { id: 'bad', date: 'nope' },
    { id: 'b', date: '2026-10-10' },
  ];

  const sorted = sortByDateAsc(fests);

  assert.deepEqual(
    sorted.map((f) => f.id),
    ['a', 'b', 'c', 'bad'],
  );
});

test('sortByDateAsc does not mutate its input', () => {
  const fests = [
    { id: 'b', date: '2026-10-10' },
    { id: 'a', date: '2026-10-03' },
  ];
  sortByDateAsc(fests);
  assert.deepEqual(
    fests.map((f) => f.id),
    ['b', 'a'],
  );
});
