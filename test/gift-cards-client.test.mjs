import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

const { requestGiftCards } = await import('../src/lib/giftCards.mjs');
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

const REQUEST = {
  submittedAt: '2026-10-25T15:12:00.000Z',
  byYou: true,
  emails: ['jamie@sharkhacks.ca', 'priya@utoronto.ca'],
};

test('requestGiftCards POSTs the emails as JSON, trimmed, empties dropped', async () => {
  setup();
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse({ request: REQUEST }, 201);
  };

  await requestGiftCards('evt 1', [
    ' jamie@sharkhacks.ca ',
    '',
    'priya@utoronto.ca',
  ]);

  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    'https://api.test.invalid/api/me/fests/evt%201/gift-cards',
  );
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer access-1');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    emails: ['jamie@sharkhacks.ca', 'priya@utoronto.ca'],
  });
});

test('a 201 resolves to the request, read like the dashboard’s', async () => {
  setup();
  globalThis.fetch = async () =>
    jsonResponse(
      {
        request: {
          ...REQUEST,
          emails: [' jamie@sharkhacks.ca', ...REQUEST.emails.slice(1)],
        },
      },
      201,
    );

  assert.deepEqual(await requestGiftCards('evt-1', REQUEST.emails), REQUEST);
});

test('a 201 the page cannot read resolves to null, so the page refetches', async () => {
  setup();
  globalThis.fetch = async () => jsonResponse({ ok: true }, 201);

  assert.equal(await requestGiftCards('evt-1', REQUEST.emails), null);
});

test('a refusal surfaces its status and the API’s reason', async () => {
  setup();
  const body = {
    error: 'ALREADY_SUBMITTED',
    message: 'This Fest’s gift cards have already been requested.',
  };
  globalThis.fetch = async () => jsonResponse(body, 409);

  await assert.rejects(
    () => requestGiftCards('evt-1', REQUEST.emails),
    (error) => {
      assert.equal(error.status, 409);
      assert.deepEqual(error.body, body);
      return true;
    },
  );
});
