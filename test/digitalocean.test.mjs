import assert from 'node:assert/strict';
import test from 'node:test';

/* session.mjs reads the API base once at import, so the opt-out is spelled
   before the dynamic import, as the other progress tests do. */
process.env.NEXT_PUBLIC_API_BASE_URL = 'mocked';

const { connectOutcome, startDigitalOceanConnect, OUTCOMES } = await import(
  '../src/lib/digitalocean.mjs'
);
const { my } = await import('../src/data/content.mjs');

test('the return query names the outcome, or nothing when this is not a return', () => {
  assert.equal(connectOutcome('?connected=digitalocean'), 'connected');
  assert.equal(
    connectOutcome('?connected=digitalocean&error=already-linked'),
    'already-linked',
  );
  assert.equal(
    connectOutcome('?connected=digitalocean&error=denied'),
    'denied',
  );
  assert.equal(
    connectOutcome('?connected=digitalocean&error=something-new'),
    'unavailable',
  );
  assert.equal(connectOutcome('?scenario=eligible'), null);
  assert.equal(connectOutcome('?connected=github'), null);
  assert.equal(connectOutcome(''), null);
  assert.equal(connectOutcome(undefined), null);
});

test('every outcome has a sentence on /my', () => {
  OUTCOMES.forEach((outcome) => {
    const line = my.connect.digitalocean[outcome];
    assert.equal(typeof line, 'string', outcome);
    assert.ok(line.length > 10, outcome);
    assert.doesNotMatch(line, /—/);
  });
});

test('the mocked build comes straight back as connected', async () => {
  const visits = [];
  await startDigitalOceanConnect({
    apiBaseUrl: '',
    fetcher: () => {
      throw new Error('must not be called');
    },
    navigate: (url) => visits.push(url),
  });
  assert.deepEqual(visits, ['/my/?connected=digitalocean']);
});

test('live, the button asks the API for the URL and goes there', async () => {
  const calls = [];
  const visits = [];
  await startDigitalOceanConnect({
    apiBaseUrl: 'https://api.test.invalid',
    fetcher: async (path, options) => {
      calls.push([path, options.method]);
      return { url: 'https://api.test.invalid/oauth/digitalocean?ticket=t' };
    },
    navigate: (url) => visits.push(url),
  });
  assert.deepEqual(calls, [['/api/me/digitalocean/start', 'POST']]);
  assert.deepEqual(visits, [
    'https://api.test.invalid/oauth/digitalocean?ticket=t',
  ]);
});

test('a start that fails lands on /my as unavailable, never a blank page', async () => {
  const visits = [];
  await startDigitalOceanConnect({
    apiBaseUrl: 'https://api.test.invalid',
    fetcher: async () => {
      throw Object.assign(new Error('down'), { status: 503 });
    },
    navigate: (url) => visits.push(url),
  });
  assert.deepEqual(visits, ['/my/?connected=digitalocean&error=unavailable']);

  const noUrl = [];
  await startDigitalOceanConnect({
    apiBaseUrl: 'https://api.test.invalid',
    fetcher: async () => ({}),
    navigate: (url) => noUrl.push(url),
  });
  assert.deepEqual(noUrl, ['/my/?connected=digitalocean&error=unavailable']);
});
