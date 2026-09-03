/* Turns the month's events into the agenda's stream: one chronological run in
   which a big thing is not an announcement you scroll past but a container
   holding what happens inside it.

   Pure, and with no DOM in it, so the nesting rules can be checked directly
   (test/schedule-agenda.test.mjs) rather than inferred from rendered markup.

   Three kinds of thing, and the distinction is structural rather than
   decorative — it decides what nests in what, so it comes from the API as its
   own field rather than being guessed from an event's duration:

     feature  a headline that spans days and holds what happens inside it.
              Global Hack Week is the only one this October.
     round    a submission window for the DEV challenge. Recurring, and never
              claimed by a feature — a challenge is not Hack Week programming,
              however the dates overlap.
     session  everything else: a livestream, a workshop, a ceremony.

   Dates are 'YYYY-MM-DD' strings, already resolved to the viewer's zone by
   lib/schedule.mjs, so nothing here can shift an event onto the wrong day. */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isIsoDate = (value) => typeof value === 'string' && ISO_DATE.test(value);

const KINDS = new Set(['feature', 'round', 'session']);

/* An unrecognised kind renders as an ordinary session rather than vanishing:
   the same stance scheduleTypes.mjs takes for an unrecognised type, and for
   the same reason — FestNet can invent one, and a page that dropped it would
   be worse than one that showed it plainly. */
const kindOf = (event) => (KINDS.has(event.kind) ? event.kind : 'session');

const endOf = (event) =>
  isIsoDate(event.endDate) && event.endDate >= event.startDate
    ? event.endDate
    : event.startDate;

/* Date first, then time of day, then id. The id is not meaningful ordering —
   it is there so two events that are otherwise identical always come out in
   the same order, which keeps the rendered stream stable between loads. */
const byWhen = (a, b) => {
  if (a.startDate !== b.startDate) return a.startDate < b.startDate ? -1 : 1;

  const at = typeof a.startsAt === 'string' ? a.startsAt : '';
  const bt = typeof b.startsAt === 'string' ? b.startsAt : '';
  if (at !== bt) return at < bt ? -1 : 1;

  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
};

/* The Monday of the week a date falls in, for the stream's week rules. Read
   through Date.UTC and the getUTC* accessors, the same discipline every date
   helper in this feature uses, and round-tripped so an impossible date comes
   back null rather than rolled into the next month. */
export const mondayOf = (isoDate) => {
  if (!isIsoDate(isoDate)) return null;

  const year = Number(isoDate.slice(0, 4));
  const month = Number(isoDate.slice(5, 7));
  const day = Number(isoDate.slice(8, 10));
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  /* getUTCDay is Sunday-first; shift so Monday is 0, then walk back. */
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
};

/* Which entries have already happened, and so should fold away by default.

   October is read during October, so by the middle of the month a third of the
   stream is behind the reader. Those entries are not deleted — /fests keeps
   past Fests in the directory, sunk and greyed, because a city with one Fest
   that has already run should not read as a city with none, and the same is
   true of a month. They simply start collapsed.

   Past means the END is behind us, never the start. An event running today is
   not past, which is what keeps Global Hack Week current for its whole seven
   days rather than grey by its second morning. A feature is judged on its own
   end date and travels with everything it holds, so a finished week folds away
   as one thing.

   Two cases collapse nothing at all, and both matter: a `today` this cannot
   read, because guessing would hide real events; and a month where everything
   is past, because a page whose entire content is a "show 14 past events"
   button is worse than simply showing the month. */
/* The date an entry occupies in the stream. Everything sits at its start —
   except a close stub, which exists precisely to sit at the deadline. The
   sort and the week rules both read this, so a stub can never render in one
   week and be counted in another. */
export const entryDate = (entry) =>
  entry.kind === 'roundClose' ? endOf(entry.event) : entry.event.startDate;

export const collapsePast = (entries, today) => {
  const nothingCollapsed = { collapsed: [], shown: entries };

  if (!isIsoDate(today)) return nothingCollapsed;

  /* Each card folds on its own moment, not its event's whole span. The
     opening ticket is Monday's news, so it goes with Monday — its deadline
     lives on in the close stub, which holds until the window shuts. Sessions
     and features keep the end-based rule that keeps Global Hack Week current
     for all seven days. */
  const isPast = (entry) => {
    const event = entry.event || {};
    if (!isIsoDate(event.startDate)) return false;

    if (entry.kind === 'round') return event.startDate < today;
    return endOf(event) < today;
  };

  const collapsed = entries.filter(isPast);
  const shown = entries.filter((entry) => !isPast(entry));

  return shown.length === 0 ? nothingCollapsed : { collapsed, shown };
};

export const agendaEntries = (events) => {
  const usable = (Array.isArray(events) ? events : [])
    .filter((event) => event && typeof event === 'object')
    .filter((event) => isIsoDate(event.startDate));

  /* Features are resolved before anything else, because whether a session is
     top level depends on whether some feature has claimed it. Sorted so the
     earliest-starting feature wins a contested session, which makes the
     outcome independent of the order the API happened to send them in. */
  const features = usable
    .filter((event) => kindOf(event) === 'feature')
    .sort(byWhen);

  const claimedBy = new Map();

  usable
    /* Only sessions can be claimed. A round whose dates fall inside Global
       Hack Week is still not Hack Week programming — the challenge runs
       alongside the feature, never inside it — so it stays in the open
       stream at its own date. */
    .filter((event) => kindOf(event) === 'session')
    .forEach((event) => {
      /* A feature claims by start date alone: a session on its opening or
         closing day belongs to it. */
      const owner = features.find(
        (candidate) =>
          candidate.startDate <= event.startDate &&
          event.startDate <= endOf(candidate),
      );

      if (owner) {
        const held = claimedBy.get(owner.id) || [];
        held.push(event);
        claimedBy.set(owner.id, held);
      }
    });

  const claimed = new Set(
    [...claimedBy.values()].flat().map((event) => event.id),
  );

  const entry = (event) => ({ kind: kindOf(event), event });

  /* Features never nest: a feature inside a feature would make the stream a
     tree, and nothing about this schedule is a tree. So a feature is always a
     top-level entry, whoever else's dates it happens to fall within. */
  const topLevel = usable.filter(
    (event) => kindOf(event) === 'feature' || !claimed.has(event.id),
  );

  /* The rounds numbered chronologically, across nesting: a round the feature
     has claimed is still the month's Nth round. Four blocks all reading "The
     DEV Challenge" hide the one thing that changes between them. */
  const roundOrder = usable
    .filter((event) => kindOf(event) === 'round')
    .sort(byWhen)
    .map((event) => event.id);

  const numberFor = (event) =>
    kindOf(event) === 'round' ? roundOrder.indexOf(event.id) + 1 : undefined;

  const entryWithNumber = (event) => {
    const base = entry(event);
    const roundNumber = numberFor(event);
    return roundNumber ? { ...base, roundNumber } : base;
  };

  const stream = topLevel
    .sort((a, b) => {
      const when = byWhen(a, b);
      if (when !== 0) return when;

      /* Same moment: the feature is the frame the other thing sits in, so it
         has to be rendered first. */
      const aFeature = kindOf(a) === 'feature';
      const bFeature = kindOf(b) === 'feature';
      if (aFeature !== bFeature) return aFeature ? -1 : 1;

      return 0;
    })
    .map((event) =>
      kindOf(event) === 'feature'
        ? {
            ...entry(event),
            contains: (claimedBy.get(event.id) || [])
              .sort(byWhen)
              .map(entryWithNumber),
          }
        : entryWithNumber(event),
    );

  /* A round is a window, and a window has two ends: the opening ticket above,
     and a close stub derived here to sit at the deadline's own date — so
     mid-week the deadline is still downstream of the reader instead of
     folded away with Monday. A single-day round is one card; an open and a
     close on the same day would say the window twice. Never claimed by a
     feature, for the same reason the round itself is not. */
  const closes = usable
    .filter((event) => kindOf(event) === 'round')
    .filter((event) => endOf(event) > event.startDate)
    .sort(byWhen)
    .map((event) => {
      const roundNumber = numberFor(event);
      const stub = { kind: 'roundClose', event };
      return roundNumber ? { ...stub, roundNumber } : stub;
    });

  /* Stable insertion sort by entryDate: for an equal date the stream's own
     entries keep their order and the stub lands after them — a deadline is
     the end of its day, not the start. */
  return [...stream, ...closes].sort((a, b) => {
    const ad = entryDate(a);
    const bd = entryDate(b);
    if (ad !== bd) return ad < bd ? -1 : 1;

    const aClose = a.kind === 'roundClose';
    const bClose = b.kind === 'roundClose';
    if (aClose !== bClose) return aClose ? 1 : -1;

    return 0;
  });
};
