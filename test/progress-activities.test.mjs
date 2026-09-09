import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES } from '../src/data/eligibility.mjs';

test('there are exactly five ways to qualify', () => {
  assert.equal(ACTIVITIES.length, 5);
});

test('every activity has a stable unique id', () => {
  const ids = ACTIVITIES.map((activity) => activity.id);
  assert.equal(new Set(ids).size, ids.length, 'ids must be unique');
  ids.forEach((id) => assert.match(id, /^[a-z0-9-]+$/, `${id} is not a slug`));
});

test('every activity has copy and a destination', () => {
  ACTIVITIES.forEach((activity) => {
    assert.ok(activity.label.length > 0, `${activity.id} needs a label`);
    assert.ok(activity.detail.length > 0, `${activity.id} needs a detail`);
    assert.ok(activity.ctaLabel.length > 0, `${activity.id} needs a CTA`);
    assert.match(activity.href, /^https:\/\//, `${activity.id} needs an href`);
  });
});

test('the Fest activity never calls itself a hack day', () => {
  const prose = ACTIVITIES.map((a) => `${a.label} ${a.detail}`).join(' ');
  assert.doesNotMatch(prose, /hack\s*day/i);
});

test('every activity declares its surface; only fest renders in My Fests', () => {
  ACTIVITIES.forEach((activity) =>
    assert.ok(
      ['card', 'fests'].includes(activity.surface),
      `${activity.id} has no surface`,
    ),
  );
  const festSurfaced = ACTIVITIES.filter((a) => a.surface === 'fests');
  assert.deepEqual(
    festSurfaced.map((a) => a.id),
    ['fest'],
  );
});
