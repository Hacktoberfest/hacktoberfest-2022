import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES } from '../src/data/eligibility.mjs';
import {
  progressSlot,
  publicActivities,
  withEarnedSecrets,
} from '../src/lib/activitiesPageState.mjs';
import { filterActivities } from '../src/lib/activityFilters.mjs';

/* The pure branching behind two review findings on /activities/: the
   sign-in link must never flash for a visitor who has a session (Finding
   1), and a transient failure must keep the public rows on screen with a
   retry rather than collapsing to the signed-out page (Finding 2). */

test('publicActivities is the whole catalogue, undone', () => {
  const activities = publicActivities();
  assert.equal(activities.length, ACTIVITIES.length);
  activities.forEach((activity) => {
    assert.equal(activity.completed, false);
    assert.equal(activity.completedAt, null);
    assert.equal(activity.source, null);
  });
});

test('no session: the sign-in slot, whatever the fetch status', () => {
  assert.equal(
    progressSlot({ hasSession: false, status: 'loading' }),
    'signIn',
  );
  assert.equal(progressSlot({ hasSession: false, status: 'ready' }), 'signIn');
  assert.equal(progressSlot({ hasSession: false, status: 'error' }), 'signIn');
});

test('signed in and loading: a placeholder, never the sign-in link', () => {
  assert.equal(
    progressSlot({ hasSession: true, status: 'loading' }),
    'placeholder',
  );
});

test('signed in and ready: the strip', () => {
  assert.equal(progressSlot({ hasSession: true, status: 'ready' }), 'strip');
});

test('signed in and the fetch failed: the retry slot, not signed out', () => {
  assert.equal(progressSlot({ hasSession: true, status: 'error' }), 'error');
});

/* Secret stickers, generically: an invented earned one and a placeholder,
   revealed by a catalogue sticker picked for no reason but that it
   exists. */
test('signed in, an earned secret ends the cards of its revealer’s group; a placeholder does not', () => {
  const cards = withEarnedSecrets(publicActivities(), [
    {
      id: 'demo-secret',
      secret: true,
      name: 'A demo secret',
      description: 'Invented for the test.',
      art: null,
      revealedBy: 'ghw',
      required: false,
      completed: true,
      completedAt: '2026-10-14T12:00:00.000Z',
      source: 'manual',
    },
    {
      id: 'secret-1',
      secret: true,
      hint: 'A demo hint',
      revealedBy: 'ghw',
      required: false,
      completed: false,
      completedAt: null,
      source: null,
    },
  ]);
  assert.equal(cards.length, ACTIVITIES.length + 1);
  assert.ok(!cards.some((card) => card.id === 'secret-1'));
  const secret = cards.find((card) => card.id === 'demo-secret');
  assert.equal(secret.type, 'ghw');
  assert.equal(secret.label, 'A demo secret');
  assert.equal(secret.detail, 'Invented for the test.');
  assert.equal(secret.completed, true);
  assert.equal(secret.href, null);
  const group = filterActivities(cards, 'ghw').map((card) => card.id);
  const plain = filterActivities(publicActivities(), 'ghw').map(
    (card) => card.id,
  );
  assert.ok(plain.length > 2);
  assert.deepEqual(group, [...plain, 'demo-secret']);
  /* Earned, so never in Still to do. */
  assert.ok(
    !filterActivities(cards, 'todo').some((card) => card.id === 'demo-secret'),
  );
});

test('earned secrets end their own groups in the grouped list, in the payload’s order', () => {
  const earned = (id, revealedBy) => ({
    id,
    secret: true,
    name: 'A demo secret',
    description: 'Invented for the test.',
    art: null,
    revealedBy,
    required: false,
    completed: true,
    completedAt: '2026-10-14T12:00:00.000Z',
    source: 'manual',
  });
  const cards = withEarnedSecrets(publicActivities(), [
    earned('demo-secret', 'discord'),
    earned('demo-secret-2', 'ghw'),
    earned('demo-secret-3', 'discord'),
  ]);
  /* The page's own sort and filter, as the cards are shown. */
  const grouped = filterActivities(cards, 'all');
  const group = (type) =>
    grouped.filter((card) => card.type === type).map((card) => card.id);
  const plain = (type) =>
    filterActivities(publicActivities(), type).map((card) => card.id);
  assert.deepEqual(group('tools'), [
    ...plain('tools'),
    'demo-secret',
    'demo-secret-3',
  ]);
  assert.deepEqual(group('ghw'), [...plain('ghw'), 'demo-secret-2']);
  /* Each group is one run: a secret ends its group and never opens, or
     splits, another. */
  const runs = grouped
    .map((card) => card.type)
    .filter((type, at, all) => at === 0 || type !== all[at - 1]);
  assert.equal(new Set(runs).size, runs.length);
});

test('no secrets: the cards are the catalogue, unchanged', () => {
  assert.deepEqual(
    withEarnedSecrets(publicActivities(), undefined),
    publicActivities(),
  );
  assert.deepEqual(
    withEarnedSecrets(publicActivities(), []),
    publicActivities(),
  );
});
