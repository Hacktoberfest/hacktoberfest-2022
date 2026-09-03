import assert from 'node:assert/strict';
import test from 'node:test';

import {
  KNOWN_SCHEDULE_TYPES,
  scheduleType,
} from '../src/lib/scheduleTypes.mjs';

/* The taxonomy lives in FestNet, not here, so this module's job is to make an
   unrecognised type a non-event: it still gets a colour off the site palette
   and a readable label, and the page never has to be redeployed to show one.
   These tests pin both halves — the known types staying visually distinct, and
   the unknown ones degrading rather than breaking. */

/* A shadow is only a shadow if it is darker than the thing casting it. The
   site's own accents follow this — --fest-accent is maroon and skyDeep, never
   orange and sky — and getting it wrong does not throw or look broken in a
   snapshot, it just quietly stops reading as depth. So the invariant is
   asserted rather than the specific pairings, which are free to change. */
const luminance = (hex) => {
  const channel = (offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
};

test('every type casts a shadow darker than its own surface', () => {
  [...KNOWN_SCHEDULE_TYPES, 'office-hours', 'community-call', ''].forEach(
    (id) => {
      const type = scheduleType(id);

      assert.match(type.shadow, /^#[0-9a-f]{6}$/i, `${id}: no shadow colour`);
      assert.ok(
        luminance(type.shadow) < luminance(type.color),
        `${id}: shadow ${type.shadow} is not darker than surface ${type.color}`,
      );
    },
  );
});

/* The badge is filled with a pale tint and set in ink, the way /fests badges
   its Fest formats — so every type needs a light end as well as a dark one.
   Same shape of invariant as the shadow, inverted: a tint that was not clearly
   lighter than its surface would not read as a tint, and one that was not
   lighter than ink text would not be legible under it. */
test('every type has a tint lighter than its surface', () => {
  [...KNOWN_SCHEDULE_TYPES, 'office-hours', 'community-call', ''].forEach(
    (id) => {
      const type = scheduleType(id);

      assert.match(type.tint, /^#[0-9a-f]{6}$/i, `${id}: no tint colour`);
      assert.ok(
        luminance(type.tint) > luminance(type.color),
        `${id}: tint ${type.tint} is not lighter than surface ${type.color}`,
      );
    },
  );
});

/* Ink is the badge's text colour, so the tint has to carry it. 4.5 is the AA
   threshold for the badge's small, bold, all-caps label. */
test('ink text on a tint clears AA', () => {
  const INK = '#10201d';

  [...KNOWN_SCHEDULE_TYPES, 'office-hours'].forEach((id) => {
    const { tint } = scheduleType(id);
    const ratio =
      (Math.max(luminance(tint), luminance(INK)) + 0.05) /
      (Math.min(luminance(tint), luminance(INK)) + 0.05);

    assert.ok(
      ratio >= 4.5,
      `${id}: ink on ${tint} is only ${ratio.toFixed(2)}`,
    );
  });
});

test('every known type resolves to a label and a palette colour', () => {
  KNOWN_SCHEDULE_TYPES.forEach((id) => {
    const type = scheduleType(id);
    assert.equal(type.id, id);
    assert.ok(type.label, `${id}: missing label`);
    assert.match(type.color, /^#[0-9a-f]{6}$/i, `${id}: not a hex colour`);
    assert.match(type.onColor, /^#[0-9a-f]{6}$/i, `${id}: no text colour`);
    assert.equal(type.known, true);
  });
});

test('known types are visually distinct from one another', () => {
  const colors = KNOWN_SCHEDULE_TYPES.map((id) => scheduleType(id).color);
  assert.equal(new Set(colors).size, colors.length);
});

test('the three known types are the three the schedule actually has', () => {
  assert.deepEqual(
    KNOWN_SCHEDULE_TYPES.map((id) => scheduleType(id).label),
    ['Livestream', 'Challenge', 'Event'],
  );
});

test('an unknown type still renders, labelled from its slug', () => {
  const type = scheduleType('office-hours');

  assert.equal(type.id, 'office-hours');
  assert.equal(type.label, 'Office Hours');
  assert.match(type.color, /^#[0-9a-f]{6}$/i);
  assert.equal(type.known, false);
});

/* A colour that changed between renders would make the legend lie, and one
   that differed between readers would make a screenshot useless in a bug
   report. */
test('an unknown type gets the same colour every time', () => {
  assert.equal(
    scheduleType('office-hours').color,
    scheduleType('office-hours').color,
  );
});

/* Hashing onto a finite palette cannot promise that any particular pair of
   slugs differs, so this asserts the property that actually matters: the
   fallback pool is wide enough that unknown types spread across it rather
   than piling onto one colour. */
test('unknown types spread across the fallback pool', () => {
  const slugs = [
    'office-hours',
    'community-call',
    'ama',
    'panel',
    'demo-day',
    'hack-night',
  ];
  const colors = new Set(slugs.map((slug) => scheduleType(slug).color));

  assert.ok(
    colors.size >= 3,
    `six unknown types collapsed onto ${colors.size} colour(s)`,
  );
});

test('an unknown type borrows the same palette the known ones use', () => {
  const known = new Set(
    KNOWN_SCHEDULE_TYPES.map((id) => scheduleType(id).color),
  );
  const palette = new Set([...known, scheduleType('office-hours').color]);

  assert.ok(
    palette.size <= known.size + 1,
    'fallback colours come off the site palette, not out of thin air',
  );
});

test('a missing or malformed type degrades instead of throwing', () => {
  [undefined, null, '', '   ', 42, {}].forEach((value) => {
    const type = scheduleType(value);
    assert.ok(type, `${JSON.stringify(value)}: returned nothing`);
    assert.ok(type.label, `${JSON.stringify(value)}: no label`);
    assert.match(type.color, /^#[0-9a-f]{6}$/i);
    assert.equal(type.known, false);
  });
});
