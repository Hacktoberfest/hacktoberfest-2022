import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

const { acknowledgeFest } = await import('../src/lib/acknowledgements.mjs');
const { resetRefreshState } = await import('../src/lib/apiClient.mjs');
const { SESSION_STORAGE_KEY } = await import('../src/lib/session.mjs');

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

test('acknowledgeFest POSTs the acknowledgements endpoint for the event', async () => {
  setup();
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse({
      acknowledgedAt: '2026-08-25T20:05:33.000Z',
      acknowledgedBy: 'mlh-user-1',
    });
  };

  const result = await acknowledgeFest('evt-1');

  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    'https://api.test.invalid/api/me/fests/evt-1/acknowledgements',
  );
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(result.acknowledgedAt, '2026-08-25T20:05:33.000Z');
});

test('acknowledgeFest surfaces a failure with its status', async () => {
  setup();
  globalThis.fetch = async () => jsonResponse({}, 403);

  await assert.rejects(
    () => acknowledgeFest('evt-1'),
    (error) => {
      assert.equal(error.status, 403);
      return true;
    },
  );
});
