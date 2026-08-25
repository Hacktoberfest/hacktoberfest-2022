import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { sponsor } from '../src/data/content.mjs';
import {
  SPONSOR_PARTNER_DEV_URL,
  SPONSOR_PARTNER_DIGITALOCEAN_URL,
  SPONSOR_PARTNER_MLH_URL,
  SPONSOR_SETUP_HERO_URL,
  SPONSOR_SETUP_PARTNERSHIP_URL,
  SPONSOR_SETUP_WALL_URL,
} from '../src/data/links.js';
import { sponsors } from '../src/data/sponsors.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// href values are HTML-escaped in the build output.
const escapeHref = (url) => escapeRegExp(url.replace(/&/g, '&amp;'));

test('/sponsor builds with its title, hero copy, and canonical URL', async () => {
  const html = await readOutput('sponsor/index.html');
  const titlePattern = new RegExp(
    `<title[^>]*>${escapeRegExp(sponsor.title)}</title>`,
  );
  assert.match(html, titlePattern);
  assert.ok(html.includes(sponsor.eyebrow));
  assert.match(html, /rel="canonical" href="[^"]*\/sponsor\/"/);
});

test('/sponsor renders every wall sponsor as a tagged outbound link', async () => {
  const html = await readOutput('sponsor/index.html');
  sponsors.forEach((entry) => {
    assert.match(
      html,
      new RegExp(`<a[^>]*href="${escapeHref(entry.url)}"[^>]*>`),
      `missing wall link: ${entry.slug}`,
    );
    assert.ok(html.includes(entry.logo), `missing wall logo: ${entry.slug}`);
  });
});

test('/sponsor renders the partner marks as tagged tiles in the wall', async () => {
  const html = await readOutput('sponsor/index.html');
  [
    SPONSOR_PARTNER_MLH_URL,
    SPONSOR_PARTNER_DEV_URL,
    SPONSOR_PARTNER_DIGITALOCEAN_URL,
  ].forEach((url) => {
    assert.match(
      html,
      new RegExp(`<a[^>]*href="${escapeHref(url)}"[^>]*>`),
      `missing partner tile: ${url}`,
    );
  });
});

test('/sponsor carries the campaign stats and partnership benefits', async () => {
  const html = await readOutput('sponsor/index.html');
  sponsor.stats.items.forEach((item) => {
    assert.ok(html.includes(item.value), `missing stat value: ${item.id}`);
    assert.ok(html.includes(item.unit), `missing stat unit: ${item.id}`);
  });
  sponsor.partnership.benefits.forEach((benefit) => {
    assert.ok(html.includes(benefit.copy), `missing benefit: ${benefit.id}`);
  });
});

test('/sponsor links sponsor setup from the hero, the wall, and the partnership band', async () => {
  const html = await readOutput('sponsor/index.html');
  [
    SPONSOR_SETUP_HERO_URL,
    SPONSOR_SETUP_WALL_URL,
    SPONSOR_SETUP_PARTNERSHIP_URL,
  ].forEach((url) => {
    assert.match(
      html,
      new RegExp(`<a[^>]*href="${escapeHref(url)}"[^>]*>`),
      `missing setup link: ${url}`,
    );
  });
});

test('/sponsor asks for partnership info through the popup, never an outbound form link', async () => {
  const html = await readOutput('sponsor/index.html');
  const infoButtons = html.match(
    new RegExp(`<button[^>]*>${escapeRegExp(sponsor.infoCta)}</button>`, 'g'),
  );
  assert.ok(
    infoButtons && infoButtons.length >= 2,
    'the info CTA renders as a button in the hero and the partnership band',
  );
  assert.doesNotMatch(
    html,
    /<a\b[^>]*\shref=["'][^"']*typeform\.(?:com|eu)\/to\//i,
  );
});

test('the build artifacts know about /sponsor', async () => {
  const [sitemapXml, llmsIndex, llmsFull] = await Promise.all([
    readOutput('sitemap.xml'),
    readOutput('llms.txt'),
    readOutput('llms-full.txt'),
  ]);
  assert.ok(sitemapXml.includes('/sponsor/'), 'sitemap misses /sponsor/');
  assert.ok(llmsIndex.includes('./sponsor/'), 'llms.txt misses /sponsor/');
  sponsor.stats.items.forEach((item) => {
    assert.ok(
      llmsFull.includes(`${item.value} ${item.unit}`),
      `llms-full.txt misses stat: ${item.id}`,
    );
  });
  sponsors.forEach((entry) => {
    assert.ok(
      llmsFull.includes(entry.name),
      `llms-full.txt misses sponsor: ${entry.name}`,
    );
  });
});
