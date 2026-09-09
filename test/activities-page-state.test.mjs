import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES } from '../src/data/eligibility.mjs';
import {
  progressSlot,
  publicActivities,
} from '../src/lib/activitiesPageState.mjs';

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
