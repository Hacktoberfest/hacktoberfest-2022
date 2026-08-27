/* The data seam for /fests. Same single mock/live switch as
   lib/experience.mjs uses for /my: API_BASE_URL unset -> fixtures, set ->
   a live fetch of the API's public events snapshot. Unlike /my this call
   is unauthenticated — Fest listings are public, so there is no
   session/token plumbing here.

   The API speaks events ({events, count}, nested address, ISO startsAt);
   the cards, search, sorts and map all speak the flat Fest shape the
   fixtures established. festFromEvent is the whole translation, so the
   API's shape stops at this file. */
import { FESTS_FIXTURES } from '../data/festsFixtures.mjs';
import { festFormatFromName } from './festFormat.mjs';
import { splitFestName } from './festName.mjs';
import { regionName } from './regionName.mjs';
import { venueNameFrom } from './venueName.mjs';
import { API_BASE_URL } from './session.mjs';

/* The API sends the country as an ISO code, so a card left to print it raw
   reads "New York, New York, US". Intl over country-list's getName on
   purpose: getName('US') is the long ISO form, "United States of America",
   and nobody writes an address that way. `fallback: 'none'` makes an
   unknown code return undefined instead of the words "Unknown Region".

   Only a two-letter code is offered to it — a full name throws RangeError
   there — and anything it cannot resolve falls back to the raw value,
   which is what ships today. Widening this can degrade to the current
   behaviour but never to nothing. */
const REGION_NAMES = new Intl.DisplayNames(['en'], {
  type: 'region',
  fallback: 'none',
});

const countryName = (country) => {
  if (typeof country !== 'string') return null;
  if (!/^[a-z]{2}$/i.test(country)) return country;

  try {
    return REGION_NAMES.of(country.toUpperCase()) || country;
  } catch (_) {
    return country;
  }
};

/* A Fest's date is the date at its venue: an evening start in New York
   must not read as the next day just because UTC has rolled over. en-CA
   is the locale whose date format is YYYY-MM-DD — exactly what
   festDate.mjs validates. Missing/invalid timeZone falls back to UTC
   (deterministic, unlike the viewer's zone); missing/unparseable
   startsAt degrades to null, which the cards render dateless and the
   date sort places last. */
const venueDate = (startsAt, timeZone) => {
  if (typeof startsAt !== 'string') return null;

  const parsed = new Date(startsAt);
  if (Number.isNaN(parsed.getTime())) return null;

  const format = (zone) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(parsed);

  try {
    return format(timeZone || 'UTC');
  } catch (_) {
    // Intl throws on time zone names it does not know.
    return format('UTC');
  }
};

/* The card's time-of-day line, in the venue's zone for the same reason
   venueDate is. Built from formatToParts rather than format(): newer ICU
   puts a narrow no-break space before AM/PM, and joining the parts with a
   plain space keeps the string identical across Node and browser
   versions. endsAt is optional in the API, so a missing/unparseable end
   degrades to the start time alone. */
const venueTime = (startsAt, endsAt, timeZone) => {
  if (typeof startsAt !== 'string') return null;

  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return null;

  const format = (zone, value) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).formatToParts(value);
    const part = (type) =>
      (parts.find((entry) => entry.type === type) || {}).value || '';
    return `${part('hour')}:${part('minute')} ${part('dayPeriod')}`.trim();
  };

  const inVenueZone = (value) => {
    try {
      return format(timeZone || 'UTC', value);
    } catch (_) {
      // Intl throws on time zone names it does not know.
      return format('UTC', value);
    }
  };

  const end = typeof endsAt === 'string' ? new Date(endsAt) : null;
  const startTime = inVenueZone(start);

  return end && !Number.isNaN(end.getTime())
    ? `${startTime} – ${inVenueZone(end)}`
    : startTime;
};

/* One API event -> one Fest card. Every field degrades to null rather
   than throwing — FestCard, filterFests, both sorts and FestsMap already
   treat null fields as "absent". The slug fallback keeps a usable React
   key if MLH ever omits an id. */
export const festFromEvent = (event) => {
  const address = event.address || {};
  /* MLH welds the hosting partner onto the event name — "Hacktoberfest
     Meet Up Toronto x Hack the 6ix" — so the two come apart here rather
     than in the card. See lib/festName.mjs. */
  const { title, hostedBy } = splitFestName(event.name);

  return {
    id: event.id || event.slug || null,
    name: title,
    hostedBy,
    /* Derived from the name, not read from event.format — see
       lib/festFormat.mjs for why that field cannot answer this. Read from
       the title rather than the whole name, so a partner called "Hack Day
       something" cannot claim a format that is not the Fest's. */
    format: festFormatFromName(title),
    city: address.city || null,
    /* Spelled out. MLH sends "ON" for one Toronto Fest and "Ontario" for
       another, so without this the same province reads two ways in one
       list. See lib/regionName.mjs. */
    state: regionName(address.state),
    country: countryName(address.country) || null,
    /* line1 when it names a place rather than a street, so the modal can
       set it apart from the rest of the address. Null when it is simply
       the street, which the live data has plenty of — see
       lib/venueName.mjs. */
    venue: venueNameFrom(address.line1),

    /* The street half of the address. Only the modal renders these: the
       card has room for a city and the modal is where "which building"
       belongs. */
    addressLine1: address.line1 || null,
    addressLine2: address.line2 || null,
    addressLine3: address.line3 || null,
    postalCode: address.postalCode || null,
    lat: typeof address.latitude === 'number' ? address.latitude : null,
    lng: typeof address.longitude === 'number' ? address.longitude : null,
    /* The host's own description, written in Organizer HQ and mirrored
       through the API. Null until they write one, which is most Fests: the
       modal falls back to the standard per-format blurb. Whitespace is not
       a description. Host-authored free text - the modal renders it as
       text, never as HTML. */
    description:
      typeof event.description === 'string' && event.description.trim()
        ? event.description.trim()
        : null,
    date: venueDate(event.startsAt, event.timeZone),
    time: venueTime(event.startsAt, event.endsAt, event.timeZone),
    registrationUrl: event.registrationUrl || null,
    /* The Fest's own page, distinct from its registration form. A Fest
       with no registration link still has somewhere to send people. */
    websiteUrl: event.websiteUrl || null,
    logoUrl: event.logoUrl || null,
  };
};

export const getFestsDirectory = async () => {
  if (!API_BASE_URL) return FESTS_FIXTURES;

  const response = await fetch(`${API_BASE_URL}/api/events`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const payload = await response.json();
  /* The same deploy-order stance as experience.mjs: a payload without an
     events array (older API, or garbage) degrades to the empty state
     rather than a crash. */
  const events = payload && Array.isArray(payload.events) ? payload.events : [];

  return events
    .filter((event) => event !== null && typeof event === 'object')
    .map(festFromEvent);
};
