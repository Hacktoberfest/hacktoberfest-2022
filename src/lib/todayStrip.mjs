/* The Today strip's decisions: which day of October it is, what is on,
   and in what words. components/TodayStrip owns the clock, the fetches
   and the rotation; everything that JUDGES lives here, as plain functions
   of the moment and the zone they are given, the same stance
   lib/schedule.mjs takes. Nothing in this file reads the clock, so the
   tests pin an instant instead of mocking one.

   Relative imports and no JSX: Node's test runner reads this. */
import { todayStrip as copy } from '../data/content.mjs';
import { HACKTOBERFEST_START } from '../data/preptember.mjs';
import {
  formatClock,
  formatDay,
  isOnAir,
  roundState,
  todayInZone,
  weekdayName,
  zoneLabel,
} from './schedule.mjs';
import { API_BASE_URL } from './session.mjs';
import { MOCKED_SENTINEL } from './apiBase.mjs';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/* The strip counts the month out ("Day 6 of 31"), and October has 31. */
export const OCTOBER_DAYS = 31;

/* How far ahead a feature is announced. Global Hack Week is a week of its
   own, worth a fortnight's notice; a month's would crowd out today. */
const FEATURE_LEAD_DAYS = 14;

/* How many of a day's Fest cities the summary keeps. Three is as many as
   one line of the strip can say before it is a list rather than a line. */
const MAX_CITIES = 3;

/* Where each kind of item sends people when the event has no link of its
   own. */
const SCHEDULE_HREF = '/schedule/';
const ACTIVITIES_HREF = '/activities/';
const FESTS_HREF = '/fests/';
const STICKER_BOOK_HREF = '/my/';

/* The one item that needs no data, so it is also the one the server
   renders: always true, always last, and what the strip falls back to
   when every fetch has failed. */
export const STICKER_BOOK_ITEM = Object.freeze({
  id: 'sticker-book',
  kicker: copy.stickerBook.kicker,
  text: copy.stickerBook.text,
  href: STICKER_BOOK_HREF,
  cta: copy.stickerBook.cta,
  external: false,
});

const epoch = (now) => (now instanceof Date ? now.getTime() : Number(now));

const instant = (iso) => {
  if (typeof iso !== 'string') return null;
  const parsed = Date.parse(iso);
  return Number.isNaN(parsed) ? null : parsed;
};

/* The reader's own calendar date, from the local clock's fields. Local on
   purpose, the same stance as HACKTOBERFEST_START: October starts at
   midnight wherever the reader is, not at one UTC instant. */
export const localDate = (now) => {
  const date = new Date(epoch(now));
  if (Number.isNaN(date.getTime())) return null;

  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/* 1 to 31 on the days the strip should show, null on every other day,
   which is what takes the strip away before October and after it. */
export const octoberDay = (now) => {
  const date = new Date(epoch(now));
  if (Number.isNaN(date.getTime())) return null;
  if (date.getFullYear() !== HACKTOBERFEST_START.getFullYear()) return null;
  if (date.getMonth() !== HACKTOBERFEST_START.getMonth()) return null;
  return date.getDate();
};

/* Whole days from one 'YYYY-MM-DD' to another, read through Date.UTC so
   no zone or daylight-saving change can make a day 23 hours long. */
const daysBetween = (from, to) => {
  const utc = (iso) =>
    Date.UTC(
      Number(iso.slice(0, 4)),
      Number(iso.slice(5, 7)) - 1,
      Number(iso.slice(8, 10)),
    );
  return Math.round((utc(to) - utc(from)) / DAY_MS);
};

/* Where a window stands right now: 'upcoming', 'open' or 'closed'.

   Two kinds of window arrive. The fixtures' DEV rounds are all-day, and
   an all-day window is a run of calendar dates, so it is judged by date
   exactly as /schedule/ judges it (roundState). The live API's rounds are
   timed instead (midnight to midnight Pacific, 07:00Z to 06:59Z), and a
   timed window closes at an instant: judging it by date would hold a
   round open for the rest of the evening after it had shut. A timed
   event with no usable end falls back to the date rule. */
const windowState = (event, at, today) => {
  if (!event.allDay) {
    const start = instant(event.startsAt);
    const end = instant(event.endsAt);
    if (start !== null && end !== null && end > start) {
      if (at < start) return 'upcoming';
      return at < end ? 'open' : 'closed';
    }
  }
  return roundState(event, today);
};

const byStart = (a, b) => {
  const first = instant(a.startsAt);
  const second = instant(b.startsAt);
  if (first !== null && second !== null && first !== second) {
    return first - second;
  }
  return a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0;
};

/* On air beats later today beats the next one on the calendar: the
   nearest thing a reader could actually go and watch. Only an on-air
   stream links out, because only then is the stream the place to be;
   before it starts, the schedule is where its details are. */
const livestreamItem = (events, at, timeZone, today) => {
  const streams = events
    .filter(
      (event) =>
        event.type === 'livestream' &&
        !event.allDay &&
        instant(event.startsAt) !== null,
    )
    .sort(byStart);

  const live = streams.find((event) => isOnAir(event, at));
  if (live) {
    return {
      id: 'livestream',
      kicker: copy.livestream.onAir,
      text: live.name,
      href: live.url || SCHEDULE_HREF,
      cta: live.url ? copy.livestream.watch : copy.livestream.schedule,
      external: Boolean(live.url),
    };
  }

  const next = streams.find((event) => instant(event.startsAt) > at);
  if (!next) return null;

  const clock = formatClock(next.startsAt, timeZone);
  const laterToday = next.startDate === today;

  return {
    id: 'livestream',
    kicker: laterToday ? copy.livestream.laterToday : copy.livestream.upcoming,
    text: laterToday
      ? copy.livestream.today(
          clock,
          zoneLabel(new Date(next.startsAt), timeZone),
          next.name,
        )
      : copy.livestream.next(formatDay(next.startDate), clock, next.name),
    href: SCHEDULE_HREF,
    cta: copy.livestream.schedule,
    external: false,
  };
};

/* When a round's submissions close, in the fewest words that are still
   true. Hours only in a timed round's last day, where the instant is
   known and the count is what matters; floored, so the strip can only
   ever understate the time left, never promise an hour that is not
   there. After that the day, named the way a person would say it. */
const closesWhen = (round, at, today) => {
  const end = round.allDay ? null : instant(round.endsAt);
  if (end !== null) {
    const left = end - at;
    if (left < HOUR_MS) return copy.challenge.withinHour;
    if (left < DAY_MS)
      return copy.challenge.inHours(Math.floor(left / HOUR_MS));
  }

  const days = daysBetween(today, round.endDate);
  if (days <= 0) return copy.challenge.today;
  if (days === 1) return copy.challenge.tomorrow;
  if (days <= 6) return weekdayName(round.endDate);
  return formatDay(round.endDate);
};

/* The round that is open now, or failing that the next to open. After
   the last round closes there is nothing to say, and the item is
   skipped. */
const challengeItem = (events, at, today) => {
  const rounds = events
    .filter((event) => event.type === 'challenge')
    .sort(byStart);

  const open = rounds.find((round) => windowState(round, at, today) === 'open');
  const round =
    open ||
    rounds.find((entry) => windowState(entry, at, today) === 'upcoming');
  if (!round) return null;

  return {
    id: 'challenge',
    kicker: copy.challenge.kicker,
    text: open
      ? copy.challenge.closes(round.name, closesWhen(round, at, today))
      : copy.challenge.opens(round.name, formatDay(round.startDate)),
    href: round.url || ACTIVITIES_HREF,
    cta: round.url ? copy.challenge.enter : copy.challenge.activities,
    external: Boolean(round.url),
  };
};

/* The month's headliners (kind 'feature': Global Hack Week). Running now,
   or starting within the fortnight; one item each, though October has
   only the one. Their sessions are on the schedule, which is where these
   send people. */
const featureItems = (events, at, today) =>
  events
    .filter((event) => event.kind === 'feature')
    .sort(byStart)
    .map((feature) => {
      const state = windowState(feature, at, today);
      const upcoming =
        state === 'upcoming' &&
        daysBetween(today, feature.startDate) <= FEATURE_LEAD_DAYS;
      if (state !== 'open' && !upcoming) return null;

      return {
        id: `feature-${feature.id}`,
        kicker: upcoming ? copy.feature.upcoming : copy.feature.current,
        text: upcoming
          ? copy.feature.starts(feature.name, formatDay(feature.startDate))
          : copy.feature.until(feature.name, formatDay(feature.endDate)),
        href: SCHEDULE_HREF,
        cta: copy.feature.cta,
        external: false,
      };
    })
    .filter(Boolean);

const festDay = (festDays, date) => {
  const day = festDays[date];
  return day && typeof day === 'object' && day.count > 0 ? day : null;
};

/* Today's Fests, or the next day that has any. A Fest's date is the date
   at its venue, which is the only date it has; set against the reader's
   today it is right for everyone near enough to go, which is everyone
   the item is for. */
const festsItem = (festDays, today) => {
  const days = festDays && typeof festDays === 'object' ? festDays : {};
  const cities = (day) => (Array.isArray(day.cities) ? day.cities : []);

  const todays = festDay(days, today);
  if (todays) {
    return {
      id: 'fests',
      kicker: copy.fests.kicker,
      text: copy.fests.today(todays.count, cities(todays), todays.more),
      href: FESTS_HREF,
      cta: copy.fests.cta,
      external: false,
    };
  }

  const nextDate = Object.keys(days)
    .filter((date) => ISO_DATE.test(date) && date > today)
    .filter((date) => festDay(days, date))
    .sort()[0];
  if (!nextDate) return null;

  const next = days[nextDate];
  return {
    id: 'fests',
    kicker: copy.fests.kicker,
    text: copy.fests.on(
      next.count,
      formatDay(nextDate),
      cities(next),
      next.more,
    ),
    href: FESTS_HREF,
    cta: copy.fests.cta,
    external: false,
  };
};

/* Everything the strip will say, in the order it says it: `events` are
   normalised schedule events (lib/schedule.mjs normalizeSchedule, in the
   same `timeZone`), `festDays` is festSummary's output, `now` is epoch
   milliseconds or a Date. An item whose data is missing is left out
   rather than shown empty, so a failed fetch costs its own item and
   nothing else; the sticker book is always there to fall back on. */
export const todayStripItems = ({ events, festDays, now, timeZone } = {}) => {
  const at = epoch(now);
  if (!Number.isFinite(at)) return [STICKER_BOOK_ITEM];

  const zone = timeZone || 'UTC';
  const today = todayInZone(zone, new Date(at));
  const list = (Array.isArray(events) ? events : []).filter(
    (event) => event && typeof event === 'object',
  );

  return [
    livestreamItem(list, at, zone, today),
    challengeItem(list, at, today),
    ...featureItems(list, at, today),
    festsItem(festDays, today),
    STICKER_BOOK_ITEM,
  ].filter(Boolean);
};

/* The Fests directory reduced to what the strip says about it: per venue
   date, how many, and up to three distinct cities, with `more` set when
   the day has cities the list leaves out. This is what gets cached, in
   place of the directory itself, which is hundreds of kilobytes for
   the sake of one line. */
export const festSummary = (fests) => {
  const days = {};

  (Array.isArray(fests) ? fests : []).forEach((fest) => {
    if (!fest || typeof fest.date !== 'string' || !ISO_DATE.test(fest.date)) {
      return;
    }

    if (!days[fest.date]) {
      days[fest.date] = { count: 0, cities: [], more: false };
    }
    const day = days[fest.date];
    day.count += 1;

    const city = typeof fest.city === 'string' ? fest.city.trim() : '';
    if (!city || day.cities.includes(city)) return;
    if (day.cities.length < MAX_CITIES) day.cities.push(city);
    else day.more = true;
  });

  return days;
};

/* The QA override: ?now=<ISO timestamp> previews the strip on any day,
   which before October is the only way to see it at all. The mocked build
   only (the caller passes `mocked`), so no link to the real site can make
   it claim a different day. */
export const nowOverride = (search, mocked) => {
  if (!mocked || typeof search !== 'string') return null;

  let value = null;
  try {
    value = new URLSearchParams(search).get('now');
  } catch (_) {
    return null;
  }

  const pinned = instant(value);
  return pinned === null ? null : pinned;
};

/* --- The cache -----------------------------------------------------------

   Every page carries the strip, and the Fests directory behind it is the
   whole events payload, so the fetched data is kept in sessionStorage for
   a quarter of an hour and the next page reads it from there. Kept small
   on purpose: the raw schedule events, which have to stay raw because
   the day an event falls on depends on the zone it is read in, and the
   per-date Fest summary, never the directory.

   Stamped with the API it came from, so a mocked preview and a live build
   served from the same origin can never paint each other's data. */
export const TODAY_STRIP_CACHE_KEY = 'hf-today-strip-v1';
export const TODAY_STRIP_CACHE_TTL_MS = 15 * 60 * 1000;

const CACHE_SOURCE = API_BASE_URL || MOCKED_SENTINEL;

/* Safari in private mode throws on storage access rather than returning
   null, so the accessor is guarded as well as every read and write. */
const sessionStore = () => {
  try {
    return globalThis.sessionStorage || null;
  } catch (_) {
    return null;
  }
};

/* The cached data if it is younger than the TTL, else null. `at` is the
   real clock, never the QA override: the age of a cache entry is a fact
   about this browser, not about the day being previewed. */
export const readTodayCache = ({
  at,
  storage = sessionStore(),
  source = CACHE_SOURCE,
} = {}) => {
  if (!storage || !Number.isFinite(at)) return null;

  try {
    const parsed = JSON.parse(storage.getItem(TODAY_STRIP_CACHE_KEY));
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.source !== source) return null;
    if (typeof parsed.at !== 'number') return null;
    if (at < parsed.at || at - parsed.at >= TODAY_STRIP_CACHE_TTL_MS) {
      return null;
    }
    if (!Array.isArray(parsed.events)) return null;
    if (!parsed.festDays || typeof parsed.festDays !== 'object') return null;

    return { at: parsed.at, events: parsed.events, festDays: parsed.festDays };
  } catch (_) {
    return null;
  }
};

export const writeTodayCache = (
  { at, events, festDays },
  { storage = sessionStore(), source = CACHE_SOURCE } = {},
) => {
  if (!storage) return;

  try {
    storage.setItem(
      TODAY_STRIP_CACHE_KEY,
      JSON.stringify({ source, at, events, festDays }),
    );
  } catch (_) {
    // A full or refusing storage just means the next page fetches again.
  }
};

/* --- Before first paint --------------------------------------------------

   The strip is in every page's server-rendered HTML, because a band that
   appeared a frame after load would shove the page down 52px. The same
   HTML serves every day, though, so on a day outside October it has to
   disappear before anything paints, and that is this script's job: it
   runs inline in the head, marks <html>, and the strip's stylesheet hides
   it (TodayStrip.module.css). The component then unmounts it for good
   once React is running, the way components/Banner leaves when it has
   been dismissed.

   Built here from the same month octoberDay reads, so the two can never
   disagree about which days are October. `mocked` decides whether ?now=
   is honoured, exactly as nowOverride does. */
export const TODAY_STRIP_OFF_ATTRIBUTE = 'data-today-strip-off';

export const todayStripPrePaintScript = (mocked) => `(function () {
  try {
    var now = Date.now();${
      mocked
        ? `
    var pinned = Date.parse(new URLSearchParams(window.location.search).get('now'));
    if (!isNaN(pinned)) now = pinned;`
        : ''
    }
    var date = new Date(now);
    if (date.getFullYear() !== ${HACKTOBERFEST_START.getFullYear()} || date.getMonth() !== ${HACKTOBERFEST_START.getMonth()}) {
      document.documentElement.setAttribute(${JSON.stringify(TODAY_STRIP_OFF_ATTRIBUTE)}, 'true');
    }
  } catch (_) {}
})();`;
