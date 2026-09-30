import assert from 'node:assert/strict';
import test from 'node:test';

import { answerText, faq, inPerson, schedule } from '../src/data/content.mjs';
import { DAY_ICONS } from '../src/components/WorldLanding/dayIcons.js';

/* The in-person landing page's copy: the same voice checks the online
   page holds itself to, and the same wiring. It may name the two Fest
   formats, since they are what a visitor chooses between, but never a
   session, a date or a specific Fest. */
/* Paths (hrefs, art slugs) are wiring, not copy, so they stay out. */
const collectStrings = (value, acc = []) => {
  if (typeof value === 'string') {
    if (!value.startsWith('/')) acc.push(value);
  } else if (Array.isArray(value))
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
  /* Counts are digits, the way the rest of the site says them. */
  assert.doesNotMatch(prose, /\b(twelve|ten|fifteen|seventeen|twenty)\b/i);
  assert.doesNotMatch(prose, /\bactivit(y|ies)\b/i);
});

test('the page names no session, date or specific Fest', () => {
  const prose = collectStrings(inPerson).join(' ');
  assert.doesNotMatch(prose, /\b\d{1,2}\s+Oct\b|\bOct(ober)?\s+\d{1,2}\b/);
  assert.doesNotMatch(prose, /Global Hack Week|DEV Challenges|Dev Relay/);
  assert.doesNotMatch(prose, /Brooklyn|London|Nairobi/);
});

/* Swag, stickers, T-shirts and Arduinos are available at Fests while
   supplies last. Nothing on the page promises one to anyone. */
test('swag is available while supplies last, never promised', () => {
  const prose = collectStrings(inPerson).join(' ');
  const mentions = prose.match(/T.shirts?/gi) || [];
  assert.ok(mentions.length >= 2, 'the T-shirt is mentioned');
  assert.doesNotMatch(
    prose,
    /hands? out|eligible for a T.shirt|makes you eligible/i,
  );
  assert.match(inPerson.intro, /take home swag while supplies last/);
  inPerson.onTheDay.cards
    .filter((card) => card.id !== 'prizes' && card.id !== 'virtual')
    .forEach((card) => assert.match(card.copy, /while supplies last/, card.id));
});

test('every FAQ id on the page resolves to a real item, the practical ones first', () => {
  inPerson.faq.ids.forEach((id) => {
    assert.ok(
      faq.items.some((item) => item.id === id),
      `${id} is not in faq.items`,
    );
  });
  assert.ok(inPerson.faq.ids.length <= 5, 'the page shows five at most');
  assert.equal(inPerson.faq.ids[0], 'is-it-free');
  assert.ok(inPerson.faq.ids.includes('event-details'));
  assert.ok(inPerson.faq.ids.includes('tshirts-and-swag'));
  assert.ok(inPerson.faq.ids.includes('fest-help'));
});

/* The room first: the hero sells the people and the swag, and the
   sticker book waits for the aside beside the steps. */
test('the hero carries two prints, sells the room, and has no facts strip', () => {
  assert.equal(inPerson.hero.object, 'prints');
  assert.equal(inPerson.hero.photos.length, 2);
  inPerson.hero.photos.forEach((photo) => {
    assert.match(photo.src, /^\/host-strip-[a-z]+\.jpg$/);
    assert.ok(photo.alt.length > 10);
  });
  assert.match(inPerson.intro, /^A Fest is a free, one-day, in-person/);
  assert.match(inPerson.intro, /meet your community/);
  assert.doesNotMatch(inPerson.intro, /sticker book|virtual/);
  assert.equal(inPerson.facts, null);
  assert.match(inPerson.eyebrow, /· Free$/);
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
  assert.match(inPerson.formats.intro, /Fest format/);
  assert.equal(inPerson.formats.bring, undefined);
  assert.equal(inPerson.formats.who, undefined);
});

/* On the day: the room's own rewards, four cards, none of them a
   sticker: each carries a plain icon (components/WorldLanding/dayIcons).
   Every card that can says "while supplies last", so no disclaimer. */
test('on the day: T-shirts and swag, Arduinos and prizes at a Hack Day, the virtual rewards', () => {
  const { cards, disclaimer } = inPerson.onTheDay;
  assert.deepEqual(
    cards.map((card) => card.id),
    ['swag', 'arduinos', 'prizes', 'virtual'],
  );
  assert.deepEqual(
    cards.map((card) => card.icon),
    ['hexagon', 'infinity', 'gift', 'rosette-discount-check'],
  );
  cards.forEach((card) => {
    assert.ok(DAY_ICONS[card.icon], `${card.icon} has no icon`);
    assert.equal(card.art, undefined, `${card.id} is not a sticker`);
    assert.ok(card.at && card.title && card.copy, card.id);
  });
  assert.equal(cards[1].at, 'Hack Days');
  assert.match(cards[1].copy, /select Hack Days/);
  assert.equal(cards[2].at, 'Hack Days');
  const virtual = cards[3];
  assert.match(virtual.copy, /sticker book/);
  assert.match(virtual.copy, /certificate/);
  assert.equal(virtual.link.href, '/my/');
  assert.equal(disclaimer, undefined);
});

/* How it works: three plain steps in two groups, the register step
   honest about where it happens, and the third step the day itself. No
   strip under them, no doors, no milestone card, no milestones band, no
   then-and-now. */
test('three steps in two phases, nothing under them', () => {
  assert.equal(inPerson.earn.heading.lead, 'Pick a Fest,');
  assert.equal(inPerson.earn.heading.accent, 'register, show up.');
  assert.equal(inPerson.earn.steps.length, 3);
  const register = inPerson.earn.steps[1];
  assert.match(register.title, /Fest’s page/);
  assert.doesNotMatch(register.title, /MyMLH/);
  assert.match(register.copy, /free MyMLH account/);
  assert.deepEqual(
    inPerson.earn.steps.map((step) => step.phase),
    ['Before the day', 'Before the day', 'On the day'],
  );
  const day = inPerson.earn.steps[2];
  assert.match(day.title, /^Learn, build, and connect/);
  assert.match(day.copy, /^Check in with your host/);
  const prose = collectStrings(inPerson.earn).join(' ');
  assert.doesNotMatch(prose, /\bdoor\b/i);
  assert.doesNotMatch(prose, /whole thing|is on the Fests page/);
  assert.equal(inPerson.earn.online, undefined);
  assert.equal(inPerson.earn.intro, undefined);
  assert.equal(inPerson.earn.aside, undefined);
  assert.equal(inPerson.earn.pace, undefined);
  assert.equal(inPerson.earn.earned, undefined);
  assert.equal(inPerson.complete, undefined);
  assert.equal(inPerson.thenNow, undefined);
  assert.equal(inPerson.rewards, undefined);
  assert.equal(inPerson.milestones, undefined);
});

test('the nearby band says how many, and the close is a fork', () => {
  assert.equal(inPerson.nearby.eyebrow, 'Where to go');
  assert.equal(inPerson.nearby.heading.accent, 'Fests.');
  assert.match(inPerson.nearby.intro, /300\+ Fests/);
  /* The button counts every Fest once they load, and says no number
     before then. */
  assert.equal(inPerson.nearby.cta(0), 'See every Fest');
  assert.equal(inPerson.nearby.cta(312), 'See every Fest (312)');
  assert.match(inPerson.onlineCallout.title, /No Fest near you/);
  assert.match(inPerson.onlineCallout.body, /earn stickers/);
  assert.match(inPerson.onlineCallout.cta, /online/i);
  assert.equal(inPerson.onlineCallout.secondaryCta, 'Host a Fest');
});

/* The FAQ answers this page borrows, read against how Fests work: a
   Fest check-in earns a certificate; T-shirts are while supplies last and
   not promised online; details and questions go to the Fest's page and
   its host; no "organizers". */
test('the borrowed FAQ answers tell the same story', () => {
  const answer = (id) =>
    answerText(faq.items.find((item) => item.id === id).answer);
  assert.match(answer('certificate'), /in-person participants/);
  assert.match(answer('tshirts-and-swag'), /while supplies last/);
  assert.match(answer('tshirts-and-swag'), /not promised to online/);
  assert.match(answer('event-details'), /accommodations/);
  assert.match(answer('fest-help'), /Contact Host/);
  assert.doesNotMatch(answer('is-it-free'), /activit/i);
  inPerson.faq.ids.forEach((id) =>
    assert.doesNotMatch(answer(id), /organi[sz]er/i, id),
  );
  /* And the schedule page's line, found on the way. */
  assert.doesNotMatch(schedule.countsNote.text, /activit/i);
  assert.match(schedule.countsNote.text, /its own sticker/);
});
