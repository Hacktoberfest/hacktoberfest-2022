import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

const { SESSION_STORAGE_KEY } = await import('../src/lib/session.mjs');
const { getExperience } = await import('../src/lib/experience.mjs');
const { resetRefreshState } = await import('../src/lib/apiClient.mjs');

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

const installStorage = () => {
  const map = new Map([[SESSION_STORAGE_KEY, JSON.stringify(SESSION)]]);
  globalThis.localStorage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
};

/* The live profile the split /api/me/profile endpoint answers with. */
const PROFILE = {
  id: 'u1',
  email: 'real@example.invalid',
  firstName: 'Grace',
  lastName: 'Hopper',
  createdAt: '2026-01-01T00:00:00.000Z',
};

/* Routes the two split endpoints to their own canned bodies, recording the
   URLs hit. The live path fetches /api/me/profile and /api/me/fests in
   parallel — never the combined /api/me. */
const routeFetch = ({
  profile = PROFILE,
  fests = { hasAddress: false, fests: [] },
} = {}) => {
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).endsWith('/api/me/profile')) {
      return { ok: true, status: 200, json: async () => profile };
    }
    if (String(url).endsWith('/api/me/fests')) {
      return { ok: true, status: 200, json: async () => fests };
    }
    throw new Error(`Unexpected fetch in test: ${url}`);
  };
  return calls;
};

test('getExperience fetches both split endpoints and merges the real user over the mocked payload', async () => {
  resetRefreshState();
  installStorage();
  const calls = routeFetch();

  // 'eligible' is the scenario whose fixture has devLinked: true, so the
  // assertion below is meaningful -- asserting against false would pass
  // even if the field were dropped from the merge entirely.
  const result = await getExperience(SESSION, { scenario: 'eligible' });

  assert.deepEqual(calls.sort(), [
    'https://api.test.invalid/api/me/fests',
    'https://api.test.invalid/api/me/profile',
  ]);
  assert.equal(result.user.name, 'Grace Hopper');
  assert.equal(result.user.email, 'real@example.invalid');
  assert.equal(result.user.avatarUrl, null);

  // Activities still come from the fixtures; fests are live now, and this
  // profile carries none, so the fallback empty list is correct here.
  assert.ok(Array.isArray(result.activities));
  assert.deepEqual(result.fests, []);

  /* devLinked is live now. A profile that doesn't carry it maps to false —
     the same deploy-order stance as hasAddress: ship the API half first,
     because a frontend ahead of the API reads every account as unlinked
     with nothing to signal it. The 'eligible' fixture has devLinked: true,
     so false here proves the live payload wins over the fixture. */
  assert.equal(result.user.devLinked, false);
});

/* 'no-address' is the fixture whose devLinked is false, so a true result can
   only have come from the live payload. */
test('getExperience maps devLinked: true onto user.devLinked', async () => {
  resetRefreshState();
  installStorage();
  routeFetch({ profile: { ...PROFILE, devLinked: true } });

  const result = await getExperience(SESSION, { scenario: 'no-address' });

  assert.equal(result.user.devLinked, true);
});

/* The mirror image: 'eligible' has devLinked true in the fixture, so a false
   result proves the live payload overrode it. */
test('getExperience maps devLinked: false onto user.devLinked', async () => {
  resetRefreshState();
  installStorage();
  routeFetch({ profile: { ...PROFILE, devLinked: false } });

  const result = await getExperience(SESSION, { scenario: 'eligible' });

  assert.equal(result.user.devLinked, false);
});

test('getExperience surfaces a 401 with its status so /my can sign out', async () => {
  resetRefreshState();
  installStorage();
  globalThis.fetch = async () => ({
    ok: false,
    status: 401,
    json: async () => ({}),
  });

  await assert.rejects(getExperience(SESSION, {}), (error) => {
    assert.equal(error.status, 401);
    return true;
  });
});

/* 'no-address' is the fixture whose addressValidated is false, so a true
   result can only have come from the live payload. Asserting against the
   'eligible' fixture (already true) would pass even if hasAddress were
   ignored entirely. */
test('getExperience maps hasAddress: true onto addressValidated', async () => {
  resetRefreshState();
  installStorage();
  routeFetch({ fests: { hasAddress: true, fests: [] } });

  const result = await getExperience(SESSION, { scenario: 'no-address' });

  assert.equal(result.addressValidated, true);
});

/* The mirror image: 'eligible' has addressValidated true in the fixture, so
   a false result proves the live payload overrode it. */
test('getExperience maps hasAddress: false onto addressValidated', async () => {
  resetRefreshState();
  installStorage();
  routeFetch({ fests: { hasAddress: false, fests: [] } });

  const result = await getExperience(SESSION, { scenario: 'eligible' });

  assert.equal(result.addressValidated, false);
});

/* The failure scenarios are review links for the mocked build, and they must
   not survive into a live one. `?scenario=mlh-down` on a deployed /my used to
   make the real /api/me call and *then* throw the mock 502, so a signed-in
   participant handed that URL saw a full-page "MyMLH is unreachable" while
   MLH was fine — a shareable link fabricating a named third party's outage.
   `?scenario=error` leaked identically, and is covered here so neither can be
   reintroduced by fixing only the other. */
test('the failure scenarios do not fire in a live build', async () => {
  for (const scenario of ['mlh-down', 'error']) {
    resetRefreshState();
    installStorage();
    routeFetch();

    const result = await getExperience(SESSION, { scenario });

    assert.equal(
      result.user.email,
      'real@example.invalid',
      `?scenario=${scenario} threw a synthetic failure against a live API`,
    );
    // Neither name is a data shape, so both fall back to the default fixture.
    assert.ok(Array.isArray(result.activities));
  }
});

/* The page branches on this exact value to decide between the generic error
   surface and the whole-page outage state, so the status has to survive the
   trip out of apiFetch. */
test('getExperience surfaces a 502 with its status so /my can show the outage state', async () => {
  resetRefreshState();
  installStorage();
  globalThis.fetch = async () => ({
    ok: false,
    status: 502,
    json: async () => ({
      error: { message: 'MLH is unavailable', code: 'MLH_UNAVAILABLE' },
    }),
  });

  await assert.rejects(getExperience(SESSION, {}), (error) => {
    assert.equal(error.status, 502);
    return true;
  });
});

/* A fests failure must reject the whole experience even when the profile
   half already answered — the hub never renders half-live data. */
test('a fests failure rejects with its status even when the profile succeeded', async () => {
  resetRefreshState();
  installStorage();
  globalThis.fetch = async (url) => {
    if (String(url).endsWith('/api/me/profile')) {
      return { ok: true, status: 200, json: async () => PROFILE };
    }
    return { ok: false, status: 502, json: async () => ({}) };
  };

  await assert.rejects(getExperience(SESSION, {}), (error) => {
    assert.equal(error.status, 502);
    return true;
  });
});

/* 'organizer' is the fixture with three fests, so a one-fest result can only
   have come from the live payload — asserting against a fixture with one
   fest would pass even if the field were ignored. */
test('getExperience replaces mocked fests with the live payload', async () => {
  resetRefreshState();
  installStorage();
  const liveFests = [
    {
      id: 'evt-live',
      name: 'Hacktober Fest Brooklyn',
      city: 'Brooklyn',
      country: 'United States',
      date: '2026-10-24',
      role: 'attending',
      registrationUrl: null,
    },
  ];
  routeFetch({ fests: { hasAddress: true, fests: liveFests } });

  const result = await getExperience(SESSION, { scenario: 'organizer' });

  assert.deepEqual(result.fests, liveFests);
});

/* The deploy-order guard: a frontend somehow answered by an API without the
   fests field must degrade to the empty state, not crash or show fixture
   fests as if they were the user's. */
test('getExperience maps a missing fests field to an empty list', async () => {
  resetRefreshState();
  installStorage();
  routeFetch({ fests: {} });

  const result = await getExperience(SESSION, { scenario: 'organizer' });

  assert.deepEqual(result.fests, []);
  assert.equal(result.addressValidated, false);
});

/* The point of the split: the profile half surfaces as soon as it answers,
   while the fests half is still in flight, so /my can greet by name early. */
test('onProfile fires with the experience-shaped user before fests resolve', async () => {
  resetRefreshState();
  installStorage();
  let releaseFests;
  const festsGate = new Promise((resolve) => {
    releaseFests = resolve;
  });
  globalThis.fetch = async (url) => {
    if (String(url).endsWith('/api/me/profile')) {
      return { ok: true, status: 200, json: async () => PROFILE };
    }
    await festsGate;
    return {
      ok: true,
      status: 200,
      json: async () => ({ hasAddress: false, fests: [] }),
    };
  };

  const seen = [];
  const pending = getExperience(SESSION, {
    onProfile: (user) => seen.push(user),
  });
  /* Let the profile leg settle while fests are still gated. */
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(seen.length, 1);
  assert.equal(seen[0].name, 'Grace Hopper');
  assert.equal(seen[0].email, 'real@example.invalid');

  releaseFests();
  const experience = await pending;
  assert.equal(experience.user.name, 'Grace Hopper');
});

/* A profile failure must not detonate twice: the Promise.all rejection is
   the one report, and the onProfile leg stays silent. */
test('a profile failure rejects once and never calls onProfile', async () => {
  resetRefreshState();
  installStorage();
  globalThis.fetch = async (url) => {
    if (String(url).endsWith('/api/me/profile')) {
      return { ok: false, status: 502, json: async () => ({}) };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ hasAddress: false, fests: [] }),
    };
  };

  const seen = [];
  await assert.rejects(
    getExperience(SESSION, { onProfile: (user) => seen.push(user) }),
    (error) => {
      assert.equal(error.status, 502);
      return true;
    },
  );
  assert.equal(seen.length, 0);
});
