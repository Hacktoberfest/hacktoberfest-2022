import assert from 'node:assert/strict';
import test from 'node:test';

import { mapHero } from '../src/data/content.mjs';
import { countRoll } from '../src/lib/countRoll.mjs';

/* The homepage headline rolls its count up on load like a counter wheel:
   only the digits that changed turn, one step at a time from the left,
   and the text the page carries is the new count from the start. */
test('countRoll turns only the digits that changed', () => {
  assert.deepEqual(countRoll('400+ Fests.', '300+'), [
    { text: '4', from: '3', via: [], turn: 0 },
    { text: '00+ Fests.' },
  ]);
  assert.deepEqual(countRoll('409+', '400+'), [
    { text: '40' },
    {
      text: '9',
      from: '0',
      via: ['1', '2', '3', '4', '5', '6', '7', '8'],
      turn: 0,
    },
    { text: '+' },
  ]);
});

/* 300+ reads 400+ before it reads 500+: a wheel shows every digit on its
   way, a turn each, and the next wheel waits for it. */
test('countRoll steps a wheel through the digits on its way', () => {
  assert.deepEqual(countRoll('500+ Fests.', '300+'), [
    { text: '5', from: '3', via: ['4'], turn: 0 },
    { text: '00+ Fests.' },
  ]);
  assert.deepEqual(countRoll('450+ Fests.', '300+'), [
    { text: '4', from: '3', via: [], turn: 0 },
    { text: '5', from: '0', via: ['1', '2', '3', '4'], turn: 1 },
    { text: '0+ Fests.' },
  ]);
  assert.deepEqual(countRoll('620+', '300+'), [
    { text: '6', from: '3', via: ['4', '5'], turn: 0 },
    { text: '2', from: '0', via: ['1'], turn: 3 },
    { text: '0+' },
  ]);
});

test('countRoll leaves the text alone when there is nothing to roll', () => {
  assert.deepEqual(countRoll('400+ Fests.'), [{ text: '400+ Fests.' }]);
  assert.deepEqual(countRoll('400+ Fests.', '400+'), [{ text: '400+ Fests.' }]);
  assert.deepEqual(countRoll('1,000+ Fests.', '900+'), [
    { text: '1,000+ Fests.' },
  ]);
  assert.deepEqual(countRoll('Fests near you', '300+'), [
    { text: 'Fests near you' },
  ]);
});

/* Whatever rolls, the parts read back as the headline itself, so the
   words on the page never depend on the animation. */
test('the hero headline rolls up and still reads as its own words', () => {
  const parts = countRoll(mapHero.heading.lead, mapHero.heading.rollFrom);
  assert.ok(parts.some((part) => part.from));
  assert.equal(parts.map((part) => part.text).join(''), mapHero.heading.lead);
});
