/* The schedule lock: while this is true, /schedule shows its hero, its
   header and a padlocked "Coming soon" panel in place of the month's
   events (components/ScheduleDirectory/ComingSoon), and never fetches
   /api/schedule. The page stays open and linked; only the calendar waits.

   A switch, not a date, like STICKER_BOOK_LOCKED (data/stickerBookLock.mjs):
   the calendar appears when a deploy flips this to false.

   On for now (Jacklyn, 2026-09-28). */
export const SCHEDULE_LOCKED = true;
