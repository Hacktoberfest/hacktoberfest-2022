import assert from 'node:assert/strict';
import test from 'node:test';

import { faq, inPerson } from '../src/data/content.mjs';

/* The in-person landing page's copy: the same voice checks the online
   page holds itself to, and the same wiring. It may name the two Fest
   formats, since they are what a visitor chooses between, but never a
   session, a date or a specific Fest. */
const collectStrings = (value, acc = []) => {
  if (typeof value === 'string') acc.push(value);
  else if (Array.isArray(value))
    value.forEach((item) => collectStrings(item, acc));
  else if (value && typeof value === 'object')
    Object.values(value).forEach((item) => collectStrings(item, acc));
  return acc;
};

test('the copy keeps the house voice', () => {
  const prose = collectStrings(inPerson).join(' ');
  assert.doesNotMatch(prose, /Meet Up/, 'the word is Meetup');
  assert.doesNotMatch(prose, /—/, 'no em dashes in new copy');
  assert.doesNotMatch(prose, /[^\\]'/, 'apostrophes are curly');
  assert.doesNotMatch(prose, /virtual/i);
});

test('the page names no session, date or specific Fest', () => {
  const prose = collectStrings(inPerson).join(' ');
  assert.doesNotMatch(prose, /\b\d{1,2}\s+Oct\b|\bOct(ober)?\s+\d{1,2}\b/);
  assert.doesNotMatch(prose, /Global Hack Week|DEV Challenges|Dev Relay/);
  assert.doesNotMatch(prose, /Brooklyn|London|Nairobi/);
});

test('every FAQ id on the page resolves to a real item, the practical ones first', () => {
  inPerson.faq.ids.forEach((id) => {
    assert.ok(
      faq.items.some((item) => item.id === id),
      `${id} is not in faq.items`,
    );
  });
  assert.equal(inPerson.faq.ids[0], 'is-it-free');
  assert.ok(inPerson.faq.ids.includes('what-is-a-fest'));
  assert.ok(inPerson.faq.ids.includes('fest-formats'));
});

test('the hero carries two prints and the pack sticker peels', () => {
  assert.equal(inPerson.hero.object, 'prints');
  assert.equal(inPerson.hero.photos.length, 2);
  inPerson.hero.photos.forEach((photo) => {
    assert.match(photo.src, /^\/host-strip-[a-z]+\.jpg$/);
    assert.ok(photo.alt.length > 10);
  });
  const earned = inPerson.complete.card.milestone2.stickers.filter(
    (sticker) => sticker.earned,
  );
  assert.deepEqual(earned, [{ type: 'inperson', art: 'pin', earned: true }]);
});

test('the rewards lead with the room’s own, and carry the pack and the prizes', () => {
  const ids = inPerson.rewards.items.map((item) => item.id);
  assert.equal(ids[0], 'tee');
  assert.ok(ids.includes('pack'));
  assert.ok(ids.includes('tee'));
  assert.ok(ids.includes('prizes'));
  const tee = inPerson.rewards.items.find((item) => item.id === 'tee');
  assert.match(tee.copy, /while supplies last/);
  assert.equal(tee.where, 'In person only');
});

/* The first-visit pass: a Fest is defined in the hero, the cost is
   answered, the day is described before the word is used again, the
   register step is honest, and the close is a fork for the reader with
   no Fest nearby. */
test('the hero defines a Fest and answers the cost', () => {
  assert.match(inPerson.intro, /^A Fest is a free, one-day, in-person/);
  assert.equal(inPerson.facts[0], 'Free');
  assert.doesNotMatch(inPerson.heading.accent, /your city/);
});

test('what a Fest is like: the two formats, and nothing under them', () => {
  assert.deepEqual(
    inPerson.formats.cards.map((card) => card.tag),
    ['Hack Day', 'Meetup'],
  );
  inPerson.formats.cards.forEach((card) =>
    assert.ok(card.lines.length >= 2, card.id),
  );
  assert.equal(inPerson.formats.bring, undefined);
  assert.equal(inPerson.formats.who, undefined);
  assert.equal(inPerson.thenNow.late, true);
});

test('the register step is honest, and the close is a fork', () => {
  const register = inPerson.earn.steps[1];
  assert.match(register.title, /Fest’s page/);
  assert.doesNotMatch(register.title, /MyMLH/);
  assert.equal(inPerson.faq.ids[0], 'is-it-free');
  assert.ok(inPerson.faq.ids.includes('what-to-bring'));
  assert.match(inPerson.onlineCallout.title, /No Fest near you/);
  assert.equal(inPerson.onlineCallout.secondaryCta, 'Host a Fest');
  assert.ok(inPerson.nearby.cta);
});

test('three steps, two cards, and the page ends pointing online', () => {
  assert.equal(inPerson.earn.steps.length, 3);
  assert.deepEqual(
    inPerson.thenNow.cards.map((card) => card.id),
    ['then', 'now'],
  );
  assert.match(inPerson.onlineCallout.cta, /online/i);
});
