/* Fest date rules, ported from progress-page's lib/fests.mjs and trimmed to
   what a public directory needs: no role grouping, just "does this sort,
   group and format correctly." Malformed data degrades to "sorts last" /
   "reads as upcoming" / "renders no date", never a crash.

   festIsPast mirrors the one in lib/fests.mjs deliberately rather than
   importing it. That file is the signed-in hub's, shaped by participation
   statuses this directory has no notion of; the two have been separate
   ports since the directory was written, and collapsing them is a change
   to both features rather than a tidy-up of one. */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const hasValidDate = (fest) =>
  typeof fest.date === 'string' && ISO_DATE.test(fest.date);

export const sortByDateAsc = (fests) =>
  [...fests].sort((a, b) => {
    if (!hasValidDate(a)) return 1;
    if (!hasValidDate(b)) return -1;
    return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
  });

/* ISO dates compare correctly as strings, so no Date parsing — and no
   timezone edge — is needed.

   A fest dated today is NOT past. The date is the one at its venue and
   `today` is the viewer's, so the two disagree by up to a day in either
   direction: a Fest in Sydney is over before its date begins in Los
   Angeles, and one in Los Angeles is still to come once Sydney has rolled
   over. Holding a fest as upcoming for its whole calendar day errs toward
   showing something that has finished, which costs a wasted click.
   Erring the other way greys out a Fest while people are still walking
   into it.

   A multi-day event is past only after its LAST day, not its first — an
   MLH Member Event spans a weekend and stays upcoming on day two. */
const lastDay = (fest) =>
  typeof fest.endDate === 'string' &&
  ISO_DATE.test(fest.endDate) &&
  fest.endDate > fest.date
    ? fest.endDate
    : fest.date;

export const festIsPast = (fest, today) =>
  hasValidDate(fest) && lastDay(fest) < today;

/* Today where the viewer is, in the same YYYY-MM-DD shape the fest dates
   use. en-CA is the locale whose format is exactly that, the same trick
   festsDirectory.mjs uses to read a venue date out of an ISO timestamp.
   `now` is an argument so tests never have to mock a clock. */
export const todayIso = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

/* Splits a list that is already in the order the caller wants, preserving
   that order within each half — the sort has run by the time this does, and
   resorting either half here would silently outrank it. */
export const partitionPast = (fests, today) => {
  const upcoming = [];
  const past = [];

  fests.forEach((fest) => {
    (festIsPast(fest, today) ? past : upcoming).push(fest);
  });

  return { upcoming, past };
};

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const WEEKEND = 'Weekend';

/* Milliseconds since the epoch for a valid ISO date at UTC midnight, or
   null. The shape-only check (ISO_DATE) is not enough: Date.UTC silently
   rolls 2026-02-30 into March and month 13 into the next year. The
   round-trip check is the real validation — Date.UTC takes integers and
   read back with getUTCFullYear/Month/Date in the same frame, so no time
   zone gets a vote. If what comes back out is not what went in, the date
   was never real. */
const utcMidnight = (isoDate) => {
  if (typeof isoDate !== 'string' || !ISO_DATE.test(isoDate)) return null;
  const year = Number(isoDate.slice(0, 4));
  const month = Number(isoDate.slice(5, 7));
  const day = Number(isoDate.slice(8, 10));
  const ms = Date.UTC(year, month - 1, day);
  const back = new Date(ms);
  if (
    back.getUTCFullYear() !== year ||
    back.getUTCMonth() !== month - 1 ||
    back.getUTCDate() !== day
  ) {
    return null;
  }
  return ms;
};

const MS_PER_DAY = 86_400_000;

/* Inclusive: a Friday-to-Sunday hackathon is three days. Null unless both
   dates are real and the end is after the start — a one-day event has no
   count to show, and a malformed pair must not invent one. */
export const festDayCount = (isoDate, endIsoDate) => {
  const start = utcMidnight(isoDate);
  const end = utcMidnight(endIsoDate);
  if (start === null || end === null || end <= start) return null;
  return Math.round((end - start) / MS_PER_DAY) + 1;
};

/* '2026-10-10' → 'Saturday'. */
export const festWeekday = (isoDate) => {
  const ms = utcMidnight(isoDate);
  if (ms === null) return null;
  return DAYS[new Date(ms).getUTCDay()];
};

/* True when a real range (end after start, per festDayCount) runs from a
   Friday or Saturday through the following Saturday or Sunday — Fri–Sat,
   Fri–Sun and Sat–Sun all count, but Thu–Sat and Fri–Mon do not. A one-day
   "range" or a malformed pair is never a weekend, same as festDayCount. */
export const spansWeekend = (isoDate, endIsoDate) => {
  if (festDayCount(isoDate, endIsoDate) === null) return false;
  const startDay = new Date(utcMidnight(isoDate)).getUTCDay();
  const endDay = new Date(utcMidnight(endIsoDate)).getUTCDay();
  const startsWeekend = startDay === 5 || startDay === 6; // Fri or Sat
  const endsWeekend = endDay === 6 || endDay === 0; // Sat or Sun
  return startsWeekend && endsWeekend;
};

/* The card's date tile: three pieces, stacked, rather than a sentence.
   Abbreviated from the same tables the long forms use, so a month can
   never be spelled one way in the tile and another in the modal.

   A multi-day event — a Member Event or a Pop-Up, never a Fest — shows
   its first and last day as a range, "2–4", and when the two straddle a
   month, the months as a range too. The weekday line reads "Weekend" for
   a Fri/Sat–Sat/Sun span, or "Thu–Sat" for any other range — never just
   the first day's, which read as if the whole span were one day. An end
   that is missing, malformed, or not after the start reads as a one-day
   event, so a Fest with no endDate renders exactly as before.

   Returns null rather than partial pieces — a tile with a day and no month
   is worse than no tile, and the card collapses it entirely. */
export const festDateParts = (isoDate, endIsoDate = null) => {
  const weekday = festWeekday(isoDate);
  if (!weekday) return null;

  const month = MONTHS[Number(isoDate.slice(5, 7)) - 1];
  if (!month) return null;

  const startDay = String(Number(isoDate.slice(8, 10)));
  const parts = {
    weekday: weekday.slice(0, 3),
    day: startDay,
    month: month.slice(0, 3),
  };

  if (festDayCount(isoDate, endIsoDate) === null) return parts;

  const endDay = String(Number(endIsoDate.slice(8, 10)));
  const endMonth = MONTHS[Number(endIsoDate.slice(5, 7)) - 1];

  parts.day = `${startDay}–${endDay}`;
  if (endMonth !== month) {
    parts.month = `${parts.month}–${endMonth.slice(0, 3)}`;
  }

  /* The weekday line answered "when does it start" for a range too, which
     read as if the whole span were one day. A weekend names itself instead
     of its two edges; any other range gets both, "Thu–Sat". */
  parts.weekday = spansWeekend(isoDate, endIsoDate)
    ? WEEKEND
    : `${parts.weekday}–${festWeekday(endIsoDate).slice(0, 3)}`;

  return parts;
};

export const formatFestDate = (isoDate) => {
  if (typeof isoDate !== 'string' || !ISO_DATE.test(isoDate)) return null;
  const month = MONTHS[Number(isoDate.slice(5, 7)) - 1];
  if (!month) return null;
  return `${month} ${Number(isoDate.slice(8, 10))}`;
};
