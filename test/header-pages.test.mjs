import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { NAV, navGroups } from '../src/data/nav.mjs';
import { SITE_PAGES } from '../src/build/sitemap.mjs';

const readOutput = (route) =>
  readFile(new URL(`../out${route}index.html`, import.meta.url), 'utf8');

/* The header is the one component on every page, so a wiring mistake in it
   is a mistake on every page. These read the exported HTML: the header is
   server-rendered, and its dropdown panels must be in that HTML — hidden by
   attribute, never conditionally rendered — because this site ships no
   styled-components CSS for client-only content. */
for (const route of SITE_PAGES) {
  test(`${route} renders both dropdown buttons, closed, with their panels`, async () => {
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
