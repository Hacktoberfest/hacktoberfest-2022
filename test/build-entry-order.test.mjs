import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');

/* The Oct 19, 2026 split: production's two App Platform apps built the
   same commit and shipped the /my pages' shared stylesheet under two
   different names, because the CSS inside it came out in two different
   orders. Next resolves each page's entry after an async read of its file,
   so the client entry object's key order is whichever reads finished
   first, and when pages import the same CSS modules in conflicting orders
   (/my/fest reaches PageHero before Header's TodayStrip; the other /my
   pages the reverse), mini-css-extract-plugin breaks the tie by entry
   order. Each app's HTML linked its own name, the other app 404'd it half
   the time, and Cloudflare pinned the 404. These pin the sort that makes
   the entry order a function of the page set alone. */

const fakeConfig = (entries) => ({
  plugins: [],
  module: { rules: [] },
  entry: async () => entries,
});

const clientEntryNames = async (entries, options = {}) => {
  const config = fakeConfig(entries);
  nextConfig.webpack(config, { dev: false, isServer: false, ...options });
  return Object.keys(await config.entry());
};

test('the client build sees its entries sorted by name', async () => {
  assert.deepEqual(
    await clientEntryNames({
      'pages/my/hosting': './hosting',
      'pages/my/fest': './fest',
      main: './main',
      'pages/my': './my',
      'pages/_app': './app',
      'pages/my/promos': './promos',
    }),
    [
      'main',
      'pages/_app',
      'pages/my',
      'pages/my/fest',
      'pages/my/hosting',
      'pages/my/promos',
    ],
  );
});

test('any order Next resolves the pages in gives the same entry order', async () => {
  const pages = [
    'pages/my',
    'pages/my/fest',
    'pages/my/hosting',
    'pages/my/promos',
  ];
  const orders = [
    pages,
    [...pages].reverse(),
    ['pages/my/fest', 'pages/my', 'pages/my/promos', 'pages/my/hosting'],
  ];
  const results = await Promise.all(
    orders.map((order) =>
      clientEntryNames(Object.fromEntries(order.map((name) => [name, name]))),
    ),
  );
  for (const result of results) assert.deepEqual(result, results[0]);
});

test('each entry keeps its own value through the sort', async () => {
  const config = fakeConfig({
    'pages/b': { import: './b', dependOn: 'pages/_app' },
    'pages/a': './a',
  });
  nextConfig.webpack(config, { dev: false, isServer: false });
  assert.deepEqual(await config.entry(), {
    'pages/a': './a',
    'pages/b': { import: './b', dependOn: 'pages/_app' },
  });
});

test('the server and dev compilers keep the entry Next gave them', () => {
  for (const options of [
    { dev: false, isServer: true },
    { dev: true, isServer: false },
  ]) {
    const config = fakeConfig({});
    const original = config.entry;
    nextConfig.webpack(config, options);
    assert.equal(config.entry, original);
  }
});
