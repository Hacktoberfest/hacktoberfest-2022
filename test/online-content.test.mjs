import assert from 'node:assert/strict';
import test from 'node:test';

import { activitiesPage, faq, my, online } from '../src/data/content.mjs';
import { ACTIVITIES, REQUIRED_STICKERS } from '../src/data/eligibility.mjs';
import { REWARD_STICKERS } from '../src/lib/stickerImage.mjs';
import { SCENARIOS } from '../src/data/fixtures.mjs';

/* The online landing page's copy: the same voice checks the activities
   page holds itself to, and the wiring the page relies on (FAQ ids that
   resolve, three steps, three milestones, the collection's pages). */
const collectStrings = (value, acc = []) => {
  if (typeof value === 'string') acc.push(value);
  else if (Array.isArray(value))
    value.forEach((item) => collectStrings(item, acc));
  else if (value && typeof value === 'object')
    Object.values(value).forEach((item) => collectStrings(item, acc));
  return acc;
};

const BOOK_SIZE = REQUIRED_STICKERS.length + ACTIVITIES.length;

test('the copy keeps the house voice', () => {
  const prose = collectStrings(online).join(' ');
  assert.doesNotMatch(prose, /hack\s*day/i);
  assert.doesNotMatch(prose, /Meet Up/);
  assert.doesNotMatch(prose, /—/, 'no em dashes in new copy');
  assert.doesNotMatch(prose, /[^\\]'/, 'apostrophes are curly');
  /* Counts are digits, the way the rest of the site says them. */
  assert.doesNotMatch(prose, /\b(ten|seventeen|twenty-two)\b/i);
});

test('the page names no session or date', () => {
  /* Programme names (Global Hack Week, DEV Challenges) are fine. Dates
     and session names are not. */
  const prose = collectStrings(online).join(' ');
  assert.doesNotMatch(prose, /\b\d{1,2}\s+Oct\b|\bOct(ober)?\s+\d{1,2}\b/);
  assert.doesNotMatch(prose, /Opening Ceremony|Maintainers Live|Kickoff/);
});

/* Each world speaks for itself: everything about Fests lives on
   /in-person. The online page's one pointer at them is the book band's
   last row, which says "in person" and nothing more; the callout that
   closes the page is the book's (online.bookCallout), and points at /my. */
test('the online page never mentions Fests, and says "in person" only in the last row', () => {
  const prose = collectStrings(online).join(' ');
  assert.doesNotMatch(prose, /\bFests?\b/);
  const { inPerson, ...collection } = online.collection;
  const rest = collectStrings({ ...online, collection }).join(' ');
  assert.doesNotMatch(rest, /in[ -]person/i);
  assert.equal(inPerson.title, 'In person');
  assert.match(inPerson.copy, /in person/);
  assert.equal(inPerson.cta, undefined, 'the row has no button');
});

/* The page as a first visit: what it is, then the deal, then the facts
   strip; the ask is starting the book, which is signing in. */
test('the hero says what it is, states the deal, and asks for the book', () => {
  assert.match(online.intro, /^Hacktoberfest is a free/);
  assert.match(online.intro, /virtual sticker/);
  assert.ok(online.introShort.length < online.intro.length);
  assert.equal(online.facts, null, 'no facts strip');
  assert.match(online.eyebrow, /· Free$/);
  assert.equal(online.ctaHref, '/login/');
  assert.equal(online.secondaryHref, '/activities/');
  assert.equal(online.hero.object, 'pile');
});

test('the pile is made of real stickers, from every ground the book has', () => {
  const known = [...REQUIRED_STICKERS, ...ACTIVITIES, ...REWARD_STICKERS].map(
    (sticker) => sticker.id,
  );
  assert.ok(online.pile.length >= 7);
  assert.equal(new Set(online.pile).size, online.pile.length, 'no repeats');
  online.pile.forEach((id) =>
    assert.ok(known.includes(id), `${id} is not a sticker`),
  );
  /* Nothing from the in-person page on the pile: this page never names
     Fests, and its pictures should not either. And neither required
     sticker: the pile is things to do. */
  const inPerson = ACTIVITIES.filter((a) => a.type === 'inperson').map(
    (a) => a.id,
  );
  const required = REQUIRED_STICKERS.map((sticker) => sticker.id);
  online.pile.forEach((id) => {
    assert.ok(!inPerson.includes(id), id);
    assert.ok(!required.includes(id), `${id} is required, not a thing to do`);
  });
});

test('no steps band: the milestones say how it works', () => {
  assert.equal(online.earn, undefined);
  assert.equal(online.milestones.eyebrow, 'How it works');
  assert.equal(online.complete, undefined);
  assert.equal(online.thenNow, undefined);
  assert.equal(online.rewards, undefined);
  assert.equal(online.happens, undefined);
  assert.equal(online.closing, undefined);
});

/* The milestones say the same counts /my does: the API's thresholds
   plus the two required stickers, in book units. */
test('the three milestones, with the counts /my counts', () => {
  const { thresholds } = SCENARIOS.eligible;
  const required = REQUIRED_STICKERS.length;
  assert.deepEqual(
    online.milestones.cards.map((card) => card.id),
    ['pack', 'complete', 'completionist'],
  );
  assert.deepEqual(
    online.milestones.cards.map((card) => card.art),
    ['milestone-pack', 'milestone-complete', 'milestone-completionist'],
  );
  const [pack, complete, completionist] = online.milestones.cards;
  assert.equal(pack.at, `Earn ${required + 1} stickers`);
  assert.equal(complete.at, `Earn ${thresholds.complete + required} stickers`);
  assert.equal(
    completionist.at,
    `Earn ${thresholds.completionist + required} stickers`,
  );
  assert.match(online.milestones.intro, /rather than opening pull requests/);
  assert.deepEqual(
    online.milestones.cards.map((card) => card.title),
    [
      my.rewards.pack.title,
      my.rewards.complete.title,
      my.rewards.completionist.title,
    ],
  );
  online.milestones.cards.forEach((card) => {
    assert.equal(card.when, undefined, `${card.id} has no line under the rule`);
  });
  assert.match(online.milestones.disclaimer, /8-12 weeks/);
  assert.equal(online.milestones.cards[0].title, 'Earn an IRL sticker pack');
});

test('the collection lists every page the book has for home, and counts the rest', () => {
  const { pages, inPerson, heading, intro } = online.collection;
  assert.deepEqual(pages, [
    'required',
    'livestreams',
    'dev',
    'ghw',
    'tools',
    'misc',
  ]);
  pages.forEach((type) => {
    assert.ok(activitiesPage.list.types[type], `${type} has no name`);
    assert.ok(my.album.pages[type], `${type} has no line`);
  });
  const inPersonCount = ACTIVITIES.filter((a) => a.type === 'inperson').length;
  assert.equal(heading.lead, `${BOOK_SIZE} stickers`);
  assert.match(intro, new RegExp(`^There are ${BOOK_SIZE} stickers`));
  assert.match(inPerson.copy, new RegExp(`^${inPersonCount} more stickers`));
  assert.equal(online.collection.ctaHref, '/activities/');
});

test('every FAQ id on the page resolves to a real item', () => {
  online.faq.ids.forEach((id) => {
    assert.ok(
      faq.items.some((item) => item.id === id),
      `${id} is not in faq.items`,
    );
  });
  assert.equal(online.faq.ids[0], 'what-is-hacktoberfest');
  assert.ok(online.faq.ids.includes('what-is-a-virtual-sticker'));
  assert.ok(online.faq.ids.includes('what-is-mymlh'));
  assert.ok(online.faq.ids.includes('why-moving-away-from-prs'));
});

test('the sticker FAQ says what one is and what the counts unlock', () => {
  const item = faq.items.find(
    (entry) => entry.id === 'what-is-a-virtual-sticker',
  );
  assert.ok(item);
  assert.equal(item.section, 'general');
  assert.match(item.answer[0].text, /12 hours/);
  assert.match(item.answer[0].text, /Completionist/);
});

test('the Fest FAQ answers without promising a T-shirt online', () => {
  const item = faq.items.find((entry) => entry.id === 'need-a-fest');
  assert.ok(item);
  assert.equal(item.section, 'general');
  assert.match(item.answer[0].text, /^No\./);
});
