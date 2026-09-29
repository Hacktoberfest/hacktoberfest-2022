import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EMPTY_FEST_DASHBOARD,
  FEST_DASHBOARDS,
  SCENARIOS,
} from '../src/data/fixtures.mjs';
import { normalizeDashboard } from '../src/lib/festDashboard.mjs';
import { usefulInfo } from '../src/lib/usefulInfo.mjs';

/* The mocked build's Useful info review links, one per row of the spec's
   table. Each dashboard is read through normalizeDashboard, as a live
   payload is, so a fixture that drifts from the API's shape fails here
   before anyone opens the page. */

const reviewed = (festId) =>
  usefulInfo(
    normalizeDashboard({
      fest: { id: festId },
      dashboard: FEST_DASHBOARDS[festId] || EMPTY_FEST_DASHBOARD,
    }).dashboard,
  );

const partnered = (key) => ({ deck: key, lines: ['openSourceAi', key] });

test('a Gemma Hack Day: fest-toronto', () => {
  assert.deepEqual(reviewed('fest-toronto'), partnered('gemma'));
});

test('a Hack Day with Gemma and Snowflake shows Gemma only: fest-guimaraes', () => {
  assert.deepEqual(FEST_DASHBOARDS['fest-guimaraes'].partners, [
    'snowflake',
    'gemma',
  ]);
  assert.deepEqual(reviewed('fest-guimaraes'), partnered('gemma'));
});

test('a Hack Day whose one partner is Snowflake: fest-braga', () => {
  assert.deepEqual(reviewed('fest-braga'), partnered('snowflake'));
});

test('a Hack Day with no partner: fest-tokyo', () => {
  assert.deepEqual(reviewed('fest-tokyo'), {
    deck: 'hackDay',
    lines: ['openSourceAi'],
  });
});

test('a Meetup MLH lists all four partners on shows none: fest-azores', () => {
  assert.equal(FEST_DASHBOARDS['fest-azores'].partners.length, 4);
  assert.deepEqual(reviewed('fest-azores'), { deck: 'meetUp', lines: [] });
});

test('an API from before partners shows no card: fest-melbourne', () => {
  assert.equal('format' in FEST_DASHBOARDS['fest-melbourne'], false);
  assert.equal(reviewed('fest-melbourne'), null);
});

test('a Fest nobody could place shows no card: the empty dashboard', () => {
  assert.equal(EMPTY_FEST_DASHBOARD.format, null);
  assert.equal(reviewed('fest-horta'), null);
});

/* The mocked page finds its Fest in SCENARIOS, so every review link has
   to be a Fest someone organizes there. */
test('every review link is an organizing Fest in the organizer scenario', () => {
  const organizing = SCENARIOS.organizer.fests
    .filter((fest) => fest.role === 'organizing')
    .map((fest) => fest.id);

  for (const id of [
    'fest-toronto',
    'fest-guimaraes',
    'fest-braga',
    'fest-tokyo',
    'fest-azores',
    'fest-melbourne',
    'fest-horta',
    'fest-coimbra',
  ]) {
    assert.ok(organizing.includes(id), id);
  }
});
