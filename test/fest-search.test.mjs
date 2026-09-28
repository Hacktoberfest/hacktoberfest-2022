import assert from 'node:assert/strict';
import test from 'node:test';

import {
  countrySuggestions,
  festTitle,
  foldText,
  matchRange,
  nearestFests,
  searchFests,
  startsAWord,
} from '../src/lib/festSearch.mjs';
import { filterFests } from '../src/lib/festsSearch.mjs';

/* The homepage search (lib/festSearch). It must agree with the directory
   about what matches, since its "See all" hands over to /fests/?q=, and
   it adds only order and shortcuts on top. */

const fest = (id, overrides) => ({
  id,
  name: `Hacktoberfest Hack Day ${id}`,
  hostedBy: null,
  city: null,
  state: null,
  country: null,
  date: '2026-10-10',
  lat: null,
  lng: null,
  ...overrides,
});

const FESTS = [
  fest('toronto-1', {
    name: 'Hacktoberfest Hack Day Toronto',
    hostedBy: 'ElleHacks',
    city: 'Toronto',
    state: 'Ontario',
    country: 'Canada',
    date: '2026-10-10',
    lat: 43.65,
    lng: -79.38,
  }),
  fest('toronto-2', {
    name: 'Hacktoberfest Hack Day Toronto',
    hostedBy: 'HuskyHack',
    city: 'Toronto',
    state: 'Ontario',
    country: 'Canada',
    date: '2026-10-23',
    lat: 43.66,
    lng: -79.4,
  }),
  fest('guelph', {
    name: 'Hacktoberfest Hack Day Guelph',
    hostedBy: 'GDG on Campus Guelph',
    city: 'Guelph',
    state: 'Ontario',
    country: 'Canada',
    date: '2026-10-19',
    lat: 43.54,
    lng: -80.25,
  }),
  fest('sao-paulo', {
    name: 'Hacktoberfest Meetup São Paulo',
    hostedBy: 'Campus Party',
    city: 'São Paulo',
    state: 'São Paulo',
    country: 'Brazil',
    date: '2026-10-24',
    lat: -23.55,
    lng: -46.63,
  }),
  fest('delhi-1', {
    name: 'Hacktoberfest Hack Day Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    date: '2026-10-03',
    lat: 28.61,
    lng: 77.21,
  }),
  fest('delhi-2', {
    name: 'Hacktoberfest Hack Day Noida',
    hostedBy: 'Indian Institute',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    date: '2026-10-17',
    lat: 28.53,
    lng: 77.39,
  }),
  fest('mumbai', {
    name: 'Hacktoberfest Hack Day Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    date: '2026-10-31',
    lat: 19.07,
    lng: 72.87,
  }),
];

test('the fold matches the directory: accents off, lower case', () => {
  assert.equal(foldText('São Paulo'), 'sao paulo');
  assert.equal(foldText(null), '');
});

test('an empty query is the list’s own state, not a search', () => {
  assert.equal(searchFests(FESTS, ''), null);
  assert.equal(searchFests(FESTS, '   '), null);
});

test('the total is always the directory’s own count for the query', () => {
  ['toron', 'sao', 'ind', 'a', 'on', 'hack', 'zzz'].forEach((query) => {
    const result = searchFests(FESTS, query);
    assert.equal(result.total, filterFests(FESTS, query).length, query);
  });
});

test('one or two letters match the start of a word only', () => {
  // "on" is inside "Toronto", "Ontario" and "London", but only starts Ontario.
  const result = searchFests(FESTS, 'on');
  assert.ok(result.fests.every(({ fest: f }) => f.state === 'Ontario'));
  assert.equal(result.total, filterFests(FESTS, 'on').length);
  assert.ok(startsAWord('Ontario', 'on'));
  assert.ok(!startsAWord('Toronto', 'on'));
});

test('a city the query starts comes first, as one place row with its count', () => {
  const result = searchFests(FESTS, 'toron');
  assert.deepEqual(
    result.places.map((place) => [
      place.kind,
      place.name,
      place.region,
      place.country,
      place.count,
    ]),
    [['city', 'Toronto', 'Ontario', 'Canada', 2]],
  );
  assert.deepEqual(
    result.fests.map(({ fest: f }) => f.id),
    ['toronto-1', 'toronto-2'],
  );
});

test('countries are places too, busiest first, two at most', () => {
  const result = searchFests(FESTS, 'ind');
  assert.equal(result.places[0].kind, 'country');
  assert.equal(result.places[0].name, 'India');
  assert.equal(result.places[0].count, 3);
  assert.ok(result.places.length <= 2);
});

test('word-start matches rank above ones that merely contain the query', () => {
  // "hack" starts nothing in a title or place here, so all are one tier and
  // go by date; "gue" starts Guelph and is contained by nothing else.
  const result = searchFests(FESTS, 'gue');
  assert.equal(result.fests[0].fest.id, 'guelph');
});

test('past Fests go last, then soonest first', () => {
  const result = searchFests(FESTS, 'india', { today: '2026-10-10' });
  assert.deepEqual(
    result.fests.map(({ fest: f }) => f.id),
    ['delhi-2', 'mumbai', 'delhi-1'],
  );
});

test('nearest first once the visitor has shared a location', () => {
  const origin = { lat: 43.55, lng: -80.2 }; // just by Guelph
  const result = searchFests(FESTS, 'ontario', { origin });
  assert.equal(result.fests[0].fest.id, 'guelph');
  assert.ok(result.fests[0].km < 10);
});

test('the bold range lands on the typed characters, accents and all', () => {
  assert.deepEqual(matchRange('São Paulo', 'sao'), [0, 3]);
  assert.deepEqual(matchRange('San Francisco', 'san fr'), [0, 6]);
  // Prefers the occurrence that starts a word.
  assert.deepEqual(matchRange('Toronto x Ontario Hacks', 'on'), [10, 12]);
  assert.equal(matchRange('Toronto', 'zzz'), null);
  assert.equal(matchRange(null, 'to'), null);
});

test('a Fest’s title is its short name and its host', () => {
  assert.equal(festTitle(FESTS[0]), 'Toronto x ElleHacks');
  assert.equal(festTitle(FESTS[4]), 'Delhi');
});

test('before typing, the countries with the most Fests', () => {
  assert.deepEqual(
    countrySuggestions(FESTS).map((c) => [c.name, c.count]),
    [
      ['Canada', 3],
      ['India', 3],
      ['Brazil', 1],
    ],
  );
  assert.equal(countrySuggestions(FESTS, { count: 1 }).length, 1);
  assert.deepEqual(countrySuggestions(null), []);
});

test('the nearest upcoming Fests to a shared location', () => {
  const near = nearestFests(
    FESTS,
    { lat: 43.65, lng: -79.38 },
    { count: 2, today: '2026-10-11' },
  );
  // Toronto x ElleHacks (10 Oct) is past by the 11th.
  assert.deepEqual(
    near.map(({ fest: f }) => f.id),
    ['toronto-2', 'guelph'],
  );
  assert.deepEqual(nearestFests(FESTS, null), []);
});
