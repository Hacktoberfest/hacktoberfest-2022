/* The homepage search's instant results: what the hero's list shows as
   someone types, before they ever reach /fests/.

   It agrees with the directory about what matches. The pool is
   lib/festsSearch filterFests, the same folded substring match over the
   same five fields the directory filters with, so "See all 12 results"
   is a promise /fests/?q= keeps. What this adds is only the order and the
   shortcuts the research asked for (Baymard and NN/g on autocomplete, the
   research round of 2026-09-28):

   - A query of one or two letters matches the start of a word only, so
     "in" is not every Fest with "in" somewhere in its host's name.
   - Places first: a city or country the query starts is offered as one
     row with its count, because "Toronto" is usually what someone means.
   - Fests whose words start with the query before ones that merely
     contain it, then nearest first once a location is known, soonest
     first otherwise, with past Fests last.

   Pure, like the rest of lib/: the component owns the query, the clock
   and the location, and hands them in. */
import { shortFestName } from './festName.mjs';
import { filterFests } from './festsSearch.mjs';
import { distanceKm } from './geo.mjs';

/* The directory's fold: NFD with the combining marks dropped, lowercased.
   Restated rather than imported because festsSearch keeps it private. */
export const foldText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const normalizeQuery = (value) => foldText(value).trim().replace(/\s+/g, ' ');

const isWordChar = (char) => /[\p{L}\p{N}]/u.test(char);

/* Whether `query` (already folded) begins a word somewhere in `text`. */
export const startsAWord = (text, query) => {
  if (!query) return false;
  const folded = foldText(text);
  let at = folded.indexOf(query);
  while (at !== -1) {
    if (at === 0 || !isWordChar(folded[at - 1])) return true;
    at = folded.indexOf(query, at + 1);
  }
  return false;
};

/* A Fest as one line: its short name (lib/festName, the directory card's
   heading) and its host, which is what tells two Toronto Fests apart. */
export const festTitle = (fest) => {
  const short = shortFestName(fest?.name) || fest?.name || '';
  return fest?.hostedBy ? `${short} x ${fest.hostedBy}` : short;
};

/* Where the query sits in `text`, as [start, end] in the ORIGINAL string,
   so the list can bold exactly the characters typed even when the text
   carries accents the query did not. Prefers an occurrence that starts a
   word. Null when there is no match. */
export const matchRange = (text, rawQuery) => {
  const query = normalizeQuery(rawQuery);
  if (typeof text !== 'string' || !query) return null;

  let folded = '';
  const origin = [];
  Array.from(text).forEach((char, index) => {
    const piece = foldText(char);
    for (let i = 0; i < piece.length; i += 1) origin.push(index);
    folded += piece;
  });
  const chars = Array.from(text);
  const offsets = [];
  let cursor = 0;
  chars.forEach((char) => {
    offsets.push(cursor);
    cursor += char.length;
  });

  let best = -1;
  let at = folded.indexOf(query);
  while (at !== -1) {
    if (best === -1) best = at;
    if (at === 0 || !isWordChar(folded[at - 1])) {
      best = at;
      break;
    }
    at = folded.indexOf(query, at + 1);
  }
  if (best === -1) return null;

  const first = origin[best];
  const last = origin[best + query.length - 1];
  return [offsets[first], offsets[last] + chars[last].length];
};

/* Cities and countries as places, each with its Fest count. A city is
   keyed with its country, since there is more than one Hyderabad. */
const placesOf = (fests) => {
  const cities = new Map();
  const countries = new Map();
  fests.forEach((fest) => {
    const city = typeof fest.city === 'string' ? fest.city.trim() : '';
    const country = typeof fest.country === 'string' ? fest.country : '';
    if (city) {
      const key = `${foldText(city)}|${foldText(country)}`;
      const entry = cities.get(key) || {
        kind: 'city',
        name: city,
        region:
          fest.state && foldText(fest.state) !== foldText(city)
            ? fest.state
            : null,
        country: country || null,
        count: 0,
      };
      entry.count += 1;
      cities.set(key, entry);
    }
    if (country) {
      const entry = countries.get(country) || {
        kind: 'country',
        name: country,
        count: 0,
      };
      entry.count += 1;
      countries.set(country, entry);
    }
  });
  return [...cities.values(), ...countries.values()];
};

const byCount = (a, b) => b.count - a.count || a.name.localeCompare(b.name);

const MAX_PLACES = 2;

/* Search. Null for an empty query, which is the list's own state (see
   focusSuggestions). Otherwise { places, fests, total }: `fests` in
   display order, `total` the directory's own count for the same query. */
export const searchFests = (
  fests,
  rawQuery,
  { origin = null, today = null } = {},
) => {
  const query = normalizeQuery(rawQuery);
  if (!query) return null;

  const list = Array.isArray(fests) ? fests.filter(Boolean) : [];
  const pool = filterFests(list, rawQuery.trim());
  const starts = (fest) =>
    [festTitle(fest), fest.city, fest.state, fest.country].some((field) =>
      startsAWord(field, query),
    );
  const shown = query.length < 3 ? pool.filter(starts) : pool;

  const places = placesOf(list)
    .filter((place) => startsAWord(place.name, query))
    .sort(byCount)
    .slice(0, MAX_PLACES);

  const distance = (fest) => (origin ? distanceKm(origin, fest) : null);
  const ranked = shown
    .map((fest) => ({
      fest,
      tier: starts(fest) ? 0 : 1,
      past: today && fest.date && fest.date < today ? 1 : 0,
      km: distance(fest),
    }))
    .sort(
      (a, b) =>
        a.tier - b.tier ||
        (origin ? (a.km ?? Infinity) - (b.km ?? Infinity) : 0) ||
        a.past - b.past ||
        String(a.fest.date || '9999').localeCompare(
          String(b.fest.date || '9999'),
        ) ||
        festTitle(a.fest).localeCompare(festTitle(b.fest)),
    );

  return {
    query,
    places,
    fests: ranked.map(({ fest, km }) => ({ fest, km })),
    total: pool.length,
  };
};

/* What the list offers before anything is typed: the countries with the
   most Fests. Not the visitor's own first: the only way to guess it
   without asking is their time zone, which spans too many countries to
   say where anyone is. "Use my location" above them is the way to ask. */
export const countrySuggestions = (fests, { count = 3 } = {}) => {
  const list = Array.isArray(fests) ? fests.filter(Boolean) : [];
  return placesOf(list)
    .filter((place) => place.kind === 'country')
    .sort(byCount)
    .slice(0, count);
};

/* The nearest upcoming Fests to a location the visitor chose to share. */
export const nearestFests = (
  fests,
  origin,
  { count = 5, today = null } = {},
) => {
  if (!origin || !Array.isArray(fests)) return [];
  return fests
    .filter(
      (fest) =>
        fest && typeof fest.lat === 'number' && typeof fest.lng === 'number',
    )
    .filter((fest) => !today || !fest.date || fest.date >= today)
    .map((fest) => ({ fest, km: distanceKm(origin, fest) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, count);
};
