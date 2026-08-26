/* Whether address line one names a place or is simply the street.

   MLH's first address line is both, depending on who filled the form in.
   "Flatiron Building" and "iHub" are places someone can picture, recognise
   or search for, and they earn their own line in bold above the rest of
   the address. "130 St George St" is the street — bolding it and then
   repeating the city underneath reads as a mistake, which is exactly what
   it looked like when the real data first went through this.

   The test is a house number: digits followed by a space. That is what an
   address opens with and what a name does not — with one nice exception
   the rule already handles, "91springboard", where the digits are part of
   the word rather than a number in front of it.

   A heuristic over a free-text field, so it is built to fail toward doing
   nothing: an unrecognised line simply stays in the address run, which is
   where it was before any of this. */
const STREET_NUMBER = /^\d+\s/;

export const venueNameFrom = (line) => {
  if (typeof line !== 'string') return null;

  const trimmed = line.trim();
  if (!trimmed || STREET_NUMBER.test(trimmed)) return null;

  return trimmed;
};
