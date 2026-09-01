import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

import { banner } from '../src/data/content.mjs';
import { PREPTEMBER } from '../src/data/preptember.mjs';
import { BANNER_STORAGE_KEY } from '../src/lib/banner.mjs';

const OUT = new URL('../out/', import.meta.url);

/* Every exported document, found rather than listed: "on all pages" is
   the requirement, and a hand-kept list of pages is exactly the thing
   that goes stale the first time somebody adds one. */
const pages = async (dir = OUT, prefix = '') => {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      found.push(
        ...(await pages(
          new URL(`${entry.name}/`, dir),
          `${prefix}${entry.name}/`,
        )),
      );
    } else if (entry.name.endsWith('.html')) {
      found.push(`${prefix}${entry.name}`);
    }
  }

  return found;
};

const html = (path) => readFile(new URL(path, OUT), 'utf8');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// React writes the curly apostrophe through, but escapes the quotes and
// ampersands around it.
const decode = (markup) =>
  markup
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');

test('the banner is on every exported page', async (t) => {
  const paths = await pages();
  assert.ok(paths.length > 5, `found only ${paths.length} pages`);

  if (!PREPTEMBER) {
    t.skip('PREPTEMBER is off, so no page carries the banner');
    return;
  }

  for (const path of paths) {
    const markup = decode(await html(path));
    assert.ok(markup.includes(banner.message), `no banner message: ${path}`);
    // The message opens the anchor; the decorative arrow follows it, so
    // the closing tag is deliberately not part of the pattern.
    assert.match(
      markup,
      new RegExp(`<a[^>]+href="/host/"[^>]*>${escapeRegExp(banner.message)}`),
      `banner message does not link to /host/: ${path}`,
    );
    assert.ok(
      markup.includes(`aria-label="${banner.close}"`),
      `no close control: ${path}`,
    );
  }
});

/* The banner ships visible in the HTML, so the only thing standing
   between a reader who closed it and seeing it again on the next page is
   this script running before the first paint. */
test('every page can hide a closed banner before it paints', async () => {
  for (const path of await pages()) {
    const markup = await html(path);
    assert.ok(
      markup.includes(BANNER_STORAGE_KEY),
      `no pre-paint dismissal script: ${path}`,
    );
  }
});
