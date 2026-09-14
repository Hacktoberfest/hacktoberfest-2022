import assert from 'node:assert/strict';
import test from 'node:test';

import { ACTIVITIES, REQUIRED_STICKERS } from '../src/data/eligibility.mjs';
import { GLYPHS, glyphSvg } from '../src/data/stickerGlyphs.mjs';

test('every sticker in the catalogue has a glyph, and the rewards do too', () => {
  const keys = new Set(Object.keys(GLYPHS));
  for (const sticker of [...REQUIRED_STICKERS, ...ACTIVITIES]) {
    assert.ok(
      keys.has(sticker.art),
      `${sticker.id} wants glyph ${sticker.art}`,
    );
  }
  for (const reward of ['parcel', 'star', 'trophy'])
    assert.ok(keys.has(reward));
});

test('a glyph renders as one standalone SVG element', () => {
  const svg = glyphSvg('play');
  assert.match(
    svg,
    /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 24 24"/,
  );
  assert.match(svg, /<\/svg>$/);
  assert.ok(svg.includes('M7 4v16l13-8z'));
  assert.equal(glyphSvg('nope'), null);
});

test('stroke glyphs carry the stroke attributes, filled ones do not', () => {
  assert.match(
    glyphSvg('plug'),
    /fill="none" stroke="currentColor" stroke-width="2"/,
  );
  assert.doesNotMatch(glyphSvg('play'), /stroke-width/);
  assert.match(glyphSvg('parcel'), /stroke-linejoin="round"/);
  assert.doesNotMatch(glyphSvg('parcel'), /stroke-linecap/);
});
