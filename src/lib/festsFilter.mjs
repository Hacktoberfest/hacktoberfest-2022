/* The format filter for /fests: All, Hack Days, Meetups, MLH Member Events
   or Pop-Ups. Pure, so the behaviours worth pinning — what "all" includes,
   and where a Fest with no format lands — live in tests rather than in the
   component.

   Applied AFTER search and BEFORE the past partition: the chips' counts
   describe the searched set, so they answer "of what my search found, how
   many are each kind" rather than quietly disagreeing with the list. */

export const FORMAT_FILTERS = [
  'all',
  'hackDay',
  'meetUp',
  'mlhMemberEvent',
  'popup',
];

/* The four named formats. One list, so the functions below cannot drift
   on which values are real. */
const NAMED = new Set(['hackDay', 'meetUp', 'mlhMemberEvent', 'popup']);

/* Anything unrecognised is 'all' — this parses a URL parameter, and a
   mistyped link should land on the whole directory, not an empty one. */
export const normalizeFormatFilter = (raw) => (NAMED.has(raw) ? raw : 'all');

/* 'all' keeps Fests whose name claims neither format; the named filters
   are exact. That asymmetry is the point: an off-convention Fest must
   appear somewhere, and "all" is the only honest somewhere. */
export const filterByFormat = (fests, filter) =>
  NAMED.has(filter) ? fests.filter((fest) => fest.format === filter) : fests;

export const formatCounts = (fests) =>
  Object.fromEntries(
    FORMAT_FILTERS.map((filter) => [
      filter,
      filter === 'all'
        ? fests.length
        : fests.filter((fest) => fest.format === filter).length,
    ]),
  );
