import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NEXT_PUBLIC_API_BASE_URL = 'mocked';

const { acknowledgeFest } = await import('../src/lib/acknowledgements.mjs');

/* The modules read process.env at import time, so the sentinel must be set
   before this file's first import of them. node:test runs files in isolated
   processes, so setting it here is safe. */

test('the mocked build acknowledges without a backend', async () => {
  let fetched = false;
  globalThis.fetch = async () => {
    fetched = true;
    throw new Error('the mocked build must not call the network');
  };

  const result = await acknowledgeFest('fest-azores');

  assert.equal(fetched, false);
  assert.equal(typeof result.acknowledgedAt, 'string');
  assert.ok(!Number.isNaN(Date.parse(result.acknowledgedAt)));
  assert.equal(result.acknowledgedBy, 'mock-host');
});
