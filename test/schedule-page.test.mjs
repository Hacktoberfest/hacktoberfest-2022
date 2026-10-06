import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

import { routeIsClosed } from '../src/data/closedRoutes.mjs';
import { schedule } from '../src/data/content.mjs';
import { SCHEDULE_LOCKED } from '../src/data/scheduleLock.mjs';

/* /schedule is built but closed: the API endpoint it reads does not exist yet,
   and a live page stuck on "we could not load the schedule" is worse than no
   page at all. So this file has to be correct on both sides of that switch,
   because opening the route is deleting one line in data/closedRoutes.mjs and
   nobody should have to remember to rewrite the tests at the same time.

   While closed it asserts the route really is gone — from the export, the
   sitemap and the crawler files alike. Once open it asserts the page. */

const CLOSED = routeIsClosed('/schedule/');

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Next hashes its stylesheet filenames, so they are found rather than named. */
const readStylesheets = async () => {
  const dir = new URL('../out/_next/static/css/', import.meta.url);
  const files = await readdir(dir);

  const sheets = await Promise.all(
    files
      .filter((file) => file.endsWith('.css'))
      .map((file) => readFile(new URL(file, dir), 'utf8')),
  );

  return sheets.join('\n');
};

const missing = async (path) =>
  access(new URL(`../out/${path}`, import.meta.url)).then(
    () => false,
    () => true,
  );

test(
  'the closed route is pruned out of the export',
  { skip: !CLOSED },
  async () => {
    assert.ok(
      await missing('schedule/index.html'),
      '/schedule is closed but its HTML still shipped',
    );
  },
);

test('a closed route is advertised nowhere', { skip: !CLOSED }, async () => {
  const [sitemapXml, llmsIndex, llmsFull] = await Promise.all([
    readOutput('sitemap.xml'),
    readOutput('llms.txt'),
    readOutput('llms-full.txt'),
  ]);

  assert.ok(!sitemapXml.includes('/schedule/'), 'sitemap advertises a 404');
  assert.ok(!llmsIndex.includes('./schedule/'), 'llms.txt advertises a 404');
  assert.ok(
    !llmsFull.includes(schedule.heading.accent),
    'llms-full.txt carries copy for a page that does not exist',
  );
});

test(
  'the page builds with its copy and canonical URL',
  { skip: CLOSED },
  async () => {
    const html = await readOutput('schedule/index.html');

    assert.match(
      html,
      new RegExp(`<title[^>]*>${escapeRegExp(schedule.title)}</title>`),
    );
    assert.ok(html.includes(schedule.eyebrow));
    assert.ok(html.includes(schedule.heading.accent));
    assert.match(html, /rel="canonical" href="[^"]*\/schedule\/"/);
  },
);

/* The directory renders after a client-side fetch, so the export carries its
   loading state rather than any event. What must be in the HTML is everything
   that does not depend on the fetch: the hero, and the callout sending
   somebody who wants an in-person event to the Fests directory. */
test('the export carries the callout to /fests', { skip: CLOSED }, async () => {
  const html = await readOutput('schedule/index.html');

  assert.ok(html.includes(schedule.festsCallout.title));
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="/fests/"[^>]*>${escapeRegExp(schedule.festsCallout.cta)}</a>`,
    ),
  );
});

/* The export is the loading state, so this is where the loader's variant
   shows. Under the hero it must be the inline stand-in: the whole-page
   variant's full-bleed forest and viewport-tall column, dropped into the
   state's centred flex column, shrink to the width of the four squares and
   ship as a thin green slab in the middle of the page (live on 2026-10-06). */
test(
  'the loading state is the inline loader, not the whole-page one',
  { skip: CLOSED || SCHEDULE_LOCKED },
  async () => {
    const html = await readOutput('schedule/index.html');

    assert.match(
      html,
      /class="Loader_loading__[^"]*Loader_inline__/,
      'the schedule renders the whole-page loader mid-page',
    );
    assert.match(
      html,
      new RegExp(`aria-live="polite">${schedule.loading.replace('…', '')}`),
      'the loader carries no label for screen readers',
    );
  },
);

/* The rows themselves are not in the export — the directory renders after a
   client-side fetch, so the HTML is the loading state and carries no events at
   all. What IS in the export is the stylesheet, and that is where the invariant
   lives: every shadow on this page must resolve through var(--accent), which is
   set per row from its event type.

   Hardcoding a colour there would not throw and would not look wrong in a diff.
   Every row would simply cast the same shadow and the page would flatten into
   one colour, which is the whole design gone without a single failing test. */
test(
  'the schedule shadows resolve through the accent',
  { skip: CLOSED },
  async () => {
    const css = await readStylesheets();

    const shadows = css.match(/box-shadow:[^;}]+/g) || [];
    const scheduleShadows = shadows.filter((rule) => rule.includes('--accent'));

    assert.ok(
      scheduleShadows.length >= 4,
      `only ${scheduleShadows.length} accent-driven shadows; the press has four states`,
    );
    /* The resting offsets the design specifies: 6px for a row, 8px for the
     feature and the modal, 3px and 1px for the two pressed states. */
    ['6px 6px 0 var(--accent)', '3px 3px 0 var(--accent)'].forEach((rule) => {
      assert.ok(
        css.includes(`box-shadow:${rule}`),
        `missing the shadow for "${rule}" — the press is incomplete`,
      );
    });
  },
);

test('an open route is advertised everywhere', { skip: CLOSED }, async () => {
  const [sitemapXml, llmsIndex] = await Promise.all([
    readOutput('sitemap.xml'),
    readOutput('llms.txt'),
  ]);

  assert.ok(sitemapXml.includes('/schedule/'), 'sitemap misses /schedule/');
  assert.ok(llmsIndex.includes('./schedule/'), 'llms.txt misses /schedule/');
});

/* The schedule lock (data/scheduleLock.mjs), which is not the closed
   route above: the page stays open and linked, and only the calendar waits.
   While it is on, the export carries the Coming soon panel, since nothing
   about it waits on a fetch. */
test(
  'while locked, the export carries the Coming soon panel',
  { skip: CLOSED || !SCHEDULE_LOCKED },
  async () => {
    const html = await readOutput('schedule/index.html');

    assert.ok(
      html.includes(schedule.locked.title),
      'the panel title is missing',
    );
    assert.ok(html.includes(schedule.locked.badge), 'the badge is missing');
    assert.ok(html.includes(schedule.sectionHeading.accent));
  },
);

test('the page gates the calendar on the lock', async () => {
  const source = await readFile(
    new URL('../src/pages/schedule.js', import.meta.url),
    'utf8',
  );

  assert.ok(
    source.includes(
      '{SCHEDULE_LOCKED ? <ScheduleComingSoon /> : <ScheduleDirectory />}',
    ),
    'the lock must gate the calendar, or flipping it changes nothing',
  );
});

/* True whichever side of the switch we are on: the page's source always
   exists, so closing the route is never done by deleting the page. */
test('the page source is in the repo either way', async () => {
  await access(new URL('../src/pages/schedule.js', import.meta.url));
});
