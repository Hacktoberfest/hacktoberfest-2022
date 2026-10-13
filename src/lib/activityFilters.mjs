/* The pure half of the chips on /activities/. Chips derive from the
   catalogue as merged for the visitor (lib/eligibility.mjs mergeActivities
   output), so a type with no activities has no chip and a type that gains
   entries gains one without a code change. The page lists the cards
   grouped by type in the chips' order, and within a type in the
   catalogue's order, in every state.

   Relative import, matching every other file in lib/: Node resolves this
   file directly and never sees jsconfig's baseUrl alias. */

/* The Bonus category (2026-10-13): a page of secret stickers alone, from
   the Hacktoberfest team. The catalogue never holds one
   (test/activity-filters.test.mjs), so a sticker reaches it only as a
   secret: one whose category is Bonus, placed only once it is earned, or
   one revealed by a Bonus sticker the person already holds
   (lib/stickerBook.mjs placeSecrets). Either way nobody sees the page,
   its tab or its chip before they have a sticker in it. The word, the
   page's line and its colour are in this public code; what is in it
   never is. */
export const BONUS_TYPE = 'bonus';

/* The categories, in the order the sticker book and /activities/ show
   them (2026-09-10, Misc added 2026-09-25, Bonus 2026-10-13): DEV
   Challenges, Livestreams, Global Hack Week, Tools, Misc, In Person,
   Bonus. Required is the book's own page, not a type. Bonus comes last,
   so a page that only some people ever see never moves the others. */
export const TYPE_ORDER = Object.freeze([
  'dev',
  'livestreams',
  'ghw',
  'tools',
  'misc',
  'inperson',
  BONUS_TYPE,
]);

const list = (activities) => (Array.isArray(activities) ? activities : []);

export const earnedCount = (activities) =>
  list(activities).filter((activity) => activity.completed).length;

export const chipsFor = (activities, { signedIn = false } = {}) => {
  const all = list(activities);
  const chips = [{ key: 'all', count: all.length }];
  TYPE_ORDER.forEach((type) => {
    const count = all.filter((activity) => activity.type === type).length;
    if (count > 0) chips.push({ key: type, count });
  });
  if (signedIn) {
    chips.push({ key: 'todo', count: all.length - earnedCount(all) });
  }
  return chips;
};

/* A type the order does not know sorts after the known ones. The sort is
   stable, so the catalogue's order holds within a type. */
const rank = (activity) => {
  const index = TYPE_ORDER.indexOf(activity.type);
  return index === -1 ? TYPE_ORDER.length : index;
};

export const byType = (activities) =>
  [...list(activities)].sort((a, b) => rank(a) - rank(b));

export const filterActivities = (activities, key) => {
  const all = byType(activities);
  if (key === 'todo') return all.filter((activity) => !activity.completed);
  if (TYPE_ORDER.includes(key)) {
    return all.filter((activity) => activity.type === key);
  }
  return all;
};
