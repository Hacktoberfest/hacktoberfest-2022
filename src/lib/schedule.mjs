/* The data seam for /schedule, built the same way lib/festsDirectory.mjs is:
   API_BASE_URL unset means the mocked build and returns fixtures, set means a
   live fetch. Unauthenticated, because the schedule is public — no session or
   token plumbing, same as the Fests directory.

   The API's shape stops in this file. Everything downstream — the calendar
   grid, the list, the modal — speaks the flat event below, so a change to the
   payload is a change to scheduleEventFrom and nothing else.

   The endpoint is GET /api/schedule on hacktoberfest-2026-api, which serves
   rows authored in FestNet. It carries no check-in codes: those are minted
   per event and read out on stream, and a code on a public payload is a code
   anyone can redeem without attending.

   The route itself is closed while the page is still being worked on — see
   data/closedRoutes.mjs. That is about the page, not this seam: the endpoint
   is live, and the mocked build (API_BASE_URL unset) reads the fixtures, so
   both halves can be exercised while the route stays shut. */
import { SCHEDULE_FIXTURES } from '../data/scheduleFixtures.mjs';
import { API_BASE_URL } from './session.mjs';

/* These events are online, so unlike a Fest there is no venue whose zone
   settles which day they fall on. The reader's own zone is the only honest
   answer, and it is available because this page fetches client-side.

   Resolved once per call rather than per event, and passed in explicitly
   everywhere below so the tests never have to mock a clock or a locale. */
export const viewerTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (_) {
    return 'UTC';
  }
};

/* An ISO timestamp -> the 'YYYY-MM-DD' it falls on in `timeZone`. en-CA is the
   locale whose date format is exactly that, the same trick festsDirectory.mjs
   uses to read a venue date out of a timestamp. An unknown zone degrades to
   UTC (deterministic) rather than to the machine's zone. */
const dateIn = (isoTimestamp, timeZone) => {
  const parsed = new Date(isoTimestamp);
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

/* The calendar date an all-day event declares, taken off the front of its own
   timestamp rather than computed. No zone gets a vote, which is the point: an
   all-day event is on the same date wherever you are reading from. */
const calendarDate = (isoTimestamp) => {
  const date = String(isoTimestamp).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
};

const text = (value) =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/* The structural kinds the agenda understands. Kept beside the normaliser
   rather than imported from scheduleAgenda.mjs so the API's shape is described
   in exactly one place — this file — and the agenda depends on the flat event,
   not the other way round. */
const KINDS = new Set(['feature', 'round', 'session']);

/* What a logo IS, which is what decides where it goes:

     sponsor  somebody backing the event. Sits to the right, beside the time,
              where a credit belongs.
     name     the event's own name as artwork. Replaces the title text, because
              printing the name beside a picture of the name says it twice.

   Declared rather than inferred: the same wide graphic could be either, and
   only whoever uploaded it knows which. */
const LOGO_KINDS = new Set(['sponsor', 'name']);

/* One payload event -> the flat shape the page speaks, or null if it cannot be
   rendered honestly.

   Dropping is deliberate and narrow: an event with no id could not be keyed in
   a list or matched to an open modal, and one with no usable start could not be
   placed on any day. Both would be silently broken on the page. Everything
   else degrades instead — a missing end makes the event single-day, a missing
   description or logo simply renders without one. */
export const scheduleEventFrom = (event, timeZone) => {
  if (!event || typeof event !== 'object' || Array.isArray(event)) return null;

  const id = text(event.id);
  if (!id) return null;

  /* An all-day event has no time of day, so its date is a calendar date rather
     than an instant, and putting it through a zone conversion is simply wrong.
     The API sends midnight UTC; for any reader west of UTC that resolves to the
     previous evening, which moved every DEV challenge round onto the Sunday
     before it actually opened. So an all-day date is read off the timestamp,
     and only a timed event follows the reader's zone. */
  const allDay = event.allDay === true;
  const dateOf = (value) =>
    allDay ? calendarDate(value) : dateIn(value, timeZone);

  const startDate = text(event.startsAt) && dateOf(event.startsAt);
  if (!startDate) return null;

  /* An end before its start is data we cannot draw — a bar with negative width
     — so it degrades to the single-day case rather than being dropped: the
     event is real, only its end is wrong. */
  const rawEnd = text(event.endsAt) && dateOf(event.endsAt);
  const endDate = rawEnd && rawEnd >= startDate ? rawEnd : startDate;

  return {
    id,
    name: text(event.name) || 'Untitled event',
    description: text(event.description),
    type: text(event.type),
    /* Structural, unlike `type` which is only a colour and a label: `kind`
       decides what nests inside what in the agenda. It has to be declared by
       the API rather than inferred from duration — Global Hack Week and a
       challenge round are both seven days long, and only one of them is a
       container. An unrecognised value degrades to a session, which renders
       plainly rather than disappearing. */
    kind: KINDS.has(event.kind) ? event.kind : 'session',
    host: text(event.host),
    logoUrl: text(event.logoUrl),
    /* Defaults to `sponsor`, which is the safe half: a credit in the wrong
       place is untidy, where a `name` logo that turned out not to contain the
       name would leave the event unnamed on the page. */
    logoKind: LOGO_KINDS.has(event.logoKind) ? event.logoKind : 'sponsor',
    url: text(event.url),
    startsAt: text(event.startsAt),
    endsAt: text(event.endsAt),
    allDay,
    startDate,
    endDate,
    multiDay: endDate > startDate,
  };
};

/* Built from formatToParts rather than format(): newer ICU inserts a narrow
   no-break space before AM/PM, and joining the parts by hand keeps the string
   identical across Node and browser versions. lib/festsDirectory.mjs carries
   the same fix for the same reason. */
const clockTime = (date, timeZone) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .formatToParts(date)
    .map((part) =>
      part.type === 'literal' && /\s/.test(part.value) ? ' ' : part.value,
    )
    .join('')
    .trim();

const shortDate = (date, timeZone) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'short',
    day: 'numeric',
  }).format(date);

/* The zone's own short name ("BST", "EDT", "GMT+5:30"), pulled out of a
   formatted string rather than assumed, so it is right wherever the reader is
   and right on both sides of a daylight-saving change. */
const zoneLabel = (date, timeZone) => {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'short',
  })
    .formatToParts(date)
    .find((piece) => piece.type === 'timeZoneName');

  return part ? part.value : null;
};

/* The time line under an event's name, in the reader's zone.

   Labelled with the zone by default, so a detail surface (the modal) stays
   legible on its own. The agenda rows pass withZone: false — they sit under a
   toolbar that already names the zone, and nine repeated "EDT"s were a
   stutter, not information.

   Returns null for an all-day event: there is no time of day to print, and
   "12:00 AM" would be a worse answer than nothing. A multi-day timed event
   names both dates, because "2:00 PM – 10:00 PM" across a week would read as
   a single evening. */
export const formatTimeRange = (event, timeZone, { withZone = true } = {}) => {
  if (!event || event.allDay || !event.startsAt) return null;

  const start = new Date(event.startsAt);
  if (Number.isNaN(start.getTime())) return null;

  const zone = withZone ? zoneLabel(start, timeZone) : null;
  const suffix = zone ? ` ${zone}` : '';

  const end = event.endsAt ? new Date(event.endsAt) : null;
  const hasEnd = end && !Number.isNaN(end.getTime()) && end > start;

  if (!hasEnd) {
    return `${clockTime(start, timeZone)}${suffix}`;
  }

  if (event.multiDay) {
    return `${shortDate(start, timeZone)}, ${clockTime(start, timeZone)} – ${shortDate(
      end,
      timeZone,
    )}, ${clockTime(end, timeZone)}${suffix}`;
  }

  return `${clockTime(start, timeZone)} – ${clockTime(end, timeZone)}${suffix}`;
};

/* Labels for the zone-resolved 'YYYY-MM-DD' dates the stream runs on. Read
   through Date.UTC and the getUTC accessors rather than by parsing locally,
   so no machine's zone can shift a label onto the wrong weekday — the same
   discipline the tiles use, and they must agree with the tiles. */
const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const dateParts = (isoDate) => {
  if (typeof isoDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return null;
  }

  const year = Number(isoDate.slice(0, 4));
  const month = Number(isoDate.slice(5, 7));
  const day = Number(isoDate.slice(8, 10));
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return { day, month, weekday };
};

/* 'Mon 5 Oct'. */
export const formatDay = (isoDate) => {
  const parts = dateParts(isoDate);
  if (!parts) return '';

  return `${WEEKDAY_NAMES[parts.weekday].slice(0, 3)} ${parts.day} ${MONTH_SHORT[parts.month - 1]}`;
};

/* 'Monday' — for copy that speaks a day rather than abbreviating it. */
export const weekdayName = (isoDate) => {
  const parts = dateParts(isoDate);
  return parts ? WEEKDAY_NAMES[parts.weekday] : '';
};

/* One end of a window as a clock time in the reader's zone. The rail ledger
   needs the endpoints separately, which formatTimeRange — a range — cannot
   give it. No zone suffix, for the same reason the rows dropped theirs: the
   ledger sits under the toolbar that names the zone. */
export const formatClock = (iso, timeZone) => {
  if (typeof iso !== 'string' || !iso) return null;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  return clockTime(date, timeZone);
};

/* Where a submission window stands relative to a calendar day: upcoming, open
   or closed. Date-granular on purpose — the kicker flips at midnight in the
   SHOWN zone, the same clock the stream's past-collapse runs on, so the two
   can never disagree about whether a round is over. Anything this cannot
   judge reads as open, which is what the card said before it learned to
   tell the truth. */
export const roundState = (event, today) => {
  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
  const isDate = (value) => typeof value === 'string' && ISO_DATE.test(value);

  if (!event || typeof event !== 'object' || !isDate(today)) return 'open';
  if (!isDate(event.startDate) || !isDate(event.endDate)) return 'open';

  if (today < event.startDate) return 'upcoming';
  if (today > event.endDate) return 'closed';
  return 'open';
};

/* Whether a stream's window is open at this instant. No zone in the
   signature, alone among this file's helpers: an instant is a fact about the
   world, not the reader — 3pm in Toronto and 8pm in London are one moment,
   and a stream is on air or it is not. `now` is epoch milliseconds, always
   passed in by the caller; components own the clock so this stays pure.

   An all-day thing is never "on air" — a submission window is open, not
   broadcasting — and an event with no end never lights up, because a chip
   that switched on at start and could never switch off would be lying by the
   evening. */
export const isOnAir = (event, now) => {
  if (!event || typeof event !== 'object' || event.allDay) return false;
  if (!event.startsAt || !event.endsAt) return false;

  const start = Date.parse(event.startsAt);
  const end = Date.parse(event.endsAt);
  if (Number.isNaN(start) || Number.isNaN(end)) return false;

  return start <= now && now < end;
};

/* The translation getSchedule applies, split out and given the zone as an
   argument, because the page lets the reader change zones and a zone change
   is not a formatting change: an evening event moves to a different DAY in a
   different zone, so the raw events have to be run through the normaliser
   again, not merely re-printed. The component holds the raw payload and calls
   this on each switch; nothing is re-fetched. */
export const normalizeSchedule = (events, timeZone) =>
  (Array.isArray(events) ? events : [])
    .map((event) => scheduleEventFrom(event, timeZone))
    .filter(Boolean);

/* The raw payload events, exactly as the API (or the fixtures) shaped them —
   what the component keeps so a zone switch can re-normalise without another
   request. */
export const getScheduleRaw = async () => {
  if (!API_BASE_URL) return SCHEDULE_FIXTURES;

  const response = await fetch(`${API_BASE_URL}/api/schedule`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const payload = await response.json();
  /* The same deploy-order stance the other clients take: a payload without an
     events array (an older API, or garbage) degrades to the empty state rather
     than a crash. */
  return payload && Array.isArray(payload.events) ? payload.events : [];
};

export const getSchedule = async () =>
  normalizeSchedule(await getScheduleRaw(), viewerTimeZone());

/* The zone picker's type-ahead. IANA names are what get matched and nobody
   types them verbatim — they carry underscores no one writes, slashes no one
   thinks of, and casing no one remembers — so both sides are normalised to
   lowercase with underscores as spaces before comparing.

   Two ranks: a query that starts the name or one of its segments comes first,
   a query found mid-string second. Someone typing "tor" means Toronto, not
   whatever happens to contain those letters. */
export const filterZones = (zones, query) => {
  const list = Array.isArray(zones) ? zones : [];
  const q =
    typeof query === 'string'
      ? query.trim().toLowerCase().replace(/_/g, ' ')
      : '';

  if (!q) return list;

  const starts = [];
  const contains = [];

  list.forEach((zone) => {
    const name = zone.toLowerCase().replace(/_/g, ' ');

    if (name.startsWith(q) || name.split('/').some((s) => s.startsWith(q))) {
      starts.push(zone);
    } else if (name.includes(q)) {
      contains.push(zone);
    }
  });

  return [...starts, ...contains];
};

/* Today's calendar date in a given zone, for deciding what has already
   happened. Judged in the zone the schedule is SHOWN in, not the machine's: a
   reader in Toronto viewing Sydney time is a day ahead of their own clock, and
   mixing the two zones would collapse events the page still shows as current,
   or hold ones it shows as over. `now` is an argument so tests never mock a
   clock. */
export const todayInZone = (timeZone, now = new Date()) =>
  dateIn(now.toISOString(), timeZone);
