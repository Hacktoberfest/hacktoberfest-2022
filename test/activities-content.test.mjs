import assert from 'node:assert/strict';
import test from 'node:test';

import { activitiesPage } from '../src/data/content.mjs';
import { TYPE_ORDER } from '../src/lib/activityFilters.mjs';

/* Copy shape, and the voice rules every band follows. */

test('the page has its meta and hero', () => {
  assert.match(activitiesPage.title, /Hacktoberfest 2026/);
  assert.ok(activitiesPage.description.length > 40);
  assert.match(activitiesPage.eyebrow, /^Attend online/);
  assert.equal(activitiesPage.heading.lead, 'Every sticker,');
  assert.equal(activitiesPage.heading.accent, 'and how to earn it.');
  assert.match(activitiesPage.intro, /virtual sticker/);
});

test('the meta description names every kind of sticker, surveys included', () => {
  assert.match(
    activitiesPage.description,
    /tools to connect, surveys, and Fests in person/,
  );
});

/* How it works is the homepage's own band (HomeStepsBand), so this page
   keeps no copy of it: nothing here to drift from the homepage's. */
test('the how-it-works band is the homepage’s, with no copy of its own', () => {
  assert.equal(activitiesPage.how, undefined);
});

test('sources are named in words a participant would use', () => {
  assert.deepEqual(Object.keys(activitiesPage.list.source).sort(), [
    'api',
    'event_checkins',
    'import',
    'manual',
    'mlh',
    'webhook',
  ]);
  for (const value of Object.values(activitiesPage.list.source)) {
    assert.doesNotMatch(value, /sweep|import|api|manual|webhook/i);
  }
});

test('the failed-fetch notice has its retry word', () => {
  assert.ok(activitiesPage.list.unknown.length > 10);
  assert.equal(activitiesPage.list.retry, 'Try again');
});

/* JSON.stringify drops function values entirely, so it silently skips
   how.steps and list.filters.chip (and any function-valued copy added later) —
   exactly the sort of place a straight apostrophe could hide. This walks
   the object collecting every string instead, then adds the two
   functions' own output by calling them with a representative argument. */
const collectStrings = (value, acc = []) => {
  if (typeof value === 'string') {
    acc.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, acc));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectStrings(item, acc));
  }
  return acc;
};

/* The vocabulary is the site's one story: you complete challenges and
   earn stickers, and "activity" is never said to a participant, except
   as the page's own name (the nav's entry, so the title and the eyebrow
   keep it). Every band carries an eyebrow, and the milestones band
   points at both worlds. */
test('stickers are stickers, and the bands have their eyebrows', () => {
  const { title, eyebrow, ...copy } = activitiesPage;
  assert.match(title, /Activities/);
  assert.match(eyebrow, /Activities/);
  const strings = collectStrings(copy);
  strings.push(activitiesPage.strip.count(1, 4));
  const prose = strings.join(' ');
  assert.doesNotMatch(prose, /\bactivit(y|ies)\b/i);
  assert.ok(activitiesPage.list.eyebrow);
  /* The milestones band came off the page: the rewards live on the two
     landing pages, where the whole story is. */
  assert.equal(activitiesPage.get, undefined);
});

test('the copy keeps the house voice', () => {
  const strings = collectStrings(activitiesPage);
  strings.push(activitiesPage.list.filters.chip('Online', 2));
  strings.push(activitiesPage.strip.count(3, 4));
  const prose = strings.join(' ');
  assert.doesNotMatch(prose, /hack\s*day/i);
  assert.doesNotMatch(prose, /Meet Up/);
  assert.doesNotMatch(prose, /—/, 'no em dashes in new copy');
  assert.doesNotMatch(prose, /[^\\]'/, 'apostrophes are curly');
});

test('every type has a label, and the chips have their words', () => {
  TYPE_ORDER.forEach((type) => {
    assert.ok(activitiesPage.list.types[type], `${type} has no label`);
  });
  assert.equal(activitiesPage.list.filters.all, 'All');
  assert.equal(activitiesPage.list.filters.todo, 'Still to do');
  assert.equal(activitiesPage.list.filters.chip('Online', 2), 'Online · 2');
  assert.ok(activitiesPage.list.filters.empty.length > 10);
  assert.equal(activitiesPage.list.earned, 'Earned');
  assert.equal(activitiesPage.list.doneOn, undefined, 'the done line is gone');
});

test('the strip line counts stickers, and the strip itself is off this page', () => {
  assert.equal(activitiesPage.strip.count(3, 4), '3 of 4 stickers earned');
  assert.equal(activitiesPage.strip.hubCta, undefined);
});
