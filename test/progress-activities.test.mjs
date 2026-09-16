import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES } from '../src/data/eligibility.mjs';
import { TYPE_ORDER } from '../src/lib/activityFilters.mjs';

/* livestreams, fest, dev-relay and ghw are ids FestNet already uses; the
   rest are this site's guesses until FestNet confirms its slugs (see the
   note on ACTIVITIES). */
test('the catalogue is the season’s twenty activities, by slug', () => {
  assert.deepEqual(
    ACTIVITIES.map((activity) => activity.id),
    [
      'livestreams-1',
      'livestreams-3',
      'livestreams-5',
      'livestream-launch',
      'fest',
      'host-fest',
      'dev-relay',
      'dev-connect',
      'dev-launch-weekend',
      'dev-week-1',
      'dev-week-2',
      'dev-week-3',
      'dev-week-4',
      'ghw',
      'ghw-livestream',
      'ghw-points-5',
      'ghw-points-10',
      'ghw-points-20',
      'discord',
      'digitalocean',
    ],
  );
});

test('every activity has a stable unique id', () => {
  const ids = ACTIVITIES.map((activity) => activity.id);
  assert.equal(new Set(ids).size, ids.length, 'ids must be unique');
  ids.forEach((id) => assert.match(id, /^[a-z0-9-]+$/, `${id} is not a slug`));
});

/* href is null for an activity whose real destination is not known yet
   (DevRelay, the two DEV challenges and the DigitalOcean connect this
   season) — the renderers skip its CTA rather than ship a placeholder
   link. Every other activity needs a real destination. */
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

test('every activity has a type and an art key', () => {
  ACTIVITIES.forEach((activity) => {
    assert.ok(TYPE_ORDER.includes(activity.type), `${activity.id} type`);
    assert.match(activity.art, /^[a-z]+$/, `${activity.id} art`);
  });
});
