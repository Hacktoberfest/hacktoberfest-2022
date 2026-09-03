import assert from 'node:assert/strict';
import test from 'node:test';

import {
  filterZones,
  formatClock,
  formatDay,
  formatTimeRange,
  isOnAir,
  normalizeSchedule,
  roundState,
  weekdayName,
  scheduleEventFrom,
  todayInZone,
} from '../src/lib/schedule.mjs';

/* The API's shape stops at lib/schedule.mjs, so this is where a payload that
   is late, partial or malformed has to become something the calendar can
   render or ignore — never something that throws halfway through a month.

   The live fetch itself is covered by schedule-mock.test.mjs, which swaps
   API_BASE_URL; this file tests the translation, which is the part with rules
   in it. */

const raw = (overrides = {}) => ({
  id: 'ghw',
  name: 'Global Hack Week',
  type: 'global-hack-week',
  startsAt: '2026-10-05T15:00:00Z',
  endsAt: '2026-10-11T23:00:00Z',
  ...overrides,
});

// The zone is passed in rather than read from the environment, so these tests
// never depend on the machine they run on.
const UTC = 'UTC';

test('an event keeps its identity and its link out', () => {
  const event = scheduleEventFrom(
    raw({
      description: '  A week of building.  ',
      logoUrl: 'https://example.invalid/ghw.png',
      url: 'https://example.invalid/ghw',
      host: 'MLH',
    }),
    UTC,
  );

  assert.equal(event.id, 'ghw');
  assert.equal(event.name, 'Global Hack Week');
  assert.equal(event.type, 'global-hack-week');
  assert.equal(event.description, 'A week of building.', 'trimmed');
  assert.equal(event.logoUrl, 'https://example.invalid/ghw.png');
  assert.equal(event.url, 'https://example.invalid/ghw');
  assert.equal(event.host, 'MLH');
});

test('the calendar days come from the timestamps, in the viewer zone', () => {
  const event = scheduleEventFrom(raw(), UTC);

  assert.equal(event.startDate, '2026-10-05');
  assert.equal(event.endDate, '2026-10-11');
});

/* The reason startDate is derived per viewer rather than sliced off the ISO
   string: 23:00 UTC is already the next day in Sydney and still the previous
   afternoon in Los Angeles. An event must appear on the day the reader would
   actually attend it. */
test('a late-evening event lands on the right day either side of UTC', () => {
  const late = raw({ startsAt: '2026-10-05T23:30:00Z', endsAt: null });

  assert.equal(scheduleEventFrom(late, 'UTC').startDate, '2026-10-05');
  assert.equal(
    scheduleEventFrom(late, 'Australia/Sydney').startDate,
    '2026-10-06',
    'already tomorrow in Sydney',
  );
  assert.equal(
    scheduleEventFrom(late, 'America/Los_Angeles').startDate,
    '2026-10-05',
    'still the same afternoon in LA',
  );
});

/* An all-day event has no time of day, so its date is a calendar date rather
   than an instant, and converting it through a zone is simply wrong. The API
   sends midnight UTC; for any reader west of UTC that resolves to the previous
   evening, which moved every DEV challenge round onto the Sunday before it
   actually opens. Caught in the browser at America/Toronto, invisible to tests
   that normalise in UTC. */
test('an all-day event lands on the same date in every zone', () => {
  const round = raw({
    startsAt: '2026-10-05T00:00:00Z',
    endsAt: '2026-10-11T23:59:00Z',
    allDay: true,
  });

  ['UTC', 'America/Los_Angeles', 'America/Toronto', 'Australia/Sydney'].forEach(
    (zone) => {
      const event = scheduleEventFrom(round, zone);
      assert.equal(event.startDate, '2026-10-05', `start moved in ${zone}`);
      assert.equal(event.endDate, '2026-10-11', `end moved in ${zone}`);
    },
  );
});

/* The counterpart: a timed event must still follow the reader, because 4pm in
   New York genuinely is a different day in Sydney. */
test('a timed event still resolves per zone', () => {
  const evening = raw({ startsAt: '2026-10-05T23:30:00Z', endsAt: null });

  assert.equal(scheduleEventFrom(evening, 'UTC').startDate, '2026-10-05');
  assert.equal(
    scheduleEventFrom(evening, 'Australia/Sydney').startDate,
    '2026-10-06',
  );
});

test('an unknown time zone falls back to UTC rather than throwing', () => {
  const event = scheduleEventFrom(raw(), 'Mars/Olympus_Mons');
  assert.equal(event.startDate, '2026-10-05');
});

test('an event with no end is a single day', () => {
  const event = scheduleEventFrom(raw({ endsAt: null }), UTC);

  assert.equal(event.startDate, '2026-10-05');
  assert.equal(event.endDate, '2026-10-05');
  assert.equal(event.multiDay, false);
});

test('an event spanning days is marked multi-day', () => {
  assert.equal(scheduleEventFrom(raw(), UTC).multiDay, true);
});

test('an end before its start is treated as no end at all', () => {
  const event = scheduleEventFrom(
    raw({ startsAt: '2026-10-09T10:00:00Z', endsAt: '2026-10-02T10:00:00Z' }),
    UTC,
  );

  assert.equal(event.startDate, '2026-10-09');
  assert.equal(event.endDate, '2026-10-09');
});

test('an event without a usable start is dropped, not rendered dateless', () => {
  [undefined, null, '', 'not-a-date', 42].forEach((startsAt) => {
    assert.equal(
      scheduleEventFrom(raw({ startsAt }), UTC),
      null,
      `${JSON.stringify(startsAt)} should be dropped`,
    );
  });
});

test('a non-object is dropped', () => {
  [null, undefined, 'event', 7, []].forEach((value) => {
    assert.equal(scheduleEventFrom(value, UTC), null);
  });
});

test('optional fields absent from the payload become null, never undefined', () => {
  const event = scheduleEventFrom(raw(), UTC);

  assert.equal(event.description, null);
  assert.equal(event.logoUrl, null);
  assert.equal(event.url, null);
  assert.equal(event.host, null);
});

test('whitespace is not a description', () => {
  assert.equal(
    scheduleEventFrom(raw({ description: '   ' }), UTC).description,
    null,
  );
});

test('an all-day event says so, and a timed one does not', () => {
  assert.equal(scheduleEventFrom(raw({ allDay: true }), UTC).allDay, true);
  assert.equal(scheduleEventFrom(raw(), UTC).allDay, false);
});

/* An event with no id could not be keyed in a list or matched to an open
   modal, so it is dropped for the same reason a dateless one is. */
test('an event without an id is dropped', () => {
  assert.equal(scheduleEventFrom(raw({ id: null }), UTC), null);
});

// -- kind ----------------------------------------------------------------

/* `kind` is structural, not decorative: it decides what nests inside what in
   the agenda, so it comes from the API as its own field rather than being
   guessed from an event's duration. A seven-day thing is not automatically a
   feature — a challenge round is seven days too. */

test('an event carries its kind through', () => {
  ['feature', 'round', 'session'].forEach((kind) => {
    assert.equal(scheduleEventFrom(raw({ kind }), UTC).kind, kind);
  });
});

test('an event with no kind is an ordinary session', () => {
  assert.equal(scheduleEventFrom(raw(), UTC).kind, 'session');
});

test('a kind the frontend does not know degrades to a session', () => {
  [42, {}, '', '   ', 'headline'].forEach((kind) => {
    assert.equal(
      scheduleEventFrom(raw({ kind }), UTC).kind,
      'session',
      `${JSON.stringify(kind)} should degrade`,
    );
  });
});

// -- logoKind ------------------------------------------------------------

/* A logo is either somebody backing the event or the event's own name as
   artwork, and that decides where it goes: a sponsor sits to the right as a
   credit, a name replaces the title. It cannot be inferred from the image —
   the same graphic could be either — so the API declares it.

   Defaulting to `sponsor` is the safe half: a credit in the wrong place is
   untidy, where a `name` that turned out not to contain the name would leave
   the event unnamed. */

test('a logo declares whether it is a sponsor or the event name', () => {
  ['sponsor', 'name'].forEach((logoKind) => {
    assert.equal(scheduleEventFrom(raw({ logoKind }), UTC).logoKind, logoKind);
  });
});

test('an undeclared logo is a sponsor', () => {
  assert.equal(scheduleEventFrom(raw(), UTC).logoKind, 'sponsor');
});

test('an unrecognised logoKind falls back to sponsor, never name', () => {
  [42, {}, '', '  ', 'lockup', 'mark', null].forEach((logoKind) => {
    assert.equal(
      scheduleEventFrom(raw({ logoKind }), UTC).logoKind,
      'sponsor',
      `${JSON.stringify(logoKind)} should degrade to a sponsor credit`,
    );
  });
});

// -- the zone switcher's two halves ---------------------------------------

/* The reader can change the zone the page is shown in, and a zone change is
   not a formatting change: an evening event moves to a different DAY in a
   different zone, so the events have to be re-normalised, not re-printed.
   normalizeSchedule is that — the same translation getSchedule applies, taking
   the zone as an argument so the component can re-run it on a switch. */

test('normalizeSchedule re-derives the days for the zone it is given', () => {
  const raw = [{ id: 'late', startsAt: '2026-10-05T23:30:00Z' }];

  assert.equal(normalizeSchedule(raw, 'UTC')[0].startDate, '2026-10-05');
  assert.equal(
    normalizeSchedule(raw, 'Australia/Sydney')[0].startDate,
    '2026-10-06',
    'the same instant is already tomorrow in Sydney',
  );
});

test('normalizeSchedule drops what cannot be rendered and survives garbage', () => {
  assert.deepEqual(normalizeSchedule(null, 'UTC'), []);
  assert.deepEqual(normalizeSchedule([null, { id: 'x' }], 'UTC'), []);
});

/* Past-ness must be judged in the same zone the schedule is shown in. A reader
   in Toronto viewing Sydney time is a day ahead of their own clock, and using
   the machine's local today would collapse events that zone still shows as
   current — or the reverse. */

test('todayInZone gives the calendar date where that zone is', () => {
  const now = new Date('2026-10-05T23:30:00Z');

  assert.equal(todayInZone('UTC', now), '2026-10-05');
  assert.equal(todayInZone('Australia/Sydney', now), '2026-10-06');
  assert.equal(todayInZone('America/Los_Angeles', now), '2026-10-05');
});

test('todayInZone falls back to UTC for a zone it cannot read', () => {
  const now = new Date('2026-10-05T12:00:00Z');

  assert.equal(todayInZone('Mars/Olympus_Mons', now), '2026-10-05');
  assert.equal(todayInZone(undefined, now), '2026-10-05');
});

// -- filterZones ---------------------------------------------------------

/* What the zone picker's type-ahead runs on. The names being matched are IANA
   identifiers, which nobody types verbatim: they contain underscores no one
   writes, slashes no one thinks of, and casing no one remembers. The filter
   has to meet people at what they would actually type. */

const ZONES = [
  'America/New_York',
  'America/Toronto',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Europe/London',
  'UTC',
];

test('an empty query is the whole list', () => {
  assert.deepEqual(filterZones(ZONES, ''), ZONES);
  assert.deepEqual(filterZones(ZONES, '   '), ZONES);
});

test('matching is case-insensitive', () => {
  assert.deepEqual(filterZones(ZONES, 'toKYo'), ['Asia/Tokyo']);
});

test('a space finds an underscore', () => {
  assert.deepEqual(filterZones(ZONES, 'new york'), ['America/New_York']);
});

test('a city matches without its region', () => {
  assert.deepEqual(filterZones(ZONES, 'sydney'), ['Australia/Sydney']);
});

/* 'ka' should surface Kabul before Metlakatla, which merely contains the
   letters — a segment start is what a person typing a city name means. (The
   first draft of this test used Monterrey for 'tor', which does not actually
   contain 'tor'; the ranking needs a genuine mid-string match to prove
   anything.) */
test('segment starts rank before mere substrings', () => {
  const zones = ['America/Metlakatla', 'Asia/Kabul'];
  assert.deepEqual(filterZones(zones, 'ka'), [
    'Asia/Kabul',
    'America/Metlakatla',
  ]);
});

test('no match is an empty list, not a throw', () => {
  assert.deepEqual(filterZones(ZONES, 'zzzz'), []);
});

test('garbage in, calm out', () => {
  assert.deepEqual(filterZones(null, 'x'), []);
  assert.deepEqual(filterZones(ZONES, 42), ZONES);
});

// -- formatTimeRange -----------------------------------------------------

/* The line a card prints under an event's name. Zone-aware and always
   zone-labelled: an online schedule that says "2:00 PM" without saying whose
   2 PM is worse than useless to most of the people reading it. */

test('a timed event prints its range and names the zone', () => {
  const line = formatTimeRange(
    scheduleEventFrom(
      {
        id: 'x',
        startsAt: '2026-10-08T16:00:00Z',
        endsAt: '2026-10-08T18:00:00Z',
      },
      UTC,
    ),
    UTC,
  );

  assert.match(line, /4:00/);
  assert.match(line, /6:00/);
  assert.match(line, /UTC|GMT/, 'the zone must be named');
});

test('the same event reads in the reader own zone', () => {
  const event = scheduleEventFrom(
    {
      id: 'x',
      startsAt: '2026-10-08T16:00:00Z',
      endsAt: '2026-10-08T18:00:00Z',
    },
    'America/New_York',
  );

  assert.match(formatTimeRange(event, 'America/New_York'), /12:00/);
});

test('an event with no end prints a single time, not a range', () => {
  const line = formatTimeRange(
    scheduleEventFrom({ id: 'x', startsAt: '2026-10-08T16:00:00Z' }, UTC),
    UTC,
  );

  assert.doesNotMatch(line, /–/, 'no en dash, because there is no range');
  assert.match(line, /4:00/);
});

test('an all-day event has no time of day to print', () => {
  assert.equal(
    formatTimeRange(
      scheduleEventFrom(
        { id: 'x', startsAt: '2026-10-19T00:00:00Z', allDay: true },
        UTC,
      ),
      UTC,
    ),
    null,
  );
});

/* Newer ICU puts a narrow no-break space before AM/PM. Building the string
   from formatToParts keeps it identical across Node and browser versions —
   the same fix lib/festsDirectory.mjs already carries. */
test('the time carries no exotic whitespace', () => {
  const line = formatTimeRange(
    scheduleEventFrom({ id: 'x', startsAt: '2026-10-08T16:00:00Z' }, UTC),
    UTC,
  );

  assert.doesNotMatch(line, /[  ]/);
});

/* The rows dropped their zone suffix once the page grew a zone instrument —
   nine "EDT"s under a bar that already says TIMES IN America/Toronto were a
   stutter. The modal keeps its suffix: a detail surface should survive being
   screenshotted alone, so the default stays labelled and the rows opt out. */
test('the zone label can be omitted, for surfaces that state it elsewhere', () => {
  const event = scheduleEventFrom(
    {
      id: 'x',
      startsAt: '2026-10-08T16:00:00Z',
      endsAt: '2026-10-08T18:00:00Z',
    },
    UTC,
  );

  const bare = formatTimeRange(event, UTC, { withZone: false });
  assert.match(bare, /4:00/);
  assert.match(bare, /6:00/);
  assert.doesNotMatch(bare, /UTC|GMT/, 'the suffix should be gone');

  assert.match(
    formatTimeRange(event, UTC),
    /UTC|GMT/,
    'the default stays labelled',
  );
});

test('a multi-day timed event names both dates, not just the times', () => {
  const line = formatTimeRange(
    scheduleEventFrom(
      {
        id: 'x',
        startsAt: '2026-10-07T14:00:00Z',
        endsAt: '2026-10-13T22:00:00Z',
      },
      UTC,
    ),
    UTC,
  );

  assert.match(line, /Oct 7/);
  assert.match(line, /Oct 13/);
});

// -- isOnAir ---------------------------------------------------------------

/* Whether a stream's window is open at a given instant. An instant is a fact
   about the world, not about the reader, so unlike everything else in this
   file there is no zone in the signature: 3pm Toronto and 8pm London are the
   same moment, and a stream is on air or it is not. `now` is always passed in
   — components read the clock, this never does. */

test('a stream is on air between its start and its end', () => {
  const stream = {
    startsAt: '2026-10-07T19:00:00Z',
    endsAt: '2026-10-07T20:00:00Z',
  };

  assert.equal(isOnAir(stream, Date.parse('2026-10-07T19:30:00Z')), true);
  assert.equal(
    isOnAir(stream, Date.parse('2026-10-07T19:00:00Z')),
    true,
    'on air from the first second',
  );
});

test('a stream is not on air before it starts or after it ends', () => {
  const stream = {
    startsAt: '2026-10-07T19:00:00Z',
    endsAt: '2026-10-07T20:00:00Z',
  };

  assert.equal(isOnAir(stream, Date.parse('2026-10-07T18:59:00Z')), false);
  assert.equal(
    isOnAir(stream, Date.parse('2026-10-07T20:00:00Z')),
    false,
    'off air the moment it ends',
  );
});

/* No end means no way to know it is still going: a chip that lit up at start
   and never went out again would be lying by the evening. */
test('a stream with no end is never on air', () => {
  assert.equal(
    isOnAir(
      { startsAt: '2026-10-07T19:00:00Z' },
      Date.parse('2026-10-07T19:30:00Z'),
    ),
    false,
  );
});

test('an all-day event is never on air', () => {
  const round = {
    startsAt: '2026-10-05T00:00:00Z',
    endsAt: '2026-10-11T23:59:00Z',
    allDay: true,
  };

  assert.equal(isOnAir(round, Date.parse('2026-10-07T12:00:00Z')), false);
});

test('garbage is never on air', () => {
  [null, undefined, {}, { startsAt: 'nope', endsAt: 'also nope' }].forEach(
    (value) => {
      assert.equal(isOnAir(value, Date.parse('2026-10-07T12:00:00Z')), false);
    },
  );
});

// -- roundState --------------------------------------------------------------

/* Where a submission window stands relative to a calendar day — upcoming,
   open, or closed. Date-granular on purpose: the kicker flips at midnight in
   the SHOWN zone, which is the same clock the stream's past-collapse runs on,
   so the two can never disagree about whether a round is over. */

test('a round is upcoming, then open, then closed', () => {
  const window = { startDate: '2026-10-05', endDate: '2026-10-11' };

  assert.equal(roundState(window, '2026-10-04'), 'upcoming');
  assert.equal(roundState(window, '2026-10-05'), 'open', 'open on opening day');
  assert.equal(roundState(window, '2026-10-08'), 'open');
  assert.equal(
    roundState(window, '2026-10-11'),
    'open',
    'open on the last day',
  );
  assert.equal(roundState(window, '2026-10-12'), 'closed');
});

test('a round that cannot be judged reads as open', () => {
  const window = { startDate: '2026-10-05', endDate: '2026-10-11' };

  assert.equal(roundState(window, null), 'open');
  assert.equal(roundState({}, '2026-10-08'), 'open');
  assert.equal(roundState(null, '2026-10-08'), 'open');
});

// -- formatClock -------------------------------------------------------------

/* One end of a window as a clock time in the reader's zone — the ledger needs
   the endpoints separately, which formatTimeRange (a range) cannot give it.
   No zone suffix: the ledger sits under the toolbar that names the zone. */

test('formatClock prints one instant as a time of day in the zone', () => {
  assert.equal(formatClock('2026-10-05T13:00:00Z', 'UTC'), '1:00 PM');
  assert.equal(
    formatClock('2026-10-05T13:00:00Z', 'America/Toronto'),
    '9:00 AM',
  );
});

test('formatClock refuses garbage rather than printing Invalid Date', () => {
  [null, undefined, '', 'not-a-date', 42].forEach((value) => {
    assert.equal(formatClock(value, 'UTC'), null);
  });
});

// -- calendar-date labels ----------------------------------------------------

/* Labels for the zone-resolved 'YYYY-MM-DD' dates. Read through Date.UTC so
   no machine's local zone can shift a label onto the wrong weekday — these
   feed the stream's rails and the modal, which must agree with the tiles. */

test('formatDay prints a calendar date as day-first shorthand', () => {
  assert.equal(formatDay('2026-10-05'), 'Mon 5 Oct');
  assert.equal(formatDay('2026-10-11'), 'Sun 11 Oct');
});

test('formatDay and weekdayName refuse what is not a date', () => {
  [null, undefined, 42, 'soon'].forEach((value) => {
    assert.equal(formatDay(value), '');
    assert.equal(weekdayName(value), '');
  });
});

test('weekdayName prints the full weekday', () => {
  assert.equal(weekdayName('2026-10-05'), 'Monday');
  assert.equal(weekdayName('2026-10-11'), 'Sunday');
});
