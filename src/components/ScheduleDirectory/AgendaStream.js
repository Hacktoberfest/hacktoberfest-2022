import { useState } from 'react';

import { schedule } from 'data/content.mjs';
import { festDateParts } from 'lib/festDate.mjs';
import {
  formatClock,
  formatTimeRange,
  isOnAir,
  roundState,
  todayInZone,
} from 'lib/schedule.mjs';
import {
  agendaEntries,
  collapsePast,
  entryDate,
  featureRows,
  featureTally,
  mondayOf,
} from 'lib/scheduleAgenda.mjs';
import { scheduleType } from 'lib/scheduleTypes.mjs';

import EventLogo from './EventLogo';
import styles from './ScheduleDirectory.module.css';

/* October as one stream you read top to bottom.

   The big things are not announcements you scroll past: Global Hack Week is a
   container with its sessions inside it, closed off at the end, so the week
   reads as a week rather than as a bar followed by some unrelated rows. The
   nesting itself is decided in lib/scheduleAgenda.mjs; this file is the markup
   that decision implies.

   Three renderings, matching the three kinds:

     feature  a bordered container, headed and footed, holding its own entries
     round    a window row for a submission window opening
     session  an ordinary dated row

   Two row treatments, not three: sessions and rounds share the hairline-
   at-rest, shadow-on-hover physics and differ by the ink border and the
   CHALLENGE chip a round carries; the close stub is a round drawn dashed.
   The legend beside the zone control (index.js) names all three.

   A round never nests inside the feature, however its dates overlap it — the
   challenge runs alongside Hack Week, not within it. The claiming rule in
   lib/scheduleAgenda.mjs enforces that; the container's body can only ever
   hold sessions. */

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

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* 'Thu 9 Oct'. Read through Date.UTC and getUTCDay rather than by parsing the
   string, so no local zone can shift the label onto the wrong weekday — the
   same discipline lib/festDate.mjs uses. */
const dayLabel = (isoDate) => {
  if (typeof isoDate !== 'string') return '';

  const year = Number(isoDate.slice(0, 4));
  const month = Number(isoDate.slice(5, 7));
  const day = Number(isoDate.slice(8, 10));
  const weekday =
    WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

  return `${weekday} ${day} ${MONTHS[month - 1].slice(0, 3)}`;
};

/* A name logo stands where the event's name would. Only a logo that actually
   exists can replace a name; see the fallback in EventLogo for the case where
   it fails to load. */
const isNameLogo = (event) => event.logoKind === 'name';

/* A round's badge beside its name, for a round whose type is not already in
   its name: "The DEV Challenge" needs no CHALLENGE beside it. Sessions carry
   their type in the rail instead (railChip below). */
const badgeLabel = (event, type) => {
  if (event.name.toLowerCase().includes(type.label.toLowerCase())) return null;
  return type.label;
};

/* The word on a session's rail chip: STREAM for a livestream, flipping to ON
   AIR while it is actually live, MINI-EVENT for a mini-event, and the type's
   own label for anything else, so every row says what it is in one place. */
const railChip = (event, type, onAir) => {
  if (onAir) return schedule.onAirChip;
  if (type.id === 'livestream') return schedule.streamChip;
  if (type.id === 'minievent') return schedule.miniEventChip;
  return type.label;
};

const rangeLabel = (event) =>
  event.multiDay
    ? `${dayLabel(event.startDate)} – ${dayLabel(event.endDate)}`
    : dayLabel(event.startDate);

/* The fest card's date tile, reused rather than rebuilt: festDateParts is
   already written and already tested, and a second implementation of "what
   weekday is this" is how two tiles end up disagreeing. Three pieces or
   nothing — a tile showing a day with no month is worse than no tile — so an
   unusable date collapses it, exactly as the fest card does. */
const DateTile = ({ isoDate }) => {
  const parts = festDateParts(isoDate);
  if (!parts) return null;

  return (
    <span className={styles.tile} aria-hidden="true">
      <span className={styles.tileWeekday}>{parts.weekday}</span>
      <span className={styles.tileDay}>{parts.day}</span>
      <span className={styles.tileMonth}>{parts.month}</span>
    </span>
  );
};

/* One dated thing: a livestream, a mini-event, a ceremony. */
const SessionRow = ({ event, timeZone, onSelect, isPast, now }) => {
  const type = scheduleType(event.type);
  /* The rail is stacked the way a round's ledger is: the type's chip on top,
     the time under it. The chip is what flips to ON AIR while a livestream's
     window is open. */
  const onAir =
    event.type === 'livestream' && !event.allDay && isOnAir(event, now);
  /* No zone suffix on the rows: the toolbar instrument above the stream
     already names the zone, and repeating it on every timed row buried the
     one signal that varies (the hour) under the one that never does. The
     modal keeps its suffix — it has to survive being read alone. */
  const time = formatTimeRange(event, timeZone, { withZone: false });
  const named = isNameLogo(event);

  return (
    /* The type's DEEP partner, not its surface colour: it is a shadow, and a
       shadow the same value as the thing casting it does not read as depth.

       Named --type-accent rather than --accent because the stylesheet has the
       final say: an inline custom property outranks every rule in the sheet, so
       a past row could never be told to cast grey instead. The sheet resolves
       --accent from this, and [data-past] overrides it there. On the item
       rather than the button so the feature's nested rows inherit nothing —
       each entry's colour is its own. */
    <li
      className={styles.streamItem}
      data-kind="session"
      data-past={isPast ? 'true' : undefined}
      style={{ '--type-accent': type.shadow, '--type-tint': type.tint }}
    >
      <button
        type="button"
        className={styles.sessionRow}
        onClick={() => onSelect(event)}
      >
        <DateTile isoDate={event.startDate} />
        <span className={styles.rowWhat}>
          <span className={styles.rowText}>
            {/* A name logo IS the name, so it stands where the name would. */}
            {named ? (
              <EventLogo event={event} />
            ) : (
              <span className={styles.rowName}>{event.name}</span>
            )}
          </span>
        </span>
        <span className={`${styles.rowTime} ${styles.sessionRail}`}>
          <span
            className={styles.streamChip}
            data-onair={onAir ? 'true' : undefined}
          >
            {railChip(event, type, onAir)}
          </span>
          <span>
            {/* The tile is aria-hidden, so the date is spelled out here for
                anyone not reading it off the tile. */}
            <span className={styles.srOnly}>{dayLabel(event.startDate)}, </span>
            {event.allDay ? schedule.allDayLabel : time}
          </span>
        </span>
      </button>
    </li>
  );
};

/* A submission window opening. Bolder than a session because it is a deadline
   rather than an appointment, and it recurs — four of these are what make the
   month's rhythm visible in the stream. */
const RoundBlock = ({ event, onSelect, isPast, timeZone, today }) => {
  const type = scheduleType(event.type);
  const named = isNameLogo(event);
  /* The kicker tells the truth per round, on the same calendar the stream's
     past-collapse runs on: FIRST DAY before it opens, the way its stub says
     LAST DAY at the other end; open during the window; closed afterwards.
     Four rounds stop all claiming to be open at once. */
  const kicker = schedule.roundKicker[roundState(event, today)];
  /* Endpoint clocks for the ledger, when the API sends a timed round. The
     fixtures are all-day calendar spans, so these stay null and the ledger
     shows dates alone — nothing lies. */
  const opensClock = event.allDay
    ? null
    : formatClock(event.startsAt, timeZone);
  const closesClock = event.allDay ? null : formatClock(event.endsAt, timeZone);

  return (
    <li
      className={styles.streamItem}
      data-kind="round"
      data-past={isPast ? 'true' : undefined}
      style={{ '--type-accent': type.shadow, '--type-tint': type.tint }}
    >
      <button
        type="button"
        className={styles.roundBlock}
        onClick={() => onSelect(event)}
      >
        <DateTile isoDate={event.startDate} />
        <span className={styles.rowWhat}>
          <span className={styles.roundText}>
            <span className={styles.roundWhen}>{kicker}</span>
            <span className={styles.titleRow}>
              {named ? (
                <EventLogo event={event} />
              ) : (
                /* The API's own name alone: it already says which week
                   ("Hacktoberfest Week 1 DEV Challenge"), and a count of our
                   own appended to it disagreed with it by one. */
                <span className={styles.roundName}>{event.name}</span>
              )}
              {badgeLabel(event, type) && (
                <span className={styles.typeBadge}>{type.label}</span>
              )}
            </span>
          </span>
        </span>
        {/* The right rail is for WHEN on every kind. A round's WHEN is a
            window, so the rail is a two-line ledger — both ends, labels
            aligned, times appearing once the API sends a timed round — led
            by the chip that says so, where a livestream's rail says STREAM.
            The chip is what tells a window from a stream now that the two
            share a border weight; the legend above the stream names it. */}
        <span className={styles.roundLedger}>
          <span className={styles.windowChip}>{schedule.challengeChip}</span>
          <span>
            <span className={styles.ledgerLabel}>
              {schedule.roundLedger.opens}
            </span>
            {dayLabel(event.startDate)}
            {opensClock ? `, ${opensClock}` : ''}
          </span>
          <span>
            <span className={styles.ledgerLabel}>
              {schedule.roundLedger.closes}
            </span>
            {dayLabel(event.endDate)}
            {closesClock ? `, ${closesClock}` : ''}
          </span>
        </span>
      </button>
    </li>
  );
};

/* The container. Everything inside it happens during it, which is only an
   honest claim because nothing unrelated is scheduled against Global Hack
   Week — see the note on `contains` in lib/scheduleAgenda.mjs. */
/* The round's other end: a stub at the deadline's own date, so mid-week the
   deadline is still downstream of the reader instead of folded away with
   Monday's ticket. Deliberately lighter than the ticket — a dashed border at
   session height, a door drawn shutting — and it opens the same modal. */
const RoundCloseStub = ({ event, onSelect, isPast, timeZone }) => {
  const type = scheduleType(event.type);
  const closesClock = event.allDay ? null : formatClock(event.endsAt, timeZone);

  return (
    <li
      className={styles.streamItem}
      data-kind="round-close"
      data-past={isPast ? 'true' : undefined}
      style={{ '--type-accent': type.shadow, '--type-tint': type.tint }}
    >
      <button
        type="button"
        className={styles.closeStub}
        onClick={() => onSelect(event)}
      >
        <DateTile isoDate={event.endDate} />
        <span className={styles.rowWhat}>
          <span className={styles.rowText}>
            <span className={styles.roundText}>
              <span className={styles.roundWhen}>{schedule.lastDayLabel}</span>
              <span className={styles.rowName}>{event.name}</span>
            </span>
          </span>
        </span>
        <span className={styles.rowTime}>
          {/* The tile carries the date and the kicker names the moment, so
              the rail only speaks when it has a clock to add — "Closes Sun 11
              Oct" beside a tile reading SUN 11 OCT said one thing twice. */}
          <span className={styles.srOnly}>{dayLabel(event.endDate)}, </span>
          {closesClock ? `${schedule.roundLedger.closes} ${closesClock}` : ''}
        </span>
      </button>
    </li>
  );
};

/* A run of unannounced streams, folded into one quiet stub: drawn like the
   last-day stub (dashed, no shadow) because it is a placeholder rather than
   an appointment, and not pressable, because there is nothing yet to open. */
const TbaRow = ({ row, timeZone }) => {
  const first = row.events[0];
  const last = row.events[row.events.length - 1];
  const time = formatTimeRange(
    { startsAt: first.startsAt, endsAt: last.endsAt },
    timeZone,
    { withZone: false },
  );
  const count = row.events.length;

  return (
    <li className={styles.streamItem} data-kind="tba">
      <div className={`${styles.closeStub} ${styles.tbaStub}`}>
        <DateTile isoDate={row.date} />
        <span className={styles.rowWhat}>
          <span className={styles.roundText}>
            <span className={styles.roundWhen}>{schedule.tba.kicker}</span>
            <span className={styles.rowName}>
              {count === 1 ? schedule.tba.one : `${count} ${schedule.tba.many}`}
            </span>
          </span>
        </span>
        <span className={`${styles.rowTime} ${styles.sessionRail}`}>
          <span className={`${styles.streamChip} ${styles.tbaChip}`}>
            {schedule.tba.chip}
          </span>
          <span>
            <span className={styles.srOnly}>{dayLabel(row.date)}, </span>
            {time}
          </span>
        </span>
      </div>
    </li>
  );
};

const FeatureBlock = ({ entry, timeZone, onSelect, isPast, now }) => {
  const { event, contains } = entry;
  const tally = featureTally(entry);
  const type = scheduleType(event.type);
  const from = festDateParts(event.startDate);
  const to = festDateParts(event.endDate);
  /* A name logo carries the name itself, so a wordmark beside it would say it
     twice. Safe unconditionally: EventLogo falls a name logo back to the name
     as text when the image is missing or fails, so the event is never unnamed. */
  const named = isNameLogo(event);

  return (
    <li
      className={styles.streamItem}
      data-kind="feature"
      data-past={isPast ? 'true' : undefined}
      style={{
        '--type-accent': type.shadow,
        '--type-tint': type.tint,
        '--type-color': type.color,
      }}
    >
      <div className={styles.feature}>
        <button
          type="button"
          className={styles.featureHead}
          onClick={() => onSelect(event)}
        >
          {/* A plaque rather than a date tile: a tile holds one day, and the
              only thing worth saying about a week is its range. */}
          {from && to && (
            <span className={styles.plaque} aria-hidden="true">
              <span className={styles.plaqueRange}>
                {from.day}–{to.day}
              </span>
              <span className={styles.plaqueMonth}>{to.month}</span>
            </span>
          )}
          <span className={styles.featureText}>
            {/* A name logo stands exactly where the wordmark stood. Replacing
                the text means taking its place, not sitting across the header
                from it. */}
            {named ? (
              <EventLogo event={event} size="card" />
            ) : (
              <span className={styles.featureName}>{event.name}</span>
            )}
            {/* The plaque carries the range for sighted readers but is
                aria-hidden, so the range is spelled out here for everyone
                else. It used to be a visible line too — the third statement
                of one fact inside one box. */}
            <span className={styles.srOnly}>{rangeLabel(event)}</span>
          </span>
          {/* What the week holds, counted from what is inside it. */}
          {contains.length > 0 && (
            <span className={styles.featureCount}>
              {tally.days
                ? `${tally.days} ${
                    tally.days === 1
                      ? schedule.featureCount.day
                      : schedule.featureCount.days
                  } · `
                : ''}
              {tally.sessions}{' '}
              {tally.sessions === 1
                ? schedule.featureCount.session
                : schedule.featureCount.sessions}
            </span>
          )}
        </button>

        {contains.length > 0 && (
          <ul className={styles.featureBody}>
            {/* Sessions only, by the claiming rule: a round is never Hack Week
                programming, so one can never appear in here. Placeholder runs
                fold into one stub (lib/scheduleAgenda). */}
            {featureRows(contains).map((row) =>
              row.kind === 'tba' ? (
                <TbaRow
                  key={`tba-${row.events[0].id}`}
                  row={row}
                  timeZone={timeZone}
                />
              ) : (
                <SessionRow
                  key={row.event.id}
                  event={row.event}
                  timeZone={timeZone}
                  onSelect={onSelect}
                  now={now}
                />
              ),
            )}
          </ul>
        )}
      </div>
    </li>
  );
};

const renderEntry = ({ entry, timeZone, onSelect, isPast, now, today }) => {
  /* The close stub is the same event shown at its other end, so it cannot
     share the open ticket's React key. */
  const key =
    entry.kind === 'roundClose' ? `${entry.event.id}-close` : entry.event.id;
  const shared = { key, onSelect, isPast, now };

  if (entry.kind === 'feature') {
    return <FeatureBlock {...shared} entry={entry} timeZone={timeZone} />;
  }

  if (entry.kind === 'round') {
    return (
      <RoundBlock
        {...shared}
        event={entry.event}
        timeZone={timeZone}
        today={today}
      />
    );
  }

  if (entry.kind === 'roundClose') {
    return (
      <RoundCloseStub {...shared} event={entry.event} timeZone={timeZone} />
    );
  }

  return <SessionRow {...shared} event={entry.event} timeZone={timeZone} />;
};

/* `now` comes from the directory rather than a clock of this component's
   own: the modal shows the same ON AIR chip, and two clocks could disagree
   for up to a minute about whether a stream is live. */
const AgendaStream = ({ events, timeZone, onSelect, now }) => {
  const entries = agendaEntries(events);
  /* Today in the zone the schedule is SHOWN in, not the machine's: the reader
     can switch zones, and judging past-ness in a different zone than the one
     painting the dates would fold events the page still calls current. */
  const today = todayInZone(timeZone);
  const { collapsed, shown } = collapsePast(entries, today);
  const [showPast, setShowPast] = useState(false);

  const count = collapsed.length;
  const label =
    count === 1 ? schedule.pastToggle.one : schedule.pastToggle.many;

  return (
    <>
      {/* Above the stream, because what it hides is above today. Absent
          entirely when nothing has happened yet, rather than sitting there
          saying zero. */}
      {count > 0 && (
        <button
          type="button"
          className={styles.pastToggle}
          onClick={() => setShowPast((open) => !open)}
          aria-expanded={showPast}
        >
          <span className={styles.pastCount}>
            {count} {label}
          </span>
          <span className={styles.pastAction}>
            {showPast ? schedule.pastToggle.hide : schedule.pastToggle.show}
          </span>
        </button>
      )}

      <ul className={styles.stream}>
        {(() => {
          /* The stream with its structure drawn in: a slim rule between
             Mondays so the month has visible weeks, and an ochre one at the
             seam between what has happened and what has not — the only place
             "today" is a boundary the stream can point at. */
          const items = [];
          let prevWeek = null;

          /* One week count for the whole page, anchored on the first round:
             the challenge resets each Monday, so its weeks ARE the campaign's
             weeks. Days before the first round sit before Week 1, which is how
             the campaign actually runs; without any rounds the anchor falls
             back to the first entry. */
          const utcDay = (d) =>
            Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10));
          const firstRound = entries.find((e) => e.kind === 'round');
          const anchorEntry = firstRound || entries[0];
          const anchorWeek = anchorEntry
            ? mondayOf(anchorEntry.event.startDate)
            : null;

          const push = (entry, isPast) => {
            /* entryDate, not startDate: a close stub lives at its deadline,
               and must be ruled into the week it renders in. */
            const week = mondayOf(entryDate(entry));
            if (week && prevWeek && week !== prevWeek && anchorWeek) {
              const number =
                Math.round((utcDay(week) - utcDay(anchorWeek)) / 604800000) + 1;
              if (number >= 1) {
                items.push(
                  <li key={`week-${week}`} className={styles.weekRule}>
                    {schedule.weekLabel} {number}
                  </li>,
                );
              }
            }
            if (week) prevWeek = week;
            items.push(
              renderEntry({ entry, timeZone, onSelect, isPast, now, today }),
            );
          };

          if (showPast) collapsed.forEach((entry) => push(entry, true));
          if (showPast && collapsed.length > 0) {
            items.push(
              <li
                key="today-rule"
                className={`${styles.weekRule} ${styles.todayRule}`}
              >
                {schedule.todayLabel}
              </li>,
            );
          }
          shown.forEach((entry) => push(entry, false));

          return items;
        })()}
      </ul>
    </>
  );
};

export default AgendaStream;
