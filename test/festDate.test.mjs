import assert from 'node:assert/strict';
import test from 'node:test';

import {
  festDateParts,
  festIsPast,
  festWeekday,
  formatFestDate,
  partitionPast,
  sortByDateAsc,
  todayIso,
} from '../src/lib/festDate.mjs';

test('formatFestDate renders a valid ISO date as "Month D"', () => {
  assert.equal(formatFestDate('2026-10-03'), 'October 3');
  assert.equal(formatFestDate('2026-01-25'), 'January 25');
});

test('formatFestDate returns null for malformed input', () => {
  assert.equal(formatFestDate('not-a-date'), null);
  assert.equal(formatFestDate(undefined), null);
  assert.equal(formatFestDate('2026-13-01'), null);
});

test('sortByDateAsc orders earliest first and pushes malformed dates last', () => {
  const fests = [
    { id: 'c', date: '2026-10-20' },
    { id: 'a', date: '2026-10-03' },
    { id: 'bad', date: 'nope' },
    { id: 'b', date: '2026-10-10' },
  ];

  const sorted = sortByDateAsc(fests);

  assert.deepEqual(
    sorted.map((f) => f.id),
    ['a', 'b', 'c', 'bad'],
  );
});

test('sortByDateAsc does not mutate its input', () => {
  const fests = [
    { id: 'b', date: '2026-10-10' },
    { id: 'a', date: '2026-10-03' },
  ];
  sortByDateAsc(fests);
  assert.deepEqual(
    fests.map((f) => f.id),
    ['b', 'a'],
  );
});

/* A fest's date is the date at its venue, and "today" is the viewer's.
   Those disagree by up to a day in either direction, which is why a fest
   dated today counts as upcoming: somewhere behind you it may still be
   running, and calling a live Fest over is the worse of the two mistakes. */
test('festIsPast is true only for a date strictly before today', () => {
  assert.equal(festIsPast({ date: '2026-10-02' }, '2026-10-03'), true);
  assert.equal(festIsPast({ date: '2026-10-03' }, '2026-10-03'), false);
  assert.equal(festIsPast({ date: '2026-10-04' }, '2026-10-03'), false);
});

/* Unknown is not over. A fest with no usable date reads as upcoming, the
   same direction every other degradation in this file leans. */
test('festIsPast is false when the date is missing or malformed', () => {
  assert.equal(festIsPast({}, '2026-10-03'), false);
  assert.equal(festIsPast({ date: null }, '2026-10-03'), false);
  assert.equal(festIsPast({ date: 'not-a-date' }, '2026-10-03'), false);
  assert.equal(festIsPast({ date: '2026-13-01' }, '2026-10-03'), false);
});

test('todayIso renders the given moment as YYYY-MM-DD', () => {
  assert.match(todayIso(), /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(todayIso(new Date('2026-10-03T12:00:00Z')).length, 10);
});

/* Order in, order out: the caller has already sorted by date or by
   distance, and partitioning must not quietly resort either half. */
test('partitionPast splits the list without reordering either half', () => {
  const fests = [
    { id: 'a', date: '2026-10-20' },
    { id: 'b', date: '2026-09-01' },
    { id: 'c', date: '2026-10-03' },
    { id: 'd', date: '2026-08-15' },
    { id: 'e' },
  ];

  const { upcoming, past } = partitionPast(fests, '2026-10-03');

  assert.deepEqual(
    upcoming.map((f) => f.id),
    ['a', 'c', 'e'],
  );
  assert.deepEqual(
    past.map((f) => f.id),
    ['b', 'd'],
  );
});

test('partitionPast returns both halves even when one is empty', () => {
  const fests = [{ id: 'a', date: '2026-10-20' }];
  assert.deepEqual(partitionPast(fests, '2026-10-03'), {
    upcoming: fests,
    past: [],
  });
  assert.deepEqual(partitionPast([], '2026-10-03'), {
    upcoming: [],
    past: [],
  });
});

test('festWeekday names the day an ISO date falls on', () => {
  assert.equal(festWeekday('2026-10-10'), 'Saturday');
  assert.equal(festWeekday('2026-10-03'), 'Saturday');
  assert.equal(festWeekday('2026-10-01'), 'Thursday');
  assert.equal(festWeekday('2026-08-01'), 'Saturday');
});

/* The whole reason this does its own arithmetic. A date string parsed by
   `new Date()` is UTC midnight, so anywhere west of Greenwich getDay()
   reports the day before — the Fest on a Saturday would read Friday for
   every reader in the Americas. Pinned across a spread of dates because a
   timezone bug of this shape passes on roughly half the calendar. */
test('festWeekday does not drift with the reader time zone', () => {
  const cases = {
    '2026-01-01': 'Thursday',
    '2026-02-28': 'Saturday',
    '2026-06-15': 'Monday',
    '2026-12-31': 'Thursday',
    '2028-02-29': 'Tuesday',
  };
  Object.entries(cases).forEach(([iso, day]) => {
    assert.equal(festWeekday(iso), day, iso);
  });
});

test('festWeekday returns null for junk and impossible dates', () => {
  assert.equal(festWeekday('not-a-date'), null);
  assert.equal(festWeekday(undefined), null);
  assert.equal(festWeekday(null), null);
  assert.equal(festWeekday('2026-13-01'), null);
  assert.equal(festWeekday('2026-02-30'), null);
  assert.equal(festWeekday('2026-10-32'), null);
});

/* The card's date tile reads as three stacked pieces rather than a
   sentence, so the parts come out separately rather than pre-joined. */
test('festDateParts splits a date into tile pieces', () => {
  assert.deepEqual(festDateParts('2026-10-10'), {
    weekday: 'Sat',
    day: '10',
    month: 'Oct',
  });
  assert.deepEqual(festDateParts('2026-08-01'), {
    weekday: 'Sat',
    day: '1',
    month: 'Aug',
  });
});

/* Same timezone-proof arithmetic as festWeekday, and the same refusal to
   invent a date that never existed. */
test('festDateParts returns null for junk and impossible dates', () => {
  assert.equal(festDateParts('not-a-date'), null);
  assert.equal(festDateParts(null), null);
  assert.equal(festDateParts('2026-13-01'), null);
  assert.equal(festDateParts('2026-02-30'), null);
});
