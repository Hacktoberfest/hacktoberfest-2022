import assert from 'node:assert/strict';
import test from 'node:test';

import { distanceKm, sortByDistance } from '../src/lib/geo.mjs';

test('distance between the same point is zero', () => {
  const point = { lat: 51.5074, lng: -0.1278 };
  assert.equal(distanceKm(point, point), 0);
});

test('distance between London and Paris is close to the known value (~344km)', () => {
  const london = { lat: 51.5074, lng: -0.1278 };
  const paris = { lat: 48.8566, lng: 2.3522 };
  const km = distanceKm(london, paris);
  assert.ok(km > 330 && km < 350, `expected ~344km, got ${km}`);
});

test('sortByDistance orders nearest first without mutating the input', () => {
  const origin = { lat: 0, lng: 0 };
  const near = { id: 'near', lat: 1, lng: 1 };
  const far = { id: 'far', lat: 40, lng: 40 };
  const input = [far, near];

  const sorted = sortByDistance(input, origin);

  assert.deepEqual(
    sorted.map((fest) => fest.id),
    ['near', 'far'],
  );
  assert.deepEqual(
    input.map((fest) => fest.id),
    ['far', 'near'],
  );
});

test('distanceKm returns null for a Fest missing valid coordinates', () => {
  const origin = { lat: 51.5074, lng: -0.1278 };
  assert.equal(distanceKm(origin, { lat: null, lng: null }), null);
  assert.equal(distanceKm(origin, {}), null);
  assert.equal(distanceKm(origin, { lat: 48.8566 }), null);
});

test('sortByDistance places entries with unknown distance last, regardless of input order', () => {
  const origin = { lat: 0, lng: 0 };
  const near = { id: 'near', lat: 1, lng: 1 };
  const far = { id: 'far', lat: 40, lng: 40 };
  const unknown = { id: 'unknown' };

  const sortedWhenUnknownFirst = sortByDistance([unknown, far, near], origin);
  assert.deepEqual(
    sortedWhenUnknownFirst.map((fest) => fest.id),
    ['near', 'far', 'unknown'],
  );

  const sortedWhenUnknownLast = sortByDistance([far, near, unknown], origin);
  assert.deepEqual(
    sortedWhenUnknownLast.map((fest) => fest.id),
    ['near', 'far', 'unknown'],
  );
});
