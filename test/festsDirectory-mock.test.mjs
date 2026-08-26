import assert from 'node:assert/strict';
import test from 'node:test';

/* This file evaluates festsDirectory.mjs in the mocked build. Leaving the
   variable unset used to be enough; unset resolves to the live origin now
   (lib/apiBase.mjs), so the opt-out has to be spelled — and set before the
   dynamic imports, because session.mjs reads it once at module-evaluation
   time. Live mode lives in festsDirectory.test.mjs. */
process.env.NEXT_PUBLIC_API_BASE_URL = 'mocked';

const { FESTS_FIXTURES } = await import('../src/data/festsFixtures.mjs');
const { getFestsDirectory } = await import('../src/lib/festsDirectory.mjs');

test('returns the fixtures when no API base URL is configured', async () => {
  const result = await getFestsDirectory();
  assert.deepEqual(result, FESTS_FIXTURES);
});
