import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'mocked';

const { OPT_INS_ERROR_SCENARIO, saveSponsorOptIn } = await import(
  '../src/lib/sponsorOptIns.mjs'
);

/* The modules read process.env at import time, so the sentinel must be set
   before this file's first import of them. node:test runs files in isolated
   processes, so setting it here is safe. */

const offline = () => {
  globalThis.fetch = async () => {
    throw new Error('the mocked build must not call the network');
  };
};

test('the mocked build saves without a backend, after a beat', async () => {
  offline();
  globalThis.location = { search: '' };

  const started = Date.now();
  const saved = await saveSponsorOptIn('temporal', true);

  assert.ok(Date.now() - started >= 300, 'the saving state should show');
  assert.deepEqual(saved, {
    digitalocean: false,
    temporal: true,
    'prior-labs': false,
  });
});

test('the mocked build remembers the answers already given', async () => {
  offline();
  globalThis.location = { search: '' };

  await saveSponsorOptIn('digitalocean', true);
  const saved = await saveSponsorOptIn('temporal', false);

  assert.deepEqual(saved, {
    digitalocean: true,
    temporal: false,
    'prior-labs': false,
  });
});

test('?scenario=opt-ins-error makes every mocked save fail', async () => {
  offline();
  assert.equal(OPT_INS_ERROR_SCENARIO, 'opt-ins-error');
  globalThis.location = { search: '?scenario=opt-ins-error' };

  await assert.rejects(
    () => saveSponsorOptIn('prior-labs', true),
    (error) => {
      assert.equal(error.status, 500);
      return true;
    },
  );
});
