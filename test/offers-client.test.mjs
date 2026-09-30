import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

/* The modules read process.env at import time, so the base URL must be set
   before this file's first import of them. node:test runs files in isolated
   processes, so setting it here is safe. Same harness as
   test/progress-api-client.test.mjs. */
const { resetRefreshState } = await import('../src/lib/apiClient.mjs');
const { SESSION_STORAGE_KEY } = await import('../src/lib/session.mjs');
const { claimAndGo, getClaimLink, getOffers } = await import(
  '../src/lib/offers.mjs'
);

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

const setup = (respond) => {
  resetRefreshState();
  installStorage({ [SESSION_STORAGE_KEY]: JSON.stringify(SESSION) });
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return respond(url, init);
  };
  return calls;
};

const PROMO = { poolId: 'pool-1', eventId: 'event-1' };
const LINK =
  'https://www.mlh.com/events/x/partners/y/promo_codes/redeem?token=t';

test('getOffers reads /api/me/offers with the session token', async () => {
  const calls = setup(() =>
    jsonResponse([
      {
        company: { id: 'c1', name: 'Acme', logoUrl: null },
        challenges: [],
        promo: { poolId: 'p1', eventId: 'e1', label: 'Acme credit' },
      },
    ]),
  );

  const offers = await getOffers();

  assert.equal(calls[0].url, 'https://api.test.invalid/api/me/offers');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer access-1');
  assert.equal(offers.length, 1);
  assert.equal(offers[0].promo.label, 'Acme credit');
});

test('getOffers rejects a body that is not a list', async () => {
  setup(() => jsonResponse({ offers: [] }));
  await assert.rejects(getOffers(), /could not be read/);
});

test('getOffers passes the API status through for the page state', async () => {
  setup(() => jsonResponse({}, 502));
  await assert.rejects(getOffers(), (error) => error.status === 502);
});

test('getClaimLink POSTs the pool and event and returns the link', async () => {
  const calls = setup(() => jsonResponse({ claimLink: LINK }));

  assert.equal(await getClaimLink(PROMO), LINK);
  assert.equal(
    calls[0].url,
    'https://api.test.invalid/api/me/offers/claim-link',
  );
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer access-1');
  assert.deepEqual(JSON.parse(calls[0].init.body), PROMO);
});

test('getClaimLink never hands back a link that is not https', async () => {
  setup(() => jsonResponse({ claimLink: 'javascript:alert(1)' }));
  await assert.rejects(getClaimLink(PROMO), /could not be read/);
});

test('a click that gets a link navigates, then reports navigated', async () => {
  setup(() => jsonResponse({ claimLink: LINK }));
  const visited = [];

  const outcome = await claimAndGo({
    promo: PROMO,
    go: (url) => visited.push(url),
  });

  assert.equal(outcome, 'navigated');
  assert.deepEqual(visited, [LINK]);
});

test('a click on a dead session reports signedOut and goes nowhere', async () => {
  // Both the request and the refresh answer 401: the session is beyond saving.
  setup(() => jsonResponse({}, 401));
  const visited = [];

  const outcome = await claimAndGo({
    promo: PROMO,
    go: (url) => visited.push(url),
  });

  assert.equal(outcome, 'signedOut');
  assert.deepEqual(visited, []);
});

test('any other failure reports failed and goes nowhere', async () => {
  for (const respond of [
    () => jsonResponse({}, 502),
    () => jsonResponse({ claimLink: 'http://www.mlh.com/x' }),
    () => {
      throw new TypeError('Failed to fetch');
    },
  ]) {
    setup(respond);
    const visited = [];
    const outcome = await claimAndGo({
      promo: PROMO,
      go: (url) => visited.push(url),
    });
    assert.equal(outcome, 'failed');
    assert.deepEqual(visited, []);
  }
});

/* The API's 404 OFFER_UNAVAILABLE: the pool or the registration changed
   after the cards were served. Retrying cannot fix it, so it is not the
   "try again" failure. */
test('a click on an offer that went stale reports unavailable', async () => {
  setup(() => jsonResponse({}, 404));
  const visited = [];

  const outcome = await claimAndGo({
    promo: PROMO,
    go: (url) => visited.push(url),
  });

  assert.equal(outcome, 'unavailable');
  assert.deepEqual(visited, []);
});
