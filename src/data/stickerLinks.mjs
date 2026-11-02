/* After Hacktoberfest the sticker book is a record, not a to-do list. The
   activities are over, and most of the pages a sticker's button led to
   are retired (data/retiredRoutes.mjs), so an unearned sticker shows its
   status and nothing to press. The one exception is the post-event
   survey, which only opened once October ended: it keeps its Take the
   survey button.

   components/Album StickerCell reads this. Bring a sticker's button or
   link back by adding its id. Earned stickers keep their Share button,
   which is not a link anywhere. */
export const LINKED_STICKERS = Object.freeze(['survey-post']);

export const stickerHasLink = (sticker) =>
  Boolean(sticker) && LINKED_STICKERS.includes(sticker.id);
