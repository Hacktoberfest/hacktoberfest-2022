import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { CATALOGUE, THINGS } from '../scripts/stickers/design/catalogue.mjs';
import { ACTIVITIES, REQUIRED_STICKERS } from '../src/data/eligibility.mjs';
import {
  REWARD_STICKERS,
  STICKER_IMAGE_SLUGS,
  stickerImageSrc,
} from '../src/lib/stickerImage.mjs';

test('the reward list carries the milestones and the things that are not stickers', () => {
  assert.deepEqual(
    REWARD_STICKERS.map((r) => r.id),
    [
      'milestone-pack',
      'milestone-complete',
      'milestone-completionist',
      'reward-pack',
      'reward-physical',
      'reward-digital',
      'fest-certificate-2026',
      'fest-host-certificate-2026',
      'completionist-certificate-2026',
      'fest-mentor-certificate-2026',
      'fest-judge-certificate-2026',
    ],
  );
});

test('the slug list is the catalogue, the required pair, and the rewards', () => {
  assert.deepEqual(STICKER_IMAGE_SLUGS, [
    ...ACTIVITIES.map((a) => a.id),
    ...REQUIRED_STICKERS.map((s) => s.id),
    ...REWARD_STICKERS.map((r) => r.id),
  ]);
  assert.equal(stickerImageSrc('fest'), '/stickers/fest.svg');
  assert.throws(() => stickerImageSrc(null));
});

/* Hexagons are for stickers: the full pointy-top hexagon the render
   script draws, the shape the CSS modules on /my clip to. The inventory's
   other things wear shapes of their own, so their files must not be it,
   and no file may still be the circle the stickers used to be. */
test('only the stickers are drawn as hexagons', async () => {
  const read = (slug) =>
    readFile(
      new URL(`../public/stickers/${slug}.svg`, import.meta.url),
      'utf8',
    );
  const hexagon =
    /<path d="M100 0 L186.6 50 L186.6 150 L100 200 L13.4 150 L13.4 50 Z"/;
  const circle = /<circle cx="100" cy="100" r="100"/;
  assert.match(await read('milestone-complete'), hexagon);
  assert.match(await read('fest'), hexagon);
  for (const slug of REWARD_STICKERS.filter((r) => r.shape).map((r) => r.id)) {
    assert.doesNotMatch(
      await read(slug),
      hexagon,
      `${slug} is a sticker's hexagon`,
    );
  }
  for (const slug of STICKER_IMAGE_SLUGS) {
    assert.doesNotMatch(await read(slug), circle, `${slug} is a circle`);
  }
});

test('every slug has a committed SVG file that is a standalone sticker', async () => {
  for (const slug of STICKER_IMAGE_SLUGS) {
    const svg = await readFile(
      new URL(`../public/stickers/${slug}.svg`, import.meta.url),
      'utf8',
    );
    /* A designer's export may open with a prolog or a comment; the root
       that follows must still be a 200-unit square that names its
       namespace, since it is inlined into the share card as it stands. */
    const root = svg.replace(
      /^\s*(<\?xml[^>]*\?>|<!DOCTYPE[^>]*>|<!--[\s\S]*?-->)\s*/gi,
      '',
    );
    assert.match(
      root,
      /^<svg[^>]*\bxmlns="http:\/\/www\.w3\.org\/2000\/svg"/,
      slug,
    );
    assert.match(root, /^<svg[^>]*\bviewBox="0 0 200 200"/, slug);
    assert.match(svg, /<\/svg>\s*$/, slug);
    assert.doesNotMatch(
      svg,
      /href=/,
      `${slug} must not reference anything outside itself`,
    );
  }
});

/* DEV's three badges (lib/inventory.mjs ITEM_ART) are DEV's own art,
   redrawn by hand into the site's square: the 173.2 by 200 badge at 0.8,
   138.56 by 160, centred, so it keeps 20 units clear above and below and
   never reaches the name under its cell even while it leans. No sticker
   script lists them, so none can draw over them: scripts/stickers/render.mjs
   draws only STICKER_IMAGE_SLUGS (with --force, every one of those with no
   design), scripts/stickers/design/build.mjs --site writes only CATALOGUE
   and THINGS, and neither deletes a file. They are held here to the rules
   every listed file is held to above. */
const DEV_BADGES = [
  'dev-badge-fest-2026',
  'dev-badge-host-2026',
  'dev-badge-completionist-2026',
];

test('the DEV badges are drawn by hand, so no sticker script lists them', () => {
  const designed = new Set(
    [...CATALOGUE, ...THINGS].map((entry) => entry.slug),
  );
  for (const slug of DEV_BADGES) {
    assert.ok(!STICKER_IMAGE_SLUGS.includes(slug), `${slug} is rendered`);
    assert.ok(!designed.has(slug), `${slug} is designed`);
  }
});

test('the DEV badges are standalone files in the 200 square, the badge scaled inside it', async () => {
  for (const slug of DEV_BADGES) {
    const svg = await readFile(
      new URL(`../public/stickers/${slug}.svg`, import.meta.url),
      'utf8',
    );
    assert.ok(
      svg.startsWith(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">\n<g transform="translate(30.72 20) scale(0.8)">\n',
      ),
      `${slug} is not framed`,
    );
    assert.match(svg, /<\/g>\n<\/svg>\n$/, slug);
    assert.doesNotMatch(svg, /href=/, slug);
    assert.doesNotMatch(
      svg,
      /viewBox="0 0 174 200"/,
      `${slug} kept DEV's root`,
    );
    assert.match(
      svg,
      /<path d="M86\.6 0L173\.2 50V150L86\.6 200L0 150V50L86\.6 0Z" fill="#10201D"\/>/,
      `${slug} lost DEV's edge`,
    );
  }
});
