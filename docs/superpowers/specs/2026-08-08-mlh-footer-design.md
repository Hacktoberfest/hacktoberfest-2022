# MLH Footer

## Purpose

This repository (`github.com/MLH/hacktoberfest-2026-frontend`) is owned by
the MLH GitHub organization. The 2026 site rebuild is happening on the
`worktree-2026-blank-slate` branch, which currently strips the site down to
a bare Next.js starter with no shared chrome (see
[2026-08-08-2026-blank-slate-design.md](2026-08-08-2026-blank-slate-design.md)).
This spec adds the first piece of shared UI back: a footer that matches
`mlh.com`'s real footer as closely as possible — same content, same links,
same visual structure — establishing it as the first component of the new
2026 design system.

Source content (exact SVGs, hrefs, colors, layout classes) was pulled by
directly inspecting the live DOM at `mlh.com` on 2026-08-08 and is recorded
in [2026-08-08-mlh-footer-assets.md](2026-08-08-mlh-footer-assets.md).

## Scope decisions

1. **Target branch: `worktree-2026-blank-slate`, not `main`.** `main` still
   has the full 2025 site with its own Footer component; that's untouched.
   This footer is built fresh against the blank-slate branch's bare
   `_app.js`/`index.js`.
2. **Content: MLH's actual content**, not Hacktoberfest-adapted placeholder
   content — real logo, real link columns/hrefs, real social accounts, real
   copyright. This repo is MLH's own property, so this is establishing MLH's
   brand identity on it, not impersonating an unrelated org.
3. **Light mode only.** `mlh.com` has a dark-mode variant, but the
   blank-slate branch has no theme system anywhere else yet. Building
   dark-mode styling for a single component with nothing else to coordinate
   with would be premature; skipped for this pass.
4. **Font: add Open Sans via Google Fonts.** The blank-slate branch's
   `_document.js` doesn't currently load `mlh.com`'s font stack (`"Inter
var", "Open Sans", Helvetica, Arial, sans-serif`). Rather than rendering
   in a fallback font that's visibly different from the reference, a
   `<link>` for Open Sans is added alongside the existing Atkinson
   Hyperlegible Mono font link already in `_document.js`.

## Architecture

New files, all on `worktree-2026-blank-slate`:

- **`src/components/Footer/index.js`** — the `Footer` component. Three
  sections in a single `<footer>`: (1) logo + tagline + social icon row,
  (2) a `<nav>` of four link columns, (3) a bottom bar with legal links and
  copyright.
- **`src/components/Footer/Footer.styles.js`** — `styled-components`
  definitions for the above. `styled-components` is already wired into this
  project (`next.config.js` has `compiler.styledComponents` enabled,
  `_document.js` does SSR style extraction), so this follows the existing
  build setup rather than introducing CSS Modules or a new styling
  mechanism.
- **`src/components/icons/MlhLogo.js`** — the MLH wordmark as an inline SVG
  React component (colored paths, from the assets doc), following the
  existing `src/components/icons/` convention on `main`.
- **`src/components/SocialIcons.js`** — named exports `InstagramIcon`,
  `DiscordIcon`, `TikTokIcon`, `LinkedInIcon`, `YouTubeIcon`, each a
  functional component rendering an inline SVG with `fill="currentColor"`
  and spreading `props` onto the `<svg>`. Matches the exact convention (and
  several of the exact icons) already used in `src/components/SocialIcons.js`
  on `main`.

`src/pages/_app.js` renders `<Footer />` after `<Component {...pageProps} />`,
matching where it was rendered in the old site.

`src/pages/_document.js` gets one additional `<link>` for the Open Sans
Google Font, added next to the existing Atkinson Hyperlegible Mono link.

## Component structure and data flow

`Footer` is a static component — no props, no client-side state, no data
fetching. All content (link columns, hrefs, tagline, social links) is
hardcoded directly in `index.js` as plain arrays/objects, since there's no
CMS or config source for this content yet (the old site's equivalent content
lived in `src/lib/config.js`, which was deleted in the blank-slate strip).
The one dynamic value is the copyright year, computed with
`new Date().getFullYear()` at render time rather than hardcoded to 2026, so
it doesn't silently go stale.

```
Footer
├── Brand block (logo link, tagline, social icon row)
├── Nav (4x LinkColumn: title + list of links)
└── Bottom bar (Privacy / Terms of Service links, copyright)
```

## Styling

Colors, font stack, and Tailwind-equivalent layout/spacing rules are
recorded exactly in the assets doc and translated to `styled-components`
during implementation (e.g. `md:grid md:auto-cols-max md:grid-flow-col
md:gap-8` becomes a `display: grid` rule gated behind a `768px` media
query). Breakpoints used (`768px`, `1024px`) are hardcoded numeric values in
`Footer.styles.js` — the blank-slate branch has no shared `breakpoints.js`
anymore (deleted in the strip), and adding one back is out of scope for a
single component.

Responsive behavior mirrors `mlh.com`:

- Below 768px: brand block (logo, tagline, socials) and all four link
  columns stack vertically, centered.
- 768px–1023px: the brand block and the four link columns become five
  `grid-auto-flow: column` items side by side (brand block leftmost); each
  link column's own links still stack vertically within it. Brand block
  content (logo/tagline/socials) stays centered within its column.
- 1024px and up: same five-column row layout, but the brand block's own
  internal content left-aligns instead of centering, and the bottom bar
  switches from stacked/centered to a row (legal links left, copyright
  right).

## Error handling

Not applicable. No data fetching, no user input, no conditional rendering
paths — this is static markup with hardcoded content.

## Verification plan

1. `npm run build` on `worktree-2026-blank-slate` — confirms the static
   export still succeeds with the new component and `_document.js` change.
2. `npm test` (`prettier --check`) — formatting passes.
3. Visual check in a browser at mobile (<768px), tablet (768–1023px), and
   desktop (≥1024px) widths, comparing side-by-side against `mlh.com`'s
   footer at the same widths.
4. Manual check that all 15 links (5 social + 13 column links + 2 legal)
   resolve to the exact hrefs recorded in the assets doc.

## Out of scope

- Dark mode.
- Any change to `main` branch or its existing (2025) Footer component.
- Reintroducing `breakpoints.js`, `themes.js`, or any other shared theme
  infrastructure deleted in the blank-slate strip — this footer is
  self-contained.
- Wiring real Hacktoberfest-specific content anywhere — this is MLH's own
  branding on MLH's own repo.
