/* The inventory on /my, pure: what a participant has because of the
   stickers, as the API tells it (GET /api/me/items, `experience.items`),
   turned into what the locker draws. No I/O, no React, so node --test
   covers it (test/inventory.test.mjs).

   The API owns the catalogue and the copy: a thing's name, how it is
   earned, how it gets to you, its one call to action, and whether this
   participant has earned it. This file adds what only the frontend knows:
   the art by slug, the id the just-earned record keeps, the DEV exception,
   the grid, and which slot the locker opens on. Nothing is derived from
   the stickers here.

   A thing is one of two kinds, physical (a sticker, the pack, a T-shirt)
   or digital (a badge, a certificate), and it is earned or it is not.
   `sticker` says whether it is drawn as one: circles are for stickers.

   Relative imports, matching the rest of lib/: Node resolves this file
   directly and never sees jsconfig's baseUrl alias. */

/* There is no set number of slots: the locker holds whatever October
   put in it. This is only where the grid widens from five across to six,
   so a long inventory stays short. */
export const WIDE_AFTER = 10;

/* The art for each slug the API serves, by the files in public/stickers.
   A slug not here wears the generic art for its kind, so a new item shows
   up drawn before its own picture exists. */
const ITEM_ART = Object.freeze({
  'sticker-pack-2026': { art: 'reward-pack', sticker: false },
});

const GENERIC_ART = Object.freeze({
  physical: { art: 'reward-physical', sticker: false },
  digital: { art: 'reward-digital', sticker: false },
});

/* The id the just-earned record keeps for an item (lib/justEarned.mjs),
   prefixed so a sticker slug can never collide with one. */
export const itemNewId = (id) => `item:${id}`;

export const inventoryItems = (experience) => {
  const rows = Array.isArray(experience && experience.items)
    ? experience.items
    : [];
  const devLinked = Boolean(
    experience && experience.user && experience.user.devLinked,
  );
  return rows
    .filter((row) => row && typeof row.id === 'string' && row.id)
    .map((row) => {
      const kind = row.kind === 'digital' ? 'digital' : 'physical';
      const look = ITEM_ART[row.id] || GENERIC_ART[kind];
      const earned = row.earned === true;
      return {
        id: row.id,
        kind,
        art: look.art,
        sticker: look.sticker,
        earned,
        earnedAt:
          earned && typeof row.earnedAt === 'string' ? row.earnedAt : null,
        name: typeof row.name === 'string' ? row.name : row.id,
        earnedBy: typeof row.earnedBy === 'string' ? row.earnedBy : '',
        getsToYou: typeof row.getsToYou === 'string' ? row.getsToYou : '',
        cta:
          row.cta &&
          typeof row.cta.label === 'string' &&
          typeof row.cta.url === 'string'
            ? { label: row.cta.label, url: row.cta.url }
            : null,
        /* A thing that lives on a DEV profile, earned with no DEV account
           linked to MyMLH: the locker asks for the connection. No user at
           all reads as unlinked, as the welcome band reads it. */
        needsDev: row.requiresDevLink === true && !devLinked,
        newId: itemNewId(row.id),
      };
    });
};

/* The earned items' ids for the just-earned record. */
export const itemIds = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item && item.earned)
    .map((item) => item.newId);

/* The grid: five across, six past WIDE_AFTER things. The empties finish
   the row, so the page never ends ragged; while there is more to earn
   there is always at least one, so a full row opens a fresh one. They
   are room, not a count: no number of slots is ever promised. */
export const inventoryLayout = (count, { earnable = true } = {}) => {
  const n = Math.max(0, Number(count) || 0);
  const columns = n > WIDE_AFTER ? 6 : 5;
  const toRow = (columns - (n % columns)) % columns;
  return { columns, empties: earnable && toRow === 0 ? columns : toRow };
};

/* Which slot the locker opens on: the first thing earned since the
   participant last looked (lib/justEarned.mjs), else the newest earned
   thing by date, else the first thing there is to earn. Null for an empty
   catalogue. */
export const openingSlot = (items, justEarned) => {
  const all = Array.isArray(items) ? items : [];
  const fresh =
    justEarned instanceof Set ? justEarned : new Set(justEarned || []);
  const isNew = all.find((item) => item.newId && fresh.has(item.newId));
  if (isNew) return isNew.id;
  const dated = all
    .filter((item) => item.earned && item.earnedAt)
    .sort((a, b) => (a.earnedAt < b.earnedAt ? 1 : -1));
  if (dated.length > 0) return dated[0].id;
  const earned = all.find((item) => item.earned);
  if (earned) return earned.id;
  return all.length > 0 ? all[0].id : null;
};
