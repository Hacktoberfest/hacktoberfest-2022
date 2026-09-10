import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES } from '../src/data/eligibility.mjs';
import { DEFAULT_THRESHOLDS } from '../src/lib/eligibility.mjs';
import { progressFromPayload } from '../src/lib/progress.mjs';

/* The one place the API's word meets the site's: `challenges` in,
   `activities` out, merged onto the catalogue by slug. */

const payload = (over = {}) => ({
  thresholds: { stickers: 1, complete: 3 },
  completedCount: 1,
  challenges: [
    {
      id: 'livestreams',
      name: 'Attend two livestreams',
      description: null,
      completed: true,
      completedAt: '2026-10-05T19:12:00.000Z',
      source: 'event_checkins',
    },
    {
      id: 'fest',
      name: 'Attend a Fest',
      description: null,
      completed: false,
      completedAt: null,
      source: null,
    },
  ],
  ...over,
});

test('challenges become activities in catalogue order, merged by slug', () => {
  const { activities } = progressFromPayload(payload());
  assert.deepEqual(
    activities.map((a) => a.id),
    ACTIVITIES.map((a) => a.id),
  );
  const byId = Object.fromEntries(activities.map((a) => [a.id, a]));
  assert.equal(byId.livestreams.completed, true);
  assert.equal(byId.livestreams.completedAt, '2026-10-05T19:12:00.000Z');
  assert.equal(byId.livestreams.source, 'event_checkins');
  assert.equal(byId.fest.completed, false);
  assert.equal(byId.fest.source, null);
});

/* /activities/ signed in feeds an already-merged result back through this
   function (see src/pages/activities.js), rather than the bare API
   entries — it must not drop `source` on that second pass, or the "how"
   phrase on the row would disappear once the page re-renders. */
test('is idempotent over its own output, source included', () => {
  const first = progressFromPayload(payload());
  const second = progressFromPayload({
    thresholds: first.thresholds,
    challenges: first.activities,
  });
  assert.deepEqual(second.activities, first.activities);
  const byId = Object.fromEntries(second.activities.map((a) => [a.id, a]));
  assert.equal(byId.livestreams.source, 'event_checkins');
});

test('the catalogue’s copy wins over the API’s name', () => {
  const { activities } = progressFromPayload(
    payload({
      challenges: [
        {
          id: 'fest',
          name: 'Something else',
          completed: true,
          completedAt: null,
          source: 'manual',
        },
      ],
    }),
  );
  const fest = activities.find((a) => a.id === 'fest');
  assert.equal(fest.label, ACTIVITIES.find((a) => a.id === 'fest').label);
  assert.notEqual(fest.label, 'Something else');
});

test('an id the catalogue lacks is dropped; one the API lacks reads undone', () => {
  const { activities } = progressFromPayload(
    payload({
      challenges: [
        {
          id: 'dev-post',
          completed: true,
          completedAt: null,
          source: 'import',
        },
      ],
    }),
  );
  assert.equal(
    activities.some((a) => a.id === 'dev-post'),
    false,
  );
  assert.equal(activities.find((a) => a.id === 'ghw').completed, false);
});

test('thresholds pass through, and fall back when unusable', () => {
  assert.deepEqual(
    progressFromPayload(payload({ thresholds: { stickers: 2, complete: 5 } }))
      .thresholds,
    { stickers: 2, complete: 5 },
  );
  assert.deepEqual(
    progressFromPayload(payload({ thresholds: null })).thresholds,
    DEFAULT_THRESHOLDS,
  );
  assert.deepEqual(progressFromPayload({}).thresholds, DEFAULT_THRESHOLDS);
});

test('a malformed payload is every activity undone', () => {
  for (const bad of [null, undefined, 'x', { challenges: 'nope' }]) {
    const { activities } = progressFromPayload(bad);
    assert.equal(activities.length, ACTIVITIES.length, String(bad));
    assert.ok(
      activities.every((a) => a.completed === false),
      String(bad),
    );
  }
});
