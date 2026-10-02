/* Where a sticker's picture lives: public/stickers/<slug>.svg, one file
   per slug, the whole sticker (ground and glyph) in a 200-unit square.
   Drawn today by scripts/stickers/render.mjs from the placeholder glyphs;
   the illustrated stickers replace the files one by one and nothing here
   changes. Relative imports: Node's test runner reads this. */
import { ACTIVITIES, REQUIRED_STICKERS } from '../data/eligibility.mjs';

export const REWARD_STICKERS = Object.freeze([
  Object.freeze({ id: 'milestone-pack', art: 'parcel', ground: 'pack' }),
  Object.freeze({ id: 'milestone-complete', art: 'star', ground: 'complete' }),
  Object.freeze({
    id: 'milestone-completionist',
    art: 'trophy',
    ground: 'completionist',
  }),
  /* The inventory's things (lib/inventory.mjs): drawn as themselves, not
     as stickers, so not hexagons. `shape` picks the ground the script
     draws (scripts/stickers/render.mjs). One file per item slug the
     frontend knows, plus a generic per kind for a slug it does not. Same
     files, same script, same seam for a designer's export. */
  Object.freeze({
    id: 'reward-pack',
    art: 'parcel',
    ground: 'pack',
    shape: 'pack',
  }),
  Object.freeze({
    id: 'reward-physical',
    art: 'gift',
    ground: 'tee',
    shape: 'tile',
  }),
  Object.freeze({
    id: 'reward-digital',
    art: 'medal',
    ground: 'certificate',
    shape: 'card',
  }),
  /* The known items' own pictures, by their API slugs (lib/inventory.mjs
     ITEM_ART): the Fest certificates, attendee's and host's, the
     Completionist's, and the mentor's and judge's given by hand. */
  Object.freeze({
    id: 'fest-certificate-2026',
    art: 'medal',
    ground: 'certificate',
    shape: 'card',
  }),
  Object.freeze({
    id: 'fest-host-certificate-2026',
    art: 'medal',
    ground: 'certificate',
    shape: 'card',
  }),
  Object.freeze({
    id: 'completionist-certificate-2026',
    art: 'medal',
    ground: 'certificate',
    shape: 'card',
  }),
  Object.freeze({
    id: 'fest-mentor-certificate-2026',
    art: 'medal',
    ground: 'certificate',
    shape: 'card',
  }),
  Object.freeze({
    id: 'fest-judge-certificate-2026',
    art: 'medal',
    ground: 'certificate',
    shape: 'card',
  }),
]);

export const STICKER_IMAGE_SLUGS = Object.freeze([
  ...ACTIVITIES.map((activity) => activity.id),
  ...REQUIRED_STICKERS.map((sticker) => sticker.id),
  ...REWARD_STICKERS.map((reward) => reward.id),
]);

export const stickerImageSrc = (slug) => {
  if (typeof slug !== 'string' || !slug)
    throw new TypeError('a sticker slug is a string');
  return `/stickers/${slug}.svg`;
};
