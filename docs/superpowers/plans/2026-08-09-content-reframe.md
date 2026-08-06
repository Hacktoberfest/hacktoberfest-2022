# Hacktoberfest 2026 Content Reframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the Hacktoberfest 2026 landing page around the in-person event model (300+ Hacktober Fests + online event, open-AI focus) per the approved spec at `docs/superpowers/specs/2026-08-09-content-reframe-design.md`.

**Architecture:** Static Next.js (pages router) marketing site, styled-components, one page (`src/pages/index.js`) composed of section components under `src/components/<Name>/{index.js, <Name>.styles.js}`. This plan reworks copy in four existing sections (Hero, Rally, EraSection, CurriculumSection), adds five new sections (PartnerStrip, FestsSection, WaysInSection, MissionSection, HostSection, SponsorSection), retires three (PathSection, DeclarationSection, JoinSection), and updates the page shell, header nav, and `public/llms*.txt`.

**Tech Stack:** Next.js 15, React 19, styled-components 6, Prettier (via lint-staged pre-commit). Node 20.19.1. No unit-test framework exists — verification is `npm run test` (prettier check), `npm run build`, and rendered-page checks.

## Global Constraints

Copied from the approved spec — every task's copy must obey these:

- Never use "open source AI" as a cold hook; describe first ("AI models anyone can download, inspect, and build with"), introduce the term later on the page.
- Positive-sum framing only: "open needs to be in the mix for a healthy AI ecosystem." No anti-closed-AI language (exception: the verbatim mission block, which is stakeholder-owned copy and must not be edited).
- Never neg previous years — past Hacktoberfests are a success whose mission was accomplished.
- Audience: developers first, zero assumed open-source literacy.
- One combined ask: every join/host CTA points at `TYPEFORM_URL` from `src/data/links.js` (placeholder `'#'` until the real link arrives).
- The mission section's copy is verbatim placeholder awaiting a revised version — it must live in a single swappable block, clearly commented.
- Imports resolve from `src` baseUrl (e.g. `import Shell from 'components/Shell'`, `import { colors } from 'styles/tokens'`). Follow this style.
- JSX text uses HTML entities for apostrophes (`&apos;`) and middots (`&middot;`), matching existing components. Plain apostrophes are fine inside JS string literals.
- Commits run prettier automatically via lint-staged; still run `npm run test` before committing to catch issues early.
- All work happens on the `worktree-2026-blank-slate` branch in `/Users/jacklynbiggin/Repos/hacktoberfest-2026-frontend/.claude/worktrees/2026-blank-slate`.

## File Structure

| File                                                                                               | Action | Responsibility                                                |
| -------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| `src/data/links.js`                                                                                | Create | Single source of truth for Typeform + sponsor URLs            |
| `src/components/icons/DevLogo.js`                                                                  | Create | DEV badge SVG (interim mark, swap-ready)                      |
| `src/components/PartnerStrip/index.js` + `.styles.js`                                              | Create | "Powered by DEV × MLH / Presenting partner DigitalOcean" band |
| `src/components/Hero/index.js`                                                                     | Modify | New tagline, deck, CTAs, snapshot card                        |
| `src/components/Rally/index.js`                                                                    | Modify | Positive-sum one-liner                                        |
| `src/components/EraSection/index.js`                                                               | Modify | Maintainer-segue "what changed" narrative                     |
| `src/components/FestsSection/index.js` + `.styles.js`                                              | Create | What a Hacktober Fest is + three concrete beats               |
| `src/components/WaysInSection/index.js` + `.styles.js`                                             | Create | In person / Online cards with rewards + CTAs                  |
| `src/components/CurriculumSection/index.js`                                                        | Modify | Implicit-ladder "what you'll build" cards                     |
| `src/components/MissionSection/index.js` + `.styles.js`                                            | Create | Verbatim framing copy slot                                    |
| `src/components/HostSection/index.js` + `.styles.js`                                               | Create | Host pitch + notify CTA                                       |
| `src/components/SponsorSection/index.js` + `.styles.js`                                            | Create | Bottom sponsorship CTA                                        |
| `src/components/Header/index.js`                                                                   | Modify | Nav anchors + Typeform CTA                                    |
| `src/pages/index.js`                                                                               | Modify | Section order, title, meta description                        |
| `src/components/PathSection/`, `src/components/DeclarationSection/`, `src/components/JoinSection/` | Delete | Replaced by WaysInSection, MissionSection, SponsorSection     |
| `public/llms.txt`, `public/llms-full.txt`                                                          | Modify | Mirror the new page content                                   |

Existing `.styles.js` files for Hero, Rally, EraSection, and CurriculumSection are **not modified** — their exported components are reused with new copy.

---

### Task 1: Partner logos + PartnerStrip component

**Files:**

- Create: `src/components/icons/DevLogo.js`
- Create: `src/components/PartnerStrip/PartnerStrip.styles.js`
- Create: `src/components/PartnerStrip/index.js`

**Interfaces:**

- Consumes: `MlhLogo` from `components/icons/MlhLogo` (existing; SVG component spreading props), `Shell` from `components/Shell`, tokens from `styles/tokens`.
- Produces: default export `PartnerStrip` (no props) — Task 11 renders it in the page directly after `<Hero />`.

- [ ] **Step 1: Create the DEV badge icon**

Create `src/components/icons/DevLogo.js`:

```jsx
// Interim DEV mark (the official badge is a black rounded square with "DEV").
// Swap for the official brand SVG when the product owner supplies it.
const DevLogo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    aria-hidden="true"
    {...props}
  >
    <rect width="50" height="50" rx="7" fill="#0a0a0a" />
    <text
      x="25"
      y="32"
      textAnchor="middle"
      fontFamily="Helvetica, Arial, sans-serif"
      fontSize="17"
      fontWeight="800"
      fill="#ffffff"
    >
      DEV
    </text>
  </svg>
);

export default DevLogo;
```

- [ ] **Step 2: Create the PartnerStrip styles**

Create `src/components/PartnerStrip/PartnerStrip.styles.js`:

```js
import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const PartnerStripRoot = styled.section`
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.white};
`;

export const PartnerStripInner = styled(Shell)`
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding-block: 28px;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const PartnerGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PartnerLabel = styled.span`
  color: ${colors.muted};
  font-family: ${fonts.mono};
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const PartnerLogos = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  svg {
    width: auto;
    height: 34px;
  }
`;

export const PartnerTimes = styled.span`
  color: ${colors.muted};
  font-family: ${fonts.display};
  font-size: 1.1rem;
  font-weight: 800;
`;

export const PartnerWordmark = styled.span`
  color: #0080ff;
  font-family: ${fonts.sans};
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;
```

- [ ] **Step 3: Create the PartnerStrip component**

Create `src/components/PartnerStrip/index.js`:

```jsx
import DevLogo from 'components/icons/DevLogo';
import MlhLogo from 'components/icons/MlhLogo';

import {
  PartnerGroup,
  PartnerLabel,
  PartnerLogos,
  PartnerStripInner,
  PartnerStripRoot,
  PartnerTimes,
  PartnerWordmark,
} from './PartnerStrip.styles';

const PartnerStrip = () => (
  <PartnerStripRoot aria-label="Hacktoberfest 2026 partners">
    <PartnerStripInner>
      <PartnerGroup>
        <PartnerLabel>Powered by</PartnerLabel>
        <PartnerLogos>
          <DevLogo />
          <PartnerTimes aria-hidden="true">&times;</PartnerTimes>
          <MlhLogo />
        </PartnerLogos>
      </PartnerGroup>
      <PartnerGroup>
        <PartnerLabel>Presenting partner</PartnerLabel>
        <PartnerLogos>
          {/* Interim wordmark — swap for the official DigitalOcean SVG when supplied */}
          <PartnerWordmark>DigitalOcean</PartnerWordmark>
        </PartnerLogos>
      </PartnerGroup>
    </PartnerStripInner>
  </PartnerStripRoot>
);

export default PartnerStrip;
```

- [ ] **Step 4: Verify formatting**

Run: `npm run test`
Expected: prettier reports all matched files use Prettier style (exit 0). If it flags the new files, run `npm run format` and re-check.

- [ ] **Step 5: Commit**

```bash
git add src/components/icons/DevLogo.js src/components/PartnerStrip
git commit -m "Add partner strip with DEV, MLH, and DigitalOcean marks"
```

---

### Task 2: Link constants + Hero rework

**Files:**

- Create: `src/data/links.js`
- Modify: `src/components/Hero/index.js`

**Interfaces:**

- Consumes: existing exports of `./Hero.styles` (unchanged).
- Produces: `TYPEFORM_URL` (string) and `SPONSOR_MAILTO` (string) named exports from `data/links` — consumed by Tasks 6, 9, 10, and 11.

- [ ] **Step 1: Create the shared links module**

Create `src/data/links.js`:

```js
// Temporary lead-capture form covering both attending and hosting.
// Replace with the real Typeform URL when the product owner supplies it.
export const TYPEFORM_URL = '#';

export const SPONSOR_MAILTO =
  'mailto:sales@mlh.io?subject=Sponsor%20Hacktoberfest%202026';
```

- [ ] **Step 2: Update Hero copy and CTAs**

In `src/components/Hero/index.js`, keep the file's structure and the entire `PosterGeometry` SVG block untouched. Make exactly these changes:

Add after the existing `import { colors } from 'styles/tokens';` line:

```js
import { TYPEFORM_URL } from 'data/links';
```

Replace the `MANIFESTO_ITEMS` array contents:

```js
const MANIFESTO_ITEMS = [
  { number: '01', label: 'Find a Fest in your city' },
  { number: '02', label: 'Or join online from anywhere' },
  { number: '03', label: 'Build with open AI models' },
];
```

Replace the `<Eyebrow>` line:

```jsx
<Eyebrow>
  October 2026 &middot; 300+ cities &middot; In person and online
</Eyebrow>
```

Replace the `<HeroHeading>` block:

```jsx
<HeroHeading>
  Hacktoberfest 2026: <em>AI belongs to everyone.</em>
</HeroHeading>
```

Replace the `<HeroDeck>` block:

```jsx
<HeroDeck>
  This October, Hacktoberfest comes to your city. Join a one-day Hacktober Fest
  near you &mdash; or take part online from anywhere &mdash; and get hands-on
  with AI models anyone can download, inspect, and build with.
</HeroDeck>
```

Replace the `<HeroActions>` block:

```jsx
<HeroActions>
  <HeroButton href={TYPEFORM_URL}>Join Hacktoberfest</HeroButton>
  <HeroButton $variant="secondary" href="#fests">
    What&apos;s a Hacktober Fest?
  </HeroButton>
</HeroActions>
```

Replace the `<HeroNote>` block:

```jsx
<HeroNote>
  Build in person &middot; Earn the 2026 shirt &middot; Online from anywhere
</HeroNote>
```

Replace the `HeroManifesto` opening tag's aria-label:

```jsx
<HeroManifesto aria-label="Hacktoberfest 2026 at a glance">
```

Replace the `<ManifestoStatement>` block:

```jsx
<ManifestoStatement>
  300+ hack days. <em>One global celebration.</em>
</ManifestoStatement>
```

- [ ] **Step 3: Verify formatting**

Run: `npm run test`
Expected: exit 0 (run `npm run format` first if needed).

- [ ] **Step 4: Commit**

```bash
git add src/data/links.js src/components/Hero/index.js
git commit -m "Reframe hero around in-person Fests and the 2026 tagline"
```

---

### Task 3: Rally banner rewrite

**Files:**

- Modify: `src/components/Rally/index.js`

**Interfaces:**

- Consumes: existing exports of `./Rally.styles` (unchanged).
- Produces: default export `Rally` (unchanged signature).

- [ ] **Step 1: Replace the Rally copy**

Replace the entire body of `src/components/Rally/index.js` with:

```jsx
import { RallyInner, RallyRoot, RallyTag, RallyText } from './Rally.styles';

const Rally = () => (
  <RallyRoot aria-label="The idea behind Hacktoberfest 2026">
    <RallyInner>
      <RallyTag>
        The
        <br />
        idea
      </RallyTag>
      <RallyText>
        A healthy AI ecosystem needs open in the mix. This October, the whole
        Hacktoberfest community is <em>building it.</em>
      </RallyText>
    </RallyInner>
  </RallyRoot>
);

export default Rally;
```

- [ ] **Step 2: Verify formatting and commit**

Run: `npm run test` (expected: exit 0), then:

```bash
git add src/components/Rally/index.js
git commit -m "Rewrite rally line with positive-sum open AI framing"
```

---

### Task 4: EraSection rework (the maintainer segue)

**Files:**

- Modify: `src/components/EraSection/index.js`

**Interfaces:**

- Consumes: existing exports of `./EraSection.styles` (unchanged).
- Produces: default export `EraSection`; section keeps `id="new-era"`.

- [ ] **Step 1: Replace the EraSection content**

Replace the entire body of `src/components/EraSection/index.js` with:

```jsx
import {
  EraHeading,
  EraLabel,
  EraPanel,
  EraPanelCopy,
  EraPanelTitle,
  EraRoot,
  EraShift,
  Eyebrow,
  SectionCopy,
  SectionHeading,
  ThesisLine,
} from './EraSection.styles';

const PANELS = [
  {
    label: '2014-2025',
    title: 'Open the door to open source.',
    copy: 'A simple pull-request challenge introduced a generation of developers to open source. It worked.',
  },
  {
    label: '2026',
    title: 'Get hands-on with open AI, together.',
    copy: 'Meet up in person, run models you can download and inspect, and build something real in a day.',
  },
];

const EraSection = () => (
  <EraRoot id="new-era">
    <SectionHeading>
      <div>
        <Eyebrow>What changes in 2026</Eyebrow>
        <EraHeading>
          Hacktoberfest becomes something you <em>attend.</em>
        </EraHeading>
      </div>
      <SectionCopy>
        <p>
          When Hacktoberfest started, open source had a contributor problem.
          Projects needed people, and a simple pull-request challenge brought
          millions of them in.
        </p>
        <p>
          Today, AI tools have made contributing so easy that maintainers review
          more pull requests than they can handle. Getting new contributors
          isn&apos;t the problem anymore &mdash; understanding the AI behind
          those tools, and keeping it open, is where the community&apos;s energy
          is needed now.
        </p>
        <ThesisLine>
          So this year, Hacktoberfest is hundreds of in-person hack days plus a
          global online event, all about building with open AI.
        </ThesisLine>
      </SectionCopy>
    </SectionHeading>

    <EraShift aria-label="How Hacktoberfest is changing">
      {PANELS.map((panel) => (
        <EraPanel key={panel.label}>
          <EraLabel>{panel.label}</EraLabel>
          <EraPanelTitle>{panel.title}</EraPanelTitle>
          <EraPanelCopy>{panel.copy}</EraPanelCopy>
        </EraPanel>
      ))}
    </EraShift>
  </EraRoot>
);

export default EraSection;
```

- [ ] **Step 2: Verify formatting and commit**

Run: `npm run test` (expected: exit 0), then:

```bash
git add src/components/EraSection/index.js
git commit -m "Retell what changed in 2026 through the maintainer segue"
```

---

### Task 5: FestsSection (new)

**Files:**

- Create: `src/components/FestsSection/FestsSection.styles.js`
- Create: `src/components/FestsSection/index.js`

**Interfaces:**

- Consumes: `Shell` from `components/Shell`, tokens from `styles/tokens`.
- Produces: default export `FestsSection`; section has `id="fests"` (target of the hero secondary CTA and header nav).

- [ ] **Step 1: Create the styles**

Create `src/components/FestsSection/FestsSection.styles.js`:

```js
import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const FestsRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.white};
`;

export const FestsIntro = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-bottom: 50px;

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: end;
  }
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const FestsHeading = styled.h2`
  max-width: 14ch;
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.94;
  text-wrap: balance;

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const FestsCopy = styled.div`
  display: grid;
  gap: 14px;
  max-width: 52ch;
  color: #34433f;

  p {
    margin: 0;
  }
`;

export const FestsBeats = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const FestsBeat = styled.div`
  display: grid;
  gap: 14px;
  padding: 26px;
  border: 2px solid ${colors.ink};
  background: ${colors.paper};
  box-shadow: 7px 7px 0 ${colors.forestDeep};
`;

export const FestsBeatNumber = styled.span`
  color: ${colors.orangeDeep};
  font-family: ${fonts.mono};
  font-size: 0.67rem;
  font-weight: 900;
`;

export const FestsBeatLabel = styled.p`
  margin: 0;
  font-family: ${fonts.display};
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
`;
```

- [ ] **Step 2: Create the component**

Create `src/components/FestsSection/index.js`:

```jsx
import {
  Eyebrow,
  FestsBeat,
  FestsBeatLabel,
  FestsBeatNumber,
  FestsBeats,
  FestsCopy,
  FestsHeading,
  FestsIntro,
  FestsRoot,
} from './FestsSection.styles';

const BEATS = [
  { number: '01', label: 'Run an open model on real hardware' },
  { number: '02', label: 'Build and demo a project in a day' },
  { number: '03', label: 'Meet the developers in your city' },
];

const FestsSection = () => (
  <FestsRoot id="fests">
    <FestsIntro>
      <div>
        <Eyebrow>The Fests</Eyebrow>
        <FestsHeading>
          A Hacktober Fest is a hack day <em>in your city.</em>
        </FestsHeading>
      </div>
      <FestsCopy>
        <p>
          A Hacktober Fest is a one-day, in-person mini-hackathon: a few hours
          with local developers, food, and hardware, building something real
          with open AI models. No experience with open models required &mdash;
          every Fest has guided challenges to start from.
        </p>
        <p>
          Hundreds are happening across the world this October, hosted by local
          communities with support from Hacktoberfest.
        </p>
      </FestsCopy>
    </FestsIntro>

    <FestsBeats aria-label="What you will do at a Fest">
      {BEATS.map((beat) => (
        <FestsBeat key={beat.number}>
          <FestsBeatNumber>{beat.number}</FestsBeatNumber>
          <FestsBeatLabel>{beat.label}</FestsBeatLabel>
        </FestsBeat>
      ))}
    </FestsBeats>
  </FestsRoot>
);

export default FestsSection;
```

- [ ] **Step 3: Verify formatting and commit**

Run: `npm run test` (expected: exit 0), then:

```bash
git add src/components/FestsSection
git commit -m "Add FestsSection introducing the in-person hack days"
```

---

### Task 6: WaysInSection (new, with rewards)

**Files:**

- Create: `src/components/WaysInSection/WaysInSection.styles.js`
- Create: `src/components/WaysInSection/index.js`

**Interfaces:**

- Consumes: `TYPEFORM_URL` from `data/links` (Task 2), `Button` from `components/Button`, `Shell`, tokens.
- Produces: default export `WaysInSection`; section has `id="take-part"` (header nav target).

- [ ] **Step 1: Create the styles**

Create `src/components/WaysInSection/WaysInSection.styles.js`:

```js
import styled from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const WaysRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paperDeep};
`;

export const WaysIntro = styled(Shell)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 40px;
  margin-bottom: 50px;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
  }
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const WaysHeading = styled.h2`
  max-width: 12ch;
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.94;
  text-wrap: balance;

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const WaysIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
`;

export const WaysGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const WaysCard = styled.article`
  display: flex;
  flex-direction: column;
  padding: 30px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};

  &:nth-of-type(2) {
    background: ${colors.sky};
  }
`;

export const WaysTag = styled.span`
  font-family: ${fonts.mono};
  font-size: 0.69rem;
  font-weight: 900;
  letter-spacing: 0.11em;
  text-transform: uppercase;
`;

export const WaysCardTitle = styled.h3`
  max-width: 12ch;
  margin-top: 22px;
  font-family: ${fonts.display};
  font-size: clamp(2.05rem, 3vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.055em;
  line-height: 0.95;
`;

export const WaysCardCopy = styled.p`
  max-width: 40ch;
  margin-top: 18px;
  color: ${colors.ink};
  font-size: 0.93rem;
`;

export const WaysReward = styled.p`
  margin-top: 24px;
  padding-top: 18px;
  border-top: 2px solid ${colors.ink};
  font-weight: 760;
`;

export const WaysButton = styled(Button)`
  align-self: start;
  margin-top: 26px;
  color: ${colors.white};
  border-color: ${colors.ink};
  background: ${colors.forestDeep};
  box-shadow: 5px 5px 0 ${colors.maroon};

  &:focus-visible {
    box-shadow: 0 0 0 5px ${colors.ink};
  }
`;
```

- [ ] **Step 2: Create the component**

Create `src/components/WaysInSection/index.js`:

```jsx
import { TYPEFORM_URL } from 'data/links';

import {
  Eyebrow,
  WaysButton,
  WaysCard,
  WaysCardCopy,
  WaysCardTitle,
  WaysGrid,
  WaysHeading,
  WaysIntro,
  WaysIntroCopy,
  WaysReward,
  WaysRoot,
  WaysTag,
} from './WaysInSection.styles';

const WAYS = [
  {
    tag: 'In person',
    title: 'Join a Fest near you.',
    copy: 'Build for a day with your local community and demo what you made.',
    reward:
      'Earn the limited-edition Hacktoberfest 2026 t-shirt — only available by attending in person.',
    cta: 'Join a Fest',
  },
  {
    tag: 'Online',
    title: 'Join from anywhere.',
    copy: 'Take on build challenges throughout October and join community events like Global Hack Week.',
    reward: 'Earn the 2026 sticker pack, mailed anywhere in the world.',
    cta: 'Join online',
  },
];

const WaysInSection = () => (
  <WaysRoot id="take-part">
    <WaysIntro>
      <div>
        <Eyebrow>How to take part</Eyebrow>
        <WaysHeading>
          Two ways in. <em>Pick yours.</em>
        </WaysHeading>
      </div>
      <WaysIntroCopy>
        Sign up once and tell us how you want to take part &mdash; we&apos;ll
        point you to a Fest near you or to the online event.
      </WaysIntroCopy>
    </WaysIntro>

    <WaysGrid>
      {WAYS.map((way) => (
        <WaysCard key={way.tag}>
          <WaysTag>{way.tag}</WaysTag>
          <WaysCardTitle>{way.title}</WaysCardTitle>
          <WaysCardCopy>{way.copy}</WaysCardCopy>
          <WaysReward>{way.reward}</WaysReward>
          <WaysButton href={TYPEFORM_URL}>{way.cta}</WaysButton>
        </WaysCard>
      ))}
    </WaysGrid>
  </WaysRoot>
);

export default WaysInSection;
```

- [ ] **Step 3: Verify formatting and commit**

Run: `npm run test` (expected: exit 0), then:

```bash
git add src/components/WaysInSection
git commit -m "Add WaysInSection with in-person and online paths plus rewards"
```

---

### Task 7: CurriculumSection rework (implicit ladder)

**Files:**

- Modify: `src/components/CurriculumSection/index.js`

**Interfaces:**

- Consumes: existing exports of `./CurriculumSection.styles` (unchanged).
- Produces: default export `CurriculumSection`; section keeps `id="explore"`.

- [ ] **Step 1: Replace the intro and cards**

In `src/components/CurriculumSection/index.js`, keep imports and JSX structure; replace the `CARDS` array and the intro copy.

New `CARDS` array:

```js
const CARDS = [
  {
    number: '01 / MODELS',
    title: 'Start with an open model',
    copy: 'Download a model with open weights and run it. See what it can do on hardware you control.',
    tags: ['weights', 'licenses', 'evaluation'],
  },
  {
    number: '02 / TOOLS',
    title: 'Swap in open tools',
    copy: 'Go up the stack: run your model through an open source harness — agents, retrieval, evals — and change the parts instead of treating the system as one black box.',
    tags: ['agents', 'RAG', 'evals'],
  },
  {
    number: '03 / INFRASTRUCTURE',
    title: 'Own your inference',
    copy: 'Serve a model locally or on your own infrastructure. Learn what quantization, latency, and cost actually mean in practice.',
    tags: ['local', 'cloud', 'quantization'],
  },
  {
    number: '04 / PRACTICE',
    title: 'Ship and show it',
    copy: 'Build something another developer can run — then demo it at your Fest or share it online.',
    tags: ['build', 'demo', 'share'],
  },
];
```

New intro block (replacing the current `Eyebrow`, `CurriculumHeading`, and `CurriculumIntroCopy` contents):

```jsx
<CurriculumIntro>
  <div>
    <Eyebrow>What you&apos;ll build</Eyebrow>
    <CurriculumHeading>
      Go under the hood of <em>modern AI.</em>
    </CurriculumHeading>
  </div>
  <CurriculumIntroCopy>
    There&apos;s more to AI than the handful of chatbots everyone knows. This
    October, you&apos;ll work with the open ecosystem underneath.
  </CurriculumIntroCopy>
</CurriculumIntro>
```

- [ ] **Step 2: Verify formatting and commit**

Run: `npm run test` (expected: exit 0), then:

```bash
git add src/components/CurriculumSection/index.js
git commit -m "Reorder curriculum as an implicit open AI ladder"
```

---

### Task 8: MissionSection (verbatim framing slot)

**Files:**

- Create: `src/components/MissionSection/MissionSection.styles.js`
- Create: `src/components/MissionSection/index.js`

**Interfaces:**

- Consumes: `Shell`, tokens.
- Produces: default export `MissionSection`.

- [ ] **Step 1: Create the styles**

Create `src/components/MissionSection/MissionSection.styles.js`:

```js
import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const MissionRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forestDeep};
`;

export const MissionInner = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(45px, 7vw, 100px);

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 0.8fr 1.2fr;
    align-items: start;
  }
`;

export const Eyebrow = styled.p`
  margin: 0;
  color: ${colors.sky};
  font-family: ${fonts.mono};
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const MissionHeading = styled.h2`
  max-width: 11ch;
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.94;
  text-wrap: balance;

  em {
    color: ${colors.ochre};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const MissionCopy = styled.div`
  display: grid;
  gap: 22px;
  max-width: 62ch;
  font-size: 1.08rem;
  line-height: 1.6;

  p {
    margin: 0;
  }

  p:first-of-type {
    font-size: 1.25rem;
    font-weight: 640;
  }
`;
```

- [ ] **Step 2: Create the component**

Create `src/components/MissionSection/index.js`:

```jsx
import {
  Eyebrow,
  MissionCopy,
  MissionHeading,
  MissionInner,
  MissionRoot,
} from './MissionSection.styles';

// AWAITING FINAL COPY: this framing statement appears on the site verbatim.
// A revised version is coming from its author. When it lands, replace the
// paragraphs below wholesale — do not edit or paraphrase individual lines.
const MISSION_PARAGRAPHS = [
  'Hacktoberfest has always been about empowering people to build the open web together. For years, we measured that energy by counting pull requests. But open source was never defined by a PR counter. Open source is a philosophy centered on transparency and collective ownership.',
  'Today, that philosophy faces its biggest test. The defining technology of our era is AI, and the question of our time is simple: who gets to control the future of intelligence?',
  'AI shouldn’t be locked inside black boxes or restricted by closed gatekeepers. Democratizing AI means keeping innovation transparent, accessible, and in the hands of the people. From open-weight models to open agents and beyond, creators and curious minds of all backgrounds deserve the opportunity to experiment and build.',
  'This year, we’re moving beyond counting PRs. Hacktoberfest is refocusing on what matters most: giving everyone the tools and knowledge to learn, experiment, and build with open artificial intelligence.',
];

const MissionSection = () => (
  <MissionRoot aria-labelledby="mission-title">
    <MissionInner>
      <div>
        <Eyebrow>The mission</Eyebrow>
        <MissionHeading id="mission-title">
          Why we&apos;re <em>doing this.</em>
        </MissionHeading>
      </div>
      <MissionCopy>
        {MISSION_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </MissionCopy>
    </MissionInner>
  </MissionRoot>
);

export default MissionSection;
```

- [ ] **Step 3: Verify formatting and commit**

Run: `npm run test` (expected: exit 0), then:

```bash
git add src/components/MissionSection
git commit -m "Add MissionSection holding the verbatim framing copy"
```

---

### Task 9: HostSection (new)

**Files:**

- Create: `src/components/HostSection/HostSection.styles.js`
- Create: `src/components/HostSection/index.js`

**Interfaces:**

- Consumes: `TYPEFORM_URL` from `data/links`, `Button`, `Shell`, tokens.
- Produces: default export `HostSection`; section has `id="host"` (header nav target).

- [ ] **Step 1: Create the styles**

Create `src/components/HostSection/HostSection.styles.js`:

```js
import styled from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const HostRoot = styled.section`
  color: ${colors.ink};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.ochre};
`;

export const HostInner = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 45px;
  align-items: center;
  padding-block: clamp(72px, 8vw, 104px);

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr auto;
  }
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const HostHeading = styled.h2`
  max-width: 15ch;
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.8rem, 5vw, 4.7rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.94;

  em {
    color: ${colors.maroon};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const HostCopy = styled.p`
  max-width: 57ch;
  margin-top: 18px;
`;

export const HostButton = styled(Button)`
  width: 100%;
  color: ${colors.white};
  border-color: ${colors.ink};
  background: ${colors.forestDeep};
  box-shadow: 5px 5px 0 ${colors.maroon};

  @media (min-width: ${breakpoints.tablet}) {
    width: auto;
  }

  &:focus-visible {
    box-shadow: 0 0 0 5px ${colors.ink};
  }
`;
```

- [ ] **Step 2: Create the component**

Create `src/components/HostSection/index.js`:

```jsx
import { TYPEFORM_URL } from 'data/links';

import {
  Eyebrow,
  HostButton,
  HostCopy,
  HostHeading,
  HostInner,
  HostRoot,
} from './HostSection.styles';

const HostSection = () => (
  <HostRoot id="host">
    <HostInner>
      <div>
        <Eyebrow>Host a Fest</Eyebrow>
        <HostHeading>
          Bring Hacktoberfest to <em>your city.</em>
        </HostHeading>
        <HostCopy>
          Anyone can host a Hacktober Fest &mdash; university clubs, meetup
          groups, a few coworkers who can book a room. Hacktoberfest provides
          funding to help cover your event, plus swag and organizer support.
          Applications open soon.
        </HostCopy>
      </div>
      <HostButton href={TYPEFORM_URL}>
        Get notified when hosting opens
      </HostButton>
    </HostInner>
  </HostRoot>
);

export default HostSection;
```

- [ ] **Step 3: Verify formatting and commit**

Run: `npm run test` (expected: exit 0), then:

```bash
git add src/components/HostSection
git commit -m "Add HostSection pitching community-hosted Fests"
```

---

### Task 10: SponsorSection (new, replaces JoinSection at page bottom)

**Files:**

- Create: `src/components/SponsorSection/SponsorSection.styles.js`
- Create: `src/components/SponsorSection/index.js`

**Interfaces:**

- Consumes: `SPONSOR_MAILTO` from `data/links`, `Button`, `Shell`, tokens.
- Produces: default export `SponsorSection`.

- [ ] **Step 1: Create the styles**

Create `src/components/SponsorSection/SponsorSection.styles.js`:

```js
import styled from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const SponsorRoot = styled.section`
  color: ${colors.ink};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.pink};
`;

export const SponsorInner = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 45px;
  align-items: center;
  padding-block: clamp(72px, 8vw, 104px);

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr auto;
  }
`;

export const SponsorHeading = styled.h2`
  max-width: 15ch;
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(2.8rem, 5vw, 4.7rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.94;

  em {
    color: ${colors.maroon};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const SponsorCopy = styled.p`
  max-width: 57ch;
  margin-top: 18px;
`;

export const SponsorButton = styled(Button)`
  width: 100%;
  color: ${colors.white};
  border-color: ${colors.ink};
  background: ${colors.forestDeep};
  box-shadow: 5px 5px 0 ${colors.maroon};

  @media (min-width: ${breakpoints.tablet}) {
    width: auto;
  }

  &:focus-visible {
    box-shadow: 0 0 0 5px ${colors.ink};
  }
`;
```

- [ ] **Step 2: Create the component**

Create `src/components/SponsorSection/index.js`:

```jsx
import { SPONSOR_MAILTO } from 'data/links';

import {
  SponsorButton,
  SponsorCopy,
  SponsorHeading,
  SponsorInner,
  SponsorRoot,
} from './SponsorSection.styles';

const SponsorSection = () => (
  <SponsorRoot id="sponsor">
    <SponsorInner>
      <div>
        <SponsorHeading>
          Put your name behind <em>open AI.</em>
        </SponsorHeading>
        <SponsorCopy>
          Hacktoberfest 2026 reaches developers in 300+ cities and online
          worldwide. Sponsors make the Fests, the shirts, and the community
          support possible.
        </SponsorCopy>
      </div>
      <SponsorButton href={SPONSOR_MAILTO}>Sponsor Hacktoberfest</SponsorButton>
    </SponsorInner>
  </SponsorRoot>
);

export default SponsorSection;
```

- [ ] **Step 3: Verify formatting and commit**

Run: `npm run test` (expected: exit 0), then:

```bash
git add src/components/SponsorSection
git commit -m "Add SponsorSection as the closing sponsorship CTA"
```

---

### Task 11: Page assembly, header nav, and retiring old sections

**Files:**

- Modify: `src/pages/index.js`
- Modify: `src/components/Header/index.js`
- Delete: `src/components/PathSection/`, `src/components/DeclarationSection/`, `src/components/JoinSection/`

**Interfaces:**

- Consumes: all section components from Tasks 1–10, `TYPEFORM_URL` from `data/links`.
- Produces: the assembled page.

- [ ] **Step 1: Rewrite the page shell**

Replace the entire body of `src/pages/index.js` with:

```jsx
import Head from 'next/head';

import CurriculumSection from 'components/CurriculumSection';
import EraSection from 'components/EraSection';
import FestsSection from 'components/FestsSection';
import Header from 'components/Header';
import Hero from 'components/Hero';
import HostSection from 'components/HostSection';
import MissionSection from 'components/MissionSection';
import PartnerStrip from 'components/PartnerStrip';
import Rally from 'components/Rally';
import SponsorSection from 'components/SponsorSection';
import WaysInSection from 'components/WaysInSection';

const Home = () => (
  <>
    <Head>
      <title>Hacktoberfest 2026 | AI belongs to everyone</title>
      <meta
        name="description"
        content="300+ in-person Hacktober Fests plus a global online event, all about building with open AI. Join a hack day near you this October."
      />
      <meta name="theme-color" content="#3d5f58" />
      <link
        rel="alternate"
        type="text/plain"
        href="/llms.txt"
        title="Hacktoberfest 2026 for AI agents"
      />
      <link
        rel="alternate"
        type="text/plain"
        href="/llms-full.txt"
        title="Complete Hacktoberfest 2026 context"
      />
    </Head>
    <Header />
    <main id="main">
      <Hero />
      <PartnerStrip />
      <Rally />
      <EraSection />
      <FestsSection />
      <WaysInSection />
      <CurriculumSection />
      <MissionSection />
      <HostSection />
      <SponsorSection />
    </main>
  </>
);

export default Home;
```

- [ ] **Step 2: Update the header nav**

Replace the entire body of `src/components/Header/index.js` with:

```jsx
import HacktoberfestLogo from 'components/icons/HacktoberfestLogo';
import { TYPEFORM_URL } from 'data/links';

import {
  HeaderRoot,
  Logo,
  Nav,
  NavCta,
  NavLink,
  NavLinks,
  SkipLink,
  Wordmark,
} from './Header.styles';

const Header = () => (
  <>
    <SkipLink href="#main">Skip to content</SkipLink>
    <HeaderRoot>
      <Nav as="nav" aria-label="Main navigation">
        <Wordmark href="#top" aria-label="Hacktoberfest 2026 home">
          <Logo as={HacktoberfestLogo} />
        </Wordmark>
        <NavLinks>
          <NavLink href="#fests">The Fests</NavLink>
          <NavLink href="#take-part">How to take part</NavLink>
          <NavLink href="#host">Host a Fest</NavLink>
          <NavCta href={TYPEFORM_URL}>Join Hacktoberfest</NavCta>
        </NavLinks>
      </Nav>
    </HeaderRoot>
  </>
);

export default Header;
```

- [ ] **Step 3: Delete the retired components**

```bash
git rm -r src/components/PathSection src/components/DeclarationSection src/components/JoinSection
```

- [ ] **Step 4: Verify nothing still imports the deleted components**

Run: `grep -rn "PathSection\|DeclarationSection\|JoinSection" src`
Expected: no output.

- [ ] **Step 5: Verify the site builds**

Run: `npm run build`
Expected: `build:custom` and `next build` both complete without errors (static export succeeds).

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.js src/components/Header/index.js
git commit -m "Assemble the event-first 2026 page and retire replaced sections"
```

---

### Task 12: Update llms.txt and llms-full.txt

**Files:**

- Modify: `public/llms.txt`
- Modify: `public/llms-full.txt`

**Interfaces:**

- Consumes: final page copy from Tasks 2–10 (these files must mirror the page — if any copy was adjusted during implementation, mirror the adjusted version).
- Produces: plain-text context files served at `/llms.txt` and `/llms-full.txt`.

- [ ] **Step 1: Rewrite public/llms.txt**

Replace the file's entire contents with:

```markdown
# Hacktoberfest 2026

> 300+ in-person hack days plus a global online event, October 2026. Hacktoberfest is now about building with open AI.

Hacktoberfest is an annual event run by Major League Hacking, powered by DEV x MLH with presenting partner DigitalOcean. In 2026 it becomes an event you attend: community-hosted, one-day "Hacktober Fests" in 300+ cities, plus an online event for everyone else. The focus is hands-on building with AI models anyone can download, inspect, and build with.

## Start here

- [Hacktoberfest 2026](./): Read the event overview and sign up.
- [Complete event context](./llms-full.txt): Fetch the full public copy from the Hacktoberfest 2026 website in one plain-text file.
- Sign-ups for attending and hosting both go through a single interest form linked from the page.

## What changes in 2026

When Hacktoberfest started, open source had a contributor problem, and a simple pull-request challenge brought millions of contributors in. Today AI tools have made contributing so easy that maintainers review more pull requests than they can handle. Hacktoberfest 2026 redirects the community's energy to understanding and building with open AI — in person, together.

## Ways to take part

- [In person](./#take-part): Join a Hacktober Fest — a one-day, in-person mini-hackathon hosted by a local community. Attendees earn the limited-edition 2026 t-shirt, only available in person.
- [Online](./#take-part): Build challenges throughout October plus community events like Global Hack Week. Online participants earn the 2026 sticker pack by mail.
- [Host](./#host): Anyone can host a Hacktober Fest. Hacktoberfest provides funding, swag, and organizer support. Applications open soon.

## What you'll build

- [Open models](./#explore): Download a model with open weights and run it on hardware you control.
- [Open tools](./#explore): Run a model through an open source harness — agents, retrieval, evals — and change the parts.
- [Inference](./#explore): Serve a model locally or on your own infrastructure; learn quantization, latency, and cost.
- [Practice](./#explore): Build something another developer can run, then demo it at a Fest or online.

## Sponsorship

- Contact sales@mlh.io to sponsor Hacktoberfest 2026.
```

- [ ] **Step 2: Rewrite public/llms-full.txt**

Replace the file's entire contents with the following (if any copy was adjusted during Tasks 2–10, mirror the adjusted version — this file must match the shipped page exactly):

```markdown
# Hacktoberfest 2026 — Complete site copy

## Hero

October 2026 · 300+ cities · In person and online

Hacktoberfest 2026: AI belongs to everyone.

This October, Hacktoberfest comes to your city. Join a one-day Hacktober Fest near you — or take part online from anywhere — and get hands-on with AI models anyone can download, inspect, and build with.

CTAs: Join Hacktoberfest (interest form) · What's a Hacktober Fest? (#fests)

Snapshot: Your Hacktoberfest, OCT 2026. 300+ hack days. One global celebration. 01 Find a Fest in your city / 02 Or join online from anywhere / 03 Build with open AI models.

## Partners

Powered by DEV x MLH. Presenting partner: DigitalOcean.

## The idea

A healthy AI ecosystem needs open in the mix. This October, the whole Hacktoberfest community is building it.

## What changes in 2026

Hacktoberfest becomes something you attend.

When Hacktoberfest started, open source had a contributor problem. Projects needed people, and a simple pull-request challenge brought millions of them in.

Today, AI tools have made contributing so easy that maintainers review more pull requests than they can handle. Getting new contributors isn't the problem anymore — understanding the AI behind those tools, and keeping it open, is where the community's energy is needed now.

So this year, Hacktoberfest is hundreds of in-person hack days plus a global online event, all about building with open AI.

2014-2025: Open the door to open source. A simple pull-request challenge introduced a generation of developers to open source. It worked.

2026: Get hands-on with open AI, together. Meet up in person, run models you can download and inspect, and build something real in a day.

## The Fests

A Hacktober Fest is a hack day in your city.

A Hacktober Fest is a one-day, in-person mini-hackathon: a few hours with local developers, food, and hardware, building something real with open AI models. No experience with open models required — every Fest has guided challenges to start from.

Hundreds are happening across the world this October, hosted by local communities with support from Hacktoberfest.

At a Fest you'll: 01 Run an open model on real hardware / 02 Build and demo a project in a day / 03 Meet the developers in your city.

## How to take part

Two ways in. Pick yours.

Sign up once and tell us how you want to take part — we'll point you to a Fest near you or to the online event.

In person: Join a Fest near you. Build for a day with your local community and demo what you made. Earn the limited-edition Hacktoberfest 2026 t-shirt — only available by attending in person. (CTA: Join a Fest)

Online: Join from anywhere. Take on build challenges throughout October and join community events like Global Hack Week. Earn the 2026 sticker pack, mailed anywhere in the world. (CTA: Join online)

## What you'll build

Go under the hood of modern AI.

There's more to AI than the handful of chatbots everyone knows. This October, you'll work with the open ecosystem underneath.

01 / MODELS — Start with an open model. Download a model with open weights and run it. See what it can do on hardware you control. (weights, licenses, evaluation)

02 / TOOLS — Swap in open tools. Go up the stack: run your model through an open source harness — agents, retrieval, evals — and change the parts instead of treating the system as one black box. (agents, RAG, evals)

03 / INFRASTRUCTURE — Own your inference. Serve a model locally or on your own infrastructure. Learn what quantization, latency, and cost actually mean in practice. (local, cloud, quantization)

04 / PRACTICE — Ship and show it. Build something another developer can run — then demo it at your Fest or share it online. (build, demo, share)

## The mission

Why we're doing this.

Hacktoberfest has always been about empowering people to build the open web together. For years, we measured that energy by counting pull requests. But open source was never defined by a PR counter. Open source is a philosophy centered on transparency and collective ownership.

Today, that philosophy faces its biggest test. The defining technology of our era is AI, and the question of our time is simple: who gets to control the future of intelligence?

AI shouldn't be locked inside black boxes or restricted by closed gatekeepers. Democratizing AI means keeping innovation transparent, accessible, and in the hands of the people. From open-weight models to open agents and beyond, creators and curious minds of all backgrounds deserve the opportunity to experiment and build.

This year, we're moving beyond counting PRs. Hacktoberfest is refocusing on what matters most: giving everyone the tools and knowledge to learn, experiment, and build with open artificial intelligence.

## Host a Fest

Bring Hacktoberfest to your city.

Anyone can host a Hacktober Fest — university clubs, meetup groups, a few coworkers who can book a room. Hacktoberfest provides funding to help cover your event, plus swag and organizer support. Applications open soon.

CTA: Get notified when hosting opens (interest form)

## Sponsor

Put your name behind open AI.

Hacktoberfest 2026 reaches developers in 300+ cities and online worldwide. Sponsors make the Fests, the shirts, and the community support possible.

CTA: Sponsor Hacktoberfest (sales@mlh.io)
```

- [ ] **Step 3: Verify no stale references remain**

Run: `grep -n "pull request totals\|Awareness\|Advocacy\|hi@mlh.io" public/llms.txt public/llms-full.txt`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add public/llms.txt public/llms-full.txt
git commit -m "Mirror the 2026 event-first content in llms context files"
```

---

### Task 13: Full verification pass

**Files:**

- No new files; fixes only if verification fails.

- [ ] **Step 1: Formatting and build**

Run: `npm run test`
Expected: exit 0.

Run: `npm run build`
Expected: completes without errors.

- [ ] **Step 2: Rendered-page verification**

Start the dev server (`npm run dev` or the browser-preview tooling) and verify:

1. Section order top to bottom: Header → Hero → PartnerStrip → Rally → EraSection → FestsSection → WaysInSection → CurriculumSection → MissionSection → HostSection → SponsorSection → Footer.
2. Header nav links scroll to `#fests`, `#take-part`, `#host`; hero secondary CTA scrolls to `#fests`.
3. All join/host CTAs point at the placeholder `#` (Typeform pending); sponsor button opens `mailto:sales@mlh.io`.
4. Partner strip shows POWERED BY (DEV × MLH) and PRESENTING PARTNER (DigitalOcean) below the hero without scrolling on a 1280px-wide viewport.
5. Mobile width (375px): all new sections stack cleanly, no horizontal overflow.
6. No console errors.

- [ ] **Step 3: Commit any fixes**

If fixes were needed, commit them:

```bash
git add -A
git commit -m "Fix issues found in final verification"
```

---

## Self-Review Notes

- Spec coverage: spec sections 1–10 map to Tasks 2 (hero), 1 (partner strip), 3 (rally), 4 (era), 5 (fests), 6 (ways in + rewards), 7 (curriculum), 8 (mission), 9 (host), 10 (sponsor); cross-cutting items map to Tasks 11–12; error-handling/testing section maps to Task 13.
- Open items from the spec (Typeform URL, revised mission copy, official DEV/DigitalOcean SVGs) are wired for one-line/one-paste swaps in `src/data/links.js`, `MissionSection/index.js`, and Task 1's marked components.
- Deliberate deviation from spec: no slim "join reminder" bar above the sponsor section (spec marked it optional/implementation judgment; hero + WaysIn + header CTA already cover the join ask — YAGNI).
