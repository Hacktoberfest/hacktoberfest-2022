import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { my } from '../src/data/content.mjs';
import { OFFERS } from '../src/data/fixtures.mjs';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');

test('the promos page is exported and marked noindex', async () => {
  const html = await readOutput('my/promos/index.html');

  assert.match(html, /<meta name="robots" content="noindex"/);
});

/* Same stance as /my/fest/: a static host serves this file to anyone who
   asks, so it is the loading surface and nothing else. The page's own fetch
   is what puts a sponsor on screen. */
test('the exported page carries no offers of its own', async () => {
  const html = await readOutput('my/promos/index.html');

  for (const offer of OFFERS) {
    assert.ok(!html.includes(offer.company.name), offer.company.name);
    if (offer.promo && offer.promo.label) {
      assert.ok(!html.includes(offer.promo.label), offer.promo.label);
    }
  }
  assert.ok(!html.includes(my.promos.claimCta), 'no claim button in the HTML');
  assert.ok(
    html.includes(my.loading),
    'the HTML should be the loading surface',
  );
});

test('the empty and failure copy ships with the page', async () => {
  /* Rendered client-side, so the words have to be in the page's own
     JavaScript. */
  const html = await readOutput('my/promos/index.html');
  const scripts = [
    ...html.matchAll(/src="\/?(_next\/static\/[^"]+\.js)"/g),
  ].map((match) => match[1]);

  assert.ok(scripts.length > 0, 'the page links no scripts');

  const source = (
    await Promise.all(scripts.map((src) => readOutput(src)))
  ).join('\n');

  assert.ok(source.includes(my.promos.empty.body), 'empty state missing');
  assert.ok(source.includes(my.promos.claimFailed), 'claim failure missing');
  assert.ok(
    source.includes(my.promos.claimUnavailable),
    'stale offer line missing',
  );
  assert.ok(
    source.includes(my.promos.requirements.verified_phone.needs),
    'requirement line missing',
  );
  assert.ok(source.includes(my.promos.error.title), 'error surface missing');
});

/* The copy being in the bundle proves nothing on its own: content.mjs's
   `my` ships whole. This is what puts it on screen. */
test('the error surface uses the promos copy', async () => {
  const source = await readFile(
    new URL('../src/pages/my/promos.js', import.meta.url),
    'utf8',
  );

  assert.ok(
    source.includes('<MyError onRetry={retry} copy={my.promos.error} />'),
    'the promos page must pass its own error copy',
  );
});

/* M's list: one row per code, from the codes alone, so a challenge-only
   sponsor never gets a row. content.mjs's `my` ships whole, so wording in
   the bundle proves nothing; these pin what puts it on screen. */
test('the page lists only sponsors with a code', async () => {
  const source = await readFile(
    new URL('../src/components/SponsorOffers/index.js', import.meta.url),
    'utf8',
  );

  assert.ok(source.includes('const codes = offersWithCodes(offers);'));
  assert.ok(
    source.includes('<CodeRow key={offer.company.id} offer={offer} />'),
    'each code must render as its own row',
  );
});

/* The site's own interior hero, as /my/fest/ uses. Its eyebrow is a plain
   label: the way back is the link under the list. */
test('the hero is the site hero, with no link of its own', async () => {
  const source = await readFile(
    new URL('../src/components/SponsorOffers/Hero.js', import.meta.url),
    'utf8',
  );

  assert.ok(source.includes('<PageHero'), 'the hero must be PageHero');
  assert.ok(!source.includes('href='), 'the hero links nowhere');
});

test('the list ends with the way back to My Hacktoberfest', async () => {
  const source = await readFile(
    new URL('../src/components/SponsorOffers/index.js', import.meta.url),
    'utf8',
  );

  assert.ok(source.includes('href={copy.backHref}'));
});

test('a list of codes ends by saying more are on the way', async () => {
  const source = await readFile(
    new URL('../src/components/SponsorOffers/index.js', import.meta.url),
    'utf8',
  );

  assert.ok(source.includes('{copy.more.title}'));
  assert.ok(source.includes('{copy.more.body}'));
});

/* MLH's only sponsor logo is sponsor_activation.logo_url, a wide wordmark
   (DigitalOcean's is 416x72, probed 2026-09-29) or nothing, and a code
   card only has room for a square mark. So the cards carry no logo, and
   no monogram standing in for one. */
test('a code card shows no sponsor logo', async () => {
  const source = await readFile(
    new URL('../src/components/SponsorOffers/index.js', import.meta.url),
    'utf8',
  );

  assert.ok(!source.includes('logoUrl'), 'the card reads no logo');
  assert.ok(!source.includes('<img'), 'the card draws no image');
});

/* The offer's own title names the sponsor ("DigitalOcean $25 Credit for
   Hacktoberfest"), so a card has no separate sponsor label, and its button
   sits on the title's line. */
test('a code card leads with its title, no sponsor label above it', async () => {
  const source = await readFile(
    new URL('../src/components/SponsorOffers/index.js', import.meta.url),
    'utf8',
  );
  const card = source.slice(source.indexOf('<li className={styles.code}>'));

  assert.ok(!source.includes('styles.sponsor'), 'no sponsor label');
  assert.ok(
    card.trimStart().split('\n')[1].includes('<h3 className={styles.title}>'),
    'the title opens the card',
  );
});

/* A check-in happens at the Fest, so there is nothing to fix about it
   here: an unmet one reads as locked (muted, the site's padlock), not as
   the maroon alert a missing MyMLH step gets. */
test('an unmet check-in reads as locked, not as an alert', async () => {
  const source = await readFile(
    new URL('../src/components/SponsorOffers/index.js', import.meta.url),
    'utf8',
  );

  assert.ok(source.includes("requirement.kind === 'checked_in'"));
  assert.ok(source.includes('<LockIcon />'));
});

/* A locked code (lib/offers.mjs's promoLocked) greys its button out and
   does not claim: MLH would refuse it. aria-disabled, not disabled, so
   keyboard focus can still land on it next to the lines saying why. */
test('a locked code greys out its button and does not claim', async () => {
  const source = await readFile(
    new URL('../src/components/SponsorOffers/index.js', import.meta.url),
    'utf8',
  );

  assert.ok(source.includes('const locked = promoLocked(promo);'));
  assert.ok(source.includes("if (locked || state === 'claiming') return;"));
  assert.ok(source.includes('aria-disabled={claiming || locked}'));
});
