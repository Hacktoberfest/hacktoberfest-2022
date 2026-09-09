import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES } from '../src/data/eligibility.mjs';
import {
  completedCount,
  isEligible,
  MILESTONE_ACTIVITIES,
  mergeActivities,
  progressLevel,
} from '../src/lib/eligibility.mjs';

test('mergeActivities returns every known activity in catalogue order', () => {
  const merged = mergeActivities([]);
  assert.deepEqual(
    merged.map((activity) => activity.id),
    ACTIVITIES.map((activity) => activity.id),
  );
});

test('an activity the API omits is treated as not completed', () => {
  const merged = mergeActivities([{ id: 'fest', completed: true }]);
  const byId = Object.fromEntries(merged.map((a) => [a.id, a]));

  assert.equal(byId.fest.completed, true);
  assert.equal(byId['dev-relay'].completed, false);
  assert.equal(byId['dev-relay'].completedAt, null);
});

test('an activity id the page has never heard of is ignored', () => {
  const merged = mergeActivities([
    { id: 'a-sixth-thing', completed: true },
    { id: 'livestream', completed: true, completedAt: '2026-10-04' },
  ]);

  assert.equal(merged.length, 5);
  assert.equal(
    merged.find((a) => a.id === 'livestream').completedAt,
    '2026-10-04',
  );
});

test('malformed entries do not throw', () => {
  assert.equal(mergeActivities().length, 5);
  assert.equal(mergeActivities(null).length, 5);
  assert.equal(mergeActivities([null, undefined, {}, 7]).length, 5);
  assert.equal(completedCount(mergeActivities([null, {}])), 0);
});

test('completedCount counts only completed activities', () => {
  assert.equal(completedCount(mergeActivities([])), 0);
  assert.equal(
    completedCount(
      mergeActivities([
        { id: 'fest', completed: true },
        { id: 'dev-post', completed: false },
      ]),
    ),
    1,
  );
});

test('eligibility needs a validated address AND one activity', () => {
  const oneDone = [{ id: 'fest', completed: true }];

  assert.equal(
    isEligible({ addressValidated: true, activities: oneDone }),
    true,
  );
  assert.equal(
    isEligible({ addressValidated: false, activities: oneDone }),
    false,
  );
  assert.equal(isEligible({ addressValidated: true, activities: [] }), false);
});

test('isEligible is safe on missing or empty input', () => {
  assert.equal(isEligible(), false);
  assert.equal(isEligible(null), false);
  assert.equal(isEligible({}), false);
});

/* Milestone 1 (stickers) and Milestone 2 (Hacktoberfest complete) are a
   purely additional display tier — the sticker-mailing rule itself never
   changes. MILESTONE_ACTIVITIES is the single number both the derivation
   and the UI read, so the threshold can't drift between them. */
const activitiesDone = (count) =>
  ACTIVITIES.slice(0, count).map((activity) => ({
    id: activity.id,
    completed: true,
  }));

test('progressLevel needs a validated address, same gate as isEligible', () => {
  assert.equal(
    progressLevel({ addressValidated: false, activities: activitiesDone(3) }),
    0,
  );
});

test('progressLevel is 0 with a validated address but no activities', () => {
  assert.equal(progressLevel({ addressValidated: true, activities: [] }), 0);
});

test('progressLevel is 1 once any activity is done, below the milestone-2 threshold', () => {
  assert.equal(
    progressLevel({ addressValidated: true, activities: activitiesDone(1) }),
    1,
  );
  assert.equal(
    progressLevel({
      addressValidated: true,
      activities: activitiesDone(MILESTONE_ACTIVITIES - 1),
    }),
    1,
  );
});

test('progressLevel is 2 once MILESTONE_ACTIVITIES are done', () => {
  assert.equal(
    progressLevel({
      addressValidated: true,
      activities: activitiesDone(MILESTONE_ACTIVITIES),
    }),
    2,
  );
  assert.equal(
    progressLevel({ addressValidated: true, activities: activitiesDone(5) }),
    2,
  );
});

test('progressLevel is safe on missing or empty input', () => {
  assert.equal(progressLevel(), 0);
  assert.equal(progressLevel(null), 0);
  assert.equal(progressLevel({}), 0);
});

test('progressLevel reaching milestone 1 never disagrees with isEligible', () => {
  const cases = [
    { addressValidated: false, activities: [] },
    { addressValidated: false, activities: activitiesDone(3) },
    { addressValidated: true, activities: [] },
    { addressValidated: true, activities: activitiesDone(1) },
    { addressValidated: true, activities: activitiesDone(2) },
    { addressValidated: true, activities: activitiesDone(3) },
  ];

  cases.forEach((eligibility) => {
    assert.equal(
      progressLevel(eligibility) >= 1,
      isEligible(eligibility),
      `disagreement for ${JSON.stringify(eligibility)}`,
    );
  });
});
