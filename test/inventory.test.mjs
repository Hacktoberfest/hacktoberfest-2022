import assert from 'node:assert/strict';
import test from 'node:test';

import { DEFAULT_SCENARIO, SCENARIOS } from '../src/data/fixtures.mjs';
import { progressLevel } from '../src/lib/eligibility.mjs';
import {
  CERTIFICATE_SLUGS,
  WIDE_AFTER,
  certificatePath,
  inventoryItems,
  inventoryLayout,
  itemAction,
  itemIds,
  itemMarks,
  nextThing,
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

test('a thing earned more than once is one entry per grant, keyed by its variant', () => {
  const cert = {
    ...PACK,
    id: 'fest-certificate-2026',
    kind: 'digital',
    cta: null,
    key: 'evt-1',
    variant: { title: 'Hack Day Toronto', date: '2026-10-18' },
    earnedAt: '2026-10-18T15:00:00.000Z',
  };
  const items = inventoryItems(
    experience([
      PACK,
      cert,
      {
        ...cert,
        key: 'evt-2',
        variant: { title: 'Hack Day London', date: '2026-10-25' },
      },
    ]),
  );
  assert.deepEqual(
    items.map((item) => item.slot),
    [
      'sticker-pack-2026',
      'fest-certificate-2026:evt-1',
      'fest-certificate-2026:evt-2',
    ],
  );
  assert.equal(items[0].key, '');
  assert.equal(items[0].variant, null);
  assert.deepEqual(items[1].variant, {
    title: 'Hack Day Toronto',
    date: '2026-10-18',
  });
  assert.equal(items[1].art, 'fest-certificate-2026');
  assert.equal(items[1].newId, 'item:fest-certificate-2026:evt-1');
  assert.equal(
    openingSlot(items, new Set(['item:fest-certificate-2026:evt-2'])),
    'fest-certificate-2026:evt-2',
  );
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

test('the three DEV badges wear their own art, drawn as themselves', () => {
  const slugs = [
    'dev-badge-fest-2026',
    'dev-badge-host-2026',
    'dev-badge-completionist-2026',
  ];
  const items = inventoryItems(
    experience(
      slugs.map((id) => ({
        ...PACK,
        id,
        kind: 'digital',
        cta: null,
        requiresDevLink: true,
      })),
    ),
  );
  assert.deepEqual(
    items.map((item) => [item.id, item.art, item.sticker, item.certificate]),
    slugs.map((id) => [id, id, false, false]),
  );
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

test('an earned DEV badge with no DEV account linked is Unclaimed: its tag, its "!", and Connect DEV as its button', () => {
  const badge = {
    ...PACK,
    id: 'dev-badge-fest-2026',
    kind: 'digital',
    cta: null,
    requiresDevLink: true,
  };
  const connect = {
    label: 'Connect DEV account',
    url: 'https://dev.to/settings/account',
  };
  const [unclaimed] = inventoryItems(experience([badge]));
  assert.deepEqual(itemMarks(unclaimed), {
    unclaimed: true,
    tag: 'unclaimed',
    tick: '!',
  });
  assert.deepEqual(itemAction(unclaimed, connect), connect);

  const [linked] = inventoryItems(experience([badge], { devLinked: true }));
  assert.deepEqual(itemMarks(linked), {
    unclaimed: false,
    tag: 'digital',
    tick: '✓',
  });
  assert.equal(itemAction(linked, connect), null, 'no button once linked');

  const [pack] = inventoryItems(experience([PACK]));
  assert.deepEqual(itemMarks(pack), {
    unclaimed: false,
    tag: 'physical',
    tick: '✓',
  });
  assert.deepEqual(itemAction(pack, connect), PACK.cta);
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

test('the grid always finishes its row and never shows fewer than two rows of cells', () => {
  assert.deepEqual(inventoryLayout(0), { columns: 5, empties: 10 });
  assert.deepEqual(inventoryLayout(1), { columns: 5, empties: 9 });
  /* The ghost alone: one row of room, not two. */
  assert.deepEqual(inventoryLayout(1, 1), { columns: 5, empties: 4 });
  assert.deepEqual(inventoryLayout(6, 1), { columns: 5, empties: 4 });
  assert.deepEqual(inventoryLayout(5), { columns: 5, empties: 5 });
  assert.deepEqual(inventoryLayout(7), { columns: 5, empties: 3 });
  assert.deepEqual(inventoryLayout(10), { columns: 5, empties: 0 });
});

test('past ten things the grid goes six across, still finishing the row', () => {
  assert.equal(WIDE_AFTER, 10);
  assert.deepEqual(inventoryLayout(11), { columns: 6, empties: 1 });
  assert.deepEqual(inventoryLayout(12), { columns: 6, empties: 0 });
  assert.deepEqual(inventoryLayout(13), { columns: 6, empties: 5 });
});

test('an empty locker ghosts the first thing to earn, in catalogue order', () => {
  const items = inventoryItems(
    experience([
      { ...PACK, earned: false },
      { ...PACK, id: 'holographic-sticker-2026', earned: false },
    ]),
  );
  assert.equal(nextThing(items).id, 'sticker-pack-2026');
  assert.equal(
    nextThing(inventoryItems(experience([{ ...PACK, earned: true }]))),
    null,
  );
  assert.equal(nextThing([]), null);
  assert.equal(nextThing(undefined), null);
});

test('the locker opens on what is new, else the newest earned thing, else nothing', () => {
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
  assert.equal(
    openingSlot(nothing, new Set()),
    null,
    'unearned things never open',
  );
  assert.equal(openingSlot([], new Set()), null);
});

test('the fixtures carry the real catalogue only: the pack, the holographic sticker, the Fest certificates where a Fest was attended or hosted, the Completionist certificate, and the three DEV badges', () => {
  const real = new Set([
    'sticker-pack-2026',
    'holographic-sticker-2026',
    'fest-certificate-2026',
    'fest-host-certificate-2026',
    'completionist-certificate-2026',
    'dev-badge-fest-2026',
    'dev-badge-host-2026',
    'dev-badge-completionist-2026',
  ]);
  for (const [name, scenario] of Object.entries(SCENARIOS)) {
    if (!Array.isArray(scenario.items)) continue;
    assert.ok(
      scenario.items.every((item) => real.has(item.id)),
      `${name} carries a placeholder item`,
    );
  }
  const cert = SCENARIOS.completionist.items.find(
    (item) => item.id === 'fest-certificate-2026',
  );
  assert.equal(cert.key, 'fest-london');
  assert.equal(cert.variant.title, 'Hacktober Fest London');
  const hosted = SCENARIOS.organizer.items.find(
    (item) => item.id === 'fest-host-certificate-2026',
  );
  assert.equal(hosted.earned, true);
  assert.equal(hosted.key, 'fest-london');
  assert.equal(SCENARIOS['nothing-done'].items[0].earned, false);
  assert.equal(SCENARIOS.eligible.items[0].earned, true);
  assert.equal(SCENARIOS.completionist.items[0].earned, true);
});

/* The API serves every item once, earned or not, the DEV badges last
   (sortOrder 40, 41, 42), and a badge is earned exactly when its rule
   is: the Attend sticker (`fest`), the Host sticker (`host-fest`),
   milestone 3. A fixture that broke this would show a badge the book on
   the same page disagrees with. */
test('every scenario serves the three DEV badges last, earned exactly by their rules', () => {
  const GETS_TO_YOU =
    'A badge on your DEV profile, added by DEV. Not linked to MyMLH yet? It’s added the moment you connect.';
  for (const [name, scenario] of Object.entries(SCENARIOS)) {
    if (!Array.isArray(scenario.items)) continue;
    const done = new Set(
      scenario.activities.filter((a) => a.completed).map((a) => a.id),
    );
    const badges = scenario.items.slice(-3);
    assert.deepEqual(
      badges.map((item) => [item.id, item.name, item.earnedBy, item.earned]),
      [
        [
          'dev-badge-fest-2026',
          'Fest Attendee DEV badge',
          'Attending a Fest',
          done.has('fest'),
        ],
        [
          'dev-badge-host-2026',
          'Fest Host DEV badge',
          'Hosting a Fest',
          done.has('host-fest'),
        ],
        [
          'dev-badge-completionist-2026',
          'Completionist DEV badge',
          'Seventeen stickers in the book',
          progressLevel(scenario) === 3,
        ],
      ],
      name,
    );
    badges.forEach((item) => {
      assert.equal(item.kind, 'digital', name);
      assert.equal(item.requiresDevLink, true, name);
      assert.equal(item.cta, null, name);
      assert.equal(item.getsToYou, GETS_TO_YOU, name);
      assert.equal(typeof item.earnedAt === 'string', item.earned, name);
    });
  }
});

/* The mocked build shows both states: linked badges, ordinary digital
   things, on completionist and organizer; an Unclaimed one on the
   default scenario, whose DEV account is not linked. */
test('the mocked build shows DEV badges linked and unclaimed', () => {
  const earnedBadges = (name) =>
    inventoryItems(SCENARIOS[name])
      .filter((item) => item.earned && item.id.startsWith('dev-badge-'))
      .map((item) => [item.id, item.needsDev]);
  assert.deepEqual(earnedBadges('completionist'), [
    ['dev-badge-fest-2026', false],
    ['dev-badge-host-2026', false],
    ['dev-badge-completionist-2026', false],
  ]);
  assert.deepEqual(earnedBadges('organizer'), [
    ['dev-badge-fest-2026', false],
    ['dev-badge-host-2026', false],
  ]);
  assert.equal(DEFAULT_SCENARIO, 'no-address');
  assert.deepEqual(earnedBadges(DEFAULT_SCENARIO), [
    ['dev-badge-fest-2026', true],
  ]);
});

test('a certificate is known by slug and downloads from the API by its key', () => {
  assert.ok(CERTIFICATE_SLUGS.has('fest-certificate-2026'));
  assert.ok(CERTIFICATE_SLUGS.has('completionist-certificate-2026'));
  assert.equal(
    certificatePath({ id: 'completionist-certificate-2026', key: '' }, 'pdf'),
    '/api/me/items/completionist-certificate-2026/certificate.pdf',
  );
  const [cert, pack] = inventoryItems(
    experience([
      {
        ...PACK,
        id: 'fest-certificate-2026',
        key: 'evt 1/2',
        variant: { title: 'T' },
      },
      PACK,
    ]),
  );
  assert.equal(cert.certificate, true);
  assert.equal(pack.certificate, false);
  assert.equal(
    certificatePath(cert, 'pdf'),
    '/api/me/items/fest-certificate-2026/evt%201%2F2/certificate.pdf',
  );
});

test('both Fest certificates are certificates, with a download path per grant', () => {
  assert.ok(CERTIFICATE_SLUGS.has('fest-certificate-2026'));
  assert.ok(CERTIFICATE_SLUGS.has('fest-host-certificate-2026'));
  assert.equal(
    certificatePath({ id: 'fest-host-certificate-2026', key: 'evt 1' }, 'pdf'),
    '/api/me/items/fest-host-certificate-2026/evt%201/certificate.pdf',
  );
});
