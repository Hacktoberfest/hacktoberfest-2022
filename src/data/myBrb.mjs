/* BRB mode: while this is true, every /my page (/my/, /my/hosting/,
   /my/fest/ and /my/promos/) is one "be right back" screen
   (components/MyBrb) in place of the page. Nothing runs behind it: no
   sign-in check, no fetch to the API, and the exported HTML is the screen
   itself, the same for everyone.

   A switch, not a date, like STICKER_BOOK_LOCKED (data/stickerBookLock.mjs):
   /my comes back when a deploy flips this to false.

   On from 2026-10-21; lifted 2026-10-22 (Jacklyn). */
export const MY_BRB = false;
