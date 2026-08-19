import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.test.invalid';

const { EXPERIENCE_CACHE_KEY } = await import('../src/lib/session.mjs');
const { readCachedExperience, writeCachedExperience } = await import(
  '../src/lib/experienceCache.mjs'
);

const SESSION = { accessToken: 'a', user: { email: 'ada@example.invalid' } };
const EXPERIENCE = { user: { name: 'Ada' }, fests: [] };

/* A minimal sessionStorage. The real one is unavailable under node:test. */
const installSessionStorage = (initial) => {
  const map = new Map(Object.entries(initial || {}));
  globalThis.sessionStorage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
  return map;
};

test('a written experience reads back for the same user', () => {
  installSessionStorage();
  writeCachedExperience(SESSION, EXPERIENCE);
  assert.deepEqual(readCachedExperience(SESSION), EXPERIENCE);
});

test('another user reads nothing', () => {
  installSessionStorage();
  writeCachedExperience(SESSION, EXPERIENCE);
  assert.equal(
    readCachedExperience({
      accessToken: 'a',
      user: { email: 'other@example.invalid' },
    }),
    null,
  );
});

test('an entry past the age cap reads as nothing', () => {
  const map = installSessionStorage();
  writeCachedExperience(SESSION, EXPERIENCE);
  const stored = JSON.parse(map.get(EXPERIENCE_CACHE_KEY));
  stored.at = Date.now() - 2 * 60 * 60 * 1000;
  map.set(EXPERIENCE_CACHE_KEY, JSON.stringify(stored));
  assert.equal(readCachedExperience(SESSION), null);
});

test('garbage in storage reads as nothing', () => {
  installSessionStorage({ [EXPERIENCE_CACHE_KEY]: 'not json' });
  assert.equal(readCachedExperience(SESSION), null);
});

test('a session without a usable user neither reads nor writes', () => {
  const map = installSessionStorage();
  writeCachedExperience({ accessToken: 'a', user: {} }, EXPERIENCE);
  assert.equal(map.has(EXPERIENCE_CACHE_KEY), false);
  writeCachedExperience(SESSION, EXPERIENCE);
  assert.equal(readCachedExperience({ accessToken: 'a' }), null);
});

test('a missing sessionStorage reads and writes as a no-op', () => {
  delete globalThis.sessionStorage;
  writeCachedExperience(SESSION, EXPERIENCE);
  assert.equal(readCachedExperience(SESSION), null);
});
