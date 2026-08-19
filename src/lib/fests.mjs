/* Fest list rules. Pure: "today" is an argument, so tests never mock a
   clock and the render never disagrees with the derivation.

   The cards render in one flat list sorted by date — no role grouping. The
   badge comes from the API's participation status (registered/checked_in),
   so nothing here derives a label from the calendar; `festIsPast` exists
   only to past-tense the organizing badge. Bad data degrades to
   slightly-wrong ordering, never a crash: malformed dates sort last and
   read as upcoming. */

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

/* ISO dates compare correctly as strings, so no Date parsing (and no
   timezone edge) is needed. A fest happening today is not yet past. */
export const festIsPast = (fest, todayIso) =>
  hasValidDate(fest) && fest.date < todayIso;

const byDateAsc = (a, b) => {
  if (!hasValidDate(a)) return 1;
  if (!hasValidDate(b)) return -1;
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
};

export const sortFestsByDate = (fests) =>
  (Array.isArray(fests) ? fests : [])
    .filter((fest) => fest && typeof fest === 'object')
    .sort(byDateAsc);

/* '2026-10-17' → 'October 17'. Null on junk so the card can simply omit the
   date line rather than render garbage. Manual table, not toLocaleDateString:
   no Date parsing means no UTC-vs-local off-by-one-day surprises. */
export const formatFestDate = (isoDate) => {
  if (typeof isoDate !== 'string' || !ISO_DATE.test(isoDate)) return null;
  const month = MONTHS[Number(isoDate.slice(5, 7)) - 1];
  if (!month) return null;
  return `${month} ${Number(isoDate.slice(8, 10))}`;
};

/* Twelve hours after a fest ends, a participation still reading
   'registered' means the organizer never scanned this person in. The grace
   period absorbs organizers who tidy up check-ins after the event; until it
   lapses the card keeps saying "Registered". */
const NO_SHOW_GRACE_MS = 12 * 60 * 60 * 1000;

/* Date.parse here does not contradict the no-Date-parsing rule above: that
   rule is about calendar dates, where UTC-vs-local shifts the day. endsAt
   is an ISO instant, and instants compare without any time zone at all.
   Anything missing or unparseable degrades to false — never claiming a
   no-show is the safe direction. */
export const festDidNotAttend = (fest, nowMs) => {
  if (fest.status !== 'registered') return false;
  if (typeof fest.endsAt !== 'string') return false;
  const endMs = Date.parse(fest.endsAt);
  if (Number.isNaN(endMs)) return false;
  return nowMs - endMs >= NO_SHOW_GRACE_MS;
};

/* A host is someone with a real organized Fest — hosting or hosted. An
   application still in progress (draft or submitted) is not hosting yet:
   the Fest doesn't exist until MLH approves it. Approved applications
   count — the approval is what makes someone a host, whether or not the
   event has gone public yet. */
export const isHost = (fests) =>
  (Array.isArray(fests) ? fests : []).some(
    (fest) =>
      fest &&
      typeof fest === 'object' &&
      fest.role === 'organizing' &&
      fest.applicationStatus !== 'draft' &&
      fest.applicationStatus !== 'submitted',
  );

/* The Your Applications list: organizing entries only, in the same date
   order the fests grid uses. Deliberately looser than isHost — an
   application still in draft is already the user's own, so it belongs on
   their applications list even though MLH hasn't made them a host yet. */
export const organizingFests = (fests) =>
  sortFestsByDate(fests).filter((fest) => fest.role === 'organizing');

/* The same looseness as a yes/no: any organizing entry, applications in
   flight included. October's gate on the host resources band. */
export const isOrganizing = (fests) => organizingFests(fests).length > 0;

/* An application that has actually been sent: any organizing entry past
   draft. Sits between isOrganizing (drafts count) and isHost (submitted
   doesn't) — the gate for /my's thank-you postcard, where a draft author
   should still see the why-host pitch, but anyone whose application is
   with MLH has already answered it. */
export const hasApplied = (fests) =>
  (Array.isArray(fests) ? fests : []).some(
    (fest) =>
      fest &&
      typeof fest === 'object' &&
      fest.role === 'organizing' &&
      fest.applicationStatus !== 'draft',
  );

/* The API sends venue-local display strings ('10:00 AM'), already formatted
   in the event's own time zone — this only joins them. A missing start
   yields null (an end time with no start is not a range); a missing end
   degrades to the start alone. */
export const festTimeRange = (fest) => {
  const start =
    typeof fest.startTime === 'string' && fest.startTime
      ? fest.startTime
      : null;
  if (!start) return null;
  const end =
    typeof fest.endTime === 'string' && fest.endTime ? fest.endTime : null;
  return end ? `${start} – ${end}` : start;
};
