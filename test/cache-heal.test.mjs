import assert from 'node:assert/strict';
import test from 'node:test';

import {
  awaitOriginConsistency,
  extractAssetPaths,
  findBrokenAssets,
  healBrokenAssets,
  inspectPages,
  readReferencedUrls,
  sampleOrigins,
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

/* The Aug 21 recurrence, and why the Aug 19 heal loop could not have caught
   it. hacktoberfest.com sits on two App Platform origin nodes, and they do
   not flip together. Nine minutes after the deploy, the job's blanket purge
   had emptied the zone, DEL re-warmed its whole cache, and one request in
   that burst landed on the node that did not yet have /my's CSS module
   bundle. Cloudflare pinned the 404 for a day. /my hydrated fine and
   rendered as unstyled blocks, because CSS 404s do not stop React.

   The loop checked from the job's own colo, got the healthy node, read
   clean, purged, and exited about a minute before DEL poisoned itself. A
   clean read through one edge proves only that the node that colo reached
   was healthy at that instant, which is the assumption these replace: the
   origin is polled directly, past the edge, until every node it answers
   with has served every URL, and only then is anything purged. */

/* Round-robins responses across origin nodes so a URL is served by a
   different node on successive rounds, the way the real edge does. Tests
   use three URLs against two nodes so the alternation actually covers both
   rather than settling into a fixed pairing. */
const makeOriginFetch = (routes, origins = ['node-a', 'node-b']) => {
  let n = 0;
  const calls = [];

  const fetchImpl = async (url, opts = {}) => {
    const parsed = new URL(url);
    const origin = origins[n % origins.length];
    n += 1;
    calls.push({
      url,
      pathname: parsed.pathname,
      search: parsed.search,
      method: opts.method ?? 'GET',
      origin,
    });

    const entry = routes[parsed.pathname];
    if (entry === undefined) throw new Error(`unrouted fetch: ${url}`);
    const resolved = typeof entry === 'function' ? entry(origin) : entry;
    const status = resolved.status;

    return {
      status,
      ok: status >= 200 && status < 300,
      text: async () => resolved.body ?? '',
      headers: {
        get: (name) =>
          name.toLowerCase() === 'x-do-app-origin' ? origin : null,
      },
    };
  };

  return { fetchImpl, calls };
};

const TWO_ASSETS = ['/_next/static/css/one.css', '/_next/static/css/two.css'];

test('readReferencedUrls reads the pages past the edge cache', async () => {
  const { fetchImpl, calls } = makeOriginFetch({
    '/my/': { status: 200, body: page(TWO_ASSETS) },
  });

  const urls = await readReferencedUrls({
    origin: ORIGIN,
    pages: ['/my/'],
    fetchImpl,
    token: 'tok',
  });

  // The page fetch has to miss the edge, or it reports the HTML this colo
  // happens to hold rather than what the origin is actually serving.
  assert.match(calls[0].search, /tok/);
  assert.deepEqual(urls, [
    `${ORIGIN}/my/`,
    `${ORIGIN}${TWO_ASSETS[0]}`,
    `${ORIGIN}${TWO_ASSETS[1]}`,
  ]);
});

test('sampleOrigins reports the status and node for each URL', async () => {
  const { fetchImpl } = makeOriginFetch({
    '/_next/static/css/one.css': { status: 200 },
    '/_next/static/css/two.css': { status: 404 },
  });

  const results = await sampleOrigins({
    urls: TWO_ASSETS.map((a) => `${ORIGIN}${a}`),
    fetchImpl,
    token: 'tok',
  });

  assert.deepEqual(
    results.map(({ status, origin }) => ({ status, origin })),
    [
      { status: 200, origin: 'node-a' },
      { status: 404, origin: 'node-b' },
    ],
  );
});

test('awaitOriginConsistency settles once every node has served every URL', async () => {
  const { fetchImpl } = makeOriginFetch({
    '/my/': { status: 200 },
    '/_next/static/css/one.css': { status: 200 },
    '/_next/static/css/two.css': { status: 200 },
  });

  const result = await awaitOriginConsistency({
    urls: [`${ORIGIN}/my/`, ...TWO_ASSETS.map((a) => `${ORIGIN}${a}`)],
    fetchImpl,
    sleepImpl: async () => {},
    attempts: 20,
    cleanRounds: 2,
  });

  assert.deepEqual([...result.origins].sort(), ['node-a', 'node-b']);
  assert.equal(result.covered, true);
});

/* The incident itself: one node serves the CSS, the other 404s it. Checking
   through a single edge saw only the healthy node. Sampling the origin
   directly must route the same URL to both and refuse to call it settled. */
test('awaitOriginConsistency refuses to settle while one node 404s a URL', async () => {
  const { fetchImpl } = makeOriginFetch({
    '/my/': { status: 200 },
    '/_next/static/css/one.css': { status: 200 },
    '/_next/static/css/two.css': (origin) => ({
      status: origin === 'node-b' ? 404 : 200,
    }),
  });

  await assert.rejects(
    awaitOriginConsistency({
      urls: [`${ORIGIN}/my/`, ...TWO_ASSETS.map((a) => `${ORIGIN}${a}`)],
      fetchImpl,
      sleepImpl: async () => {},
      attempts: 6,
      cleanRounds: 2,
    }),
    /two\.css/,
  );
});

test('awaitOriginConsistency settles once the lagging node catches up', async () => {
  let flipped = false;
  let rounds = 0;
  const { fetchImpl } = makeOriginFetch({
    '/my/': { status: 200 },
    '/_next/static/css/one.css': { status: 200 },
    '/_next/static/css/two.css': (origin) => ({
      status: !flipped && origin === 'node-b' ? 404 : 200,
    }),
  });

  const result = await awaitOriginConsistency({
    urls: [`${ORIGIN}/my/`, ...TWO_ASSETS.map((a) => `${ORIGIN}${a}`)],
    fetchImpl,
    sleepImpl: async () => {
      rounds += 1;
      if (rounds >= 2) flipped = true;
    },
    attempts: 20,
    cleanRounds: 2,
  });

  assert.equal(result.covered, true);
});

/* Never reaching a second node is not the same as finding a broken one. If
   every sample answered 200 and only one node ever replied, the deploy has
   nothing to fail over: warn and continue, rather than blocking a release on
   routing the job does not control. */
test('awaitOriginConsistency proceeds when only one node is ever reachable', async () => {
  const { fetchImpl } = makeOriginFetch(
    {
      '/my/': { status: 200 },
      '/_next/static/css/one.css': { status: 200 },
      '/_next/static/css/two.css': { status: 200 },
    },
    ['node-a'],
  );

  const result = await awaitOriginConsistency({
    urls: [`${ORIGIN}/my/`, ...TWO_ASSETS.map((a) => `${ORIGIN}${a}`)],
    fetchImpl,
    sleepImpl: async () => {},
    attempts: 4,
    cleanRounds: 2,
  });

  assert.deepEqual([...result.origins], ['node-a']);
});

test('awaitOriginConsistency sends a distinct cache-buster every round', async () => {
  const { fetchImpl, calls } = makeOriginFetch({
    '/my/': { status: 200 },
    '/_next/static/css/one.css': { status: 200 },
    '/_next/static/css/two.css': { status: 200 },
  });

  await awaitOriginConsistency({
    urls: [`${ORIGIN}/my/`, ...TWO_ASSETS.map((a) => `${ORIGIN}${a}`)],
    fetchImpl,
    sleepImpl: async () => {},
    attempts: 20,
    cleanRounds: 2,
  });

  const searches = new Set(calls.map((c) => c.search));
  // A repeated query string would be answered from the edge, not the origin.
  assert.ok(searches.size > 1, 'expected a fresh cache-buster per round');
  assert.ok(calls.every((c) => c.method === 'HEAD'));
});

/* A token reused between deploys is not a cache-buster: last deploy left an
   entry under it, and if that entry was a 404 then s-maxage pins it for a
   day and this run grades the previous run's miss. */
test('awaitOriginConsistency uses tokens no other run can collide with', async () => {
  const routes = {
    '/my/': { status: 200 },
    '/_next/static/css/one.css': { status: 200 },
    '/_next/static/css/two.css': { status: 200 },
  };
  const urls = [`${ORIGIN}/my/`, ...TWO_ASSETS.map((a) => `${ORIGIN}${a}`)];

  const run = async () => {
    const { fetchImpl, calls } = makeOriginFetch(routes);
    await awaitOriginConsistency({
      urls,
      fetchImpl,
      sleepImpl: async () => {},
      attempts: 20,
      cleanRounds: 2,
    });
    return calls.map((c) => c.search);
  };

  const first = new Set(await run());
  const second = new Set(await run());

  for (const search of second) {
    assert.ok(!first.has(search), `token ${search} was reused across runs`);
  }
});
