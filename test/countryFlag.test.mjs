import assert from 'node:assert/strict';
import test from 'node:test';

import { countryCodeFor } from '../src/lib/countryFlag.mjs';

test('resolves the everyday names the API actually sends', () => {
  assert.equal(countryCodeFor('United States'), 'us');
  assert.equal(countryCodeFor('United Kingdom'), 'gb');
  assert.equal(countryCodeFor('Kenya'), 'ke');
  assert.equal(countryCodeFor('India'), 'in');
  assert.equal(countryCodeFor('Brazil'), 'br');
  assert.equal(countryCodeFor('Philippines'), 'ph');
  assert.equal(countryCodeFor('Australia'), 'au');
});

test('resolves ISO long forms and their comma-free prefixes', () => {
  assert.equal(countryCodeFor('United States of America'), 'us');
  assert.equal(countryCodeFor('Bolivia, Plurinational State of'), 'bo');
  assert.equal(countryCodeFor('Bolivia'), 'bo');
  assert.equal(countryCodeFor('Tanzania'), 'tz');
  assert.equal(countryCodeFor('Iran'), 'ir');
  assert.equal(countryCodeFor('Taiwan'), 'tw');
});

test('resolves common aliases and short names', () => {
  assert.equal(countryCodeFor('USA'), 'us');
  assert.equal(countryCodeFor('U.S.A.'), 'us');
  assert.equal(countryCodeFor('UK'), 'gb');
  assert.equal(countryCodeFor('England'), 'gb');
  assert.equal(countryCodeFor('South Korea'), 'kr');
  assert.equal(countryCodeFor('North Korea'), 'kp');
  assert.equal(countryCodeFor('Russia'), 'ru');
  assert.equal(countryCodeFor('Vietnam'), 'vn');
  assert.equal(countryCodeFor('Czech Republic'), 'cz');
  assert.equal(countryCodeFor('Turkey'), 'tr');
});

test('is case-insensitive and tolerant of accents and punctuation', () => {
  assert.equal(countryCodeFor('  united STATES '), 'us');
  assert.equal(countryCodeFor('Türkiye'), 'tr');
  assert.equal(countryCodeFor('Côte d’Ivoire'), 'ci');
  assert.equal(countryCodeFor('Ivory Coast'), 'ci');
  assert.equal(countryCodeFor('The Netherlands'), 'nl');
  assert.equal(countryCodeFor('St Lucia'), 'lc');
});

test('passes bare alpha-2 codes through', () => {
  assert.equal(countryCodeFor('US'), 'us');
  assert.equal(countryCodeFor('gb'), 'gb');
});

test('returns null rather than guessing', () => {
  assert.equal(countryCodeFor('Narnia'), null);
  /* Prefixes two ISO entries (British and U.S.), so it stays unresolved. */
  assert.equal(countryCodeFor('Virgin Islands'), null);
  assert.equal(countryCodeFor(''), null);
  assert.equal(countryCodeFor('   '), null);
  assert.equal(countryCodeFor(null), null);
  assert.equal(countryCodeFor(undefined), null);
  assert.equal(countryCodeFor(42), null);
});
