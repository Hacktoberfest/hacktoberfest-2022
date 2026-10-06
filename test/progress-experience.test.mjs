import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

const { SESSION_STORAGE_KEY } = await import('../src/lib/session.mjs');
const { getExperience } = await import('../src/lib/experience.mjs');
const { SCENARIOS } = await import('../src/data/fixtures.mjs');
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
const ITEMS = {
  items: [
    {
      id: 'sticker-pack-2026',
      name: 'The 2026 sticker pack',
      kind: 'physical',
      earnedBy: 'Completing Milestone 1',
      getsToYou: 'Mailed after Hacktoberfest.',
      cta: {
        label: 'Update shipping address',
        url: 'https://example.invalid/address',
      },
      requiresDevLink: false,
      earned: true,
      earnedAt: '2026-10-05T12:00:00.000Z',
    },
  ],
};

const routeFetch = ({
  profile = PROFILE,
  fests = { hasAddress: false, fests: [] },
  items = ITEMS,
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
    if (String(url).endsWith('/api/me/items')) {
      return { ok: true, status: 200, json: async () => items };
    }
    if (String(url).endsWith('/api/me/progress')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          // Non-default on purpose: a test that leaves these at
          // DEFAULT_THRESHOLDS or an empty `challenges` list can't tell a
          // live payload that actually flowed through from one silently
          // dropped in favor of the fixture's own numbers.
          thresholds: { stickers: 1, complete: 4 },
          completedCount: 1,
          challenges: [
            {
              id: 'signin',
              name: 'Signed in with MyMLH',
              description: null,
              required: true,
              completed: true,
              completedAt: '2026-10-01T09:00:00.000Z',
              source: 'api',
            },
            {
              id: 'livestreams-1',
              completed: true,
              completedAt: '2026-10-05T19:12:00.000Z',
              source: 'event_checkins',
            },
          ],
        }),
      };
    }
    throw new Error(`Unexpected fetch in test: ${url}`);
  };
  return calls;
};

test('getExperience fetches all four split endpoints and merges the real user over the mocked payload', async () => {
  resetRefreshState();
  installStorage();
  const calls = routeFetch();

  // 'eligible' is the scenario whose fixture has devLinked: true, so the
  // assertion below is meaningful -- asserting against false would pass
  // even if the field were dropped from the merge entirely.
  const result = await getExperience(SESSION, { scenario: 'eligible' });

  assert.deepEqual(calls.sort(), [
    'https://api.test.invalid/api/me/fests',
    'https://api.test.invalid/api/me/items',
    'https://api.test.invalid/api/me/profile',
    'https://api.test.invalid/api/me/progress',
  ]);
  assert.equal(result.user.name, 'Grace Hopper');
  assert.equal(result.user.email, 'real@example.invalid');
  assert.equal(result.user.avatarUrl, null);

  // Fests and activities are live now; this profile carries no fests, so
  // the fallback empty list is correct here.
  assert.deepEqual(result.fests, []);

  // The live progress payload's thresholds and merged activities both flow
  // through getExperience untouched — asserting against the fixture's own
  // { stickers: 1, complete: 3 } and empty activities would pass even if
  // the live progress fetch were ignored entirely.
  assert.deepEqual(result.thresholds, {
    stickers: 1,
    complete: 4,
    completionist: 13,
  });
  const byId = Object.fromEntries(result.activities.map((a) => [a.id, a]));
  assert.equal(byId['livestreams-1'].completed, true);
  assert.equal(byId['livestreams-1'].completedAt, '2026-10-05T19:12:00.000Z');
  assert.equal(byId['livestreams-1'].source, 'event_checkins');
  assert.equal(byId.ghw.completed, false);
  assert.equal(byId.fest.completed, false);
  assert.equal(byId['dev-relay'].completed, false);

  // The required entries flow through beside the activities, trimmed to
  // what the book reads.
  assert.deepEqual(result.required, [
    {
      id: 'signin',
      completed: true,
      completedAt: '2026-10-01T09:00:00.000Z',
      source: 'api',
    },
  ]);

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

/* The inventory's items are the API's (GET /api/me/items), never the
   fixture's: the live merge takes the endpoint's list, and an API answering
   without one gives an empty inventory rather than the mocked pack. */
test('the live experience carries the items the API serves, and nothing else', async () => {
  resetRefreshState();
  installStorage();
  routeFetch();

  const result = await getExperience(SESSION, { scenario: 'complete' });
  assert.deepEqual(result.items, ITEMS.items);

  resetRefreshState();
  routeFetch({ items: {} });
  const bare = await getExperience(SESSION, { scenario: 'complete' });
  assert.deepEqual(bare.items, []);
});

/* A demo secret for a fixture to carry. The 'eligible' fixture has no
   `secrets` field, so the live path's ordering (the payload's secrets laid
   down AFTER the fixture spread) is unobservable unless a test gives it
   one for the run. SCENARIOS is frozen only at the top, so the scenario
   objects themselves can take the field; the helper puts the fixture back
   exactly as it found it, whether the run passes or throws. */
const FIXTURE_SECRETS = [
  {
    id: 'fixture-demo-secret',
    secret: true,
    name: 'A fixture secret',
    description: 'Invented for the mocked build.',
    art: null,
    revealedBy: 'ghw',
    required: false,
    completed: true,
    completedAt: '2026-10-14T12:00:00.000Z',
    source: 'manual',
  },
];

const withFixtureSecrets = async (scenario, run) => {
  const fixture = SCENARIOS[scenario];
  const had = Object.prototype.hasOwnProperty.call(fixture, 'secrets');
  const before = fixture.secrets;
  fixture.secrets = FIXTURE_SECRETS;
  try {
    return await run();
  } finally {
    if (had) fixture.secrets = before;
    else delete fixture.secrets;
  }
};

/* The live payload's secret entries ride beside the activities, never
   inside them. Generic: an invented earned secret and a placeholder,
   revealed by a catalogue sticker picked for no reason but that it
   exists. The 'eligible' fixture is given a secret of its own for the
   run, so the payload's win over it is observable: a fixture's demo
   secrets must never reach a live build. */
test("getExperience carries the payload's secrets beside the activities", async () => {
  resetRefreshState();
  installStorage();
  routeFetch();
  const routed = globalThis.fetch;
  globalThis.fetch = async (url) =>
    String(url).endsWith('/api/me/progress')
      ? {
          ok: true,
          status: 200,
          json: async () => ({
            thresholds: { stickers: 1, complete: 4 },
            completedCount: 2,
            challenges: [
              {
                id: 'ghw',
                completed: true,
                completedAt: '2026-10-13T12:00:00.000Z',
                source: 'import',
              },
              {
                id: 'demo-secret',
                secret: true,
                name: 'A demo secret',
                description: 'Invented for the test.',
                art: null,
                revealedBy: 'ghw',
                required: false,
                completed: true,
                completedAt: '2026-10-14T12:00:00.000Z',
                source: 'manual',
              },
              {
                id: 'secret-1',
                secret: true,
                hint: 'A demo hint',
                revealedBy: 'ghw',
                required: false,
                completed: false,
                completedAt: null,
                source: null,
              },
            ],
          }),
        }
      : routed(url);

  const result = await withFixtureSecrets('eligible', () =>
    getExperience(SESSION, { scenario: 'eligible' }),
  );

  assert.deepEqual(
    result.secrets.map((secret) => secret.id),
    ['demo-secret', 'secret-1'],
  );
  assert.ok(
    result.secrets.every((secret) => secret.id !== 'fixture-demo-secret'),
    "the fixture's secret reached a live result",
  );
  assert.equal(result.secrets[0].name, 'A demo secret');
  assert.equal(result.secrets[1].hint, 'A demo hint');
  assert.ok(result.activities.every((activity) => !activity.secret));
  assert.equal(
    result.activities.find((activity) => activity.id === 'ghw').completed,
    true,
  );
});

/* A payload with no secrets gives an empty list, even over a fixture that
   carries some: the fallback is [] and never the fixture's own. */
test('getExperience gives an empty secrets list when the payload has none', async () => {
  resetRefreshState();
  installStorage();
  routeFetch();

  const result = await withFixtureSecrets('eligible', () =>
    getExperience(SESSION, { scenario: 'eligible' }),
  );

  assert.deepEqual(result.secrets, []);
  // The helper restored the fixture exactly: it started without the field.
  assert.equal(Object.hasOwn(SCENARIOS.eligible, 'secrets'), false);
});

/* The completionist fixture carries demo secrets for the mocked build;
   a live build takes the payload's, and this payload has none. */
test('a live build never shows a fixture’s demo secrets', async () => {
  resetRefreshState();
  installStorage();
  routeFetch();

  const result = await getExperience(SESSION, { scenario: 'completionist' });

  assert.deepEqual(result.secrets, []);
});
