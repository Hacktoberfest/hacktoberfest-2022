/* Country name -> ISO 3166-1 alpha-2 code, for the flag on each Fest card.
   The API sends countries as free-form names ("United States"), while the
   flag assets are keyed by code ("us") — and country-list's canonical
   names are the long ISO forms ("United States of America"), so a bare
   getCode() misses exactly the names people actually write. Resolution
   here is deliberately forgiving: an unrecognized country simply renders
   no flag, never a wrong one and never a crash. */
import { getData } from 'country-list';

/* Fold a name to a comparison key: case, accents ("Türkiye" ->
   "turkiye"), curly apostrophes ("Côte d’Ivoire"), dotted abbreviations
   ("U.S."), "St"/"Saint", and a leading "The" all stop mattering. */
const normalize = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/\./g, '')
    .replace(/\bst\b/g, 'saint')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^the /, '');

/* Everyday names country-list has no entry for. Bare "Korea" resolves
   south: that is overwhelmingly what an event listing means. */
const ALIASES = {
  usa: 'US',
  'united states': 'US',
  uk: 'GB',
  'united kingdom': 'GB',
  'great britain': 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  'northern ireland': 'GB',
  korea: 'KR',
  'south korea': 'KR',
  'republic of korea': 'KR',
  'north korea': 'KP',
  russia: 'RU',
  vietnam: 'VN',
  'czech republic': 'CZ',
  taiwan: 'TW',
  'ivory coast': 'CI',
  'cape verde': 'CV',
  palestine: 'PS',
  macedonia: 'MK',
  swaziland: 'SZ',
  'east timor': 'TL',
  burma: 'MM',
  macau: 'MO',
  vatican: 'VA',
  'vatican city': 'VA',
  'democratic republic of the congo': 'CD',
  'democratic republic of congo': 'CD',
  'dr congo': 'CD',
  drc: 'CD',
  'republic of the congo': 'CG',
  'republic of congo': 'CG',
  turkey: 'TR',
  laos: 'LA',
  syria: 'SY',
  brunei: 'BN',
  uae: 'AE',
};

const buildLookup = () => {
  const lookup = new Map();
  const codes = new Set();

  for (const { code, name } of getData()) {
    lookup.set(normalize(name), code);
    codes.add(code.toLowerCase());
  }

  /* ISO's comma forms ("Bolivia, Plurinational State of") are how most of
     the long names differ from what people write, so the part before the
     comma is registered too — but only when it is unambiguous. "Korea"
     and "Virgin Islands" each prefix two entries; those stay out and the
     alias table decides (or doesn't). */
  const ambiguous = new Set();
  for (const { code, name } of getData()) {
    const comma = name.indexOf(',');
    if (comma === -1) continue;
    const prefix = normalize(name.slice(0, comma));
    if (ambiguous.has(prefix)) continue;
    if (lookup.has(prefix) && lookup.get(prefix) !== code) {
      lookup.delete(prefix);
      ambiguous.add(prefix);
      continue;
    }
    lookup.set(prefix, code);
  }

  for (const [alias, code] of Object.entries(ALIASES)) {
    lookup.set(alias, code);
  }

  return { lookup, codes };
};

let cached = null;

/* Lowercase alpha-2 code (the flag asset key) for any recognizable
   country name, or null. A bare code ("US") passes through unchanged. */
export const countryCodeFor = (name) => {
  if (typeof name !== 'string' || name.trim() === '') return null;
  if (!cached) cached = buildLookup();

  const key = normalize(name);
  if (key.length === 2 && cached.codes.has(key)) return key;

  const code = cached.lookup.get(key);
  return code ? code.toLowerCase() : null;
};
