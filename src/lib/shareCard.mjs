/* The picture a share turns into: a 1080 square of SVG, built as a string
   and handed to components/ShareModal, which paints it through an <img>
   onto a canvas and hands the PNG to the share sheet, the clipboard or a
   download.

   That trip is why everything here is self-contained. An <img> loading an
   SVG fetches nothing: no stylesheet, no font file, no <image href>, no
   remote gradient. So the type is named by stack with real fallbacks and
   the stickers are inlined whole, straight out of public/stickers.

   Every string that came from anywhere else (a name from MyMLH, a label,
   a date) goes through escapeXml on the way in. One unescaped ampersand
   in a name and the whole document fails to parse, and the card comes out
   blank.

   Relative imports and no JSX: Node's test runner reads this. */
import { my } from '../data/content.mjs';

export const CARD_SIZE = 1080;

const PAPER = '#eeeee6';
const INK = '#10201d';
const MAROON = '#671912';
const MUTED = '#52635f';

const DISPLAY =
  "'Barlow Semi Condensed', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const BODY = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'Martian Mono', ui-monospace, Menlo, monospace";

/* The paper: inset 24 from the edge, with the maroon block showing 12
   right and below it, the hard shadow the site draws everywhere. */
const MARGIN = 24;
const SHADOW = 12;
const SHEET = CARD_SIZE - MARGIN * 2;

/* The book's grid: five to a row, 150 wide, 30 between, four rows at
   most, the block centred in the square both ways. */
const GRID_SIZE = 150;
const GRID_GUTTER = 30;
const GRID_PER_ROW = 5;
const GRID_MAX = 20;
const GRID_ROW_WIDTH =
  GRID_PER_ROW * GRID_SIZE + (GRID_PER_ROW - 1) * GRID_GUTTER;
const GRID_LEFT = (CARD_SIZE - GRID_ROW_WIDTH) / 2;
const GRID_TOP = 300;
const GRID_HEIGHT =
  (GRID_MAX / GRID_PER_ROW) * GRID_SIZE +
  (GRID_MAX / GRID_PER_ROW - 1) * GRID_GUTTER;
const GRID_BOTTOM = GRID_TOP + GRID_HEIGHT;

/* The gutter the wordmark and the address sit in, and the width a line of
   text has between them. */
const GUTTER = 72;
const TEXT_WIDTH = CARD_SIZE - GUTTER * 2;

/* The address hangs its own size and half again below the fullest the grid
   can ever be, so the whole line clears the last row of stickers with air
   to spare. Derived, not typed twice: move the grid and the address moves
   with it rather than quietly landing on top of a sticker. */
const SITE_SIZE = 28;
const SITE_BASELINE = GRID_BOTTOM + SITE_SIZE * 1.5;

export const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/* Nothing measures text in a string of SVG, so the display face steps
   down by how many characters it has to carry. The steps are drawn to
   keep the longest sticker name in the catalogue inside the paper. */
const displaySize = (text) => {
  const length = String(text).length;
  if (length <= 16) return 76;
  if (length <= 24) return 64;
  if (length <= 34) return 52;
  return 42;
};

/* A rough average glyph width, as a share of the font size: enough to
   tell a line that fits from one that does not, in the condensed display
   face and in the body face alike. Erring wide is the safe direction, and
   an SVG painted into an <img> may fall back to Helvetica or Arial, which
   are wider still. */
const WIDTH_PER_CHAR = 0.55;

/* A name comes from MyMLH and is as long as somebody typed it. Past the
   point where the estimate says it would cross the paper's border, the
   line is handed a textLength and squeezed to fit: every name is drawn
   whole, and none of them runs off the card. Short lines are left alone,
   so the face keeps its natural spacing where it has the room. */
const fitWidth = (value, size) =>
  String(value).length * WIDTH_PER_CHAR * size > TEXT_WIDTH
    ? ` textLength="${TEXT_WIDTH}" lengthAdjust="spacingAndGlyphs"`
    : '';

const number = (value, what) => {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new TypeError(`${what} is a number`);
  return n;
};

/* A sticker file, dropped into the card at a place and a size. The file's
   own root tag goes (its width, height and xmlns say 200 and belong to a
   document, not to a piece of one) and this one takes its place, keeping
   the 200-unit viewBox so the drawing inside lands where it always did.

   Everything else is kept as it was found, <defs> included: a sticker
   whose ground is a gradient is nothing without it. That does mean two
   copies of the same file in one card would carry the same gradient id
   twice. The book never lists a slug twice, and the sticker card draws
   one, so it cannot happen from here. */
export const inlineSticker = (svg, { x, y, size } = {}) => {
  /* A designer's export opens with an XML prolog, a doctype or a
     generator comment before the root; none of that belongs inside a
     nested element, so it is dropped before the root is found. */
  const source = (typeof svg === 'string' ? svg : '')
    .replace(/^(\s*(<\?xml[^>]*\?>|<!DOCTYPE[^>]*>|<!--[\s\S]*?-->))+/i, '')
    .trim();
  const open = source.match(/^<svg(?=[\s/>])[\s\S]*?>/);
  const close = source.lastIndexOf('</svg>');
  if (!open || close < open[0].length)
    throw new TypeError('a sticker is an <svg> document');

  const inner = source.slice(open[0].length, close);
  return `<svg x="${number(x, 'x')}" y="${number(y, 'y')}" width="${number(size, 'size')}" height="${number(size, 'size')}" viewBox="0 0 200 200">${inner}</svg>`;
};

const text = (
  value,
  { x, y, size, family, weight = '400', fill = INK, anchor = 'start', fit },
) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}"${fit ? fitWidth(value, size) : ''}>${escapeXml(value)}</text>`;

/* The frame every card wears: the shadow, the paper, the wordmark top
   left and the address bottom right. */
const frame = () =>
  [
    `<rect x="${MARGIN + SHADOW}" y="${MARGIN + SHADOW}" width="${SHEET}" height="${SHEET}" fill="${MAROON}"/>`,
    `<rect x="${MARGIN}" y="${MARGIN}" width="${SHEET}" height="${SHEET}" fill="${PAPER}" stroke="${INK}" stroke-width="4"/>`,
    text(my.share.card.wordmark, {
      x: GUTTER,
      y: 116,
      size: 44,
      family: DISPLAY,
      weight: '700',
    }),
    text(my.share.card.site, {
      x: CARD_SIZE - GUTTER,
      y: SITE_BASELINE,
      size: SITE_SIZE,
      family: MONO,
      fill: MAROON,
      anchor: 'end',
    }),
  ].join('');

const document_ = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_SIZE}" height="${CARD_SIZE}" viewBox="0 0 ${CARD_SIZE} ${CARD_SIZE}">${body}</svg>`;

/* One sticker, big, with its name under it and who earned it under that.
   `earnedAt` is already words by the time it gets here (lib/earnedDate);
   without one the line simply is not drawn. */
export const stickerCardSvg = ({ name, sticker, earnedAt } = {}) => {
  const { label, svg } = sticker || {};
  const size = 520;
  const middle = CARD_SIZE / 2;

  const lines = [
    frame(),
    inlineSticker(svg, { x: (CARD_SIZE - size) / 2, y: 200, size }),
    text(label, {
      x: middle,
      y: 830,
      size: displaySize(label),
      family: DISPLAY,
      weight: '700',
      anchor: 'middle',
      fit: true,
    }),
    text(my.share.card.earnedBy(name), {
      x: middle,
      y: 890,
      size: 36,
      family: BODY,
      anchor: 'middle',
      fit: true,
    }),
  ];

  if (earnedAt)
    lines.push(
      text(earnedAt, {
        x: middle,
        y: 942,
        size: 26,
        family: MONO,
        fill: MUTED,
        anchor: 'middle',
      }),
    );

  return document_(lines.join(''));
};

/* The whole book: the name, the count, and the stickers as a grid. Twenty
   is what fits and stays legible, so a fuller book shows its first twenty
   and says the true count above them. */
export const bookCardSvg = ({ name, stickers, earned, total } = {}) => {
  const drawn = (Array.isArray(stickers) ? stickers : []).slice(0, GRID_MAX);
  const rows = Math.max(1, Math.ceil(drawn.length / GRID_PER_ROW));
  const blockHeight = rows * GRID_SIZE + (rows - 1) * GRID_GUTTER;
  const top = GRID_TOP + (GRID_HEIGHT - blockHeight) / 2;
  const middle = CARD_SIZE / 2;

  const grid = drawn.map((sticker, index) =>
    inlineSticker(sticker.svg, {
      x: GRID_LEFT + (index % GRID_PER_ROW) * (GRID_SIZE + GRID_GUTTER),
      y: top + Math.floor(index / GRID_PER_ROW) * (GRID_SIZE + GRID_GUTTER),
      size: GRID_SIZE,
    }),
  );

  return document_(
    [
      frame(),
      text(name, {
        x: middle,
        y: 208,
        size: displaySize(name),
        family: DISPLAY,
        weight: '700',
        anchor: 'middle',
        fit: true,
      }),
      text(my.share.card.count(earned, total), {
        x: middle,
        y: 262,
        size: 36,
        family: BODY,
        fill: MUTED,
        anchor: 'middle',
      }),
      ...grid,
    ].join(''),
  );
};
