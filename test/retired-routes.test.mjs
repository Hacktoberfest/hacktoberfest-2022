import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

import { SITE_PAGES } from '../src/build/sitemap.mjs';
import { NAV, navRoutes } from '../src/data/nav.mjs';
import { RETIRED_ROUTES } from '../src/data/retiredRoutes.mjs';

const PAGES = new URL('../src/pages/', import.meta.url);

/* The pages that stay after Hacktoberfest: the homepage, /my, and the
   sign-in path /my cannot work without (data/retiredRoutes.mjs). A new
   page belongs here or on the retired list; one on neither fails the
   first test, which is the point. */
const KEPT_ROUTES = [
  '/',
  '/my/',
  '/my/fest/',
  '/my/hosting/',
  '/my/promos/',
  '/login/',
  '/auth/callback/',
  '/auth/error/',
  '/oauth/mlh/callback/',
  '/signed-out/',
];

// Next's own files, and the 404, which answers every route nobody built.
const NOT_ROUTES = ['_app.js', '_document.js', '404.js'];

const REDIRECT_EXPORT = "export { default } from 'components/RedirectHome';";

// 'index.js' → '/', 'my/fest.js' → '/my/fest/'.
const routeFor = (file) =>
  `/${file.replace(/\.js$/, '').replace(/(^|\/)index$/, '')}/`.replace(
    /\/+/g,
    '/',
  );

const pageFiles = async () =>
  (await readdir(PAGES, { recursive: true })).filter(
    (file) => file.endsWith('.js') && !NOT_ROUTES.includes(file),
  );

test('every page is one that stays or one that is retired', async () => {
  for (const file of await pageFiles()) {
    const route = routeFor(file);
    assert.ok(
      KEPT_ROUTES.includes(route) || RETIRED_ROUTES.includes(route),
      `src/pages/${file} (${route}) is neither kept nor retired`,
    );
  }
});

/* A retired route whose page file went missing would answer 404 instead
   of sending the visitor home, so each one has to be there, and has to be
   the redirect. */
test('every retired route exports the redirect home', async () => {
  const files = await pageFiles();
  for (const route of RETIRED_ROUTES) {
    const file = files.find((candidate) => routeFor(candidate) === route);
    assert.ok(file, `${route} is retired but has no page under src/pages`);
    const source = await readFile(new URL(file, PAGES), 'utf8');
    assert.ok(
      source.includes(REDIRECT_EXPORT),
      `src/pages/${file} is retired but is not components/RedirectHome`,
    );
  }
});

test('no route is both kept and retired', () => {
  for (const route of RETIRED_ROUTES) {
    assert.ok(!KEPT_ROUTES.includes(route), `${route} is on both lists`);
  }
});

test('neither the sitemap nor the nav points at a retired route', () => {
  for (const route of RETIRED_ROUTES) {
    assert.ok(!SITE_PAGES.includes(route), `${route} is in SITE_PAGES`);
    assert.ok(!navRoutes(NAV).includes(route), `${route} is in the nav`);
  }
});
