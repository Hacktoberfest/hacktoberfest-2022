import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ATTRIBUTION,
  LIVE_BASEMAP_KEY,
  MAX_ZOOM,
  basemapSource,
  resolveBasemapKey,
} from '../src/lib/basemapSource.mjs';

/* This arrives from a shell, where a trailing newline is a normal way to
   get a value slightly wrong. Left on, it goes into a URL and comes back
   as an authentication failure that names neither the whitespace nor the
   file it came from. */
test('trims a key, and falls back when there is nothing to trim', () => {
  assert.equal(resolveBasemapKey('  abc123\n'), 'abc123');
  assert.equal(resolveBasemapKey('   '), LIVE_BASEMAP_KEY);
  assert.equal(resolveBasemapKey(''), LIVE_BASEMAP_KEY);
  assert.equal(resolveBasemapKey(undefined), LIVE_BASEMAP_KEY);
  assert.equal(resolveBasemapKey(null), LIVE_BASEMAP_KEY);
});

/* Production cannot set environment variables, so the committed default
   is what production uses. An empty one would mean no maps at all rather
   than maps from a default source. */
test('ships a usable committed key', () => {
  assert.ok(LIVE_BASEMAP_KEY, 'no committed key');
});

/* No key, no source — and null rather than a half-built one, because
   every map checks for exactly this and renders nothing. A source object
   with an empty key in its URL would instead produce a map that requests
   tiles forever and draws none.

   Only an explicitly empty key reaches this now that a working one is
   committed; the path still matters, because emptying that constant is
   how the maps get turned off, and it has to degrade rather than break. */
test('builds no source from an empty key', () => {
  assert.equal(basemapSource(''), null);
});

/* And the committed key does build one, which is the normal path. */
test('builds a source from the committed key by default', () => {
  assert.ok(basemapSource());
});

test('builds a MapLibre vector source from a key', () => {
  const source = basemapSource('abc123');

  assert.equal(source.type, 'vector');
  assert.equal(source.tiles.length, 1);
  assert.match(source.tiles[0], /^https:\/\/api\.protomaps\.com\/tiles\/v4\//);
  assert.match(source.tiles[0], /\{z\}\/\{x\}\/\{y\}\.mvt/);
  assert.match(source.tiles[0], /key=abc123/);
});

/* The hosted API stops at 15. Unset, MapLibre would keep requesting tiles
   past that and get a 404 at every zoom beyond it, rather than scaling the
   last real tiles up. */
test('declares the source maxzoom', () => {
  assert.equal(MAX_ZOOM, 15);
  assert.equal(basemapSource('abc123').maxzoom, 15);
});

/* Required by OpenStreetMap's licence, so it travels with the source
   rather than being something a map has to remember to add. */
test('carries attribution for OpenStreetMap and Protomaps', () => {
  assert.match(ATTRIBUTION, /openstreetmap\.org/);
  assert.match(ATTRIBUTION, /protomaps\.com/);
  assert.equal(basemapSource('abc123').attribution, ATTRIBUTION);
});

/* A key is a URL query value. One containing a reserved character and
   pasted in raw would silently truncate the key or corrupt the request. */
test('escapes a key that needs it', () => {
  assert.match(basemapSource('a b&c').tiles[0], /key=a%20b%26c/);
});
