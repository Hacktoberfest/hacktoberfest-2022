import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { activitiesPage, homeSteps } from '../src/data/content.mjs';
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

/* How it works is the homepage's band: its heading, every step and its
   button, the same on both pages, but without the phase labels here. */
test('/activities carries the homepage’s how-it-works band', async () => {
  const html = await readOutput('activities/index.html');
  assert.ok(html.includes('id="home-steps-title"'));
  assert.ok(html.includes(homeSteps.heading.lead));
  homeSteps.phases.forEach((phase) => {
    assert.ok(!html.includes(`>${phase.label}</p>`), phase.label);
    phase.steps.forEach((step) => {
      assert.ok(html.includes(step.title), step.title);
      step.stickers.forEach((slug) =>
        assert.ok(html.includes(`/stickers/${slug}.svg`), slug),
      );
    });
  });
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="${escapeRegExp(homeSteps.cta.href)}"[^>]*>${escapeRegExp(homeSteps.cta.label)}</a>`,
    ),
  );
});

test('/activities ends with the book callout, pointing at /my', async () => {
  const html = await readOutput('activities/index.html');
  const { bookCallout } = activitiesPage;
  assert.ok(html.includes(bookCallout.title));
  assert.ok(html.includes(bookCallout.body));
  assert.match(
    html,
    new RegExp(`<a[^>]*href="/my/"[^>]*>${escapeRegExp(bookCallout.cta)}</a>`),
  );
  bookCallout.stickers.forEach((slug) =>
    assert.ok(html.includes(`/stickers/${slug}.svg`), slug),
  );
});

test('the export carries no progress: the rows render after the seam answers', async () => {
  const html = await readOutput('activities/index.html');
  for (const activity of ACTIVITIES) {
    assert.ok(
      !html.includes(activity.label),
      `${activity.label} is in the static export`,
    );
  }
  assert.ok(
    !html.includes(activitiesPage.list.unknown),
    'the rows-band error notice is in the static export',
  );
  assert.ok(
    !html.includes(activitiesPage.list.filters.todo),
    'the Still to do chip label is in the static export',
  );
  assert.ok(
    !html.includes(activitiesPage.list.filters.empty),
    'the empty-filter note is in the static export',
  );
  assert.ok(
    !html.includes('stickers earned'),
    'the progress strip is on the page',
  );
  assert.ok(
    !html.includes(
      activitiesPage.list.filters.chip(
        activitiesPage.list.filters.all,
        ACTIVITIES.length,
      ),
    ),
    'the All chip is in the static export',
  );
});

test('the sitemap and llms.txt list it', async () => {
  const sitemap = await readOutput('sitemap.xml');
  assert.ok(sitemap.includes('/activities/'));
  const llms = await readOutput('llms.txt');
  assert.ok(llms.includes('./activities/'));
});
