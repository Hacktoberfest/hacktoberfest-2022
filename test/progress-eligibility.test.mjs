import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES } from '../src/data/eligibility.mjs';
import {
  completedCount,
  countedCompletions,
  DEFAULT_THRESHOLDS,
  isEligible,
  mergeActivities,
  progressLevel,
  thresholdsOf,
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
    { id: 'a-fifth-thing', completed: true },
    { id: 'livestreams-1', completed: true, completedAt: '2026-10-04' },
  ]);

  assert.equal(merged.length, ACTIVITIES.length);
  assert.equal(
    merged.find((a) => a.id === 'livestreams-1').completedAt,
    '2026-10-04',
  );
});

test('malformed entries do not throw', () => {
  assert.equal(mergeActivities().length, ACTIVITIES.length);
  assert.equal(mergeActivities(null).length, ACTIVITIES.length);
  assert.equal(
    mergeActivities([null, undefined, {}, 7]).length,
    ACTIVITIES.length,
  );
  assert.equal(completedCount(mergeActivities([null, {}])), 0);
});

test('completedCount counts only completed activities', () => {
  assert.equal(completedCount(mergeActivities([])), 0);
  assert.equal(
    completedCount(
      mergeActivities([
        { id: 'fest', completed: true },
        { id: 'dev-relay', completed: false },
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
   changes. DEFAULT_THRESHOLDS.complete is the single number both the
   derivation and the UI read, so the threshold can't drift between them. */
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
      activities: activitiesDone(DEFAULT_THRESHOLDS.complete - 1),
    }),
    1,
  );
});

test('progressLevel is 2 once DEFAULT_THRESHOLDS.complete are done', () => {
  assert.equal(
    progressLevel({
      addressValidated: true,
      activities: activitiesDone(DEFAULT_THRESHOLDS.complete),
    }),
    2,
  );
  assert.equal(
    progressLevel({
      addressValidated: true,
      activities: activitiesDone(DEFAULT_THRESHOLDS.complete + 1),
    }),
    2,
  );
  assert.equal(
    progressLevel({
      addressValidated: true,
      activities: activitiesDone(DEFAULT_THRESHOLDS.completionist),
    }),
    3,
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

test('thresholdsOf reads the experience and falls back to the defaults', () => {
  assert.deepEqual(thresholdsOf({}), DEFAULT_THRESHOLDS);
  assert.deepEqual(thresholdsOf(null), DEFAULT_THRESHOLDS);
  assert.deepEqual(thresholdsOf({ thresholds: { stickers: 1, complete: 4 } }), {
    stickers: 1,
    complete: 4,
    completionist: DEFAULT_THRESHOLDS.completionist,
    completionistPlusPlus: DEFAULT_THRESHOLDS.completionistPlusPlus,
  });
  // Anything that is not a positive integer pair is not a threshold.
  assert.deepEqual(
    thresholdsOf({ thresholds: { stickers: 0, complete: 4 } }),
    DEFAULT_THRESHOLDS,
  );
  assert.deepEqual(
    thresholdsOf({ thresholds: { stickers: '1', complete: 3 } }),
    DEFAULT_THRESHOLDS,
  );
});

test('thresholdsOf reads completionist, and defaults it alone when a payload predates it', () => {
  assert.deepEqual(
    thresholdsOf({
      thresholds: { stickers: 1, complete: 8, completionist: 13 },
    }),
    {
      stickers: 1,
      complete: 8,
      completionist: 13,
      completionistPlusPlus: DEFAULT_THRESHOLDS.completionistPlusPlus,
    },
  );
  assert.deepEqual(thresholdsOf({ thresholds: { stickers: 1, complete: 8 } }), {
    stickers: 1,
    complete: 8,
    completionist: DEFAULT_THRESHOLDS.completionist,
    completionistPlusPlus: DEFAULT_THRESHOLDS.completionistPlusPlus,
  });
  assert.equal(
    thresholdsOf({ thresholds: { stickers: 1, complete: 8, completionist: 0 } })
      .completionist,
    DEFAULT_THRESHOLDS.completionist,
  );
});

test('progressLevel reaches 3 at the completionist threshold', () => {
  const done = (n) =>
    ACTIVITIES.slice(0, n).map((a) => ({ id: a.id, completed: true }));
  const thresholds = { stickers: 1, complete: 2, completionist: 4 };
  assert.equal(
    progressLevel({ addressValidated: true, activities: done(4), thresholds }),
    3,
  );
  assert.equal(
    progressLevel({ addressValidated: true, activities: done(3), thresholds }),
    2,
  );
  assert.equal(
    progressLevel({ addressValidated: false, activities: done(4), thresholds }),
    0,
  );
});

/* Completionist++, the fourth milestone: eighteen activity stickers,
   twenty in the book with the required two. Display-only like 2 and 3,
   behind the same address gate, and a payload that predates the key reads
   the default for it alone, so the API and this site deploy in any
   order. */
test('progressLevel is 3 from thirteen activities and 4 from eighteen, the defaults', () => {
  const level = (count, addressValidated = true) =>
    progressLevel({ addressValidated, activities: activitiesDone(count) });
  assert.equal(DEFAULT_THRESHOLDS.completionistPlusPlus, 18);
  assert.equal(level(13), 3);
  assert.equal(level(17), 3);
  assert.equal(level(18), 4);
  assert.equal(level(19), 4);
  /* No address, no milestone, however full the book. */
  assert.equal(level(18, false), 0);
});

test('progressLevel reaches 4 at the experience’s own completionistPlusPlus', () => {
  const thresholds = {
    stickers: 1,
    complete: 2,
    completionist: 3,
    completionistPlusPlus: 5,
  };
  assert.equal(
    progressLevel({
      addressValidated: true,
      activities: activitiesDone(4),
      thresholds,
    }),
    3,
  );
  assert.equal(
    progressLevel({
      addressValidated: true,
      activities: activitiesDone(5),
      thresholds,
    }),
    4,
  );
});

test('thresholdsOf reads completionistPlusPlus, and defaults it alone when a payload predates it', () => {
  assert.deepEqual(
    thresholdsOf({
      thresholds: {
        stickers: 1,
        complete: 8,
        completionist: 13,
        completionistPlusPlus: 20,
      },
    }),
    { stickers: 1, complete: 8, completionist: 13, completionistPlusPlus: 20 },
  );
  assert.equal(
    thresholdsOf({
      thresholds: { stickers: 1, complete: 8, completionist: 13 },
    }).completionistPlusPlus,
    18,
  );
  for (const unusable of [0, -1, 2.5, '18', null]) {
    assert.equal(
      thresholdsOf({
        thresholds: {
          stickers: 1,
          complete: 8,
          completionist: 13,
          completionistPlusPlus: unusable,
        },
      }).completionistPlusPlus,
      DEFAULT_THRESHOLDS.completionistPlusPlus,
      `${JSON.stringify(unusable)} is not a threshold`,
    );
  }
});

test('progressLevel reaches 2 at the experience’s own complete threshold', () => {
  const done = (n) =>
    ACTIVITIES.slice(0, n).map((a) => ({ id: a.id, completed: true }));
  assert.equal(
    progressLevel({
      addressValidated: true,
      activities: done(2),
      thresholds: { stickers: 1, complete: 2 },
    }),
    2,
  );
  assert.equal(
    progressLevel({
      addressValidated: true,
      activities: done(2),
      thresholds: { stickers: 1, complete: 3 },
    }),
    1,
  );
});

/* Secret stickers (lib/secretStickers.mjs), generically: an invented
   earned one and a placeholder. The API's completedCount counts an earned
   secret like any sticker and never a placeholder, and so does this. */
const SECRETS = [
  {
    id: 'demo-secret',
    secret: true,
    completed: true,
    completedAt: '2026-10-14T12:00:00.000Z',
    source: 'manual',
  },
  {
    id: 'secret-1',
    secret: true,
    hint: 'A demo hint',
    completed: false,
    completedAt: null,
    source: null,
  },
];

test('an entry flagged secret never marks a catalogue activity', () => {
  const merged = mergeActivities([
    { id: 'fest', secret: true, completed: true, completedAt: '2026-10-02' },
  ]);
  assert.equal(merged.find((a) => a.id === 'fest').completed, false);
  assert.equal(merged.length, ACTIVITIES.length);
});

test('countedCompletions is the earned activities and the earned secrets', () => {
  const activities = [{ id: 'fest', completed: true }];
  assert.equal(countedCompletions({ activities }), 1);
  assert.equal(countedCompletions({ activities, secrets: SECRETS }), 2);
  assert.equal(countedCompletions({ secrets: [SECRETS[1]] }), 0);
  assert.equal(countedCompletions(null), 0);
});

test('an earned secret counts toward the milestones, behind the same address gate', () => {
  const thresholds = { stickers: 1, complete: 2, completionist: 3 };
  const one = [{ id: 'fest', completed: true }];
  assert.equal(
    progressLevel({ addressValidated: true, activities: one, thresholds }),
    1,
  );
  assert.equal(
    progressLevel({
      addressValidated: true,
      activities: one,
      secrets: SECRETS,
      thresholds,
    }),
    2,
  );
  assert.equal(
    progressLevel({
      addressValidated: false,
      activities: one,
      secrets: SECRETS,
      thresholds,
    }),
    0,
  );
  /* An earned secret alone is a sticker in the book: the pack is earned. */
  assert.equal(
    isEligible({ addressValidated: true, activities: [], secrets: SECRETS }),
    true,
  );
  assert.equal(
    isEligible({
      addressValidated: true,
      activities: [],
      secrets: [SECRETS[1]],
    }),
    false,
  );
});
