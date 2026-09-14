import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  CARD_SIZE,
  bookCardSvg,
  escapeXml,
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
  assert.ok(inlined.includes('id="holo"'));
  assert.ok(inlined.includes('<circle cx="100" cy="100" r="100"'));
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
  assert.ok(card.includes('fill="#eeeee6"'));
  assert.ok(card.includes('fill="#671912"'));
  assert.ok(card.includes('stroke="#10201d" stroke-width="4"'));
  assert.ok(card.includes('Hacktoberfest 2026'));
  assert.ok(card.includes('hacktoberfest.com'));
  assert.ok(card.includes('Attend a Fest'));
  assert.ok(card.includes('Earned by Jacklyn'));
  assert.ok(card.includes('3 October 2026'));
  /* One sticker, drawn once, with its own markup nested whole. */
  assert.equal(count(card, '<svg '), 1 + count(FEST, '<svg '));
  assert.equal(gridXs(card, 520).length, 1);
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

test('the book card lays its stickers five to a row', () => {
  const stickers = book(12);
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

  const xs = gridXs(card, 150);
  assert.equal(xs.length, stickers.length);
  const firstRow = xs.slice(0, 5);
  assert.equal(new Set(firstRow).size, 5);
  assert.equal(xs[5], firstRow[0]);
  /* Even columns: the same gutter between every pair. */
  const gaps = firstRow.slice(1).map((x, i) => x - firstRow[i]);
  assert.deepEqual(new Set(gaps), new Set([180]));
  /* Centred as a block inside the 1080 square. */
  assert.equal(firstRow[0] + 150 + firstRow[4], CARD_SIZE);
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

test('the address line clears the fullest the grid can be', () => {
  const card = bookCardSvg({
    name: 'Jacklyn',
    stickers: book(20),
    earned: 20,
    total: 22,
  });
  const site = textLines(card).find((line) =>
    line.content.includes('hacktoberfest.com'),
  );
  const gridBottom = Math.max(
    ...[...card.matchAll(/<svg x="[\d.]+" y="([\d.]+)" width="150"/g)].map(
      (match) => Number(match[1]) + 150,
    ),
  );
  assert.ok(site.y - gridBottom >= 8, `${site.y} vs ${gridBottom}`);
  /* And the ink of the line, not only its baseline, sits clear. */
  assert.ok(site.y - site.size >= gridBottom, `${site.y - site.size}`);
});

test('the book card draws the first twenty and no more', () => {
  const card = bookCardSvg({
    name: 'Jacklyn',
    stickers: book(25),
    earned: 25,
    total: 25,
  });
  assert.equal(gridXs(card, 150).length, 20);
  assert.ok(card.includes('25 of 25 stickers'));
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
