# MLH Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build MLH's real footer (logo, tagline, socials, 4 link columns, legal/copyright bar) as a new `Footer` component and wire it into every page of the `worktree-2026-blank-slate` branch, matching `mlh.com`'s footer as closely as possible.

**Architecture:** Two new icon modules (`MlhLogo`, `SocialIcons`) feed a self-contained `Footer` component (`Footer.styles.js` + `index.js`) built with `styled-components`, which is then imported into `_app.js` so it renders on every page. `_document.js` gets one additional font `<link>`.

**Tech Stack:** Next.js 15 (Pages Router, `output: 'export'` static export), React 19, `styled-components` v6 (already configured in `next.config.js` and `_document.js` — no new dependency).

## Global Constraints

- **Target branch:** all work happens in the worktree at
  `.claude/worktrees/2026-blank-slate`, on branch `worktree-2026-blank-slate`.
  Every command and commit in this plan runs with that directory as the
  working directory — never touch the `main` checkout.
- **Content is MLH's real content** (logo, hrefs, tagline, copyright) — this
  repo is owned by the MLH GitHub org. Do not substitute placeholder or
  Hacktoberfest-specific content. Exact source values are in
  `docs/superpowers/specs/2026-08-08-mlh-footer-assets.md` (read from the
  `main` checkout — it's not on the worktree branch).
- **Light mode only** — no dark-mode styles, no `prefers-color-scheme`
  logic.
- **No shared theme file** — `themes/breakpoints.js` and `themes/typography.js`
  were deleted in the blank-slate strip and are out of scope to reintroduce.
  Hardcode breakpoints as `768px` (tablet) and `1024px` (desktop) directly
  in `Footer.styles.js`.
- **No JS test framework exists in this repo** — `npm test` runs only
  `prettier --check --ignore-unknown .`. There is no Jest/Vitest/RTL setup,
  and adding one is out of scope. Verification in this plan uses: (a)
  `npx prettier --check <file>` to catch syntax errors in files not yet
  wired into any page (Next only compiles files that are actually
  imported by a page, so an orphaned file's syntax is otherwise
  unverified), and (b) once a file is wired up, `npm run build` followed by
  `grep` against the generated static HTML in `out/` as a real integration
  check, plus a live browser comparison against `mlh.com` in the final task.
- **Formatting:** `.prettierrc` sets `singleQuote: true`; this project's
  Prettier 3.x default `trailingComma` is `all` — every code sample in this
  plan already follows both.
- **Imports:** `jsconfig.json` sets `baseUrl: "./src"`, so absolute imports
  like `components/icons/MlhLogo` resolve without relative `../../` paths
  (matches the existing convention on `main`, e.g. `import Container from
'components/Container'`).
- **External links** (everything except the logo's `/` link) get
  `target="_blank" rel="noopener noreferrer"`.

---

### Task 1: Add the Open Sans web font to `_document.js`

**Files:**

- Modify: `src/pages/_document.js`

**Interfaces:**

- Consumes: nothing.
- Produces: the `Open Sans` font family becomes available globally (via a
  `<link>` in every page's `<head>`); later tasks' `styled-components` code
  references `font-family: "Open Sans", Helvetica, Arial, sans-serif;`.

- [ ] **Step 1: Add the font `<link>`**

Open `src/pages/_document.js` (in the worktree at
`.claude/worktrees/2026-blank-slate/src/pages/_document.js`). It currently
reads:

```jsx
<Head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:ital,wght@0,200..800;1,200..800&display=swap"
    rel="stylesheet"
  ></link>
</Head>
```

Replace it with:

```jsx
<Head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:ital,wght@0,200..800;1,200..800&display=swap"
    rel="stylesheet"
  ></link>
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
    rel="stylesheet"
  ></link>
</Head>
```

- [ ] **Step 2: Format-check the file**

Run:

```bash
cd .claude/worktrees/2026-blank-slate && npx prettier --check src/pages/_document.js
```

Expected: `All matched files use Prettier code style!`

If it reports a formatting mismatch, run
`npx prettier --write src/pages/_document.js` and re-check.

- [ ] **Step 3: Build and verify the link is present in every rendered page**

Run:

```bash
cd .claude/worktrees/2026-blank-slate && npm run build
```

Expected: build completes with no errors, ending in Next's normal export
summary.

Then:

```bash
cd .claude/worktrees/2026-blank-slate && grep -o 'fonts.googleapis.com/css2?family=Open+Sans[^"]*' out/index.html
```

Expected output: the Open Sans Google Fonts URL, e.g.
`fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap`

Run the same grep against `out/404.html` — same expected output, confirming
the font link is global (via `_document.js`, not a per-page `<Head>`).

- [ ] **Step 4: Commit**

```bash
cd .claude/worktrees/2026-blank-slate && git add src/pages/_document.js && git commit -m "Add Open Sans web font for the upcoming MLH footer"
```

---

### Task 2: Create the MLH logo and social icon components

**Files:**

- Create: `src/components/icons/MlhLogo.js`
- Create: `src/components/SocialIcons.js`

**Interfaces:**

- Consumes: nothing.
- Produces:

  - `src/components/icons/MlhLogo.js` — default export `MlhLogo`, a
    function component `(props) => <svg ...>` that spreads `props` onto the
    root `<svg>` element (so callers can pass `className`, etc.). Fixed
    `viewBox="0 0 310.59 130.78"`, fixed colored `fill` per path (not
    `currentColor` — the wordmark is multi-color, not themeable).
  - `src/components/SocialIcons.js` — five named exports, each a function
    component `(props) => <svg ...>` spreading `props` onto the root
    `<svg>`: `InstagramIcon`, `DiscordIcon`, `TikTokIcon`, `LinkedInIcon`,
    `YouTubeIcon`. Every one renders with `fill="currentColor"` so the
    footer can color them via CSS `color`.

- [ ] **Step 1: Write `src/components/icons/MlhLogo.js`**

```jsx
const MlhLogo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 310.59 130.78"
    {...props}
  >
    <title>MLH Logo</title>
    <g>
      <g>
        <g>
          <g>
            <path
              fill="#242425"
              d="M15.65,114.54a2.79,2.79,0,0,1,1.68,2.51v13.22a.45.45,0,0,1-.45.44H13.62a.39.39,0,0,1-.3-.12.47.47,0,0,1-.12-.32v-12H10.57v12a.45.45,0,0,1-.12.31.34.34,0,0,1-.3.13h-3a.44.44,0,0,1-.44-.44h0v-12H4.13v12a.39.39,0,0,1-.33.44H.45A.4.4,0,0,1,0,130.4V114.76a.39.39,0,0,1,.33-.44H14.57A2.52,2.52,0,0,1,15.65,114.54Z"
            />
            <path
              fill="#242425"
              d="M32,114.32A2.75,2.75,0,0,1,34.55,116a2.56,2.56,0,0,1,.23,1.06v13.22a.42.42,0,0,1-.42.44H31.08a.45.45,0,0,1-.45-.44h0v-4.2a.44.44,0,0,0-.11-.31.38.38,0,0,0-.31-.13H25.57a.45.45,0,0,0-.45.44h0v4.2a.38.38,0,0,1-.32.44H21.45a.38.38,0,0,1-.45-.32V117.06a2.75,2.75,0,0,1,.21-1.06,2.6,2.6,0,0,1,.59-.91,2.91,2.91,0,0,1,.91-.59,2.58,2.58,0,0,1,1.06-.22Zm-1.41,7.81V118h-5.5v4.12Z"
            />
            <path
              fill="#242425"
              d="M49.52,114.45a.37.37,0,0,1,.13.31V128a2.58,2.58,0,0,1-.22,1.06,3,3,0,0,1-.59.91,2.47,2.47,0,0,1-.9.59,2.8,2.8,0,0,1-1.07.21h-7a2.8,2.8,0,0,1-1.07-.21A2.74,2.74,0,0,1,37.12,128v-5a.4.4,0,0,1,.33-.45H40.8a.41.41,0,0,1,.45.33v3.47a.41.41,0,0,0,.12.31.46.46,0,0,0,.32.11h3.4a.44.44,0,0,0,.31-.11.38.38,0,0,0,.13-.31V114.76a.45.45,0,0,1,.12-.31.37.37,0,0,1,.31-.13h3.26A.39.39,0,0,1,49.52,114.45Z"
            />
            <path
              fill="#242425"
              d="M64.35,114.32a2.58,2.58,0,0,1,1.06.22A2.64,2.64,0,0,1,66.86,116a2.56,2.56,0,0,1,.23,1.06v10.89a2.64,2.64,0,0,1-.23,1.07,2.78,2.78,0,0,1-.58.9,2.51,2.51,0,0,1-.91.59,2.54,2.54,0,0,1-1.06.21H56.05A2.61,2.61,0,0,1,55,130.5a2.71,2.71,0,0,1-1.68-2.5V117.11a2.8,2.8,0,0,1,.21-1.07,2.45,2.45,0,0,1,.58-.9,2.91,2.91,0,0,1,.91-.59,2.55,2.55,0,0,1,1.06-.22Zm-1.41,4h-5.5v8.44H63Z"
            />
            <path
              fill="#242425"
              d="M85.06,130.35a.22.22,0,0,1,0,.27.27.27,0,0,1-.25.11H81.09a.7.7,0,0,1-.37-.11.75.75,0,0,1-.29-.27L78,125.9a.17.17,0,0,0-.17-.09H75a.1.1,0,0,0-.12.08,0,0,0,0,0,0,0v4.36a.38.38,0,0,1-.34.43H71.21a.39.39,0,0,1-.44-.32.24.24,0,0,1,0-.12V114.76a.38.38,0,0,1,.32-.44H81.81a2.62,2.62,0,0,1,1.06.22A2.78,2.78,0,0,1,84.32,116a2.58,2.58,0,0,1,.22,1.06v6.16a2.66,2.66,0,0,1-.53,1.61,2.58,2.58,0,0,1-1.35,1h-.07c-.11,0-.14.08-.08.14v0ZM80.4,118.14H74.75v4H80.4Z"
            />
            <path
              fill="#242425"
              d="M107.12,126.74a.39.39,0,0,1,.31.12.47.47,0,0,1,.12.32v3.1a.45.45,0,0,1-.12.31.37.37,0,0,1-.31.13H97a.4.4,0,0,1-.45-.32V114.76a.39.39,0,0,1,.33-.44h3.35a.39.39,0,0,1,.44.33.2.2,0,0,1,0,.11v11.56a.4.4,0,0,0,.13.31.47.47,0,0,0,.32.12Z"
            />
            <path
              fill="#242425"
              d="M122.28,114.45a.4.4,0,0,1,.13.31v2.95a.37.37,0,0,1-.13.31.45.45,0,0,1-.31.12h-7.86a.09.09,0,0,0-.11.08s0,0,0,0v2.55c0,.06,0,.09.11.09h6.7a.37.37,0,0,1,.3.13.45.45,0,0,1,.12.31v2.35a.45.45,0,0,1-.12.31.37.37,0,0,1-.3.13h-6.7a.1.1,0,0,0-.11.08,0,0,0,0,0,0,0v2.53a.09.09,0,0,0,.07.12H122a.44.44,0,0,1,.44.43v3a.43.43,0,0,1-.43.44H110.32a.4.4,0,0,1-.45-.32V114.76a.45.45,0,0,1,.45-.44H122A.42.42,0,0,1,122.28,114.45Z"
            />
            <path
              fill="#242425"
              d="M137.15,114.32a2.6,2.6,0,0,1,1.07.22,2.69,2.69,0,0,1,1.46,1.45,2.55,2.55,0,0,1,.22,1.06v13.22a.42.42,0,0,1-.42.44h-3.31a.44.44,0,0,1-.44-.44h0v-4.2a.45.45,0,0,0-.12-.31.37.37,0,0,0-.31-.13h-4.57a.45.45,0,0,0-.45.44h0v4.2a.39.39,0,0,1-.33.44H126.6a.38.38,0,0,1-.44-.32.24.24,0,0,1,0-.12V117.06a2.75,2.75,0,0,1,.21-1.06,2.6,2.6,0,0,1,.59-.91,2.91,2.91,0,0,1,.91-.59,2.55,2.55,0,0,1,1.06-.22Zm-1.4,7.81V118h-5.51v4.12Z"
            />
            <path
              fill="#242425"
              d="M157.2,121.9a.41.41,0,0,1,.12.32V128a2.58,2.58,0,0,1-.22,1.06,3.21,3.21,0,0,1-.58.91,2.6,2.6,0,0,1-.91.59,2.78,2.78,0,0,1-1.06.21h-8.3a2.73,2.73,0,0,1-2.74-2.74v-10.9a2.78,2.78,0,0,1,.21-1.06,2.44,2.44,0,0,1,.58-.91,3,3,0,0,1,.9-.59,2.81,2.81,0,0,1,1.07-.22H156a.45.45,0,0,1,.45.45h0v3.09a.45.45,0,0,1-.45.45h-7.85a.47.47,0,0,0-.32.12.44.44,0,0,0-.13.31v7.59a.42.42,0,0,0,.13.3.43.43,0,0,0,.32.12h4.64a.4.4,0,0,0,.42-.38v-4.14a.42.42,0,0,1,.42-.44h3.28A.43.43,0,0,1,157.2,121.9Z"
            />
            <path
              fill="#242425"
              d="M174.49,114.45a.44.44,0,0,1,.13.31V128a2.59,2.59,0,0,1-.23,1.06,3,3,0,0,1-.58.91,2.6,2.6,0,0,1-.91.59,2.8,2.8,0,0,1-1.07.21h-8.3a2.78,2.78,0,0,1-1.06-.21A2.75,2.75,0,0,1,161,129.1a2.8,2.8,0,0,1-.21-1.07V114.76a.39.39,0,0,1,.33-.44h3.35a.39.39,0,0,1,.44.33.2.2,0,0,1,0,.11v11.56a.4.4,0,0,0,.13.31.47.47,0,0,0,.32.12H170a.42.42,0,0,0,.3-.12.37.37,0,0,0,.12-.31V114.76a.45.45,0,0,1,.45-.44h3.26A.39.39,0,0,1,174.49,114.45Z"
            />
            <path
              fill="#242425"
              d="M190.73,114.45a.44.44,0,0,1,.13.31v2.95a.4.4,0,0,1-.13.31.47.47,0,0,1-.32.12h-7.85a.1.1,0,0,0-.12.08v2.59c0,.06,0,.09.12.09h6.7a.39.39,0,0,1,.3.13.45.45,0,0,1,.12.31v2.35a.45.45,0,0,1-.12.31.39.39,0,0,1-.3.13h-6.7a.11.11,0,0,0-.12.08v2.57a.1.1,0,0,0,.08.12h7.89a.45.45,0,0,1,.45.43v3a.44.44,0,0,1-.43.44H178.77a.39.39,0,0,1-.45-.32.24.24,0,0,1,0-.12V114.76a.45.45,0,0,1,.45-.44h11.64A.42.42,0,0,1,190.73,114.45Z"
            />
            <path
              fill="#242425"
              d="M215.88,114.32a.42.42,0,0,1,.44.42v15.54a.43.43,0,0,1-.43.44h-3.27a.45.45,0,0,1-.45-.44h0v-5.45a.4.4,0,0,0-.38-.42h-4.67a.45.45,0,0,0-.32.12.37.37,0,0,0-.13.31v5.45a.39.39,0,0,1-.33.44.21.21,0,0,1-.11,0H203a.39.39,0,0,1-.44-.33.2.2,0,0,1,0-.11V114.76a.39.39,0,0,1,.33-.44h3.35a.39.39,0,0,1,.44.33.2.2,0,0,1,0,.11V120a.39.39,0,0,0,.33.44h4.75a.39.39,0,0,0,.31-.12.47.47,0,0,0,.12-.32v-5.25a.45.45,0,0,1,.45-.44h3.25Z"
            />
            <path
              fill="#242425"
              d="M231.06,114.32a2.6,2.6,0,0,1,1.07.22,2.69,2.69,0,0,1,1.46,1.45,2.55,2.55,0,0,1,.22,1.06v13.22a.42.42,0,0,1-.42.44h-3.28a.44.44,0,0,1-.44-.44v-4.2a.45.45,0,0,0-.12-.31.37.37,0,0,0-.31-.13h-4.65a.44.44,0,0,0-.44.44h0v4.2a.39.39,0,0,1-.33.44h-3.35a.39.39,0,0,1-.45-.32V117.06a2.75,2.75,0,0,1,.21-1.06,2.6,2.6,0,0,1,.59-.91,3,3,0,0,1,.91-.59,2.62,2.62,0,0,1,1.06-.22Zm-1.4,7.81V118h-5.51v4.12Z"
            />
            <path
              fill="#242425"
              d="M241.68,118.42a.39.39,0,0,0-.12.31v7.59a.39.39,0,0,0,.12.31.47.47,0,0,0,.32.12h7.53a.42.42,0,0,1,.44.42v3.12a.42.42,0,0,1-.42.44h-9.37a2.71,2.71,0,0,1-1.06-.21,2.6,2.6,0,0,1-.91-.59,2.92,2.92,0,0,1-.79-2V117.07a2.71,2.71,0,0,1,.21-1.06,2.44,2.44,0,0,1,.58-.91,2.91,2.91,0,0,1,.91-.59,2.55,2.55,0,0,1,1.06-.22h9.35a.44.44,0,0,1,.44.43v3.11a.44.44,0,0,1-.42.45H242A.45.45,0,0,0,241.68,118.42Z"
            />
            <path
              fill="#242425"
              d="M263,121.23a.12.12,0,0,0,0,.16l5.44,9a.22.22,0,0,1,0,.27.27.27,0,0,1-.25.11h-3.9a.7.7,0,0,1-.37-.11.66.66,0,0,1-.28-.27L260.13,124c0-.09-.09-.09-.12,0l-1.94,2.13a.9.9,0,0,0-.2.34,1.1,1.1,0,0,0-.08.4v3.47a.41.41,0,0,1-.33.45h-3.28a.39.39,0,0,1-.44-.33.24.24,0,0,1,0-.12V114.76a.39.39,0,0,1,.33-.44h3.35a.39.39,0,0,1,.44.33.2.2,0,0,1,0,.11v7l6.05-7.08a1,1,0,0,1,.26-.27.93.93,0,0,1,.4-.09h3.89c.13,0,.2,0,.23.09s0,.15-.08.24Z"
            />
            <path
              fill="#242425"
              d="M275.65,130.28a.38.38,0,0,1-.32.44H272a.39.39,0,0,1-.45-.32V114.76a.39.39,0,0,1,.33-.44h3.35a.39.39,0,0,1,.44.33.2.2,0,0,1,0,.11Z"
            />
            <path
              fill="#242425"
              d="M291.4,114.54a2.76,2.76,0,0,1,1.46,1.45,2.57,2.57,0,0,1,.21,1.06v13.22a.42.42,0,0,1-.42.44h-3.24a.39.39,0,0,1-.31-.12.47.47,0,0,1-.12-.32V118.72a.37.37,0,0,0-.13-.31.45.45,0,0,0-.31-.12H283.9a.47.47,0,0,0-.32.12.4.4,0,0,0-.13.31v11.56a.39.39,0,0,1-.33.44h-3.35a.39.39,0,0,1-.44-.32.24.24,0,0,1,0-.12V114.76a.39.39,0,0,1,.33-.44h10.71A2.45,2.45,0,0,1,291.4,114.54Z"
            />
            <path
              fill="#242425"
              d="M310.41,121.9a.42.42,0,0,1,.13.32V128a2.59,2.59,0,0,1-.23,1.06,2.82,2.82,0,0,1-.58.91,2.51,2.51,0,0,1-.91.59,2.71,2.71,0,0,1-1.06.21h-8.3a2.78,2.78,0,0,1-1.06-.21,2.74,2.74,0,0,1-1.64-2.56V117.11A2.8,2.8,0,0,1,297,116a2.45,2.45,0,0,1,.58-.9,2.91,2.91,0,0,1,.91-.59,2.55,2.55,0,0,1,1.06-.22h9.68a.44.44,0,0,1,.44.44v3.1a.44.44,0,0,1-.44.44h-7.86a.45.45,0,0,0-.31.12.37.37,0,0,0-.13.31v7.59a.37.37,0,0,0,.13.31.4.4,0,0,0,.31.11h4.59a.4.4,0,0,0,.42-.38v-4.14a.42.42,0,0,1,.42-.44h3.28A.43.43,0,0,1,310.41,121.9Z"
            />
          </g>
          <g>
            <path
              fill="#E73427"
              d="M98.85,1.41A17.32,17.32,0,0,1,108,10.57a16.51,16.51,0,0,1,1.41,6.68v86.06a2.78,2.78,0,0,1-2.75,2.8H86a2.43,2.43,0,0,1-1.92-.82,2.82,2.82,0,0,1-.74-2V25.12H66.79v78.22a2.87,2.87,0,0,1-.74,2,2.52,2.52,0,0,1-1.93.82H45.47a2.78,2.78,0,0,1-2.82-2.74V25.12H26.07v78.22a2.49,2.49,0,0,1-2.82,2.81H2.82A2.49,2.49,0,0,1,0,103.34V2.81A2.49,2.49,0,0,1,2.82,0H92.11A16.46,16.46,0,0,1,98.85,1.41Z"
            />
          </g>
          <g>
            <path
              fill="#1D539F"
              d="M199.19,80.38a2.69,2.69,0,0,1,2,.83,2.89,2.89,0,0,1,.78,2.05v20a2.83,2.83,0,0,1-.78,2,2.67,2.67,0,0,1-2,.84h-70.5c-2,0-3-1-3-2.88V2.88c0-1.92,1-2.88,3-2.88h21.64c2,0,3,1,3,2.88V77.65a2.49,2.49,0,0,0,.91,2,3.09,3.09,0,0,0,2.11.77Z"
            />
          </g>
          <g>
            <path
              fill="#F8B92A"
              d="M307.54,0a2.94,2.94,0,0,1,2.14.84,2.76,2.76,0,0,1,.91,2.05V103.57a2.76,2.76,0,0,1-.91,2.05,2.94,2.94,0,0,1-2.14.84H285.62a2.93,2.93,0,0,1-2.13-.84,2.69,2.69,0,0,1-.91-2.05V68.44a2.63,2.63,0,0,0-.79-2,2.82,2.82,0,0,0-2.05-.76H249a3.09,3.09,0,0,0-2.13.76,2.5,2.5,0,0,0-.91,2v35.13c0,1.92-1,2.89-3,2.89H221.2c-2,0-3-1-3-2.89V2.89c0-1.93,1-2.89,3-2.89H243c2,0,3,1,3,2.89V37c0,1.92,1,2.88,3,2.88h30.81a2.74,2.74,0,0,0,2.06-.83,2.93,2.93,0,0,0,.79-2V2.89a2.71,2.71,0,0,1,.9-2.05A2.92,2.92,0,0,1,285.62,0Z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default MlhLogo;
```

- [ ] **Step 2: Write `src/components/SocialIcons.js`**

```jsx
export const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
    />
  </svg>
);

export const DiscordIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

export const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
  </svg>
);

export const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const YouTubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
```

- [ ] **Step 3: Format-check both files**

Run:

```bash
cd .claude/worktrees/2026-blank-slate && npx prettier --check src/components/icons/MlhLogo.js src/components/SocialIcons.js
```

Expected: `All matched files use Prettier code style!` (this is the only
automated syntax check available right now — neither file is imported
anywhere yet, so `npm run build` won't compile them until Task 4 wires them
in).

If either file reports a mismatch, run
`npx prettier --write src/components/icons/MlhLogo.js src/components/SocialIcons.js`
and re-check.

- [ ] **Step 4: Commit**

```bash
cd .claude/worktrees/2026-blank-slate && git add src/components/icons/MlhLogo.js src/components/SocialIcons.js && git commit -m "Add MLH logo and social media icon components"
```

---

### Task 3: Build the Footer component

**Files:**

- Create: `src/components/Footer/Footer.styles.js`
- Create: `src/components/Footer/index.js`

**Interfaces:**

- Consumes:
  - `MlhLogo` default export from `components/icons/MlhLogo` (Task 2).
  - `InstagramIcon`, `DiscordIcon`, `TikTokIcon`, `LinkedInIcon`,
    `YouTubeIcon` named exports from `components/SocialIcons` (Task 2).
- Produces: `src/components/Footer/index.js` default-exports `Footer`, a
  zero-prop function component `() => JSX`. This is what Task 4 imports
  into `_app.js`.

- [ ] **Step 1: Write `src/components/Footer/Footer.styles.js`**

```jsx
import styled from 'styled-components';

export const FooterRoot = styled.footer`
  background: #fafafa;
`;

export const FooterInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 16px 32px;

  @media (min-width: 640px) {
    padding-top: 64px;
  }
`;

export const FooterColumns = styled.div`
  display: block;

  @media (min-width: 768px) {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    column-gap: 32px;
  }

  > * + * {
    margin-top: 40px;

    @media (min-width: 768px) {
      margin-top: 0;
    }
  }
`;

export const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  max-width: 20rem;

  @media (min-width: 1024px) {
    align-items: flex-start;
    text-align: left;
  }
`;

export const FooterLogoLink = styled.a`
  display: inline-block;
  line-height: 0;

  svg {
    height: 48px;
    width: 112px;
  }
`;

export const Tagline = styled.p`
  margin: 0;
  color: #242425;
  font-size: 16px;
  line-height: 1.5;
`;

export const SocialRow = styled.div`
  display: flex;
  gap: 20px;
`;

export const SocialLink = styled.a`
  color: #a3a3a3;
  transition: color 0.15s ease;

  &:hover {
    color: #737373;
  }

  svg {
    height: 24px;
    width: 24px;
  }
`;

export const NavColumn = styled.div``;

export const NavColumnTitle = styled.h3`
  margin: 0 0 16px;
  color: #525252;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.35px;
  text-transform: uppercase;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

export const NavColumnList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

export const NavLink = styled.a`
  color: #1d539f;
  font-size: 16px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const BottomBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
  color: #737373;
  font-size: 16px;
  text-align: center;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
`;

export const BottomLinks = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: inline;
  }

  li + li::before {
    content: ' \\2022 ';
    padding: 0 4px;
  }
`;

export const BottomLink = styled.a`
  color: #737373;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Copyright = styled.p`
  margin: 0;
`;
```

- [ ] **Step 2: Write `src/components/Footer/index.js`**

```jsx
import MlhLogo from 'components/icons/MlhLogo';
import {
  DiscordIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  YouTubeIcon,
} from 'components/SocialIcons';
import {
  BottomBar,
  BottomLink,
  BottomLinks,
  BrandBlock,
  Copyright,
  FooterColumns,
  FooterInner,
  FooterLogoLink,
  FooterRoot,
  NavColumn,
  NavColumnList,
  NavColumnTitle,
  NavLink,
  SocialLink,
  SocialRow,
  Tagline,
} from './Footer.styles';

const LINK_COLUMNS = [
  {
    title: 'Hackathons',
    links: [
      {
        label: 'Upcoming Hackathons',
        href: 'https://www.mlh.com/seasons/2026/events',
      },
      { label: 'Global Hack Week', href: 'https://ghw.mlh.io/' },
      { label: 'TechTogether', href: 'https://techtogether.io/' },
    ],
  },
  {
    title: 'Fellowship',
    links: [
      { label: 'Programs', href: 'https://fellowship.mlh.io/#programs' },
      { label: 'Fellowship FAQ', href: 'https://hackp.ac/fellowship-faq' },
      { label: 'Apply', href: 'https://fellowship.mlh.io/apply' },
    ],
  },
  {
    title: 'Resources',
    links: [
      {
        label: 'Code of Conduct',
        href: 'http://www.mlh.com/code-of-conduct',
      },
      {
        label: 'Prizes & Freebies',
        href: 'https://www.mlh.com/events/prizes',
      },
      {
        label: 'Branding Guidelines',
        href: 'https://www.mlh.com/brand-guidelines',
      },
    ],
  },
  {
    title: 'About MLH',
    links: [
      { label: 'Contact Us', href: 'https://www.mlh.com/contact' },
      { label: 'Blog', href: 'https://blog.mlh.com/' },
      { label: 'Partners', href: 'https://sponsor.mlh.io/' },
      { label: 'Work at MLH', href: 'https://careers.mlh.io/' },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mlhacks/',
    Icon: InstagramIcon,
  },
  { label: 'Discord', href: 'https://discord.mlh.io/', Icon: DiscordIcon },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@majorleaguehacking',
    Icon: TikTokIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/major-league-hacking/',
    Icon: LinkedInIcon,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/majorleaguehacking',
    Icon: YouTubeIcon,
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <FooterRoot>
      <FooterInner>
        <FooterColumns>
          <BrandBlock>
            <FooterLogoLink href="/" aria-label="Major League Hacking">
              <MlhLogo />
            </FooterLogoLink>
            <Tagline>
              We help run the global hacker community. It&apos;s our mission to
              empower hackers, just like you.
            </Tagline>
            <SocialRow>
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <SocialLink
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </SocialLink>
              ))}
            </SocialRow>
          </BrandBlock>

          {LINK_COLUMNS.map((column) => (
            <NavColumn key={column.title}>
              <NavColumnTitle>{column.title}</NavColumnTitle>
              <NavColumnList>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </NavColumnList>
            </NavColumn>
          ))}
        </FooterColumns>

        <BottomBar>
          <BottomLinks>
            <li>
              <BottomLink
                href="https://www.mlh.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy
              </BottomLink>
            </li>
            <li>
              <BottomLink
                href="https://www.mlh.com/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </BottomLink>
            </li>
          </BottomLinks>
          <Copyright>Major League Hacking &copy; {year}</Copyright>
        </BottomBar>
      </FooterInner>
    </FooterRoot>
  );
};

export default Footer;
```

- [ ] **Step 3: Format-check both files**

Run:

```bash
cd .claude/worktrees/2026-blank-slate && npx prettier --check src/components/Footer/Footer.styles.js src/components/Footer/index.js
```

Expected: `All matched files use Prettier code style!` (again, the real
build/integration check comes in Task 4 once `_app.js` imports `Footer`).

If either file reports a mismatch, run
`npx prettier --write src/components/Footer/Footer.styles.js src/components/Footer/index.js`
and re-check.

- [ ] **Step 4: Commit**

```bash
cd .claude/worktrees/2026-blank-slate && git add src/components/Footer/Footer.styles.js src/components/Footer/index.js && git commit -m "Add Footer component matching mlh.com"
```

---

### Task 4: Wire the Footer into every page and verify against mlh.com

**Files:**

- Modify: `src/pages/_app.js`

**Interfaces:**

- Consumes: `Footer` default export from `components/Footer` (Task 3).
- Produces: nothing further downstream — this is the final integration
  point.

- [ ] **Step 1: Import and render `Footer`**

Open `src/pages/_app.js` (in the worktree). It currently reads:

```jsx
import Head from 'next/head';

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Hacktoberfest</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default App;
```

Replace it with:

```jsx
import Head from 'next/head';

import Footer from 'components/Footer';

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Hacktoberfest</title>
      </Head>

      <Component {...pageProps} />

      <Footer />
    </>
  );
};

export default App;
```

- [ ] **Step 2: Format-check the file**

Run:

```bash
cd .claude/worktrees/2026-blank-slate && npx prettier --check src/pages/_app.js
```

Expected: `All matched files use Prettier code style!`

If it reports a mismatch, run `npx prettier --write src/pages/_app.js` and
re-check.

- [ ] **Step 3: Full-repo formatting check**

Run:

```bash
cd .claude/worktrees/2026-blank-slate && npm test
```

Expected: exits 0 with no formatting violations reported (this runs
`prettier --check --ignore-unknown .` across the whole repo, matching what
CI's `ci.yml` runs).

- [ ] **Step 4: Build and verify with grep**

Run:

```bash
cd .claude/worktrees/2026-blank-slate && npm run build
```

Expected: build completes with no errors.

Then verify the footer's real content made it into the static HTML — run
each of these against `out/index.html`:

```bash
cd .claude/worktrees/2026-blank-slate
grep -c 'href="https://www.mlh.com/seasons/2026/events"' out/index.html
grep -c 'href="https://fellowship.mlh.io/apply"' out/index.html
grep -c 'href="http://www.mlh.com/code-of-conduct"' out/index.html
grep -c 'href="https://careers.mlh.io/"' out/index.html
grep -c 'href="https://www.instagram.com/mlhacks/"' out/index.html
grep -c 'href="https://discord.mlh.io/"' out/index.html
grep -c 'href="https://www.tiktok.com/@majorleaguehacking"' out/index.html
grep -c 'href="https://www.linkedin.com/company/major-league-hacking/"' out/index.html
grep -c 'href="https://www.youtube.com/majorleaguehacking"' out/index.html
grep -c 'href="https://www.mlh.com/privacy"' out/index.html
grep -c 'href="https://www.mlh.com/terms"' out/index.html
grep -c 'Major League Hacking' out/index.html
grep -c 'We help run the global hacker community' out/index.html
```

Expected: every command outputs `1` or higher (each href/text string is
present at least once).

Run the same set of `grep` commands against `out/404.html` — same expected
result, confirming the footer renders globally via `_app.js`, not just on
the homepage.

- [ ] **Step 5: Visual comparison against mlh.com**

Start the dev server for the worktree:

```bash
cd .claude/worktrees/2026-blank-slate && npm run dev
```

In a browser, open the local dev server and compare it side-by-side against
`https://www.mlh.com/` at three widths:

- **375px** (mobile): confirm the brand block (logo, tagline, 5 social
  icons) and all four link columns are stacked vertically and centered.
- **900px** (tablet): confirm the brand block and four link columns sit in
  a single row (5 columns total), each column's links stacked vertically
  underneath its title.
- **1280px+** (desktop): same row layout, but the brand block's logo/
  tagline/social icons left-align instead of centering, and the bottom bar
  (Privacy • Terms of Service | copyright) becomes a single row instead of
  stacking.

Confirm: background is off-white (not pure white), column headers are
small bold uppercase gray text, column links are blue, social icons are
gray and darken on hover, and the MLH wordmark renders in its three colors
(black text, red M, blue L, yellow H).

Stop the dev server once the comparison is done.

- [ ] **Step 6: Commit**

```bash
cd .claude/worktrees/2026-blank-slate && git add src/pages/_app.js && git commit -m "Render the MLH footer on every page"
```

---

## Self-Review Notes

- **Spec coverage:** architecture (Task 3 file layout matches spec exactly)
  — content (all 4 columns/13 links/5 socials/2 legal links/copyright
  covered in Task 3's data arrays, verified in Task 4 step 4) — light-mode
  only (no dark-mode code anywhere in this plan) — Open Sans font (Task 1)
  — responsive breakpoints (768px/1024px hardcoded in
  `Footer.styles.js`, matching the spec's documented breakpoints) — `main`
  branch untouched (every command in this plan runs inside the
  `.claude/worktrees/2026-blank-slate` worktree).
- **Placeholder scan:** none — every step has complete, runnable code and
  exact commands with expected output.
- **Type/naming consistency:** `Footer` (default export, Task 3) is
  imported as `Footer` in Task 4 — matches. `MlhLogo` (default export,
  Task 2) is imported as `MlhLogo` in Task 3 — matches. The five social
  icon names (`InstagramIcon`, `DiscordIcon`, `TikTokIcon`, `LinkedInIcon`,
  `YouTubeIcon`) are identical between their Task 2 export and their Task 3
  import — matches. Styled-component names exported from `Footer.styles.js`
  in Task 3 Step 1 (`FooterRoot`, `FooterInner`, `FooterColumns`,
  `BrandBlock`, `FooterLogoLink`, `Tagline`, `SocialRow`, `SocialLink`,
  `NavColumn`, `NavColumnTitle`, `NavColumnList`, `NavLink`, `BottomBar`,
  `BottomLinks`, `BottomLink`, `Copyright`) are exactly the set imported in
  Task 3 Step 2 — matches, no unused or missing names.
