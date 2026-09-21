#!/usr/bin/env node
/* Draws public/stickers/<slug>.svg for every sticker from the placeholder
   glyphs (src/data/stickerGlyphs.mjs): a 200-unit square, the type's
   ground as a full hexagon for a sticker or a shape of its own for a
   reward that is not one, the glyph in the ground's ink. Run with
   `npm run stickers:render`. A designed file (scripts/stickers/design,
   written by `npm run stickers:figma -- --site`) replaces one of these
   and the script never touches it, --force or not; an undesigned slug's
   placeholder is kept unless run with --force. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { ACTIVITIES, REQUIRED_STICKERS } from '../../src/data/eligibility.mjs';
import { GLYPHS } from '../../src/data/stickerGlyphs.mjs';
import { REWARD_STICKERS } from '../../src/lib/stickerImage.mjs';
import { CATALOGUE } from './design/catalogue.mjs';

/* Grounds by type, the values Album.module.css draws with. colors.forest /
   ink / sky / orange / rule / pink / ochre / white */
const GROUNDS = {
  required: { fill: '#3d5f58', ink: '#f7f7f2' },
  dev: { fill: '#f5b726', ink: '#10201d' },
  livestreams: { fill: '#8bb2de', ink: '#10201d' },
  ghw: { fill: '#e53927', ink: '#10201d' },
  tools: { fill: '#671912', ink: '#f7f7f2' },
  inperson: { fill: '#e97b77', ink: '#10201d' },
  pack: { fill: '#f5b726', ink: '#10201d' },
  complete: { fill: 'url(#holo)', ink: '#10201d' },
  completionist: { fill: '#10201d', ink: '#f7f7f2' },
  tee: { fill: '#8bb2de', ink: '#10201d' },
  certificate: { fill: '#3d5f58', ink: '#f7f7f2' },
};

const HOLO = `<defs><linearGradient id="holo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5b726"/><stop offset="0.45" stop-color="#e97b77"/><stop offset="1" stop-color="#8bb2de"/></linearGradient></defs>`;

const STROKE = 'fill="none" stroke="currentColor" stroke-width="2"';
const ROUND = 'stroke-linejoin="round"';

/* The grounds. A sticker is the full hexagon, pointy end up, the square's
   whole height and cos 30° of its width: its six corners at (100, 0),
   (186.6, 50), (186.6, 150), (100, 200), (13.4, 150), (13.4, 50), the
   same six the CSS modules on /my clip the slot to (Album.module.css and
   the modules that restate it), so the file's edge and the page's edge
   are one hexagon. The inventory's other things are not stickers, so not
   hexagons of that kind: a pack (a square envelope with a flap), a tile
   (a rounded square), a badge (a smaller hexagon with an ink edge), a
   card (a landscape rectangle with a seal). Each draws its own ink edge,
   since the album's border and outline are for stickers only, and says
   where the glyph sits. colors.ink / white / ochre */
const INK = '#10201d';
const EDGE = `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;
export const HEXAGON =
  'M100 0 L186.6 50 L186.6 150 L100 200 L13.4 150 L13.4 50 Z';
const SHAPES = {
  hexagon: {
    ground: (fill) => `<path d="${HEXAGON}" fill="${fill}"/>`,
    glyph: { x: 42, y: 42, size: 116 },
  },
  pack: {
    ground: (fill) =>
      `<rect x="14" y="30" width="172" height="156" rx="10" fill="${fill}" ${EDGE}/>` +
      `<path d="M14 30 L100 96 L186 30" fill="none" ${EDGE}/>`,
    glyph: { x: 56, y: 78, size: 88 },
  },
  tile: {
    ground: (fill) =>
      `<rect x="14" y="14" width="172" height="172" rx="22" fill="${fill}" ${EDGE}/>`,
    glyph: { x: 46, y: 46, size: 108 },
  },
  badge: {
    ground: (fill) =>
      `<path d="M100 8 L180 54 L180 146 L100 192 L20 146 L20 54 Z" fill="${fill}" ${EDGE}/>`,
    glyph: { x: 48, y: 48, size: 104 },
  },
  card: {
    ground: (fill) =>
      `<rect x="8" y="42" width="184" height="116" rx="8" fill="${fill}" ${EDGE}/>` +
      `<circle cx="164" cy="128" r="16" fill="#f5b726" ${EDGE}/>`,
    glyph: { x: 30, y: 64, size: 72 },
  },
};

export const stickerSvg = ({ art, ground, shape = 'hexagon' }) => {
  const glyph = GLYPHS[art];
  const colours = GROUNDS[ground];
  const form = SHAPES[shape];
  if (!glyph || !colours || !form)
    throw new Error(
      `no glyph, ground or shape for ${art} / ${ground} / ${shape}`,
    );
  const attrs = [glyph.stroke ? STROKE : '', glyph.round ? ROUND : '']
    .filter(Boolean)
    .join(' ');
  const { x, y, size } = form.glyph;
  // A sticker's glyph sits at 58% of the hexagon (116 of 200), centred:
  // its box's corners are 82 from the middle, inside the 86.6 the
  // hexagon's flat sides come to.
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">`,
    ground === 'complete' ? HOLO : '',
    form.ground(colours.fill),
    `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" color="${colours.ink}"${attrs ? ` ${attrs}` : ''}>${glyph.inner}</svg>`,
    `</svg>`,
    '',
  ]
    .filter((line) => line !== '')
    .join('\n');
};

const main = async () => {
  const force = process.argv.includes('--force');
  const dir = new URL('../../public/stickers/', import.meta.url);
  await mkdir(dir, { recursive: true });
  const all = [
    ...REQUIRED_STICKERS.map((s) => ({
      id: s.id,
      art: s.art,
      ground: 'required',
    })),
    ...ACTIVITIES.map((a) => ({ id: a.id, art: a.art, ground: a.type })),
    ...REWARD_STICKERS,
  ];
  const designed = new Set(CATALOGUE.map((entry) => entry.slug));
  let written = 0;
  for (const sticker of all) {
    if (designed.has(sticker.id)) continue;
    const file = new URL(`${sticker.id}.svg`, dir);
    if (!force) {
      try {
        await readFile(file);
        continue;
      } catch (_) {
        /* absent: draw it */
      }
    }
    await writeFile(file, stickerSvg(sticker));
    written += 1;
  }
  console.log(
    `stickers: ${written} drawn, ${all.length - designed.size - written} kept, ${designed.size} designed`,
  );
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
