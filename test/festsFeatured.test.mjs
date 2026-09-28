import assert from 'node:assert/strict';
import test from 'node:test';

import { homepageFirst, splitFeatured } from '../src/lib/festsFeatured.mjs';

/* The directory's Featured group: the pinned upcoming Fests apart from the
   rest, each half in the order it arrived in. */

const fest = (id, featured) => ({
  id,
  ...(featured === undefined ? {} : { featured }),
});

test('pinned Fests go to the front half, the rest behind, order kept', () => {
  const { featured, rest } = splitFeatured([
    fest('a', false),
    fest('b', true),
    fest('c'),
    fest('d', true),
  ]);

  assert.deepEqual(
    featured.map((f) => f.id),
    ['b', 'd'],
  );
  assert.deepEqual(
    rest.map((f) => f.id),
    ['a', 'c'],
  );
});

/* An API from before the field sends no key; junk is not a pin either. */
test('only featured === true counts', () => {
  const { featured } = splitFeatured([
    fest('missing'),
    fest('string', 'true'),
    fest('one', 1),
    fest('yes', true),
  ]);

  assert.deepEqual(
    featured.map((f) => f.id),
    ['yes'],
  );
});

test('nothing pinned leaves the list as it was', () => {
  const list = [fest('a'), fest('b', false)];
  const { featured, rest } = splitFeatured(list);

  assert.deepEqual(featured, []);
  assert.deepEqual(rest, list);
});

test('junk degrades to two empty halves, never a throw', () => {
  for (const input of [undefined, null, 'fests', {}]) {
    assert.deepEqual(splitFeatured(input), { featured: [], rest: [] });
  }
});

/* The homepage's six read its own pin, not Featured. */
test('splitFeatured reads whichever pin it is asked for', () => {
  const list = [
    { id: 'featured', featured: true },
    { id: 'home', homepagePinned: true },
  ];

  assert.deepEqual(
    splitFeatured(list).featured.map((f) => f.id),
    ['featured'],
  );
  assert.deepEqual(
    splitFeatured(list, 'homepagePinned').featured.map((f) => f.id),
    ['home'],
  );
});

/* The homepage's six: pinned to the homepage first, then the soonest of
   the rest. */
const dated = (id, date, pinned) => ({
  id,
  date,
  ...(pinned ? { homepagePinned: true } : {}),
});

test('homepageFirst leads with the pinned, soonest first, then fills with the soonest', () => {
  const upcoming = [
    dated('oct-03', '2026-10-03'),
    dated('oct-31-pin', '2026-10-31', true),
    dated('oct-10', '2026-10-10'),
    dated('oct-24-pin', '2026-10-24', true),
    dated('oct-17', '2026-10-17'),
    dated('oct-18', '2026-10-18'),
    dated('oct-25', '2026-10-25'),
    { ...dated('featured-only', '2026-10-01'), featured: true },
  ];

  assert.deepEqual(
    homepageFirst(upcoming, 6).map((f) => f.id),
    ['oct-24-pin', 'oct-31-pin', 'featured-only', 'oct-03', 'oct-10', 'oct-17'],
  );
});

test('homepageFirst never shows more than the count, pinned or not', () => {
  const pinned = [
    '2026-10-09',
    '2026-10-02',
    '2026-10-05',
    '2026-10-01',
    '2026-10-08',
    '2026-10-03',
    '2026-10-07',
  ].map((date) => dated(date, date, true));

  assert.deepEqual(
    homepageFirst([dated('plain', '2026-10-04'), ...pinned], 6).map(
      (f) => f.id,
    ),
    [
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-05',
      '2026-10-07',
      '2026-10-08',
    ],
  );
});

test('homepageFirst with nothing pinned is the soonest six, as before', () => {
  const upcoming = ['2026-10-20', '2026-10-02', '2026-10-11'].map((date) =>
    dated(date, date),
  );

  assert.deepEqual(
    homepageFirst(upcoming, 6).map((f) => f.id),
    ['2026-10-02', '2026-10-11', '2026-10-20'],
  );
});
