import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

import { CLOSED_ROUTES } from '../src/data/closedRoutes.mjs';
import { RETIRED_ROUTES } from '../src/data/retiredRoutes.mjs';

const readOutput = (route) =>
  readFile(new URL(`../out${route}index.html`, import.meta.url), 'utf8');

const missing = async (path) =>
  stat(new URL(`../out/${path}`, import.meta.url)).then(
    () => false,
    (error) => error.code === 'ENOENT',
  );

/* A retired route (src/data/retiredRoutes.mjs) still exports a page, and
   the page is components/RedirectHome. Its HTML has to leave on its own,
   before any script runs: a zero-second refresh to /, which search
   engines read as a permanent redirect, with the canonical naming the
   homepage. And it has to have nothing of the old page left in it. */
for (const route of RETIRED_ROUTES) {
  test(`${route} sends the visitor home`, async () => {
    const html = await readOutput(route);

    assert.match(
      html,
      /<meta[^>]*http-equiv="refresh"[^>]*content="0; url=\/"/,
      `${route}: no zero-second refresh to /`,
    );
    const canonical = html.match(
      /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/,
    );
    assert.ok(canonical, `${route}: no canonical`);
    assert.equal(
      new URL(canonical[1], 'https://hacktoberfest.com').pathname,
      '/',
      `${route}: the canonical is not the homepage`,
    );
    assert.doesNotMatch(html, /<main\b/, `${route}: still renders a page`);
    assert.doesNotMatch(
      html,
      /aria-label="Main navigation"/,
      `${route}: still renders the header`,
    );
  });
}

/* The homepage is what every retired route lands on, so it must not send
   anyone back to one: no link to a retired page, with or without a query
   or a hash. */
test('the homepage links to no retired page', async () => {
  const html = await readOutput('/');
  const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map(
    (match) => new URL(match[1], 'https://hacktoberfest.com'),
  );
  hrefs
    .filter((url) => url.hostname === 'hacktoberfest.com')
    .forEach((url) =>
      assert.ok(
        !RETIRED_ROUTES.includes(url.pathname),
        `the homepage links to ${url.pathname}`,
      ),
    );
});

/* Moved here from the /fests/ page test when /fests/ was retired.
   Vacuous today by design: CLOSED_ROUTES is empty, so this proves nothing
   until someone closes a route. That is the point: the day an entry lands
   there, the pruner has to have actually run for it. */
test('every closed route is absent from the export', async () => {
  for (const route of CLOSED_ROUTES) {
    const segment = route.replace(/^\/+|\/+$/g, '');
    assert.ok(
      await missing(`${segment}/index.html`),
      `${route} is closed but still exported`,
    );
  }
});
