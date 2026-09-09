import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES } from '../src/data/eligibility.mjs';

test('the catalogue is the season’s four activities, by the slugs FestNet uses', () => {
  assert.deepEqual(
    ACTIVITIES.map((activity) => activity.id),
    ['livestreams', 'ghw', 'fest', 'dev-relay'],
  );
});

test('every activity has a stable unique id', () => {
  const ids = ACTIVITIES.map((activity) => activity.id);
  assert.equal(new Set(ids).size, ids.length, 'ids must be unique');
  ids.forEach((id) => assert.match(id, /^[a-z0-9-]+$/, `${id} is not a slug`));
});

/* href is null for an activity whose real destination is not known yet
   (dev-relay this season) — the renderers skip its CTA rather than ship
   a placeholder link. Every other activity needs a real destination. */
test('every activity has copy, and a destination or none yet', () => {
  ACTIVITIES.forEach((activity) => {
    assert.ok(activity.label.length > 0, `${activity.id} needs a label`);
    assert.ok(activity.detail.length > 0, `${activity.id} needs a detail`);
    assert.ok(activity.ctaLabel.length > 0, `${activity.id} needs a CTA`);
    assert.ok(
      activity.href === null || /^(https:\/\/|\/)/.test(activity.href),
      `${activity.id} needs an href, or null`,
    );
  });
});

test('the copy never says hack day or Meet Up', () => {
  const prose = ACTIVITIES.map((a) => `${a.label} ${a.detail}`).join(' ');
  assert.doesNotMatch(prose, /hack\s*day/i);
  assert.doesNotMatch(prose, /Meet Up/);
});

test('every activity declares its surface; only fest renders in My Fests', () => {
  ACTIVITIES.forEach((activity) =>
    assert.ok(
      ['card', 'fests'].includes(activity.surface),
      `${activity.id} has no surface`,
    ),
  );
  assert.deepEqual(
    ACTIVITIES.filter((a) => a.surface === 'fests').map((a) => a.id),
    ['fest'],
  );
});
