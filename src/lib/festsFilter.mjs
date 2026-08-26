/* The format filter for /fests: All, Hack Days, or Meet Ups. Pure, so the
   two behaviours worth pinning — what "all" includes, and where a Fest
   with no format lands — live in tests rather than in the component.

   Applied AFTER search and BEFORE the past partition: the chips' counts
   describe the searched set, so they answer "of what my search found, how
   many are each kind" rather than quietly disagreeing with the list. */

export const FORMAT_FILTERS = ['all', 'hackDay', 'meetUp'];

/* Anything unrecognised is 'all' — this parses a URL parameter, and a
   mistyped link should land on the whole directory, not an empty one. */
export const normalizeFormatFilter = (raw) =>
  raw === 'hackDay' || raw === 'meetUp' ? raw : 'all';

/* 'all' keeps Fests whose name claims neither format; the two named
   filters are exact. That asymmetry is the point: an off-convention Fest
   must appear somewhere, and "all" is the only honest somewhere. */
export const filterByFormat = (fests, filter) =>
  filter === 'hackDay' || filter === 'meetUp'
    ? fests.filter((fest) => fest.format === filter)
    : fests;

export const formatCounts = (fests) => ({
  all: fests.length,
  hackDay: fests.filter((fest) => fest.format === 'hackDay').length,
  meetUp: fests.filter((fest) => fest.format === 'meetUp').length,
});
