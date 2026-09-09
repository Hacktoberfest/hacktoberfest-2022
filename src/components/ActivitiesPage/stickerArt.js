/* Placeholder stickers: one glyph per catalogue `art` key, drawn in ink on
   the type's colour. When the illustrated stickers exist they replace
   these — same keys, this one file — and the catalogue never changes. Each
   is a full SVG so a card needs no image request. */
const stroke = { fill: 'none', stroke: '#10201d', strokeWidth: 2 };

export const ART = {
  play: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4v16l13-8z" fill="#10201d" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
        fill="#10201d"
      />
    </svg>
  ),
  plug: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M8 3v5M16 3v5M6 8h12v4a6 6 0 0 1-12 0zM12 18v4" />
    </svg>
  ),
};
