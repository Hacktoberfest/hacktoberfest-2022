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

export const isEligible = (eligibility) => {
  if (!eligibility) return false;
  if (!eligibility.addressValidated) return false;
  return completedCount(mergeActivities(eligibility.activities)) > 0;
};

/* Milestone 2's threshold. The single number both progressLevel and the
   progress track UI read, so the two can never disagree on where the
   second milestone sits. */
export const MILESTONE_ACTIVITIES = 3;

/* 0 = not eligible, 1 = stickers earned (isEligible), 2 = Hacktoberfest
   complete. Milestone 2 is a purely additional display tier — it never
   changes what triggers a sticker mailing, only what a "Your progress."
   section shows past that point. Same address gate as isEligible, so
   `progressLevel(x) >= 1` can never disagree with `isEligible(x)`. */
export const progressLevel = (eligibility) => {
  if (!eligibility) return 0;
  if (!eligibility.addressValidated) return 0;
  const done = completedCount(mergeActivities(eligibility.activities));
  if (done >= MILESTONE_ACTIVITIES) return 2;
  if (done > 0) return 1;
  return 0;
};
