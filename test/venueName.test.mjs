import assert from 'node:assert/strict';
import test from 'node:test';

import { venueNameFrom } from '../src/lib/venueName.mjs';

/* Address line one is a venue for some Fests and a street for others. Both
   shapes are in the live data: "Flatiron Building" against "130 St George
   St". Only the first is worth pulling out and setting in bold. */
test('takes a line that names a place', () => {
  assert.equal(venueNameFrom('Flatiron Building'), 'Flatiron Building');
  assert.equal(venueNameFrom('iHub'), 'iHub');
  assert.equal(venueNameFrom('Ministry of Startups'), 'Ministry of Startups');
  assert.equal(venueNameFrom('Alte Münze'), 'Alte Münze');
});

/* A house number and a street is an address, not a name. Bolding it and
   then repeating the city underneath reads as a mistake. */
test('refuses a line that opens with a street number', () => {
  assert.equal(venueNameFrom('130 St George St'), null);
  assert.equal(venueNameFrom('79 Borough Rd'), null);
  assert.equal(venueNameFrom('10 Grand Army Plaza'), null);
  assert.equal(venueNameFrom('1600 Pennsylvania Ave NW'), null);
});

/* Digits are only a street number when a space follows them. A name that
   merely starts with digits is still a name — and this one is real. */
test('keeps a name that begins with digits but is not a number', () => {
  assert.equal(venueNameFrom('91springboard'), '91springboard');
  assert.equal(venueNameFrom('42 West'), null);
});

test('junk degrades rather than throwing', () => {
  assert.equal(venueNameFrom(null), null);
  assert.equal(venueNameFrom(''), null);
  assert.equal(venueNameFrom('   '), null);
  assert.equal(venueNameFrom(7), null);
});
