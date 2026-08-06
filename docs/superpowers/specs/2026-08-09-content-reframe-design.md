# Hacktoberfest 2026 Content Reframe — Design

**Date:** 2026-08-09
**Status:** Approved approach (Approach A: event-first restructure)

## Context

Hacktoberfest 2026 changes shape in two big ways:

1. **From virtual to in-person-first.** 300+ community-hosted, in-person
   "Hacktober Fests" (one-day mini-hackathons modeled on MLH Hack Days:
   ≤12 hours, community-hosted, reimbursement + swag support from HQ),
   supplemented by a global online event. T-shirts are earned only by
   attending in person; online participants earn a sticker pack mailed to
   them.
2. **From open source contributions to building with open AI.** The event
   now centers on building with open source / open-weight AI models —
   awareness, adoption, and advocacy for open AI.

The current landing page (built on the `worktree-2026-blank-slate` branch)
already carries the open-source-AI framing but says nothing about the
in-person model, hosting, rewards, or partners. This design reorganizes the
page around the event itself.

## Editorial constraints (from stakeholder feedback — Jonathan Gottfried)

These govern all copy on the page:

- **Don't lead with the term "open source AI" as a hook.** Most visitors
  don't know what open source means. Describe it first ("AI models anyone
  can download, inspect, and build with"), introduce the term later.
- **Positive-sum framing, not a control fight.** "Open needs to be in the
  mix for a healthy AI ecosystem" — never anti-closed-AI, no "black
  boxes"/"gatekeepers" language. Also convey the value of Hacktoberfest
  pointing its community firehose at the open ecosystem.
- **Never neg previous years.** Past Hacktoberfests are framed as a
  success whose mission was accomplished, not a mistake corrected.
- **Use the maintainer segue for "what changed."** AI made contributing to
  open source so easy that maintainers now face a deluge of PRs. Getting
  new contributors isn't the problem anymore — even though it was when
  Hacktoberfest started. Handle without shading past Hacktoberfest
  maintainer friction.
- **Be concrete about what a participant actually does** in 2026.

Other constraints from the product owner:

- **One combined ask.** A single temporary Typeform captures all leads
  (attend + host). Link TBD — use a placeholder constant.
- **Rewards are a prominent, honest hook**, attached directly to the two
  participation paths.
- **The framing/mission copy appears verbatim** in a dedicated section. A
  revised version is coming; current draft goes in as clearly-marked
  placeholder text, structured for a one-paste swap.
- **Audience: developers first**, but written for developers who may have
  used ChatGPT and never touched open weights — no assumed open-source
  literacy.
- **Voice: manifesto-led hero, practical body.**
- **Soft progression ladder** through the "what you'll build" content —
  implied by ordering, never labeled beginner→advanced.
- **Partner branding prominent near the top:** "POWERED BY" DEV × MLH,
  "PRESENTING PARTNER" DigitalOcean.
- **Bottom CTA is sponsorship**, pointing to `sales@mlh.io`.
- Existing page structure and graphical elements (eyebrows, poster
  geometry, etc.) may be kept, reworked, or removed as the content
  demands — no obligation to preserve them.

## Page structure

Header → Hero (with partner strip) → Rally line → What changed →
The Fests → Two ways in + rewards → What you'll build →
Mission (verbatim slot) → Host a Fest → Sponsor CTA → Footer.

All copy below is approved draft direction; final wording may be polished
at implementation within the editorial constraints above.

### 1. Hero (rework `src/components/Hero`)

- Eyebrow: `October 2026 · 300+ cities · In person and online`
- Heading: `Hacktoberfest 2026: AI belongs to everyone.` (tagline verbatim)
- Deck: "This October, Hacktoberfest comes to your city. Join a one-day
  Hacktober Fest near you — or take part online from anywhere — and get
  hands-on with AI models anyone can download, inspect, and build with."
- Primary CTA: `Join Hacktoberfest` → Typeform placeholder constant.
- Secondary CTA: `What's a Hacktober Fest?` → anchor to the Fests section.
- Right-side manifesto card becomes the event snapshot — statement:
  "300+ hack days. One global celebration." Items:
  `01 — Find a Fest in your city` / `02 — Or join online from anywhere` /
  `03 — Build with open AI models`.

### 2. Partner strip (new, base of Hero)

Full-width band at the base of the Hero; visible without scrolling on
desktop, directly after hero content on mobile. Two labeled groups in the
existing small-caps eyebrow style:

- **POWERED BY** — DEV badge × MLH logo
- **PRESENTING PARTNER** — DigitalOcean logo

MLH logo component exists (`src/components/icons/MlhLogo.js`). DEV and
DigitalOcean marks to be added as inline SVG components from official
brand assets (product owner may supply preferred SVGs).

### 3. Rally banner (rewrite copy in `src/components/Rally`)

Replace the current anti-closed line ("alternative to black-box systems
controlled by a few companies") with positive-sum framing. Draft: "A
healthy AI ecosystem needs open in the mix. This October, the whole
Hacktoberfest community is building it." Tag: "The idea".

### 4. What changed in 2026 (rework `src/components/EraSection`)

The maintainer-segue narrative. Body arc (draft):

> When Hacktoberfest started, open source had a contributor problem —
> projects needed people, and a simple pull-request challenge brought
> millions of them in. It worked. Today AI tools have made contributing so
> easy that maintainers review more pull requests than they can handle.
> Getting new contributors isn't the problem anymore. Understanding the AI
> behind those tools — and keeping it open — is where the community's
> energy is needed now. So Hacktoberfest is becoming something you attend:
> hundreds of in-person hack days, plus a global online event.

Panels: **"2014–2025: Open the door to open source"** (success framing) /
**"2026: Get hands-on with open AI, together."**

### 5. The Fests (new section)

The concrete "what will I actually be doing" section.

- Heading: "A Hacktober Fest is a hack day in your city."
- Body: "A Hacktober Fest is a one-day, in-person mini-hackathon — a few
  hours with local developers, food, and hardware, building something real
  with open AI models. No experience with open models required; each Fest
  has guided challenges to start from. Hundreds are happening across the
  world this October, hosted by local communities with support from
  Hacktoberfest."
- "At a Fest you'll…" row of three concrete beats:
  `Run an open model on real hardware` / `Build and demo a project in a
day` / `Meet the developers in your city`.

### 6. Two ways in + rewards (new section, replaces `PathSection` content)

Two-card layout; rewards attached directly to each path:

- **In person:** "Join a Hacktober Fest near you. Build for a day, demo
  what you made, and earn the limited-edition Hacktoberfest 2026 t-shirt —
  only available by attending in person."
- **Online:** "Can't make it in person? Join the online event: build
  challenges throughout October and community events like Global Hack
  Week. Online participants earn the 2026 sticker pack, mailed anywhere in
  the world." (Kept high-level; online programming details are TBD.)

Both cards CTA to the same Typeform.

### 7. What you'll build (rework `src/components/CurriculumSection`)

Intro line (draft): "There's more to AI than the handful of chatbots
everyone knows. In October you'll work with the open ecosystem
underneath."

Four cards, ordered as an implicit ladder (never labeled by difficulty):

1. **Start with an open model** — "Download a model with open weights and
   run it. See what it can do on hardware you control."
2. **Swap in open tools** — "Go up the stack: run your model through an
   open source harness — the agents, retrieval, and eval tooling around
   it — and change the parts instead of treating AI as one black box."
3. **Own your inference** — "Serve a model locally or on your own
   infrastructure. Learn what quantization, latency, and cost actually
   mean in practice."
4. **Ship and show it** — "Build something another developer can run —
   then demo it at your Fest or share it online."

### 8. The mission (new section, verbatim framing slot)

Editorially distinct letter/statement treatment (the `DeclarationSection`
component is the donor; its current list content retires). Holds the
product owner's framing copy **verbatim**. Until the revised copy lands,
flow in the current draft text clearly marked in code as awaiting final
copy — swapping must be a one-paste change (single string/markup block,
no copy interleaved with layout logic).

### 9. Host a Fest (new section)

- Heading: "Bring Hacktoberfest to your city."
- Body: "Anyone can host a Hacktober Fest — university clubs, meetup
  groups, a few coworkers who can book a room. Hacktoberfest provides
  funding to help cover your event, plus swag and organizer support.
  Applications open soon."
- No dollar amounts (final reimbursement figures unknown).
- CTA: same Typeform, labeled `Get notified when hosting opens`.

### 10. Sponsor CTA (rework `src/components/JoinSection`, page bottom)

- Heading: "Put your name behind open AI."
- Body: "Hacktoberfest 2026 reaches developers in 300+ cities and online
  worldwide. Sponsors make the Fests, the shirts, and the community
  support possible."
- CTA: `Sponsor Hacktoberfest` →
  `mailto:sales@mlh.io?subject=Sponsor%20Hacktoberfest%202026`
- Participant join CTAs already exist in the hero and two-ways-in
  sections; optionally a slim join reminder above the sponsor section if
  the page feels like it strands participants (implementation judgment).

## Cross-cutting changes

- `src/pages/index.js`: update section order and imports; update `<title>`
  and meta description to the new framing (e.g. "Hacktoberfest 2026 | AI
  belongs to everyone" + in-person description).
- `public/llms.txt` / `public/llms-full.txt`: regenerate to match new
  content (these advertise page context to AI agents).
- Centralize the Typeform URL in one constant so the real link is a
  one-line change.
- Components may be renamed/restructured where the old name no longer
  matches content (e.g. `PathSection` → `WaysInSection`); follow existing
  styled-components patterns and file layout.

## Open items (not blockers)

| Item                          | Owner                    | Interim handling               |
| ----------------------------- | ------------------------ | ------------------------------ |
| Typeform URL                  | Product owner            | Placeholder constant, `#` href |
| Revised verbatim framing copy | Copy author              | Current draft, marked          |
| DEV / DigitalOcean SVGs       | Product owner or sourced | Official brand assets          |
| Online event details          | TBD                      | Copy stays high-level          |

## Error handling / testing

Static content site — no new dynamic behavior. Preserve existing
accessibility patterns (aria labels, reduced-motion support, focus-ring
contrast from prior review) and verify the page builds (`next build`) and
renders correctly at mobile/desktop widths in both the new and reworked
sections.
