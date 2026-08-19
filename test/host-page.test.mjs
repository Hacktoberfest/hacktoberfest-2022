import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { host } from '../src/data/content.mjs';
import { HOST_GUIDE_URL } from '../src/data/links.js';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('/host builds with its title and hero copy', async () => {
  const html = await readOutput('host/index.html');
  const titlePattern = new RegExp(
    `<title[^>]*>${escapeRegExp(host.title)}</title>`,
  );
  assert.match(html, titlePattern);
  assert.ok(html.includes(host.eyebrow));
  assert.ok(html.includes(host.intro));
});

test('/host shows both Fest formats', async () => {
  const html = await readOutput('host/index.html');
  host.formats.cards.forEach((card) => {
    assert.ok(html.includes(card.tag), `missing format card: ${card.id}`);
    assert.ok(html.includes(card.title), `missing format title: ${card.id}`);
  });
});

test('/host compares the formats inside each card', async () => {
  const html = await readOutput('host/index.html');
  const { comparison } = host.formats;
  comparison.rows.forEach((row) => {
    // Each fact renders twice: once per card, with that card's value.
    [row.hackDay, row.meetUp].forEach((value) => {
      const pattern = new RegExp(
        `<dt>${escapeRegExp(row.label)}</dt><dd>${escapeRegExp(value)}</dd>`,
      );
      assert.match(html, pattern, `missing ${row.id} fact: ${value}`);
    });
  });
  // The standalone comparison table is gone; the cards carry the facts.
  assert.ok(!html.includes('<table'), 'comparison table should be gone');
});

test('/host lists the full support story', async () => {
  const html = await readOutput('host/index.html');
  host.support.items.forEach((item) => {
    assert.ok(html.includes(item.copy), `missing support item: ${item.id}`);
  });
});

test('/host walks the organizer journey in steps', async () => {
  const html = await readOutput('host/index.html');
  host.apply.steps.forEach((step) => {
    assert.ok(html.includes(step.title), `missing step title: ${step.id}`);
    assert.ok(html.includes(step.copy), `missing step copy: ${step.id}`);
  });
});

test('/host links the hosting guide and the apply CTA', async () => {
  const html = await readOutput('host/index.html');
  assert.match(
    html,
    new RegExp(`<a[^>]*href="${escapeRegExp(HOST_GUIDE_URL)}"[^>]*>`),
  );
  /* The apply CTA is an internal link to the signed-in hub now, not an
     outbound link to the MLH application: applying starts from /my, so
     /host hands off rather than jumping straight out. */
  const applyLinks = html.match(
    new RegExp(
      `<a[^>]*href="/my/"[^>]*>${escapeRegExp(host.apply.cta)}</a>`,
      'g',
    ),
  );
  assert.ok(
    applyLinks && applyLinks.length >= 2,
    'the apply CTA should render in both the hero and the apply band',
  );
});

test('the homepage nav links to /host/', async () => {
  const html = await readOutput('index.html');
  assert.match(html, /<a[^>]*href="\/host\/"[^>]*>Learn about Hosting<\/a>/);
});

/* Same convention as the activity links in my-pages.test.mjs: the guide's
   real home is an open question, so the placeholder sits on the reserved
   .invalid TLD. When the real URL lands, this fails and forces a
   deliberate update here and in data/links.js. */
test('the hosting-guide URL is still the reserved-TLD placeholder', () => {
  assert.match(
    HOST_GUIDE_URL,
    /example\.invalid/,
    'HOST_GUIDE_URL looks like a real URL — update this test when it is',
  );
});
