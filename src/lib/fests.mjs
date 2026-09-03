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
   application still in progress (draft, submitted, or sent back for
   revisions) is not hosting yet: the Fest doesn't exist until MLH
   approves it. Approved applications count — the approval is what makes
   someone a host, whether or not the event has gone public yet. */
export const isHost = (fests) =>
  (Array.isArray(fests) ? fests : []).some(
    (fest) =>
      fest &&
      typeof fest === 'object' &&
      fest.role === 'organizing' &&
      fest.applicationStatus !== 'draft' &&
      fest.applicationStatus !== 'submitted' &&
      fest.applicationStatus !== 'rejected',
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

/* Which of the four publication rungs an organizing EVENT card sits on -
   an application card (applicationStatus set) has its own ladder and
   returns null here.

   The order is the truth ladder: our published flag beats everything
   (the Fest is on the website); MLH's own switch comes next (a private
   event has nothing to acknowledge yet); then the acknowledgement
   decides between asking the host and waiting on FestNet's checks. A
   payload from before these fields existed falls through to 'published',
   which is exactly what those cards showed before. */
export const eventCardState = (fest) => {
  if (fest.role !== 'organizing' || fest.applicationStatus) return null;
  if (fest.hacktoberfestPublished) return 'published';
  if (fest.mlhPublished === false) return 'approved-private';
  if (fest.mlhPublished && !fest.acknowledgedAt)
    return 'needs-acknowledgements';
  if (fest.mlhPublished && fest.acknowledgedAt) return 'checks-underway';
  return 'published';
};

/* Where a host edits the Fest itself. MLH's manageUrl for an approved
   event is the bare Organizer HQ event page, and the fields the
   publication checks complain about - the name, the running time - live
   one segment further on, at /edit. Mirrors applicationEditUrl in the
   API, which does the same for the application form and for the same
   reason: the form is the route that actually works.

   Only the OHQ event shape (numeric id, slug, nothing after it) is
   rewritten; any other manage link MLH ever sends is handed back
   untouched rather than pointed at a route that may not exist. The shape
   is matched on the path, not the host, so the fixtures' example.invalid
   links exercise the real thing in a mocked build. */
const OHQ_EVENT_URL = /^https:\/\/[^/]+\/events\/\d+-[^/?#]+$/;

export const festEditUrl = (fest) => {
  const manageUrl =
    fest && typeof fest.manageUrl === 'string' && fest.manageUrl
      ? fest.manageUrl
      : null;
  if (!manageUrl) return null;
  return OHQ_EVENT_URL.test(manageUrl) ? `${manageUrl}/edit` : manageUrl;
};

/* Today's calendar date in a given zone, as YYYY-MM-DD.

   'en-CA' because its short date format IS ISO order, which is what makes the
   string comparison below correct without any Date arithmetic — the same
   reason the rest of this file compares ISO date strings directly. An absent
   or unusable zone falls back to the reader's own clock: Intl throws a
   RangeError on a zone it does not know, and a host seeing the card a few
   hours early is a far smaller failure than a host whose Fest is underway
   seeing no card at all. */
const todayInZone = (nowMs, timeZone) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };

  try {
    return new Intl.DateTimeFormat('en-CA', {
      ...options,
      timeZone: timeZone || undefined,
    }).format(new Date(nowMs));
  } catch (_) {
    return new Intl.DateTimeFormat('en-CA', options).format(new Date(nowMs));
  }
};

/* Whether the check-ins card has anything to say yet.

   Nobody checks in before the doors open, so a count shown in September is a
   zero that reads as a fault. It appears on the day of the event — in the
   VENUE's zone, not the reader's — and stays from then on, so a past Fest
   keeps its final count. */
export const checkInsVisible = (fest, nowMs) => {
  if (!fest || !hasValidDate(fest)) return false;
  return todayInZone(nowMs, fest.timeZone) >= fest.date;
};
