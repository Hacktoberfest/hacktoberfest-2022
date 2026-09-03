import assert from 'node:assert/strict';
import test from 'node:test';

import {
  agendaEntries,
  collapsePast,
  entryDate,
  mondayOf,
} from '../src/lib/scheduleAgenda.mjs';

/* The agenda is one chronological stream in which the big things are not
   announcements you scroll past but containers holding what happens inside
   them. All of that decision-making is here, as a pure function over
   normalised events, so the nesting rules can be checked directly rather than
   inferred from rendered markup.

   The rule in one line: a `feature` claims every non-feature event whose start
   date falls inside its range, and everything else stays at the top level in
   date order. */

const day = (id, startDate, endDate = startDate, extra = {}) => ({
  id,
  name: id,
  startDate,
  endDate,
  kind: 'session',
  ...extra,
});

const feature = (id, startDate, endDate) =>
  day(id, startDate, endDate, { kind: 'feature' });

const round = (id, startDate, endDate) =>
  day(id, startDate, endDate, { kind: 'round' });

const ids = (entries) => entries.map((entry) => entry.event.id);

test('an ordinary schedule is one flat run in date order', () => {
  const entries = agendaEntries([
    day('closing', '2026-10-30'),
    day('opening', '2026-10-01'),
    day('workshop', '2026-10-07'),
  ]);

  assert.deepEqual(ids(entries), ['opening', 'workshop', 'closing']);
  entries.forEach((entry) => assert.equal(entry.kind, 'session'));
});

test('a feature holds the sessions that fall inside it', () => {
  const entries = agendaEntries([
    day('before', '2026-10-07'),
    feature('ghw', '2026-10-09', '2026-10-15'),
    day('inside-a', '2026-10-12'),
    day('inside-b', '2026-10-14'),
    day('after', '2026-10-16'),
  ]);

  assert.deepEqual(ids(entries), ['before', 'ghw', 'after']);

  const ghw = entries.find((entry) => entry.event.id === 'ghw');
  assert.equal(ghw.kind, 'feature');
  assert.deepEqual(ids(ghw.contains), ['inside-a', 'inside-b']);
});

/* Boundary days count. A session on the opening or closing day of the feature
   is part of it — an off-by-one here would silently eject the first and last
   sessions of Global Hack Week into the surrounding stream. */
test('sessions on the feature first and last days are inside it', () => {
  const [ghw] = agendaEntries([
    feature('ghw', '2026-10-09', '2026-10-15'),
    day('first-day', '2026-10-09'),
    day('last-day', '2026-10-15'),
  ]);

  assert.deepEqual(ids(ghw.contains), ['first-day', 'last-day']);
});

test('a session one day either side stays outside', () => {
  const entries = agendaEntries([
    feature('ghw', '2026-10-09', '2026-10-15'),
    day('day-before', '2026-10-08'),
    day('day-after', '2026-10-16'),
  ]);

  assert.deepEqual(ids(entries), ['day-before', 'ghw', 'day-after']);
  assert.deepEqual(entries.find((e) => e.event.id === 'ghw').contains, []);
});

test('a feature sits at its own start date in the stream', () => {
  const entries = agendaEntries([
    day('early', '2026-10-02'),
    feature('ghw', '2026-10-09', '2026-10-15'),
    day('late', '2026-10-27'),
  ]);

  assert.deepEqual(ids(entries), ['early', 'ghw', 'late']);
});

/* A round is never Hack Week programming, however its dates overlap: the
   challenge runs alongside the feature, not inside it, so a feature claims
   sessions and nothing else. */
test('a round is never claimed by a feature', () => {
  const entries = agendaEntries([
    feature('ghw', '2026-10-09', '2026-10-15'),
    round('round-2', '2026-10-12', '2026-10-18'),
  ]);

  assert.deepEqual(ids(entries), ['ghw', 'round-2', 'round-2']);
  assert.deepEqual(entries[0].contains, []);
  assert.equal(entries[1].kind, 'round');
  assert.equal(
    entries[2].kind,
    'roundClose',
    'the deadline follows, top level',
  );
});

test('a round outside any feature stays in the stream', () => {
  const entries = agendaEntries([
    round('round-1', '2026-10-05', '2026-10-11'),
    day('talk', '2026-10-07'),
  ]);

  assert.deepEqual(ids(entries), ['round-1', 'talk', 'round-1']);
  assert.equal(entries[0].kind, 'round');
  assert.equal(entries[2].kind, 'roundClose');
});

/* Two features cannot swallow each other — nesting one inside another would
   make the stream a tree, and nothing about this schedule is a tree. */
test('a feature never contains another feature', () => {
  const entries = agendaEntries([
    feature('outer', '2026-10-05', '2026-10-20'),
    feature('inner', '2026-10-08', '2026-10-10'),
  ]);

  assert.deepEqual(ids(entries), ['outer', 'inner']);
  assert.deepEqual(entries[0].contains, []);
});

/* Whichever feature starts first wins the session, so a session is never
   listed twice. */
test('overlapping features do not both claim the same session', () => {
  const entries = agendaEntries([
    feature('first', '2026-10-05', '2026-10-12'),
    feature('second', '2026-10-10', '2026-10-18'),
    day('contested', '2026-10-11'),
  ]);

  const contained = entries.flatMap((entry) => ids(entry.contains || []));
  assert.deepEqual(contained, ['contested']);
  assert.deepEqual(ids(entries.find((e) => e.event.id === 'first').contains), [
    'contested',
  ]);
});

test('an empty feature still appears, holding nothing', () => {
  const entries = agendaEntries([feature('quiet', '2026-10-09', '2026-10-15')]);

  assert.deepEqual(ids(entries), ['quiet']);
  assert.deepEqual(entries[0].contains, []);
});

/* Same day, so the date cannot order them: the time of day has to. */
test('two sessions on one day are ordered by their start time', () => {
  const entries = agendaEntries([
    day('evening', '2026-10-08', '2026-10-08', {
      startsAt: '2026-10-08T23:00:00Z',
    }),
    day('morning', '2026-10-08', '2026-10-08', {
      startsAt: '2026-10-08T09:00:00Z',
    }),
  ]);

  assert.deepEqual(ids(entries), ['morning', 'evening']);
});

/* A feature and a session starting the same day: the feature is the frame the
   session sits in, so it has to be rendered first. */
test('a feature outranks a session that starts the same day', () => {
  const [first] = agendaEntries([
    day('session', '2026-10-09', '2026-10-09', {
      startsAt: '2026-10-09T09:00:00Z',
    }),
    feature('ghw', '2026-10-09', '2026-10-15'),
  ]);

  assert.equal(first.event.id, 'ghw');
  assert.deepEqual(ids(first.contains), ['session']);
});

test('events with no usable date are dropped rather than ordered arbitrarily', () => {
  const entries = agendaEntries([
    day('good', '2026-10-05'),
    { id: 'bad', name: 'bad', kind: 'session' },
    null,
  ]);

  assert.deepEqual(ids(entries), ['good']);
});

// -- collapsePast --------------------------------------------------------

/* October is read during October, so by mid-month a third of the stream is
   over. Those entries stay reachable but fold away by default — the same
   stance /fests takes with past Fests, which sink and grey rather than
   disappearing, because a month with nothing above today reads as a month that
   never happened.

   Past means the END is behind us. Something still running today is not past,
   which is what keeps Global Hack Week current for its whole seven days
   instead of greying out on its second morning. */

const entryFor = (event) => ({ kind: event.kind || 'session', event });

test('an event that has finished is collapsed', () => {
  const { collapsed, shown } = collapsePast(
    [entryFor(day('over', '2026-10-02')), entryFor(day('ahead', '2026-10-20'))],
    '2026-10-10',
  );

  assert.deepEqual(ids(collapsed), ['over']);
  assert.deepEqual(ids(shown), ['ahead']);
});

test('an event ending today is not past', () => {
  const { collapsed, shown } = collapsePast(
    [
      entryFor(day('today', '2026-10-10')),
      entryFor(day('ahead', '2026-10-20')),
    ],
    '2026-10-10',
  );

  assert.deepEqual(collapsed, []);
  assert.deepEqual(ids(shown), ['today', 'ahead']);
});

/* The case this rule exists for: a seven-day event read from inside it. */
test('an event still running is not past, even if it began days ago', () => {
  const { collapsed, shown } = collapsePast(
    [entryFor(day('ghw', '2026-10-09', '2026-10-15'))],
    '2026-10-12',
  );

  assert.deepEqual(collapsed, []);
  assert.deepEqual(ids(shown), ['ghw']);
});

test('order is preserved on both sides of the split', () => {
  const { collapsed, shown } = collapsePast(
    [
      entryFor(day('a', '2026-10-01')),
      entryFor(day('b', '2026-10-02')),
      entryFor(day('c', '2026-10-20')),
      entryFor(day('d', '2026-10-21')),
    ],
    '2026-10-10',
  );

  assert.deepEqual(ids(collapsed), ['a', 'b']);
  assert.deepEqual(ids(shown), ['c', 'd']);
});

/* Once November comes, every entry is behind us. Collapsing all of them would
   leave a page whose entire content is a "show 14 past events" button, which
   is worse than simply showing the month. */
test('when everything is past, nothing collapses', () => {
  const entries = [
    entryFor(day('a', '2026-10-01')),
    entryFor(day('b', '2026-10-20')),
  ];
  const { collapsed, shown } = collapsePast(entries, '2026-11-05');

  assert.deepEqual(collapsed, []);
  assert.deepEqual(ids(shown), ['a', 'b']);
});

test('before the month starts, nothing is past', () => {
  const { collapsed, shown } = collapsePast(
    [entryFor(day('a', '2026-10-01')), entryFor(day('b', '2026-10-20'))],
    '2026-09-20',
  );

  assert.deepEqual(collapsed, []);
  assert.deepEqual(ids(shown), ['a', 'b']);
});

/* A feature is judged on its own end date, not on what it holds: its sessions
   travel with it rather than being split out of it. */
test('a finished feature collapses with everything inside it', () => {
  const [entry] = agendaEntries([
    feature('ghw', '2026-10-09', '2026-10-15'),
    day('inside', '2026-10-12'),
  ]);
  const { collapsed, shown } = collapsePast(
    [entry, entryFor(day('later', '2026-10-27'))],
    '2026-10-20',
  );

  assert.deepEqual(ids(collapsed), ['ghw']);
  assert.deepEqual(ids(collapsed[0].contains), ['inside']);
  assert.deepEqual(ids(shown), ['later']);
});

test('an entry with no usable date is never treated as past', () => {
  const { collapsed, shown } = collapsePast(
    [
      entryFor({ id: 'undated', kind: 'session' }),
      entryFor(day('ahead', '2026-10-20')),
    ],
    '2026-10-10',
  );

  assert.deepEqual(collapsed, []);
  assert.deepEqual(ids(shown), ['undated', 'ahead']);
});

test('a missing today is treated as knowing nothing, so nothing collapses', () => {
  const entries = [entryFor(day('a', '2026-10-01'))];

  [undefined, null, '', 'not-a-date'].forEach((today) => {
    assert.deepEqual(collapsePast(entries, today).collapsed, []);
  });
});

test('an unknown kind is treated as an ordinary session', () => {
  const entries = agendaEntries([
    day('odd', '2026-10-05', '2026-10-05', { kind: 'wat' }),
  ]);

  assert.equal(entries.length, 1);
  assert.equal(entries[0].kind, 'session');
});

// -- mondayOf ------------------------------------------------------------

/* The stream gains slim week rules between Mondays, so it needs to know which
   week a date belongs to. UTC arithmetic, like every date helper here — no
   local zone gets a vote. */

test('mondayOf finds the Monday of the week a date is in', () => {
  assert.equal(mondayOf('2026-10-07'), '2026-10-05'); // a Wednesday
  assert.equal(mondayOf('2026-10-05'), '2026-10-05'); // Monday is its own
  assert.equal(mondayOf('2026-10-04'), '2026-09-28'); // Sunday belongs back
});

test('mondayOf refuses what is not a date', () => {
  [null, undefined, '', 'soon', '2026-13-40'].forEach((value) => {
    assert.equal(mondayOf(value), null);
  });
});

// -- round numbering -------------------------------------------------------

/* Four blocks all reading "The DEV Challenge" hide the one thing that changes:
   which round you would be entering. The agenda numbers them chronologically,
   across nesting — a round claimed by the feature is still the month's second
   round. */

test('rounds are numbered in date order, across nesting', () => {
  const entries = agendaEntries([
    round('r1', '2026-10-05', '2026-10-11'),
    feature('ghw', '2026-10-09', '2026-10-15'),
    round('r2', '2026-10-12', '2026-10-18'),
    round('r3', '2026-10-19', '2026-10-25'),
  ]);

  const numbers = {};
  entries.forEach((entry) => {
    if (entry.kind === 'round') numbers[entry.event.id] = entry.roundNumber;
    (entry.contains || []).forEach((child) => {
      if (child.kind === 'round') numbers[child.event.id] = child.roundNumber;
    });
  });

  assert.deepEqual(numbers, { r1: 1, r2: 2, r3: 3 });
});

test('sessions and features carry no round number', () => {
  const entries = agendaEntries([
    day('talk', '2026-10-02'),
    feature('ghw', '2026-10-09', '2026-10-15'),
  ]);

  entries.forEach((entry) => {
    assert.equal(entry.roundNumber, undefined);
  });
});

test('a lone round is round 1, not unnumbered', () => {
  const [entry] = agendaEntries([round('only', '2026-10-05', '2026-10-11')]);
  assert.equal(entry.roundNumber, 1);
});

// -- close stubs -------------------------------------------------------------

/* A round is a window, and a window has two ends. The stream shows both: the
   opening ticket at the start date, and a close stub at the deadline's own
   date — so mid-week the deadline is still downstream of the reader instead
   of folded away with Monday. Both are derived here from the one round the
   API sends. */

test('a multi-day round also yields a close stub at its end date', () => {
  const entries = agendaEntries([round('r1', '2026-10-05', '2026-10-11')]);

  assert.deepEqual(
    entries.map((entry) => entry.kind),
    ['round', 'roundClose'],
  );
  assert.equal(entries[1].event.id, 'r1');
  assert.equal(entryDate(entries[1]), '2026-10-11');
});

test('a single-day round is one card, not an open and a close on one day', () => {
  const entries = agendaEntries([round('r1', '2026-10-05')]);

  assert.deepEqual(
    entries.map((entry) => entry.kind),
    ['round'],
  );
});

test('a close stub carries its round number', () => {
  const entries = agendaEntries([
    round('r2', '2026-10-12', '2026-10-18'),
    round('r1', '2026-10-05', '2026-10-11'),
  ]);

  const closes = entries.filter((entry) => entry.kind === 'roundClose');
  assert.deepEqual(
    closes.map((entry) => [entry.event.id, entry.roundNumber]),
    [
      ['r1', 1],
      ['r2', 2],
    ],
  );
});

test('a close stub sorts at its end date, last among that day', () => {
  const entries = agendaEntries([
    round('r1', '2026-10-05', '2026-10-11'),
    day('same-day', '2026-10-11'),
    day('later', '2026-10-13'),
  ]);

  assert.deepEqual(
    entries.map((entry) => `${entry.kind}:${entry.event.id}`),
    ['round:r1', 'session:same-day', 'roundClose:r1', 'session:later'],
  );
});

/* The claiming rule extends to the stub: a deadline inside Global Hack Week
   is still not Hack Week programming. */
test('a close stub is never claimed by a feature', () => {
  const entries = agendaEntries([
    feature('ghw', '2026-10-09', '2026-10-15'),
    round('r2', '2026-10-12', '2026-10-14'),
  ]);

  const top = entries.map((entry) => `${entry.kind}:${entry.event.id}`);
  assert.deepEqual(
    top,
    ['ghw:ghw', 'round:r2', 'roundClose:r2'].map((v) => {
      const [a, b] = v.split(':');
      return `${a === 'ghw' ? 'feature' : a}:${b}`;
    }),
  );
});

test('entryDate reads the start for everything except a close stub', () => {
  const [open, close] = agendaEntries([
    round('r1', '2026-10-05', '2026-10-11'),
  ]);
  assert.equal(entryDate(open), '2026-10-05');
  assert.equal(entryDate(close), '2026-10-11');

  const [session] = agendaEntries([day('s', '2026-10-07')]);
  assert.equal(entryDate(session), '2026-10-07');
});

/* Pastness follows each card's own moment, not the round's whole span: the
   opening ticket is Monday's news and folds when Monday is behind the reader;
   the stub holds the deadline and folds only once the window has shut. */
test('an open ticket folds once its opening day has passed', () => {
  const entries = agendaEntries([round('r1', '2026-10-05', '2026-10-11')]);
  const { collapsed, shown } = collapsePast(entries, '2026-10-07');

  assert.deepEqual(
    collapsed.map((entry) => entry.kind),
    ['round'],
  );
  assert.deepEqual(
    shown.map((entry) => entry.kind),
    ['roundClose'],
  );
});

test('a close stub is not past until the window has shut', () => {
  const entries = agendaEntries([round('r1', '2026-10-05', '2026-10-11')]);

  const during = collapsePast(entries, '2026-10-11');
  assert.deepEqual(
    during.shown.map((entry) => entry.kind),
    ['roundClose'],
    'still shown on the last day',
  );

  const after = collapsePast(entries, '2026-10-12');
  assert.deepEqual(after.shown, entries, 'everything past collapses nothing');
});
