import { useState } from 'react';

import { schedule } from 'data/content.mjs';
import { festDateParts } from 'lib/festDate.mjs';
import {
  formatClock,
  formatTimeRange,
  isOnAir,
  roundState,
  todayInZone,
  weekdayName,
} from 'lib/schedule.mjs';
import {
  agendaEntries,
  collapsePast,
  entryDate,
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
     round    a bold block for a submission window opening
     session  an ordinary dated row

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

/* A name logo stands where the event's name would; a sponsor logo is a credit
   and sits to the right. Only a logo that actually exists can replace a name —
   see the fallback in EventLogo for the case where it fails to load. */
const isNameLogo = (event) => event.logoKind === 'name';

/* A badge labels the departure from the default, never the rule: nine of
   thirteen entries are livestreams, and a label carried by most of the list is
   texture rather than information. Suppressed too when the name already
   contains the label — "The DEV Challenge" needs no CHALLENGE beside it. The
   type still shows in the modal and colours the accent. */
const badgeLabel = (event, type) => {
  if (type.id === 'livestream') return null;
  if (event.name.toLowerCase().includes(type.label.toLowerCase())) return null;
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

/* One dated thing: a livestream, a workshop, a ceremony. */
const SessionRow = ({ event, timeZone, onSelect, isPast, now }) => {
  const type = scheduleType(event.type);
  /* The STREAM chip, on livestreams only. It sits with the time rather than
     the name because the rail is the row's verb slot — watch live at three
     the way a round says submit by Sunday — and it is what flips to ON AIR
     while the window is open, so a workshop or ceremony showing a bare time
     is itself information. */
  const streaming = event.type === 'livestream' && !event.allDay;
  const onAir = streaming && isOnAir(event, now);
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
            {badgeLabel(event, type) && (
              <span className={styles.typeBadge}>{type.label}</span>
            )}
          </span>
        </span>
        {!named && <EventLogo event={event} />}
        <span className={styles.rowTime}>
          {streaming && (
            <span
              className={styles.streamChip}
              data-onair={onAir ? 'true' : undefined}
            >
              {onAir ? schedule.onAirChip : schedule.streamChip}
            </span>
          )}
          {/* The tile is aria-hidden, so the date is spelled out here for
              anyone not reading it off the tile. */}
          <span className={styles.srOnly}>{dayLabel(event.startDate)}, </span>
          {event.allDay ? schedule.allDayLabel : time}
        </span>
      </button>
    </li>
  );
};

/* A submission window opening. Bolder than a session because it is a deadline
   rather than an appointment, and it recurs — four of these are what make the
   month's rhythm visible in the stream. */
const RoundBlock = ({
  event,
  onSelect,
  isPast,
  roundNumber,
  timeZone,
  today,
}) => {
  const type = scheduleType(event.type);
  const named = isNameLogo(event);
  /* The kicker tells the truth per round, on the same calendar the stream's
     past-collapse runs on: before its Monday a round says which day it opens,
     during the window it says open, and afterwards it says so. Four rounds
     stop all claiming to be open at once. */
  const state = roundState(event, today);
  const kicker =
    state === 'upcoming'
      ? `${schedule.roundKicker.upcoming} ${weekdayName(event.startDate)}`
      : schedule.roundKicker[state];
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
        onClick={() =>
          /* The week number travels with the event: it is derived by the
             agenda, not sent by the API, and the modal has to say the same
             "DEV Challenges · Week N" the card the reader pressed did. */
          onSelect(roundNumber ? { ...event, roundNumber } : event)
        }
      >
        <DateTile isoDate={event.startDate} />
        <span className={styles.rowWhat}>
          <span className={styles.roundText}>
            <span className={styles.roundWhen}>{kicker}</span>
            <span className={styles.titleRow}>
              {named ? (
                <EventLogo event={event} />
              ) : (
                <span className={styles.roundName}>
                  {event.name}
                  {/* Which week of the challenge, because four identical
                      blocks hide the one thing that changes between them.
                      Derived from Monday order in lib/scheduleAgenda.mjs, and
                      it agrees with the stream's week rules by construction —
                      both counts anchor on the first round. */}
                  {roundNumber
                    ? ` · ${schedule.roundLabel} ${roundNumber}`
                    : ''}
                </span>
              )}
              {badgeLabel(event, type) && (
                <span className={styles.typeBadge}>{type.label}</span>
              )}
            </span>
          </span>
        </span>
        {!named && <EventLogo event={event} />}
        {/* The right rail is for WHEN on every kind. A round's WHEN is a
            window, so the rail is a two-line ledger — both ends, labels
            aligned, times appearing once the API sends a timed round. */}
        <span className={styles.roundLedger}>
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
const RoundCloseStub = ({ event, onSelect, isPast, roundNumber, timeZone }) => {
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
        onClick={() =>
          onSelect(roundNumber ? { ...event, roundNumber } : event)
        }
      >
        <DateTile isoDate={event.endDate} />
        <span className={styles.rowWhat}>
          <span className={styles.rowText}>
            <span className={styles.roundText}>
              <span className={styles.roundWhen}>{schedule.lastDayLabel}</span>
              <span className={styles.rowName}>
                {event.name}
                {roundNumber ? ` · ${schedule.roundLabel} ${roundNumber}` : ''}
              </span>
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

const FeatureBlock = ({ entry, timeZone, onSelect, isPast, now }) => {
  const { event, contains } = entry;
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
          {/* The third column is the sponsor credit, and collapses to nothing
              for an event with no sponsor — which is most of them. */}
          {!named && <EventLogo event={event} size="card" />}
        </button>

        {contains.length > 0 && (
          <ul className={styles.featureBody}>
            {/* Sessions only, by the claiming rule: a round is never Hack Week
                programming, so one can never appear in here. */}
            {contains.map((child) => (
              <SessionRow
                key={child.event.id}
                event={child.event}
                timeZone={timeZone}
                onSelect={onSelect}
                now={now}
              />
            ))}
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
        roundNumber={entry.roundNumber}
        timeZone={timeZone}
        today={today}
      />
    );
  }

  if (entry.kind === 'roundClose') {
    return (
      <RoundCloseStub
        {...shared}
        event={entry.event}
        roundNumber={entry.roundNumber}
        timeZone={timeZone}
      />
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
             weeks, and the rules must agree with the "· Week N" on the round
             cards. Days before the first round sit before Week 1, which is how
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
