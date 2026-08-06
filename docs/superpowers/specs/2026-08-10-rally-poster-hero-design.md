# Rally Poster Hero — Design

**Date:** 2026-08-10
**Status:** Approved (chosen from four rendered mockups via the visual
companion; selection: "B — Rally poster")

## Context

The current hero is a two-column split: copy on the left, a dark
"manifesto" poster panel (geometric SVG shapes, OCT 2026 stamp, "300+ hack
days" statement, 01/02/03 snapshot list) on the right. The product owner
finds it too dense, dislikes the right panel, and wants a different layout
structure — but likes the content itself (tagline, deck, single CTA,
partner chips) and the site's overall poster/color-block aesthetic.

## Design: single centered column ("rally poster")

Rework `src/components/Hero` into one centered stack inside the standard
Shell width (1280px cap), on the existing forest background with the
existing white bottom border. Top-to-bottom:

1. **Color-square accent** — four 14px squares (orange, sky, ochre, pink),
   centered. The only surviving nod to the poster geometry.
2. **Eyebrow** — `October 2026 · 300+ cities · In person and online`
   (existing mono style, pinkLight).
3. **Heading** — `Hacktoberfest 2026:` with `AI belongs to everyone.` as a
   sky-colored `em` on its own line. Centered, `text-wrap: balance`,
   max-width ~12ch, auto margins. Size stays in the current clamp range.
4. **Deck** — existing copy verbatim, centered, max-width ~56ch, auto
   margins.
5. **CTA** — single orange `Join Hacktoberfest` button → `TYPEFORM_URL`.
   The commented-out "What's a Hacktober Fest?" secondary button stays
   parked in its comment for when FestsSection returns.
6. **Note line** — `Build in person · Earn the 2026 shirt · Online from
anywhere`, centered.
7. **Partners** — the two labeled chip groups (Powered by DEV × MLH /
   Presenting partner DigitalOcean) in a centered horizontal row, wrapping
   on mobile. Chips and logos unchanged.

Vertical rhythm: generous padding (clamp ~80–130px block), no viewport
min-height — the hero is exactly as tall as its content.

## Removed

- `HeroManifesto`, `PosterGeometry` (all geometric SVG), `ManifestoInner`,
  `ManifestoTopline`, `ManifestoYear` (OCT 2026 stamp),
  `ManifestoStatement` ("300+ hack days" line), `ManifestoList`/`Item`/
  `ItemNumber`/`ItemLabel` (01/02/03 snapshot) — deleted from
  `Hero.styles.js` and `Hero/index.js`, including the `MANIFESTO_ITEMS`
  array and the now-unused `colors` import if nothing else needs it.
- The two-column `HeroGrid` (replaced by a centered Shell-based container)
  and the desktop `min-height: min(900px, calc(100vh - 82px))` rule.

## Kept

Forest background, white bottom border, all approved copy verbatim, the
single Typeform CTA, real partner logos (DevLogo, MlhLogo,
DigitalOceanLogo), current font stacks (Molde/Barlow display, Atkinson
mono), and current label weights/tracking from the readability pass.

## Cross-cutting

- `public/llms-full.txt`: in the Hero section, delete the `Snapshot: …`
  line (the 01/02/03 list and "300+ hack days" no longer render).
  Everything else already matches.
- No page-order, nav, or other-section changes.
- Verification: prettier check, dev-server render check (centered layout
  at desktop and 375px, no horizontal overflow, partner chips wrap
  cleanly), then commit.
