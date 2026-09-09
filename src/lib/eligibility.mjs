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
export const DEFAULT_THRESHOLDS = Object.freeze({ stickers: 1, complete: 3 });

const positiveInt = (value) => Number.isInteger(value) && value >= 1;

/* The experience's thresholds when it carries a usable pair, else the
   defaults. One reader, so the milestone math and the milestone card can
   never disagree about where the second milestone sits. */
export const thresholdsOf = (eligibility) => {
  const candidate = eligibility && eligibility.thresholds;
  if (
    candidate &&
    positiveInt(candidate.stickers) &&
    positiveInt(candidate.complete)
  ) {
    return { stickers: candidate.stickers, complete: candidate.complete };
  }
  return DEFAULT_THRESHOLDS;
};

/* 0 = not eligible, 1 = stickers earned (isEligible), 2 = Hacktoberfest
   complete. Milestone 2 is a purely additional display tier — it never
   changes what triggers a sticker mailing, only what a "Your progress."
   section shows past that point. Same address gate as isEligible, so
   `progressLevel(x) >= 1` can never disagree with `isEligible(x)`. */
export const progressLevel = (eligibility) => {
  if (!eligibility) return 0;
  if (!eligibility.addressValidated) return 0;
  const done = completedCount(mergeActivities(eligibility.activities));
  const { stickers, complete } = thresholdsOf(eligibility);
  if (done >= complete) return 2;
  if (done >= stickers) return 1;
  return 0;
};
