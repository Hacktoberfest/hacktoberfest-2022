/* Eligibility rules. Pure: no I/O, no React, no browser globals — which is
   what lets `node --test` cover the parts where bugs would actually hide.

   Relative import because Node resolves this file directly and never sees
   jsconfig's baseUrl alias. */
import { ACTIVITIES } from '../data/eligibility.mjs';
import { earnedSecretCount } from './secretStickers.mjs';

/* Folds the API's completion data onto the local catalogue.

   Mapping over ACTIVITIES rather than over the response is what makes the page
   resilient in both directions: an id the API invents is dropped, and an id it
   forgets degrades to "not done" instead of crashing the render. An entry
   flagged secret is never a catalogue activity, whatever its id: secrets
   are lib/secretStickers.mjs's, kept apart by lib/progress.mjs. */
export const mergeActivities = (activities) => {
  const entries = Array.isArray(activities) ? activities : [];
  const completion = new Map(
    entries
      .filter(
        (entry) =>
          entry && typeof entry.id === 'string' && entry.secret !== true,
      )
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

/* Every completion the milestones count: the catalogue's activities and
   the secret stickers earned (`secrets`, lib/secretStickers.mjs), as the
   API's own completedCount does, so a meter on /my never disagrees with
   the thresholds the API judges by. A placeholder is never counted. The
   two required stickers are not in it either; the address gates on its
   own, below. */
export const countedCompletions = (eligibility) =>
  completedCount(mergeActivities(eligibility && eligibility.activities)) +
  earnedSecretCount(eligibility && eligibility.secrets);

/* The stickers threshold below is 1 today, so `> 0` agrees with it; if it
   ever moves this must read `thresholdsOf(eligibility).stickers` instead. */
export const isEligible = (eligibility) => {
  if (!eligibility) return false;
  if (!eligibility.addressValidated) return false;
  return countedCompletions(eligibility) > 0;
};

/* The milestone counts, as the API serves them on GET /api/me/progress.
   A signed-out visitor cannot read the endpoint, so these defaults mirror
   the API's own; the numbers only matter once someone signs in. */
export const DEFAULT_THRESHOLDS = Object.freeze({
  stickers: 1,
  complete: 8,
  completionist: 13,
  completionistPlusPlus: 18,
});

const positiveInt = (value) => Number.isInteger(value) && value >= 1;

/* The experience's thresholds when it carries a usable pair, else the
   defaults. One reader, so the milestone math and the milestone cards can
   never disagree about where a milestone sits. The third number,
   completionist, is newer than the first two, and the fourth,
   completionistPlusPlus, newer still: a payload that carries the pair but
   not one of them reads the default for that one alone, so an API that
   has not shipped a key yet changes nothing here. */
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
      completionistPlusPlus: positiveInt(candidate.completionistPlusPlus)
        ? candidate.completionistPlusPlus
        : DEFAULT_THRESHOLDS.completionistPlusPlus,
    };
  }
  return DEFAULT_THRESHOLDS;
};

/* 0 = not eligible, 1 = stickers earned (isEligible), 2 = Hacktoberfest
   complete, 3 = Completionist, 4 = Completionist++. Milestones 2, 3 and 4
   are purely additional display tiers — they never change what triggers a
   sticker mailing, only what the rewards band shows past that point; 4
   has no item behind it at all. Same address gate as isEligible, so
   `progressLevel(x) >= 1` can never disagree with `isEligible(x)`. */
export const progressLevel = (eligibility) => {
  if (!eligibility) return 0;
  if (!eligibility.addressValidated) return 0;
  const done = countedCompletions(eligibility);
  const { stickers, complete, completionist, completionistPlusPlus } =
    thresholdsOf(eligibility);
  if (done >= completionistPlusPlus) return 4;
  if (done >= completionist) return 3;
  if (done >= complete) return 2;
  if (done >= stickers) return 1;
  return 0;
};
