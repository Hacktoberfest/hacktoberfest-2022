import assert from 'node:assert/strict';
import test from 'node:test';

import { splitFeatured } from '../src/lib/festsFeatured.mjs';

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
