import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeDashboard } from '../src/lib/festDashboard.mjs';

const body = {
  fest: { id: 'fest-tokyo', name: 'Hacktoberfest Hack Day Tokyo' },
  dashboard: {
    registrationsCount: 17,
    checkInsCount: 4,
    trackingNumbers: ['1Z999'],
  },
};

test('a complete payload passes through', () => {
  const result = normalizeDashboard(body);

  assert.equal(result.fest.id, 'fest-tokyo');
  assert.deepEqual(result.dashboard, {
    registrationsCount: 17,
    checkInsCount: 4,
    trackingNumbers: ['1Z999'],
  });
});

test('missing counts read as zero', () => {
  // The deploy-order seam: an API answering without these fields degrades to
  // zeros rather than rendering undefined at a host.
  const result = normalizeDashboard({ fest: body.fest, dashboard: {} });

  assert.equal(result.dashboard.registrationsCount, 0);
  assert.equal(result.dashboard.checkInsCount, 0);
});

test('a missing dashboard object still yields a renderable page', () => {
  const result = normalizeDashboard({ fest: body.fest });

  assert.deepEqual(result.dashboard, {
    registrationsCount: 0,
    checkInsCount: 0,
    trackingNumbers: [],
  });
});

test('non-numeric counts read as zero', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { registrationsCount: '17', checkInsCount: null },
  });

  assert.equal(result.dashboard.registrationsCount, 0);
  assert.equal(result.dashboard.checkInsCount, 0);
});

test('tracking entries that are not usable strings are dropped', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { trackingNumbers: ['1Z999', '', 42, null] },
  });

  assert.deepEqual(result.dashboard.trackingNumbers, ['1Z999']);
});

test('a non-array tracking value reads as nothing shipped', () => {
  const result = normalizeDashboard({
    fest: body.fest,
    dashboard: { trackingNumbers: '1Z999' },
  });

  assert.deepEqual(result.dashboard.trackingNumbers, []);
});

test('a payload with no fest is not a page', () => {
  assert.equal(normalizeDashboard({ dashboard: body.dashboard }), null);
  assert.equal(normalizeDashboard(null), null);
});
