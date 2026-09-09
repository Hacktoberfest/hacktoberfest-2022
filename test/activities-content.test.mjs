import assert from 'node:assert/strict';
import test from 'node:test';

import { activitiesPage } from '../src/data/content.mjs';

/* Copy shape, and the voice rules every band follows. */

test('the page has its meta and hero', () => {
  assert.match(activitiesPage.title, /Hacktoberfest 2026/);
  assert.ok(activitiesPage.description.length > 40);
  assert.equal(activitiesPage.eyebrow, 'Attend online');
  assert.equal(activitiesPage.heading.lead, 'Earn your');
  assert.equal(activitiesPage.heading.accent, 'stickers.');
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

test('the milestone slot has an error notice with a retry', () => {
  assert.ok(activitiesPage.how.error.body.length > 10);
  assert.equal(activitiesPage.how.error.cta, 'Try again');
});

test('the copy keeps the house voice', () => {
  const prose = JSON.stringify(activitiesPage);
  assert.doesNotMatch(prose, /hack\s*day/i);
  assert.doesNotMatch(prose, /Meet Up/);
  assert.doesNotMatch(prose, /—/, 'no em dashes in new copy');
  assert.doesNotMatch(prose, /[^\\]'/, 'apostrophes are curly');
});
