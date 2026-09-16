/* The placeholder glyphs as data: one entry per catalogue `art` key, the
   markup inside a 24-unit viewBox. Two readers: components/ActivityCard/
   stickerArt.js draws the React placeholders from it, and
   scripts/stickers/render.mjs writes public/stickers/<slug>.svg from it.
   When the illustrated stickers arrive they replace the files, not this. */
export const GLYPHS = Object.freeze({
  play: {
    inner: '<path d="M7 4v16l13-8z" fill="currentColor" />',
    stroke: false,
  },
  /* Global Hack Week's own mark is a lightning bolt (ghw.mlh.io), so its
     sticker is one too. */
  bolt: {
    inner: '<path d="M13 2L4 14h6l-1 8 8-12h-6z" fill="currentColor" />',
    stroke: false,
  },
  pin: {
    inner:
      '<path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" />',
    stroke: false,
  },
  plug: {
    inner: '<path d="M8 3v5M16 3v5M6 8h12v4a6 6 0 0 1-12 0zM12 18v4" />',
    stroke: true,
  },
  rocket: {
    inner:
      '<path d="M12 3c3 2 4.5 6 4.5 10l-2 2h-5l-2-2C7.5 9 9 5 12 3z" /><path d="M7.5 13L5 16l3 .5M16.5 13L19 16l-3 .5M10 15v4l2 2 2-2v-4" />',
    stroke: true,
  },
  playlist: {
    inner:
      '<path d="M4 6h11M4 11h11M4 16h7" /><path d="M15 14v6l5-3z" fill="currentColor" stroke="none" />',
    stroke: true,
  },
  chat: {
    inner: '<path d="M4 5h16v11H9l-5 4z" />',
    stroke: true,
  },
  link: {
    inner:
      '<path d="M10 14a4 4 0 0 0 5.6.4l3-3a4 4 0 0 0-5.6-5.6l-1.5 1.5" /><path d="M14 10a4 4 0 0 0-5.6-.4l-3 3a4 4 0 0 0 5.6 5.6l1.5-1.5" />',
    stroke: true,
  },
  medal: {
    inner:
      '<circle cx="12" cy="14" r="6" /><path d="M8.5 9L6 3h4l2 4 2-4h4l-2.5 6" />',
    stroke: true,
  },
  trophy: {
    inner:
      '<path d="M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6" />',
    stroke: true,
  },
  screen: {
    inner:
      '<rect x="3" y="4" width="18" height="12" rx="1" /><path d="M8 20h8M12 16v4" />',
    stroke: true,
  },
  flag: {
    inner: '<path d="M5 3v18h2v-7h11l-3-4 3-4H7V3z" fill="currentColor" />',
    stroke: false,
  },
  /* The DEV challenge stickers: a calendar page per week, a star for the
     launch weekend. Placeholders, as the rest are. */
  weekend: {
    inner:
      '<rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 9h18M8 3v4M16 3v4" /><path d="M12 11l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" fill="currentColor" stroke="none" />',
    stroke: true,
  },
  weekone: {
    inner:
      '<rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 9h18M8 3v4M16 3v4" /><text x="12" y="19" text-anchor="middle" font-size="9" font-weight="800" font-family="Barlow Semi Condensed, Helvetica, Arial, sans-serif" fill="currentColor" stroke="none">1</text>',
    stroke: true,
  },
  weektwo: {
    inner:
      '<rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 9h18M8 3v4M16 3v4" /><text x="12" y="19" text-anchor="middle" font-size="9" font-weight="800" font-family="Barlow Semi Condensed, Helvetica, Arial, sans-serif" fill="currentColor" stroke="none">2</text>',
    stroke: true,
  },
  weekthree: {
    inner:
      '<rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 9h18M8 3v4M16 3v4" /><text x="12" y="19" text-anchor="middle" font-size="9" font-weight="800" font-family="Barlow Semi Condensed, Helvetica, Arial, sans-serif" fill="currentColor" stroke="none">3</text>',
    stroke: true,
  },
  weekfour: {
    inner:
      '<rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 9h18M8 3v4M16 3v4" /><text x="12" y="19" text-anchor="middle" font-size="9" font-weight="800" font-family="Barlow Semi Condensed, Helvetica, Arial, sans-serif" fill="currentColor" stroke="none">4</text>',
    stroke: true,
  },
  gift: {
    inner:
      '<rect x="3" y="9" width="18" height="4" /><path d="M5 13v8h14v-8M12 9v12M12 9c-3 0-5-1.5-5-3.5S9 3 12 6c3-3 5-1 5-.5S15 9 12 9z" />',
    stroke: true,
  },
  target: {
    inner:
      '<circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" />',
    stroke: true,
  },
  droplet: {
    inner:
      '<path d="M12 2.5S5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.5 12 2.5z" fill="currentColor" />',
    stroke: false,
  },
  /* The two required stickers (data/eligibility.mjs REQUIRED_STICKERS):
     a key for signing in, an envelope for the address the pack goes to. */
  key: {
    inner:
      '<circle cx="8" cy="12" r="4" /><path d="M12 12h9M18 12v3M21 12v2" />',
    stroke: true,
  },
  mail: {
    inner:
      '<rect x="3" y="6" width="18" height="12" rx="1" /><path d="M3 7l9 6 9-6" />',
    stroke: true,
  },
  /* The two rewards on the sticker book's Rewards page (components/Album):
     the pack as a parcel, completion as a star. Drawn in currentColor
     rather than ink, since the completion sticker sits on forest. */
  /* The inventory's rewards (lib/stickerImage.mjs REWARD_STICKERS): the
     Fest T-shirt, and a certificate with its seal. */
  tee: {
    inner:
      '<path d="M8 3.5l4 2 4-2 5.5 3-2.2 4.3-2.3-1.1V21H7V9.7l-2.3 1.1L2.5 6.5z" />',
    stroke: true,
    round: true,
  },
  certificate: {
    inner:
      '<rect x="3" y="5" width="18" height="14" /><path d="M7 10h10M7 14h5" /><circle cx="16.5" cy="15" r="2" fill="currentColor" stroke="none" />',
    stroke: true,
    round: true,
  },
  parcel: {
    inner:
      '<path d="M3 8l9-4 9 4v9l-9 4-9-4z" /><path d="M3 8l9 4 9-4M12 12v9" />',
    stroke: true,
    round: true,
  },
  star: {
    inner:
      '<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" fill="currentColor" />',
    stroke: false,
  },
});

const STROKE = 'fill="none" stroke="currentColor" stroke-width="2"';
const ROUND = 'stroke-linejoin="round"';

export const glyphSvg = (key, { size = 24 } = {}) => {
  const glyph = GLYPHS[key];
  if (!glyph) return null;
  const attrs = [glyph.stroke ? STROKE : '', glyph.round ? ROUND : '']
    .filter(Boolean)
    .join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}"${attrs ? ` ${attrs}` : ''}>${glyph.inner}</svg>`;
};
