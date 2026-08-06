# FAQ Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a collapsible five-question FAQ to the bottom of the landing page, rendering from the same copy source that feeds the crawler files and the JSON-LD.

**Architecture:** Copy lives in `src/data/content.mjs` as a `faq` export whose answers are arrays of segments (prose, outbound link, or Typeform popup trigger). A new `FaqSection` renders them with native `<details>`/`<summary>`; `structuredData.js` and `build/llms.mjs` render the same array as schema and plain text. No new runtime dependencies.

**Tech Stack:** Next.js pages router, styled-components, `@typeform/embed-react`, `node --test`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-11-faq-section-design.md`.
- Copy is used **verbatim as supplied**. Do not reword, expand, or "improve" any question or answer.
- Apostrophes are typographic (`’`), matching the rest of `content.mjs`.
- Never link to a Typeform URL with a plain `<a href>` — `test/typeform-pages.test.mjs` fails the build if you do. Typeform always goes through `TypeformButton`.
- Files importable by `src/build/*.mjs` must be `.mjs` — the package is CommonJS, so a `.js` file with `export` cannot be imported by the build scripts. `content.mjs` and `typeforms.mjs` are already `.mjs`; keep it that way.
- Section styling matches its siblings: `padding-block: clamp(80px, 9vw, 124px)`, `border-bottom: 2px solid ${colors.ink}`.
- Run the full suite with `BASE_URL=https://hacktoberfest.com npm test`. Without `BASE_URL` the sitemap step throws and the build stops before the llms files are written.
- The dev server and `npm run build` share `.next`. After running a build, `rm -rf .next` before restarting the dev server or the page 500s with `Cannot find module './chunks/vendor-chunks/next.js'`.

---

### Task 1: FAQ copy and popup configs

**Files:**

- Modify: `src/data/content.mjs` (append after the `getInvolved` export)
- Modify: `src/data/typeforms.mjs` (append after `HOST_A_FEST_FORM`)
- Modify: `package.json:17` (add the new unit test file to `test:unit`)
- Create: `test/faq-content.test.mjs`
- Modify: `test/typeform-config.test.mjs`

**Interfaces:**

- Produces: `faq` — `{ eyebrow, heading: { lead, accent }, intro, items }` where each item is `{ id, question, answer }` and `answer` is an array of segments.
- Produces: `answerText(answer) => string` — segment texts joined, no URLs.
- Produces: `answerLinks(answer) => string[]` — the `href` of every link segment, in order.
- Produces: `FAQ_HOST_FORM`, `FAQ_UPDATES_FORM` from `src/data/typeforms.mjs`.
- Consumed by: Tasks 2, 3, 4, 5.

- [ ] **Step 1: Write the failing tests for the copy helpers**

Create `test/faq-content.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';

import { answerLinks, answerText, faq } from '../src/data/content.mjs';

test('every FAQ item has a stable id, a question and a non-empty answer', () => {
  assert.equal(faq.items.length, 5);

  const ids = faq.items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, 'ids must be unique');

  faq.items.forEach((item) => {
    assert.ok(item.question.length > 0, `${item.id} needs a question`);
    assert.ok(item.answer.length > 0, `${item.id} needs an answer`);
    item.answer.forEach((segment) =>
      assert.ok(segment.text.length > 0, `${item.id} has an empty segment`),
    );
  });
});

test('answerText joins the prose without leaking URLs into it', () => {
  const answer = [
    { text: 'Read the ' },
    { text: 'policy', href: 'https://example.com/policy' },
    { text: ' first.' },
  ];

  assert.equal(answerText(answer), 'Read the policy first.');
});

test('answerLinks collects link destinations in order', () => {
  const answer = [
    { text: 'One ' },
    { text: 'a', href: 'https://example.com/a' },
    { text: ' and ' },
    { text: 'b', href: 'https://example.com/b' },
  ];

  assert.deepEqual(answerLinks(answer), [
    'https://example.com/a',
    'https://example.com/b',
  ]);
});

test('the two signup links point at popups, not raw URLs', () => {
  const segments = faq.items.flatMap((item) => item.answer);
  const formSegments = segments.filter((segment) => segment.form);

  assert.deepEqual(
    formSegments.map((segment) => segment.form),
    ['faqHost', 'faqUpdates'],
  );
  // A Typeform URL in an href would render as an anchor and fail the
  // no-outbound-anchor rule in test/typeform-pages.test.mjs.
  segments
    .filter((segment) => segment.href)
    .forEach((segment) =>
      assert.doesNotMatch(segment.href, /typeform\.com/i, segment.text),
    );
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test test/faq-content.test.mjs`
Expected: FAIL — `SyntaxError: The requested module '../src/data/content.mjs' does not provide an export named 'answerLinks'`

- [ ] **Step 3: Add the copy and helpers to `src/data/content.mjs`**

Append after the `getInvolved` export, before `subscribed`:

```js
/* Answers are arrays of segments rather than plain strings, because three of
   them contain a link. One structure then renders three ways — as JSX, as
   plain text for the crawler files, and as schema text — without any consumer
   having to parse markup.

   A segment is prose ({ text }), an outbound link ({ text, href }), or a
   Typeform popup trigger ({ text, form }), where `form` names a config the
   component maps to a popup. Typeform is never an href: an anchor to a
   Typeform URL fails test/typeform-pages.test.mjs. */
export const faq = {
  eyebrow: 'Common questions',
  heading: { lead: 'Everything else,', accent: 'answered.' },
  intro:
    'Hacktoberfest works differently this year. Here’s what that means in practice, and what hasn’t been decided yet.',
  items: [
    {
      id: 'organize',
      question: 'How do I organize a Fest?',
      answer: [
        {
          text: 'You will need to apply to host a Fest, and applications will open soon. For now, ',
        },
        { text: 'sign up for our mailing list', form: 'faqHost' },
        { text: ' to get the latest updates.' },
      ],
    },
    {
      id: 'confirmation',
      question: 'When will my Fest be confirmed?',
      answer: [
        {
          text: 'Fests will be confirmed on a rolling basis before and throughout Hacktoberfest. We aim to confirm your Fest <1 week from the date we receive your completed application.',
        },
      ],
    },
    {
      id: 'support',
      question: 'What support will I receive for my Fest?',
      answer: [
        {
          text: 'All Fest organizers will be eligible for stickers, swag, and prizes for their participants. In addition, MLH will provide financial reimbursement to organizers for ',
        },
        {
          text: 'certain event-related expenses',
          href: 'https://mlh.gitbook.io/hack-days/reimbursements',
        },
        { text: '.' },
      ],
    },
    {
      id: 'promotion',
      question: 'Will you promote my Fest?',
      answer: [
        {
          text: 'Yes! We will promote all Fests on the Hacktoberfest website in a searchable gallery so participants can easily find your event. We will also promote the Fests program via our social media channels and marketing campaigns across MLH and DEV.',
        },
      ],
    },
    {
      id: 'pull-requests',
      question: 'So we’re not making PRs anymore?',
      answer: [
        { text: 'Nope, we’re trying something new this year; ' },
        { text: 'subscribe', form: 'faqUpdates' },
        { text: ' to stay updated!' },
      ],
    },
  ],
};

/* The answer as a reader hears it. URLs are deliberately left out so this can
   be compared against the rendered page, where a link's destination lives in
   the href rather than the text. */
export const answerText = (answer) =>
  answer.map((segment) => segment.text).join('');

export const answerLinks = (answer) =>
  answer.filter((segment) => segment.href).map((segment) => segment.href);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test test/faq-content.test.mjs`
Expected: PASS, 4 tests

- [ ] **Step 5: Write the failing test for the two popup configs**

In `test/typeform-config.test.mjs`, add `FAQ_HOST_FORM` and `FAQ_UPDATES_FORM` to the import block (keep it alphabetical), then append this test at the end of the file:

```js
test('configures the two inline FAQ popups', () => {
  assert.deepEqual(FAQ_HOST_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('faq-host'),
    hidden: { organizer_interest: 'true' },
  });
  // The PR question is a contributor's, so it presets nothing.
  assert.deepEqual(FAQ_UPDATES_FORM, {
    id: 'JIRQyVOq',
    tracking: campaign('faq-updates'),
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `node --test test/typeform-config.test.mjs`
Expected: FAIL — module does not provide an export named `FAQ_HOST_FORM`

- [ ] **Step 7: Add the configs to `src/data/typeforms.mjs`**

Insert after `HOST_A_FEST_FORM`:

```js
/* The two inline links in the FAQ answers. Own utm_content values, like every
   other placement, so their traffic stays distinguishable. */
export const FAQ_HOST_FORM = popup(INTEREST_FORM_ID, 'faq-host', {
  organizer_interest: 'true',
});
export const FAQ_UPDATES_FORM = popup(INTEREST_FORM_ID, 'faq-updates');
```

- [ ] **Step 8: Register the new unit test file**

In `package.json`, change the `test:unit` script to:

```json
"test:unit": "node --test test/typeform-button.test.mjs test/typeform-config.test.mjs test/faq-content.test.mjs",
```

- [ ] **Step 9: Run the unit suite**

Run: `npm run test:unit`
Expected: PASS, 8 tests total, 0 failures

- [ ] **Step 10: Commit**

```bash
npx prettier --write src/data/content.mjs src/data/typeforms.mjs test/faq-content.test.mjs test/typeform-config.test.mjs package.json
git add src/data/content.mjs src/data/typeforms.mjs test/faq-content.test.mjs test/typeform-config.test.mjs package.json
git commit -m "Add the FAQ copy and its two popup placements

Answers are arrays of segments rather than strings so the same copy can
render as JSX, as plain text for the crawler files, and as schema text.
The two inline signup links get their own utm_content, like every other
placement."
```

---

### Task 2: The FAQ section component

**Files:**

- Create: `src/components/FaqSection/index.js`
- Create: `src/components/FaqSection/FaqSection.styles.js`
- Modify: `src/pages/index.js` (import, and render after `<GetInvolvedSection />`)

**Interfaces:**

- Consumes: `faq` from `data/content.mjs`; `FAQ_HOST_FORM`, `FAQ_UPDATES_FORM` from `data/typeforms.mjs`.
- Produces: a `<section id="faq" aria-labelledby="faq-title">` containing one `<details>` per item, each with an `<h3>` question inside its `<summary>`.

- [ ] **Step 1: Create the styles**

Create `src/components/FaqSection/FaqSection.styles.js`:

```js
import styled, { css } from 'styled-components';

import Shell from 'components/Shell';
import TypeformButton from 'components/TypeformButton.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const FaqRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paper};
`;

export const FaqIntro = styled(Shell)`
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
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const FaqHeading = styled.h2`
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;

  @media (min-width: ${breakpoints.tablet}) {
    max-width: 12ch;
  }

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

// Same value as InvolvedIntroCopy, so the two intros read as one treatment.
export const FaqIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
`;

/* One panel rather than a card per question: five stacked offset shadows
   would be noisy, and a single ruled block reads as a printed index. */
export const FaqPanel = styled(Shell)`
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
`;

export const FaqItem = styled.details`
  & + & {
    border-top: 2px solid ${colors.ink};
  }
`;

export const FaqQuestion = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px;
  cursor: pointer;
  /* Both lines are needed to drop the default triangle across browsers. */
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
`;

export const FaqQuestionText = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
`;

/* A "+" that turns into an "×" at 45°. It's a flex item, so it is blockified
   and the transform applies without setting display explicitly. */
export const FaqMarker = styled.span`
  flex: none;
  font-family: ${fonts.mono};
  font-size: 1.3rem;
  line-height: 1;

  &::before {
    content: '+';
  }

  details[open] & {
    transform: rotate(45deg);
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: transform 150ms ease;
  }
`;

export const FaqAnswer = styled.p`
  max-width: 68ch;
  margin: 0;
  padding: 0 24px 26px;
  color: #34433f;
  font-size: 0.95rem;
`;

/* An anchor and a popup trigger sit in the same sentence, so they have to be
   indistinguishable: strip the button chrome and inherit the surrounding text. */
const inlineLink = css`
  color: inherit;
  font: inherit;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;

  &:hover {
    color: ${colors.orangeDeep};
  }
`;

export const FaqLink = styled.a`
  ${inlineLink}
`;

export const FaqFormLink = styled(TypeformButton)`
  ${inlineLink}
  appearance: none;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
`;
```

- [ ] **Step 2: Create the component**

Create `src/components/FaqSection/index.js`:

```js
import { faq } from 'data/content.mjs';
import { FAQ_HOST_FORM, FAQ_UPDATES_FORM } from 'data/typeforms.mjs';

import {
  Eyebrow,
  FaqAnswer,
  FaqFormLink,
  FaqHeading,
  FaqIntro,
  FaqIntroCopy,
  FaqItem,
  FaqLink,
  FaqMarker,
  FaqPanel,
  FaqQuestion,
  FaqQuestionText,
  FaqRoot,
} from './FaqSection.styles';

// Which popup each inline link opens. The copy lives in data/content.mjs.
const FORMS = {
  faqHost: FAQ_HOST_FORM,
  faqUpdates: FAQ_UPDATES_FORM,
};

const AnswerSegment = ({ segment }) => {
  if (segment.form) {
    return <FaqFormLink form={FORMS[segment.form]}>{segment.text}</FaqFormLink>;
  }

  if (segment.href) {
    return (
      <FaqLink href={segment.href} target="_blank" rel="noopener noreferrer">
        {segment.text}
      </FaqLink>
    );
  }

  return segment.text;
};

const FaqSection = () => (
  <FaqRoot id="faq" aria-labelledby="faq-title">
    <FaqIntro>
      <div>
        <Eyebrow>{faq.eyebrow}</Eyebrow>
        <FaqHeading id="faq-title">
          {faq.heading.lead} <em>{faq.heading.accent}</em>
        </FaqHeading>
      </div>
      <FaqIntroCopy>{faq.intro}</FaqIntroCopy>
    </FaqIntro>

    <FaqPanel>
      {faq.items.map((item) => (
        <FaqItem key={item.id}>
          <FaqQuestion>
            <FaqQuestionText>{item.question}</FaqQuestionText>
            <FaqMarker aria-hidden="true" />
          </FaqQuestion>
          <FaqAnswer>
            {item.answer.map((segment, index) => (
              <AnswerSegment key={`${item.id}-${index}`} segment={segment} />
            ))}
          </FaqAnswer>
        </FaqItem>
      ))}
    </FaqPanel>
  </FaqRoot>
);

export default FaqSection;
```

- [ ] **Step 3: Render it on the page**

In `src/pages/index.js`, add the import alongside the other component imports (they are alphabetical):

```js
import FaqSection from 'components/FaqSection';
```

and add the element as the last child of `<main>`:

```jsx
      <GetInvolvedSection />
      <FaqSection />
    </main>
```

- [ ] **Step 4: Build and confirm the section ships**

Run:

```bash
BASE_URL=https://hacktoberfest.com npm run build
```

Expected: build succeeds. Then:

```bash
grep -c '<details' out/index.html
```

Expected: `5`

- [ ] **Step 5: Confirm the Typeform links are buttons, not anchors**

Run: `node --test test/typeform-pages.test.mjs`
Expected: PASS, 3 tests. (This proves the two inline popups did not render as outbound Typeform anchors.)

- [ ] **Step 6: Commit**

```bash
npx prettier --write src/components/FaqSection src/pages/index.js
git add src/components/FaqSection src/pages/index.js
git commit -m "Add the FAQ section to the bottom of the page

Native details/summary, one per question, each independently openable,
so keyboard and screen reader behaviour come for free and the answers
are in the HTML before hydration. One bordered panel with ruled rows
rather than a card and a shadow per question."
```

---

### Task 3: FAQPage structured data

**Files:**

- Modify: `src/data/structuredData.js`
- Modify: `test/llms-content.test.mjs` (append a schema test)

**Interfaces:**

- Consumes: `faq`, `answerText` from `./content.mjs`.
- Produces: a `FAQPage` node inside the existing `@graph`, still serialized through `homepageJsonLdScript`.

- [ ] **Step 1: Write the failing test**

Append to `test/llms-content.test.mjs`:

```js
/* The schema is generated from the same array the page renders, so it cannot
   describe questions the page doesn't show. These assertions hold the shape
   of what actually ships. */
const shippedJsonLd = async () => {
  const html = await read('out/index.html');
  const match = html.match(
    /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/,
  );
  assert.ok(match, 'no JSON-LD in the built page');
  return JSON.parse(match[1]);
};

test('the FAQ ships as FAQPage schema matching the copy', async () => {
  const graph = (await shippedJsonLd())['@graph'];
  const faqPage = graph.find((node) => node['@type'] === 'FAQPage');

  assert.ok(faqPage, 'no FAQPage node in the graph');
  assert.equal(faqPage.mainEntity.length, faq.items.length);

  faq.items.forEach((item, index) => {
    const question = faqPage.mainEntity[index];
    assert.equal(question.name, item.question);
    assert.equal(question.acceptedAnswer.text, answerText(item.answer));
  });
});

/* One answer contains a literal "<". Unescaped it would close the script tag
   early and spill JSON into the page, so this proves the escape holds on
   content that actually has one. */
test('a literal < in an answer does not break the script tag', async () => {
  const graph = (await shippedJsonLd())['@graph'];
  const faqPage = graph.find((node) => node['@type'] === 'FAQPage');
  const answers = faqPage.mainEntity.map((q) => q.acceptedAnswer.text);

  assert.ok(
    answers.some((text) => text.includes('<1 week')),
    'expected an answer containing "<1 week"',
  );
});
```

Add `answerText` and `faq` to the existing import from `../src/data/content.mjs` in that file, keeping it alphabetical:

```js
import {
  answerText,
  faq,
  getInvolved,
  hero,
  mission,
  siteMeta,
  timeline,
} from '../src/data/content.mjs';
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test test/llms-content.test.mjs`
Expected: FAIL — `no FAQPage node in the graph`

- [ ] **Step 3: Add the node**

In `src/data/structuredData.js`, change the content import to:

```js
import { answerText, faq } from './content.mjs';
import { absoluteUrl, meta } from './meta';
```

Add to the `ID` object:

```js
  faq: absoluteUrl('/#faq'),
```

Add the node after `event`:

```js
/* Google restricted FAQ rich results to government and health sites in 2023,
   so this will not produce dropdowns in search. It is here so answer engines
   get an explicit question-and-answer pair instead of inferring one from
   prose — the reason the FAQ exists at all. */
const faqPage = {
  '@type': 'FAQPage',
  '@id': ID.faq,
  mainEntity: faq.items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answerText(item.answer),
    },
  })),
};
```

and add it to the graph:

```js
  '@graph': [website, event, faqPage, mlh, dev, digitalocean],
```

- [ ] **Step 4: Rebuild and run the test**

Run:

```bash
BASE_URL=https://hacktoberfest.com npm run build && node --test test/llms-content.test.mjs
```

Expected: PASS, 5 tests

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/data/structuredData.js test/llms-content.test.mjs
git add src/data/structuredData.js test/llms-content.test.mjs
git commit -m "Emit the FAQ as FAQPage structured data

Built from the same array the section renders, so the schema cannot
describe questions the page doesn't show. One answer contains a literal
'<', which the existing escape handles — now with a test that says so."
```

---

### Task 4: FAQ in the crawler files

**Files:**

- Modify: `src/build/llms.mjs`

**Interfaces:**

- Consumes: `faq`, `answerText`, `answerLinks`, `headingText` from `../data/content.mjs`.
- Produces: a `## Common questions` block in both `public/llms.txt` and `public/llms-full.txt`.

- [ ] **Step 1: Extend the imports**

In `src/build/llms.mjs`, change the import block to add the three new names, keeping it alphabetical:

```js
import {
  aiContext,
  answerLinks,
  answerText,
  faq,
  getInvolved,
  headingText,
  hero,
  mission,
  siteMeta,
  subscribed,
  timeline,
} from '../data/content.mjs';
```

- [ ] **Step 2: Add the questions to the index file**

In `llmsIndex()`, insert before the `'## Key facts'` line:

```js
    `## ${faq.eyebrow}`,
    bullets(faq.items.map((item) => item.question)),
    'Answers to all of these are in [llms-full.txt](./llms-full.txt).',
```

- [ ] **Step 3: Add the full text to the complete file**

In `llmsFull()`, insert before the `'## After signing up'` line:

```js
    `## ${faq.eyebrow}`,
    headingText(faq.heading),
    faq.intro,
    faq.items.map((item) => {
      // Links are named in the prose but their URLs only exist in the markup,
      // so append them — a plain-text reader has no other way to follow one.
      const links = answerLinks(item.answer);
      const suffix = links.length ? ` (${links.join(' ')})` : '';
      return `${item.question} — ${answerText(item.answer)}${suffix}`;
    }),
```

- [ ] **Step 4: Regenerate and eyeball both files**

Run:

```bash
BASE_URL=https://hacktoberfest.com node src/build/index.mjs
sed -n '/Common questions/,$p' public/llms.txt
sed -n '/Common questions/,$p' public/llms-full.txt
```

Expected: `llms.txt` lists the five questions as bullets plus the pointer line. `llms-full.txt` has the heading, the intro, and five `Question — Answer` blocks, with the reimbursements URL in parentheses on the support answer.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/build/llms.mjs
git add src/build/llms.mjs
git commit -m "Carry the FAQ into the crawler files

Questions alone in llms.txt, which is meant to stay an index, and the
full question-and-answer text in llms-full.txt. Link URLs are appended
to the plain text, since a reader of a text file cannot follow an href."
```

---

### Task 5: Extend the drift guards and verify end to end

**Files:**

- Modify: `test/llms-content.test.mjs`

**Interfaces:**

- Consumes: everything from Tasks 1–4.

- [ ] **Step 1: Teach the decoder about escaped angle brackets**

React escapes a literal `<` in copy to `&lt;`, so the page comparison fails on the "<1 week" answer without this. In `test/llms-content.test.mjs`, add two replacements to `decode`:

```js
const decode = (html) =>
  html
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '—')
    .replace(/&middot;/g, '·')
    .replace(/&nbsp;/g, ' ');
```

`&amp;` stays last so it cannot re-create an entity that an earlier rule would have decoded.

- [ ] **Step 2: Add the FAQ copy to the drift list**

Extend `everyLineOfCopy`:

```js
const everyLineOfCopy = [
  hero.deck,
  hero.cta,
  timeline.intro,
  ...timeline.eras.flatMap((era) => [era.title, era.copy]),
  ...mission.paragraphs,
  getInvolved.intro,
  ...getInvolved.cards.flatMap((card) => [card.title, ...card.copy, card.cta]),
  faq.intro,
  ...faq.items.flatMap((item) => [item.question, answerText(item.answer)]),
];
```

- [ ] **Step 3: Run the drift tests**

Run:

```bash
BASE_URL=https://hacktoberfest.com npm run build && node --test test/llms-content.test.mjs
```

Expected: PASS, 5 tests. If "missing from the rendered page: Fests will be confirmed…" appears, Step 1 was skipped.

- [ ] **Step 4: Prove the guard actually catches FAQ drift**

Temporarily break the generator, confirm the failure, then restore it:

```bash
cp src/build/llms.mjs /tmp/llms.bak
python3 - <<'PY'
import pathlib
p = pathlib.Path('src/build/llms.mjs')
s = p.read_text()
s = s.replace('faq.items.map((item) => {', 'faq.items.slice(0, 2).map((item) => {')
p.write_text(s)
PY
BASE_URL=https://hacktoberfest.com node src/build/index.mjs
node --test test/llms-content.test.mjs
cp /tmp/llms.bak src/build/llms.mjs
BASE_URL=https://hacktoberfest.com node src/build/index.mjs
```

Expected: the middle run FAILS with `missing from llms-full.txt: What support will I receive…`, and the file is restored afterwards. If it passes, the guard is not wired up — do not continue.

- [ ] **Step 5: Run the whole suite**

Run: `BASE_URL=https://hacktoberfest.com npm test`
Expected: 13 tests passing (4 FAQ content, 1 button, 3 typeform config, 3 typeform pages … recount against actual output), build succeeds, `All matched files use Prettier code style!`

- [ ] **Step 6: Verify in the browser**

```bash
rm -rf .next
```

Start the dev server with the `hacktoberfest-2026` preview config, then check:

1. The FAQ renders below Get Involved as one bordered panel with ruled rows and a single offset shadow.
2. Clicking a question opens it; the `+` turns to `×`; clicking again closes it.
3. Opening a second question leaves the first open.
4. Tab to a question and press Enter, then Space — both toggle it.
5. With an answer open, the inline link is reachable by Tab; the mailing-list and subscribe links open the Typeform popup over the page (URL unchanged), and the reimbursements link is a normal anchor opening in a new tab.
6. At 375px wide the questions wrap without the marker being pushed off, and the panel keeps its gutter.

- [ ] **Step 7: Commit**

```bash
npx prettier --write test/llms-content.test.mjs
git add test/llms-content.test.mjs
git commit -m "Extend the copy drift guard to the FAQ

Also teach the decoder about escaped angle brackets: React renders the
literal '<' in the confirmation answer as &lt;, which the page
comparison would otherwise read as a mismatch."
```

---

## Self-Review

**Spec coverage.** Section rendered after Get Involved (Task 2); five supplied questions verbatim (Task 1); eyebrow, heading and intro copy (Task 1); segment-based answers with `answerText` (Task 1); the two new popup placements with their attribution (Task 1); native `details`/`summary`, independently openable, closed on load (Task 2); one-panel treatment with ruled rows (Task 2); `h3` inside `summary` (Task 2); marker rotation with reduced-motion guard (Task 2); 68ch answer measure (Task 2); `FAQPage` node (Task 3); `<1 week` escape test (Task 3); both crawler files (Task 4); drift guards (Task 5); browser verification (Task 5).

Not implemented, and correctly so: the nav link and the searchable gallery are Open Questions in the spec, not requirements.

**Placeholders.** None — every code step carries its full code, and every command its expected output. One soft spot: Step 5 of Task 5 says to recount the test total against actual output rather than trusting the number, which is honest about a figure that shifts as tests are added.

**Type consistency.** `answerText` and `answerLinks` keep the same signatures across Tasks 1, 3, 4 and 5. `faq.items[].answer` is an array of segments everywhere. The `form` keys `faqHost` and `faqUpdates` match between `content.mjs` (Task 1) and the `FORMS` map (Task 2). `FAQ_HOST_FORM` / `FAQ_UPDATES_FORM` match between Tasks 1 and 2.
