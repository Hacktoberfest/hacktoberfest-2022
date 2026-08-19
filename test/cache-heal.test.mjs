import assert from 'node:assert/strict';
import test from 'node:test';

import {
  extractAssetPaths,
  findBrokenAssets,
  healBrokenAssets,
} from '../src/build/post/cache.mjs';

/* The Aug 19 incident: a deploy-window request 404'd on the new build's
   assets and Cloudflare cached those 404s with s-maxage=86400, so /my
   spun on a missing _app chunk for hours while the origin was fine. The
   purge job's fixed 30s/60s waits ran before the poisoning happened. These
   pin the heal loop that replaces the guesswork: read the served HTML,
   check every asset it references through the same edge, purge exactly
   what 404s, and repeat until clean or loudly fail. */

const ORIGIN = 'https://example.com';

const page = (assets) =>
  `<html><head>${assets
    .map((a) =>
      a.endsWith('.css')
        ? `<link rel="stylesheet" href="${a}"/>`
        : `<script src="${a}" defer></script>`,
    )
    .join('')}</head><body></body></html>`;

/* routes: path → status (or a function returning status, for state).
   Records every request so tests can assert on traffic. */
const makeFetch = (routes) => {
  const calls = [];
  const fetchImpl = async (url, opts = {}) => {
    calls.push({ url, method: opts.method ?? 'GET' });
    const { pathname } = new URL(url);
    const entry = routes[pathname];
    if (entry === undefined) throw new Error(`unrouted fetch: ${url}`);
    const status = typeof entry === 'function' ? entry() : entry.status;
    const body = typeof entry === 'function' ? '' : (entry.body ?? '');
    return {
      status,
      ok: status >= 200 && status < 300,
      text: async () => body,
    };
  };
  return { fetchImpl, calls };
};

test('extractAssetPaths collects stylesheet and script paths, deduplicated', () => {
  const html = page([
    '/_next/static/css/aaa.css',
    '/_next/static/chunks/pages/_app-bbb.js',
    '/_next/static/css/aaa.css',
  ]);

  assert.deepEqual(extractAssetPaths(html), [
    '/_next/static/css/aaa.css',
    '/_next/static/chunks/pages/_app-bbb.js',
  ]);
});

test('extractAssetPaths ignores markup without _next assets', () => {
  assert.deepEqual(extractAssetPaths('<html><body>hi</body></html>'), []);
});

test('findBrokenAssets reports assets that 404 through the edge', async () => {
  const { fetchImpl } = makeFetch({
    '/': {
      status: 200,
      body: page(['/_next/static/css/ok.css', '/_next/static/css/gone.css']),
    },
    '/_next/static/css/ok.css': { status: 200 },
    '/_next/static/css/gone.css': { status: 404 },
  });

  const broken = await findBrokenAssets({
    origin: ORIGIN,
    pages: ['/'],
    fetchImpl,
  });

  assert.deepEqual(broken, [`${ORIGIN}/_next/static/css/gone.css`]);
});

test('findBrokenAssets checks a shared asset once across pages', async () => {
  const shared = '/_next/static/chunks/pages/_app-bbb.js';
  const { fetchImpl, calls } = makeFetch({
    '/': { status: 200, body: page([shared]) },
    '/host/': { status: 200, body: page([shared]) },
    [shared]: { status: 200 },
  });

  await findBrokenAssets({ origin: ORIGIN, pages: ['/', '/host/'], fetchImpl });

  const assetChecks = calls.filter(({ url }) => url.includes(shared));
  assert.equal(assetChecks.length, 1);
});

test('findBrokenAssets reports a page that itself does not answer 200', async () => {
  const { fetchImpl } = makeFetch({ '/my/': { status: 404 } });

  const broken = await findBrokenAssets({
    origin: ORIGIN,
    pages: ['/my/'],
    fetchImpl,
  });

  assert.deepEqual(broken, [`${ORIGIN}/my/`]);
});

test('healBrokenAssets purges exactly the broken URLs and stops once clean', async () => {
  let healed = false;
  const { fetchImpl } = makeFetch({
    '/': { status: 200, body: page(['/_next/static/css/gone.css']) },
    '/_next/static/css/gone.css': () => (healed ? 200 : 404),
  });
  const purged = [];

  await healBrokenAssets({
    origin: ORIGIN,
    pages: ['/'],
    attempts: 5,
    fetchImpl,
    sleepImpl: async () => {},
    purgeImpl: async (urls) => {
      purged.push(urls);
      healed = true;
    },
  });

  assert.deepEqual(purged, [[`${ORIGIN}/_next/static/css/gone.css`]]);
});

test('healBrokenAssets does not purge when everything already resolves', async () => {
  const { fetchImpl } = makeFetch({
    '/': { status: 200, body: page(['/_next/static/css/ok.css']) },
    '/_next/static/css/ok.css': { status: 200 },
  });
  const purged = [];

  await healBrokenAssets({
    origin: ORIGIN,
    pages: ['/'],
    attempts: 5,
    fetchImpl,
    sleepImpl: async () => {},
    purgeImpl: async (urls) => purged.push(urls),
  });

  assert.deepEqual(purged, []);
});

test('healBrokenAssets fails loudly when the edge never heals', async () => {
  const { fetchImpl } = makeFetch({
    '/': { status: 200, body: page(['/_next/static/css/stuck.css']) },
    '/_next/static/css/stuck.css': { status: 404 },
  });

  await assert.rejects(
    healBrokenAssets({
      origin: ORIGIN,
      pages: ['/'],
      attempts: 3,
      fetchImpl,
      sleepImpl: async () => {},
      purgeImpl: async () => {},
    }),
    /stuck\.css/,
  );
});
