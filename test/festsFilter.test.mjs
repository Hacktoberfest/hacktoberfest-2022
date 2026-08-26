import assert from 'node:assert/strict';
import test from 'node:test';

import {
  filterByFormat,
  formatCounts,
  normalizeFormatFilter,
} from '../src/lib/festsFilter.mjs';

const FESTS = [
  { id: 'a', format: 'hackDay' },
  { id: 'b', format: 'meetUp' },
  { id: 'c', format: 'hackDay' },
  /* The off-convention Fest, whose name claims neither format. */
  { id: 'd', format: null },
];

test('all passes everything through, off-convention included', () => {
  assert.equal(filterByFormat(FESTS, 'all'), FESTS);
});

test('a named filter is exact', () => {
  assert.deepEqual(
    filterByFormat(FESTS, 'hackDay').map((f) => f.id),
    ['a', 'c'],
  );
  assert.deepEqual(
    filterByFormat(FESTS, 'meetUp').map((f) => f.id),
    ['b'],
  );
});

/* This parses a URL parameter. A mistyped link lands on the whole
   directory, never an empty one. */
test('unrecognised filters normalise to all', () => {
  assert.equal(normalizeFormatFilter('hackDay'), 'hackDay');
  assert.equal(normalizeFormatFilter('meetUp'), 'meetUp');
  assert.equal(normalizeFormatFilter('hackathon'), 'all');
  assert.equal(normalizeFormatFilter(''), 'all');
  assert.equal(normalizeFormatFilter(null), 'all');
  assert.equal(normalizeFormatFilter(undefined), 'all');
});

/* The named counts need not sum to all: the off-convention Fest belongs
   to the whole and to neither kind. */
test('counts describe the set, and all can exceed the sum', () => {
  assert.deepEqual(formatCounts(FESTS), { all: 4, hackDay: 2, meetUp: 1 });
  assert.deepEqual(formatCounts([]), { all: 0, hackDay: 0, meetUp: 0 });
});
