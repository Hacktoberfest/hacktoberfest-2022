import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import { sponsor } from '../src/data/content.mjs';
import { sponsors } from '../src/data/sponsors.mjs';

/* The wall is curated data, not API state, so what protects visitors is
   this file: a malformed entry or a missing logo fails here, at test
   time, never in front of a reader. */

test('every wall sponsor entry is complete and tagged', () => {
  assert.deepEqual(
    sponsors.map((entry) => entry.name),
    [
      'Tiger Data',
      'Snowflake',
      'MongoDB',
      'Gauge',
      'Solana',
      'Render',
      'GitHub',
      'Sentry',
      'Backboard.io',
    ],
    'the curated wall matches the confirmed sponsor roster and order',
  );
  sponsors.forEach((entry) => {
    assert.ok(entry.name, 'sponsor missing a name');
    assert.match(entry.slug, /^[a-z0-9-]+$/, `${entry.name}: bad slug`);
    const url = new URL(entry.url);
    assert.equal(url.protocol, 'https:', `${entry.name}: not https`);
    assert.equal(
      url.searchParams.get('utm_content'),
      `sponsor-logo-${entry.slug}`,
      `${entry.name}: utm_content must name its wall placement`,
    );
    assert.equal(
      entry.logo,
      `/sponsors/${entry.slug}.svg`,
      `${entry.name}: logo path must follow the slug`,
    );
  });
});

test('wall slugs are unique', () => {
  const slugs = sponsors.map((entry) => entry.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('every referenced logo ships in public/', async () => {
  await Promise.all(
    sponsors.map((entry) =>
      access(new URL(`../public${entry.logo}`, import.meta.url)),
    ),
  );
});

test('brand-color logo assets retain their approved treatments', async () => {
  const [mongodb, snowflake, render, sentry] = await Promise.all([
    readFile(
      new URL('../public/sponsors/mongodb.svg', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../public/sponsors/snowflake.svg', import.meta.url),
      'utf8',
    ),
    readFile(new URL('../public/sponsors/render.svg', import.meta.url), 'utf8'),
    readFile(new URL('../public/sponsors/sentry.svg', import.meta.url), 'utf8'),
  ]);
  assert.ok(mongodb.includes('#00684A'), 'MongoDB must use its green mark');
  assert.ok(snowflake.includes('#29B5E8'), 'Snowflake must use its blue mark');
  assert.ok(render.includes('#000000'), 'Render must use its black mark');
  assert.ok(sentry.includes('#181225'), 'Sentry must use its purple mark');
});

test('the sponsor page copy is complete', () => {
  assert.ok(sponsor.title.includes('Hacktoberfest 2026'));
  assert.ok(sponsor.description);
  assert.ok(sponsor.heading.lead && sponsor.heading.accent);
  assert.ok(sponsor.setupCta && sponsor.infoCta);
  assert.ok(sponsor.wall.heading.lead && sponsor.wall.band.cta);
  assert.equal(
    `${sponsor.wall.heading.lead} ${sponsor.wall.heading.accent}`,
    'Meet the teams making Hacktoberfest happen.',
  );
  assert.ok(sponsor.wall.ghost);
  assert.ok(sponsor.stats.intro);
  assert.equal(sponsor.stats.items.length, 3);
  sponsor.stats.items.forEach((item) => {
    assert.ok(item.value && item.unit, `stat ${item.id} missing value/unit`);
  });
  assert.equal(sponsor.partnership.split.length, 2);
  assert.equal(sponsor.partnership.benefits.length, 4);
});

test('new sponsor copy keeps the house voice', () => {
  const strings = JSON.stringify(sponsor);
  assert.ok(!strings.includes('—'), 'no em dashes in new copy');
  assert.ok(!/organizer/i.test(strings), 'say hosts, not organizers');
});
