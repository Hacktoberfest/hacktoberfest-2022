import { ACTIVITIES, REQUIRED_STICKERS } from './eligibility.mjs';

/* Every word of the site's copy, in one place.

   The page renders from this, and so do the plain-text files answer engines
   read (public/llms.txt and public/llms-full.txt, written by
   src/build/llms.mjs). They used to be hand-maintained alongside the
   components and fell a full round of revisions behind — describing a mission
   and a call to action the site no longer had. Generating them from here
   makes that particular drift impossible: edit the copy once and both the
   page and the crawler files follow.

   Headings are split into `lead` and `accent` because the second half takes
   the colour highlight. Plain text joins them back with a space.

   .mjs so the build scripts, which run as plain Node ESM, can import it. */

export const headingText = ({ lead, accent }) => `${lead} ${accent}`;

/* The strip above the nav, on every page. Preptember's one ask, in the
   one place nobody has to scroll to find: every other pointer at hosting
   is either below the fold or on a page somebody has to choose to visit
   first.

   It links to /host rather than the nav's /my, deliberately: the nav's
   CTA is for someone who has already decided, while a banner interrupts
   someone who has not, and /host is the page that makes the case.

   Rendered only while PREPTEMBER is true (data/preptember.mjs), so the
   October 1st deploy that flips the hub out of its September state takes
   the banner with it rather than leaving the site wishing people a happy
   Preptember in the middle of Hacktoberfest. */
export const banner = {
  message: 'It’s Preptember! Get your Fest applications in.',
  close: 'Close banner',
};

export const hero = {
  /* Two lines so phones can break between the clauses rather than mid-phrase;
     they share one line, separator restored, from tablet up. */
  eyebrow: ['October 2026 · 300+ events', 'In person and online'],
  heading: { lead: 'Hacktoberfest 2026:', accent: 'AI belongs to everyone.' },
  deck: 'A month of livestreams, Global Hack Week, and 300+ one-day Fests in cities around the world, all about building with open source AI. Turn up online, in person, or both.',
  cta: 'Attend online',
  secondaryCta: 'Find a Fest',
  poweredByLabel: 'Powered by',
  presentingLabel: 'Presenting partner',
};

export const timeline = {
  eyebrow: 'The story so far',
  heading: { lead: 'From four PRs to', accent: '300+ events.' },
  intro:
    'What began as a simple pull-request challenge has grown into one of the largest developer traditions in the world. Here’s how we got here and where we will go next.',
  eras: [
    {
      year: '2014',
      title: 'A challenge is born.',
      copy: 'DigitalOcean launches Hacktoberfest: open four pull requests in October, earn a t-shirt.',
    },
    {
      year: '2015–2025',
      title: 'A generation joins open source.',
      copy: 'Thousands of developers made their first contribution and discovered the power of community! As the ecosystem grew, maintainers started to face a massive flood of activity and burnout from the rise of low-effort PRs.',
    },
    {
      year: '2026',
      title: 'A new chapter.',
      copy: 'Under the stewardship of long-time partners Major League Hacking (MLH) and DEV, Hacktoberfest refocuses on high-value, meaningful learning. Online and local events (Fests) everywhere, all about building with open source AI.',
    },
  ],
};

export const mission = {
  eyebrow: 'The mission',
  heading: { lead: 'Why we’re', accent: 'doing this.' },
  /* This framing statement appears on the site verbatim — don't edit or
     paraphrase individual lines; replace it wholesale if its author revises
     it. Each paragraph is a segment array so the author's emphasis survives:
     { bold: true } segments render as <strong> on the page and as plain text
     everywhere else. The segment texts concatenate back to the exact
     paragraphs, load-bearing spaces included. */
  paragraphs: [
    [
      {
        text: 'Hacktoberfest has always been about empowering people to build open software together.',
        bold: true,
      },
      {
        text: ' For years, that energy was measured by pull requests and developers making their first open-source contributions. But open source was never defined by a PR counter. Open source is a philosophy centered on transparency and collective ownership.',
      },
    ],
    [
      {
        text: 'In an era where AI tools make low-effort PRs easier than ever to generate, maintainers face unprecedented volume and noise. ',
      },
      {
        text: 'This year, Hacktoberfest is focused on high-value, meaningful learning: giving everyone the tools and knowledge to experiment and build with open artificial intelligence.',
        bold: true,
      },
    ],
    [
      {
        text: 'By joining Hacktoberfest, online or in-person, you can expect to learn about open-weight models, open source agents, and more. ',
      },
      {
        text: 'We believe open innovation must be prioritized alongside proprietary tools for an ecosystem to remain healthy and resilient.',
        bold: true,
      },
      {
        text: ' Instead of counting PRs, you’ll write your first skills.md, build your own open-source agent, fine-tune an open-weight model, or go wherever your curiosity takes you.',
      },
    ],
    [
      {
        text: 'Hacktoberfest 2026 is about meeting you wherever you are in your open source AI journey because we believe ',
      },
      { text: 'AI belongs to everyone.', bold: true },
    ],
  ],
};

/* The homepage sponsor wall: the /sponsor roster shown as pure credit, no
   recruitment asks (those live on /sponsor). Header follows the shared
   section pattern: mono eyebrow, display heading, intro on the right. */
export const homeWall = {
  eyebrow: 'Partners & sponsors',
  heading: { lead: 'Backing the', accent: 'builders.' },
  intro:
    'Hacktoberfest is powered by MLH and DEV and presented by DigitalOcean. Alongside them, this year’s sponsors cover the Fests, the swag, and the participant packs that reach builders around the world.',
};

export const getInvolved = {
  eyebrow: 'Get involved',
  heading: { lead: 'Help make it', accent: 'happen.' },
  intro:
    'Every Fest comes to life through local organizers raising their hands and sponsors providing their support. If you want to help shape Hacktoberfest 2026, we’d love to have you on board.',
  /* `id` maps a card to its Typeform popup in the component; the form config
     itself is wiring, not copy, so it stays out of this file. */
  cards: [
    {
      id: 'host',
      tag: 'Host a Fest',
      title: 'Bring Hacktoberfest to your city.',
      copy: [
        'Anyone can host a Fest. Are you part of a local meetup group? University club? Or perhaps you and a few coworkers have the power to book a conference room… let’s bring Hacktoberfest to your community.',
        'Every Fest is eligible for stickers, swag, and programming support. Hack Day hosts also receive funding to help cover their event.',
      ],
      cta: 'Host a Fest',
    },
    {
      id: 'sponsor',
      tag: 'Sponsor',
      title: 'Back open source AI.',
      copy: [
        'Tell your Marketing and Dev Rel teams about Hacktoberfest.',
        'Sponsors make the swag and in-person Fests possible. Be part of this new Hacktoberfest chapter and get your brand in front of our massive global community of software creators.',
      ],
      cta: 'Sponsor Hacktoberfest',
    },
  ],
};

/* Answers are arrays of segments rather than plain strings, because they can
   carry an inline link or, once, a short ordered list. One structure then
   renders three ways — as JSX, as plain text for the crawler files, and as
   schema text — without any consumer having to parse markup.

   A segment is prose ({ text }), an outbound link ({ text, href }), a
   Typeform popup trigger ({ text, form }), where `form` names a config the
   component maps to a popup, or a bounded markdown subset ({ markdown }).
   { text, href } has no current user among these 24 but stays supported for
   copy that links out. { markdown } exists for the one answer the flat
   segment list can't express — the Fest formats question's two-item numbered
   list — and supports exactly three constructs: **bold**, [label](href), and
   lines opening `1. ` / `2. ` as an ordered list. parseAnswerMarkdown below
   turns that subset into a render-ready structure; answerText and
   answerLinks both understand it too, so a markdown segment never has to be
   special-cased by a consumer. Typeform is never an href: an anchor to a
   Typeform URL fails test/typeform-pages.test.mjs.

   `items` stays a flat array — src/build/llms.mjs reads faq.items directly,
   and grouping for the /questions page is expressed via each item's `section`
   field instead of nesting, so adding a section never means teaching the
   crawler files or the tests a new shape. `sections` records the six source
   headings in display order; `homepage` names the four items (chosen for
   breadth, not for hosts, since the homepage serves first-time visitors)
   that still appear in the homepage callout, plus the CTA to the full page.
   `page` carries the copy the standalone /questions page's Head and PageHero need,
   the same way host.* does for /host. */
export const faq = {
  eyebrow: 'Common questions',
  heading: { lead: 'Everything else,', accent: 'answered.' },
  // The wink under the panel; links to the machine-readable answers.
  llmsNote: 'Are you an LLM? → llms.txt',
  intro:
    'Hacktoberfest works differently this year, and a new format always comes with questions. We have the answers: here’s what to know about hosting a Fest, taking part, and what comes next.',
  sections: [
    { id: 'general', title: 'General & Mission Overview' },
    { id: 'preptember', title: 'Preptember (September 1-30)' },
    { id: 'fests', title: 'In-Person Events (“Fests”) & Formats' },
    { id: 'hosting', title: 'Fest Hosting, Applications & Logistics' },
    { id: 'swag', title: 'Swag, Participant Envelopes & Reimbursements' },
    { id: 'sponsorship', title: 'Sponsorship & Partner Packages' },
  ],
  items: [
    // -- General & Mission Overview --------------------------------------
    {
      id: 'what-is-hacktoberfest',
      section: 'general',
      question: 'What is Hacktoberfest?',
      answer: [
        {
          text: 'Hacktoberfest is a global celebration of open source that runs throughout October. This year, Hacktoberfest is run by ',
        },
        { text: 'Major League Hacking (MLH)', href: 'https://www.mlh.com/' },
        { text: ' and ' },
        { text: 'DEV', href: 'https://dev.to' },
        { text: ' in partnership with ' },
        { text: 'DigitalOcean', href: 'https://www.digitalocean.com/' },
        { text: '.' },
      ],
    },
    /* The three questions a first-timer asks before any of the others,
       written for the /online landing page and true everywhere. */
    {
      id: 'is-it-free',
      section: 'general',
      question: 'Is it free?',
      answer: [
        {
          text: 'Yes. Every Fest is free to attend, and everything online is free too: the streams, the build week, the challenges, and the sticker pack we mail you. All you need is a free MyMLH account.',
        },
      ],
    },
    {
      id: 'need-to-be-a-developer',
      section: 'general',
      question: 'Do I need to be a developer?',
      answer: [
        {
          text: 'No. The streams and the build week are for anyone curious about open source AI, whatever you have built before. Some activities involve code, and the sessions are there to help you write it.',
        },
      ],
    },
    {
      id: 'what-is-mymlh',
      section: 'general',
      question: 'What is MyMLH?',
      answer: [
        {
          text: 'The free account every MLH event uses. It is how a livestream knows you were there, how a Fest checks you in, and where the address for your stickers lives. Sign in once and it works for the whole month.',
        },
      ],
    },
    {
      id: 'what-is-a-virtual-sticker',
      section: 'general',
      question: 'What is a virtual sticker?',
      answer: [
        {
          text: 'A sticker in your Hacktoberfest sticker book, earned by completing a challenge: checking into a livestream, submitting to a DEV Challenge, connecting a tool, and so on. It can take up to 12 hours to show up. Sign in, add your address and earn any other sticker, that’s 3, and we mail you an IRL sticker pack. 10 and a holographic sticker joins it, 17 and you’re a Completionist.',
        },
      ],
    },
    /* The practical questions before a first Fest, written for the
       /in-person landing page and true everywhere. */
    {
      id: 'what-to-bring',
      section: 'fests',
      question: 'What should I bring to a Fest?',
      answer: [
        {
          text: 'A laptop and its charger, and whatever you like to build with. The host provides the room, the wifi and the programme, and a Hack Day usually has food.',
        },
      ],
    },
    {
      id: 'come-alone',
      section: 'fests',
      question: 'Can I come on my own?',
      answer: [
        {
          text: 'Yes, and most people do. At a Hack Day the host will help you find a team on the day; a Meetup needs no team at all.',
        },
      ],
    },
    {
      id: 'more-than-one-fest',
      section: 'fests',
      question: 'Can I go to more than one Fest?',
      answer: [
        {
          text: 'Yes. Every Fest you check in at earns a certificate with your name on it, and every Hack Day is another shot at the prizes. Your online sticker book gets the Fest sticker once.',
        },
      ],
    },
    {
      id: 'how-2026-differs',
      section: 'general',
      question: 'How is Hacktoberfest 2026 different from previous years?',
      answer: [
        {
          text: 'Hacktoberfest 2026 will feature 300+ in-person and online community events worldwide focused on hands-on building, experimentation, and learning with open-source AI and open-weight models. In previous years, Hacktoberfest focused on counting individual contributions to open-source projects.',
        },
      ],
    },
    {
      id: 'why-focus-on-open-source-ai',
      section: 'general',
      question: 'Why is Hacktoberfest 2026 focused on open-source AI?',
      answer: [
        {
          text: 'The AI landscape is rapidly evolving. There is uncertainty around future AI access, pricing, and regulations. By prioritizing education about open-weight models and open-source AI, we help build resilience around our overall ecosystem.',
        },
      ],
    },
    {
      id: 'get-involved-in-open-source',
      section: 'general',
      question:
        'I was planning on getting into open source this October, now I don’t know what to do. How can I get involved in open source?',
      answer: [
        {
          text: 'Open source runs 365 days a year, and you can get started anytime. Just because Hacktoberfest isn’t incentivizing open source contributions with swag doesn’t mean you can’t contribute any more. Check out ',
        },
        {
          text: 'this guide',
          href: 'https://dev.to/opensauced/open-source-101-a-beginners-guide-to-getting-started-37fb',
        },
        { text: ' to get started.' },
      ],
    },
    {
      id: 'why-moving-away-from-prs',
      section: 'general',
      question:
        'Why is Hacktoberfest moving away from counting Pull Requests (PRs)?',
      answer: [
        {
          text: 'With the rise of AI tools making low-effort PRs trivial to generate, open-source maintainers faced unprecedented floods of noise, spam, and burnout. In 2026, Hacktoberfest is refocusing on high-value, meaningful learning, collaborative events, and open-source AI development rather than raw PR volume.',
        },
      ],
    },
    {
      id: 'who-is-eligible',
      section: 'general',
      question: 'Who is eligible to participate?',
      answer: [
        {
          // Corrected per the design spec: "worldwide are welcome" read as
          // plural agreement with "worldwide" rather than with "Anyone".
          text: 'Anyone aged 13 and older worldwide is welcome to participate, subject to U.S. export controls and embargo restrictions.',
        },
      ],
    },
    {
      id: 'need-a-fest',
      section: 'general',
      question: 'Do I need to attend a Fest to take part?',
      answer: [
        {
          text: 'No. Every online challenge earns its sticker on its own, and the sticker pack is mailed anywhere in the world. A Fest is two more stickers to add if there is one near you, and the one place a T-shirt is handed out on the day.',
        },
      ],
    },
    // -- Preptember --------------------------------------------------------
    {
      id: 'what-is-preptember',
      section: 'preptember',
      question: 'What is Preptember?',
      answer: [
        {
          text: 'Preptember is the month-long preparation period throughout September where organizers plan their Fests before hacking begins in October. More details are coming soon!',
        },
      ],
    },
    // -- In-Person Events (“Fests”) & Formats ------------------------------
    {
      id: 'what-is-a-fest',
      section: 'fests',
      question: 'What is a “Fest”?',
      answer: [
        {
          text: 'A Fest is an official, in-person Hacktoberfest event lasting up to 12 hours, designed to bring local developer communities together to learn and build with open-source AI.',
        },
      ],
    },
    {
      id: 'fest-formats',
      section: 'fests',
      question: 'What are the two official Fest formats?',
      // The one answer the flat { text }/{ href } segment shape can't
      // express: a numbered list with bold lead-ins. See parseAnswerMarkdown
      // below for how this renders, and answerText/answerLinks for how it
      // still yields plain prose and link URLs everywhere else.
      answer: [
        {
          markdown:
            '1. **Hack Day:** A mini hackathon. Build with open source AI through the day and demo at the end, with prizes for the best projects.\n2. **Meetup:** A community gathering. Talks, workshops or a panel, and no project to ship.\n\nEither way, Hacktoberfest swag and stickers are available while supplies last.',
        },
      ],
    },
    {
      id: 'will-everyone-get-a-tshirt',
      section: 'fests',
      question: 'Will everyone get a T-Shirt?',
      answer: [
        {
          text: 'We send thousands of T-shirts to Fests, but we can’t guarantee one to every participant. They’re available on the day while supplies last, and we can’t mail one to anyone who missed out. Online, the only T-shirts are the ones in the Completionist raffle.',
        },
      ],
    },
    {
      id: 'required-software-platforms',
      section: 'fests',
      question: 'What software platforms are required to run a Fest?',
      answer: [
        // OrganizerHQ (and OHQ) is the product name, not the "organizers ->
        // hosts" house-term swap, so it stays as supplied.
        {
          text: 'All Fests must use Major League Hacking’s OrganizerHQ (OHQ) for attendee registration and day-of check-in. In addition, Hack Days must use OrganizerHQ Challenges for project submissions and judging.',
        },
      ],
    },
    {
      id: 'post-event-deliverables',
      section: 'fests',
      question: 'What post-event deliverables are required from organizers?',
      answer: [
        {
          text: 'Organizers must submit high-resolution event photos, verified check-in data via OrganizerHQ, winner records, and itemized food/beverage expense receipts (for Hack Days reimbursements).',
        },
      ],
    },
    // -- Fest Hosting, Applications & Logistics ----------------------------
    {
      id: 'how-to-apply-to-host',
      section: 'hosting',
      question: 'How do community members apply to host a Fest?',
      answer: [
        { text: 'Hosts apply via the ' },
        {
          // Source gave this as http://; the site never links out over
          // plain http, so the scheme is corrected to https.
          text: 'host portal',
          href: 'https://organize.mlh.com/host/hacktoberfest-2026',
        },
        { text: '. Visit our ' },
        {
          text: 'host guide',
          href: 'https://mlh.gitbook.io/mlh-hacktoberfest-organizer-guide',
        },
        { text: ' to learn more about the Fest hosting process.' },
      ],
    },
    {
      id: 'application-approval-time',
      section: 'hosting',
      question: 'How long does application approval take?',
      answer: [
        {
          text: 'Applications are reviewed on a rolling basis, with confirmation typically provided within less than one week.',
        },
      ],
    },
    {
      id: 'venue-requirements',
      section: 'hosting',
      question: 'What venue requirements must a host secure?',
      answer: [
        {
          text: 'Hosts must secure a safe, accessible in-person venue for 3 to 12 hours equipped with reliable Wi-Fi, power outlets, seating, and necessary AV equipment.',
        },
      ],
    },
    {
      id: 'geographic-sanctions-restrictions',
      section: 'hosting',
      question:
        'Are there geographic or sanctions restrictions for hosting or participating in Fests?',
      answer: [
        {
          text: 'Fests and swag shipments are available worldwide, excluding locations embargoed and sanctioned by the U.S.',
        },
      ],
    },
    // -- Swag, Participant Envelopes & Reimbursements ----------------------
    {
      id: 'event-pack-swag',
      section: 'swag',
      question: 'What swag is included in the in-person Fest Event Packs?',
      answer: [
        {
          text: 'All in-person Fests will get a shipment of MLH stickers, DigitalOcean stickers, and T-shirts, which organizers will distribute at their discretion in accordance with MLH policies.',
        },
      ],
    },
    {
      id: 'swag-envelope-program',
      section: 'swag',
      question: 'How does the individual Swag Envelope program work?',
      answer: [
        {
          text: 'Participants who cannot attend an in-person Fest can earn an official Hacktoberfest Swag Envelope by completing participation milestones online (more details soon on these milestones).',
        },
      ],
    },
    {
      id: 'swag-envelope-contents',
      section: 'swag',
      question: 'What items are included inside the Swag Envelope?',
      answer: [
        {
          text: 'Custom Hacktoberfest stickers and other envelope-friendly items.',
        },
      ],
    },
    {
      id: 'envelope-shipping-timeline',
      section: 'swag',
      question: 'What is the envelope fulfillment and shipping timeline?',
      answer: [
        {
          text: 'Envelope shipments will begin dispatching after Hacktoberfest concludes and should arrive at most destinations within 30-60 days.',
        },
      ],
    },
    {
      id: 'host-expense-reimbursement',
      section: 'swag',
      question: 'What are the expense reimbursement rules for Fest organizers?',
      answer: [
        {
          text: 'Reimbursements apply strictly to Hacktoberfest Hack Day events for approved in-policy food and beverage expenses up to a designated cap. Meet Ups and corporate partner hosts are not eligible for reimbursement.',
        },
      ],
    },
    // -- Sponsorship & Partner Packages -------------------------------------
    {
      id: 'how-to-sponsor',
      section: 'sponsorship',
      question: 'How can companies sponsor Hacktoberfest 2026?',
      answer: [
        {
          text: 'Companies can reach out to discuss sponsorship opportunities with our team at ',
        },
        { text: 'hacktoberfest@mlh.io', href: 'mailto:hacktoberfest@mlh.io' },
        { text: '.' },
      ],
    },
  ],
  homepage: {
    ids: [
      'what-is-hacktoberfest',
      'how-2026-differs',
      'what-is-a-fest',
      'how-to-apply-to-host',
    ],
    cta: { label: 'See all FAQs', href: '/questions/' },
  },
  page: {
    title: 'FAQ | Hacktoberfest 2026',
    description:
      'Answers to the most common Hacktoberfest 2026 questions: the mission change, Preptember, Fest formats, hosting logistics, swag, and sponsorship.',
    eyebrow: 'Common questions',
    heading: { lead: 'Everything you need', accent: 'to know.' },
    intro:
      'Hacktoberfest works differently this year, and a new format always comes with questions. Here is what to know about hosting a Fest, taking part, and what comes next.',
  },
};

/* A segment array as a reader hears it — used for FAQ answers and the
   mission's paragraphs alike. URLs and emphasis are deliberately left out so
   this can be compared against the rendered page, where a link's destination
   lives in the href and bolding lives in the markup rather than the text.
   A `markdown` segment reduces to the same kind of prose: list markers and
   `**`/`[]()` markup are stripped so the crawler files and the content tests
   never see anything a `{ text }` segment couldn't also have produced. */
const ORDERED_LIST_MARKER = /^\d+\.\s+/;
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

const markdownToPlainText = (markdown) =>
  markdown
    .split('\n')
    // Each numbered line was one list item; joined with spaces they read as
    // one paragraph, the same way a reader would say the list aloud.
    .map((line) => line.replace(ORDERED_LIST_MARKER, ''))
    .join(' ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(MARKDOWN_LINK, '$1');

export const answerText = (answer) =>
  answer
    .map((segment) =>
      segment.markdown ? markdownToPlainText(segment.markdown) : segment.text,
    )
    .join('');

export const answerLinks = (answer) =>
  answer.flatMap((segment) => {
    if (segment.href) return [segment.href];
    if (segment.markdown) {
      // matchAll walks the string in order, same as the segments array
      // itself, so links from a markdown segment interleave correctly with
      // any { text, href } segments before or after it.
      return [...segment.markdown.matchAll(MARKDOWN_LINK)].map(
        (match) => match[2],
      );
    }
    return [];
  });

/* Turns one `{ markdown }` segment's text into a structure a React component
   can render without a markdown library — FaqList (a later task) walks this
   rather than the raw string. Handles exactly the subset described above and
   nothing more; anything outside it is passed through as literal text.

   Returns:
     { type: 'orderedList', items: [{ parts }, ...] }  — when every non-blank
       line opens with a `1. ` / `2. ` marker
     { type: 'paragraph', parts }                       — otherwise

   `parts` is an array of:
     { text }               — plain prose
     { text, bold: true }   — **bold** content
     { text, href }         — a [label](href) link
   Concatenating a parts array's `text` fields reproduces the same plain
   prose answerText produces for the segment, so nothing here can disagree
   with what the crawler files say. */
const INLINE_MARKUP = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

const parseInline = (str) => {
  const parts = [];
  let lastIndex = 0;
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = INLINE_MARKUP.exec(str))) {
    if (match.index > lastIndex) {
      parts.push({ text: str.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      parts.push({ text: match[1], bold: true });
    } else {
      parts.push({ text: match[2], href: match[3] });
    }
    lastIndex = INLINE_MARKUP.lastIndex;
  }
  if (lastIndex < str.length) {
    parts.push({ text: str.slice(lastIndex) });
  }

  return parts;
};

export const parseAnswerMarkdown = (markdown) => {
  const lines = markdown.split('\n').filter((line) => line.trim().length);
  const isOrderedList =
    lines.length > 0 && lines.every((line) => ORDERED_LIST_MARKER.test(line));

  if (isOrderedList) {
    return {
      type: 'orderedList',
      items: lines.map((line) => ({
        parts: parseInline(line.replace(ORDERED_LIST_MARKER, '')),
      })),
    };
  }

  return { type: 'paragraph', parts: parseInline(markdown) };
};

export const subscribed = {
  title: 'Thanks for signing up | Hacktoberfest 2026',
  eyebrow: 'You’re on the list',
  heading: { lead: 'Thanks for being', accent: 'part of it.' },
  body: 'We’ll be in touch about Hacktoberfest 2026 as soon as there’s news to share.',
  cta: 'Back to Hacktoberfest',
};

/* Copy for /signed-out/, where the sign-out control on /my lands. Signing
   out revokes our tokens but cannot touch MLH’s own cookie on www.mlh.com,
   so the page says so plainly and offers MyMLH sign-out as a link instead
   of navigating everyone there: mlh.com/signout ignores return_to and
   strands people on a sign-in form. The link is the shared-machine escape
   hatch. `mlh` is one sentence split around that link, so the label and
   the prose travel together. */
export const signedOut = {
  title: 'Signed out | Hacktoberfest 2026',
  eyebrow: 'See you soon',
  heading: { lead: 'You’re', accent: 'signed out.' },
  body: 'You’re signed out of Hacktoberfest on this device.',
  mlh: {
    lead: 'You’re still signed in to MyMLH, so signing back in won’t ask for your password. On a shared computer,',
    linkLabel: 'sign out of MyMLH',
    tail: 'too.',
  },
  cta: 'Back to Hacktoberfest',
};

export const fests = {
  title: 'Find a Fest | Hacktoberfest 2026',
  description:
    'Search Hacktoberfest 2026 Fests by name, city, or country, or find the one nearest you on the map.',
  eyebrow: 'Attend in-person',
  heading: { lead: 'Find a Fest', accent: 'near you.' },
  intro:
    'Every Fest is a one-day, in-person event, either a Hack Day or a Meetup, hosted by local organizers. Search by name or city, or use your location to see what is closest.',
  /* The wink under the directory, addressed to crawlers the way the
     homepage FAQ's is. It points at the API rather than llms.txt because
     the Fests are live data: a text file written at build time would be
     stale the moment the next Fest is approved, and the endpoint behind
     this page answers with every one of them. The URL is wiring and lives
     in data/links.js. */
  llmsNote: 'Are you an LLM? → pull every Fest from the API',
  searchPlaceholder: 'Search by name, city, or country',
  searchLabel: 'Search Fests',
  locationCta: 'Use my location',
  locationPending: 'Finding you…',
  /* The same button once a position is in hand: granting location sorts by
     distance and puts a "km away" on every card, and this is how someone
     undoes all of it and gets the date order back. Named for what it
     clears rather than the sort it restores, because clearing is the
     larger half of what it does. */
  locationClearCta: 'Clear location',
  locationUnavailable:
    'We could not use your location. Try searching by city instead.',
  resultsCountSingular: 'Fest found',
  resultsCountPlural: 'Fests found',
  emptyTitle: 'No Fests match your search.',
  emptyBody: 'Try a different name, city, or country.',
  loading: 'Loading Fests…',
  error: {
    title: 'We could not load the Fests directory.',
    body: 'Something went wrong on our end.',
    retryCta: 'Try again',
  },
  registerCta: 'Register',
  /* The two Fest formats, badged on the card and in the modal. Read out of
     the Fest's name rather than the API's own format field, which says
     "hackathon" for every Hacktoberfest event there is — see
     lib/festFormat.mjs. A name that follows neither convention gets no
     badge, which is why there is no third entry here. */
  /* The partner a Fest is run with, split out of the event name (MLH welds
     the two together). A label rather than a sentence: the host's own name
     follows it, and "Hosted by Hack the 6ix" should read as one line on the
     card, not a claim the site is making. */
  hostedBy: 'Hosted by',
  formatBadges: {
    hackDay: 'Hack Day',
    meetUp: 'Meetup',
  },
  /* What each format actually is, in the modal, for someone deciding
     whether to go. Deliberately the same facts /host gives would-be hosts
     (host.formats.cards) turned to face the other way: hands on keyboard
     and prizes for a Hack Day, less structure and maybe speakers for a
     Meetup. One set of facts, two audiences, so the two pages can never
     describe the same format differently.

     Nothing here promises anything a Fest has not signed up to. What a
     given Fest is doing on the day is its host's to say, and when the API
     carries descriptions this sits above one rather than standing in for
     it. */
  formatBlurbs: {
    hackDay:
      'A mini-hackathon. Hands on keyboard for the day, building and shipping with open source AI, with prizes for the best projects.',
    meetUp:
      'A community gathering. Less structure, same spirit: there may be speakers, or it may simply be a chance to meet the open source people near you.',
  },
  /* The detail modal a card opens. It exists to hold what a card cannot:
     which building, and the Fest's own page. Everything else in here is
     the card's copy reused, so there is no second wording of the same
     fact to drift. */
  modal: {
    close: 'Close',
    /* The map marker's way into the same modal a card title opens. The
       card needs no such label — its trigger is the Fest's own name — but
       a popup already showing the name needs a verb. */
    detailsCta: 'Details',
  },
  /* Past Fests stay in the directory rather than vanishing — a city with
     one Fest that has already run should not read as a city with none —
     but they sink below the upcoming ones and grey out. The badge is what
     says so in words: greying is a colour, and a colour is not something
     everyone reading this page receives. */
  pastBadge: 'Past',
  distanceUnit: 'km away',
  formatFilter: {
    label: 'Filter by format',
    all: 'All',
    hackDay: 'Hack Days',
    meetUp: 'Meetups',
  },
  viewToggle: {
    label: 'Choose how Fests are shown',
    list: 'List',
    map: 'Map',
  },
  /* Closes the page below the directory: whatever the search found (or
     didn't), the answer to a missing Fest is hosting one. Points at
     /host, which carries the formats and the application. */
  hostCallout: {
    title: 'No Fest near you? That’s your cue.',
    body: 'Every Fest on this list exists because someone local decided to make it happen. Anyone can host one: a funded Hack Day or a casual Meetup. If your city isn’t on the map yet, you’re exactly the person to fix that.',
    cta: 'Host a Fest',
    photoAlt:
      'Hack Day participants working on laptops around a table while a host leans in to help',
  },
};

/* Copy for /host, the organizer-facing page. A Fest is one of two formats:
   a Hack Day (a funded mini-hackathon — people build projects) or a Meet Up
   (a lighter gathering, no projects, no MLH funding). "Hack Day" here is an
   official Fest format name; it resembles MLH's separate Hack Days program
   (mlh.com/hack-days) but is not it, so the copy never links that program.
   The support items restate what the FAQ already promises; nothing here
   offers more than the FAQ does, so the two can't drift apart in
   substance. */
export const host = {
  title: 'Host a Fest | Hacktoberfest 2026',
  description:
    'Bring Hacktoberfest to your city. Host a one-day, in-person Hack Day or Meet Up about open source AI. Compare the formats, see the support organizers get, and apply to host.',
  eyebrow: 'Attend in-person · Host a Fest',
  heading: { lead: 'Bring Hacktoberfest', accent: 'to your city.' },
  intro: 'Anyone can host a Fest. Choose between a Hack Day or a Meet Up.',
  formats: {
    eyebrow: 'The formats',
    heading: { lead: 'Two ways to', accent: 'run the day.' },
    intro:
      'Every Fest is one day and in person. From there, pick the format that fits your community.',
    cards: [
      {
        id: 'hack-day',
        tag: 'Hack Day',
        title: 'A mini-hackathon.',
        copy: [
          'Hands on keyboard. A Hack Day gets people building and shipping, with prizes for the best projects.',
        ],
      },
      {
        id: 'meetup',
        tag: 'Meet Up',
        title: 'A community gathering.',
        copy: [
          'Less structure, same spirit. A Meet Up might have speakers or simply offer an opportunity for your community to get together.',
        ],
      },
    ],
    comparison: {
      label: 'Hack Day and Meet Up, compared',
      /* Cells are display strings so the table and llms-full.txt read the
         same words. Prizes are a Hack Day thing — the owner's call,
         2026-08-17. */
      columns: ['Hack Day', 'Meet Up'],
      rows: [
        {
          id: 'projects',
          label: 'People build projects',
          hackDay: 'Yes',
          meetUp: 'No',
        },
        {
          id: 'workshops',
          label: 'Workshops and speakers',
          hackDay: 'Yes',
          meetUp: 'Optional',
        },
        {
          id: 'prizes',
          label: 'Prizes',
          hackDay: 'Yes',
          meetUp: 'No',
        },
        {
          id: 'funding',
          label: 'MLH funding',
          hackDay: 'Yes',
          meetUp: 'No',
        },
      ],
    },
  },
  /* The strip between the formats and the support story: real Fests,
     shown rather than described. The photos are the content, so each
     carries a real alt; the label names the strip for screen readers,
     which otherwise meet an unheaded section of five images. */
  photoStrip: {
    label: 'Scenes from past Fests',
    photos: [
      {
        id: 'crowd',
        src: '/host-strip-crowd.jpg',
        alt: 'A crowd of Fest attendees sharing a laugh between sessions',
      },
      {
        id: 'build',
        src: '/host-strip-build.jpg',
        alt: 'Three attendees building together at a past Fest',
      },
      {
        id: 'pitch',
        src: '/host-strip-pitch.jpg',
        alt: 'Two attendees on the mic presenting their project to the room',
      },
      {
        id: 'demo',
        src: '/host-strip-demo.jpg',
        alt: 'A team crowded around an MLH laptop to watch a demo',
      },
      {
        id: 'mingle',
        src: '/host-strip-mingle.jpg',
        alt: 'Attendees chatting over plates of food between sessions',
      },
      {
        id: 'friends',
        src: '/host-strip-friends.jpg',
        alt: 'Attendees catching up between sessions at a past Fest',
      },
      {
        id: 'thumbs',
        src: '/host-strip-thumbs.jpg',
        alt: 'Three attendees on a couch giving a thumbs up behind a laptop',
      },
      {
        id: 'focus',
        src: '/host-strip-focus.jpg',
        alt: 'Two attendees heads down over a laptop in a packed lecture hall',
      },
    ],
  },
  support: {
    eyebrow: 'Hosting, supported',
    heading: { lead: 'You bring the people.', accent: 'We bring the rest.' },
    /* The two prints under the "you bring the people" half: the big
       print first, the overlapped one second. Their own photos, not
       the strip's, so the reel doesn't repeat them. */
    photos: [
      {
        id: 'pair',
        src: '/host-support-pair.jpg',
        alt: 'Two attendees arm in arm, all smiles at their Fest',
      },
      {
        id: 'room',
        src: '/host-support-room.jpg',
        alt: 'A room of attendees mid-build at their laptops',
      },
    ],
    items: [
      {
        id: 'swag',
        title: 'Stickers, swag, and prizes',
        copy: 'Every Fest is eligible to receive stickers, t-shirts, and additional swag for its participants.',
      },
      {
        id: 'promotion',
        title: 'Promotion',
        copy: 'Your Fest is listed in our searchable directory and promoted across MLH and DEV channels.',
      },
      {
        id: 'programming',
        title: 'Programming support',
        copy: 'Help shaping your Fest activities so you’re not starting from scratch.',
      },
      {
        id: 'funding',
        title: 'Funding',
        copy: 'Hack Day organizers receive funding to help cover their event, with financial reimbursement from MLH for certain event-related expenses. Meet Ups run without MLH funding.',
      },
    ],
    guide: {
      /* Not "start from scratch" again: the programming support item
         directly above already uses that phrase. */
      title: 'The manual for all of it.',
      copy: 'From booking venues to event programming to getting your swag, the host handbook has all the information you need.',
      cta: 'Read the host handbook',
    },
  },
  apply: {
    eyebrow: 'Apply to host',
    heading: { lead: 'Ready to host', accent: 'your Fest?' },
    body: 'Applications are now open and Fests are confirmed on a rolling basis.',
    /* The organizer journey as three steps; the middle one carries the
       confirmation promise that used to be a support item. */
    steps: [
      {
        id: 'apply',
        title: 'Apply',
        copy: 'Tell us about your community and the type of Fest you want to run.',
      },
      {
        id: 'confirmed',
        title: 'Get confirmed',
        copy: 'Fests are confirmed on a rolling basis, within a week of a completed application.',
      },
      {
        id: 'host',
        title: 'Host your Fest',
        copy: 'Get ready to run your Hack Day or Meet Up!',
      },
    ],
    cta: 'Apply to host a Fest',
  },
};
/* The two world landing pages: the marketing case for attending online
   and for attending in person. The online page tells the site's one
   story in order: the deal (do things, earn stickers, get real ones),
   how it works, what each milestone gets you, and everything there is
   to collect. The in-person page keeps its own three moves: what a Fest
   is like, the rewards, how it works, then and now, and the questions
   people ask first. The mechanics (which sessions, which Fests, which
   dates) live on /activities/, /schedule/ and /fests/, so nothing here
   names a session, a date or a Fest. Both render through
   components/WorldLanding, so they share one shape; every band is a key
   on the world's copy, and a world without the key skips the band.

   Each page speaks only for its own world. The online page never
   mentions Fests (test/online-content.test.mjs holds it to that): its
   one pointer at the other world is the book band's ghost row, which
   says "in person" and nothing more; the in-person page mentions online
   only in the callout that closes it, and the online page returns the
   favour with schedule.festsCallout. */

/* The book's arithmetic, said in words on the online page: how many
   stickers there are to collect, how many of them from home, and how many
   a milestone takes. The milestone counts are the API's thresholds (1, 8
   and 15 activity stickers, fixtures.mjs) plus the two required stickers,
   the way /my counts them: in book units. */
const BOOK_SIZE = REQUIRED_STICKERS.length + ACTIVITIES.length;
const IN_PERSON_STICKERS = ACTIVITIES.filter(
  (activity) => activity.type === 'inperson',
).length;
const MILESTONE_STICKERS = {
  pack: REQUIRED_STICKERS.length + 1,
  complete: 10,
  completionist: 17,
};

/* The three milestones, the same three /my shows once you are signed
   in, with the count each takes, shared by both world landing pages.
   `art` is the milestone sticker's file (lib/stickerImage.mjs). */
const MILESTONE_CARDS = [
  {
    id: 'pack',
    art: 'milestone-pack',
    at: `Earn ${MILESTONE_STICKERS.pack} stickers`,
    title: 'Earn an IRL sticker pack',
    copy: 'Sign in, add your address, and earn any other virtual sticker to receive Hacktoberfest 2026 stickers in the mail.',
  },
  {
    id: 'complete',
    art: 'milestone-complete',
    at: `Earn ${MILESTONE_STICKERS.complete} stickers`,
    title: 'Unlock a bonus holographic sticker',
    copy: `Earn any ${MILESTONE_STICKERS.complete} virtual stickers and we’ll include a bonus holographic sticker in your mailed sticker pack.`,
  },
  {
    id: 'completionist',
    art: 'milestone-completionist',
    at: `Earn ${MILESTONE_STICKERS.completionist} stickers`,
    title: 'Become a Completionist',
    copy: `Earn ${MILESTONE_STICKERS.completionist} stickers and you’re a Completionist, and entered in a raffle to win a Hacktoberfest 2026 t-shirt or an Arduino Uno Q board.`,
  },
];

/* Under the milestone cards, said once: when the real things arrive. */
const MILESTONES_DISCLAIMER =
  'Stickers and prizes will be mailed 8-12 weeks after Hacktoberfest concludes.';

export const online = {
  title: 'Attend Online | Hacktoberfest 2026',
  description: `Hacktoberfest is back: build with open source AI from anywhere, earn a virtual sticker for every challenge you complete, and collect enough to get real ones mailed to you. ${BOOK_SIZE} stickers to collect, no pull requests required.`,
  eyebrow: 'Attend online · October 2026 · Free',
  heading: {
    lead: 'Hacktoberfest is back.',
    accent: 'Earn stickers, get stickers.',
  },
  /* Written for someone who has never heard of Hacktoberfest: what it
     is, when, and that it is free, then the deal in two sentences.
     `introShort` is the phone's version, so the first screen there still
     reaches the buttons. */
  intro:
    'Hacktoberfest is a free, month-long celebration of open source, every October. This year it’s about building with open source AI, and you can do all of it from wherever you are. Every challenge you complete earns a virtual sticker for your book. Earn enough and we’ll mail you real ones.',
  introShort:
    'A free, month-long celebration of open source, every October. Complete challenges from wherever you are, earn a virtual sticker for each one, and we’ll mail you real ones.',
  /* No facts strip: the eyebrow carries the one fact that matters
     (free), and the intro says the rest. */
  facts: null,
  /* The page's ask, in the hero and again beside the step that explains
     MyMLH: starting the book is signing in. */
  cta: 'Start your sticker book',
  ctaHref: '/login/',
  secondaryCta: 'See every sticker',
  secondaryHref: '/activities/',
  /* The hero's object: a pile of the stickers themselves, framed the
     way the album frames them. `accent` is the world's colour for the
     heading's second line. */
  hero: { object: 'pile', accent: 'sky' },
  /* The pile (components/WorldLanding/StickerPile): which stickers, by
     slug, in the order they are put down. A mix of every activity ground
     the book has and one milestone; never the two required stickers,
     which are the sign-in and the address rather than things to do.
     Decorative; the copy beside it says what they are. */
  pile: [
    'ghw-livestream',
    'livestreams-5',
    'ghw-points-10',
    'dev-launch-weekend',
    'discord',
    'livestream-launch',
    'milestone-pack',
    'ghw',
    'digitalocean',
    'dev-week-2',
  ],
  /* How it works, told as the three milestones, the same three /my
     shows once you are signed in, with the count each takes. The band
     comes straight after the hero, so there is no steps band before it.
     `art` is the milestone sticker's file (lib/stickerImage.mjs). */
  milestones: {
    eyebrow: 'How it works',
    heading: { lead: 'Complete milestones,', accent: 'unlock rewards.' },
    /* The page's own line, not /my's: this is the first thing a stranger
       reads after the hero, so it says what October is. */
    intro:
      'This Hacktoberfest, rather than opening pull requests, you’ll be learning about open-source and open-weight AI models. Complete challenges to unlock virtual stickers and earn real rewards.',
    cards: MILESTONE_CARDS,
    disclaimer: MILESTONES_DISCLAIMER,
  },
  /* Everything there is to collect, page by page, drawn from the
     catalogue the album uses (eligibility.mjs) with the album's own page
     lines (my.album.pages) and names (activitiesPage.list.types). The
     last row is the in-person page of the book: its own title and line
     here, since the album's name for that page says Fests and this page
     never does. No button on the row; the callout that closes the page
     is the way to the other world. */
  collection: {
    eyebrow: 'The sticker book',
    heading: { lead: `${BOOK_SIZE} stickers`, accent: 'to collect.' },
    intro: `There are ${BOOK_SIZE} stickers to earn this Hacktoberfest. Hover over one to see what unlocks it.`,
    pages: ['required', 'livestreams', 'dev', 'ghw', 'tools'],
    inPerson: {
      title: 'In person',
      copy: `${IN_PERSON_STICKERS} more stickers are earned in person, at events near you.`,
    },
    cta: 'See every sticker',
    ctaHref: '/activities/',
  },
  /* Closes the page (components/BookCallout): for someone already
     collecting, the way to their book on /my. The stickers are the fan
     on the box, the middle one in front. */
  bookCallout: {
    title: 'Already collecting?',
    body: 'Your sticker book has every sticker you’ve earned, the ones still to do, and what’s on its way in the mail. Sign in to see it.',
    cta: 'See your sticker book',
    href: '/my/',
    stickers: ['livestreams-1', 'milestone-pack', 'ghw'],
  },
  faq: {
    eyebrow: 'Common questions',
    heading: { lead: 'New here?', accent: 'Start with these.' },
    ids: [
      'what-is-hacktoberfest',
      'what-is-a-virtual-sticker',
      'is-it-free',
      'need-to-be-a-developer',
      'what-is-mymlh',
      'why-moving-away-from-prs',
      'who-is-eligible',
    ],
    cta: { label: 'See all FAQs', href: '/questions/' },
  },
};

export const inPerson = {
  title: 'Attend In Person | Hacktoberfest 2026',
  description:
    'Hacktoberfest is back and it is coming to your city: hundreds of one-day Fests about open source AI, hosted by local communities. Find one near you, meet the people who build there, and take home Hacktoberfest swag and stickers while supplies last.',
  eyebrow: 'Attend in-person · October 2026 · Free',
  heading: {
    lead: 'Hacktoberfest is back.',
    accent: 'And it’s coming to a city near you.',
  },
  /* Written for someone who has never heard of a Fest: what it is, that
     it is free, then the two things a room gives: the people, and the
     swag. Nothing here promises a specific item; swag, stickers and
     T-shirts are available while supplies last, every time the page says
     so. The online sticker book is a bonus, introduced once beside the
     steps (earn.online), never the headline. */
  intro:
    'A Fest is a free, one-day, in-person Hacktoberfest event hosted by a local community, all about building with open source AI. Come meet the people who build near you, and take home Hacktoberfest swag and stickers while supplies last.',
  introShort:
    'A Fest is a free, one-day, in-person event about building with open source AI, hosted by a local community. Meet the people who build near you, and take home swag while supplies last.',
  /* No facts strip: the eyebrow carries the one fact that matters. */
  facts: null,
  /* One ask in the hero: find a Fest. Hosting has its own page, reached
     from the nav and the FAQ slice. */
  cta: 'Find a Fest',
  ctaHref: '/fests/',
  secondaryCta: null,
  secondaryHref: null,
  /* The hero's object: two prints from past Fests, the /host strip's
     photos reused rather than new assets. A pair that contrasts: the
     social side of a Fest and the building side. */
  hero: {
    object: 'prints',
    accent: 'pink',
    photos: [
      {
        src: '/host-strip-friends.jpg',
        alt: 'An attendee flashing a peace sign while catching up with friends',
      },
      {
        src: '/host-strip-build.jpg',
        alt: 'Three attendees huddled around a laptop, deep in a build',
      },
    ],
  },
  /* What a Fest is like, before the page uses the word again: the two
     formats side by side, the shape of the day, what to bring and who is
     in the room. The facts are the host page's and the FAQ's. */
  formats: {
    eyebrow: 'What a Fest is like',
    heading: { lead: 'One day,', accent: 'two ways to spend it.' },
    intro:
      'Every Fest is one day, up to 12 hours, in a room with your local community. Which kind of day depends on the host.',
    cards: [
      {
        id: 'hack-day',
        tag: 'Hack Day',
        title: 'A mini hackathon.',
        lines: [
          'Kick off in the morning, build with open source AI through the day, demo at the end.',
          'Prizes for the best projects, and usually food.',
          'Bring a laptop and, if you like, a team. The host will help you find one.',
        ],
      },
      {
        id: 'meetup',
        tag: 'Meetup',
        title: 'A community gathering.',
        lines: [
          'Talks, workshops or a panel, and time to meet the people who came.',
          'No project to ship and no team to find.',
          'Bring curiosity. A laptop helps for the workshops.',
        ],
      },
    ],
  },
  /* What you get on the day, the room's own rewards, before the steps:
     swag and stickers, T-shirts, prizes at a Hack Day, and the virtual
     rewards (the Fest sticker in the online book, and a certificate).
     These are not stickers, so each card carries a plain icon, `icon`
     naming one of the Tabler icons in components/WorldLanding/dayIcons.
     Every card that can says "while supplies last", and nothing names a
     specific item. `link` is the one card with a way onward. */
  onTheDay: {
    eyebrow: 'On the day',
    heading: { lead: 'What you', accent: 'get.' },
    intro:
      'Every Fest comes with Hacktoberfest swag for the people in the room, while supplies last. What else depends on the day.',
    cards: [
      {
        id: 'swag',
        icon: 'hexagon',
        at: 'Every Fest',
        title: 'Swag and stickers',
        copy: 'Hacktoberfest 2026 stickers and swag, while supplies last.',
      },
      {
        id: 'tshirts',
        icon: 'shirt',
        at: 'Every Fest',
        title: 'T-shirts',
        copy: 'Hacktoberfest 2026 T-shirts are available at Fests while supplies last.',
      },
      {
        id: 'prizes',
        icon: 'gift',
        at: 'Hack Days',
        title: 'Prizes',
        copy: 'Hack Days end with demos, and prizes for the best projects.',
      },
      {
        id: 'virtual',
        icon: 'rosette-discount-check',
        at: 'Every Fest',
        title: 'Virtual rewards',
        copy: 'The Fest sticker in your online sticker book, and a certificate with your name, the Fest and the date.',
        link: { label: 'See the online event', href: '/online/' },
      },
    ],
    disclaimer:
      'Swag, stickers and T-shirts are handed out at the Fest while supplies last.',
  },
  /* How it works: the three steps across the band, in plain words: pick
     a Fest, register, show up. Nothing here about the online sticker
     book; the Virtual rewards card above says it once. */
  earn: {
    eyebrow: 'How it works',
    heading: { lead: 'Pick a Fest,', accent: 'register, show up.' },
    /* Grouped by when they happen: two things to do before the day, and
       the day itself. The band draws consecutive steps that share a
       phase under one label. */
    steps: [
      {
        art: 'pin',
        phase: 'Before the day',
        title: 'Find a Fest near you',
        copy: 'Search by name or city, or use your location to see what’s closest.',
      },
      {
        art: 'ticket',
        phase: 'Before the day',
        title: 'Register on the Fest’s page',
        copy: 'Every Fest has its own page with the date, the venue and a register button. You’ll need a free MyMLH account.',
      },
      {
        art: 'checkin',
        phase: 'On the day',
        title: 'Learn, build, and meet the people near you',
        copy: 'Check in with the host, then it’s talks, hacking on something with open source AI, and getting to know the people who build near you.',
      },
    ],
    cta: 'Find a Fest',
    ctaHref: '/fests/',
  },
  /* The page's proof: the soonest Fests, read live from the directory's
     endpoint (components/NearbyFests). */
  nearby: {
    eyebrow: 'Where to go',
    heading: { lead: 'Upcoming', accent: 'Fests.' },
    intro:
      'This Hacktoberfest, 300+ Fests are taking place across the world. Here are three of the next ones happening.',
    cta: 'See every Fest',
    loading: 'Loading the next Fests…',
    empty:
      'The first Fests go on the calendar soon. The directory is where they will appear.',
  },
  faq: {
    eyebrow: 'Before you go',
    heading: { lead: 'Questions', accent: 'before you go.' },
    intro: 'The practical ones first. The full list is on the FAQ page.',
    ids: [
      'is-it-free',
      'what-to-bring',
      'come-alone',
      'more-than-one-fest',
      'what-is-a-fest',
      'fest-formats',
      'what-is-a-virtual-sticker',
      'will-everyone-get-a-tshirt',
      'why-moving-away-from-prs',
      'how-to-apply-to-host',
    ],
    cta: { label: 'See all FAQs', href: '/questions/' },
  },
  /* Closes the page, the way schedule.festsCallout closes the online one:
     the one place this page points at the other world. */
  onlineCallout: {
    title: 'No Fest near you?',
    body: 'Everything online earns stickers just the same, from wherever you are, and the sticker pack ships worldwide. Or bring a Fest to your city: anyone can host one.',
    cta: 'Attend online',
    secondaryCta: 'Host a Fest',
  },
};

export const sponsor = {
  title: 'Sponsor Hacktoberfest | Hacktoberfest 2026',
  description:
    'Partner with Hacktoberfest 2026 and put your brand alongside the models, tools, and communities bringing open source AI to builders at 300+ Fests worldwide.',
  eyebrow: 'Sponsors',
  heading: { lead: 'Back the builders', accent: 'shaping open source AI.' },
  intro:
    'Put your brand alongside the models, tools, and communities moving open source AI from awareness to hands-on adoption.',
  setupCta: 'Start sponsor setup',
  infoCta: 'Request partnership info',
  wall: {
    heading: {
      lead: 'Meet the teams making',
      accent: 'Hacktoberfest happen.',
    },
    /* The grid's dashed empty seat and the band that closes the wall:
       the section ends on the invitation, not on a logo. */
    ghost: 'Your logo here',
    band: {
      title: 'Take your place in the lineup.',
      cta: 'Start sponsor setup',
    },
  },
  stats: {
    eyebrow: 'The footprint',
    heading: { lead: 'One October,', accent: 'everywhere builders are.' },
    intro:
      'One sponsorship covers all of it: the online campaign across DEV, the in-person Fests across MLH, and the packs that end up in builders’ hands.',
    /* Each stat is a value and a unit rather than one title line, so the
       number can carry the display treatment on its own. The eyebrows
       name the channel; the org attribution lives in the unit. */
    items: [
      {
        id: 'dev',
        eyebrow: 'Online',
        value: 'All October',
        unit: 'across DEV',
        copy: 'Challenges, stories, and shared learning.',
      },
      {
        id: 'mlh',
        eyebrow: 'In person',
        value: '300+',
        unit: 'Fests across MLH',
        copy: 'A global builder community learning side by side.',
      },
      {
        id: 'packs',
        eyebrow: 'In their hands',
        value: '3,000',
        unit: 'participant packs',
        copy: 'A tangible sponsor touchpoint delivered by MLH.',
      },
    ],
  },
  partnership: {
    eyebrow: 'Partner experience',
    heading: {
      lead: 'Reach builders without',
      accent: 'adding production lift.',
    },
    intro:
      'Choose the presence that fits your goals. MLH handles production, logistics, and distribution.',
    split: [
      {
        id: 'mlh',
        eyebrow: 'MLH handles',
        copy: 'Production, logistics, and distribution',
      },
      {
        id: 'you',
        eyebrow: 'Your team provides',
        copy: 'Brand assets and approvals',
      },
    ],
    benefits: [
      {
        id: 'recognition',
        title: 'Guaranteed recognition',
        copy: 'Recognition on the Hacktoberfest website, in-person Fest slides, and key campaign communications.',
      },
      {
        id: 'envelopes',
        title: '3,000 participant envelopes',
        copy: 'Your sponsor sticker is included in 3,000 participant envelopes distributed by MLH.',
      },
      {
        id: 'readout',
        title: 'A useful readout',
        copy: 'An aggregate campaign recap with outcomes and participation signals.',
      },
      {
        id: 'workspace',
        title: 'One place to manage it',
        copy: 'Agreement, payment coordination, assets, and teammates in one workspace.',
      },
    ],
  },
};

/* Copy for /schedule, October's online programme as a calendar.

   Only the online events: Global Hack Week, workshops, streams, ceremonies,
   challenges. The 300+ community Fests stay on /fests, where a map and a
   search can do them justice — ten of them per calendar cell could not. The
   callout at the foot of the page is the bridge between the two, aimed at
   someone reading an online schedule who would rather be in a room.

   Event type labels are NOT here: they come from lib/scheduleTypes.mjs,
   which also owns each type's colour and, crucially, can name a type the
   frontend has never seen. Copy split across two files would drift the
   moment FestNet added one. */
export const schedule = {
  title: 'October Schedule | Hacktoberfest 2026',
  description:
    'Every online Hacktoberfest 2026 event in October: Global Hack Week, workshops, streams and ceremonies, in your own time zone.',
  eyebrow: 'Attend online',
  heading: { lead: 'A month of', accent: 'things to join.' },
  intro:
    'Everything happening online this October, in your time zone or any other. Global Hack Week, workshops, streams, and the ceremonies that open and close the month.',
  monthLabel: 'October 2026',
  /* The stream's own heading, in the interior section grammar /activities/
     uses: the month label sits above it as the eyebrow, the accent is set
     in orange. The hero already says what the month is; this says what the
     list under it answers. */
  sectionHeading: { lead: 'What is on,', accent: 'and when.' },
  /* The intro under that heading, for the reader who has not met the
     activities yet: what a check-in is and what it counts for. The
     mechanics live on /activities/; this is the pointer. */
  countsNote: {
    text: 'Every livestream shows a check-in code. Each check-in earns its own sticker, and Global Hack Week has stickers of its own for its sessions.',
    cta: 'See the activities',
  },
  /* What has already happened folds away by default, behind this. The count
     goes in the label because "3 past events" is a reason to press it and
     "Past events" is not. */
  pastToggle: {
    show: 'Show what has already happened',
    hide: 'Hide past events',
    /* Rendered as `${count} ${one|many}`. */
    one: 'past event',
    many: 'past events',
  },
  /* The reader's zone is filled in at render time. It always shows: a
     schedule that says "2:00 PM" without saying whose is no use to most of
     the people reading it. */
  timeZoneNote: 'Times in',
  /* Appended to the reader's own zone in the switcher, so it stays findable
     after they have wandered off to another one. */
  zoneYours: '· yours',
  /* The combobox's empty state, when a query matches no zone at all. */
  zoneNoMatches: 'No matching time zones',
  loading: 'Loading the schedule…',
  error: {
    title: 'We could not load the schedule.',
    body: 'Something went wrong on our end.',
    retryCta: 'Try again',
  },
  empty: {
    title: 'The schedule is not published yet.',
    body: 'October’s online programme goes up closer to the time. Check back soon.',
  },
  allDayLabel: 'All day',
  /* The chip on a livestream's time. "Stream" at rest — the appointment you
     can show up to — and "On air" while the window is actually open, which is
     the only state the brand orange is allowed to announce. */
  streamChip: 'Stream',
  onAirChip: 'On air',
  /* The DEV challenge runs all month as weekly submission windows. The
     kicker tells the truth per round — the stream's clock decides which of
     these a card wears, so four rounds stop all claiming to be open at once.
     `upcoming` is completed with the opening weekday ("Opens Monday"). */
  roundKicker: {
    upcoming: 'Opens',
    open: 'Submissions open',
    closed: 'Closed',
  },
  /* The rail ledger: both ends of the window, aligned so the column of four
     rounds reads like a table. */
  roundLedger: { opens: 'Opens', closes: 'Closes' },
  /* The close stub that sits at the deadline's own date. */
  lastDayLabel: 'Last day',
  /* The rail chip on a challenge round: the window's word, where a
     livestream's rail says Stream. */
  challengeChip: 'Challenge',
  /* The legend beside the zone control, one entry per row treatment the
     stream draws: the spined stream row, the bordered challenge window,
     and the dashed last-day stub. */
  legendLabel: 'How to read the stream',
  legend: {
    stream: 'Stream',
    round: 'Challenge window',
    close: 'Last day',
  },
  /* The stream's structural whispers: a numbered rule between Mondays, and an
     ochre one at the seam between what has happened and what has not. */
  weekLabel: 'Week',
  todayLabel: 'Today',
  /* The rounds are one challenge reset weekly, so each block names its week —
     the same count the stream's week rules use, anchored on the first round. */
  roundLabel: 'Week',
  /* Over a sponsor's mark, so a logo beside an event never reads as the
     event's organiser. */
  presentedByLabel: 'Presented by',
  multiDayLabel: 'Runs several days',
  modal: {
    close: 'Close',
    hostedBy: 'Hosted by',
    /* Null on some events: not everything on the schedule has a page to send
       people to yet, and a dead button is worse than none. */
    /* Named for where it goes, not what the modal already is: the reader is
       looking at the event's details, so a button reading "Event details"
       promised more of what they had. It opens the event's own page. */
    cta: 'Open event page',
  },
  /* Closes the page. The counterpart to the host callout that closes /fests:
     that one answers "no Fest near me", this one answers "I would rather be
     in a room than on a call". */
  festsCallout: {
    title: 'Would rather be in a room?',
    body: 'Hundreds of Fests are happening in person this October, hosted by local communities around the world. Find the one nearest you.',
    cta: 'Find a Fest',
    /* The print on the callout: a room full of people, which is the whole
       pitch. One of the /host strip's photos, reused rather than a new
       asset. */
    photo: '/host-strip-crowd.jpg',
    photoAlt: 'A crowd of Fest attendees sharing a laugh between sessions',
  },
};

export const notFound = {
  title: 'Page not found | Hacktoberfest 2026',
  eyebrow: 'Error 404',
  heading: { lead: 'This page', accent: 'doesn’t exist.' },
  body: 'The link may be broken, or the page may have moved. Everything about Hacktoberfest 2026 is back on the homepage.',
  cta: 'Back to Hacktoberfest',
};

export const siteMeta = {
  siteName: 'Hacktoberfest',
  title: 'Hacktoberfest 2026 | AI belongs to everyone',
  description:
    '300+ in-person Fests plus a global online event, all about building with open source AI. Join a Fest near you this October.',
  imageAlt: 'Hacktoberfest 2026',
};

/* Written for answer engines rather than readers, so it says plainly what the
   page only implies: who runs the event, and which paths are actually open
   right now. Keep it honest about what hasn't been announced — an answer
   engine stating that tickets are available would be worse than it saying
   nothing. */
export const aiContext = {
  orientation:
    'Hacktoberfest is an annual event stewarded by Major League Hacking (MLH) and DEV, with presenting partner DigitalOcean. It began in 2014 as a pull-request challenge run by DigitalOcean. In 2026 it becomes an event you take part in: 300+ community-hosted, one-day “Fests”, plus an online event open to everyone. The focus is hands-on building with open models, open source agents, and open tooling.',
  participation: [
    'Hosting is the live call to action. Anyone can host a Fest: a meetup group, a university club, or a few coworkers with a room to book. Fests come in two formats: Hack Days, funded mini-hackathons where people build projects, and Meet Ups, lighter gatherings that MLH does not fund. Every organizer gets swag and programming support. Applications are open, and Fests are confirmed on a rolling basis.',
    'Sponsorship has its own page at /sponsor/: the confirmed sponsor wall, the campaign footprint, and how to start sponsor setup or request partnership info.',
    'Confirmed Fests are published at /fests/, searchable by name, city, or country, with a map and a nearest-to-me sort. Individual Fests set their own attendee sign-up, linked from the directory. More Fests are added as they are approved, so the list grows through Preptember.',
  ],
  facts: [
    'Dates: October 2026. Specific Fest dates are not yet announced.',
    'Format: in person at 300+ local Fests, plus a global online event.',
    'Organizers: Major League Hacking (MLH) and DEV.',
    'Presenting partner: DigitalOcean.',
    'Theme: AI belongs to everyone, and the focus is open source AI.',
  ],
};

/* Copy for /my, the hub that replaces /progress. Kept out of llms.txt by
   not being imported in src/build/llms.mjs — the page is noindex and
   useless logged-out. The framing throughout is the sticker pack that gets
   mailed to participants; "envelope" is an internal delivery detail and
   never appears in copy. */
/* Small counts set in words, the way the rewards copy reads them aloud:
   "Eight stickers", not "8 stickers". Past twelve the digits stay. */
const numberWord = (n) => {
  const words = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
  ];
  return Number.isInteger(n) && n >= 0 && n < words.length
    ? words[n]
    : String(n);
};

export const my = {
  title: 'My Hacktoberfest | Hacktoberfest 2026',
  /* The hero greeting. `greeting` takes a first name; the fallback covers
     the loading state and any account with no usable name, so the line
     never renders as "Hi ,". */
  welcome: {
    greeting: (name) => `Hi ${name},`,
    fallbackName: 'there',
    /* One accent on both sides of the Preptember flag — the hub is "your
       Hacktoberfest" whichever month it's living in. The month-naming
       preptemberAccent swap retired 2026-08-18. */
    accent: 'welcome to your Hacktoberfest.',
  },
  /* The identity strip inside the welcome band: avatar, name, email, DEV
     link status, sign out. No address data — keeping PII out of this
     codebase is a spec decision. */
  identity: {
    /* Worn beside the name once the user has a real organized Fest —
       hosting or hosted. In-progress applications (draft/submitted) don't
       earn it; MLH's approval is what makes someone a host. */
    hostBadge: 'Host',
    manageCta: 'Manage MLH account',
    devConnectCta: 'Connect DEV account',
    devManageCta: 'Manage DEV account',
    /* DEV's account settings page is where the MyMLH connection is made and
       managed, so both button states land there. */
    devConnectHref: 'https://dev.to/settings/account',
    signOut: 'Sign out',
  },
  /* The Preptember band: a countdown to October 1st that stands in for the
     progress and activities bands while data/preptember.mjs keeps the flag
     on. Unit labels are plural even at 1 — "1 days" never shows long
     enough to matter against the churn of a live clock, and the steadier
     label reads better while the seconds tick. */
  countdown: {
    /* A single centered title inside the card, not the bands' lead/accent
       pair — the digits directly below it are the accent. "in", because
       the numbers complete the sentence. */
    title: 'Hacktoberfest starts in',
    labels: {
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
    },
  },
  /* Preptember's second band: the user's own organizing entries —
     applications in flight and confirmed events both — in full-width
     cards. Badges and CTAs reuse my.fests wholesale (same rungs, same
     words), so this object only holds the frame.

     The ghost always renders, after any cards, because the application
     is Preptember's one ask and the page never stops making it. Two
     voices: `ghost` sells the first application to an empty list,
     `ghostMore` invites a host to add another — "anyone can host" is
     noise to someone already hosting. */
  applications: {
    heading: { lead: 'Your', accent: 'applications.' },
    lede: 'Here are your Fest applications.',
    /* Worn by a published event in place of the fests band's
       "Hosting"/"Hosted": this list is about where applications stand,
       and a public event is the last rung — the one past
       applicationBadges.approved, which is an approval whose event MLH
       has not published yet. Naming the publish is what tells the two
       apart; "Hosting" is October's word, in Your Fests. */
    publishedBadge: 'Event Published',
    ghost: {
      title: 'Start your first application.',
      body: 'Anyone can host a Fest this October — a funded Hack Day or a lighter Meetup with swag. Applications are confirmed on a rolling basis, usually within a week.',
      cta: 'Apply to host a Fest',
    },
    ghostMore: {
      title: 'Host another Fest.',
      body: 'Want to run both a Hack Day and a Meetup? Want to run Fests in multiple cities? The sky’s the limit.',
      cta: 'Start another application',
    },
  },
  /* /my/fest/ — one Fest, as its hosts see it. The numbers come from MLH:
     registrations always, check-ins from the day of the event onward (nobody
     checks in before the doors open, and a zero shown in September reads as a
     fault). */
  dashboard: {
    title: 'Your Fest | Hacktoberfest 2026',
    backCta: 'Back to your Hacktoberfest',
    openCta: 'Open Fest dashboard',
    viewCta: 'View Fest page',
    manageCta: 'Manage in Organizer HQ',
    registrations: {
      title: 'Registrations',
      label: 'Registrations for your Fest',
    },
    checkIns: {
      title: 'Check-ins',
      label: 'People checked in on the day',
      /* Before the day. The card stands there greyed rather than absent, so
         a host learns the number is coming instead of wondering where it
         went - and it never shows a 0, which would read as nobody came. */
      locked: 'Check-ins open on the day of your Fest.',
    },
    /* The event pack. Nothing has shipped yet, so "not yet shipped" is the
       state that got designed; the shipped copy below exists so that the day
       a real tracking number lands, the card cannot go on claiming nothing
       has shipped. It is deliberately plain and will be replaced by a proper
       shipped state once there is real data to design against. */
    pack: {
      title: 'Event pack',
      notShipped: 'Your event pack has not yet shipped.',
      shipped: 'Your event pack is on its way.',
      trackingLabel: 'Tracking numbers',
    },
    forbidden: {
      eyebrow: 'Fest dashboard',
      heading: { lead: 'This Fest', accent: 'is not yours.' },
      body: 'You are not listed as a host of this Fest. If you think you should be, ask the host who applied to add you in Organizer HQ.',
    },
    notFound: {
      eyebrow: 'Fest dashboard',
      heading: { lead: 'We could not', accent: 'find that Fest.' },
      /* Three reasons, because the API cannot tell them apart and neither
         should the copy: a wrong id, an event not yet in our mirror, and a
         cancelled Fest, whose row IS mirrored but which the card builder
         drops - 16 cancelled events sit in the table today. Naming
         cancellation is what stops this page asserting something false to a
         host whose Fest was called off. */
      body: 'The link may be wrong, or the Fest may be unpublished or cancelled. Your own Fests are all on your Hacktoberfest page.',
    },
  },
  /* The final acknowledgements modal - the last thing between an
     MLH-published Fest and the public directory. Statement copy is
     PLACEHOLDER, marked for review before launch. */
  acknowledgements: {
    cta: 'Complete final acknowledgements',
    /* The opening pane: the stamped headline, then the host's own badge
       ladder replayed as a five-second resume of everything they already
       did. Rung labels come from the badges themselves (my.fests), so
       the replay can never drift from the cards it retells. */
    opening: {
      title: 'You’re nearly there!',
      /* "Four" counts the statements array below - keep them in step. */
      body: (name) =>
        `You applied, you were approved, you published. Four quick confirmations and ${name} heads to hacktoberfest.com.`,
      cta: 'Let’s go',
    },
    /* The pre-flight pane between the opening and the statements: the
       three automated checks FestNet will hold the Fest to. All passing
       walks straight into the statements; any failure stops the flow
       with the matching explanation, because acknowledging an event that
       cannot publish would only break the confetti's promise. */
    checks: {
      title: 'Checking your event details',
      labels: {
        coordinates: 'Venue coordinates',
        name: 'Fest name',
        duration: 'Duration',
        description: 'Description',
      },
      /* Each failed check says what is wrong and, where the host can put
         it right themselves, what right looks like. Coordinates is the
         one they cannot: a pin only MLH can place, so its line stays a
         diagnosis and its CTA stays the email. */
      failures: {
        coordinates: 'Your venue has not been placed on the map yet.',
        name: 'Your Fest has been renamed. Its name needs to read \u201cHacktoberfest Hack Day <City>\u201d or \u201cHacktoberfest Meetup <City>\u201d, optionally followed by \u201c x <Partner>\u201d, joining multiple partners with \u201c&\u201d.',
        duration:
          'Your Fest\u2019s running time is outside the allowed window. It needs to run for between 3 and 12 hours.',
        generic: 'One of your event details needs attention.',
      },
      /* The advisory verdict: a miss that nudges but must not stop the
         flow. Fests were being approved before MLH's API carried
         descriptions at all, so the directory shows standard per-format
         copy whenever a host has not written their own - absence costs
         them personality, not publication. The fix lives on the same
         Organizer HQ form as the event name, which is where the CTA
         points. */
      advisory: {
        lead: 'Make your Fest your own.',
        description:
          'You haven\u2019t set a custom description for your Fest. This is what potential attendees will see when deciding whether to attend! We recommend setting a custom description in Organizer HQ using the link below before continuing. You can update it at any time.',
        continueCta: 'Continue',
      },
      warningLead: 'We need to fix something together first.',
      /* The lead when every failed check is the host's own to fix.
         Nothing to do together: the pane hands them the form instead. */
      updateLead: 'Something to fix before your Fest goes live.',
      warningBody:
        'Please email the Hacktoberfest team and we\u2019ll help get your Fest live as quickly as possible.',
      /* The wait is real. MLH's events reach us through the same
         five-minute sync as everything else, so a host who fixes their
         event and comes straight back would fail the identical check. */
      updateBody:
        'Update your event on MLH, then wait five minutes before trying this again. That is how long your changes take to reach us.',
      updateCta: 'Update event',
      email: 'hacktoberfest@mlh.io',
      emailCta: 'Email hacktoberfest@mlh.io',
      close: 'Close',
    },
    title: 'Final acknowledgements',
    intro: (name) => `Confirm these to put ${name} on hacktoberfest.com.`,
    /* The landing after the last Confirm: the one moment the flow gets to
       celebrate, so it closes with confetti instead of vanishing. */
    success: {
      title: 'Congratulations!',
      body: (name) =>
        `${name} is now live on hacktoberfest.com. It can take up to five minutes to become publicly visible.`,
      done: 'Done',
    },
    /* All three statements are real, reviewed copy. The venue slide
       (index 1) also renders the address line and the map pin the
       statement asks the host to check. */
    /* A bold paragraph of its own under the first statement when the Fest
       is a Meetup: that statement mentions reimbursement eligibility, and
       only Hack Days have any. Said here so a Meetup host never reads the
       spending line as a promise of funding. */
    meetupReimbursement:
      'I understand that only Hack Days are eligible for reimbursement. Meetups are not eligible for reimbursement.',
    statements: [
      'I acknowledge that I will follow all Major League Hacking guidelines for my event, including keeping it in person and keeping spending within the policy-approved limits and categories. If my plans need to deviate from these guidelines, I will check with MLH first at hacktoberfest@mlh.io. I understand that unapproved deviations may put my reimbursement eligibility and my ability to work with MLH on future events at risk.',
      'I have double checked that the address and map pin above match my venue.',
      'I understand that I must email hacktoberfest@mlh.io before changing key details of my Fest, including its name, dates, and times, and that I must wait for Major League Hacking to approve a change before making it. If I change these details without checking in first, my Fest will automatically be hidden from hacktoberfest.com.',
      /* The one statement that speaks for the Fest by name - a function
         of it, resolved where the modal knows which Fest is confirming. */
      (name) =>
        `I, on behalf of ${name}, promise to abide by the MLH Code of Conduct.`,
    ],
    /* MLH's Code of Conduct, VERBATIM from
       github.com/MLH/mlh-policies/blob/main/code-of-conduct.md (last
       updated April 16th 2026). Like the mission statement: never edit
       individual lines, replace the whole thing when MLH revises it.
       Rendered in the modal's scroll-through box, which the host must
       read to the end before the accept box unlocks. */
    codeOfConduct: {
      hint: 'Scroll to the end of the Code of Conduct to accept it.',
      blocks: [
        {
          lead: true,
          text: 'TL;DR. Be respectful. Harassment and abuse are never tolerated. If you are in a situation that makes you uncomfortable at an MLH Member Event, if the event itself creates an unsafe or inappropriate environment, or if interacting with an MLH representative or event organizer makes you uncomfortable, please report it using the procedures included in this document.',
        },
        {
          text: 'Major League Hacking (MLH) stands for inclusivity. We believe that every single person has the right to hack in a safe and welcoming environment.',
        },
        {
          text: 'Harassment includes but is not limited to offensive verbal or written comments related to gender, age, sexual orientation, disability, physical appearance, body size, race, religion, social class, economic status, and veteran status. Additional cases of harassment include but are not limited to sharing sexual images, violent depictions, vulgar language, deliberate intimidation, stalking, following, brigading, doxxing, harassing photography or recording, sustained disruption of talks or other events, inappropriate physical contact, and unwelcome sexual attention.',
        },
        {
          text: 'In particular, attendees should not use sexualized images, activities, or other material both in their hacks and during the event. Booth staff (including volunteers) should not use sexualized clothing/uniforms/costumes or otherwise create a sexualized environment.',
        },
        {
          text: 'If what you\u2019re doing is making someone feel uncomfortable, that counts as harassment and is enough reason to stop doing it. Participants asked to stop any harassing behavior are expected to comply immediately.',
        },
        {
          text: 'Sponsors, judges, mentors, volunteers, organizers, MLH staff, and anyone else participating in the event are also subject to the anti-harassment policy.',
        },
        {
          text: 'If a participant engages in harassing behavior, MLH may take any action it deems appropriate, including warning the offender or expulsion from the event with no eligibility for reimbursement or refund of any type.',
        },
        {
          text: 'If you are being harassed, notice that someone else is being harassed, or have any other concerns, please contact MLH using the reporting procedures defined below.',
        },
        {
          text: 'MLH representatives can help participants contact campus security or local law enforcement, provide escorts, or otherwise assist those experiencing harassment to feel safe for the duration of the event. We value your attendance.',
        },
        {
          text: 'We expect participants to follow these rules at all hackathon venues, hackathon-related social events, hackathon-supplied transportation, and online interactions related to the event.',
        },
        { heading: 'Reporting Procedures' },
        {
          text: 'If you feel uncomfortable or think there may be a potential violation of the code of conduct, please report it immediately using one of the following methods. All reporters have the right to remain anonymous.',
        },
        {
          text: 'By sending information to the general reporting line, your report will go to our incident response team members.',
        },
        {
          list: [
            'North America General Reporting - +1 409 202 6060, incidents@mlh.io',
            'Canada General Reporting - +1 343 453 4532, incidents@mlh.io',
            'UK General Reporting - +44 800 808 5675, incidents@mlh.io',
            'Europe General Reporting - +44 333 038 5995, incidents@mlh.io',
            'Asia-Pacific General Reporting - +91 000 80004 02492, incidents@mlh.io',
            'India General Reporting - 000 80004 02492, incidents@mlh.io',
          ],
        },
        { heading: 'Special Incidents' },
        {
          text: 'If you are uncomfortable reporting your situation to one or more of these people or need to contact any of them directly in case of emergency, direct contact details are listed below.',
        },
        {
          list: [
            'Mary Siebert - +1 (516) 362-1835, mary@mlh.io',
            'Swift - +1 (347) 220-8667, swift@mlh.io',
          ],
        },
        {
          text: 'MLH reserves the right to revise, make exceptions to, or otherwise amend these policies in whole or in part. If you have any questions regarding these policies, please contact MLH by e-mail at incidents@mlh.io.',
        },
        { text: 'This document was last updated on: April 16th 2026' },
      ],
    },
    /* The venue slide's guidance: what the map is, and what to do when it
       is wrong. Split around the address so the email renders as a mailto
       link. */
    venueCheck: {
      intro: 'Your venue, exactly as it will appear on hacktoberfest.com.',
      wrongLead: 'Wrong address or pin? Email ',
      wrongEmail: 'hacktoberfest@mlh.io',
      wrongTail: ' before continuing.',
    },
    /* When the venue slide has no pin to draw: the geocode has not run
       yet, so the address line has to carry the check alone. */
    noPin: 'The map pin is still being placed. Check the address above.',
    /* One statement per slide; the counter keeps the host oriented. */
    progress: (step, total) => `${step} of ${total}`,
    next: 'Next',
    back: 'Back',
    confirm: 'Confirm',
    cancel: 'Not yet',
    incomplete: 'Confirm this statement to continue.',
    failure: 'That did not go through. Try again in a moment.',
  },
  /* The host resources band, under Your Applications. The handbook and
     the team's inbox are open to everyone: reading one and writing to the
     other is how someone decides to apply, and neither can be gated in
     practice, so a padlock beside either would claim a gate that does not
     exist. `locked` lives here beside each item's words so the component
     can't disagree with the copy about what's gated.

     The Discord row (locked: false, "MLH Discord", "Other hosts and the
     Hacktoberfest team are in #hacktoberfest-2026, ready for your
     questions.", "Join the Discord") is hidden for now. Restore it here,
     between the handbook and the inbox, and add its id back to the open
     list in preptember.test.mjs; HOST_DISCORD_URL and its link wiring in
     HostResourcesBand are still in place.

     The brand kit row (locked: true, "Logos, colors, and templates for
     promoting your Fest under the Hacktoberfest name") is hidden for now:
     it has no real destination yet, and a padlocked promise with nothing
     behind it oversells. Restore it here — and the unlock sentence in the
     lede — once HOST_BRAND_KIT_URL points somewhere real; its link wiring
     in HostResourcesBand and the placeholder guard in preptember.test.mjs
     are still in place. */
  hostResources: {
    heading: { lead: 'Your host', accent: 'resources.' },
    lede: 'What you need to plan and run a Fest.',
    /* Worn by every gated row in place of its link until approval. */
    lockedBadge: 'Approved hosts',
    items: [
      {
        id: 'handbook',
        locked: false,
        title: 'Host handbook',
        copy: 'From booking venues to event programming to getting your swag.',
        cta: 'Read the handbook',
      },
      {
        id: 'email',
        locked: false,
        title: 'Email the team',
        copy: 'Send your questions to hacktoberfest@mlh.io and the Hacktoberfest team will pick them up.',
        cta: 'Send an email',
      },
    ],
  },
  /* Closes the Preptember page above the footer — the fests directory's
     "That's your cue." callout retold as "why host", the pitch as four
     numbered perk rows rather than a paragraph. Every row that promises
     something restates a host.support item, so this list can never
     promise more than /host does — funding stays Hack-Day-only here for
     the same reason it does there. The last row promises nothing; it
     closes the pitch on the feeling rather than the perks. The CTA points at /host/, which carries the formats and the
     application; the direct apply link already lives in the applications
     ghost above, so this band sells rather than repeats the ask. */
  whyHost: {
    title: 'Perks for Hosts',
    perks: [
      'Stickers, t-shirts, and swag for your participants',
      'MLH funding if you’re hosting a Hack Day',
      'Programming support, so you’re not planning your day alone',
      'Promotion in the Fests directory and across MLH and DEV channels',
      'TFW you’ve brought your community together',
    ],
    cta: 'Host a Fest',
    photoAlt:
      'Hack Day participants working on laptops around a table while a host leans in to help',
  },
  /* The thank-you postcard: closes the Preptember page instead of the
     why-host pitch once an application is actually sent (hasApplied —
     submitted or beyond; a draft still gets the pitch). Both faces are
     inline SVGs in ThankYouBand; these are the back's words, kept here so
     copy edits never touch geometry. The back's body is pre-wrapped: each
     inner array is one paragraph, each string one line on the card. */
  thankYou: {
    title: 'You’ve got mail.',
    cardLabel: 'Postcard from the Hacktoberfest team. Flip to read the note',
    flipHint: 'flip me →',
    flipBackHint: '← flip back',
    /* Almost no live strings: both faces became supplied artwork
       (2026-08-18) with the words baked into vector outlines. The
       greeting is the one live line — the artwork leaves the top-left
       blank so the card can greet the host by name — and the rest of
       the note lives here only so the screen-reader copy of the card
       says what the picture says. Change the artwork, change these. */
    note: {
      greeting: 'Hey,',
      /* Who the card greets when it can't use the host's first name —
         junk profile data, or a name long enough to run under the HF
         logo mark (lib/postcardGreeting.mjs makes that call). Not
         welcome.fallbackName's "there": this card is thanking someone
         for applying to host, and "future host" is who they are. */
      fallbackName: 'future host',
      body: [
        'Your application is in! Sometime in October, you might find yourself surrounded in a room full of people having magical aha! moments, all because you raised your hand.',
        'Thank you for volunteering to host a Fest.',
        'We’re reading every application with care and you’ll hear from us soon.',
      ],
      ps: 'P.S. OCTOBER’S GOING TO BE GOOD!',
      signature:
        'The Hacktoberfest Applications Team: Stephen, Jacklyn & Quinn',
    },
  },
  /* The sticker book (components/Album): every sticker there is to earn,
     required ones first, on a page per type. The cards inside are
     components/ActivityCard, whose words live under activitiesPage.list so
     /my and /activities/ say the same things about the same activities;
     the tab labels are activitiesPage.list.types for the same reason. */
  album: {
    heading: { lead: 'Your', accent: 'sticker book.' },
    /* One line, whatever the state: what a sticker is and what they are
       for, since this is the first place the page can say it. The count is
       the spine's; the state is the hero's. */
    intro:
      'This Hacktoberfest, you earn a virtual sticker for every challenge you complete, from open source to open-weight AI. Collect enough and you unlock rewards.',
    /* Under the book: the lag between doing a thing and seeing its
       sticker, said once so nobody refreshes for an hour. */
    disclaimer:
      'Stickers may take up to 12 hours to be marked as earned after completing an activity.',
    tabsLabel: 'Sticker book pages',
    tabCount: (earned, total) => `${earned} of ${total}`,
    /* Two pages wear a mark instead of their name at their head
       (components/Album); the tabs stay words. DEV's logo leads and `rest`
       follows it; `name` is what the logo stands for, read out ahead of
       the rest and never drawn. Global Hack Week's lockup carries its own
       name, as the image's alt, from activitiesPage.list.types. */
    devMark: { name: 'DEV', rest: 'Challenges' },
    /* One line under each page's title, keyed by tab. A type without a
       line here still renders, with no note. */
    pages: {
      required: 'You must earn these stickers to receive any rewards.',
      dev: 'Build with open source and open-weight models, and share what you learned.',
      livestreams: 'Attend live sessions and hone your skills.',
      ghw: 'A week of learning and community.',
      tools: 'Great tools help you build awesome projects.',
      inperson: 'Meet your local community and collect swag.',
    },
    /* The cells on a page: the sticker, its name, one line of status. The
       line under an earned sticker is the date, or its source in words
       (activitiesPage.list.source); `earned` is the tick's name for
       assistive tech, the one place the word is said. */
    cell: {
      required: 'Required',
      earned: 'Earned',
      notYet: 'Not yet',
      /* A DEV challenge with no DEV account linked: the padlock's name
         for assistive tech, and the line where the link would be. */
      locked: 'Locked',
      lockedLine: 'Connect DEV to unlock',
    },
    /* The spine along the bottom: the book's count and the way to the
       public catalogue. */
    spine: {
      count: (earned, total) => `${earned} of ${total} stickers unlocked`,
      detailCta: 'See every activity',
    },
  },
  /* The share modal (components/ShareModal): one system for a sticker,
     the whole book, and later certificates. Post text carries the site
     address at the end so a network that takes text shows it. */
  share: {
    title: { sticker: 'Share this sticker', book: 'Share your sticker book' },
    /* The line under the title, by what is being shared. */
    lede: {
      sticker: 'You earned this sticker. Share it with the world.',
      book: 'You earned those stickers. Share them with the world.',
    },
    /* The primary block: on a phone the system sheet, which uploads the
       picture itself; everywhere the four composers. A composer opens
       with the words filled in, and the picture is copied on the same
       click, so the post is one paste away. */
    postOn: 'Post it to',
    sheetThen: 'or post it to',
    /* Under each network's name on its tile: what the press does. */
    networkAction: 'copies + opens',
    /* The tile's line for the beat after a press, while the picture is
       on the clipboard and before the composer opens. */
    tileCopied: 'Image copied!',
    keep: 'Or just grab the picture:',
    preparing: 'Getting your picture ready…',
    buttons: {
      share: 'Share the picture',
      copy: 'Copy picture',
      copied: 'Copied!',
      download: 'Download picture',
      close: 'Close',
    },
    stickerCta: 'Share',
    bookCta: 'Share your sticker book',
    networks: {
      x: 'X',
      linkedin: 'LinkedIn',
      bluesky: 'Bluesky',
      threads: 'Threads',
    },
    pasteHintNoText:
      'Picture copied. Paste it into your post and say a few words.',
    /* The browser offered its share sheet and then refused to open it
       (Chrome on macOS does). The picture went to the clipboard, or to
       a download where the clipboard would not take it. */
    sheetRefused:
      'Your browser wouldn’t open its share sheet, so we copied the picture instead. Paste it into a post, or pick a network above.',
    sheetRefusedSaved:
      'Your browser wouldn’t open its share sheet, so we downloaded the picture instead. Attach it to a post, or pick a network above.',
    error:
      'We couldn’t make the picture just now. Check your connection and try again.',
    /* The words that go with the picture. A milestone brings its own
       (my.rewards.<milestone>.shareText), since "the Earn a sticker pack
       sticker" is not a sentence. */
    text: {
      sticker: (label) =>
        `I just earned the “${label}” sticker at Hacktoberfest 2026! #Hacktoberfest https://hacktoberfest.com`,
      book: (earned, total) =>
        `${earned} of ${total} stickers in my Hacktoberfest 2026 sticker book so far! #Hacktoberfest https://hacktoberfest.com`,
    },
    card: {
      wordmark: 'Hacktoberfest 2026',
      earnedBy: (name) => `Earned by ${name}`,
      count: (earned, total) => `${earned} of ${total} stickers`,
      site: 'hacktoberfest.com',
    },
  },
  /* The rewards band (components/RewardsBand), above the book: the two
     milestones as two more stickers, earned by earning stickers, each a
     card with its badge, a line saying what happens next in its state,
     and what it needs. The intro changes with the level. `n` is the
     activity count Milestone 2 asks for (thresholds.complete). */
  rewards: {
    heading: { lead: 'Your', accent: 'milestones.' },
    /* The line under the heading, whatever the state: what a milestone
       is and what each one gets you. The counts are the book's (eight and
       fifteen activity stickers plus the required two); the cards' meters
       say the same numbers from the API's thresholds. The state is the
       hero's (intro below). */
    lede: 'Complete each milestone to unlock rewards shipped straight to your door.',
    intro: {
      pending: (n) =>
        `Any sticker puts the pack in the mail. ${numberWord(n + 2)} stickers in the book unlock the holographic one, and that’s Hacktoberfest complete.`,
      stickersEarned: (n) =>
        `Your pack is on its way. ${numberWord(n + 2)} stickers in the book unlock the holographic sticker and complete Hacktoberfest.`,
      complete:
        'You’ve completed Hacktoberfest 2026. The holographic sticker is yours, and your pack is in the mail.',
      completionist:
        'You’re a Hacktoberfest 2026 Completionist. Seventeen stickers in the book, the holographic sticker yours, and the pack in the mail.',
    },
    /* The badge on an earned card, when the date is known: the day the
       milestone was reached (lib/stickerBook.mjs rewardsState.earnedAt). */
    earnedOn: (date) => `Earned ${date}`,
    pack: {
      tag: 'Milestone 1',
      title: 'Earn an IRL sticker pack',
      shareText:
        'I just earned my Hacktoberfest 2026 sticker pack! #Hacktoberfest https://hacktoberfest.com',
      reachedBadge: 'Earned',
      pendingBadge: (done, total) => `${done} of ${total}`,
      /* One line while it is pending, whatever is left to do: the pips
         under it say which. */
      why: {
        earned:
          'Your sticker pack will be shipped 8-12 weeks after Hacktoberfest concludes.',
        pending:
          'Sign in, add your address, and earn any other virtual sticker to receive Hacktoberfest 2026 stickers in the mail.',
      },
      needs: {
        signedIn: 'Signed in',
        address: 'Address',
        activity: 'Earned any sticker',
      },
      /* The CTA's destination is MLH_ADDRESS_URL in data/links.js. */
      addressCta: 'Add address',
    },
    complete: {
      tag: 'Milestone 2',
      title: 'Unlock a bonus holographic sticker',
      shareText:
        'I just unlocked the holographic sticker at Hacktoberfest 2026! #Hacktoberfest https://hacktoberfest.com',
      reachedBadge: 'Earned',
      pendingBadge: (done, total) => `${done} of ${total}`,
      why: {
        earned: 'We’ll include a holographic sticker in your sticker pack.',
        pending:
          'Earn any ten virtual stickers and we’ll include a bonus holographic sticker in your mailed sticker pack.',
      },
      meterLabel: (filled, target) =>
        `${filled} of ${target} stickers toward the holographic sticker`,
    },
    /* Milestone 3, shown only once the first two are earned. A status and
       nothing more: nothing ships, nothing unlocks, so the copy promises
       nothing but the word. */
    completionist: {
      tag: 'Milestone 3',
      title: 'Become a Completionist',
      shareText:
        'I’m a Hacktoberfest 2026 Completionist! Every sticker in the book. #Hacktoberfest https://hacktoberfest.com',
      reachedBadge: 'Earned',
      pendingBadge: (done, total) => `${done} of ${total}`,
      why: {
        earned:
          'Congratulations, you’re a Hacktoberfest 2026 Completionist and are in the draw to win a Hacktoberfest t-shirt!',
        remaining: (left) =>
          `${left} more sticker${left === 1 ? '' : 's'} make${left === 1 ? 's' : ''} you a Completionist. A title, and a certificate to show for it.`,
      },
      meterLabel: (filled, target) =>
        `${filled} of ${target} stickers toward Completionist`,
    },
  },
  /* The inventory band (components/Inventory), the last on /my: what
     the stickers earned, as a locker of slots with a
     drawer for the one picked. States are lib/inventory.mjs's words for
     where a thing is; every line here is keyed by them. */
  /* The inventory band (components/Inventory), the last on /my: what the
     stickers earned, as a locker of cells with a page beside it for the
     one picked. The things themselves come from the API (GET
     /api/me/items): their names, their two facts, their call to action.
     Only the words around them live here. */
  inventory: {
    heading: { lead: 'Your', accent: 'rewards.' },
    /* One line, whatever the locker holds: the ghost cell and the spine
       say how full it is. */
    intro:
      'All the virtual and physical rewards you’ve earned this Hacktoberfest.',
    listLabel: 'Your rewards',
    /* The two pages of the locker, each with a head and a note, the way
       the sticker book heads its pages. */
    pages: {
      have: { title: 'Everything you’ve earned' },
      picked: { title: 'About this item' },
    },
    /* No number of slots is ever said: the locker holds whatever October
       put in it, and the empties are room, not a count. */
    count: (items) => `${items} ${items === 1 ? 'item' : 'items'} unlocked`,
    /* The right page with nothing earned: the ghost's entry, badged as
       what is coming rather than as earned, with its facts under it. */
    upNext: 'Up next',
    kinds: { physical: 'Physical', digital: 'Digital' },
    /* The line under the ghost an empty locker shows: the first thing
       to earn, greyed, so the cells say what goes in them. */
    notYet: 'Not yet',
    /* A thing that lives on a DEV profile, earned with no DEV account
       linked to MyMLH: the line under it, and the page's word. The button
       is the welcome band's (my.identity.devConnectCta, devConnectHref). */
    devUnlinked: 'Connect DEV to see it',
    devUnlinkedNote:
      'This lives on a DEV profile, and yours is not linked to MyMLH yet. Connect your DEV account and DEV adds it there.',
    /* A certificate's two files, rendered by the API on the click and never
       stored: the buttons, and the line when the render did not come. */
    downloads: {
      pdf: 'Download PDF',
      png: 'Download PNG',
      working: 'Making it',
      failed:
        'The certificate could not be made just now. Try again in a moment.',
    },
    /* The right page: the kind and the date on one line, then the two
       facts every thing has. */
    drawer: {
      earned: (date) => `Earned ${date}`,
      earnedBy: 'Earned by',
      how: 'Gets to you',
      newFlag: 'New',
    },
  },
  fests: {
    heading: { lead: 'Your', accent: 'Fests.' },
    /* The line under the heading, whatever the state: what Fests are and
       why to go. The cards under it say where this person is going. */
    lede: '300+ in-person Fests are running around the world this Hacktoberfest. Sign up for one, learn about open source and open-weight AI, and meet your local community.',
    /* Badges come from the participation status the API sends —
       "Registered" until the organizer scans you in, "Checked in" after.
       Never derived from the calendar: a registered no-show stays
       "Registered" forever, which is the truth. */
    statusBadges: {
      registered: 'Registered',
      checkedIn: 'Checked in',
      /* Derived, not an API status: still 'registered' twelve hours after
         the fest ended means the organizer never scanned this person in. */
      didNotAttend: 'Did not attend',
    },
    /* Organized events carry no participation status, so their badge is the
       role, past-tensed once the day is over. "Hosting", not "Organizing" —
       the site's vocabulary for running a Fest is hosting (/host/, "Host a
       Fest"); the API's role field stays `organizing`, which is MLH's word
       for it. */
    roleBadges: {
      organizing: 'Hosting',
      organized: 'Hosted',
    },
    /* An event application in flight — the organizer's Fest before it is a
       Fest. The badge names where the application stands (MLH's ladder:
       draft → submitted → approved). The two pre-approval CTAs send the
       organizer to MLH's application form; the approved CTA says "Manage
       event" because the API swaps the card's manageUrl to the Organizer
       HQ event page at that rung. Approved applications normally render
       as the real event instead; the approved strings only show in the
       gap before the event goes public. */
    applicationBadges: {
      draft: 'Application started',
      submitted: 'Application submitted',
      /* Approved, but the event is not public yet: the rung names the
         host's next move rather than MLH's last one, because that move
         is the only thing left between here and a live Fest. */
      approved: 'Ready to publish',
      /* MLH's `rejected`, which OHQ uses for "we sent this back to you":
         the reviewers want changes, and the application reopens for the
         host. Resubmitting returns it to the submitted rung. */
      rejected: 'Revisions required',
    },
    /* The organizing EVENT card rungs - which of MLH's world and ours the
       Fest has reached. See eventCardState in lib/fests.mjs. */
    eventBadges: {
      needsAcknowledgements: 'One step left',
      checksUnderway: 'Final checks underway',
      /* The rung for a Fest whose checks are failing. Deliberately not a
         wait: nothing is running, and the move is the host's. */
      checksFailed: 'Action needed',
    },
    /* The rung a host lands on when FestNet's checks fail after they have
       acknowledged: the Fest is off the website and nothing is running.
       The badge says a move is needed, and this names which one.

       Every sentence about a specific check is reused from the
       acknowledgements pane rather than written again, so the two surfaces
       cannot describe the same failure differently. */
    checksFailed: {
      cta: 'See what needs fixing',
      title: 'Your Fest is not listed yet',
      /* Said before the list, and true whichever check failed: hosts told
         only "action needed" have no way to know the Fest came off the
         site, or that it goes back up by itself once the check passes. */
      intro:
        'Your Fest is not on the Hacktoberfest website at the moment. We check these details every few minutes, so it will be listed again as soon as this is put right.',
      listLead: 'What needs fixing',
    },
    applicationCtas: {
      draft: 'Finish your application',
      submitted: 'View application',
      /* The approved rung's next act is publishing the event in MLH, and
         the CTA names it - the link is the OHQ event page where that
         happens. */
      approved: 'Publish event',
      rejected: 'Revise your application',
    },
    viewFestCta: 'View fest',
    /* The two ghost cards in the fests grid — dashed like the directory's
       empty state: slots waiting to be filled, not Fests. findGhost stands
       in for the grid when there are no Fests yet, paired with hostGhost's
       standing nudge that Fests need hosts too. */
    findGhost: {
      title: 'Find your first Fest.',
      body: 'Hundreds of one-day Fests are happening across the world this October. There’s probably one near you.',
      cta: 'Find a Fest',
    },
    /* The find ghost's second voice, once any Fest is on the list —
       registered, checked in, hosting, or hosted alike. It replaced the
       pink Find a Fest button that used to sit under the grid: one find
       CTA, always in the grid, in whichever voice fits. */
    findGhostMore: {
      title: 'Register for another Fest.',
      body: 'Fests run all October, all over the world. Grab a spot at another one near you.',
      cta: 'Find a Fest',
    },
    hostGhost: {
      title: 'Host your own Fest.',
      body: 'No Fest near you, or want to lead one yourself? Anyone can host a Hack Day or a Meetup.',
      /* Swapped in when the user is already registered for a Fest but not
         hosting one — "No Fest near you" doesn't apply to someone who
         found theirs. */
      bodyRegistered:
        'Want to lead one yourself? Anyone can host a Hack Day or a Meetup.',
      cta: 'Host a Fest',
    },
  },
  /* The band under the account strip that points hosts at the other hub.
     /my/ is the attending hub and /my/hosting/ the hosting hub; only
     people with a hosting entry see either link, because only they have
     two hubs. `body` takes the count of organizing entries; the attending
     side ignores it, but keeps the shape so the band has one call. */
  hubLink: {
    // Names the band's <nav> landmark for assistive tech.
    label: 'Your other hub',
    hosting: {
      badge: 'Hosting',
      body: (count) =>
        count === 1
          ? 'You’re hosting a Fest this October. Its application, its dashboard and your host resources are on your hosting hub.'
          : `You’re hosting ${count} Fests this October. Applications, dashboards and host resources are on your hosting hub.`,
      cta: 'Go to your hosting hub',
      href: '/my/hosting/',
    },
    attending: {
      badge: 'Attending',
      body: () =>
        'Your stickers, rewards and the Fests you’re going to are on your attending hub.',
      cta: 'Go to your attending hub',
      href: '/my/',
    },
  },
  /* The hosting hub's own title and hero line. The greeting stays "Hi
     <name>," on both hubs; only the accent under it says which one. */
  hosting: {
    title: 'Hosting | Hacktoberfest 2026',
    welcomeAccent: 'here’s your hosting hub.',
  },
  error: {
    title: 'We couldn’t load your Hacktoberfest',
    body: 'Something went wrong on our end. Your progress is safe. This is just the page failing to fetch it.',
    cta: 'Try again',
  },
  /* The whole-page MLH outage state. Deliberately blames nothing on the
     participant and offers no retry button: the existing `error` state's
     retry is right for a transient fetch failure, but re-rendering this page
     cannot fix MyMLH being down, and a button that looks like it might is
     worse than none. Hacktoberfest runs on MyMLH, so naming it plainly is
     more useful than a generic outage line. */
  mlhDown: {
    eyebrow: 'Your Hacktoberfest',
    title: 'MyMLH is unreachable',
    accent: 'Try again shortly.',
    body: 'Hacktoberfest runs on MyMLH, and we can’t reach it right now. Nothing is wrong with your account or your progress, so please check back in a few minutes.',
  },
  loading: 'Loading your Hacktoberfest…',
};

/* One screen behind two doors: /login shows it instead of starting the
   OAuth hop, /auth/callback after an exchange whose session would not
   store.

   Deliberately says "we can't sign you in" rather than anything about
   sessions failing to save. At /auth/callback that is not literally what
   happened, since the exchange itself succeeded, but the mechanism is ours
   to worry about and the outcome is the only part that is theirs: they
   are not signed in, and here is the setting that would let them be.
   Naming the storage would trade a sentence they can act on for one they
   have to decode.

   Which is also why the copy names blocked cookies flatly instead of
   hedging. A storage quota that is already full lands here identically and
   is not what the words describe, but it is rare, invisible to us, and the
   instruction underneath is harmless in that case anyway. Precision about
   the cause is worth less here than an instruction that fits in a breath.

   The CTA restarts at /login/, which is a terminus rather than a circle:
   /login checks canPersistSession before it starts anything, so someone who
   has not changed the setting lands straight back here with no wasted trip
   through MyMLH, and someone who has gets signed in. */
const sessionBlocked = {
  heading: { lead: 'We can’t sign', accent: 'you in.' },
  body: 'Your browser is blocking cookies and site data for hacktoberfest.com, and signing in needs them. Allow them for this site, then try again.',
  /* Chrome, Safari and Firefox, which is the trio this audience actually
     arrives on: Edge outranks Firefox across the web at large but not among
     people who write code, and its path is close enough to Chrome's to be
     guessable from it. Safari carries a second line for the Mac because the
     iPhone is where the culprit setting is most often switched on, and the
     two live nowhere near each other.

     These will go stale, deliberately. Menus move every few releases, and a
     path a year out of date still lands someone in roughly the right screen,
     which beats a sentence that names a setting without saying where it is.
     Worth a glance whenever someone is in here anyway. */
  steps: [
    {
      term: 'Chrome',
      description:
        'Settings → Privacy and security → Site settings → Cookies and site data',
    },
    {
      term: 'Safari',
      description:
        'Settings → Apps → Safari → turn off Block All Cookies. On a Mac, Safari → Settings → Privacy.',
    },
    {
      term: 'Firefox',
      description: 'Settings → Privacy & Security → Cookies and Site Data',
    },
  ],
  cta: 'Try again',
};

export const login = {
  title: 'Sign in | Hacktoberfest 2026',
  redirecting: 'One moment. We’re taking you to MyMLH to sign in.',
  eyebrow: 'Your Hacktoberfest',
  blocked: sessionBlocked,
};

/* Where the API's OAuth failure redirect lands (/auth/error). One state
   only: whatever went wrong over there, the honest offer here is the same
   try-again. */
export const authError = {
  title: 'Sign-in error | Hacktoberfest 2026',
  eyebrow: 'Your Hacktoberfest',
  heading: { lead: 'That sign-in', accent: 'didn’t work.' },
  body: 'MyMLH couldn’t finish signing you in. No harm done: starting again usually clears it up.',
  cta: 'Sign in with MyMLH',
};

/* The transit screen between MyMLH and /my. Participants should barely see
   the working state; the failed state has to stand on its own. */
export const authCallback = {
  title: 'Signing you in | Hacktoberfest 2026',
  eyebrow: 'Your Hacktoberfest',
  working: {
    heading: { lead: 'Signing you', accent: 'in.' },
    body: 'One moment. We’re finishing your sign-in.',
  },
  failed: {
    heading: { lead: 'That sign-in link', accent: 'has expired.' },
    body: 'Sign-in links can only be used once, and they don’t last long. Start again and you’ll be straight back.',
    cta: 'Sign in with MyMLH',
  },
  /* MyMLH lets people withhold their email address, and /auth/token then
     answers 200 with a well-formed session carrying none. The exchange
     succeeded, so `failed` — "that link has expired, start again" — is false
     twice over, and its CTA sends them back through MyMLH to arrive here
     again with the same profile, forever. Nothing on this site can break
     that loop, so the CTA points at the one place that can: the MyMLH
     profile (MLH_EMAIL_URL in data/links.js — a real link, so it lives with
     the other tagged outbound links rather than here). */
  noEmail: {
    heading: { lead: 'MyMLH didn’t share', accent: 'an email address.' },
    body: 'Your sign-in worked, but we can’t set up your Hacktoberfest without an email address to reach you on. Add one to your MyMLH profile, then sign in again.',
    cta: 'Add an email on MyMLH',
  },
  /* Anything that isn’t the API rejecting the code: offline, CORS, DNS, a
     5xx. Nothing has expired, so telling someone to start again because
     their link is spent sends them round a loop that cannot work. */
  unavailable: {
    heading: { lead: 'We couldn’t reach', accent: 'the server.' },
    body: 'Your sign-in link is fine. We just couldn’t finish the handover. Check your connection and try again.',
    cta: 'Try again',
  },
  /* The exchange succeeded and the session was well-formed. It just did not
     survive being written down. Shared with /login so both ends of the hop
     tell the same story. */
  blocked: sessionBlocked,
};

/* /activities/: what a participant completes to earn a sticker pack and to
   complete Hacktoberfest. Public; signed in, the milestones and done marks
   appear. Every count is a function of the threshold the API serves, never
   a literal three. The bands' copy arrives with the bands. */
export const activitiesPage = {
  title: 'Activities | Hacktoberfest 2026',
  description: `Every Hacktoberfest 2026 sticker and how to earn it: livestreams, Global Hack Week, DEV Challenges, tools to connect, and Fests in person. ${ACTIVITIES.length} challenges, a virtual sticker for each, and real ones in the mail once you have collected enough.`,
  eyebrow: 'Attend online · Activities',
  heading: { lead: 'Every sticker,', accent: 'and how to earn it.' },
  intro:
    'Every challenge this October earns a virtual sticker for your book. Collect enough and real ones turn up in the mail.',
  /* The one line of progress on this page. The book with the milestones
     lives on /my; here a signed-in visitor gets a count and the way there.
     The count is the strip's own: the activity stickers only, since the
     strip draws one slot per activity. */
  /* The count is the progress strip's line (components/ProgressStrip,
     which no page draws any more; /my has its own book spine). */
  strip: {
    count: (done, total) => `${done} of ${total} stickers earned`,
  },
  /* Closes the page (components/BookCallout, shared with /online): the
     way to the book on /my, where progress is kept. */
  bookCallout: {
    title: 'How far along are you?',
    body: 'Your sticker book keeps count: every sticker you’ve earned, the ones still to do, and what’s on its way in the mail. Sign in to see it.',
    cta: 'See your sticker book',
    href: '/my/',
    stickers: ['livestreams-1', 'milestone-pack', 'ghw'],
  },
  /* Eyebrows on every band, and the two-tone heading only on the band
     that is the page's thesis, the stickers themselves. */
  how: {
    eyebrow: 'How it works',
    heading: { lead: 'Three stickers to', accent: 'your first pack.' },
    intro:
      'Your book starts with two stickers just for signing up. Earn one more and a sticker pack is in the mail.',
    /* The steps are the stickers: the two required ones drawn as
       themselves in the book's frame, and a third slot left empty, since
       it is whichever card below you pick (`art: null`, the `mark` in
       its place). */
    steps: [
      {
        art: 'signin',
        tag: 'Sticker 1',
        title: 'Sign in with MyMLH',
        copy: 'Free, and it takes a minute.',
      },
      {
        art: 'address',
        tag: 'Sticker 2',
        title: 'Add a postal address',
        copy: 'In your MyMLH account. It’s where the pack gets sent.',
      },
      {
        art: null,
        mark: 'Any one',
        tag: 'Sticker 3',
        title: 'Complete any challenge below',
        copy: 'A livestream, a DEV Challenge, a Fest. Whichever you like.',
      },
    ],
    signIn: 'Sign in to start your sticker book',
    /* The retry beside list.unknown, when the signed-in fetch did not
       land. One word for the one failure surface this page has. */
    error: {
      cta: 'Try again',
    },
  },
  list: {
    eyebrow: 'The stickers',
    heading: { lead: 'Every', accent: 'sticker.' },
    /* Under an earned card: the same word and date /my's book uses. */
    done: 'Earned',
    doneOn: (date) => `Earned ${date}`,
    /* How a completion was earned, in words. The keys are the API's source
       vocabulary; the values never repeat it. */
    source: {
      event_checkins: 'from your check-ins',
      import: 'from the Global Hack Week roster',
      api: 'from DevRelay',
      manual: 'confirmed by the Hacktoberfest team',
      /* FestNet's completion webhook: a fact a service (Customer.io, for
         Global Hack Week) sent about the participant. */
      webhook: 'from MLH’s records',
      /* The two required stickers in the book on /my. */
      mlh: 'from your MyMLH account',
    },
    /* Shown above the rows when the signed-in fetch failed: the rows
       still render, undone, and without this line that reads as "you
       haven’t done any of these" rather than "we don’t know yet". The
       retry button beside it reuses how.error.cta — same word, same
       action, one failure surface on this page rather than two. */
    unknown:
      'We couldn’t load which of these you’ve done, so nothing here is marked done yet.',
    /* The chips above the cards. `types` is keyed by the catalogue's type;
       TYPE_ORDER in lib/activityFilters.mjs fixes the order, this fixes
       the words. A type with no activities never shows. */
    types: {
      dev: 'DEV Challenges',
      livestreams: 'Livestreams',
      ghw: 'Global Hack Week',
      tools: 'Tools',
      inperson: 'Fests',
      /* The sticker book's Required page on /my (lib/stickerBook.mjs): the
         two stickers everyone earns. Not in TYPE_ORDER, so /activities/
         never offers it as a chip. */
      required: 'Required',
    },
    filters: {
      label: 'Filter by type',
      all: 'All',
      todo: 'Still to do',
      chip: (label, count) => `${label} · ${count}`,
      empty: 'Nothing left in this set. Every sticker here is yours.',
    },
    /* The tab hung under a peeled sticker: the sticker is earned. */
    earned: 'Earned',
    /* Under an activity that can only be detected through a linked DEV
       account, on /my, until the account is linked. */
    devHint:
      'We can only detect this once your DEV account is linked to MyMLH.',
  },
};
