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
   into it. */
export const festIsPast = (fest, today) =>
  hasValidDate(fest) && fest.date < today;

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

/* '2026-10-10' → 'Saturday'.

   Built from Date.UTC and read back with getUTCDay, never from parsing the
   string. `new Date('2026-10-10')` is midnight UTC, so getDay() anywhere
   west of Greenwich reports the day before — a Fest on a Saturday would
   read Friday for every reader in the Americas, and be right for everyone
   else. Date.UTC takes integers and getUTCDay reads them back in the same
   frame, so no time zone gets a vote.

   The round-trip check is the validation: ISO_DATE only proves the shape,
   and Date.UTC silently rolls 2026-02-30 into March and month 13 into the
   next year. If what comes back out is not what went in, the date was
   never real. */
export const festWeekday = (isoDate) => {
  if (typeof isoDate !== 'string' || !ISO_DATE.test(isoDate)) return null;

  const year = Number(isoDate.slice(0, 4));
  const month = Number(isoDate.slice(5, 7));
  const day = Number(isoDate.slice(8, 10));

  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null;
  }

  return DAYS[utc.getUTCDay()];
};

/* The card's date tile: three pieces, stacked, rather than a sentence.
   Abbreviated from the same tables the long forms use, so a month can
   never be spelled one way in the tile and another in the modal.

   Returns null rather than partial pieces — a tile with a day and no month
   is worse than no tile, and the card collapses it entirely. */
export const festDateParts = (isoDate) => {
  const weekday = festWeekday(isoDate);
  if (!weekday) return null;

  const month = MONTHS[Number(isoDate.slice(5, 7)) - 1];
  if (!month) return null;

  return {
    weekday: weekday.slice(0, 3),
    day: String(Number(isoDate.slice(8, 10))),
    month: month.slice(0, 3),
  };
};

export const formatFestDate = (isoDate) => {
  if (typeof isoDate !== 'string' || !ISO_DATE.test(isoDate)) return null;
  const month = MONTHS[Number(isoDate.slice(5, 7)) - 1];
  if (!month) return null;
  return `${month} ${Number(isoDate.slice(8, 10))}`;
};
