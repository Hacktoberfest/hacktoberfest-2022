import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

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

/* Circles are for stickers. The inventory's other things wear shapes of
   their own, so their files must not be the sticker's full circle. */
test('only the stickers are drawn as circles', async () => {
  const read = (slug) =>
    readFile(
      new URL(`../public/stickers/${slug}.svg`, import.meta.url),
      'utf8',
    );
  const circle = /<circle cx="100" cy="100" r="100"/;
  assert.match(await read('milestone-complete'), circle);
  assert.match(await read('fest'), circle);
  for (const slug of ['reward-pack', 'reward-physical', 'reward-digital']) {
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
