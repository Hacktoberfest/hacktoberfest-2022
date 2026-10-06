import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SECRET_MARK_PATHS,
  SECRET_MARK_SVG,
  earnedSecretCount,
  secretArt,
  secretsFrom,
  stickerSvgFor,
  svgDataUri,
} from '../src/lib/secretStickers.mjs';
import { inlineSticker } from '../src/lib/shareCard.mjs';

/* The idea of a secret sticker, read off the progress payload. Nothing
   here is a real secret: the earned one is invented, its art a plain
   hexagon in the site's own sticker shape, and the revealer is a
   catalogue sticker picked for no reason but that it exists. */
const ART =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><path d="M100 0 L186.6 50 L186.6 150 L100 200 L13.4 150 L13.4 50 Z" fill="#1f4e6b"/></svg>';

const placeholder = (over = {}) => ({
  id: 'secret-1',
  secret: true,
  hint: 'A demo hint',
  revealedBy: 'ghw',
  required: false,
  completed: false,
  completedAt: null,
  source: null,
  ...over,
});

const earned = (over = {}) => ({
  id: 'demo-secret',
  secret: true,
  name: 'A demo secret',
  description: 'Invented for the test.',
  art: ART,
  revealedBy: 'ghw',
  required: false,
  completed: true,
  completedAt: '2026-10-14T12:00:00.000Z',
  source: 'manual',
  ...over,
});

test('a placeholder keeps its hint and nothing that could name it', () => {
  assert.deepEqual(
    secretsFrom([placeholder({ name: 'Leaked', art: ART, description: 'x' })]),
    [
      {
        id: 'secret-1',
        secret: true,
        completed: false,
        completedAt: null,
        source: null,
        revealedBy: 'ghw',
        name: null,
        description: null,
        art: null,
        hint: 'A demo hint',
      },
    ],
  );
});

test('an earned secret keeps its words, its art and when it was earned', () => {
  assert.deepEqual(secretsFrom([earned({ hint: 'stale' })]), [
    {
      id: 'demo-secret',
      secret: true,
      completed: true,
      completedAt: '2026-10-14T12:00:00.000Z',
      source: 'manual',
      revealedBy: 'ghw',
      name: 'A demo secret',
      description: 'Invented for the test.',
      art: ART,
      hint: null,
    },
  ]);
});

test('only entries flagged secret with a string id are kept, in payload order', () => {
  const kept = secretsFrom([
    earned({ id: 'demo-b' }),
    { id: 'fest', completed: true },
    placeholder({ id: 'secret-2' }),
    { secret: true, completed: true },
    { id: 7, secret: true },
    { id: 'demo-c', secret: 'yes' },
    null,
    'secret-3',
    earned({ id: 'demo-a' }),
  ]);
  assert.deepEqual(
    kept.map((secret) => secret.id),
    ['demo-b', 'secret-2', 'demo-a'],
  );
  assert.deepEqual(secretsFrom(null), []);
  assert.deepEqual(secretsFrom(undefined), []);
  assert.deepEqual(secretsFrom('nope'), []);
});

test('reading its own output changes nothing', () => {
  const once = secretsFrom([earned(), placeholder()]);
  assert.deepEqual(secretsFrom(once), once);
});

test('blank words are no words, and no revealer is null', () => {
  const [hintless] = secretsFrom([placeholder({ hint: '   ' })]);
  assert.equal(hintless.hint, null);
  const [unrevealed] = secretsFrom([placeholder({ revealedBy: undefined })]);
  assert.equal(unrevealed.revealedBy, null);
  const [bare] = secretsFrom([earned({ name: '', description: 42 })]);
  assert.equal(bare.name, null);
  assert.equal(bare.description, null);
});

test('art is kept only as a standalone 200-unit SVG', () => {
  assert.equal(secretArt(ART), ART);
  /* Whitespace and a designer's prolog around it are not the drawing. */
  assert.equal(secretArt(`\n  ${ART}\n`), ART);
  assert.equal(
    secretArt(`<?xml version="1.0"?>\n<!-- exported -->\n${ART}`),
    ART,
  );
  assert.equal(
    secretArt(
      `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n${ART}`,
    ),
    ART,
  );
  /* Single quotes and spaces round the viewBox's = are the same viewBox. */
  const spaced = ART.replace(
    'viewBox="0 0 200 200"',
    "viewBox = '0 0 200 200'",
  );
  assert.equal(secretArt(spaced), spaced);
  /* A root that does not name its namespace gets it, or no <img> draws it. */
  assert.equal(
    secretArt(ART.replace(' xmlns="http://www.w3.org/2000/svg"', '')),
    ART,
  );
  /* A prefixed namespace (xmlns:xlink) is not the default one, so the
     root still gets its own. */
  const xlinkOnly = ART.replace(
    ' xmlns="http://www.w3.org/2000/svg"',
    ' xmlns:xlink="http://www.w3.org/1999/xlink"',
  );
  assert.notEqual(xlinkOnly, ART);
  assert.equal(
    secretArt(xlinkOnly),
    `<svg xmlns="http://www.w3.org/2000/svg"${xlinkOnly.slice(4)}`,
  );
  for (const bad of [
    null,
    42,
    '',
    'not an svg',
    ART.replace('viewBox="0 0 200 200"', 'viewBox="0 0 24 24"'),
    ART.replace('</svg>', ''),
    `<svgx${ART.slice(4)}`,
    `<div>${ART}</div>`,
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"/>',
  ]) {
    assert.equal(secretArt(bad), null, String(bad));
  }
});

test('an earned secret with art that fails keeps its place, with no art', () => {
  const [kept] = secretsFrom([earned({ art: '<img src="x">' })]);
  assert.equal(kept.id, 'demo-secret');
  assert.equal(kept.completed, true);
  assert.equal(kept.art, null);
});

test('the earned count is the earned secrets, never a placeholder', () => {
  assert.equal(
    earnedSecretCount([
      earned(),
      placeholder(),
      earned({ id: 'demo-b', art: 'junk' }),
      { id: 'fest', completed: true },
    ]),
    2,
  );
  assert.equal(earnedSecretCount(null), 0);
});

test('the question mark is a sticker file by the site’s own rules', () => {
  assert.equal(secretArt(SECRET_MARK_SVG), SECRET_MARK_SVG);
  for (const d of SECRET_MARK_PATHS) {
    assert.ok(SECRET_MARK_SVG.includes(`<path d="${d}"/>`), d);
  }
  assert.doesNotMatch(SECRET_MARK_SVG, /href=/);
  /* Half the square, centred: the mark's 24-unit box drawn 100 units wide
     (100 / 24), 50 in from each side of the 200. */
  assert.ok(
    SECRET_MARK_SVG.includes('transform="translate(50 50) scale(4.1667)"'),
  );
  /* The share card takes it, and a secret's own art, as it takes a file. */
  assert.doesNotThrow(() =>
    inlineSticker(SECRET_MARK_SVG, { x: 0, y: 0, size: 100 }),
  );
  assert.doesNotThrow(() => inlineSticker(ART, { x: 0, y: 0, size: 100 }));
});

test('svgDataUri carries the SVG whole', () => {
  const prefix = 'data:image/svg+xml;charset=utf-8,';
  const uri = svgDataUri(ART);
  assert.ok(uri.startsWith(prefix));
  assert.equal(decodeURIComponent(uri.slice(prefix.length)), ART);
});

test('a share draws a secret from its own art, or the mark, and fetches every other sticker', async () => {
  const fetched = [];
  const fetchSvg = async (slug) => {
    fetched.push(slug);
    return `<svg id="${slug}"/>`;
  };
  assert.equal(
    await stickerSvgFor(
      { id: 'demo-secret', secret: true, art: ART },
      fetchSvg,
    ),
    ART,
  );
  assert.equal(
    await stickerSvgFor(
      { id: 'demo-secret', secret: true, art: null },
      fetchSvg,
    ),
    SECRET_MARK_SVG,
  );
  assert.equal(await stickerSvgFor({ id: 'ghw' }, fetchSvg), '<svg id="ghw"/>');
  assert.deepEqual(fetched, ['ghw']);
});
