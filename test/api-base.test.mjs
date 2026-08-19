import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LIVE_API_BASE_URL,
  MOCKED_SENTINEL,
  resolveApiBaseUrl,
} from '../src/lib/apiBase.mjs';

/* The resolution table for the one value the whole mock-vs-live
   architecture switches on. session.mjs, buildMode.mjs and
   check-build-mode.mjs all defer to resolveApiBaseUrl, so this file is
   where the contract itself is pinned; progress-session.test.mjs covers
   the same facts through the built module. */

test('the live origin is the production API, not the site', () => {
  assert.equal(LIVE_API_BASE_URL, 'https://hacktoberfest-api.mlh.com');
});

test('unset and empty both resolve to the live origin', () => {
  assert.equal(resolveApiBaseUrl(undefined), LIVE_API_BASE_URL);
  assert.equal(resolveApiBaseUrl(''), LIVE_API_BASE_URL);
});

test('the mocked sentinel resolves to no API at all', () => {
  assert.equal(MOCKED_SENTINEL, 'mocked');
  assert.equal(resolveApiBaseUrl('mocked'), '');
});

test('an explicit origin passes through, trailing slashes stripped', () => {
  assert.equal(
    resolveApiBaseUrl('https://api.test.invalid'),
    'https://api.test.invalid',
  );
  assert.equal(
    resolveApiBaseUrl('https://api.test.invalid//'),
    'https://api.test.invalid',
  );
});
