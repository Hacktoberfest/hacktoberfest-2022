import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

const { apiFetch, endSession, exchangeCode, resetRefreshState } = await import(
  '../src/lib/apiClient.mjs'
);
const { SESSION_STORAGE_KEY, parseSession } = await import(
  '../src/lib/session.mjs'
);

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

/* A minimal localStorage. The real one is unavailable under node:test. */
const installStorage = (initial) => {
  const map = new Map(Object.entries(initial || {}));
  globalThis.localStorage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
  return map;
};

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const setup = (initialSession = SESSION) => {
  resetRefreshState();
  return installStorage(
    initialSession
      ? { [SESSION_STORAGE_KEY]: JSON.stringify(initialSession) }
      : {},
  );
};

test('apiFetch attaches the access token as a bearer header', async () => {
  setup();
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return jsonResponse({ email: 'ada@example.invalid' });
  };

  const body = await apiFetch('/api/me');

  assert.equal(body.email, 'ada@example.invalid');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.headers.Authorization, 'Bearer access-1');
});

test('apiFetch refreshes and retries once on a 401', async () => {
  const store = setup();
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push(String(url));
    if (String(url).endsWith('/auth/refresh')) {
      return jsonResponse({
        accessToken: 'access-2',
        refreshToken: 'refresh-2',
      });
    }
    // First protected call 401s; the retry carries the new token.
    return init.headers.Authorization === 'Bearer access-2'
      ? jsonResponse({ email: 'ada@example.invalid' })
      : jsonResponse({ error: 'nope' }, 401);
  };

  const body = await apiFetch('/api/me');

  assert.equal(body.email, 'ada@example.invalid');
  assert.equal(calls.filter((u) => u.endsWith('/auth/refresh')).length, 1);

  // Both rotated tokens must be persisted: the API kills the old refresh
  // token the moment it is used, so keeping it would sign the user out later.
  const saved = parseSession(store.get(SESSION_STORAGE_KEY));
  assert.equal(saved.accessToken, 'access-2');
  assert.equal(saved.refreshToken, 'refresh-2');
});

test('apiFetch keeps the user profile when it persists refreshed tokens', async () => {
  const store = setup();
  globalThis.fetch = async (url, init) => {
    if (String(url).endsWith('/auth/refresh')) {
      return jsonResponse({
        accessToken: 'access-2',
        refreshToken: 'refresh-2',
      });
    }
    return init.headers.Authorization === 'Bearer access-2'
      ? jsonResponse({ ok: true })
      : jsonResponse({}, 401);
  };

  await apiFetch('/api/me');

  const saved = parseSession(store.get(SESSION_STORAGE_KEY));
  assert.equal(saved.user.email, 'ada@example.invalid');
  assert.equal(saved.user.firstName, 'Ada');
});

test('apiFetch does not loop when the retry also 401s', async () => {
  const store = setup();
  let refreshes = 0;
  globalThis.fetch = async (url) => {
    if (String(url).endsWith('/auth/refresh')) {
      refreshes += 1;
      return jsonResponse({
        accessToken: 'access-2',
        refreshToken: 'refresh-2',
      });
    }
    return jsonResponse({}, 401);
  };

  await assert.rejects(apiFetch('/api/me'), (error) => {
    assert.equal(error.status, 401);
    return true;
  });

  assert.equal(refreshes, 1);
  assert.equal(store.get(SESSION_STORAGE_KEY), undefined);
});

test('apiFetch clears the session when the refresh itself fails', async () => {
  const store = setup();
  globalThis.fetch = async (url) =>
    String(url).endsWith('/auth/refresh')
      ? jsonResponse({ error: 'dead' }, 401)
      : jsonResponse({}, 401);

  await assert.rejects(apiFetch('/api/me'), (error) => {
    assert.equal(error.status, 401);
    return true;
  });

  assert.equal(store.get(SESSION_STORAGE_KEY), undefined);
});

test('two concurrent 401s trigger exactly one refresh', async () => {
  setup();
  let refreshes = 0;
  globalThis.fetch = async (url, init) => {
    if (String(url).endsWith('/auth/refresh')) {
      refreshes += 1;
      return jsonResponse({
        accessToken: 'access-2',
        refreshToken: 'refresh-2',
      });
    }
    return init.headers.Authorization === 'Bearer access-2'
      ? jsonResponse({ ok: true })
      : jsonResponse({}, 401);
  };

  await Promise.all([apiFetch('/api/me'), apiFetch('/api/me/participations')]);

  assert.equal(refreshes, 1);
});

test('apiFetch throws with the status on a non-401 failure', async () => {
  setup();
  globalThis.fetch = async () => jsonResponse({ error: 'boom' }, 502);

  await assert.rejects(apiFetch('/api/me'), (error) => {
    assert.equal(error.status, 502);
    return true;
  });
});

test('apiFetch rejects with 401 when there is no session at all', async () => {
  setup(null);
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return jsonResponse({});
  };

  await assert.rejects(apiFetch('/api/me'), (error) => {
    assert.equal(error.status, 401);
    return true;
  });
  assert.equal(called, false);
});

test('exchangeCode posts the code and returns the session', async () => {
  setup(null);
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return jsonResponse(SESSION);
  };

  const session = await exchangeCode('one-time-code');

  assert.equal(session.accessToken, 'access-1');
  assert.ok(calls[0].url.endsWith('/auth/token'));
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].init.body), { code: 'one-time-code' });
});

test('exchangeCode throws with the status when the code is rejected', async () => {
  setup(null);
  globalThis.fetch = async () =>
    jsonResponse({ error: { code: 'INVALID_CODE' } }, 400);

  await assert.rejects(exchangeCode('used-code'), (error) => {
    assert.equal(error.status, 400);
    return true;
  });
});

test('apiFetch recovers after a no-refresh-token session, without an explicit reset', async () => {
  // Phase 1: a session with a valid accessToken but no refreshToken (which
  // parseSession accepts) hits a 401. There is nothing to refresh with, so
  // refreshSession must resolve to null -- but it must also leave
  // refreshInFlight clear behind it, not permanently stuck.
  setup({
    accessToken: 'access-1',
    refreshToken: null,
    user: SESSION.user,
  });
  globalThis.fetch = async () => jsonResponse({}, 401);

  await assert.rejects(apiFetch('/api/me'), (error) => {
    assert.equal(error.status, 401);
    return true;
  });

  // Phase 2: a fresh session with a real refresh token is installed --
  // deliberately WITHOUT calling resetRefreshState(), the way a participant
  // signing back in would look from this module's point of view. If phase 1
  // left refreshInFlight stuck on its stale null, this call would skip the
  // refresh entirely and fail closed forever.
  installStorage({ [SESSION_STORAGE_KEY]: JSON.stringify(SESSION) });
  let refreshed = false;
  globalThis.fetch = async (url, init) => {
    if (String(url).endsWith('/auth/refresh')) {
      refreshed = true;
      return jsonResponse({
        accessToken: 'access-2',
        refreshToken: 'refresh-2',
      });
    }
    return init.headers.Authorization === 'Bearer access-2'
      ? jsonResponse({ ok: true })
      : jsonResponse({}, 401);
  };

  const body = await apiFetch('/api/me');

  assert.equal(body.ok, true);
  assert.equal(refreshed, true);
});

/* Sign-out. The refresh token outlives the browser session by thirty days
   unless the API is told to revoke it, so clearing localStorage alone leaves
   a usable credential behind on a shared machine. */
test('endSession revokes the refresh token and clears the local session', async () => {
  const store = setup();
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return { ok: true, status: 204, json: async () => ({}) };
  };

  endSession();

  assert.equal(store.get(SESSION_STORAGE_KEY), undefined);
  assert.equal(calls.length, 1);
  assert.ok(calls[0].url.endsWith('/auth/logout'));
  assert.equal(calls[0].init.method, 'POST');
  // The endpoint takes the refresh token in the body, exactly as /auth/refresh
  // does, and is unauthenticated -- there is no bearer header to attach.
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    refreshToken: 'refresh-1',
  });
});

/* The requirement the fire-and-forget shape exists for: signing out must not
   depend on the network. A rejected request must not throw into the caller,
   must not become an unhandled rejection -- node fails the whole file on one,
   which is why this awaits a turn before finishing -- and above all must not
   leave the participant still signed in locally. */
test('endSession clears the local session even when the logout request rejects', async () => {
  const store = setup();
  let attempted = false;
  globalThis.fetch = async () => {
    attempted = true;
    throw new TypeError('Failed to fetch');
  };

  endSession();

  assert.equal(attempted, true);
  assert.equal(store.get(SESSION_STORAGE_KEY), undefined);

  await new Promise((resolve) => setImmediate(resolve));
});

/* A fetch that throws synchronously rather than returning a promise -- an
   environment without it, or a stubbed one -- must not take the sign-out down
   with it either. */
test('endSession clears the local session when fetch throws outright', async () => {
  const store = setup();
  globalThis.fetch = () => {
    throw new TypeError('fetch is not a function');
  };

  endSession();

  assert.equal(store.get(SESSION_STORAGE_KEY), undefined);
});

/* Nothing to revoke: a session near the end of its life carries no refresh
   token, and posting `undefined` would earn a 400 for no benefit. */
test('endSession skips the API call when there is no refresh token', async () => {
  const store = setup({
    accessToken: 'access-1',
    refreshToken: null,
    user: SESSION.user,
  });
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return jsonResponse({});
  };

  endSession();

  assert.equal(called, false);
  assert.equal(store.get(SESSION_STORAGE_KEY), undefined);
});

test('apiFetch clears the session when the refresh response omits a refresh token', async () => {
  // The API's documented contract always returns both tokens, so this
  // shouldn't happen in practice -- but if it does, the old refresh token is
  // already dead (rotated server-side the moment it was spent), so falling
  // back to it would persist a known-bad credential. Treat it as a failed
  // refresh instead.
  const store = setup();
  globalThis.fetch = async (url, init) => {
    if (String(url).endsWith('/auth/refresh')) {
      return jsonResponse({ accessToken: 'access-2' });
    }
    // The original call 401s (wrong/old token); a retry with the new
    // access token would succeed. If refreshSession wrongly treated the
    // malformed response as success, that retry would happen and this test
    // would pass for the wrong reason. Only "treat as failed refresh" stops
    // the retry from ever being attempted.
    return init.headers.Authorization === 'Bearer access-2'
      ? jsonResponse({ ok: true })
      : jsonResponse({}, 401);
  };

  await assert.rejects(apiFetch('/api/me'), (error) => {
    assert.equal(error.status, 401);
    return true;
  });

  assert.equal(store.get(SESSION_STORAGE_KEY), undefined);
});

/* A structurally valid JWT whose payload this test controls. The signature
   is garbage on purpose: the client must never verify — only read exp. */
const fakeJwt = (payload) =>
  [
    'header',
    Buffer.from(JSON.stringify(payload)).toString('base64url'),
    'sig',
  ].join('.');

test('apiFetch refreshes an expiring token before the request, not via a 401', async () => {
  const expiring = fakeJwt({ exp: Math.floor(Date.now() / 1000) + 5 });
  setup({ ...SESSION, accessToken: expiring });
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).endsWith('/auth/refresh')) {
      return jsonResponse({
        accessToken: 'access-2',
        refreshToken: 'refresh-2',
      });
    }
    return jsonResponse({ ok: true });
  };

  await apiFetch('/api/me');

  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/auth\/refresh$/);
  assert.equal(calls[1].init.headers.Authorization, 'Bearer access-2');
});

test('apiFetch leaves a token with plenty of life alone', async () => {
  const healthy = fakeJwt({ exp: Math.floor(Date.now() / 1000) + 600 });
  setup({ ...SESSION, accessToken: healthy });
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return jsonResponse({ ok: true });
  };

  await apiFetch('/api/me');

  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.headers.Authorization, `Bearer ${healthy}`);
});

test('a failed proactive refresh falls through to the request rather than throwing', async () => {
  const expiring = fakeJwt({ exp: Math.floor(Date.now() / 1000) + 5 });
  setup({ ...SESSION, accessToken: expiring });
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).endsWith('/auth/refresh')) return jsonResponse({}, 500);
    return jsonResponse({ ok: true });
  };

  const body = await apiFetch('/api/me');

  assert.equal(body.ok, true);
  // Refresh attempted, request still made with the old token.
  assert.equal(calls.length, 2);
});

test('tokenNeedsRefresh is false for opaque non-JWT tokens', async () => {
  const { tokenNeedsRefresh } = await import('../src/lib/apiClient.mjs');
  assert.equal(tokenNeedsRefresh('mock-access-token'), false);
  assert.equal(tokenNeedsRefresh('a.b'), false);
  assert.equal(tokenNeedsRefresh(''), false);
  assert.equal(tokenNeedsRefresh(null), false);
});
