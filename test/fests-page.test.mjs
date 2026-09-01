import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import test from 'node:test';

import { CLOSED_ROUTES, routeIsClosed } from '../src/data/closedRoutes.mjs';
import { fests } from '../src/data/content.mjs';
import { FESTS_FIXTURES } from '../src/data/festsFixtures.mjs';
import { festFormatFromName } from '../src/lib/festFormat.mjs';
import { splitFestName } from '../src/lib/festName.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const missing = async (path) =>
  stat(new URL(`../out/${path}`, import.meta.url)).then(
    () => false,
    (error) => error.code === 'ENOENT',
  );

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* /fests spent a while closed (src/data/closedRoutes.mjs): the directory
   had nothing real to list until approved Fests were published, so the
   postbuild pruner deleted it out of the export. It is open again, and
   this file is the contract for that — every assertion below is the
   mirror of one that used to prove the opposite.

   Stated as `routeIsClosed` rather than left implicit because closing the
   route again is a one-line edit in a file this page never imports. If
   that line comes back, the failure should name it. */
test('/fests is an open route', () => {
  assert.equal(
    routeIsClosed('/fests/'),
    false,
    '/fests/ is back in CLOSED_ROUTES — the pruner will delete it from the export',
  );
});

test('/fests builds with its title and hero copy', async () => {
  const html = await readOutput('fests/index.html');
  const titlePattern = new RegExp(
    `<title[^>]*>${escapeRegExp(fests.title)}</title>`,
  );
  assert.match(html, titlePattern);
  assert.ok(html.includes(fests.eyebrow));
  assert.ok(html.includes(fests.intro));
});

test('/fests invites visitors without a local Fest to host one', async () => {
  const html = await readOutput('fests/index.html');
  /* The callout is static page markup, so it must be in the export — on
     screen whatever the directory's client-side fetch is doing. */
  assert.ok(html.includes(fests.hostCallout.title));
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="/host/"[^>]*>${escapeRegExp(fests.hostCallout.cta)}</a>`,
    ),
  );
});

/* The directory arrives client-side, so what the export actually contains
   is the loading surface — and that surface is what a screen reader is
   left on if the fetch is slow or the retry path is taken. Pinned here
   because it is the one piece of the directory's accessibility wiring that
   reaches static HTML; the rest (the live results count, the location
   status) only exists after hydration, which this suite cannot reach. */
test('the exported loading surface is a status region', async () => {
  const html = await readOutput('fests/index.html');
  assert.match(
    html,
    /class="[^"]*FestsDirectory_loading[^"]*"[^>]*role="status"/,
  );
  assert.ok(html.includes(fests.loading));
});

/* The directory itself renders client-side, so the page chunk is what
   actually carries the search, the map toggle and the fixtures. An
   exported HTML file with no chunk beside it is a page that renders its
   hero and then nothing. */
test('the /fests page ships its JS chunk', async () => {
  const entries = await readdir(
    new URL('../out/_next/static/chunks/pages/', import.meta.url),
  );
  assert.ok(
    entries.some((entry) => /^fests-[0-9a-f]+\.js$/.test(entry)),
    'no fests page chunk in the export',
  );
});

/* The public asset the /my why-host band renders. It sits next to the
   route in out/ and shares its prefix, so it is what a loose match in the
   pruner would take. Kept pinned while the pruner exists at all. */
test('the fests-why-host image survives the postbuild steps', async () => {
  assert.ok(!(await missing('fests-why-host.jpg')));
});

/* Vacuous today by design: CLOSED_ROUTES is empty, so this proves nothing
   until someone closes a route. That is the point — the day an entry
   lands here, the pruner has to have actually run for it. */
test('every closed route is absent from the export', async () => {
  for (const route of CLOSED_ROUTES) {
    const segment = route.replace(/^\/+|\/+$/g, '');
    assert.ok(
      await missing(`${segment}/index.html`),
      `${route} is closed but still exported`,
    );
  }
});

/* Find a Fest is ON the nav: the directory is published, so the site
   advertises it, and the position matters as much as the presence. It
   sits directly behind Home and ahead of the host-facing links — it is
   the one destination there for someone who wants to attend rather than
   run a Fest, and it is where every retired "notify me about local
   Fests" ask now points. */
test('the homepage nav offers Find a Fest behind Home', async () => {
  const html = await readOutput('index.html');
  const nav = html.match(
    /<nav[^>]*aria-label="Main navigation"[\s\S]*?<\/nav>/,
  );
  assert.ok(nav, 'the main navigation is missing from the homepage');

  assert.match(nav[0], /<a[^>]*href="\/"[^>]*>Home<\/a>/);
  assert.match(nav[0], /<a[^>]*href="\/fests\/"[^>]*>Find a Fest<\/a>/);
  assert.match(nav[0], /<a[^>]*href="\/host\/"[^>]*>Learn about Hosting<\/a>/);

  const order = ['>Home<', '>Find a Fest<', '>Learn about Hosting<'].map(
    (label) => nav[0].indexOf(label),
  );
  assert.deepEqual(
    order,
    [...order].sort((a, b) => a - b),
    'Find a Fest belongs between Home and Learn about Hosting',
  );

  assert.ok(
    !(await missing('fests/index.html')),
    'the /fests route must stay exported now that the nav advertises it',
  );
});

/* Both files carry the route now. Worth pinning in the same test that
   pins the still-open pages: a filter regression that dropped everything
   and one that dropped only /fests look identical from either side
   alone. */
test('the sitemap and llms files carry the open route', async () => {
  const sitemap = await readOutput('sitemap.xml');
  assert.match(sitemap, /\/fests\//);
  assert.match(sitemap, /\/host\//);

  const llms = await readOutput('llms.txt');
  assert.match(llms, /\.\/fests\//);
  assert.match(llms, /Find a Fest/);
  assert.match(llms, /\.\/host\//);

  const llmsFull = await readOutput('llms-full.txt');
  assert.match(llmsFull, /## Find a Fest/);
});

/* The page's LLM aside and its two plain-text echoes. A crawler that finds
   the directory should be told, in every form it might read, that the
   Fests are live data behind a public endpoint — scraping the cards gets a
   snapshot of whatever was approved at build time. Pinned as the absolute
   live URL: a relative path here would be an address a crawler on another
   origin cannot resolve, which is the one way this note can be useless. */
test('the Fests directory points machines at the public events endpoint', async () => {
  const html = await readOutput('fests/index.html');
  const endpoint = 'https://hacktoberfest-api.mlh.com/api/events';

  assert.match(
    html,
    new RegExp(`<a[^>]*href="${endpoint}"[^>]*>[^<]*API</a>`),
    'the /fests LLM note should link to the events endpoint',
  );
  // Off-site, so it opens in its own tab and leaks no referrer chain.
  assert.match(
    html,
    new RegExp(`<a[^>]*href="${endpoint}"[^>]*target="_blank"`),
  );

  const [llms, llmsFull] = await Promise.all([
    readOutput('llms.txt'),
    readOutput('llms-full.txt'),
  ]);
  assert.ok(llms.includes(endpoint), 'llms.txt misses the events endpoint');
  assert.ok(
    llmsFull.includes(endpoint),
    'llms-full.txt misses the events endpoint',
  );
});

/* The fixtures are the directory's stand-in data until the API has real
   Fests to serve. */
test('every mock fest has an id, a name, and plausible coordinates', () => {
  FESTS_FIXTURES.forEach((fest) => {
    assert.ok(fest.id, `missing id: ${JSON.stringify(fest)}`);
    assert.ok(fest.name.length > 0, `missing name: ${fest.id}`);

    /* Null is a real and expected value — no live event is geocoded — so a
       Fest without coordinates is skipped rather than failed. Checked for
       null explicitly because `null >= -90` is true: the range assertions
       below would have passed an un-geocoded Fest without looking at it. */
    if (fest.lat === null && fest.lng === null) return;

    assert.equal(typeof fest.lat, 'number', `lat is not a number: ${fest.id}`);
    assert.equal(typeof fest.lng, 'number', `lng is not a number: ${fest.id}`);
    assert.ok(
      fest.lat >= -90 && fest.lat <= 90,
      `lat out of range: ${fest.id}`,
    );
    assert.ok(
      fest.lng >= -180 && fest.lng <= 180,
      `lng out of range: ${fest.id}`,
    );
  });
});

/* The fixtures bypass festFromEvent, so nothing splits their names for
   them — the two halves are stored already apart. A raw API name pasted in
   here would carry its partner into the heading and show no host line at
   all, and would look perfectly plausible in the file. */
test('no fixture name still carries an unsplit partner', () => {
  FESTS_FIXTURES.forEach((fest) => {
    assert.deepEqual(
      splitFestName(fest.name),
      { title: fest.name, hostedBy: null },
      `${fest.name} still has a partner welded to it`,
    );
  });
});

/* Production's only case. Without one of these the modal's no-map path and
   the map view's silent drop of un-geocoded Fests are both unreachable in
   the mocked build. */
test('at least one fixture has no coordinates', () => {
  assert.ok(
    FESTS_FIXTURES.some((fest) => fest.lat === null && fest.lng === null),
  );
});

/* The fixtures carry `format` as a field because getFestsDirectory returns
   them verbatim, without passing them through festFromEvent — so the mock
   path has no derivation step to lean on. That makes the field
   hand-maintained, and a hand-maintained copy of something derivable drifts
   the first time a fixture is renamed. This is the guard against that. */
test("every fixture's format agrees with its own name", () => {
  FESTS_FIXTURES.forEach((fest) => {
    assert.equal(
      fest.format,
      festFormatFromName(fest.name),
      `${fest.name} carries a format its name does not support`,
    );
  });
});

/* The fixtures exist to reach every state the modal can be in. A set where
   everything is filled in would let a missing-field crash ship. */
test('the fixtures cover the gaps the live payload actually has', () => {
  const has = (key) => FESTS_FIXTURES.filter((fest) => fest[key]).length;

  assert.ok(has('logoUrl') > 0 && has('logoUrl') < FESTS_FIXTURES.length);
  assert.ok(
    has('addressLine1') > 0 && has('addressLine1') < FESTS_FIXTURES.length,
  );
  assert.ok(FESTS_FIXTURES.some((fest) => fest.format === null));
  assert.ok(FESTS_FIXTURES.some((fest) => fest.format === 'hackDay'));
  assert.ok(FESTS_FIXTURES.some((fest) => fest.format === 'meetUp'));
});
