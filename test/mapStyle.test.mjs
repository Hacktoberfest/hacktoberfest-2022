import assert from 'node:assert/strict';
import test from 'node:test';

import {
  basemapStyle,
  hexToHsl,
  hslToHex,
  tintFlavor,
  tintHex,
} from '../src/lib/mapStyle.mjs';

const SOURCE = { type: 'vector', tiles: ['https://example.invalid/{z}.mvt'] };
const MAROON = '#671912';
const SKY_DEEP = '#1f4e6b';

test('hex and hsl round-trip', () => {
  for (const hex of ['#000000', '#ffffff', '#cccccc', MAROON, SKY_DEEP]) {
    assert.equal(hslToHex(hexToHsl(hex)), hex);
  }
});

/* The whole promise of this file. A basemap's legibility lives in its
   luminance steps — water against land, a road against its block — so the
   tint takes hue and saturation from the accent and leaves lightness
   exactly where it found it. The CSS filter chain this replaces could not
   make that promise, which is why its first version bleached the map. */
test('tinting preserves lightness exactly', () => {
  for (const grey of ['#a3a3a3', '#cccccc', '#e0e0e0', '#f5f5f5', '#5c5c5c']) {
    const before = hexToHsl(grey).l;
    const after = hexToHsl(tintHex(grey, MAROON)).l;

    assert.ok(
      Math.abs(before - after) < 0.004,
      `lightness moved: ${grey} ${before} -> ${after}`,
    );
  }
});

/* Within a few degrees, not exactly. The output is an 8-bit hex, and a
   weak tint puts the three channels within a few steps of each other,
   where one step of rounding is worth a couple of degrees of hue. That is
   quantisation rather than drift, and invisible at this saturation. */
test('tinting takes the accent hue', () => {
  const warm = hexToHsl(tintHex('#cccccc', MAROON));
  const cool = hexToHsl(tintHex('#cccccc', SKY_DEEP));

  assert.ok(Math.abs(warm.h - hexToHsl(MAROON).h) < 5, `warm: ${warm.h}`);
  assert.ok(Math.abs(cool.h - hexToHsl(SKY_DEEP).h) < 5, `cool: ${cool.h}`);

  /* The property that actually matters: each tint lands nearer its own
     accent than the other one, so the two formats stay distinguishable. */
  assert.ok(
    Math.abs(warm.h - hexToHsl(MAROON).h) <
      Math.abs(warm.h - hexToHsl(SKY_DEEP).h),
    'the warm tint is closer to the cool accent than to its own',
  );
});

/* Weak on purpose. A map tinted at full strength stops being a map and
   becomes a coloured rectangle with street names on it. */
test('keeps the tint well below the accent saturation', () => {
  const tinted = hexToHsl(tintHex('#cccccc', MAROON)).s;

  assert.ok(tinted > 0, 'no tint applied at all');
  assert.ok(
    tinted < hexToHsl(MAROON).s / 2,
    `tint too strong: ${tinted} against ${hexToHsl(MAROON).s}`,
  );
});

/* Strength is a damping factor on the ACCENT's own saturation, not a
   target saturation. That distinction is the reason the directory map
   passes 1: the brand green is already muted, and a third of it is grey.
   A saturated accent damped and a muted accent undamped should land in
   the same neighbourhood, which is what makes the two maps look like they
   belong to one site. */
test('strength scales the accent saturation rather than setting it', () => {
  const FOREST = '#3d5f58';
  const damped = hexToHsl(tintHex('#cccccc', FOREST)).s;
  const full = hexToHsl(tintHex('#cccccc', FOREST, 1)).s;

  assert.ok(
    full > damped * 2,
    `strength had little effect: ${damped} -> ${full}`,
  );
  /* Undamped muted green lands near damped saturated maroon. */
  const maroonDamped = hexToHsl(tintHex('#cccccc', MAROON)).s;
  assert.ok(
    Math.abs(full - maroonDamped) < 0.08,
    `green ${full} is not comparable to maroon ${maroonDamped}`,
  );
});

/* No accent is every past Fest, where colourless is the point. */
test('no accent leaves a colour untouched', () => {
  assert.equal(tintHex('#cccccc', null), '#cccccc');
  assert.equal(tintHex('#cccccc', ''), '#cccccc');
  assert.equal(tintHex('#cccccc', undefined), '#cccccc');
});

/* Every colour, or the map tints in patches — one recoloured feature
   beside an untouched one reads as a rendering fault. */
test('tints every colour in a flavour', () => {
  const flavor = { earth: '#cccccc', water: '#a3a3a3', buildings: '#e0e0e0' };
  const tinted = tintFlavor(flavor, MAROON);

  assert.deepEqual(Object.keys(tinted), Object.keys(flavor));
  for (const key of Object.keys(flavor)) {
    assert.notEqual(tinted[key], flavor[key], `${key} was left grey`);
  }
});

test('builds a MapLibre style around the given source', () => {
  const style = basemapStyle({ source: SOURCE, accent: null });

  assert.equal(style.version, 8);
  assert.deepEqual(style.sources.protomaps, SOURCE);
  assert.ok(style.layers.length > 0, 'no layers');
  assert.match(style.glyphs, /\{fontstack\}/);
  /* Every layer must name the source this style declares, or it renders
     nothing and says nothing about why. */
  for (const layer of style.layers) {
    if (layer.source) assert.equal(layer.source, 'protomaps');
  }
});

/* The untinted style is the one both the directory map and every past
   Fest get, so it has to be genuinely colourless rather than nearly so. */
test('an untinted style is fully desaturated', () => {
  const style = basemapStyle({ source: SOURCE, accent: null });
  const colours = JSON.stringify(style.layers).match(/#[0-9a-f]{6}/g) || [];

  assert.ok(colours.length > 0, 'found no colours to check');
  for (const hex of colours) {
    assert.equal(hexToHsl(hex).s, 0, `${hex} carries saturation`);
  }
});

test('a tinted style differs from an untinted one', () => {
  const plain = basemapStyle({ source: SOURCE, accent: null });
  const tinted = basemapStyle({ source: SOURCE, accent: MAROON });

  assert.notDeepEqual(tinted.layers, plain.layers);
});
