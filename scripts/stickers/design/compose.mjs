/* Draws a designed sticker as a 200-unit SVG string, the system Jacklyn
   chose on 2026-09-21 (Figma: HF26-design-assets, Stickers page, the note
   in the Tier system section):

   - the ground: the type colour, the full hexagon the site clips to; a
     milestone's ground is a gradient, given as its stops, drawn corner
     to corner with a <linearGradient> whose id carries the slug, since
     the share card inlines many stickers into one document;
   - the icon: a Tabler filled icon, white with a 2.4-unit ink outline at
     Tabler's 24 grid, scaled 4.5x to a 108 box; centred at y 88 over a
     foot, or at y 100 without one;
   - the foot: an ink band from y 148 down to the bottom point, only on a
     sticker that has something to say there;
   - on the foot, white hexagon pips (11 wide, 5 apart, on y 164)
     counting a tier, a glyph (a Tabler icon 28 tall, centred on y 165,
     white) standing for a week with no number, or a week label in
     Martian Mono (a digit 19 tall on
     y 167, a word 16.5 tall on y 160), the glyphs as outlines so the
     file references no font.

   The DEV mark is not a Tabler icon: a partner logo, kept black and
   white. Its square is set to 80% of the icon box with an ink square
   behind it, so the letters read ink whatever the ground.

   An inset: a second Tabler icon drawn in ink inside the first, at a
   place and size given on the 24 grid. GHW's livestream: the bolt on the
   TV's screen.

   A tag: a second, smaller mark on the badge's lower right corner, a
   Tabler icon in white on a round ink disc. DEV connect's link. The badge
   shrinks to 70% and moves up and left so the pair sits centred.

   Nothing here touches the filesystem; build.mjs reads the icon files
   and hands their paths in. Colours are the album's, restated. */
const HEX = 'M100 0 L186.6 50 L186.6 150 L100 200 L13.4 150 L13.4 50 Z';
const INK = '#10201d';
const WHITE = '#f7f7f2';

const f2 = (v) => v.toFixed(2);

const hexagonAt = (cx, cy, width) => {
  const r = width / 2 / Math.cos(Math.PI / 6);
  const points = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = Math.PI / 6 + (i * Math.PI) / 3 - Math.PI / 2;
    return `${f2(cx + r * Math.cos(a))} ${f2(cy + r * Math.sin(a))}`;
  });
  return `M${points.join(' L')} Z`;
};

const FOOT = `<path d="M13.4 148 L186.6 148 L186.6 150 L100 200 L13.4 150 Z" fill="${INK}"/>`;

/* A mark's paths, placed: its own box (24 by 24 for a Tabler icon)
   scaled so the box's longer side is `size` units, centred on (100, cy).
   Drawn twice, the ink outline under the white fill; the outline is 2.4
   units at Tabler's grid (10.8 on the sticker) whatever the box. A
   partner mark drawn with even-odd holes keeps its rule. Joins are
   round, unless the icon file asks for mitred ones (data-join="miter"):
   a sharp tip like the paper plane's needs the outline to run to a
   point. An icon may also give a silhouette (a path with
   data-role="silhouette"): the outline and an ink fill are drawn from
   that, and the icon's own paths go on top in white, so a gap between
   them reads as an ink line. A path with data-role="filler" is drawn in
   ink after the outline and under the white: a plug for a notch the
   outline leaves between two pieces. A path with data-role="line" is
   drawn last as an ink stroke with round ends, 1.2 at the grid: the width
   of the outline that shows outside the white, so a crease weighs the
   same as the edge. And an offset (data-offset="dx dy",
   grid units) nudges a mark whose weight is off its box's centre. A path
   carrying its own fill keeps it in the fill pass: a partner mark in its
   colours, outlined like everything else. */
const outlinedMark = (
  paths,
  {
    box,
    size,
    cy,
    fillRule,
    join,
    silhouette,
    fillers,
    lines,
    paints,
    offset = [0, 0],
  },
) => {
  const scale = size / Math.max(box.w, box.h);
  const rule = fillRule ? ` fill-rule="${fillRule}"` : '';
  const joins =
    join === 'miter'
      ? 'stroke-linejoin="miter" stroke-miterlimit="10"'
      : 'stroke-linejoin="round"';
  const tx = 100 - (box.w * scale) / 2 + offset[0] * scale;
  const ty = cy - (box.h * scale) / 2 + offset[1] * scale;
  /* One pass over a set of paths; `own` lets a path keep its own fill. */
  const at = (attrs, ps = paths, own = false) =>
    `<g transform="translate(${f2(tx)} ${f2(ty)}) scale(${f2(scale)})" ${attrs}${rule}>${ps
      .map(
        (d, i) =>
          `<path d="${d}"${own && paints && paints[i] ? ` fill="${paints[i]}"` : ''}/>`,
      )
      .join('')}</g>`;
  const outline = silhouette || paths;
  return [
    at(
      `fill="none" stroke="${INK}" stroke-width="${f2(10.8 / scale)}" ${joins}`,
      outline,
    ),
    silhouette ? at(`fill="${INK}"`, silhouette) : '',
    fillers ? at(`fill="${INK}"`, fillers) : '',
    at(`fill="${WHITE}"`, paths, true),
    lines
      ? at(
          `fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"`,
          lines,
        )
      : '',
  ]
    .filter(Boolean)
    .join('\n');
};

/* Tabler's icons fill about 90% of their 24 grid, so at 108 the drawing
   is about 97 wide; a partner mark that fills its own box is set to 90 to
   carry the same weight. */
const TABLER = { w: 24, h: 24 };
const markSize = (box) => (box.w === 24 && box.h === 24 ? 108 : 90);

/* The DEV badge: one path in a 448 by 512 box whose square spans y 32 to
   480. The square is set to 86 units (80% of the icon box) centred on
   (100, cy); the ink square behind it shows through the letters. */
const devBadge = (paths, cy, size = 86, cx = 100) => {
  const scale = size / 448;
  const tx = cx - 224 * scale;
  const ty = cy - 256 * scale;
  const d = paths[0];
  return `<g transform="translate(${f2(tx)} ${f2(ty)}) scale(${f2(scale)})"><path d="${d}" fill="none" stroke="${INK}" stroke-width="${f2(10.8 / scale)}" stroke-linejoin="round"/><rect x="0" y="32" width="448" height="448" rx="44" fill="${INK}"/><path d="${d}" fill="${WHITE}"/></g>`;
};

/* A glyph on the foot where a label would go: a Tabler icon, white,
   28 units tall, centred on (100, 165). Launch weekend's rocket. */
const footGlyph = (paths, fillRule) => {
  const scale = 28 / 24;
  const rule = fillRule ? ` fill-rule="${fillRule}"` : '';
  return `<g transform="translate(${f2(100 - 12 * scale)} ${f2(165 - 12 * scale)}) scale(${f2(scale)})" fill="${WHITE}"${rule}>${paths.map((d) => `<path d="${d}"/>`).join('')}</g>`;
};

/* An icon inside the icon: `at` is the centre and `size` the height, both
   on the outer icon's 24 grid, so the inset lands on the same feature
   whatever the outer scale. Ink, so it reads as a cutout on the white. */
const inset = (paths, fillRule, { at, size }, outer) => {
  const k = size / 24;
  const rule = fillRule ? ` fill-rule="${fillRule}"` : '';
  return `<g transform="translate(${f2(outer.tx + (at[0] - 12 * k) * outer.scale)} ${f2(outer.ty + (at[1] - 12 * k) * outer.scale)}) scale(${f2(k * outer.scale)})" fill="${INK}"${rule}>${paths.map((d) => `<path d="${d}"/>`).join('')}</g>`;
};

/* The tag on a badge's corner: an ink disc 44 wide centred on (cx, cy),
   the icon 28 tall in white on it. */
const tag = (paths, fillRule, cx, cy) => {
  const scale = 28 / 24;
  const rule = fillRule ? ` fill-rule="${fillRule}"` : '';
  return `<circle cx="${cx}" cy="${cy}" r="22" fill="${INK}"/><g transform="translate(${f2(cx - 12 * scale)} ${f2(cy - 12 * scale)}) scale(${f2(scale)})" fill="${WHITE}"${rule}>${paths.map((d) => `<path d="${d}"/>`).join('')}</g>`;
};

const pips = (count) => {
  const width = 11;
  const gap = 5;
  const row = count * width + (count - 1) * gap;
  let out = '';
  for (let i = 0; i < count; i += 1) {
    const cx = 100 - row / 2 + width / 2 + i * (width + gap);
    out += `<path d="${hexagonAt(cx, 164, width)}" fill="${WHITE}"/>`;
  }
  return out;
};

/* The week label in Martian Mono outlines (martian-mono-glyphs.json:
   each glyph's path in font units, centred on its advance and on the cap
   height's midline). A digit sets 19 units tall on y 167; a word sets
   16.5 tall on y 160, the most that keeps LAUNCH inside the foot's
   sloping sides. The font's default weight is 400; a stroke of 1.2
   units in the same white takes it to the site's mono weight. */
const weekLabel = (glyphs, label) => {
  const cap = label.length > 1 ? 16.5 : 19;
  const cy = label.length > 1 ? 160 : 167;
  const k = cap / 800;
  const advance = 750 * k;
  let x = -(label.length * advance) / 2 + advance / 2;
  let out = '';
  for (const char of label) {
    const glyph = glyphs[char];
    if (!glyph) throw new Error(`no Martian Mono outline for "${char}"`);
    out += `<path d="${glyph.d}" transform="translate(${f2(x)} 0) scale(${f2(k)})" stroke-width="${f2(1.2 / k)}"/>`;
    x += advance;
  }
  return `<g transform="translate(100 ${cy})" fill="${WHITE}" stroke="${WHITE}" stroke-linejoin="round">${out}</g>`;
};

/* `entry` is a catalogue row; `iconPaths` the d attributes of its icon
   file, `iconBox` that file's viewBox size, `iconFillRule` its rule if it
   sets one, `iconJoin` its join style if it asks for one, `iconSilhouette`
   its silhouette path if it has one, `iconPaints` its paths' own fills if
   they carry any and `iconOffset` its nudge; `footIcon`, `tagIcon` and `insetIcon` the same three for
   the foot's glyph, the corner tag and the inset when the row names them; `ground` the colour; `glyphs` the Martian Mono outlines
   (only a weekly sticker needs them). */
/* A ground given as stops becomes a diagonal gradient; the defs go
   inside the sticker, ids namespaced by slug. */
const gradient = (slug, stops) =>
  `<defs><linearGradient id="ground-${slug}" x1="0" y1="0" x2="1" y2="1">${stops.map((colour, i) => `<stop offset="${(i / (stops.length - 1)).toFixed(2)}" stop-color="${colour}"/>`).join('')}</linearGradient></defs>`;

export const composeSticker = ({
  entry,
  iconPaths,
  iconBox = TABLER,
  iconFillRule,
  iconJoin,
  iconSilhouette,
  iconFillers,
  iconLines,
  iconPaints,
  iconOffset,
  footIcon,
  tagIcon,
  insetIcon,
  ground,
  glyphs,
}) => {
  const footed = Boolean(entry.tier || entry.week || entry.foot);
  const cy = footed ? 88 : 100;
  const size = markSize(iconBox);
  const scale = size / Math.max(iconBox.w, iconBox.h);
  const outer = {
    scale,
    tx: 100 - (iconBox.w * scale) / 2,
    ty: cy - (iconBox.h * scale) / 2,
  };
  let icon;
  if (entry.icon === 'dev-badge' && entry.tag)
    icon =
      devBadge(iconPaths, cy - 8, 76, 92) +
      tag(tagIcon.paths, tagIcon.fillRule, 135, cy + 29);
  else if (entry.icon === 'dev-badge') icon = devBadge(iconPaths, cy);
  else {
    icon = outlinedMark(iconPaths, {
      box: iconBox,
      size,
      cy,
      fillRule: iconFillRule,
      join: iconJoin,
      silhouette: iconSilhouette,
      fillers: iconFillers,
      lines: iconLines,
      paints: iconPaints,
      offset: iconOffset,
    });
    if (entry.inset)
      icon += inset(insetIcon.paths, insetIcon.fillRule, entry.inset, outer);
  }
  const mark = entry.tier
    ? pips(entry.tier)
    : entry.foot
      ? footGlyph(footIcon.paths, footIcon.fillRule)
      : entry.week
        ? weekLabel(glyphs, entry.week)
        : '';
  const graded = Array.isArray(ground);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">`,
    graded ? gradient(entry.slug, ground) : '',
    `<path d="${HEX}" fill="${graded ? `url(#ground-${entry.slug})` : ground}"/>`,
    footed ? FOOT : '',
    icon,
    mark,
    `</svg>`,
    '',
  ]
    .filter((line) => line !== '')
    .join('\n');
};

/* The locker's things (catalogue THINGS) are not stickers, so not
   hexagons: each is its own shape wearing the sticker's skin, the ink
   edge and white ring the site's CSS draws around a hexagon, drawn into
   the file here since the locker draws a thing as itself (the same
   32-and-20 strokes under the fill: 6 of ink, then 10 of white, showing
   outside the shape). The envelope carries a small white hexagon
   sticker, the pack's; a gift box and a badge are plain; a card carries three
   ruled lines and an ochre seal at its lower right with the seal's icon
   in white on it. A shape keeps 18 units from the box's sides, since the
   ink edge reaches 16 outside it and the box is the picture's edge. */
const OCHRE = '#f5b726';

const skin = (paths, ground, { transform = '', k = 1 } = {}) => {
  const pass = (attrs) =>
    `<g${transform ? ` transform="${transform}"` : ''} ${attrs}>${paths.map((d) => `<path d="${d}"/>`).join('')}</g>`;
  return [
    pass(
      `fill="none" stroke="${INK}" stroke-width="${f2(32 / k)}" stroke-linejoin="round"`,
    ),
    pass(
      `fill="none" stroke="${WHITE}" stroke-width="${f2(20 / k)}" stroke-linejoin="round"`,
    ),
    pass(`fill="${ground}"`),
  ].join('\n');
};

const roundedRect = (x, y, w, h, r) =>
  `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;

const ruled = (d, colour, width) =>
  `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;

const smallSticker = (cx, cy, width) =>
  `<path d="${hexagonAt(cx, cy, width)}" fill="${WHITE}" stroke="${INK}" stroke-width="5.4" stroke-linejoin="round"/>`;

/* A Tabler icon as the thing's whole shape: its 24 grid scaled to `size`
   and centred, the skin's strokes scaled down to match. */
const shapeMark = (paths, ground, size) => {
  const k = size / 24;
  const transform = `translate(${f2(100 - size / 2)} ${f2(100 - size / 2)}) scale(${f2(k)})`;
  return skin(paths, ground, { transform, k });
};

/* The seal: an ochre disc 40 wide with an ink edge, the icon 26 tall on
   it, white with the ink outline at half the sticker's weight. */
const seal = (paths, fillRule, cx, cy) => {
  const scale = 26 / 24;
  const rule = fillRule ? ` fill-rule="${fillRule}"` : '';
  const pass = (attrs) =>
    `<g transform="translate(${f2(cx - 12 * scale)} ${f2(cy - 12 * scale)}) scale(${f2(scale)})" ${attrs}${rule}>${paths.map((d) => `<path d="${d}"/>`).join('')}</g>`;
  return [
    `<circle cx="${cx}" cy="${cy}" r="20" fill="${OCHRE}" stroke="${INK}" stroke-width="5.4"/>`,
    pass(
      `fill="none" stroke="${INK}" stroke-width="${f2(5.4 / scale)}" stroke-linejoin="round"`,
    ),
    pass(`fill="${WHITE}"`),
  ].join('\n');
};

const THING_SHAPES = {
  envelope: ({ ground }) =>
    [
      skin([roundedRect(18, 40, 164, 120, 10)], ground),
      ruled('M18 40 L100 106 L182 40', INK, 5.4),
      smallSticker(100, 128, 30),
    ].join('\n'),
  gift: ({ ground, shapeIcon }) => shapeMark(shapeIcon.paths, ground, 176),
  badge: ({ ground, shapeIcon }) => shapeMark(shapeIcon.paths, ground, 176),
  card: ({ ground, sealIcon, rules = WHITE }) =>
    [
      skin([roundedRect(18, 46, 164, 108, 10)], ground),
      ruled('M40 80 H118', rules, 6),
      ruled('M40 100 H100', rules, 6),
      ruled('M40 120 H84', rules, 6),
      seal(sealIcon.paths, sealIcon.fillRule, 150, 122),
    ].join('\n'),
};

/* `entry` is a THINGS row; `shapeIcon` and `sealIcon` the icon files
   (paths and fill rule) its shape and seal name, when they do; `ground`
   the colour. */
export const composeThing = ({ entry, shapeIcon, sealIcon, ground }) => {
  const draw = THING_SHAPES[entry.shape];
  if (!draw) throw new Error(`no shape "${entry.shape}" for ${entry.slug}`);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">`,
    draw({ ground, shapeIcon, sealIcon, rules: entry.rules }),
    `</svg>`,
    '',
  ].join('\n');
};
