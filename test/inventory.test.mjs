import assert from 'node:assert/strict';
import test from 'node:test';

import { SCENARIOS } from '../src/data/fixtures.mjs';
import {
  WIDE_AFTER,
  inventoryItems,
  inventoryLayout,
  itemIds,
  openingSlot,
} from '../src/lib/inventory.mjs';

/* The inventory's pure half. The API owns the catalogue and says what is
   earned (GET /api/me/items, `experience.items`); this file turns its rows
   into what the locker draws: the art by slug, the just-earned id, the
   DEV exception, the grid, and which slot opens. Nothing is derived from
   the stickers here any more. */

const PACK = {
  id: 'sticker-pack-2026',
  name: 'The 2026 sticker pack',
  kind: 'physical',
  earnedBy: 'Completing Milestone 1',
  getsToYou:
    'Mailed to the address on your MyMLH account after Hacktoberfest. Please allow 8-12 weeks for shipping.',
  cta: {
    label: 'Update shipping address',
    url: 'https://www.mlh.com/account/settings#addresses',
  },
  requiresDevLink: false,
  earned: true,
  earnedAt: '2026-10-05T12:00:00.000Z',
};

const experience = (items, user = { devLinked: false }) => ({ items, user });
const byId = (items, id) => items.find((item) => item.id === id);

test('an item is the API row plus its art, and its copy passes through untouched', () => {
  const [pack] = inventoryItems(experience([PACK]));
  assert.equal(pack.id, 'sticker-pack-2026');
  assert.equal(pack.kind, 'physical');
  assert.equal(pack.art, 'reward-pack');
  assert.equal(pack.sticker, false);
  assert.equal(pack.earned, true);
  assert.equal(pack.earnedAt, '2026-10-05T12:00:00.000Z');
  assert.equal(pack.name, PACK.name);
  assert.equal(pack.earnedBy, PACK.earnedBy);
  assert.equal(pack.getsToYou, PACK.getsToYou);
  assert.deepEqual(pack.cta, PACK.cta);
  assert.equal(pack.newId, 'item:sticker-pack-2026');
  assert.equal(pack.needsDev, false);
});

test('an unearned item is still in the list, unearned', () => {
  const [pack] = inventoryItems(
    experience([{ ...PACK, earned: false, earnedAt: null }]),
  );
  assert.equal(pack.earned, false);
  assert.equal(pack.earnedAt, null);
});

test('a slug the frontend has no art for gets the generic art for its kind', () => {
  const items = inventoryItems(
    experience([
      { ...PACK, id: 'tee-2027', kind: 'physical' },
      { ...PACK, id: 'badge-2027', kind: 'digital' },
    ]),
  );
  assert.equal(byId(items, 'tee-2027').art, 'reward-physical');
  assert.equal(byId(items, 'badge-2027').art, 'reward-digital');
  assert.ok(items.every((item) => item.sticker === false));
});

test('a thing that lives on DEV asks for the connection while no DEV account is linked', () => {
  const badge = {
    ...PACK,
    id: 'badge',
    kind: 'digital',
    requiresDevLink: true,
  };
  assert.equal(inventoryItems(experience([badge]))[0].needsDev, true);
  assert.equal(
    inventoryItems(experience([badge], { devLinked: true }))[0].needsDev,
    false,
  );
  assert.equal(inventoryItems({ items: [badge] })[0].needsDev, true);
  assert.equal(inventoryItems(experience([PACK]))[0].needsDev, false);
});

test('the API order stands, and junk rows are dropped', () => {
  const items = inventoryItems(
    experience([
      { ...PACK, id: 'b' },
      null,
      { name: 'no id' },
      { ...PACK, id: 'a' },
    ]),
  );
  assert.deepEqual(
    items.map((item) => item.id),
    ['b', 'a'],
  );
  assert.deepEqual(inventoryItems({}), []);
  assert.deepEqual(inventoryItems(experience('nope')), []);
});

test('itemIds names the earned items for the just-earned record', () => {
  assert.deepEqual(
    itemIds(
      inventoryItems(
        experience([PACK, { ...PACK, id: 'x', earned: false, earnedAt: null }]),
      ),
    ),
    ['item:sticker-pack-2026'],
  );
});

test('the grid is five across, and while there is more to earn it always shows room: the row finished, or a fresh one', () => {
  assert.deepEqual(inventoryLayout(0, { earnable: true }), {
    columns: 5,
    empties: 5,
  });
  assert.deepEqual(inventoryLayout(3, { earnable: true }), {
    columns: 5,
    empties: 2,
  });
  assert.deepEqual(inventoryLayout(10, { earnable: true }), {
    columns: 5,
    empties: 5,
  });
});

test('past ten things the grid goes six across, and with nothing left to earn the row is finished but no fresh one opens', () => {
  assert.equal(WIDE_AFTER, 10);
  assert.deepEqual(inventoryLayout(12, { earnable: false }), {
    columns: 6,
    empties: 0,
  });
  assert.deepEqual(inventoryLayout(11, { earnable: true }), {
    columns: 6,
    empties: 1,
  });
  assert.deepEqual(inventoryLayout(7, { earnable: false }), {
    columns: 5,
    empties: 3,
  });
});

test('the locker opens on what is new, else the newest earned thing, else the first thing to earn', () => {
  const items = inventoryItems(
    experience([
      { ...PACK, id: 'old', earnedAt: '2026-10-02T00:00:00.000Z' },
      { ...PACK, id: 'new', earnedAt: '2026-10-09T00:00:00.000Z' },
      { ...PACK, id: 'later', earned: false, earnedAt: null },
    ]),
  );
  assert.equal(openingSlot(items, new Set(['item:old'])), 'old');
  assert.equal(openingSlot(items, new Set()), 'new');
  const nothing = inventoryItems(
    experience([{ ...PACK, id: 'first', earned: false, earnedAt: null }]),
  );
  assert.equal(openingSlot(nothing, new Set()), 'first');
  assert.equal(openingSlot([], new Set()), null);
});

test('the fixtures carry the real catalogue only: the pack, earned by scenario', () => {
  for (const [name, scenario] of Object.entries(SCENARIOS)) {
    if (!Array.isArray(scenario.items)) continue;
    assert.deepEqual(
      scenario.items.map((item) => item.id),
      ['sticker-pack-2026'],
      `${name} carries a placeholder item`,
    );
  }
  assert.equal(SCENARIOS['nothing-done'].items[0].earned, false);
  assert.equal(SCENARIOS.eligible.items[0].earned, true);
  assert.equal(SCENARIOS.completionist.items[0].earned, true);
});
