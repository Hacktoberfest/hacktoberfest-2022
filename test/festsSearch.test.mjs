import assert from 'node:assert/strict';
import test from 'node:test';

import { filterFests } from '../src/lib/festsSearch.mjs';

const FESTS = [
  {
    id: 'a',
    name: 'Hacktober Fest Brooklyn',
    city: 'Brooklyn',
    state: 'New York',
    country: 'United States',
  },
  {
    id: 'b',
    name: 'Hacktober Fest London',
    city: 'London',
    state: null,
    country: 'United Kingdom',
  },
  {
    id: 'c',
    name: 'Hacktober Fest São Paulo',
    city: 'São Paulo',
    state: null,
    country: 'Brazil',
  },
];

test('empty or whitespace query returns every fest', () => {
  assert.deepEqual(filterFests(FESTS, ''), FESTS);
  assert.deepEqual(filterFests(FESTS, '   '), FESTS);
});

test('matches case-insensitively on name, city, or country', () => {
  assert.deepEqual(
    filterFests(FESTS, 'brooklyn').map((f) => f.id),
    ['a'],
  );
  assert.deepEqual(
    filterFests(FESTS, 'LONDON').map((f) => f.id),
    ['b'],
  );
  assert.deepEqual(
    filterFests(FESTS, 'united').map((f) => f.id),
    ['a', 'b'],
  );
});

/* The card prints "Brooklyn, New York, United States", so the state has to
   be searchable — a field shown but not matched is the search quietly
   disagreeing with the list under it. */
test('matches on the state the card displays', () => {
  assert.deepEqual(
    filterFests(FESTS, 'new york').map((f) => f.id),
    ['a'],
  );
});

/* Both directions: nobody should have to reproduce a diacritic to find a
   Fest, and someone whose keyboard does carry it should not be punished
   for using it. */
test('matches across diacritics in either the query or the data', () => {
  assert.deepEqual(
    filterFests(FESTS, 'sao paulo').map((f) => f.id),
    ['c'],
  );
  assert.deepEqual(
    filterFests(FESTS, 'São Paulo').map((f) => f.id),
    ['c'],
  );
  assert.deepEqual(
    filterFests(FESTS, 'SÃO').map((f) => f.id),
    ['c'],
  );
});

test('a fest missing a field is skipped rather than throwing', () => {
  const partial = [{ id: 'd', name: null, city: 'Lisbon' }];
  assert.deepEqual(
    filterFests(partial, 'lisbon').map((f) => f.id),
    ['d'],
  );
  assert.deepEqual(filterFests(partial, 'porto'), []);
});

test('a non-string query is coerced rather than throwing', () => {
  assert.deepEqual(filterFests(FESTS, null), FESTS);
  assert.deepEqual(filterFests(FESTS, undefined), FESTS);
  assert.deepEqual(filterFests(FESTS, 2026), []);
});

test('no match returns an empty list', () => {
  assert.deepEqual(filterFests(FESTS, 'nairobi'), []);
});
