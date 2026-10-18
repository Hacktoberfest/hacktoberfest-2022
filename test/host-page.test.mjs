import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { host } from '../src/data/content.mjs';
import {
  HACK_DAYS_EMAIL,
  HACK_DAYS_URLS,
  HOST_HANDBOOK_URL,
} from '../src/data/links.js';

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

test('/host carries the photo strip between the formats and the support story', async () => {
  const html = await readOutput('host/index.html');
  host.photoStrip.photos.forEach((photo) => {
    const pattern = new RegExp(
      `<img[^>]*src="${escapeRegExp(photo.src)}"[^>]*alt="${escapeRegExp(photo.alt)}"`,
    );
    assert.match(html, pattern, `missing strip photo: ${photo.id}`);
    /* The reel loops by rendering the strip twice; the loop copy is
       decoration only, so it must carry an empty alt. */
    const copies = html.match(new RegExp(escapeRegExp(photo.src), 'g'));
    assert.equal(copies.length, 2, `${photo.id} should render exactly twice`);
    assert.match(
      html,
      new RegExp(`<img[^>]*src="${escapeRegExp(photo.src)}"[^>]*alt=""`),
      `missing the aria-hidden loop copy of ${photo.id}`,
    );
  });
  // Placement: the strip sits after the formats and before the support.
  const stripIndex = html.indexOf(host.photoStrip.photos[0].src);
  assert.ok(
    html.indexOf(host.formats.cards[0].tag) < stripIndex,
    'the strip should follow the formats',
  );
  assert.ok(
    stripIndex < html.indexOf(host.support.items[0].copy),
    'the strip should precede the support story',
  );
});

test('/host lists the full support story', async () => {
  const html = await readOutput('host/index.html');
  host.support.items.forEach((item) => {
    assert.ok(html.includes(item.copy), `missing support item: ${item.id}`);
  });
  /* The section's own prints, distinct from the strip's roll: each
     appears exactly once and carries its real alt. */
  host.support.photos.forEach((photo) => {
    const copies = html.match(new RegExp(escapeRegExp(photo.src), 'g'));
    assert.equal(copies.length, 1, `${photo.id} should render exactly once`);
    assert.match(
      html,
      new RegExp(
        `<img[^>]*src="${escapeRegExp(photo.src)}"[^>]*alt="${escapeRegExp(photo.alt)}"`,
      ),
      `missing support print: ${photo.id}`,
    );
  });
});

/* React writes an href's ampersands as &amp;, and every tagged link
   carries several query parameters. */
const hrefPattern = (url) => escapeRegExp(url.replace(/&/g, '&amp;'));

/* An outbound link opens in a new tab, the way the handbook link does. */
const outboundLink = (url, label) =>
  new RegExp(
    `<a[^>]*href="${hrefPattern(url)}"[^>]*target="_blank"[^>]*>${escapeRegExp(label)}`,
  );

/* Fest applications are closed (October 2026): the notice is the first
   thing in <main>, ahead of the hero, and sends would-be hosts to MLH
   Hack Days. */
test('/host opens on the closed notice', async () => {
  const html = await readOutput('host/index.html');
  const main = html.slice(html.indexOf('<main'));
  [host.closed.badge, host.closed.lead, host.closed.body].forEach((line) => {
    assert.ok(main.includes(line), `missing notice copy: ${line}`);
  });
  assert.ok(
    main.indexOf(host.closed.lead) < main.indexOf(host.heading.lead),
    'the notice should come before the hero',
  );
  assert.match(html, outboundLink(HACK_DAYS_URLS.hostNotice, host.closed.cta));
});

/* Nothing on the page asks anyone to apply for a Fest any more: no apply
   CTA, no apply band, no link into the closed application. */
test('/host no longer asks anyone to apply for a Fest', async () => {
  const html = await readOutput('host/index.html');
  assert.ok(!html.includes('Apply to host a Fest'), 'apply CTA still there');
  assert.ok(
    !html.includes('Applications are now open'),
    'apply band still there',
  );
  assert.ok(
    !html.includes('organize.mlh.com/host/hacktoberfest-2026'),
    'the closed application is still linked',
  );
});

test('/host’s hero asks for the directory, then MLH Hack Days', async () => {
  const html = await readOutput('host/index.html');
  assert.match(
    html,
    new RegExp(`<a[^>]*href="/fests/"[^>]*>${escapeRegExp(host.heroCta)}</a>`),
  );
  assert.match(
    html,
    outboundLink(HACK_DAYS_URLS.hostHero, host.heroHackDaysCta),
  );
});

test('the Hack Day card ends on MLH Hack Days', async () => {
  const html = await readOutput('host/index.html');
  const { hackDaysNow } = host.formats;
  assert.ok(html.includes(hackDaysNow.lead));
  assert.ok(html.includes(hackDaysNow.body));
  assert.match(html, outboundLink(HACK_DAYS_URLS.hostFormat, hackDaysNow.cta));
  // On the Hack Day card, so after its tag and before the Meet Up's.
  const footIndex = html.indexOf(hackDaysNow.lead);
  assert.ok(html.indexOf(host.formats.cards[0].title) < footIndex);
  assert.ok(footIndex < html.indexOf(host.formats.cards[1].title));
});

/* This month's hosts still land here from the nav: the support card's
   footer sends them to their hub and the handbook. */
test('/host links this month’s hosts to their hub and the handbook', async () => {
  const html = await readOutput('host/index.html');
  const { guide } = host.support;
  assert.ok(html.includes(guide.title));
  assert.ok(html.includes(guide.copy));
  assert.match(
    html,
    new RegExp(
      `<a[^>]*href="/my/hosting/"[^>]*>${escapeRegExp(guide.hubCta)}</a>`,
    ),
  );
  assert.match(html, outboundLink(HOST_HANDBOOK_URL, guide.cta));
});

test('/host closes on what an MLH Hack Day comes with', async () => {
  const html = await readOutput('host/index.html');
  const { hackDays } = host;
  [hackDays.eyebrow, hackDays.body, hackDays.cardTitle, hackDays.note].forEach(
    (line) => assert.ok(html.includes(line), `missing band copy: ${line}`),
  );
  hackDays.perks.forEach((perk) =>
    assert.ok(html.includes(perk), `missing perk: ${perk}`),
  );
  assert.match(html, outboundLink(HACK_DAYS_URLS.hostBand, hackDays.cta));
  assert.match(
    html,
    new RegExp(`<a[^>]*href="mailto:${escapeRegExp(HACK_DAYS_EMAIL)}"`),
  );
});

/* The nav's entry carries its description beside the label, so the
   label is matched anywhere inside the link. */
test('the homepage nav links to /host/', async () => {
  const html = await readOutput('index.html');
  assert.match(html, /<a[^>]*href="\/host\/"[^>]*>(?:(?!<\/a>).)*Host a Fest/);
});

/* The handbook the guide band points at is the same one /my's host
   resources band and the FAQ link. It used to be a reserved-TLD
   placeholder here, which shipped a dead button on a page whose own copy
   promised "all the information you need". Pinning the real URL keeps the
   three surfaces from drifting apart again. */
test('the hosting guide points at the published handbook', () => {
  assert.match(HOST_HANDBOOK_URL, /^https:\/\/mlh\.gitbook\.io\//);
  assert.doesNotMatch(
    HOST_HANDBOOK_URL,
    /example\.invalid/,
    'the handbook link must not regress to a placeholder',
  );
});
