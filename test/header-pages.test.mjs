import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { todayStrip } from '../src/data/content.mjs';
import { NAV, navGroups } from '../src/data/nav.mjs';
import { TODAY_STRIP } from '../src/data/todayStrip.mjs';
import { SITE_PAGES } from '../src/build/sitemap.mjs';
import { TODAY_STRIP_OFF_ATTRIBUTE } from '../src/lib/todayStrip.mjs';

const readOutput = (route) =>
  readFile(new URL(`../out${route}index.html`, import.meta.url), 'utf8');

/* The header is the one component on every page, so a wiring mistake in it
   is a mistake on every page. These read the exported HTML: the header is
   server-rendered, and its dropdown panels must be in that HTML — hidden by
   attribute, never conditionally rendered — because this site ships no
   styled-components CSS for client-only content. */
for (const route of SITE_PAGES) {
  test(`${route} renders every dropdown button, closed, with its panel`, async () => {
    const html = await readOutput(route);
    const nav = html.match(
      /<nav[^>]*aria-label="Main navigation"[\s\S]*?<\/nav>/,
    );
    assert.ok(nav, `${route}: the main navigation is missing`);
    for (const group of navGroups(NAV)) {
      const button = new RegExp(
        `<button[^>]*aria-expanded="false"[^>]*>\\s*${group.label}`,
      );
      assert.match(
        nav[0],
        button,
        `${route}: no closed button for ${group.label}`,
      );
      for (const item of group.items) {
        assert.ok(
          nav[0].includes(`href="${item.href}"`),
          `${route}: ${group.label} panel is missing ${item.label} (${item.href})`,
        );
      }
    }
  });
}

/* The Today strip rides in on the header, so it is on every page the header
   is. It has to be in the exported HTML, not added after load: its CSS is a
   module's, which ships only for what the server rendered, and a band that
   arrived a frame late would push the page down. Server-rendered, it holds
   the sticker book, the one item that needs no data, and no date, which is
   the reader's to fill in. */
for (const route of SITE_PAGES) {
  test(`${route} renders the Today strip under the main navigation`, async (t) => {
    if (!TODAY_STRIP) {
      t.skip('TODAY_STRIP is off, so no page carries the strip');
      return;
    }

    const html = await readOutput(route);
    const nav = html.match(
      /<nav[^>]*aria-label="Main navigation"[\s\S]*?<\/nav>/,
    );
    assert.ok(nav, `${route}: the main navigation is missing`);

    /* The element, not the string: the pre-paint script in the head
       names data-today-strip-off, which a bare search would find first. */
    const strip = html.match(
      /<section[^>]*data-today-strip=""[^>]*>[\s\S]*?<\/section>/,
    );
    assert.ok(strip, `${route}: the Today strip is missing`);
    assert.ok(
      strip.index > nav.index + nav[0].length,
      `${route}: the Today strip should come after the main navigation`,
    );
    assert.match(
      strip[0],
      new RegExp(`^<section[^>]*aria-label="${todayStrip.label}"`),
      `${route}: the strip is not labelled as a region`,
    );
    assert.match(
      strip[0],
      /href="\/my\/"/,
      `${route}: the strip should server-render the sticker book`,
    );
    assert.ok(
      strip[0].includes(todayStrip.stickerBook.cta),
      `${route}: the strip should server-render the sticker book`,
    );
    assert.ok(
      html.includes(TODAY_STRIP_OFF_ATTRIBUTE),
      `${route}: no pre-paint script to hide the strip outside October`,
    );
  });
}

test('the chip reads for October and lands on the hub', async () => {
  const html = await readOutput('/');
  assert.ok(
    html.includes('My Hacktoberfest'),
    'the chip should say My Hacktoberfest',
  );
  assert.ok(
    !html.includes('>Apply to Host<'),
    'the Preptember chip label is still shipping',
  );
  assert.match(html, /href="\/my\/"[^>]*>\s*My Hacktoberfest/);
});

test('the label is a button, not a link', async () => {
  const html = await readOutput('/');
  /* Scoped to the nav: the homepage hero's primary button also reads
     "Attend online", and that one is a link to /schedule/ on purpose. */
  const nav = html.match(
    /<nav[^>]*aria-label="Main navigation"[\s\S]*?<\/nav>/,
  );
  assert.ok(nav, 'the main navigation is missing');
  assert.doesNotMatch(nav[0], /<a[^>]*>\s*Attend online\s*</);
  assert.doesNotMatch(nav[0], /<a[^>]*>\s*Attend in-person\s*</);
});
