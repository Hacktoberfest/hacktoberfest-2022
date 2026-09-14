import { GLYPHS } from 'data/stickerGlyphs.mjs';

const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 };
const ROUND = { strokeLinejoin: 'round' };

/* The same glyphs the sticker files are drawn from (data/stickerGlyphs.mjs),
   as React elements for the places that still draw a glyph inline: the
   world landings' mock cards. Stickers themselves are files now
   (lib/stickerImage.mjs). */
export const ART = Object.fromEntries(
  Object.entries(GLYPHS).map(([key, glyph]) => [
    key,
    <svg
      key={key}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...(glyph.stroke ? STROKE : {})}
      {...(glyph.round ? ROUND : {})}
      dangerouslySetInnerHTML={{ __html: glyph.inner }}
    />,
  ]),
);
