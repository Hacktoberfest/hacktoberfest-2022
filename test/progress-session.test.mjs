import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EXPERIENCE_CACHE_KEY,
  RETURN_TO_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  clearSession,
  displayName,
  getSession,
  isMissingEmailOnly,
  parseSession,
  saveSession,
  takeReturnTo,
} from '../src/lib/session.mjs';

const VALID = {
  accessToken: 'access-abc',
  refreshToken: 'refresh-xyz',
  user: {
    id: 'user-1',
    email: 'ada@example.invalid',
    firstName: 'Ada',
    lastName: 'Lovelace',
  },
};

test('the storage key is stable', () => {
  assert.equal(SESSION_STORAGE_KEY, 'hacktoberfest.session');
});

test('parseSession accepts a well-formed session', () => {
  assert.deepEqual(parseSession(JSON.stringify(VALID)), VALID);
});

test('parseSession fills absent optional fields with null', () => {
  const raw = JSON.stringify({
    accessToken: 'access-abc',
    user: { email: 'ada@example.invalid' },
  });

  assert.deepEqual(parseSession(raw), {
    accessToken: 'access-abc',
    refreshToken: null,
    user: {
      id: null,
      email: 'ada@example.invalid',
      firstName: null,
      lastName: null,
    },
  });
});

test('parseSession rejects anything without a usable access token', () => {
  const noToken = JSON.stringify({ user: { email: 'ada@example.invalid' } });
  const emptyToken = JSON.stringify({
    accessToken: '',
    user: { email: 'ada@example.invalid' },
  });

  assert.equal(parseSession(noToken), null);
  assert.equal(parseSession(emptyToken), null);
});

test('parseSession rejects anything without a usable email', () => {
  const noUser = JSON.stringify({ accessToken: 'access-abc' });
  const noEmail = JSON.stringify({ accessToken: 'access-abc', user: {} });
  const emptyEmail = JSON.stringify({
    accessToken: 'access-abc',
    user: { email: '' },
  });

  assert.equal(parseSession(noUser), null);
  assert.equal(parseSession(noEmail), null);
  assert.equal(parseSession(emptyEmail), null);
});

/* The exact expression /auth/callback/ now guards its redirect with. MyMLH
   lets people withhold their email, so this payload is a legitimate, fully
   successful /auth/token response — and it is unusable, because parseSession
   will reject it when /my/ reads it back. Storing it would send the
   participant to /my/ only to bounce them to /login/ with nothing said, so
   the page has to spot it before it redirects.

   There is no component-test harness in this repo (no jsdom, no react test
   renderer, and no new dependencies), so this covers the decision the page
   makes rather than the render that follows it. */
test('a withheld MyMLH email round-trips to null, so the callback cannot store it', () => {
  const withheldEmail = {
    accessToken: 'access-abc',
    refreshToken: 'refresh-xyz',
    user: { id: 'user-1', email: null, firstName: 'Ada', lastName: 'Lovelace' },
  };

  assert.equal(parseSession(JSON.stringify(withheldEmail)), null);

  // The same expression on a good response yields something storable.
  assert.deepEqual(parseSession(JSON.stringify(VALID)), VALID);
});

/* The write side's extra demand, which /auth/callback/ now passes. A
   /auth/token response missing refreshToken is well-formed enough to store
   and useless fifteen minutes later: refreshSession returns null, apiFetch
   clears the session, and /my bounces to /login/ with nothing said. Without
   the option the guard on what gets written was weaker than refreshSession's
   own, which already requires both tokens. */
test('parseSession can be told to require a refreshToken', () => {
  const noRefresh = JSON.stringify({
    accessToken: 'access-abc',
    user: { email: 'ada@example.invalid' },
  });
  const emptyRefresh = JSON.stringify({
    accessToken: 'access-abc',
    refreshToken: '',
    user: { email: 'ada@example.invalid' },
  });
  const numericRefresh = JSON.stringify({
    accessToken: 'access-abc',
    refreshToken: 12345,
    user: { email: 'ada@example.invalid' },
  });

  [noRefresh, emptyRefresh, numericRefresh].forEach((raw) => {
    assert.equal(parseSession(raw, { requireRefreshToken: true }), null);
    // ...and the read side still accepts it, which is the whole point of the
    // option: an existing session near the end of its life stays usable.
    assert.ok(parseSession(raw));
  });

  // A complete response is unaffected either way.
  assert.deepEqual(
    parseSession(JSON.stringify(VALID), { requireRefreshToken: true }),
    VALID,
  );
});

/* The second half of that decision. parseSession saying no is not one story:
   a withheld email is a successful exchange the participant can fix on
   MyMLH, and everything else is a response we could not read. They get
   opposite copy and opposite CTAs on /auth/callback/, and this predicate is
   what tells them apart. */
test('isMissingEmailOnly spots a withheld MyMLH email', () => {
  assert.equal(
    isMissingEmailOnly({
      accessToken: 'access-abc',
      refreshToken: 'refresh-xyz',
      user: { id: 'user-1', email: null, firstName: 'Ada' },
    }),
    true,
  );

  // An email that is present but empty is withheld by any useful definition.
  assert.equal(
    isMissingEmailOnly({ accessToken: 'access-abc', user: { email: '' } }),
    true,
  );
});

/* The line that stops "no email" becoming the excuse for every bad response:
   without an accessToken and a user object there is no evidence the exchange
   succeeded at all, so blaming MyMLH's profile would be a guess — and would
   hand the participant a CTA that fixes nothing. */
test('isMissingEmailOnly refuses to blame a response it cannot read', () => {
  [
    VALID,
    undefined,
    null,
    'a string',
    [],
    {},
    { user: { email: null } },
    { accessToken: '', user: { email: null } },
    { accessToken: 'access-abc' },
    { accessToken: 'access-abc', user: null },
    { accessToken: 'access-abc', user: [] },
    /* An email that is present but the wrong type is a contract break, not a
       withheld address. Telling that participant MyMLH shared no email sends
       them off to add one they already have, which cannot help — the
       response we could not read is what `failed` is for. */
    { accessToken: 'access-abc', user: { email: 12345 } },
    { accessToken: 'access-abc', user: { email: { primary: 'a@b.invalid' } } },
    { accessToken: 'access-abc', user: { email: ['a@b.invalid'] } },
    { accessToken: 'access-abc', user: { email: false } },
  ].forEach((payload) =>
    assert.equal(
      isMissingEmailOnly(payload),
      false,
      `${JSON.stringify(payload)} is not a withheld email`,
    ),
  );
});

test('parseSession rejects junk', () => {
  assert.equal(parseSession(null), null);
  assert.equal(parseSession(''), null);
  assert.equal(parseSession('not json at all'), null);
  assert.equal(parseSession('null'), null);
  assert.equal(parseSession('"a string"'), null);
  assert.equal(parseSession('[]'), null);
});

test('displayName joins the two name parts', () => {
  assert.equal(displayName(VALID.user), 'Ada Lovelace');
});

test('displayName tolerates a missing half', () => {
  assert.equal(displayName({ firstName: 'Ada', lastName: null }), 'Ada');
  assert.equal(
    displayName({ firstName: null, lastName: 'Lovelace' }),
    'Lovelace',
  );
});

test('displayName returns an empty string when there is no name at all', () => {
  assert.equal(displayName({ firstName: null, lastName: null }), '');
  assert.equal(displayName(null), '');
  assert.equal(displayName(undefined), '');
});

/* Node has no localStorage/sessionStorage at all, so globalThis.<name> is
   simply undefined in every test above: that only proves the module
   tolerates storage being absent, not that it survives storage that is
   present but hostile. Safari in private mode does not make localStorage
   undefined -- it defines the property but throws when it is *accessed*.
   withThrowingStorage simulates exactly that by installing a getter that
   throws, and restores whatever was there afterwards so later tests are
   unaffected. */
const withThrowingStorage = (propertyName, run) => {
  const hadOwnProperty = Object.prototype.hasOwnProperty.call(
    globalThis,
    propertyName,
  );
  const originalDescriptor = hadOwnProperty
    ? Object.getOwnPropertyDescriptor(globalThis, propertyName)
    : undefined;

  Object.defineProperty(globalThis, propertyName, {
    configurable: true,
    get() {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    },
  });

  try {
    run();
  } finally {
    if (hadOwnProperty) {
      Object.defineProperty(globalThis, propertyName, originalDescriptor);
    } else {
      delete globalThis[propertyName];
    }
  }
};

/* A storage that is present and reachable, but backed by a plain object
   instead of the real Storage API -- enough to exercise getItem/setItem/
   removeItem round-trips without needing a DOM. Restores whatever was
   there afterwards, same as withThrowingStorage. */
const withMockStorage = (propertyName, initial, run) => {
  const hadOwnProperty = Object.prototype.hasOwnProperty.call(
    globalThis,
    propertyName,
  );
  const originalDescriptor = hadOwnProperty
    ? Object.getOwnPropertyDescriptor(globalThis, propertyName)
    : undefined;

  const backing = { ...initial };
  const mock = {
    getItem: (key) =>
      Object.prototype.hasOwnProperty.call(backing, key) ? backing[key] : null,
    setItem: (key, value) => {
      backing[key] = String(value);
    },
    removeItem: (key) => {
      delete backing[key];
    },
  };

  Object.defineProperty(globalThis, propertyName, {
    configurable: true,
    value: mock,
  });

  try {
    run(mock);
  } finally {
    if (hadOwnProperty) {
      Object.defineProperty(globalThis, propertyName, originalDescriptor);
    } else {
      delete globalThis[propertyName];
    }
  }
};

test('getSession returns null when storage is unavailable', () => {
  assert.equal(getSession(), null);
});

test('getSession returns null when localStorage throws on access (Safari private mode)', () => {
  withThrowingStorage('localStorage', () => {
    assert.equal(getSession(), null);
  });
});

test('saveSession does not throw when storage is unavailable', () => {
  assert.doesNotThrow(() => saveSession(VALID));
});

test('saveSession does not throw when localStorage throws on access', () => {
  withThrowingStorage('localStorage', () => {
    assert.doesNotThrow(() => saveSession(VALID));
  });
});

test('saveSession does not throw when setItem itself throws (storage full)', () => {
  const hadOwnProperty = Object.prototype.hasOwnProperty.call(
    globalThis,
    'localStorage',
  );
  const originalDescriptor = hadOwnProperty
    ? Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
    : undefined;

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {},
    },
  });

  try {
    assert.doesNotThrow(() => saveSession(VALID));
  } finally {
    if (hadOwnProperty) {
      Object.defineProperty(globalThis, 'localStorage', originalDescriptor);
    } else {
      delete globalThis.localStorage;
    }
  }
});

test('takeReturnTo returns /my/ when sessionStorage throws on access', () => {
  withThrowingStorage('sessionStorage', () => {
    assert.equal(takeReturnTo(), '/my/');
  });
});

/* The regression net for the open-redirect fix. Every one of these starts
   with "/" (so a bare startsWith('/') check would have let it through) but
   resolves off-origin once the WHATWG URL parser normalizes it -- the exact
   parser location.assign() uses. "//evil.example" is the plain
   protocol-relative form; "/\evil.example" is the backslash-normalization
   variant; the tab/newline/CR cases are the parser-strips-control-characters
   bypass that survived the first fix round (a character blacklist on
   value[1] does not catch a control character sitting between two slashes,
   which the parser deletes before resolving -- collapsing "/\t/evil.example"
   into "//evil.example"). "https://evil.example" and "javascript:alert(1)"
   don't even start with "/" post-parse in a way that keeps the origin, and
   an empty string is rejected by the leading-"/" pre-filter before URL
   parsing ever runs. */
const HOSTILE_RETURN_TO_VALUES = [
  '//evil.example',
  '/\\evil.example',
  '/\t/evil.example',
  '/\n/evil.example',
  '/\r/evil.example',
  'https://evil.example',
  'javascript:alert(1)',
  '',
];

for (const value of HOSTILE_RETURN_TO_VALUES) {
  test(`takeReturnTo rejects ${JSON.stringify(value)} and falls back to /my/`, () => {
    withMockStorage(
      'sessionStorage',
      { [RETURN_TO_STORAGE_KEY]: value },
      (mock) => {
        assert.equal(takeReturnTo(), '/my/');
        assert.equal(mock.getItem(RETURN_TO_STORAGE_KEY), null);
      },
    );
  });
}

/* Same-origin values must keep working, including one that looks alarming
   at a glance: "/%2Fevil.example" is a percent-encoded slash inside a single
   path segment, not a second literal "/", so it resolves to a same-origin
   path (the literal segment "/evil.example", still under our own origin)
   and is legitimately safe to round-trip. */
const SAFE_RETURN_TO_VALUES = [
  '/my/',
  '/my/?scenario=error',
  '/%2Fevil.example',
];

for (const value of SAFE_RETURN_TO_VALUES) {
  test(`takeReturnTo round-trips ${JSON.stringify(value)} unchanged`, () => {
    withMockStorage(
      'sessionStorage',
      { [RETURN_TO_STORAGE_KEY]: value },
      () => {
        assert.equal(takeReturnTo(), value);
      },
    );
  });
}

test('takeReturnTo clears the stashed value after reading it', () => {
  withMockStorage(
    'sessionStorage',
    { [RETURN_TO_STORAGE_KEY]: '/my/activities/' },
    (mock) => {
      assert.equal(takeReturnTo(), '/my/activities/');
      assert.equal(mock.getItem(RETURN_TO_STORAGE_KEY), null);
      // Nothing left to take on a second read.
      assert.equal(takeReturnTo(), '/my/');
    },
  );
});

/* startLogin branches on API_BASE_URL, which session.mjs reads once at
   module-evaluation time -- so one import cannot exercise both sides. Node
   keys the ESM module cache on the full specifier, so an otherwise-ignored
   query string buys a fresh evaluation under a different environment. */
const ENV_KEYS = ['NEXT_PUBLIC_API_BASE_URL', 'NEXT_PUBLIC_AUTH_START_URL'];

const loadSessionModule = async (tag, env) => {
  const saved = ENV_KEYS.map((key) => [key, process.env[key]]);

  ENV_KEYS.forEach((key) => delete process.env[key]);
  Object.entries(env).forEach(([key, value]) => {
    process.env[key] = value;
  });

  try {
    return await import(`../src/lib/session.mjs?${tag}`);
  } finally {
    saved.forEach(([key, value]) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  }
};

const API_BASE = 'https://api.test.invalid';

const realMode = await loadSessionModule('real', {
  NEXT_PUBLIC_API_BASE_URL: API_BASE,
});
const overrideMode = await loadSessionModule('override', {
  NEXT_PUBLIC_API_BASE_URL: API_BASE,
  NEXT_PUBLIC_AUTH_START_URL: 'https://auth.test.invalid/start',
});
const mockMode = await loadSessionModule('mock', {});

/* Node has no `location`, and startLogin's entire observable effect is the
   URL it hands to location.assign. Restores whatever was there, same as the
   storage helpers above. */
const withLocation = (run) => {
  const hadOwnProperty = Object.prototype.hasOwnProperty.call(
    globalThis,
    'location',
  );
  const originalDescriptor = hadOwnProperty
    ? Object.getOwnPropertyDescriptor(globalThis, 'location')
    : undefined;

  const assigned = [];
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: {
      assign: (url) => {
        assigned.push(String(url));
      },
    },
  });

  try {
    run(assigned);
  } finally {
    if (hadOwnProperty) {
      Object.defineProperty(globalThis, 'location', originalDescriptor);
    } else {
      delete globalThis.location;
    }
  }
};

/* The path is /oauth/mlh, not /auth/mlh. /auth/* is the token endpoints'
   namespace; getting this wrong 404s the very first hop of every sign-in. */
test('startLogin hands off to the API oauth start URL', () => {
  withMockStorage('sessionStorage', {}, () => {
    withLocation((assigned) => {
      realMode.startLogin();
      assert.deepEqual(assigned, ['https://api.test.invalid/oauth/mlh']);
    });
  });
});

/* The API ignores query parameters and always redirects to a fixed callback,
   so the destination has to survive the round trip in sessionStorage --
   takeReturnTo is the other half of this handshake. */
test('startLogin stashes the destination for takeReturnTo to pick up', () => {
  withMockStorage('sessionStorage', {}, (store) => {
    withLocation(() => {
      realMode.startLogin('/my/activities/');
      assert.equal(store.getItem(RETURN_TO_STORAGE_KEY), '/my/activities/');
    });
  });
});

test('startLogin stashes /my/ when given no destination', () => {
  withMockStorage('sessionStorage', {}, (store) => {
    withLocation(() => {
      realMode.startLogin();
      assert.equal(store.getItem(RETURN_TO_STORAGE_KEY), '/my/');
    });
  });
});

test('startLogin still redirects when sessionStorage refuses the stash', () => {
  withThrowingStorage('sessionStorage', () => {
    withLocation((assigned) => {
      assert.doesNotThrow(() => realMode.startLogin('/my/'));
      assert.deepEqual(assigned, ['https://api.test.invalid/oauth/mlh']);
    });
  });
});

test('NEXT_PUBLIC_AUTH_START_URL overrides the derived oauth start URL', () => {
  withMockStorage('sessionStorage', {}, (store) => {
    withLocation((assigned) => {
      overrideMode.startLogin('/my/');
      assert.deepEqual(assigned, ['https://auth.test.invalid/start']);
      // The override changes where we go, not what we remember.
      assert.equal(store.getItem(RETURN_TO_STORAGE_KEY), '/my/');
    });
  });
});

/* With no API configured the whole OAuth hop is skipped: startLogin writes a
   session good enough for parseSession and goes straight to the destination.
   That is what keeps `npm run dev` usable with no backend at all. */
test('startLogin in mock mode writes a readable session and redirects locally', () => {
  withMockStorage('localStorage', {}, (store) => {
    withLocation((assigned) => {
      mockMode.startLogin('/my/');

      const saved = parseSession(store.getItem(SESSION_STORAGE_KEY));
      assert.equal(saved.accessToken, 'mock-access-token');
      assert.equal(saved.refreshToken, 'mock-refresh-token');
      assert.equal(saved.user.email, 'ada@example.invalid');
      assert.deepEqual(assigned, ['/my/']);
    });
  });
});

/* The mock branch does not round-trip through takeReturnTo, so it has to run
   the same isSafeReturnTo check itself -- otherwise the two branches disagree
   about whether a caller's destination is trusted. */
for (const value of HOSTILE_RETURN_TO_VALUES) {
  test(`startLogin in mock mode refuses to redirect to ${JSON.stringify(value)}`, () => {
    withMockStorage('localStorage', {}, () => {
      withLocation((assigned) => {
        mockMode.startLogin(value);
        assert.deepEqual(assigned, ['/my/']);
      });
    });
  });
}

test('startLogin in mock mode redirects even when localStorage is hostile', () => {
  withThrowingStorage('localStorage', () => {
    withLocation((assigned) => {
      assert.doesNotThrow(() => mockMode.startLogin('/my/'));
      assert.deepEqual(assigned, ['/my/']);
    });
  });
});

/* The cached hub payload is personalized data keyed to the session; signing
   out must take it with the tokens, or the next person on a shared machine
   inherits the previous person's hub for up to the cache's age cap. */
test('clearSession clears the cached experience along with the session', () => {
  withMockStorage(
    'localStorage',
    { [SESSION_STORAGE_KEY]: JSON.stringify(VALID) },
    () => {
      withMockStorage(
        'sessionStorage',
        { [EXPERIENCE_CACHE_KEY]: '{"forUser":"x","at":1,"value":{}}' },
        (experienceStore) => {
          clearSession();
          assert.equal(
            globalThis.localStorage.getItem(SESSION_STORAGE_KEY),
            null,
          );
          assert.equal(experienceStore.getItem(EXPERIENCE_CACHE_KEY), null);
        },
      );
    },
  );
});

test('clearSession still clears the session when sessionStorage is hostile', () => {
  withMockStorage(
    'localStorage',
    { [SESSION_STORAGE_KEY]: JSON.stringify(VALID) },
    () => {
      withThrowingStorage('sessionStorage', () => {
        assert.doesNotThrow(clearSession);
        assert.equal(
          globalThis.localStorage.getItem(SESSION_STORAGE_KEY),
          null,
        );
      });
    },
  );
});

/* The mirror of startLogin's fork. Sign-out has to end the MyMLH session as
   well as ours: revoking our refresh token leaves MLH's own cookie alive, so
   the next sign-in completes silently -- on a shared machine, straight into
   the previous participant's account. */
test('signOutDestination sends live builds to MyMLH sign-out', () => {
  assert.equal(realMode.signOutDestination(), 'https://www.mlh.com/signout');
});

/* Pinned to the exact string rather than asserting a substring. MLH 404s
   every other spelling (/logout, /sign_out, /users/sign_out ...), and a
   sign-out that lands on a 404 leaves the cookie alive while looking like it
   worked. A stray campaign tag would be just as silent -- MLH discards query
   parameters on this route. */
test('the MyMLH sign-out URL carries no query parameters', () => {
  const url = new URL(realMode.signOutDestination());
  assert.equal(url.origin, 'https://www.mlh.com');
  assert.equal(url.pathname, '/signout');
  assert.equal(url.search, '');
});

/* Mocked builds must stay on the origin. Sending them to mlh.com would throw
   a developer clean out of their own dev server with no way back. `/` is the
   signed-out face of the site. */
test('signOutDestination keeps mock mode on the local origin', () => {
  assert.equal(mockMode.signOutDestination(), '/');
});
