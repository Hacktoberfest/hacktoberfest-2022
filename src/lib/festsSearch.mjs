/* Plain substring filter — no external search or geocoding service.

   Matched against the same five fields the card prints, state and host
   included: a card reading "Bangalore, Karnataka, India" that finds nothing
   for "Karnataka", or one saying "Hosted by Hack the 6ix" that finds
   nothing for "Hack the 6ix", is the search quietly disagreeing with the
   list under it.

   Both sides are folded before comparing, so "Sao Paulo" finds "São Paulo"
   and "São Paulo" finds it back. An international directory cannot ask
   people to reproduce diacritics their keyboard may not carry, and it
   cannot punish the ones whose keyboard does. The fold is NFD decomposition
   with the combining marks dropped, which covers accented Latin (é, ã, ü,
   ñ) but deliberately not letters that carry no separate mark to remove: ø,
   ł, đ and ß decompose to themselves and still need an exact match. Worth
   revisiting the day a real Fest's name turns on one — a hand-written
   character map is the kind of thing that is never finished, so it is not
   started here on fixtures alone.

   `query` comes straight from a controlled text input, so it is always a
   string in the app, but it is coerced rather than trusted: this is also
   called from tests with deliberately odd input, and the previous `(query
   || '').trim()` threw on anything non-string that was also truthy. */
const fold = (value) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export const filterFests = (fests, query) => {
  const trimmed = fold(String(query ?? '').trim());
  if (!trimmed) return fests;

  return fests.filter((fest) =>
    [fest.name, fest.hostedBy, fest.city, fest.state, fest.country].some(
      (field) => typeof field === 'string' && fold(field).includes(trimmed),
    ),
  );
};
