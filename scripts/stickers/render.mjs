#!/usr/bin/env node
/* Draws public/stickers/<slug>.svg for every sticker from the placeholder
   glyphs (src/data/stickerGlyphs.mjs): a 200-unit square, the type's
   ground as a full circle, the glyph at 58% in the ground's ink. Run with
   `npm run stickers:render`. A designer's illustrated file replaces one
   of these and the script leaves it alone unless run with --force. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { ACTIVITIES, REQUIRED_STICKERS } from '../../src/data/eligibility.mjs';
import { GLYPHS } from '../../src/data/stickerGlyphs.mjs';
import { REWARD_STICKERS } from '../../src/lib/stickerImage.mjs';

/* Grounds by type, the values Album.module.css draws with. colors.forest /
   ink / sky / orange / rule / pink / ochre / white */
const GROUNDS = {
  required: { fill: '#3d5f58', ink: '#f7f7f2' },
  dev: { fill: '#10201d', ink: '#f7f7f2' },
  livestreams: { fill: '#8bb2de', ink: '#10201d' },
  ghw: { fill: '#e53927', ink: '#10201d' },
  tools: { fill: '#8ca59e', ink: '#10201d' },
  inperson: { fill: '#e97b77', ink: '#10201d' },
  pack: { fill: '#f5b726', ink: '#10201d' },
  complete: { fill: 'url(#holo)', ink: '#10201d' },
  completionist: { fill: '#10201d', ink: '#f7f7f2' },
};

const HOLO = `<defs><linearGradient id="holo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5b726"/><stop offset="0.45" stop-color="#e97b77"/><stop offset="1" stop-color="#8bb2de"/></linearGradient></defs>`;

const STROKE = 'fill="none" stroke="currentColor" stroke-width="2"';
const ROUND = 'stroke-linejoin="round"';

export const stickerSvg = ({ art, ground }) => {
  const glyph = GLYPHS[art];
  const colours = GROUNDS[ground];
  if (!glyph || !colours)
    throw new Error(`no glyph or ground for ${art} / ${ground}`);
  const attrs = [glyph.stroke ? STROKE : '', glyph.round ? ROUND : '']
    .filter(Boolean)
    .join(' ');
  // 58% of 200 is 116: the glyph's 24-unit box scaled to 116 and centred.
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">`,
    ground === 'complete' ? HOLO : '',
    `<circle cx="100" cy="100" r="100" fill="${colours.fill}"/>`,
    `<svg x="42" y="42" width="116" height="116" viewBox="0 0 24 24" color="${colours.ink}"${attrs ? ` ${attrs}` : ''}>${glyph.inner}</svg>`,
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
  let written = 0;
  for (const sticker of all) {
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
  console.log(`stickers: ${written} drawn, ${all.length - written} kept`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
