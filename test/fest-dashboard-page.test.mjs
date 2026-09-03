import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { my } from '../src/data/content.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

test('the Fest dashboard is exported and marked noindex', async () => {
  const html = await readOutput('my/fest/index.html');

  assert.match(html, /<meta name="robots" content="noindex"/);
});

/* The whole point of the export being the loading surface: a static host
   serves this file to anyone who asks, so anything personal baked into it
   would be readable without a session. The page's own fetch is what puts a
   Fest on screen, and the API is what decides whether the reader may see it. */
test('the exported page carries no Fest data of its own', async () => {
  const html = await readOutput('my/fest/index.html');

  assert.ok(
    !html.includes(my.dashboard.registrations.label),
    'the exported HTML should not contain the dashboard cards',
  );
  assert.ok(
    !html.includes(my.dashboard.pack.notShipped),
    'the exported HTML should not contain the event pack copy',
  );
  assert.ok(
    html.includes(my.loading),
    'the exported HTML should be the loading surface',
  );
});

test('the refusal surfaces ship with the page', async () => {
  /* They render client-side, so their copy has to be in the page's own
     JavaScript rather than its HTML. Nothing else proves a host who is not a
     host of this Fest sees words rather than a blank page. */
  const html = await readOutput('my/fest/index.html');
  const scripts = [
    ...html.matchAll(/src="\/?(_next\/static\/[^"]+\.js)"/g),
  ].map((match) => match[1]);

  assert.ok(scripts.length > 0, 'the page links no scripts');

  const bundles = await Promise.all(scripts.map((src) => readOutput(src)));
  const source = bundles.join('\n');

  assert.ok(
    source.includes(my.dashboard.forbidden.body),
    'the forbidden surface is missing from the page bundle',
  );
  assert.ok(
    source.includes(my.dashboard.notFound.body),
    'the not-found surface is missing from the page bundle',
  );
});
