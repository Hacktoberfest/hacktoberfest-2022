/* Eligibility rules. Pure: no I/O, no React, no browser globals — which is
   what lets `node --test` cover the parts where bugs would actually hide.

   Relative import because Node resolves this file directly and never sees
   jsconfig's baseUrl alias. */
import { ACTIVITIES } from '../data/eligibility.mjs';

/* Folds the API's completion data onto the local catalogue.

   Mapping over ACTIVITIES rather than over the response is what makes the page
   resilient in both directions: an id the API invents is dropped, and an id it
   forgets degrades to "not done" instead of crashing the render. */
export const mergeActivities = (activities) => {
  const entries = Array.isArray(activities) ? activities : [];
  const completion = new Map(
    entries
      .filter((entry) => entry && typeof entry.id === 'string')
      .map((entry) => [entry.id, entry]),
  );

  return ACTIVITIES.map((activity) => {
    const entry = completion.get(activity.id);
    return {
      ...activity,
      completed: Boolean(entry && entry.completed),
      completedAt: (entry && entry.completedAt) || null,
    };
  });
};

export const completedCount = (merged) =>
  (Array.isArray(merged) ? merged : []).filter((activity) => activity.completed)
    .length;

/* The stickers threshold below is 1 today, so `> 0` agrees with it; if it
   ever moves this must read `thresholdsOf(eligibility).stickers` instead. */
export const isEligible = (eligibility) => {
  if (!eligibility) return false;
  if (!eligibility.addressValidated) return false;
  return completedCount(mergeActivities(eligibility.activities)) > 0;
};

/* The two milestone counts, as the API serves them on GET /api/me/progress.
   A signed-out visitor cannot read the endpoint, so these defaults mirror
   the API's own; the numbers only matter once someone signs in. */
export const DEFAULT_THRESHOLDS = Object.freeze({
  stickers: 1,
  complete: 8,
  completionist: 15,
});

const positiveInt = (value) => Number.isInteger(value) && value >= 1;

/* The experience's thresholds when it carries a usable pair, else the
   defaults. One reader, so the milestone math and the milestone cards can
   never disagree about where a milestone sits. The third number,
   completionist, is newer than the first two: a payload that carries the
   pair but not it reads the default for it alone. */
export const thresholdsOf = (eligibility) => {
  const candidate = eligibility && eligibility.thresholds;
  if (
    candidate &&
    positiveInt(candidate.stickers) &&
    positiveInt(candidate.complete)
  ) {
    return {
      stickers: candidate.stickers,
      complete: candidate.complete,
      completionist: positiveInt(candidate.completionist)
        ? candidate.completionist
        : DEFAULT_THRESHOLDS.completionist,
    };
  }
  return DEFAULT_THRESHOLDS;
};

/* 0 = not eligible, 1 = stickers earned (isEligible), 2 = Hacktoberfest
   complete, 3 = Completionist. Milestones 2 and 3 are purely additional
   display tiers — they never change what triggers a sticker mailing, only
   what the rewards band shows past that point. Same address gate as
   isEligible, so `progressLevel(x) >= 1` can never disagree with
   `isEligible(x)`. */
export const progressLevel = (eligibility) => {
  if (!eligibility) return 0;
  if (!eligibility.addressValidated) return 0;
  const done = completedCount(mergeActivities(eligibility.activities));
  const { stickers, complete, completionist } = thresholdsOf(eligibility);
  if (done >= completionist) return 3;
  if (done >= complete) return 2;
  if (done >= stickers) return 1;
  return 0;
};
