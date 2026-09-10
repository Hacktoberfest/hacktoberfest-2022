import assert from 'node:assert/strict';
import test from 'node:test';

import { faq, online } from '../src/data/content.mjs';

/* The online landing page's copy: the same voice checks the activities
   page holds itself to, and the wiring the page relies on (FAQ ids that
   resolve, three steps, two then-and-now cards). */
const collectStrings = (value, acc = []) => {
  if (typeof value === 'string') acc.push(value);
  else if (Array.isArray(value))
    value.forEach((item) => collectStrings(item, acc));
  else if (value && typeof value === 'object')
    Object.values(value).forEach((item) => collectStrings(item, acc));
  return acc;
};

test('the copy keeps the house voice', () => {
  const prose = collectStrings(online).join(' ');
  assert.doesNotMatch(prose, /hack\s*day/i);
  assert.doesNotMatch(prose, /Meet Up/);
  assert.doesNotMatch(prose, /—/, 'no em dashes in new copy');
  assert.doesNotMatch(prose, /[^\\]'/, 'apostrophes are curly');
  assert.doesNotMatch(prose, /virtual/i, 'the site says online, not virtual');
});

test('the page names no session or date', () => {
  /* Programme names (Global Hack Week, DEV Challenges) are fine: the
     "what happens" band shows them. Dates and session names are not. */
  const prose = collectStrings(online).join(' ');
  assert.doesNotMatch(prose, /\b\d{1,2}\s+Oct\b|\bOct(ober)?\s+\d{1,2}\b/);
  assert.doesNotMatch(prose, /Opening Ceremony|Maintainers Live|Kickoff/);
});

/* Each world speaks for itself: everything about Fests lives on
   /in-person, and the online page's one pointer at them is the callout
   that closes it, whose copy is schedule.festsCallout, not this. */
test('the online page never mentions Fests or being in person, outside the rewards', () => {
  /* The rewards band is the one place it may: the T-shirt is a reward
     only a Fest gives, and a rewards list that hid it would be lying. */
  const { rewards, ...rest } = online;
  const prose = collectStrings(rest).join(' ');
  assert.doesNotMatch(prose, /\bFests?\b/);
  assert.doesNotMatch(prose, /in[ -]person/i);
  assert.match(rewards.ghost.title, /T.shirt/);
  assert.equal(rewards.ghost.href, '/in-person/');
});

/* The page as a first visit: what it is before what changed, the facts
   strip, the kinds of activity with a time and a reward each, the
   sign-in beside the step that explains it, and a close of its own. */
test('the hero says what it is, and asks for nothing yet', () => {
  assert.match(online.intro, /^Hacktoberfest is a free/);
  assert.ok(online.introShort.length < online.intro.length);
  assert.equal(online.facts.length, 4);
  assert.equal(online.ctaHref, '/schedule/');
  assert.equal(online.secondaryHref, '#how-it-works');
  assert.doesNotMatch(online.cta + online.secondaryCta, /MyMLH/);
});

test('what happens online: three named things, each with a time and what it counts for, then the rest', () => {
  assert.deepEqual(
    online.happens.items.map((item) => item.title),
    ['Livestreams', 'Global Hack Week', 'DEV Challenges'],
  );
  assert.equal(online.happens.more.href, '/activities/');
  online.happens.items.forEach((item) => {
    assert.ok(item.time, `${item.id} has no time`);
    assert.ok(item.earns, `${item.id} says nothing about what it earns`);
    assert.match(item.href, /^\/(schedule|activities)\/$/);
  });
});

test('the sign-in lives in How it works, and the page has no closing band', () => {
  assert.equal(online.earn.signIn.href, '/login/');
  assert.equal(online.closing, undefined);
  assert.equal(online.thenNow.late, true);
  assert.equal(online.faq.ids[0], 'what-is-hacktoberfest');
  assert.ok(online.faq.ids.includes('what-is-mymlh'));
  assert.equal(online.learn, undefined);
});

test('the rewards are introduced before the steps: two cards, then the ghost', () => {
  assert.deepEqual(
    online.rewards.items.map((item) => item.id),
    ['pack', 'badges'],
  );
  online.rewards.items.forEach((item) => {
    assert.ok(item.where, `${item.id} has no where chip`);
    assert.ok(item.art, `${item.id} has no art`);
  });
  /* The intro promises rewards; the rewards band, not the intro, is
     where the pack is introduced. */
  assert.match(online.intro, /rewards/);
});

test('every FAQ id on the page resolves to a real item', () => {
  online.faq.ids.forEach((id) => {
    assert.ok(
      faq.items.some((item) => item.id === id),
      `${id} is not in faq.items`,
    );
  });
  assert.ok(online.faq.ids.includes('why-moving-away-from-prs'));
});

test('the new FAQ answers the Fest question without promising a T-shirt online', () => {
  const item = faq.items.find((entry) => entry.id === 'need-a-fest');
  assert.ok(item);
  assert.equal(item.section, 'general');
  assert.match(item.answer[0].text, /^No\./);
});

test('three steps, two cards, one quote', () => {
  assert.equal(online.earn.steps.length, 3);
  assert.deepEqual(
    online.thenNow.cards.map((card) => card.id),
    ['then', 'now'],
  );
  assert.ok(online.thenNow.quote.accent.endsWith('.'));
});
