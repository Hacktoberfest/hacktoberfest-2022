import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';

import { todayStrip } from '../src/data/content.mjs';
import { FESTS_FIXTURES } from '../src/data/festsFixtures.mjs';
import { SCHEDULE_FIXTURES } from '../src/data/scheduleFixtures.mjs';
import { normalizeSchedule } from '../src/lib/schedule.mjs';
import {
  STICKER_BOOK_ITEM,
  TODAY_STRIP_CACHE_KEY,
  TODAY_STRIP_CACHE_TTL_MS,
  TODAY_STRIP_OFF_ATTRIBUTE,
  festSummary,
  localDate,
  nowOverride,
  octoberDay,
  readTodayCache,
  todayStripItems,
  todayStripPrePaintScript,
  writeTodayCache,
} from '../src/lib/todayStrip.mjs';

/* The Today strip's pure half. Every call pins the instant and the zone,
   so none of this depends on the machine or the day it runs on: the
   component owns the clock, this file owns what the clock means. */

const TORONTO = 'America/Toronto';
const LOS_ANGELES = 'America/Los_Angeles';

const at = (iso) => Date.parse(iso);

const itemsAt = (iso, { events, festDays, timeZone = TORONTO } = {}) =>
  todayStripItems({
    events: events || normalizeSchedule(SCHEDULE_FIXTURES, timeZone),
    festDays: festDays || festSummary(FESTS_FIXTURES),
    now: at(iso),
    timeZone,
  });

const byId = (items, id) => items.find((item) => item.id === id);

/* A raw schedule event in the API's shape, run through the normaliser the
   way the component runs the payload. */
const raw = (overrides) => ({
  id: 'event',
  name: 'Event',
  type: 'livestream',
  kind: 'session',
  allDay: false,
  url: null,
  ...overrides,
});

const events = (list, timeZone = TORONTO) => normalizeSchedule(list, timeZone);

/* --- The day ------------------------------------------------------------ */

test('octoberDay counts the month in local time, midnight to midnight', () => {
  assert.equal(octoberDay(new Date(2026, 8, 30, 23, 59)), null);
  assert.equal(octoberDay(new Date(2026, 9, 1, 0, 0)), 1);
  assert.equal(octoberDay(new Date(2026, 9, 6, 12, 0)), 6);
  assert.equal(octoberDay(new Date(2026, 9, 31, 23, 59)), 31);
  assert.equal(octoberDay(new Date(2026, 10, 1, 0, 0)), null);
});

test('octoberDay takes epoch milliseconds too, and refuses another year', () => {
  assert.equal(octoberDay(new Date(2026, 9, 6).getTime()), 6);
  assert.equal(octoberDay(new Date(2025, 9, 6)), null);
  assert.equal(octoberDay(new Date(2027, 9, 6)), null);
  assert.equal(octoberDay(Number.NaN), null);
  assert.equal(octoberDay(undefined), null);
});

test('localDate is the local calendar date', () => {
  assert.equal(localDate(new Date(2026, 9, 6, 0, 0)), '2026-10-06');
  assert.equal(localDate(new Date(2026, 9, 6, 23, 59)), '2026-10-06');
  assert.equal(localDate(Number.NaN), null);
});

/* --- Livestreams -------------------------------------------------------- */

test('a stream on air now links straight to it', () => {
  // Hack Week Kickoff runs 15:00 to 16:00 UTC on Fri 9 Oct.
  const item = byId(itemsAt('2026-10-09T15:30:00Z'), 'livestream');
  assert.deepEqual(item, {
    id: 'livestream',
    kicker: 'On air now',
    text: 'Hack Week Kickoff',
    href: 'https://example.invalid/hacktoberfest/ghw/kickoff',
    cta: 'Watch now',
    external: true,
  });
});

test('a stream on air with no link of its own points at the schedule', () => {
  // Maintainer Office Hours carries url: null.
  const item = byId(itemsAt('2026-10-20T15:30:00Z'), 'livestream');
  assert.equal(item.kicker, 'On air now');
  assert.equal(item.text, 'Maintainer Office Hours');
  assert.equal(item.href, '/schedule/');
  assert.equal(item.cta, 'See the schedule');
  assert.equal(item.external, false);
});

test('a stream later today gives its time in the reader’s zone, zone named', () => {
  const item = byId(itemsAt('2026-10-09T14:00:00Z'), 'livestream');
  assert.deepEqual(item, {
    id: 'livestream',
    kicker: 'Livestream today',
    text: '11:00 AM EDT · Hack Week Kickoff',
    href: '/schedule/',
    cta: 'See the schedule',
    external: false,
  });

  // The zone's name is whatever en-US calls it, the same as /schedule/:
  // an offset where the US has no abbreviation of its own.
  const london = byId(
    itemsAt('2026-10-09T14:00:00Z', { timeZone: 'Europe/London' }),
    'livestream',
  );
  assert.equal(london.text, '4:00 PM GMT+1 · Hack Week Kickoff');
});

test('with nothing left today, the next stream names its day', () => {
  // After the kickoff; the next stream is Building with Open Models,
  // 16:00 UTC on Mon 12 Oct, which is noon in Toronto.
  const item = byId(itemsAt('2026-10-09T17:00:00Z'), 'livestream');
  assert.deepEqual(item, {
    id: 'livestream',
    kicker: 'Next livestream',
    text: 'Mon 12 Oct, 12:00 PM · Building with Open Models',
    href: '/schedule/',
    cta: 'See the schedule',
    external: false,
  });
});

test('a stream tonight in UTC is tomorrow somewhere else', () => {
  // 19:00 UTC Wed 7 Oct is the same day in Toronto, and still "today" at
  // 10:00 UTC; in Tokyo it is 4 AM Thursday, so not today at all.
  const toronto = byId(itemsAt('2026-10-07T10:00:00Z'), 'livestream');
  assert.equal(toronto.kicker, 'Livestream today');
  assert.equal(toronto.text, '3:00 PM EDT · Maintainers Live');

  const tokyo = byId(
    itemsAt('2026-10-07T10:00:00Z', { timeZone: 'Asia/Tokyo' }),
    'livestream',
  );
  assert.equal(tokyo.kicker, 'Next livestream');
  assert.equal(tokyo.text, 'Thu 8 Oct, 4:00 AM · Maintainers Live');
});

test('after the last stream there is no livestream item', () => {
  const items = itemsAt('2026-10-31T12:00:00Z');
  assert.equal(byId(items, 'livestream'), undefined);
});

/* --- DEV Challenge ------------------------------------------------------ */

test('an open all-day round closes on a named weekday within the week', () => {
  // Round 1 runs Mon 5 to Sun 11 Oct, all-day.
  const item = byId(itemsAt('2026-10-09T15:30:00Z'), 'challenge');
  assert.deepEqual(item, {
    id: 'challenge',
    kicker: 'DEV Challenge',
    text: 'DEV Challenges: submissions close Sunday',
    href: 'https://example.invalid/hacktoberfest/challenge/1',
    cta: 'Enter on DEV',
    external: true,
  });
});

test('an all-day round says today, tomorrow, a weekday, then a date', () => {
  const round = (endsAt) =>
    events([
      raw({
        id: 'round',
        name: 'DEV Challenges',
        type: 'challenge',
        kind: 'round',
        allDay: true,
        startsAt: '2026-10-01T00:00:00Z',
        endsAt,
      }),
    ]);
  const closes = (endsAt) =>
    byId(
      itemsAt('2026-10-06T16:00:00Z', { events: round(endsAt) }),
      'challenge',
    ).text;

  assert.equal(
    closes('2026-10-06T23:59:00Z'),
    'DEV Challenges: submissions close today',
  );
  assert.equal(
    closes('2026-10-07T23:59:00Z'),
    'DEV Challenges: submissions close tomorrow',
  );
  assert.equal(
    closes('2026-10-12T23:59:00Z'),
    'DEV Challenges: submissions close Monday',
  );
  assert.equal(
    closes('2026-10-13T23:59:00Z'),
    'DEV Challenges: submissions close Tue 13 Oct',
  );
});

/* The live API's rounds are timed: midnight to midnight Pacific. */
const liveRound = events([
  raw({
    id: 'dev-round-1',
    name: 'DEV Challenges',
    type: 'challenge',
    kind: 'round',
    startsAt: '2026-10-05T07:00:00Z',
    endsAt: '2026-10-12T06:59:00Z',
    url: 'https://dev.to/challenges/hacktoberfest',
  }),
]);

test('a timed round counts hours in its last day, floored', () => {
  const closes = (iso) =>
    byId(itemsAt(iso, { events: liveRound }), 'challenge').text;

  // 06:59 UTC Mon 12 Oct less 20:00 UTC Sun 11 Oct: 10h59m left.
  assert.equal(
    closes('2026-10-11T20:00:00Z'),
    'DEV Challenges: submissions close in 10 hours',
  );
  assert.equal(
    closes('2026-10-12T05:30:00Z'),
    'DEV Challenges: submissions close in 1 hour',
  );
  assert.equal(
    closes('2026-10-12T06:30:00Z'),
    'DEV Challenges: submissions close within the hour',
  );
});

test('a timed round names the day it closes in the reader’s zone', () => {
  // 06:59 UTC Monday is 11:59 PM Sunday in Los Angeles, 2:59 AM Monday in
  // Toronto: the same instant, a different day to each reader.
  const closes = (timeZone) =>
    byId(
      itemsAt('2026-10-09T15:30:00Z', {
        events: events(
          [
            raw({
              id: 'round',
              name: 'DEV Challenges',
              type: 'challenge',
              kind: 'round',
              startsAt: '2026-10-05T07:00:00Z',
              endsAt: '2026-10-12T06:59:00Z',
            }),
          ],
          timeZone,
        ),
        timeZone,
      }),
      'challenge',
    ).text;

  assert.equal(closes(LOS_ANGELES), 'DEV Challenges: submissions close Sunday');
  assert.equal(closes(TORONTO), 'DEV Challenges: submissions close Monday');
});

test('a timed round is shut at its closing instant, not at midnight', () => {
  const items = itemsAt('2026-10-12T07:30:00Z', { events: liveRound });
  assert.equal(byId(items, 'challenge'), undefined);
});

test('between rounds, the next one says when it opens', () => {
  // Before round 1 opens on Mon 5 Oct.
  const item = byId(itemsAt('2026-10-02T12:00:00Z'), 'challenge');
  assert.equal(item.text, 'DEV Challenges: opens Mon 5 Oct');
  assert.equal(item.href, 'https://example.invalid/hacktoberfest/challenge/1');
});

test('a round with no link sends people to the activities', () => {
  const list = events([
    raw({
      id: 'round',
      name: 'DEV Challenges',
      type: 'challenge',
      kind: 'round',
      allDay: true,
      startsAt: '2026-10-05T00:00:00Z',
      endsAt: '2026-10-11T23:59:00Z',
    }),
  ]);
  const item = byId(
    itemsAt('2026-10-06T12:00:00Z', { events: list }),
    'challenge',
  );
  assert.equal(item.href, '/activities/');
  assert.equal(item.cta, 'See the activities');
  assert.equal(item.external, false);
});

/* --- Features ----------------------------------------------------------- */

test('Global Hack Week, while it runs, says until when', () => {
  const item = byId(
    itemsAt('2026-10-09T15:30:00Z'),
    'feature-global-hack-week',
  );
  assert.deepEqual(item, {
    id: 'feature-global-hack-week',
    kicker: 'On now',
    text: 'Global Hack Week, until Thu 15 Oct',
    href: '/schedule/',
    cta: 'See sessions',
    external: false,
  });
});

test('Global Hack Week is coming up within the fortnight before it', () => {
  const item = byId(
    itemsAt('2026-10-01T12:00:00Z'),
    'feature-global-hack-week',
  );
  assert.equal(item.kicker, 'Coming up');
  assert.equal(item.text, 'Global Hack Week starts Fri 9 Oct');

  // Fifteen days out is too early to mention it.
  assert.equal(
    byId(itemsAt('2026-09-24T12:00:00Z'), 'feature-global-hack-week'),
    undefined,
  );
});

test('a feature that is over drops out', () => {
  assert.equal(
    byId(itemsAt('2026-10-16T12:00:00Z'), 'feature-global-hack-week'),
    undefined,
  );
});

/* --- Fests -------------------------------------------------------------- */

test('festSummary counts each venue date and keeps three distinct cities', () => {
  const summary = festSummary([
    { date: '2026-10-10', city: 'London' },
    { date: '2026-10-10', city: 'London' },
    { date: '2026-10-10', city: 'Toronto' },
    { date: '2026-10-10', city: ' Lagos ' },
    { date: '2026-10-10', city: 'Berlin' },
    { date: '2026-10-11', city: null },
    { date: null, city: 'Nowhere' },
    { date: 'soon', city: 'Nowhere' },
    null,
  ]);
  assert.deepEqual(summary, {
    '2026-10-10': {
      count: 5,
      cities: ['London', 'Toronto', 'Lagos'],
      more: true,
    },
    '2026-10-11': { count: 1, cities: [], more: false },
  });
  assert.deepEqual(festSummary(null), {});
});

test('the fixtures summarise to one Fest a day', () => {
  const summary = festSummary(FESTS_FIXTURES);
  assert.deepEqual(summary['2026-10-10'], {
    count: 1,
    cities: ['London'],
    more: false,
  });
});

test('Fests today are counted and placed', () => {
  const festDays = {
    '2026-10-10': {
      count: 12,
      cities: ['London', 'Toronto', 'Lagos'],
      more: true,
    },
  };
  const item = byId(itemsAt('2026-10-10T15:00:00Z', { festDays }), 'fests');
  assert.deepEqual(item, {
    id: 'fests',
    kicker: 'In person',
    text: '12 Fests today, in London, Toronto, Lagos and more',
    href: '/fests/',
    cta: 'Find a Fest',
    external: false,
  });
});

test('Fests in every city named end with "and", not "and more"', () => {
  const festDays = {
    '2026-10-10': { count: 4, cities: ['London', 'Toronto'], more: false },
  };
  const item = byId(itemsAt('2026-10-10T15:00:00Z', { festDays }), 'fests');
  assert.equal(item.text, '4 Fests today, in London and Toronto');
});

test('one Fest is a Fest', () => {
  const festDays = {
    '2026-10-10': { count: 1, cities: ['London'], more: false },
  };
  const item = byId(itemsAt('2026-10-10T15:00:00Z', { festDays }), 'fests');
  assert.equal(item.text, '1 Fest today, in London');
});

test('with no Fests today, the next day that has some', () => {
  // The fixtures' London Fest is on Sat 10 Oct.
  const item = byId(itemsAt('2026-10-09T15:30:00Z'), 'fests');
  assert.equal(item.kicker, 'In person');
  assert.equal(item.text, '1 Fest on Sat 10 Oct, in London');

  const festDays = {
    '2026-10-03': { count: 9, cities: ['Brooklyn'], more: true },
    '2026-10-17': { count: 3, cities: ['Nairobi', 'Accra'], more: false },
  };
  assert.equal(
    byId(itemsAt('2026-10-09T15:30:00Z', { festDays }), 'fests').text,
    '3 Fests on Sat 17 Oct, in Nairobi and Accra',
  );
});

test('after the last Fest there is no Fest item', () => {
  assert.equal(byId(itemsAt('2026-11-01T12:00:00Z'), 'fests'), undefined);
});

/* --- The list ----------------------------------------------------------- */

test('the full list, in order, with the sticker book last', () => {
  const items = itemsAt('2026-10-09T15:30:00Z');
  assert.deepEqual(
    items.map((item) => item.id),
    [
      'livestream',
      'challenge',
      'feature-global-hack-week',
      'fests',
      'sticker-book',
    ],
  );
});

test('the sticker book is always there, and always last', () => {
  for (const iso of [
    '2026-10-01T00:00:00Z',
    '2026-10-09T15:30:00Z',
    '2026-10-31T23:00:00Z',
  ]) {
    const items = itemsAt(iso);
    assert.deepEqual(items[items.length - 1], STICKER_BOOK_ITEM);
  }
  assert.deepEqual(STICKER_BOOK_ITEM, {
    id: 'sticker-book',
    kicker: 'Sticker book',
    text: 'Collect three stickers and we’ll mail you a real sticker pack.',
    href: '/my/',
    cta: 'Open your sticker book',
    external: false,
  });
});

test('an item with no data is skipped, never shown empty', () => {
  const now = at('2026-10-09T15:30:00Z');
  const alone = [STICKER_BOOK_ITEM];

  assert.deepEqual(
    todayStripItems({ events: [], festDays: {}, now, timeZone: TORONTO }),
    alone,
  );
  assert.deepEqual(
    todayStripItems({ events: null, festDays: null, now, timeZone: TORONTO }),
    alone,
  );
  assert.deepEqual(todayStripItems({ now: Number.NaN }), alone);
  assert.deepEqual(todayStripItems(), alone);

  // Schedule failed, Fests arrived: the Fests still get their item.
  assert.deepEqual(
    todayStripItems({
      events: [],
      festDays: festSummary(FESTS_FIXTURES),
      now,
      timeZone: TORONTO,
    }).map((item) => item.id),
    ['fests', 'sticker-book'],
  );
});

/* --- The words ---------------------------------------------------------- */

test('the strip’s own labels', () => {
  assert.equal(todayStrip.label, 'Today at Hacktoberfest');
  assert.equal(todayStrip.today, 'Today');
  assert.equal(
    `${todayStrip.today}${todayStrip.dateSeparator}Tue 6 Oct`,
    'Today · Tue 6 Oct',
  );
  assert.equal(todayStrip.dayOf(6, 31), 'Day 6 of 31');
  assert.equal(todayStrip.pause, 'Pause updates');
  assert.equal(todayStrip.resume, 'Resume updates');
  assert.equal(todayStrip.next, 'Next update');
});

test('the strip’s copy keeps the house voice', () => {
  const strings = [];
  const collect = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (typeof value === 'function') {
      strings.push(String(value('A', 'B', ['C'], false)));
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(collect);
    }
  };
  collect(todayStrip);

  assert.ok(strings.length > 20, `found only ${strings.length} strings`);
  for (const value of strings) {
    assert.doesNotMatch(value, /—/, `${value}: em dash`);
    assert.doesNotMatch(value, /organi[sz]er/i, `${value}: say hosts`);
    assert.doesNotMatch(value, /'/, `${value}: straight apostrophe`);
  }
});

/* --- The QA override ---------------------------------------------------- */

test('?now= is honoured by the mocked build only', () => {
  const search = '?now=2026-10-09T15:30:00Z';
  assert.equal(nowOverride(search, true), at('2026-10-09T15:30:00Z'));
  assert.equal(nowOverride(search, false), null);
  assert.equal(nowOverride('?now=someday', true), null);
  assert.equal(nowOverride('', true), null);
  assert.equal(nowOverride(undefined, true), null);
});

/* The pre-paint script runs in a page, not a module, so it is run here the
   way a page would run it: against a document whose <html> it can mark. */
const runPrePaint = (mocked, search) => {
  const marks = {};
  vm.runInNewContext(todayStripPrePaintScript(mocked), {
    URLSearchParams,
    window: { location: { search } },
    document: {
      documentElement: {
        setAttribute: (name, value) => {
          marks[name] = value;
        },
      },
    },
  });
  return marks;
};

test('the pre-paint script hides the strip outside October', () => {
  assert.deepEqual(runPrePaint(true, '?now=2026-10-09T15:30:00Z'), {});
  assert.deepEqual(runPrePaint(true, '?now=2026-11-02T12:00:00Z'), {
    [TODAY_STRIP_OFF_ATTRIBUTE]: 'true',
  });
  assert.deepEqual(runPrePaint(true, '?now=2026-09-28T12:00:00Z'), {
    [TODAY_STRIP_OFF_ATTRIBUTE]: 'true',
  });
});

test('the live build’s pre-paint script never reads ?now=', () => {
  assert.doesNotMatch(todayStripPrePaintScript(false), /URLSearchParams/);
  assert.match(todayStripPrePaintScript(true), /URLSearchParams/);
});

/* --- The cache ---------------------------------------------------------- */

const memoryStorage = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    raw: store,
  };
};

const SOURCE = 'https://api.example.invalid';
const cached = {
  at: 1_000_000,
  events: [{ id: 'kickoff' }],
  festDays: { '2026-10-10': { count: 1, cities: ['London'], more: false } },
};

test('the cache round-trips within its fifteen minutes', () => {
  const storage = memoryStorage();
  writeTodayCache(cached, { storage, source: SOURCE });

  assert.deepEqual(
    readTodayCache({ at: cached.at + 60_000, storage, source: SOURCE }),
    cached,
  );
  assert.equal(
    readTodayCache({
      at: cached.at + TODAY_STRIP_CACHE_TTL_MS,
      storage,
      source: SOURCE,
    }),
    null,
  );
  assert.equal(TODAY_STRIP_CACHE_TTL_MS, 15 * 60 * 1000);
});

test('the cache holds the raw events and the summary, nothing else', () => {
  const storage = memoryStorage();
  writeTodayCache(
    { ...cached, fests: [{ id: 'huge' }] },
    { storage, source: SOURCE },
  );
  assert.deepEqual(
    Object.keys(JSON.parse(storage.raw.get(TODAY_STRIP_CACHE_KEY))).sort(),
    ['at', 'events', 'festDays', 'source'],
  );
});

test('the cache ignores another build’s data, and garbage', () => {
  const storage = memoryStorage();
  writeTodayCache(cached, { storage, source: 'mocked' });
  assert.equal(
    readTodayCache({ at: cached.at, storage, source: SOURCE }),
    null,
  );

  storage.setItem(TODAY_STRIP_CACHE_KEY, '{not json');
  assert.equal(
    readTodayCache({ at: cached.at, storage, source: SOURCE }),
    null,
  );

  storage.setItem(
    TODAY_STRIP_CACHE_KEY,
    JSON.stringify({ source: SOURCE, at: cached.at, events: 'no' }),
  );
  assert.equal(
    readTodayCache({ at: cached.at, storage, source: SOURCE }),
    null,
  );
});

test('a storage that throws is no storage at all, never an error', () => {
  const hostile = {
    getItem: () => {
      throw new Error('SecurityError');
    },
    setItem: () => {
      throw new Error('QuotaExceededError');
    },
  };
  assert.doesNotThrow(() =>
    writeTodayCache(cached, { storage: hostile, source: SOURCE }),
  );
  assert.equal(
    readTodayCache({ at: cached.at, storage: hostile, source: SOURCE }),
    null,
  );
  assert.equal(
    readTodayCache({ at: cached.at, storage: null, source: SOURCE }),
    null,
  );
});
