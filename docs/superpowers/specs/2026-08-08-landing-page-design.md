# Hacktoberfest 2026 Landing Page

## Purpose

The `worktree-2026-blank-slate` branch currently has only a bare placeholder
homepage (`<h1>Hacktoberfest</h1>`) plus the MLH footer built in a prior
spec. This spec builds out the rest of the homepage from a static HTML/CSS
mockup the project owner supplied, ported into this repo's Next.js /
styled-components stack, with the mockup's placeholder color palette
replaced by the real brand colors extracted from an official logo asset
(a t-shirt design SVG).

Content (copy) is carried over verbatim from the mockup for now — the
project owner has said content and colors will both be refined further in
follow-up work. This spec locks in structure, styling mechanics, and a
color palette good enough to build against today.

## Source assets

Copied into this directory for a durable, versioned reference (the
project owner's own `~/Downloads` copies are not durable):

- [`mockup.html`](2026-08-08-landing-page-assets/mockup.html) — the
  complete original mockup (structure, copy, and the mockup's own
  placeholder CSS palette). This is the authoritative source for markup
  structure, copy text, and layout/responsive CSS mechanics.
- [`brand-logo-source.svg`](2026-08-08-landing-page-assets/brand-logo-source.svg)
  — the official logo asset the new color palette is extracted from.
- [`recolored-preview.html`](2026-08-08-landing-page-assets/recolored-preview.html)
  — the mockup with the approved v2 color palette applied (see "Color
  palette" below), reviewed and approved by the project owner via the
  brainstorming visual companion. This is the authoritative source for
  exact color values and which mockup elements changed color/background
  from the original.
- [`llms.txt`](2026-08-08-landing-page-assets/llms.txt) and
  [`llms-full.txt`](2026-08-08-landing-page-assets/llms-full.txt) — plain-text
  AI-agent-facing copies of the page content, referenced by the mockup's
  `<head>` and shipped as static files (see "Static assets" below).

## Scope decisions

1. **One page, anchor-linked sections — no new routes.** The mockup's nav
   links (`#new-era`, `#explore`, `#take-part`, `#join`) are in-page
   anchors, not separate URLs. `src/pages/index.js` becomes the entire
   built page; no other page files are added.
2. **The mockup's own `<footer class="site-footer">` is dropped
   entirely.** The existing MLH `<Footer />`, already rendered on every
   page via `_app.js`, remains the site's only footer. Nothing in this
   spec touches `src/components/Footer/` or the footer's rendering in
   `_app.js` beyond what's listed under "Global style additions" below.
3. **Content is ported verbatim from `mockup.html`**, including copy that
   reads as placeholder-ish ("Open source AI" theme, etc.) — this is
   explicitly not final and will be revisited in a follow-up pass.
4. **Decorative inline SVGs (`wordmark-mark`, `poster-geometry`) are kept
   as-is**, not replaced with artwork from `brand-logo-source.svg`. Only
   _colors_ are pulled from that file — the request was "the mockup's
   colours are wrong," not "replace the mockup's graphics." Both SVGs
   already reference the CSS custom properties being recolored (e.g.
   `.mark-sky { fill: var(--sky); }`), so recoloring the palette
   automatically recolors them — no SVG markup changes needed.
5. **Breakpoints standardized to 768px/1024px**, not the mockup's own
   780px/1040px. The Footer already established 768px/1024px as this
   site's breakpoints; the ~12–16px difference from the mockup's values is
   visually negligible, and one consistent pair of breakpoints across the
   whole site is worth more than preserving the mockup's arbitrary
   numbers.
6. **Mobile-first `min-width` media queries**, not the mockup's
   desktop-first `max-width` queries. Matches the Footer's existing
   convention. Every section's responsive behavior is otherwise ported
   faithfully from the mockup — only the query direction and exact
   breakpoint values change, not what happens at each width.

## Color palette

Extracted from `brand-logo-source.svg`'s seven fill colors (`#e53927`
red-orange, `#3d5f58` dark teal, `#8bb2de` light blue, `#f5b726` gold,
`#e97b77` salmon, `#fff` white, `#671912` dark maroon), with light/dark
tints derived where the mockup needed a variant the SVG doesn't have.
Structural/neutral colors (ink, paper tones) are unchanged from the
mockup, since those aren't brand colors — they're UI neutrals.

Reviewed by the project owner via two rounds of live-rendered preview
(the visual companion tool); two mockup color misapplications were caught
and fixed in the process (documented in `recolored-preview.html`, which is
the final approved state):

- The "Why this year" rally band changed from a full-bleed vivid orange
  background (felt "too much" as a large area) to the dark teal
  background, with orange kept only as an inline accent color.
- The four curriculum cards originally had three colors hardcoded directly
  in the mockup's CSS (`#58302c`, `#28627a`, `#7e4729` — not CSS custom
  properties, so the first recolor pass didn't touch them, and the project
  owner flagged them as "too brown and dull"). These are now derived from
  the real palette instead: maroon, and two new dark tints (`sky-deep`,
  `ochre-deep`) added specifically for this use.

Final token values (to become `src/styles/tokens.js`):

| Token         | Value     | Note                                               |
| ------------- | --------- | -------------------------------------------------- |
| `ink`         | `#10201d` | unchanged from mockup                              |
| `inkSoft`     | `#284b44` | unchanged from mockup                              |
| `muted`       | `#52635f` | unchanged from mockup                              |
| `paper`       | `#f2f2eb` | unchanged from mockup                              |
| `paperDeep`   | `#e4e5da` | unchanged from mockup                              |
| `white`       | `#f7f7f2` | unchanged from mockup                              |
| `rule`        | `#8ca59e` | unchanged from mockup                              |
| `forest`      | `#3d5f58` | from SVG (exact)                                   |
| `forestDeep`  | `#2e4742` | darkened `forest`                                  |
| `orange`      | `#e53927` | from SVG (exact)                                   |
| `orangeDeep`  | `#b8301f` | darkened `orange`                                  |
| `orangeLight` | `#f9c9c2` | lightened `orange`                                 |
| `pink`        | `#e97b77` | from SVG (exact; the SVG's salmon fills this role) |
| `pinkLight`   | `#f6c4c1` | lightened `pink`                                   |
| `sky`         | `#8bb2de` | from SVG (exact)                                   |
| `skyLight`    | `#d7e5f4` | lightened `sky`                                    |
| `skyDeep`     | `#1f4e6b` | new — darkened `sky`, for curriculum card 3        |
| `ochre`       | `#f5b726` | from SVG (exact)                                   |
| `ochreDeep`   | `#8a5d13` | new — darkened `ochre`, for curriculum card 4      |
| `maroon`      | `#671912` | from SVG (exact)                                   |

## Architecture

Nine new component folders under `src/components/`, following the exact
convention already established by `src/components/Footer/`
(`ComponentName/index.js` + `ComponentName/ComponentName.styles.js`):

- **`Header`** — skip-link, nav bar, wordmark logo + nav links + CTA
  button (mockup's `.site-header` + `.skip-link`)
- **`Hero`** — hero copy column + the manifesto poster panel (mockup's
  `.hero` section, including the `.poster-geometry` decorative SVG)
- **`Rally`** — the "Why this year" band (mockup's `.rally` section)
- **`EraSection`** — "What changes in 2026" (mockup's `.era` section, id
  `new-era`)
- **`CurriculumSection`** — "What you will work on" 4-card grid (mockup's
  `.curriculum` section, id `explore`)
- **`PathSection`** — "How to take part" 3-card grid (mockup's `.path`
  section, id `take-part`)
- **`DeclarationSection`** — "Know what is running in your stack" (mockup's
  `.declaration` section)
- **`JoinSection`** — closing CTA (mockup's `.join` section, id `join`)

`src/pages/index.js` renders `<Header />` followed by the eight section
components in mockup order, inside `<main id="main">`. `<Footer />`
continues to render from `_app.js` — `index.js` does not render it
directly.

**New shared file: `src/styles/tokens.js`** — plain JS module (not a
styled-components `ThemeProvider`/theme, just exported constants) holding
the color table above and the two breakpoint values
(`export const breakpoints = { tablet: '768px', desktop: '1024px' }`).
This is a deliberate, disclosed departure from the Footer's fully
self-contained pattern: the Footer only needed a handful of one-off
colors, but 8 components sharing ~19 color tokens and 2 breakpoints across
this many files would mean copy-pasting identical hex literals everywhere,
which is real duplication at this scale, not premature abstraction. Each
component's `.styles.js` file imports what it needs from `tokens.js`.

## Global style additions

Extending the existing `GlobalStyle` in `src/pages/_app.js` (added in the
Footer fix-batch) with three rules ported from the mockup's global CSS,
scoped to `html`/`body`/`a`/`::selection` — not new files, not a new theme
system:

- `html { scroll-behavior: smooth; }`
- The `body::after` fixed-position dot-grain texture overlay (a subtle
  `background-image` radial-gradient pattern at low opacity,
  `mix-blend-mode: multiply`, `pointer-events: none` — purely decorative,
  sits above all content at low opacity)
- `::selection { color: var(--ink); background: var(--pink); }` and the
  `:focus-visible` outline treatment, translated to the new color tokens

## Fonts

Add **Inter** (weights 400, 700, 800 — the mockup leans on 800 heavily for
headings) as a Google Fonts `<link>` in `src/pages/_document.js`,
alongside the existing Atkinson Hyperlegible Mono and Open Sans links.
This matches the precedent set when Open Sans was added for the Footer.
`--display` (`"Helvetica Neue", Helvetica, Arial, sans-serif`) and
`--wordmark` (`"Arial Narrow", "Helvetica Neue Condensed", "Roboto
Condensed", Impact, sans-serif`) stay as system-font stacks exactly as the
mockup wrote them — no webfont needed for those.

## Static assets

Copy `llms.txt` and `llms-full.txt` (from this spec's assets folder) into
`public/llms.txt` and `public/llms-full.txt` verbatim — their internal
relative links (`./`, `./#take-part`, `mailto:hi@mlh.io`) already resolve
correctly served from site root. The mockup's `<link rel="alternate"
type="text/plain" href="llms.txt">` / `href="llms-full.txt"` tags in
`<head>` are kept in `index.js`'s `<Head>`.

## Error handling

Not applicable — this is static markup and CSS with no data fetching, no
user input beyond standard anchor/mailto links, and no conditional
rendering paths.

## Verification plan

Same approach established for the Footer, since this repo has no JS unit
test framework (`npm test` is `prettier --check` only):

1. `npx prettier --check` on each new/changed file.
2. `npm run build` (static export) once components are wired into
   `index.js` — the real integration/compile check.
3. `grep` against the generated `out/index.html` for key content strings
   (section headings, all nav anchor hrefs, the `llms.txt` link tags) to
   confirm everything rendered.
4. Live browser comparison against `recolored-preview.html` at mobile
   (375px), tablet (768–900px), and desktop (1024px+) widths — layout,
   spacing, and color fidelity, plus specifically re-checking the two
   trouble spots from color review (the rally band, the curriculum cards)
   render as approved.

## Out of scope

- Final copy/content — flagged by the project owner as a follow-up pass.
- Further color refinement beyond the approved v2 palette — also flagged
  as a follow-up pass.
- Replacing the mockup's decorative SVG artwork with real brand graphics.
- Any change to the existing MLH Footer component or its wiring in
  `_app.js` beyond the `GlobalStyle` additions listed above.
- A shared styled-components `ThemeProvider`/theme system — `tokens.js` is
  plain constants, not a reintroduction of the deleted `themes/` system.
