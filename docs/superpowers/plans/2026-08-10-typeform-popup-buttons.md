# Typeform Popup Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open every Hacktoberfest Typeform CTA in an SDK-managed popup without losing placement tracking or host/attendee preselection.

**Architecture:** Add the official Typeform React Embed library behind one shared `TypeformButton` adapter. Model popup inputs separately from ordinary outbound links, then render the adapter through the existing styled-components CTA definitions.

**Tech Stack:** Next.js 15, React 19, styled-components 6, `@typeform/embed-react` 5, Node 20 built-in test runner

## Global Constraints

- Use Typeform's official React `PopupButton`.
- Convert the CTAs in `Header`, `Hero`, `GetInvolvedSection`, and dormant `WaysInSection`.
- Preserve both form IDs, all `hacktoberfest-2026` UTM values, and every `organizer_interest` value.
- Keep partner links and all other non-Typeform navigation as anchors.
- Add no callbacks, auto-close behavior, custom modal lifecycle, or fallback navigation.
- Retain the existing CTA appearance, focus treatment, and responsive layout.

## File Map

- `package.json`, `package-lock.json`: SDK dependency and test commands.
- `src/components/TypeformButton.mjs`: shared SDK adapter.
- `src/data/campaign.mjs`: shared campaign parameter construction.
- `src/data/typeforms.mjs`: form IDs, tracking, and URL parameters.
- `src/data/links.js`: ordinary outbound-link generation only.
- `src/components/Button.js`: reusable CTA CSS for anchors and popup buttons.
- `src/components/{Header,Hero,GetInvolvedSection,WaysInSection}`: popup wiring and styling.
- `test/typeform-button.test.mjs`: real-SDK adapter regression test.
- `test/typeform-config.test.mjs`: form configuration regression tests.
- `test/typeform-pages.test.mjs`: exported-page acceptance tests.

---

### Task 1: Add and test the shared popup trigger

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `test/typeform-button.test.mjs`
- Create: `src/components/TypeformButton.mjs`

**Interfaces:**

- Consumes: `PopupButton` and `form: { id, tracking, hidden? }`.
- Produces: default `TypeformButton({ children, form, ...buttonProps })`, including forwarded `className` support.

- [ ] **Step 1: Install the SDK and register test commands**

Run:

```bash
npm install @typeform/embed-react@^5.0.0
```

Set these package scripts (the later test files are added by Tasks 2 and 3):

```json
"test": "npm run test:unit && npm run test:integration && prettier --check --ignore-unknown .",
"test:unit": "node --test test/typeform-button.test.mjs test/typeform-config.test.mjs",
"test:integration": "npm run build && node --test test/typeform-pages.test.mjs"
```

- [ ] **Step 2: Write the failing adapter test**

Create `test/typeform-button.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import TypeformButton from '../src/components/TypeformButton.mjs';

test('renders an SDK popup trigger as a button without an outbound link', () => {
  const markup = renderToStaticMarkup(
    createElement(
      TypeformButton,
      {
        className: 'test-cta',
        form: {
          id: 'form-id',
          tracking: { utm_content: 'test-cta' },
          hidden: { organizer_interest: 'true' },
        },
      },
      'Open form',
    ),
  );

  assert.match(markup, /^<button/);
  assert.match(markup, /class="test-cta"/);
  assert.match(markup, /type="button"/);
  assert.doesNotMatch(markup, /\shref=/);
  assert.match(markup, />Open form<\/button>$/);
});
```

- [ ] **Step 3: Verify the red state**

Run: `node --test test/typeform-button.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `TypeformButton.mjs`.

- [ ] **Step 4: Implement the minimal adapter**

Create `src/components/TypeformButton.mjs`:

```js
import { createElement } from 'react';
import { PopupButton } from '@typeform/embed-react';

const TypeformButton = ({ children, form, ...buttonProps }) =>
  createElement(
    PopupButton,
    { ...form, ...buttonProps, type: 'button' },
    children,
  );

export default TypeformButton;
```

- [ ] **Step 5: Verify the green state**

Run: `node --test test/typeform-button.test.mjs`

Expected: PASS with `1` test and `0` failures.

- [ ] **Step 6: Format and commit**

```bash
npx prettier --write package.json package-lock.json test/typeform-button.test.mjs src/components/TypeformButton.mjs
git add package.json package-lock.json test/typeform-button.test.mjs src/components/TypeformButton.mjs
git commit -m "test: cover Typeform popup trigger"
```

---

### Task 2: Model campaign and popup configuration

**Files:**

- Create: `test/typeform-config.test.mjs`
- Create: `src/data/campaign.mjs`
- Create: `src/data/typeforms.mjs`
- Modify: `src/data/links.js`

**Interfaces:**

- Consumes: a placement name and optional Typeform URL parameters.
- Produces: `campaignFor(content)` plus `NAV_JOIN_FORM`, `HERO_HOST_FORM`, `HERO_ATTEND_FORM`, `HOST_A_FEST_FORM`, `SPONSOR_FORM`, `WAYS_IN_PERSON_FORM`, and `WAYS_ONLINE_FORM`.

- [ ] **Step 1: Write the failing configuration tests**

Create `test/typeform-config.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  HERO_ATTEND_FORM,
  HERO_HOST_FORM,
  HOST_A_FEST_FORM,
  NAV_JOIN_FORM,
  SPONSOR_FORM,
  WAYS_IN_PERSON_FORM,
  WAYS_ONLINE_FORM,
} from '../src/data/typeforms.mjs';

const campaign = (content) => ({
  utm_source: 'hacktoberfest.com',
  utm_medium: 'website',
  utm_campaign: 'hacktoberfest-2026',
  utm_content: content,
});

test('configures every interest popup with placement attribution', () => {
  assert.deepEqual(NAV_JOIN_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('nav-join'),
  });
  assert.deepEqual(HERO_HOST_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('hero-host'),
    hidden: { organizer_interest: 'true' },
  });
  assert.deepEqual(HERO_ATTEND_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('hero-attend'),
    hidden: { organizer_interest: 'false' },
  });
  assert.deepEqual(HOST_A_FEST_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('get-involved-host'),
    hidden: { organizer_interest: 'true' },
  });
  assert.deepEqual(WAYS_IN_PERSON_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('ways-in-person'),
    hidden: { organizer_interest: 'false' },
  });
  assert.deepEqual(WAYS_ONLINE_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('ways-online'),
    hidden: { organizer_interest: 'false' },
  });
});

test('configures the sponsor popup with its own form', () => {
  assert.deepEqual(SPONSOR_FORM, {
    id: 'kShwvA2e',
    tracking: campaign('get-involved-sponsor'),
  });
});
```

- [ ] **Step 2: Verify the red state**

Run: `node --test test/typeform-config.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `typeforms.mjs`.

- [ ] **Step 3: Implement shared campaign construction**

Create `src/data/campaign.mjs`:

```js
const CAMPAIGN = {
  utm_source: 'hacktoberfest.com',
  utm_medium: 'website',
  utm_campaign: 'hacktoberfest-2026',
};

export const campaignFor = (content) => ({
  ...CAMPAIGN,
  utm_content: content,
});
```

- [ ] **Step 4: Implement every popup configuration**

Create `src/data/typeforms.mjs`:

```js
import { campaignFor } from './campaign.mjs';

const INTEREST_FORM_ID = 'JIRQyVOq';
const SPONSOR_FORM_ID = 'kShwvA2e';

const popup = (id, content, hidden) => ({
  id,
  tracking: campaignFor(content),
  ...(hidden === undefined ? {} : { hidden }),
});

export const NAV_JOIN_FORM = popup(INTEREST_FORM_ID, 'nav-join');
export const HERO_HOST_FORM = popup(INTEREST_FORM_ID, 'hero-host', {
  organizer_interest: 'true',
});
export const HERO_ATTEND_FORM = popup(INTEREST_FORM_ID, 'hero-attend', {
  organizer_interest: 'false',
});
export const HOST_A_FEST_FORM = popup(INTEREST_FORM_ID, 'get-involved-host', {
  organizer_interest: 'true',
});
export const SPONSOR_FORM = popup(SPONSOR_FORM_ID, 'get-involved-sponsor');
export const WAYS_IN_PERSON_FORM = popup(INTEREST_FORM_ID, 'ways-in-person', {
  organizer_interest: 'false',
});
export const WAYS_ONLINE_FORM = popup(INTEREST_FORM_ID, 'ways-online', {
  organizer_interest: 'false',
});
```

- [ ] **Step 5: Restrict `links.js` to ordinary outbound URLs**

Replace `src/data/links.js` with this ordinary-link-only implementation:

```js
import { campaignFor } from './campaign.mjs';

/* Ordinary outbound links and Typeform popups use the same campaign values;
   utm_content distinguishes each individual placement. */
const tagged = (base, { content, ...extra }) => {
  const url = new URL(base);
  const params = { ...campaignFor(content), ...extra };

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  return url.toString();
};

export const MLH_URL = tagged('https://mlh.com', { content: 'partner-mlh' });

export const DEV_URL = tagged('https://dev.to', { content: 'partner-dev' });

export const DIGITALOCEAN_URL = tagged('https://www.digitalocean.com', {
  content: 'partner-digitalocean',
});
```

- [ ] **Step 6: Verify the green state**

Run:

```bash
node --test test/typeform-button.test.mjs test/typeform-config.test.mjs
```

Expected: PASS with `3` tests and `0` failures.

- [ ] **Step 7: Format and commit**

```bash
npx prettier --write src/data/campaign.mjs src/data/typeforms.mjs src/data/links.js test/typeform-config.test.mjs
git add src/data/campaign.mjs src/data/typeforms.mjs src/data/links.js test/typeform-config.test.mjs
git commit -m "refactor: model Typeform popup configuration"
```

---

### Task 3: Render every Typeform CTA through the adapter

**Files:**

- Create: `test/typeform-pages.test.mjs`
- Modify: `src/components/Button.js`
- Modify: `src/components/Header/index.js`
- Modify: `src/components/Header/Header.styles.js`
- Modify: `src/components/Hero/index.js`
- Modify: `src/components/Hero/Hero.styles.js`
- Modify: `src/components/GetInvolvedSection/index.js`
- Modify: `src/components/GetInvolvedSection/GetInvolvedSection.styles.js`
- Modify: `src/components/WaysInSection/index.js`
- Modify: `src/components/WaysInSection/WaysInSection.styles.js`

**Interfaces:**

- Consumes: `TypeformButton`, all seven popup configurations, and `buttonStyles`.
- Produces: exported homepage and standalone pages with popup buttons and no outbound Typeform anchors.

- [ ] **Step 1: Write the failing exported-page acceptance test**

Create `test/typeform-pages.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readOutput = (path) =>
  readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');
const buttonFor = (label) => new RegExp(`<button[^>]*>${label}</button>`, 'g');

test('exports every visible homepage Typeform CTA as a button', async () => {
  const html = await readOutput('index.html');
  const labels = [
    'Join Hacktoberfest',
    'Host a Hacktober Fest',
    'Sign up to attend',
    'Get notified when hosting opens',
    'Sponsor Hacktoberfest',
  ];

  labels.forEach((label) => assert.match(html, buttonFor(label)));
  assert.doesNotMatch(html, /majorleaguehacking\.typeform\.com\/to\//);
});

test('exports the standalone header CTA as a button', async () => {
  const pages = await Promise.all([
    readOutput('404.html'),
    readOutput('subscribed/index.html'),
  ]);

  pages.forEach((html) => {
    assert.match(html, buttonFor('Join Hacktoberfest'));
    assert.doesNotMatch(html, /majorleaguehacking\.typeform\.com\/to\//);
  });
});
```

- [ ] **Step 2: Build and verify the red state**

Run:

```bash
npm run build
node --test test/typeform-pages.test.mjs
```

Expected: build succeeds, then the test FAILS because the current export uses
anchors and contains outbound Typeform URLs.

- [ ] **Step 3: Share CTA CSS with popup buttons**

Replace `src/components/Button.js` with:

```js
import styled, { css } from 'styled-components';

import { colors, fonts } from 'styles/tokens';

export const buttonStyles = css`
  appearance: none;
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  padding: 12px 22px;
  color: ${colors.ink};
  border: 2px solid ${colors.ink};
  background: ${colors.pink};
  box-shadow: 5px 5px 0 ${colors.maroon};
  cursor: pointer;
  font-family: ${fonts.mono};
  font-size: 0.85rem;
  font-weight: 650;
  letter-spacing: 0.02em;
  line-height: 1.1;
  text-align: center;
  text-decoration: none;
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 3px 3px 0 ${colors.maroon};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 5px ${colors.ink};
  }

  ${(props) =>
    props.$variant === 'secondary' &&
    css`
      color: ${colors.white};
      border-color: rgba(255, 255, 255, 0.72);
      background: transparent;
      box-shadow: none;

      &:hover {
        color: ${colors.ink};
        background: ${colors.white};
      }
    `}
`;

const Button = styled.a`
  ${buttonStyles}
`;

export default Button;
```

`MessagePage` continues to use the default anchor `Button`.

- [ ] **Step 4: Wire the shared header CTA**

In `Header/index.js`, import `NAV_JOIN_FORM` from `data/typeforms.mjs` and use:

```jsx
<NavCta form={NAV_JOIN_FORM}>Join Hacktoberfest</NavCta>
```

In `Header.styles.js`, import `TypeformButton` and replace `NavCta` with:

```js
export const NavCta = styled(TypeformButton)`
  appearance: none;
  margin-right: 4px;
  padding: 8px 11px;
  color: ${colors.ink};
  border: 2px solid ${colors.ink};
  background: ${colors.pink};
  box-shadow: 4px 4px 0 ${colors.maroon};
  cursor: pointer;
  font-family: inherit;
  font-size: 0.66rem;
  font-weight: 650;
  line-height: inherit;
  white-space: nowrap;
  text-decoration: none;
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 ${colors.maroon};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: 10px 17px;
    font-size: inherit;
  }
`;
```

- [ ] **Step 5: Wire the hero CTAs**

In `Hero/index.js`, replace the URL imports with `HERO_HOST_FORM` and
`HERO_ATTEND_FORM` from `data/typeforms.mjs`, then render:

```jsx
<HeroButton form={HERO_HOST_FORM}>Host a Hacktober Fest</HeroButton>
<HeroButton form={HERO_ATTEND_FORM}>Sign up to attend</HeroButton>
```

In `Hero.styles.js`, import `buttonStyles` and `TypeformButton`, then preserve
the width declarations under:

```js
export const HeroButton = styled(TypeformButton)`
  ${buttonStyles}
  width: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    width: auto;
  }
`;
```

- [ ] **Step 6: Wire the Get Involved CTAs**

In `GetInvolvedSection/index.js`, replace the URL imports with
`HOST_A_FEST_FORM` and `SPONSOR_FORM`, change each card's `href` field to
`form`, and render:

```jsx
<InvolvedButton form={card.form}>{card.cta}</InvolvedButton>
```

In its styles file, import `buttonStyles` and `TypeformButton`, then use:

```js
export const InvolvedButton = styled(TypeformButton)`
  ${buttonStyles}
  align-self: start;
  margin-top: auto;
`;
```

- [ ] **Step 7: Make the dormant Ways section popup-ready**

In `WaysInSection/index.js`, use `WAYS_IN_PERSON_FORM` and
`WAYS_ONLINE_FORM`, change each `href` field to `form`, and render:

```jsx
<WaysButton form={way.form}>{way.cta}</WaysButton>
```

In its styles file, import `buttonStyles` and `TypeformButton`, then use:

```js
export const WaysButton = styled(TypeformButton)`
  ${buttonStyles}
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

- [ ] **Step 8: Build and verify the green state**

Run:

```bash
npm run build
node --test test/typeform-pages.test.mjs
```

Expected: build succeeds; both tests pass; the homepage contains all five CTA
buttons and no outbound Typeform URL; both standalone pages contain the header
button.

- [ ] **Step 9: Run all focused tests**

Run:

```bash
node --test test/typeform-button.test.mjs test/typeform-config.test.mjs test/typeform-pages.test.mjs
```

Expected: PASS with `5` tests and `0` failures.

- [ ] **Step 10: Format and commit**

```bash
npx prettier --write src/components/Button.js src/components/Header src/components/Hero src/components/GetInvolvedSection src/components/WaysInSection test/typeform-pages.test.mjs package.json
git add src/components/Button.js src/components/Header src/components/Hero src/components/GetInvolvedSection src/components/WaysInSection test/typeform-pages.test.mjs package.json
git commit -m "feat: open Typeform CTAs in popups"
```

---

### Task 4: Final verification

**Files:** Verify only; no planned production edits.

**Interfaces:** Consumes the complete implementation and produces fresh test,
build, formatting, and patch-hygiene evidence.

- [ ] **Step 1: Run the repository test command**

Run: `npm test`

Expected: unit tests pass, the integration build succeeds, exported-page tests
pass, and Prettier reports all matched files formatted.

- [ ] **Step 2: Check patch hygiene and scope**

```bash
git diff --check
git status --short
rg -n "typeform\.com/to|_URL.*FORM|href=\{.*FORM" src
```

Expected: `git diff --check` exits `0`; status contains only intentional files;
the search finds no obsolete outbound Typeform URLs or form values passed to
`href`.

- [ ] **Step 3: Review the implementation commits**

```bash
git log --oneline -4
git diff HEAD~3..HEAD --stat
```

Expected: adapter, configuration, and page wiring are separate reviewable
commits with no unrelated files.
