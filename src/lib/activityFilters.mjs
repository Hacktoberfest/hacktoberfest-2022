/* The pure half of the chips on /activities/. Chips derive from the
   catalogue as merged for the visitor (lib/eligibility.mjs mergeActivities
   output), so a type with no activities has no chip and a type that gains
   entries gains one without a code change. Filtering never reorders: the
   catalogue's order is the page's order in every state.

   Relative import, matching every other file in lib/: Node resolves this
   file directly and never sees jsconfig's baseUrl alias. */

/* The categories, in the order the sticker book and /activities/ show
   them (2026-09-10, Misc added 2026-09-25): DEV Challenges, Livestreams,
   Global Hack Week, Tools, Misc, In Person. Required is
   the book's own page, not a type. */
export const TYPE_ORDER = Object.freeze([
  'dev',
  'livestreams',
  'ghw',
  'tools',
  'misc',
  'inperson',
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

export const filterActivities = (activities, key) => {
  const all = list(activities);
  if (key === 'todo') return all.filter((activity) => !activity.completed);
  if (TYPE_ORDER.includes(key)) {
    return all.filter((activity) => activity.type === key);
  }
  return all;
};
