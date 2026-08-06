# Rally Poster Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the split-column hero with the approved centered "rally poster" layout from `docs/superpowers/specs/2026-08-10-rally-poster-hero-design.md`.

**Architecture:** Rework the two files of `src/components/Hero` (index + styles) into a single centered stack inside the standard Shell width; delete the entire right-panel (Manifesto/PosterGeometry) code; trim one line from the `llms-full.txt` mirror.

**Tech Stack:** Next.js 15 pages router, styled-components 6. No test framework — verification is `npm run test` (prettier check) plus dev-server render checks.

## Global Constraints

- All work on branch `worktree-2026-blank-slate` in `/Users/jacklynbiggin/Repos/hacktoberfest-2026-frontend/.claude/worktrees/2026-blank-slate`.
- Copy is approved verbatim — do not reword the eyebrow, heading, deck, note, or partner labels.
- The single CTA points at `TYPEFORM_URL` from `data/links`; the secondary "What's a Hacktober Fest?" button stays present but commented out, tied to FestsSection's return.
- JSX text entities: `&middot;`, `&mdash;`, `&apos;`, `&times;` as in the code below.
- Commits run prettier via lint-staged; run `npm run test` before committing.

## File Structure

| File                                 | Action  | Responsibility                                                                      |
| ------------------------------------ | ------- | ----------------------------------------------------------------------------------- |
| `src/components/Hero/Hero.styles.js` | Rewrite | Centered-stack styles; Manifesto\*/PosterGeometry/HeroGrid/HeroCopy exports deleted |
| `src/components/Hero/index.js`       | Rewrite | Centered hero markup; MANIFESTO_ITEMS deleted; partner chips unchanged              |
| `public/llms-full.txt`               | Modify  | Remove the `Snapshot: …` line no longer rendered                                    |

---

### Task 1: Rework the Hero component

**Files:**

- Modify: `src/components/Hero/Hero.styles.js` (full rewrite)
- Modify: `src/components/Hero/index.js` (full rewrite)

**Interfaces:**

- Consumes: `Button` (styled.a) from `components/Button`, `Shell` from `components/Shell`, tokens from `styles/tokens`, `TYPEFORM_URL` from `data/links`, icon components `DevLogo`, `MlhLogo`, `DigitalOceanLogo` from `components/icons/*` — all existing.
- Produces: default export `Hero` (no props), section keeps `id="top"` (header wordmark anchor target).

- [ ] **Step 1: Rewrite Hero.styles.js**

Replace the entire contents of `src/components/Hero/Hero.styles.js` with:

```js
import styled from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const HeroRoot = styled.section`
  color: ${colors.white};
  border-bottom: 2px solid ${colors.white};
  background: ${colors.forest};
`;

export const HeroInner = styled(Shell)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: clamp(80px, 10vw, 130px);
  text-align: center;
`;

export const HeroSquares = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

export const HeroSquare = styled.span`
  width: 14px;
  height: 14px;
  background: ${(props) => props.$color};
`;

export const Eyebrow = styled.p`
  margin: 0;
  color: ${colors.pinkLight};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
`;

export const HeroHeading = styled.h1`
  max-width: 12ch;
  margin: 20px auto 0;
  font-family: ${fonts.display};
  font-size: clamp(3rem, 9vw, 6.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.92;
  text-wrap: balance;

  em {
    display: block;
    color: ${colors.sky};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
    letter-spacing: inherit;
  }
`;

export const HeroDeck = styled.p`
  max-width: 56ch;
  margin: 26px auto 0;
  color: ${colors.white};
  font-size: clamp(1.06rem, 1.6vw, 1.25rem);
  line-height: 1.56;
`;

export const HeroActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  margin-top: 32px;
  align-self: stretch;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    justify-content: center;
    align-self: auto;
  }
`;

export const HeroButton = styled(Button)`
  width: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    width: auto;
  }
`;

export const HeroNote = styled.p`
  margin: 18px 0 0;
  color: ${colors.pinkLight};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.025em;
`;

export const HeroPartners = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px 44px;
  margin-top: 44px;
`;

export const HeroPartnerGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const HeroPartnerLabel = styled.span`
  color: ${colors.pinkLight};
  font-family: ${fonts.mono};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
`;

export const HeroPartnerChip = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 5px 5px 0 ${colors.forestDeep};

  svg {
    width: auto;
    height: 28px;
  }
`;

export const HeroPartnerTimes = styled.span`
  color: ${colors.ink};
  font-family: ${fonts.display};
  font-size: 1rem;
  font-weight: 800;
`;
```

- [ ] **Step 2: Rewrite Hero/index.js**

Replace the entire contents of `src/components/Hero/index.js` with:

```jsx
import DevLogo from 'components/icons/DevLogo';
import DigitalOceanLogo from 'components/icons/DigitalOceanLogo';
import MlhLogo from 'components/icons/MlhLogo';
import { TYPEFORM_URL } from 'data/links';
import { colors } from 'styles/tokens';

import {
  Eyebrow,
  HeroActions,
  HeroButton,
  HeroDeck,
  HeroHeading,
  HeroInner,
  HeroNote,
  HeroPartnerChip,
  HeroPartnerGroup,
  HeroPartnerLabel,
  HeroPartners,
  HeroPartnerTimes,
  HeroRoot,
  HeroSquare,
  HeroSquares,
} from './Hero.styles';

const ACCENT_COLORS = [colors.orange, colors.sky, colors.ochre, colors.pink];

const Hero = () => (
  <HeroRoot id="top">
    <HeroInner>
      <HeroSquares aria-hidden="true">
        {ACCENT_COLORS.map((color) => (
          <HeroSquare key={color} $color={color} />
        ))}
      </HeroSquares>
      <Eyebrow>
        October 2026 &middot; 300+ cities &middot; In person and online
      </Eyebrow>
      <HeroHeading>
        Hacktoberfest 2026: <em>AI belongs to everyone.</em>
      </HeroHeading>
      <HeroDeck>
        This October, Hacktoberfest comes to your city. Join a one-day Hacktober
        Fest near you &mdash; or take part online from anywhere &mdash; and get
        hands-on with AI models anyone can download, inspect, and build with.
      </HeroDeck>
      <HeroActions>
        <HeroButton href={TYPEFORM_URL}>Join Hacktoberfest</HeroButton>
        {/* Hidden with FestsSection — its #fests anchor target is not
            rendered right now. Restore both together:
        <HeroButton $variant="secondary" href="#fests">
          What&apos;s a Hacktober Fest?
        </HeroButton> */}
      </HeroActions>
      <HeroNote>
        Build in person &middot; Earn the 2026 shirt &middot; Online from
        anywhere
      </HeroNote>
      <HeroPartners>
        <HeroPartnerGroup>
          <HeroPartnerLabel>Powered by</HeroPartnerLabel>
          <HeroPartnerChip>
            <DevLogo />
            <HeroPartnerTimes aria-hidden="true">&times;</HeroPartnerTimes>
            <MlhLogo />
          </HeroPartnerChip>
        </HeroPartnerGroup>
        <HeroPartnerGroup>
          <HeroPartnerLabel>Presenting partner</HeroPartnerLabel>
          <HeroPartnerChip>
            <DigitalOceanLogo />
          </HeroPartnerChip>
        </HeroPartnerGroup>
      </HeroPartners>
    </HeroInner>
  </HeroRoot>
);

export default Hero;
```

- [ ] **Step 3: Verify no stale references to deleted exports**

Run: `grep -rn "Manifesto\|PosterGeometry\|HeroGrid\|HeroCopy" src`
Expected: no output.

- [ ] **Step 4: Verify formatting**

Run: `npm run test`
Expected: exit 0 (run `npm run format` first if it flags the files).

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero
git commit -m "Replace split hero with centered rally-poster layout"
```

---

### Task 2: Mirror update and render verification

**Files:**

- Modify: `public/llms-full.txt`

**Interfaces:**

- Consumes: the rendered page from Task 1.
- Produces: mirror file matching the visible page.

- [ ] **Step 1: Remove the snapshot line from llms-full.txt**

In `public/llms-full.txt`, delete this line (and its trailing blank line) from the Hero section:

```
Snapshot: Your Hacktoberfest, OCT 2026. 300+ hack days. One global celebration. 01 Find a Fest in your city / 02 Or join online from anywhere / 03 Build with open models.
```

- [ ] **Step 2: Render verification**

With the dev server running (`npm run dev` or the browser preview tooling), verify:

1. Hero renders as one centered column: squares → eyebrow → heading (tagline on its own sky line) → deck → orange CTA → note → two partner chips.
2. No right panel, no OCT 2026 stamp, no 01/02/03 list anywhere in the hero.
3. `#top` anchor still present on the hero section (header wordmark link works).
4. 375px width: no horizontal overflow; partner groups wrap/stack cleanly; CTA goes full-width.
5. No console errors / Next.js error overlay.

- [ ] **Step 3: Verify formatting and commit**

Run: `npm run test` (expected: exit 0), then:

```bash
git add public/llms-full.txt
git commit -m "Drop the retired hero snapshot line from the llms mirror"
```

---

## Self-Review Notes

- Spec coverage: design items 1–7 → Task 1 Step 2 markup; "Removed" list → Task 1 rewrites (Step 3 greps for stragglers); "Kept" list → unchanged copy/CTA/chips in Step 2's code; cross-cutting llms line + render checks → Task 2.
- Type consistency: every styled export used in `index.js` is defined in Step 1's styles file; `HeroSquare` takes `$color` (transient prop, not forwarded to DOM).
- No placeholders; all code complete.
