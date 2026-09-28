/* The inventory on /my, pure: what a participant has because of the
   stickers, as the API tells it (GET /api/me/items, `experience.items`),
   turned into what the locker draws. No I/O, no React, so node --test
   covers it (test/inventory.test.mjs).

   The API owns the catalogue and the copy: a thing's name, how it is
   earned, how it gets to you, its one call to action, and whether this
   participant has earned it; a thing earned more than once (a certificate
   per Fest) comes once per grant, with a key and a variant. This file adds
   what only the frontend knows:
   the art by slug, the id the just-earned record keeps, the DEV exception
   (Unclaimed, while no DEV account is linked), the grid, and which slot
   the locker opens on. Nothing is derived from
   the stickers here.

   A thing is one of two kinds, physical (a sticker, the pack, a T-shirt)
   or digital (a badge, a certificate), and it is earned or it is not.
   `sticker` says whether it is drawn as one: hexagons are for stickers.

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
  /* The bonus holographic sticker is a sticker, so the locker draws it as
     one: the milestone's own art, in the die-cut hexagon. */
  'holographic-sticker-2026': { art: 'milestone-complete', sticker: true },
  'fest-certificate-2026': { art: 'fest-certificate-2026', sticker: false },
  'fest-host-certificate-2026': {
    art: 'fest-host-certificate-2026',
    sticker: false,
  },
  'completionist-certificate-2026': {
    art: 'completionist-certificate-2026',
    sticker: false,
  },
  /* DEV's three badges, drawn as themselves: DEV's own art, redrawn by
     hand into the 200 square with room around it, so a leaning badge
     never reaches the name under its cell. No sticker script lists them
     (test/sticker-image.test.mjs says why). */
  'dev-badge-fest-2026': { art: 'dev-badge-fest-2026', sticker: false },
  'dev-badge-host-2026': { art: 'dev-badge-host-2026', sticker: false },
  'dev-badge-completionist-2026': {
    art: 'dev-badge-completionist-2026',
    sticker: false,
  },
});

/* The things the API renders as a certificate on request (GET
   /api/me/items/:slug/:key/certificate.pdf and .png): a download pair on
   the thing's page instead of a call to action. By slug, since the shape
   of a thing is the frontend's to know. */
export const CERTIFICATE_SLUGS = Object.freeze(
  new Set([
    'fest-certificate-2026',
    'fest-host-certificate-2026',
    'completionist-certificate-2026',
  ]),
);

/* A thing earned once has the empty key, which no path segment can carry,
   so its certificate is asked for without one. */
export const certificatePath = (item, format) =>
  item.key
    ? `/api/me/items/${encodeURIComponent(item.id)}/${encodeURIComponent(item.key)}/certificate.${format}`
    : `/api/me/items/${encodeURIComponent(item.id)}/certificate.${format}`;

const GENERIC_ART = Object.freeze({
  physical: { art: 'reward-physical', sticker: false },
  digital: { art: 'reward-digital', sticker: false },
});

/* A thing's slot: its slug, or for a thing earned more than once (a
   certificate per Fest) its slug and the grant's key, so every cell has an
   id of its own. */
export const slotId = (id, key) => (key ? `${id}:${key}` : id);

/* The id the just-earned record keeps for a slot (lib/justEarned.mjs),
   prefixed so a sticker slug can never collide with one. */
export const itemNewId = (slot) => `item:${slot}`;

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
      const key = typeof row.key === 'string' ? row.key : '';
      const slot = slotId(row.id, key);
      const variant =
        row.variant && typeof row.variant === 'object'
          ? {
              title:
                typeof row.variant.title === 'string' ? row.variant.title : '',
              date:
                typeof row.variant.date === 'string' ? row.variant.date : null,
            }
          : null;
      return {
        id: row.id,
        key,
        slot,
        variant,
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
        certificate: CERTIFICATE_SLUGS.has(row.id),
        newId: itemNewId(slot),
      };
    });
};

/* How an earned thing is marked. One on DEV with no DEV account linked
   (`needsDev`) is Unclaimed: MLH has asked DEV for it, and DEV adds it
   once the accounts are linked. It wears `unclaimed` where its kind would
   be (the tag's data-kind; the word, under its name and on its tag, is
   my.inventory.devUnlinked) and a "!" on its corner where the book's tick
   would be. Anything else wears its kind and the tick. */
export const itemMarks = (item) => ({
  unclaimed: item.needsDev,
  tag: item.needsDev ? 'unclaimed' : item.kind,
  tick: item.needsDev ? '!' : '✓',
});

/* A thing's one call to action on its page: while it is Unclaimed, the
   welcome band's Connect DEV account (`devConnect`, in the caller's
   words); otherwise the API's, or none. A linked DEV badge has none: the
   frontend does not know the participant's DEV username. */
export const itemAction = (item, devConnect) =>
  item.needsDev ? devConnect : item.cta;

/* What an empty locker shows as a ghost: the first thing not yet earned,
   in catalogue order, so the pack when nothing is. Null when there is
   nothing left to earn. */
export const nextThing = (items) =>
  (Array.isArray(items) ? items : []).find((item) => item && !item.earned) ||
  null;

/* The earned items' ids for the just-earned record. */
export const itemIds = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item && item.earned)
    .map((item) => item.newId);

/* The grid: five across, six past WIDE_AFTER things. The empties finish
   the row, so the page never ends ragged, and the grid is never shorter
   than MIN_ROWS rows, so an empty or nearly empty locker still reads as a
   locker. They are room, not a count: no number of slots is ever
   promised. */
export const MIN_ROWS = 2;

/* `minRows` is the room kept under what is there: two rows normally, one
   when the locker holds only its ghost, so an empty locker is not a
   field of blank cells. */
export const inventoryLayout = (count, minRows = MIN_ROWS) => {
  const n = Math.max(0, Number(count) || 0);
  const columns = n > WIDE_AFTER ? 6 : 5;
  const rows = Math.max(minRows, Math.ceil(n / columns));
  return { columns, empties: rows * columns - n };
};

/* Which slot the locker opens on: the first thing earned since the
   participant last looked (lib/justEarned.mjs), else the newest earned
   thing by date, else any earned thing. Null when nothing is earned: an
   unearned thing is not shown, so it cannot open. */
export const openingSlot = (items, justEarned) => {
  const all = (Array.isArray(items) ? items : []).filter(
    (item) => item && item.earned,
  );
  const fresh =
    justEarned instanceof Set ? justEarned : new Set(justEarned || []);
  const isNew = all.find((item) => item.newId && fresh.has(item.newId));
  if (isNew) return isNew.slot;
  const dated = all
    .filter((item) => item.earnedAt)
    .sort((a, b) => (a.earnedAt < b.earnedAt ? 1 : -1));
  if (dated.length > 0) return dated[0].slot;
  return all.length > 0 ? all[0].slot : null;
};
