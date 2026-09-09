import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { activitiesPage } from '../src/data/content.mjs';
import { ACTIVITIES } from '../src/data/eligibility.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('/activities builds, indexed, with its hero', async () => {
  const html = await readOutput('activities/index.html');
  assert.match(
    html,
    new RegExp(`<title[^>]*>${escapeRegExp(activitiesPage.title)}</title>`),
  );
  assert.match(html, /name="robots" content="index, follow"/);
  assert.ok(html.includes(activitiesPage.eyebrow));
  assert.ok(html.includes(activitiesPage.intro));
});

test('the export carries no progress: the rows render after the seam answers', async () => {
  const html = await readOutput('activities/index.html');
  for (const activity of ACTIVITIES) {
    assert.ok(
      !html.includes(activity.label),
      `${activity.label} is in the static export`,
    );
  }
  assert.ok(!html.includes(activitiesPage.list.done));
});

test('the sitemap and llms.txt list it', async () => {
  const sitemap = await readOutput('sitemap.xml');
  assert.ok(sitemap.includes('/activities/'));
  const llms = await readOutput('llms.txt');
  assert.ok(llms.includes('./activities/'));
});
