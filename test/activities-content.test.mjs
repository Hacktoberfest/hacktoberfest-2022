import assert from 'node:assert/strict';
import test from 'node:test';

import { activitiesPage } from '../src/data/content.mjs';
import { TYPE_ORDER } from '../src/lib/activityFilters.mjs';

/* Copy shape, and the voice rules every band follows. */

test('the page has its meta and hero', () => {
  assert.match(activitiesPage.title, /Hacktoberfest 2026/);
  assert.ok(activitiesPage.description.length > 40);
  assert.match(activitiesPage.eyebrow, /^Attend online/);
  assert.equal(activitiesPage.heading.lead, 'Do the activities,');
  assert.equal(activitiesPage.heading.accent, 'earn the rewards.');
});

test('the how-it-works steps read the threshold rather than hardcoding it', () => {
  const three = activitiesPage.how.steps(3);
  const five = activitiesPage.how.steps(5);
  assert.equal(three.length, 3);
  assert.ok(three.join(' ').includes('3'));
  assert.ok(five.join(' ').includes('5'));
  assert.ok(!three.join(' ').includes('5'));
});

test('sources are named in words a participant would use', () => {
  assert.deepEqual(Object.keys(activitiesPage.list.source).sort(), [
    'api',
    'event_checkins',
    'import',
    'manual',
  ]);
  for (const value of Object.values(activitiesPage.list.source)) {
    assert.doesNotMatch(value, /sweep|import|api|manual/i);
  }
});

test('the failed-fetch notice has its retry word', () => {
  assert.ok(activitiesPage.list.unknown.length > 10);
  assert.equal(activitiesPage.how.error.cta, 'Try again');
});

/* JSON.stringify drops function values entirely, so it silently skips
   how.steps and list.doneOn (and any function-valued copy added later) —
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

/* The vocabulary: you do activities; "sticker" only ever means the pack.
   Every band carries an eyebrow, and What you get points at both worlds. */
test('activities are activities, and the bands have their eyebrows', () => {
  const strings = collectStrings(activitiesPage);
  strings.push(activitiesPage.strip.count(1, 4));
  const prose = strings.join(' ');
  assert.doesNotMatch(
    prose,
    /stickers? (earned|go\b)|is a sticker|Every sticker/i,
  );
  assert.ok(activitiesPage.how.eyebrow);
  assert.ok(activitiesPage.list.eyebrow);
  assert.ok(activitiesPage.get.eyebrow);
  assert.deepEqual(
    activitiesPage.get.worlds.map((world) => world.href),
    ['/online/', '/in-person/'],
  );
});

test('the copy keeps the house voice', () => {
  const strings = collectStrings(activitiesPage);
  strings.push(...activitiesPage.how.steps(3));
  strings.push(activitiesPage.list.doneOn('October 5'));
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
  assert.equal(activitiesPage.list.earned, 'Done');
});

test('the strip counts activities and points at the hub', () => {
  assert.equal(activitiesPage.strip.count(3, 4), '3 of 4 activities done');
  assert.match(activitiesPage.strip.hubCta, /My Hacktoberfest/);
});
