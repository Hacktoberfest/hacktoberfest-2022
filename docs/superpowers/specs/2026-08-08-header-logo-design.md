# Header Logo Swap

## Purpose

Replace the placeholder logo in `Header` (a small abstract mark + separate
"Hacktoberfest" text + "/ 2026" tag) with the real Hacktoberfest wordmark
the project owner supplied.

## Source asset

[`hacktoberfest-logo.svg`](2026-08-08-header-logo-assets/hacktoberfest-logo.svg)
— a single-color white logotype, `viewBox="0 0 1680 182"` (~9.23:1 aspect
ratio), already rendering the word "HACKTOBERFEST" as vector artwork.
Solid white, so no recoloring needed against the header's dark teal
background.

## Scope decision

Per the project owner: drop the "/ 2026" year tag entirely — the header
shows only the new logo image, nothing else.

## Change

- New file `src/components/icons/HacktoberfestLogo.js` — default export
  `HacktoberfestLogo`, an inline SVG component (same pattern as the
  existing `MlhLogo.js`), spreading `props` onto the root `<svg>`,
  `aria-hidden="true"` (the wrapping link already carries the accessible
  name).
- `src/components/Header/index.js` — remove `WordmarkMark`, `WordmarkName`,
  `WordmarkYear` usage; render `<HacktoberfestLogo>` inside `Wordmark`
  instead.
- `src/components/Header/Header.styles.js` — remove the now-unused
  `WordmarkMark`/`WordmarkName`/`WordmarkYear` styled-components; add a
  `Logo` styled wrapper (or size `HacktoberfestLogo` directly) at
  `height: 28px` (mobile) / `height: 36px` (tablet+, `min-width: 768px`),
  `width: auto` to preserve the source aspect ratio.

## Out of scope

- Any other use of this logo elsewhere on the site (favicon, footer, etc.)
  — not requested.
- Re-coloring or otherwise modifying the SVG artwork.
