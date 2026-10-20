import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

const { SPONSOR_OPT_INS, optInsFrom, saveSponsorOptIn } = await import(
  '../src/lib/sponsorOptIns.mjs'
);
const { resetRefreshState } = await import('../src/lib/apiClient.mjs');
const { SESSION_STORAGE_KEY } = await import('../src/lib/session.mjs');

/* The modules read process.env at import time, so the base URL must be set
   before this file's first import of them. node:test runs files in isolated
   processes, so setting it here is safe. */

const SESSION = {
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
  user: {
    id: 'u1',
    email: 'ada@example.invalid',
    firstName: 'Ada',
    lastName: 'Lovelace',
  },
};

const installStorage = (initial) => {
  const map = new Map(Object.entries(initial || {}));
  globalThis.localStorage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
};

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const setup = () => {
  resetRefreshState();
  installStorage({ [SESSION_STORAGE_KEY]: JSON.stringify(SESSION) });
};

const NONE = { digitalocean: false, temporal: false, 'prior-labs': false };

/* The three sponsors, in the card's order, with the API's slugs. */
test('the opt-ins are DigitalOcean, Temporal and Prior Labs', () => {
  assert.deepEqual(SPONSOR_OPT_INS, [
    { slug: 'digitalocean', name: 'DigitalOcean' },
    { slug: 'temporal', name: 'Temporal' },
    { slug: 'prior-labs', name: 'Prior Labs' },
  ]);
});

/* Nothing is ticked unless the API says true: a missing or malformed map
   is every box unticked, never a guess. */
test('optInsFrom ticks only what the API says is true', () => {
  [undefined, null, 'yes', 1, [], {}].forEach((raw) => {
    assert.deepEqual(optInsFrom(raw), NONE, JSON.stringify(raw));
  });
  assert.deepEqual(
    optInsFrom({ temporal: true, digitalocean: 'true', acme: true }),
    { ...NONE, temporal: true },
  );
  assert.deepEqual(
    optInsFrom({ digitalocean: true, temporal: true, 'prior-labs': true }),
    { digitalocean: true, temporal: true, 'prior-labs': true },
  );
});

test('saveSponsorOptIn PUTs the answer as JSON', async () => {
  setup();
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse({ sponsorOptIns: { ...NONE, 'prior-labs': true } });
  };

  const saved = await saveSponsorOptIn('prior-labs', true);

  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    'https://api.test.invalid/api/me/sponsor-opt-ins/prior-labs',
  );
  assert.equal(calls[0].init.method, 'PUT');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer access-1');
  assert.deepEqual(JSON.parse(calls[0].init.body), { optedIn: true });
  assert.deepEqual(saved, { ...NONE, 'prior-labs': true });
});

test('saveSponsorOptIn sends a no as plainly as a yes', async () => {
  setup();
  let body;
  globalThis.fetch = async (url, init) => {
    body = JSON.parse(init.body);
    return jsonResponse({ sponsorOptIns: NONE });
  };

  assert.deepEqual(await saveSponsorOptIn('temporal', false), NONE);
  assert.deepEqual(body, { optedIn: false });
});

test('a failed save rejects with its status', async () => {
  setup();
  globalThis.fetch = async () =>
    jsonResponse({ error: 'INTERNAL', message: 'nope' }, 500);

  await assert.rejects(
    () => saveSponsorOptIn('digitalocean', true),
    (error) => {
      assert.equal(error.status, 500);
      return true;
    },
  );
});
