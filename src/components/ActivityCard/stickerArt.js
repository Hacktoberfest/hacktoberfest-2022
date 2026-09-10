/* Placeholder stickers: one glyph per catalogue `art` key, drawn in
   currentColor on the type's colour, so a ground sets its glyph's colour
   too (ink on the light grounds, white on Global Hack Week's deep blue and
   the completion reward's forest). When the illustrated stickers exist
   they replace these — same keys, this one file — and the catalogue never
   changes. Each is a full SVG so a card needs no image request. */
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 };

export const ART = {
  play: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4v16l13-8z" fill="currentColor" />
    </svg>
  ),
  /* Global Hack Week's own mark is a lightning bolt (ghw.mlh.io), so its
     sticker is one too. */
  bolt: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2L4 14h6l-1 8 8-12h-6z" fill="currentColor" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
        fill="currentColor"
      />
    </svg>
  ),
  plug: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M8 3v5M16 3v5M6 8h12v4a6 6 0 0 1-12 0zM12 18v4" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M12 3c3 2 4.5 6 4.5 10l-2 2h-5l-2-2C7.5 9 9 5 12 3z" />
      <path d="M7.5 13L5 16l3 .5M16.5 13L19 16l-3 .5M10 15v4l2 2 2-2v-4" />
    </svg>
  ),
  playlist: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M4 6h11M4 11h11M4 16h7" />
      <path d="M15 14v6l5-3z" fill="currentColor" stroke="none" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M4 5h16v11H9l-5 4z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M10 14a4 4 0 0 0 5.6.4l3-3a4 4 0 0 0-5.6-5.6l-1.5 1.5" />
      <path d="M14 10a4 4 0 0 0-5.6-.4l-3 3a4 4 0 0 0 5.6 5.6l1.5-1.5" />
    </svg>
  ),
  medal: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="14" r="6" />
      <path d="M8.5 9L6 3h4l2 4 2-4h4l-2.5 6" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6" />
    </svg>
  ),
  screen: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3v18h2v-7h11l-3-4 3-4H7V3z" fill="currentColor" />
    </svg>
  ),
  blocks: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
      <rect x="8.5" y="4" width="7" height="7" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M4 20l4-1 11-11-3-3L5 16z" />
      <path d="M13 8l3 3" />
    </svg>
  ),
  gift: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="3" y="9" width="18" height="4" />
      <path d="M5 13v8h14v-8M12 9v12M12 9c-3 0-5-1.5-5-3.5S9 3 12 6c3-3 5-1 5-.5S15 9 12 9z" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  droplet: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5S5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.5 12 2.5z"
        fill="currentColor"
      />
    </svg>
  ),
  /* The two required stickers (data/eligibility.mjs REQUIRED_STICKERS):
     a key for signing in, an envelope for the address the pack goes to. */
  key: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M18 12v3M21 12v2" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  /* The two rewards on the sticker book's Rewards page (components/Album):
     the pack as a parcel, completion as a star. Drawn in currentColor
     rather than ink, since the completion sticker sits on forest. */
  parcel: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M3 8l9-4 9 4v9l-9 4-9-4z" />
      <path d="M3 8l9 4 9-4M12 12v9" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"
        fill="currentColor"
      />
    </svg>
  ),
};
