import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { BONUS_TYPE, TYPE_ORDER } from '../src/lib/activityFilters.mjs';
import { colors } from '../src/styles/tokens.js';

/* Every type wears one colour: the rule on its tab in the sticker book on
   /my (Album.module.css, through the Album's ACCENTS map), and the shadow
   and tag of its cards on /activities/ (ActivityCard.module.css). CSS
   Modules cannot import styles/tokens.js, so each sheet restates the
   value; this holds them to a rule per type, and Bonus to indigo. There
   is no component test harness, so the sheets and the map are read as
   text. */

const read = (path) =>
  readFile(new URL(`../src/components/${path}`, import.meta.url), 'utf8');

/* The declarations of every rule whose selector list holds `selector` on
   its own, comments dropped, the way test/schedule-button-colour.test.mjs
   reads a sheet. */
const declarationsFor = (css, selector) =>
  [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selectors]) =>
      selectors.split(',').some((entry) => entry.trim() === selector),
    )
    .map(([, , body]) => body);

/* A property's value in the first rule for `selector` that sets it. */
const valueOf = (css, selector, property) => {
  for (const body of declarationsFor(css, selector)) {
    const match = body.match(
      new RegExp(`(?:^|[;\\s])${property}\\s*:\\s*([^;]+)`),
    );
    if (match) return match[1].trim();
  }
  return null;
};

/* WCAG 2's contrast ratio between two #rrggbb colours. */
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((at) => {
    const c = parseInt(hex.slice(at, at + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
};

test('every page of the book has its tab colour, and Bonus is indigo', async () => {
  const source = await read('Album/index.js');
  const css = await read('Album/Album.module.css');
  ['required', ...TYPE_ORDER].forEach((type) => {
    assert.match(
      source,
      new RegExp(`\\b${type}: 'accent_${type}',`),
      `${type} has no accent in the Album's ACCENTS`,
    );
    assert.match(
      valueOf(css, `.accent_${type}`, '--tab-accent') || '',
      /^#[0-9a-f]{6}$/,
      `.accent_${type} sets no --tab-accent`,
    );
  });
  assert.equal(colors.indigo, '#2f3a8f');
  assert.equal(
    valueOf(css, `.accent_${BONUS_TYPE}`, '--tab-accent'),
    colors.indigo,
  );
});

test('every type has its card shadow and its tag on /activities/, and Bonus is indigo', async () => {
  const css = await read('ActivityCard/ActivityCard.module.css');
  TYPE_ORDER.forEach((type) => {
    assert.ok(
      valueOf(css, `.card.type_${type}`, '--card-accent'),
      `.card.type_${type} sets no shadow`,
    );
    assert.ok(
      valueOf(css, `.type.type_${type}`, 'background'),
      `.type.type_${type} sets no background`,
    );
    assert.ok(
      valueOf(css, `.type.type_${type}`, 'color'),
      `.type.type_${type} sets no color`,
    );
  });
  assert.equal(
    valueOf(css, `.card.type_${BONUS_TYPE}`, '--card-accent'),
    colors.indigo,
  );
  assert.equal(
    valueOf(css, `.type.type_${BONUS_TYPE}`, 'background'),
    colors.indigo,
  );
  /* The tag is small bold capitals, so its words need 4.5:1 on its
     ground. */
  const text = valueOf(css, `.type.type_${BONUS_TYPE}`, 'color');
  assert.equal(text, colors.white);
  assert.ok(contrast(text, colors.indigo) >= 4.5, `${text} on indigo`);
});
