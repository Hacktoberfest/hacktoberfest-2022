import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LIST_ZOOM,
  clusterAction,
  festsInCluster,
} from '../src/lib/festCluster.mjs';

/* A cluster that comes apart at a neighbourhood zoom is worth zooming
   into: the reader lands on a view where the Fests stand as their own
   pins. */
test('a cluster that breaks apart by street level is zoomed into', () => {
  assert.equal(clusterAction(9), 'zoom');
  assert.equal(clusterAction(LIST_ZOOM), 'zoom');
});

/* Past street level the pins would be within a building's width of each
   other: same venue, same geocode, or the very same coordinates, which
   never come apart at any zoom. Zooming there is a dead end, so the
   cluster opens as a list instead. */
test('a cluster that only breaks apart past street level is listed', () => {
  assert.equal(clusterAction(LIST_ZOOM + 1), 'list');
  assert.equal(clusterAction(19), 'list');
});

const FESTS = [
  { id: 'a', name: 'First' },
  { id: 'b', name: 'Second' },
  { id: 'c', name: 'Third' },
];

const leaf = (id) => ({ type: 'Feature', properties: { id } });

/* The list keeps the directory's own order, whatever order the source
   hands its leaves back in, so the map and the cards agree. */
test('lists the Fests the leaves name, in directory order', () => {
  assert.deepEqual(festsInCluster([leaf('c'), leaf('a')], FESTS), [
    FESTS[0],
    FESTS[2],
  ]);
});

test('a leaf the directory no longer holds is left out', () => {
  assert.deepEqual(festsInCluster([leaf('zz'), leaf('b')], FESTS), [FESTS[1]]);
});
