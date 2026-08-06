# 2026 Blank Slate: Strip 2025 Content

## Purpose

The 2025 Hacktoberfest website content needs to be removed from this repo so
the team can design and build the 2026 site fresh. The site must continue to
build and deploy exactly as it does today — no dependency, config, script, or
CI/CD changes — just content removed and pages reduced to a minimal, buildable
placeholder state.

## Scope decisions

Two scope questions were resolved during design:

1. **Strip depth: bare Next.js starter.** Remove all custom components, hooks,
   theme/typography tokens, lib data, and assets — not just page copy. Pages
   become plain React components with no shared chrome (no Header/Footer/
   Layout). This is a deeper strip than "keep the design system," chosen so
   the 2026 build starts from a genuinely blank UI, not last year's design
   system.
2. **Routes: only `/` and 404.** `about.js` and `events.js` are deleted
   entirely, not kept as empty placeholder pages. The sitemap generator is
   updated to list only `/`.

   Known consequence: `.do/deploy.template.yaml` has ingress redirects
   pointing at `/events/#organizers`, `/events/#brand`, `/about/#lore`,
   `/about/#love`, `/about/#sponsors`, `/about/#rewards` (from `/organizers`,
   `/brand`, `/lore`, `/love`, `/sponsors`, `/rewards`). Once `/about` and
   `/events` no longer exist, these redirects will point at pages that 404.
   Per the "don't touch deployment logic" constraint, `.do/deploy.template.yaml`
   is explicitly out of scope for this pass — this is flagged, not fixed here.

## What stays completely untouched (deploy-critical)

Nothing in this list is modified, including file contents, dependency
versions, or scripts:

- `next.config.js`
- `package.json`, `package-lock.json` (including now-unused dependencies:
  `styled-components`, `html-react-parser`, `markdown-it`, `country-list` —
  removing them is a future decision, not part of this pass)
- `.do/deploy.template.yaml`
- `.github/workflows/*` (`ci.yml`, `deps.yml`, `deps.sh`)
- `Makefile`, `.nvmrc`, `.husky/*`, `.editorconfig`, `.prettierrc`,
  `.lintstagedrc`, `jsconfig.json`
- `src/build/index.mjs`, `src/build/robots.mjs`, `src/build/post/index.mjs`,
  `src/build/post/cache.mjs` — the pre-build/post-build mechanism itself
  (only the route _data_ inside `sitemap.mjs` changes, see below)
- `public/.well-known/security.txt`, `public/health`, `public/.gitignore`
- `src/pages/_document.js` — pure document shell plus styled-components SSR
  wiring; contains no page content, left alone to avoid touching anything
  build/render-related
- `LICENSE.md`, `SECURITY.md`

## What gets deleted entirely

- `src/pages/about.js`, `src/pages/events.js`
- `src/lib/*` — all 8 files (`about.js`, `config.js`, `createMetaTitle.js`,
  `events.js`, `format.js`, `index.js`, `sammy.js`, `sponsors.js`)
- `src/hooks/*` (`useCountdown.js`, `useMarketo.js`)
- `src/components/*` — all ~40 components, including the `icons/flags/`
  directory (250+ country flag icons)
- `src/themes/*` (`breakpoints.js`, `themes.js`, `typography.js`)
- `src/styles/*` (`sharedStyles.js`)
- `src/assets/*` — all images, the hero video/`.mov`, brand kit PDFs/zip
- 2025-specific public media: `logo-hacktoberfest-12--hero.png`,
  `logo-hacktoberfest-12--hero.mov`, `logo-hacktoberfest-12--hero.webm`,
  `2logo-hacktoberfest-12--hero.webm`, `2026.txt`

## What gets minimally rewritten

Only changed where required to keep `npm run build` passing, or to reflect
the reduced route list:

- **`src/pages/index.js`** — replaced with a bare placeholder page: plain
  functional component, no imports from `components/`, `lib/`, or `hooks/`.
- **`src/pages/404.js`** — replaced with a bare placeholder not-found page,
  same constraints.
- **`src/pages/_app.js`** — stripped to a minimal `<Head>` (charset, viewport,
  a generic "Hacktoberfest" title) with the `Header`/`Footer`/`Theme`/
  `GlobalStyle` imports, the `sammy` console-log easter egg, and the
  `opengraph`/`favicon` asset imports removed, since those modules will no
  longer exist. No new assets are introduced to replace them (e.g. no new
  favicon is added) — the `<link rel="icon">` tag is simply removed.
- **`src/build/sitemap.mjs`** — the hardcoded `urls` array is trimmed from
  three entries (`/`, `/events`, `/about`) to just `/`. No other logic in
  this file changes.
- **`README.md`** — the "Configuration" section is updated, since it
  currently documents `src/lib/config.js` and home/events/about page
  behavior, none of which will exist. Documentation-only change.

## Error handling

Not applicable — this is a deletion/reduction task with no new runtime logic.
The only failure mode to guard against is a broken build (e.g. a dangling
import to a deleted file), which is caught by the verification step below.

## Verification plan

Before considering this done:

1. `npm run build` — runs the full pipeline (`build:custom` pre-build script
   → `next build` static export → confirms output still generates into
   `out/`) with no errors.
2. `npm test` — runs `prettier --check --ignore-unknown .`, matching what CI
   (`ci.yml`) runs, to confirm formatting passes.
3. Manual scan: confirm no remaining file under `src/` imports from a deleted
   path (`components/`, `hooks/`, `lib/`, `themes/`, `styles/`, `assets/`).

## Out of scope

- Any change to `.do/deploy.template.yaml`, including the now-dangling
  ingress redirects to `/about` and `/events` anchors.
- Removing now-unused npm dependencies from `package.json`.
- Designing or building any 2026 content, components, or pages — this spec
  covers only the removal/reduction step.
