import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

import {
  CARD_SIZE,
  GRID_SCALES,
  bookCardSvg,
  escapeXml,
  gridScale,
  inlineSticker,
  stickerCardSvg,
} from '../src/lib/shareCard.mjs';

const readSticker = (slug) =>
  readFile(new URL(`../public/stickers/${slug}.svg`, import.meta.url), 'utf8');

const FEST = await readSticker('fest');
const HOLO = await readSticker('milestone-complete');

const ROOT =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">';

const count = (haystack, needle) => haystack.split(needle).length - 1;

/* The grid's own wrappers, told apart from the glyph <svg> nested inside
   every sticker file by the width the card draws them at. */
/* The picture inside a framed sticker: the book's 5.8 of padding at 72,
   scaled to the frame's size (lib/shareCard framedSticker). */
const inner = (size) => size - 2 * (5.8 * (size / 72));

const gridXs = (card, size) =>
  [
    ...card.matchAll(
      new RegExp(`<svg x="(-?[\\d.]+)" y="-?[\\d.]+" width="${size}"`, 'g'),
    ),
  ].map((match) => Number(match[1]));

const book = (n) =>
  Array.from({ length: n }, (_, i) => ({
    id: `sticker-${i}`,
    label: `Sticker ${i}`,
    svg: i % 2 === 0 ? FEST : HOLO,
  }));

test('the card is a 1080 square', () => {
  assert.equal(CARD_SIZE, 1080);
});

test('escapeXml escapes the five characters that break XML', () => {
  assert.equal(
    escapeXml('a & <b> "c" \'d\''),
    'a &amp; &lt;b&gt; &quot;c&quot; &#39;d&#39;',
  );
  assert.equal(escapeXml(12), '12');
});

test('inlineSticker drops the outer tags and keeps everything inside', () => {
  /* The open tag written across lines, attributes in another order: the
     same document, and the same inner markup has to come back. */
  const multiline = HOLO.replace(
    /^<svg[\s\S]*?>/,
    '<svg\n  width="200"\n  height="200"\n  viewBox="0 0 200 200"\n  xmlns="http://www.w3.org/2000/svg"\n>',
  );
  const inlined = inlineSticker(multiline, { x: 10, y: 20, size: 150 });

  assert.ok(
    inlined.startsWith(
      '<svg x="10" y="20" width="150" height="150" viewBox="0 0 200 200">',
    ),
    inlined.slice(0, 120),
  );
  assert.ok(inlined.endsWith('</svg>'));
  assert.ok(inlined.includes('<defs>'));
  assert.ok(inlined.includes('id="ground-milestone-complete"'));
  assert.ok(inlined.includes('<path d="M100 0 L186.6 50 L186.6 150'));
  assert.ok(!inlined.includes('xmlns='));
  assert.equal(count(inlined, '</svg>'), count(HOLO, '</svg>'));
});

test('inlineSticker refuses anything that is not an SVG document', () => {
  assert.throws(
    () => inlineSticker('<html></html>', { x: 0, y: 0, size: 1 }),
    TypeError,
  );
  assert.throws(() => inlineSticker('', { x: 0, y: 0, size: 1 }), TypeError);
  assert.throws(() => inlineSticker(null, { x: 0, y: 0, size: 1 }), TypeError);
  /* An <svg> with no end to it is not a document either. */
  assert.throws(
    () =>
      inlineSticker('<svg viewBox="0 0 200 200"><circle/>', {
        x: 0,
        y: 0,
        size: 1,
      }),
    TypeError,
  );
});

test("inlineSticker takes a designer's export, prolog and comments and all", () => {
  const exported = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generator: Adobe Illustrator 28.0 -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="100" fill="#f5b726"/>
</svg>
`;
  const nested = inlineSticker(exported, { x: 10, y: 20, size: 100 });
  assert.match(
    nested,
    /^<svg x="10" y="20" width="100" height="100" viewBox="0 0 200 200">/,
  );
  assert.ok(nested.includes('<circle cx="100"'));
  assert.doesNotMatch(nested, /<\?xml|<!DOCTYPE|<!--|Generator/);
  assert.match(nested, /<\/svg>$/);
});

test('inlineSticker refuses a place or a size that is not a number', () => {
  assert.throws(
    () => inlineSticker(FEST, { x: 'left', y: 0, size: 150 }),
    TypeError,
  );
  assert.throws(
    () => inlineSticker(FEST, { x: 0, y: undefined, size: 150 }),
    TypeError,
  );
  assert.throws(
    () => inlineSticker(FEST, { x: 0, y: 0, size: NaN }),
    TypeError,
  );
  assert.throws(() => inlineSticker(FEST, {}), TypeError);
});

test('the sticker card is a whole SVG document in the site grammar', () => {
  const card = stickerCardSvg({
    name: 'Jacklyn',
    sticker: { label: 'Attend a Fest', svg: FEST },
    earnedAt: '3 October 2026',
  });

  assert.ok(card.startsWith(ROOT), card.slice(0, 160));
  assert.ok(card.trimEnd().endsWith('</svg>'));
  /* The base: forest, the stair's paper, the wordmark named for a reader. */
  assert.ok(card.includes('fill="#3d5f58"'));
  assert.ok(card.includes('fill="#e4e5da"'));
  assert.ok(card.includes('<title>Hacktoberfest 2026</title>'));
  /* The sticker's framing: the book's ink ring, white ring and shadow. */
  assert.ok(card.includes('fill="#10201d" opacity="0.35"'));
  assert.ok(card.includes('fill="#f7f7f2"'));
  assert.ok(card.includes('Attend a Fest'));
  assert.ok(card.includes('Earned by Jacklyn'));
  assert.ok(card.includes('3 October 2026'));
  /* One sticker, drawn once, with its own markup nested whole. */
  assert.equal(count(card, '<svg '), 1 + count(FEST, '<svg '));
  /* One sticker, 500 wide, drawn inside its frame at the book's inset. */
  assert.equal(gridXs(card, inner(500)).length, 1);
});

test('a long sticker name goes on two lines, not squeezed, and the sticker makes room', () => {
  const card = stickerCardSvg({
    name: 'Jacklyn',
    sticker: {
      label:
        'Complete Global Hack Week: Hacktoberfest’s registration challenges',
      svg: FEST,
    },
    earnedAt: '13 October 2026',
  });
  const display = textLines(card).filter((line) => line.size >= 48);
  assert.equal(display.length, 2);
  assert.ok(!card.includes('textLength='), 'nothing is squeezed');
  assert.equal(gridXs(card, inner(440)).length, 1);
  /* And the last line still sits above the bottom edge. */
  const last = Math.max(...textLines(card).map((line) => line.y));
  assert.ok(last < CARD_SIZE - 30, String(last));
});

test('the sticker card leaves out the date line when there is no date', () => {
  const card = stickerCardSvg({
    name: 'Jacklyn',
    sticker: { label: 'Attend a Fest', svg: FEST },
  });
  assert.ok(card.includes('Earned by Jacklyn'));
  assert.ok(!card.includes('undefined'));
});

test('a name that is markup arrives escaped, on both cards', () => {
  const name = '<script>alert("x")</script>';
  const cards = [
    stickerCardSvg({
      name,
      sticker: { label: '<b>&</b>', svg: FEST },
      earnedAt: '<i>then</i>',
    }),
    bookCardSvg({ name, stickers: book(3), earned: 3, total: 22 }),
  ];
  for (const card of cards) {
    assert.ok(!card.includes('<script'), card.slice(0, 200));
    assert.ok(!card.includes('</script>'));
    assert.ok(
      card.includes('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'),
    );
  }
  assert.ok(cards[0].includes('&lt;b&gt;&amp;&lt;/b&gt;'));
  assert.ok(cards[0].includes('&lt;i&gt;then&lt;/i&gt;'));
});

test('a full book lays its stickers six to a row', () => {
  const stickers = book(25);
  const card = bookCardSvg({
    name: 'Jacklyn',
    stickers,
    earned: 12,
    total: 22,
  });

  assert.ok(card.startsWith(ROOT));
  assert.ok(card.trimEnd().endsWith('</svg>'));
  assert.ok(card.includes('12 of 22 stickers'));
  assert.ok(card.includes('Jacklyn'));

  const xs = gridXs(card, inner(106));
  assert.equal(xs.length, stickers.length);
  const firstRow = xs.slice(0, 6);
  assert.equal(new Set(firstRow).size, 6);
  assert.equal(xs[6], firstRow[0]);
  /* Even columns: the same gutter between every pair, to the pixel (the
     frame's inset is a fraction, so the places carry float dust). */
  const gaps = firstRow.slice(1).map((x, i) => Math.round(x - firstRow[i]));
  assert.deepEqual(new Set(gaps), new Set([106 + 16]));
  /* Centred as a block inside the 1080 square. */
  /* Centred: the row's two outer pictures sit the same distance in. */
  assert.equal(firstRow[0] + inner(106) + firstRow[5], CARD_SIZE);
});

test('each sticker in the book is inlined once, whole and nested', () => {
  const stickers = book(7);
  const card = bookCardSvg({
    name: 'Jacklyn',
    stickers,
    earned: 7,
    total: 22,
  });

  /* One root, plus every tag each sticker file brought with it: its own
     root swapped for the card's placing wrapper, its glyph <svg> kept. */
  const expected =
    1 + stickers.reduce((sum, s) => sum + count(s.svg, '<svg '), 0);
  assert.equal(count(card, '<svg '), expected);
  assert.equal(count(card, '</svg>'), expected);

  const inner = FEST.replace(/^<svg[\s\S]*?>/, '').replace(/<\/svg>\s*$/, '');
  assert.equal(count(card, inner.trim()), 4);
});

/* Every <text> line, with the attributes the card gave it. */
const textLines = (card) =>
  [...card.matchAll(/<text\s([^>]*)>([^<]*)<\/text>/g)].map((match) => ({
    attrs: match[1],
    content: match[2],
    textLength: Number(/textLength="([\d.]+)"/.exec(match[1])?.[1] ?? 0),
    y: Number(/ y="([\d.]+)"/.exec(match[1])[1]),
    size: Number(/font-size="([\d.]+)"/.exec(match[1])[1]),
  }));

/* The paper's interior: inside the 24 inset and its 4-wide border. */
const INTERIOR = CARD_SIZE - 24 * 2 - 4;

test('a name too long for the paper is held inside it', () => {
  const long = 'Bartholomew Wolfeschlegelsteinhausenberger'.padEnd(60, 'x');
  assert.equal(long.length, 60);

  const cards = [
    stickerCardSvg({ name: long, sticker: { label: long, svg: FEST } }),
    bookCardSvg({ name: long, stickers: book(3), earned: 3, total: 22 }),
  ];

  for (const card of cards) {
    const held = textLines(card).filter((line) => line.textLength);
    assert.ok(held.length > 0, 'a 60-character name needs holding');
    for (const line of held) {
      assert.ok(line.textLength <= INTERIOR, String(line.textLength));
      assert.match(line.attrs, /lengthAdjust="spacingAndGlyphs"/);
    }
    /* Held or not, the name is still drawn whole, and still escaped. */
    assert.ok(card.includes(long));
  }

  /* The lines carrying the name are the ones that are held. */
  const bookLines = textLines(cards[1]).filter((line) =>
    line.content.includes(long),
  );
  assert.equal(bookLines.length, 1);
  assert.ok(bookLines[0].textLength > 0);
});

test('a name the paper has room for is left at its natural spacing', () => {
  const cards = [
    stickerCardSvg({
      name: 'Jacklyn',
      sticker: { label: 'Attend a Fest', svg: FEST },
      earnedAt: '3 October 2026',
    }),
    bookCardSvg({ name: 'Jacklyn', stickers: book(3), earned: 3, total: 22 }),
  ];
  for (const card of cards) {
    assert.ok(!card.includes('textLength'), card.slice(0, 200));
    assert.ok(!card.includes('lengthAdjust'));
  }
});

/* lib/shareImage paints the card through an <img>, which cannot see the
   page's webfonts, so it lifts the root's <text> lines off and the
   canvas draws them. A line nested inside a sticker would be left to the
   <img> and come out in Arial: so every word sits on the root, and the
   stickers draw theirs as outlines. */
test('every word on a card is a root-level line the canvas can draw', async () => {
  const depthAt = (card, index) => {
    const before = card.slice(0, index);
    return count(before, '<svg ') - count(before, '</svg>');
  };
  const cards = [
    stickerCardSvg({
      name: 'Jacklyn',
      sticker: { label: 'Attend a Fest', svg: FEST },
      earnedAt: '3 October 2026',
    }),
    bookCardSvg({ name: 'Jacklyn', stickers: book(3), earned: 3, total: 22 }),
  ];
  for (const card of cards) {
    const at = [...card.matchAll(/<text[\s>]/g)].map((match) => match.index);
    assert.ok(at.length >= 2, 'the card has words');
    for (const index of at) assert.equal(depthAt(card, index), 1);
  }

  const stickers = new URL('../public/stickers/', import.meta.url);
  const files = (await readdir(stickers)).filter((f) => f.endsWith('.svg'));
  assert.ok(files.length > 0);
  for (const file of files) {
    const svg = await readFile(new URL(file, stickers), 'utf8');
    assert.ok(!/<text[\s>]/.test(svg), `${file} has a <text>`);
  }
});

test('the fullest grid stays on the paper, clear of the stair and the edge', () => {
  const card = bookCardSvg({
    name: 'Jacklyn',
    stickers: book(30),
    earned: 30,
    total: 30,
  });
  const ys = [
    ...card.matchAll(
      new RegExp(`<svg x="[\\d.]+" y="([\\d.]+)" width="${inner(106)}"`, 'g'),
    ),
  ].map((match) => Number(match[1]));
  assert.equal(ys.length, 30);
  assert.ok(Math.min(...ys) > 400);
  assert.ok(Math.max(...ys) + inner(106) < CARD_SIZE - 40);
});

test('a smaller book draws its stickers bigger, at a scale that fills the paper', () => {
  /* Scales step down as the book fills, and every one fits the paper. */
  const sizes = GRID_SCALES.map((scale) => scale.size);
  assert.deepEqual(
    [...sizes].sort((a, b) => b - a),
    sizes,
  );
  for (const scale of GRID_SCALES) {
    const rows = Math.ceil(scale.upTo / scale.perRow);
    assert.ok(
      scale.perRow * scale.size + (scale.perRow - 1) * scale.gutter <= 980,
    );
    assert.ok(rows * scale.size + (rows - 1) * scale.gutter <= 610);
  }
  assert.equal(gridScale(3).size, 190);
  assert.equal(gridScale(30).size, 106);
  assert.equal(gridScale(99).size, 106);

  const three = bookCardSvg({
    name: 'J',
    stickers: book(3),
    earned: 3,
    total: 22,
  });
  const xs = gridXs(three, inner(190));
  assert.equal(xs.length, 3);
  /* One row, centred: the outer two sit the same distance in. */
  assert.equal(Math.round(xs[0] + inner(190) + xs[2]), CARD_SIZE);
  assert.equal(
    gridXs(
      bookCardSvg({ name: 'J', stickers: book(12), earned: 12, total: 22 }),
      inner(175),
    ).length,
    12,
  );
});

test('the book card draws the first thirty and no more', () => {
  const card = bookCardSvg({
    name: 'Jacklyn',
    stickers: book(35),
    earned: 35,
    total: 35,
  });
  assert.equal(gridXs(card, inner(106)).length, 30);
  assert.ok(card.includes('35 of 35 stickers'));
});

test('neither card reaches outside itself', () => {
  const cards = [
    stickerCardSvg({
      name: 'Jacklyn',
      sticker: { label: 'Attend a Fest', svg: FEST },
      earnedAt: '3 October 2026',
    }),
    bookCardSvg({ name: 'Jacklyn', stickers: book(20), earned: 20, total: 22 }),
  ];
  for (const card of cards) {
    assert.ok(!card.includes('href='));
    assert.ok(!card.includes('<image'));
    assert.ok(!/url\((?!#)/.test(card));
    assert.ok(!card.includes('@import'));
    assert.ok(!card.includes('http://www.w3.org/1999/xlink'));
  }
});
