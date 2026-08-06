# FAQ Section Design

## Goal

Add a collapsible FAQ to the bottom of the Hacktoberfest 2026 landing page, in
the existing visual language, so that the questions this year's format change
provokes are answered on the page rather than left to inference.

The page currently carries about 486 words of static text and states what
Hacktoberfest 2026 _is_ without answering what a reader will actually ask:
whether pull requests still count, what a Fest is, whether they can join from
home, and what any of it means for a maintainer. Prose has to be interpreted;
a question and its answer can be lifted whole. That is the point for readers
and for the answer engines that quote the page.

## Scope

- A new `FaqSection`, rendered after `GetInvolvedSection` and before the MLH
  footer.
- Five supplied questions and answers, added to `src/data/content.mjs`.
- Two new Typeform popup placements for the inline signup links.
- A `FAQPage` node in the existing JSON-LD graph.
- The same copy flowing into `llms.txt` and `llms-full.txt`.
- Tests extending the existing drift guards to cover it.

Out of scope: a nav link to the section, and the searchable Fest gallery that
question 4 promises — see Open Questions for both.

## Content

Supplied copy, used as written. It is almost entirely organizer-facing — four
of the five questions are about running a Fest — which matches hosting being
the page's only call to action right now.

The section introduces itself the way its siblings do: a mono eyebrow, a
display heading whose second half takes the accent colour, and a line of
intro copy.

- **Eyebrow:** Common questions
- **Heading:** Everything else, _answered._
- **Intro:** Hacktoberfest works differently this year. Here's what that means
  in practice, and what hasn't been decided yet.

The five questions and answers:

1. **How do I organize a Fest?**
   You will need to apply to host a Fest, and applications will open soon. For
   now, **sign up for our mailing list** to get the latest updates.

2. **When will my Fest be confirmed?**
   Fests will be confirmed on a rolling basis before and throughout
   Hacktoberfest. We aim to confirm your Fest <1 week from the date we receive
   your completed application.

3. **What support will I receive for my Fest?**
   All Fest organizers will be eligible for stickers, swag, and prizes for
   their participants. In addition, MLH will provide financial reimbursement
   to organizers for **certain event-related expenses**.

4. **Will you promote my Fest?**
   Yes! We will promote all Fests on the Hacktoberfest website in a searchable
   gallery so participants can easily find your event. We will also promote
   the Fests program via our social media channels and marketing campaigns
   across MLH and DEV.

5. **So we're not making PRs anymore?**
   Nope, we're trying something new this year; **subscribe** to stay updated!

Bold marks the three inline links. Apostrophes are typographic, matching the
rest of the copy.

### Link destinations

Two of the three had no target in the supplied copy, and are resolved as
follows. The only signup mechanism the site has is the Typeform interest form,
and `test/typeform-pages.test.mjs` forbids plain anchors to Typeform, so both
are popup triggers rather than links.

| Link                                  | Destination                                       | Attribution                               |
| ------------------------------------- | ------------------------------------------------- | ----------------------------------------- |
| "sign up for our mailing list" (Q1)   | Interest form popup                               | `faq-host`, `organizer_interest: true`    |
| "certain event-related expenses" (Q3) | `https://mlh.gitbook.io/hack-days/reimbursements` | Ordinary outbound anchor, campaign-tagged |
| "subscribe" (Q5)                      | Interest form popup                               | `faq-updates`, no organizer preselection  |

Q1 sits in an organizer answer, so it presets the host path. Q5 answers a
contributor's question, so it stays neutral.

**The Q3 URL needs confirming.** "Hack day" is a reserved term for a separate
MLH program and is kept out of Hacktoberfest 2026 copy. The link text avoids
it, but the destination is branded Hack Days, which risks conflating the two
programs for exactly the audience that shouldn't confuse them. Used as
supplied; swap it if a Fest-specific reimbursements page exists.

### Note on "<1 week"

Question 2's answer contains a literal `<`. It is safe in JSX and in plain
text, and the JSON-LD serializer already escapes `<` to `\u003c`, so it
cannot break out of the script tag. Worth a test.

## Architecture

### Copy

`src/data/content.mjs` gains a `faq` export shaped like the other sections —
`eyebrow`, `heading` split into `lead` and `accent`, `intro`, and an `items`
array. `id` is a stable slug used as the React key.

Answers cannot be plain strings, because three of them contain a link. Each
`answer` is instead an array of segments, so that one structure can render as
JSX, as plain text, and as schema text without any consumer parsing markup:

```js
{ text: '…' }                        // plain prose
{ text: '…', href: 'https://…' }     // outbound anchor
{ text: '…', form: 'faqHost' }       // Typeform popup trigger
```

A shared `answerText(answer)` helper joins the segments into a plain string
for the crawler files and the schema. Anchors keep their URL in parentheses so
a reader of the text file can still follow them; popup triggers do not, since
there is no URL to give — the text alone reads fine.

This is the payoff of generating the crawler files from one source: the
section, `llms-full.txt` and the `FAQPage` schema all read the same export, so
an edit cannot reach one and miss the others.

`src/data/typeforms.mjs` gains `FAQ_HOST_FORM` (`faq-host`,
`organizer_interest: 'true'`) and `FAQ_UPDATES_FORM` (`faq-updates`, no
preselection), keeping the one-utm_content-per-placement convention the other
CTAs follow.

### Component

`src/components/FaqSection/` follows the existing section convention — an
`index.js` holding markup and a `FaqSection.styles.js` holding styled
components.

```
<FaqRoot id="faq" aria-labelledby="faq-title">      section
  <FaqIntro>                                        Shell
    <Eyebrow> / <FaqHeading id="faq-title">          h2, em accent
    <FaqIntroCopy>
  <FaqPanel>                                        Shell
    <FaqItem>            details
      <FaqQuestion>      summary
        <FaqQuestionText>  h3
        <FaqMarker aria-hidden>
      <FaqAnswer>        p
        …segments: text, <FaqLink> anchor, or <FaqFormLink> popup
```

`h3` inside `summary` is valid — `summary` takes phrasing content optionally
intermixed with heading content — and keeps the page's h2 → h3 rhythm intact
while giving screen reader users a heading to navigate by.

`FaqLink` is an ordinary anchor. `FaqFormLink` is a `TypeformButton` styled to
sit inline in a sentence — underlined, inheriting font and colour, with the
button chrome stripped — so the two read identically to a user while the
popup rule still holds. Both are keyboard-reachable in the normal flow, and
because they live inside a closed `<details>`, neither is focusable until its
answer is open, which is the correct behaviour.

### Disclosure

Native `<details>`/`<summary>`, one per question, each independently
openable and all closed on load.

Native elements give keyboard operation, correct expanded/collapsed
announcement and find-in-page for free, and need no JavaScript — so the
answers are in the HTML before hydration, which is the whole point for
crawlers. The cost is that height cannot be animated consistently across
browsers, so the toggle is instant. That suits a design with hard edges, flat
fills and offset shadows.

Rejected: React state with `aria-expanded`, which buys animation at the price
of hand-rolling behaviour `<details>` already gets right; and the CSS checkbox
hack, which is not operable with a screen reader.

### Styling

The section matches its siblings: `padding-block: clamp(80px, 9vw, 124px)`,
`border-bottom: 2px solid ink`, and a two-column intro that stacks below
tablet. Background is `colors.paper` — Get Involved above it is `paperDeep`,
so this contrasts and returns to the lightest tone before the light MLH
footer. The `em` accent is `colors.orange`, as on every other light section.

The questions sit in **one panel**, not nine cards: a single `2px solid ink`
border on a white fill with one `7px 7px 0 maroon` offset shadow, rows divided
by `2px solid ink` rules via `& + &`. Nine stacked shadows would be noisy;
one panel reads as a printed index and stays calm as the list grows.

Details of the row:

- `summary` clears its default marker with `list-style: none` and
  `&::-webkit-details-marker { display: none }`, then lays out as a flex row
  with the question left and the marker right.
- `FaqMarker` is a mono `+` that rotates 45° into a `×` when open, selected
  with `details[open] &` — no component interpolation needed, since the item
  _is_ a `details`. The rotation transitions over 150ms, and only inside
  `@media (prefers-reduced-motion: no-preference)`.
- `FaqAnswer` is capped at `68ch` rather than running the full panel width,
  which at desktop would be far past a comfortable line length.

Focus styling is inherited from the global `:focus-visible` rule, the same as
every other interactive element on a light background. It is worth knowing
that rule paints a white outline with an ink ring, so on white the ring does
the work; changing it is a global decision and out of scope here.

### Structured data

`src/data/structuredData.js` gains a `FAQPage` node in the existing `@graph`,
its `mainEntity` built by mapping `faq.items` to `Question` /
`acceptedAnswer`, with the answer flattened through `answerText`. It is
generated from the same array the page renders, so the schema cannot describe
questions the page does not show.

Worth recording honestly: Google restricted FAQ rich results in 2023 to
government and health sites, so this will not produce dropdowns in search
results. The value is that answer engines get an explicit question-answer pair
instead of inferring one from prose.

### Crawler files

`src/build/llms.mjs` gains a `## Common questions` section in both files: the
full question-and-answer text in `llms-full.txt`, and the questions alone in
`llms.txt` with a pointer to the full file, keeping the index file short as
its convention intends.

## Testing and Verification

Extending `test/llms-content.test.mjs`, whose existing job is exactly this —
proving the page and the crawler files agree:

- Every FAQ question and answer appears in the rendered page.
- Every FAQ question and answer appears in `llms-full.txt`.
- Every FAQ question appears in the `FAQPage` node of the shipped JSON-LD, and
  the node holds exactly as many entries as the source array.
- The shipped JSON-LD still parses with `<1 week` in it, proving the `<`
  escape holds for content that actually contains one.
- The reimbursements link is a real anchor in the page, and the two interest
  links are buttons — the existing no-Typeform-anchor assertion covers the
  second half, and this covers the first.

The existing full-copy assertions extend to the FAQ automatically once the
copy list includes it.

Then in the browser: the panel renders as one bordered block with ruled rows;
a question opens and closes on click and on Enter/Space with the keyboard;
the marker turns; open state is independent per question; the inline links
open the right popup and the right external page; and the layout holds at
mobile and desktop.

Finally `BASE_URL=… npm test` for the full suite, build and Prettier check.

## Open Questions

- **Is the reimbursements URL right?** See Link destinations. It points at a
  doc branded Hack Days, a separate MLH program that Hacktoberfest 2026 copy
  otherwise keeps well clear of. Shipping it as supplied, but it should be
  confirmed.
- **A nav link to `#faq`?** Not included. The header already carries three
  section links plus the CTA, and the FAQ sits directly beneath Get Involved,
  which is linked. Easy to add if wanted.
- **The searchable gallery.** Question 4 tells organizers their Fest will be
  listed "on the Hacktoberfest website in a searchable gallery". Nothing like
  that exists yet, and this answer is a public commitment to building it. Not
  in scope here; worth tracking separately.
- **Attendee-facing questions.** The set is four-fifths organizer-facing,
  which fits today's single hosting CTA. When attendee sign-ups open, the
  section will likely need questions on cost, swag and finding a local Fest —
  none of which have published answers today.

## Post-implementation revisions (2026-08-11)

Three changes made after this spec was approved, recorded here so the
questions they touch don't get reopened:

- **`FaqAnswer` runs the panel's full width.** The 68ch cap under Styling
  was dropped; answers now read edge to edge like the rest of the panel.
- **Open/close is animated.** `interpolate-size: allow-keywords` plus a
  transition on the built-in `::details-content` block-size gives the toggle
  motion in browsers that support it. Where support is missing, or a reader
  has `prefers-reduced-motion` set, the disclosure falls back to the instant
  native toggle described under Disclosure — that was always the design, not
  a regression the animation left behind.
- **The reimbursements link is gone.** At the client's request, "certain
  event-related expenses" in Q3 is now plain text with no destination. This
  closes the open question above about the Hack Days-branded URL: there is no
  longer a URL to confirm. `{ text, href }` and the anchor rendering it stay
  in place as a supported shape for copy that links out — this is a copy
  change, not an architecture change.
