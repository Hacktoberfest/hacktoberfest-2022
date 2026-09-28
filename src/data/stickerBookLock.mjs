/* The sticker book lock: while this is true, /my shows the sticker book,
   the milestones and the rewards locker as closed until October 1st. Each
   band keeps its heading and intro over one padlocked panel
   (components/LockedBand), and the hero's line says when they open. The
   Fests band above them is untouched.

   A switch, not a date: the bands open when a deploy flips this to false,
   the way PREPTEMBER (data/preptember.mjs) closed September. Nothing about
   the page's data changes while it is on. The experience still loads in
   full; it just is not drawn, and nothing earned in the meantime is noted
   as seen (lib/justEarned.mjs), so the first two stickers still get their
   moment the first time the book opens.

   On for now (Jacklyn, 2026-09-28), until October 1st. */
export const STICKER_BOOK_LOCKED = true;
