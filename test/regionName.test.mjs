import assert from 'node:assert/strict';
import test from 'node:test';

import { regionName } from '../src/lib/regionName.mjs';

/* The live API sends "ON" for one Toronto Fest and "Ontario" for another,
   so the same province reads two ways in one list. */
test('expands US state and Canadian province codes', () => {
  assert.equal(regionName('ON'), 'Ontario');
  assert.equal(regionName('NY'), 'New York');
  assert.equal(regionName('CA'), 'California');
  assert.equal(regionName('BC'), 'British Columbia');
  assert.equal(regionName('QC'), 'Quebec');
});

test('is case-insensitive and tolerates surrounding space', () => {
  assert.equal(regionName('on'), 'Ontario');
  assert.equal(regionName(' ny '), 'New York');
});

/* Anything already spelled out, or from a country that does not abbreviate,
   passes through untouched. Expanding must never be able to make a state
   worse than it arrived. */
test('leaves anything it does not recognise alone', () => {
  assert.equal(regionName('Ontario'), 'Ontario');
  assert.equal(regionName('Karnataka'), 'Karnataka');
  assert.equal(regionName('New South Wales'), 'New South Wales');
  assert.equal(regionName('ZZ'), 'ZZ');
});

test('junk degrades rather than throwing', () => {
  assert.equal(regionName(null), null);
  assert.equal(regionName(''), null);
  assert.equal(regionName(42), null);
});
