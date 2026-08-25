import assert from 'node:assert/strict';
import test from 'node:test';

import {
  extractAssetPaths,
  findBrokenAssets,
  healBrokenAssets,
  inspectPages,
  VERIFY_PAGES,
} from '../src/build/post/cache.mjs';
import { SITE_PAGES } from '../src/build/sitemap.mjs';

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

/* The Aug 25, 2026 recurrence: /sponsor launched with logos under
   /sponsors/*.svg, the deploy window pinned 404s for two of them, and the
   heal loop never noticed because it only matched /_next/. Page images
   fail the same way a chunk does; anything a src attribute references
   from our own origin belongs to the verified set. */
test('extractAssetPaths collects root-relative src attributes alongside _next assets', () => {
  const html = [
    '<html><head>',
    '<script src="/_next/static/chunks/pages/_app-bbb.js" defer></script>',
    '</head><body>',
    '<img src="/sponsors/solana.svg" alt=""/>',
    '<img src="/sponsors/solana.svg" alt=""/>',
    '<img src="https://elsewhere.example/logo.svg" alt=""/>',
    '<img src="//elsewhere.example/proto-relative.svg" alt=""/>',
    '<img src="data:image/svg+xml,x" alt=""/>',
    '</body></html>',
  ].join('');

  assert.deepEqual(extractAssetPaths(html), [
    '/_next/static/chunks/pages/_app-bbb.js',
    '/sponsors/solana.svg',
  ]);
});

/* /sponsor/ launched without joining this list, so its launch-window 404s
   were invisible to the heal job. Deriving the list from the sitemap makes
   that impossible to repeat: a page cannot ship without a sitemap entry,
   and a sitemap entry is a verified page. */
test('every sitemap page is verified after a deploy', () => {
  SITE_PAGES.forEach((pagePath) => {
    assert.ok(
      VERIFY_PAGES.includes(pagePath),
      `${pagePath} is in the sitemap but not verified by the cache heal`,
    );
  });
  ['/sponsor/', '/questions/', '/login/', '/my/'].forEach((pagePath) => {
    assert.ok(VERIFY_PAGES.includes(pagePath), `missing ${pagePath}`);
  });
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

/* While it is still healing, the purge stays targeted — the broken URLs and
   nothing else — and the loop stops the round after the edge reads clean
   rather than burning its remaining attempts. The final zone-wide purge that
   follows is the next test's subject. */
test('healBrokenAssets purges exactly the broken URLs and stops looping once clean', async () => {
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

  assert.deepEqual(purged[0], [`${ORIGIN}/_next/static/css/gone.css`]);
  assert.equal(purged.length, 2, 'one healing round, then the final purge');
});

/* The colo the POST_DEPLOY job happens to reach is one of hundreds, and a
   404 pinned at any of the others is invisible to it — findBrokenAssets can
   only ever report on its own edge. Purge-by-URL, though, is zone-wide. So a
   clean pass is the moment to purge, not a reason to skip it: it is the proof
   that the origin has settled, which is what makes purging every referenced
   URL safe to do everywhere at once. */
test('healBrokenAssets purges every referenced URL once the edge reads clean', async () => {
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

  assert.deepEqual(purged, [
    [`${ORIGIN}/`, `${ORIGIN}/_next/static/css/ok.css`],
  ]);
});

test('healBrokenAssets purges the whole referenced set, not just what 404d', async () => {
  let healed = false;
  const { fetchImpl } = makeFetch({
    '/': {
      status: 200,
      body: page(['/_next/static/css/ok.css', '/_next/static/css/gone.css']),
    },
    '/_next/static/css/ok.css': { status: 200 },
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

  // First the targeted purge that unsticks this edge, then the zone-wide one
  // that covers every colo this job cannot see.
  assert.deepEqual(purged, [
    [`${ORIGIN}/_next/static/css/gone.css`],
    [
      `${ORIGIN}/`,
      `${ORIGIN}/_next/static/css/ok.css`,
      `${ORIGIN}/_next/static/css/gone.css`,
    ],
  ]);
});

test('healBrokenAssets dedupes shared assets across pages in the final purge', async () => {
  const shared = '/_next/static/chunks/pages/_app-bbb.js';
  const { fetchImpl } = makeFetch({
    '/': { status: 200, body: page([shared]) },
    '/host/': { status: 200, body: page([shared]) },
    [shared]: { status: 200 },
  });
  const purged = [];

  await healBrokenAssets({
    origin: ORIGIN,
    pages: ['/', '/host/'],
    attempts: 5,
    fetchImpl,
    sleepImpl: async () => {},
    purgeImpl: async (urls) => purged.push(urls),
  });

  assert.deepEqual(purged, [
    [`${ORIGIN}/`, `${ORIGIN}${shared}`, `${ORIGIN}/host/`],
  ]);
});

test('inspectPages reports the broken URLs and the full referenced set', async () => {
  const { fetchImpl } = makeFetch({
    '/': {
      status: 200,
      body: page(['/_next/static/css/ok.css', '/_next/static/css/gone.css']),
    },
    '/_next/static/css/ok.css': { status: 200 },
    '/_next/static/css/gone.css': { status: 404 },
  });

  const { broken, referenced } = await inspectPages({
    origin: ORIGIN,
    pages: ['/'],
    fetchImpl,
  });

  assert.deepEqual(broken, [`${ORIGIN}/_next/static/css/gone.css`]);
  assert.deepEqual(referenced, [
    `${ORIGIN}/`,
    `${ORIGIN}/_next/static/css/ok.css`,
    `${ORIGIN}/_next/static/css/gone.css`,
  ]);
});

/* A page that does not answer 200 still belongs in the purge set: its own
   cached copy is the thing most likely to be wrong. */
test('inspectPages keeps a non-200 page in the referenced set', async () => {
  const { fetchImpl } = makeFetch({ '/my/': { status: 404 } });

  const { broken, referenced } = await inspectPages({
    origin: ORIGIN,
    pages: ['/my/'],
    fetchImpl,
  });

  assert.deepEqual(broken, [`${ORIGIN}/my/`]);
  assert.deepEqual(referenced, [`${ORIGIN}/my/`]);
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
