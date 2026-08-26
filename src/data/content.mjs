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

export const hero = {
  /* Two lines so phones can break between the clauses rather than mid-phrase;
     they share one line, separator restored, from tablet up. */
  eyebrow: ['October 2026 · 300+ events', 'In person and online'],
  heading: { lead: 'Hacktoberfest 2026:', accent: 'AI belongs to everyone.' },
  deck: 'Bring Hacktoberfest to your city. Host a one-day fest to give your community the tools and knowledge to experiment and build with open source AI. Snacks and swag, on us.',
  cta: 'Host a Fest in your city',
  secondaryCta: 'Notify me about local Fests',
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
            '1. **Hacktoberfest Hack Day:** Structured mini hackathons where participants build open-source AI projects during the event. Features official swag, prize categories, DEV Badges, potential partner prizes, and food/beverage reimbursement for organizers.\n2. **Hacktoberfest Meet Up:** Flexible, informal community gatherings (talks, workshops, panels, or social discussions) centered around open-source AI. Receives official swag (stickers, T-shirts, postcards) but no prizes or food/beverage reimbursement.',
        },
      ],
    },
    {
      id: 'will-everyone-get-a-tshirt',
      section: 'fests',
      question: 'Will everyone get a T-Shirt?',
      answer: [
        {
          text: 'While we are committed to sending thousands of T-shirts to in-person events, we cannot guarantee a T-shirt to every Hacktoberfest participant. The T-shirts we send to each event are distributed by local organizers to participants as on-site availability allows and at their discretion. We unfortunately cannot promise to mail T-shirts to in-person participants who did not receive one at their events due to logistical constraints. Online Hacktoberfest participants will not be eligible for a T-shirt.',
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
        { text: 'Organizers can apply via the ' },
        {
          // Source gave this as http://; the site never links out over
          // plain http, so the scheme is corrected to https.
          text: 'host portal',
          href: 'https://organize.mlh.com/host/hacktoberfest-2026',
        },
        { text: '. Visit our ' },
        {
          text: 'organizer guide',
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
  eyebrow: 'Host a Fest',
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
        alt: 'Three attendees huddled around a laptop, deep in a build',
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
        alt: 'An attendee flashing a peace sign while catching up with friends',
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
    eyebrow: 'Confirmed sponsors',
    heading: {
      lead: 'Already backed by teams',
      accent: 'building what’s next.',
    },
    intro:
      'Join the organizations putting open source AI into builders’ hands at 300+ Fests.',
    /* The grid's dashed empty seat and the band that closes the wall:
       the section ends on the invitation, not on a logo. */
    ghost: 'Your logo here',
    band: {
      title: 'Build what’s next alongside them.',
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
    'Attendee sign-ups are not open yet. Fest dates, cities, and venues have not been announced. The site can notify you about local Fests once there is news, and that goes through the same interest form.',
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
      body: 'Anyone can host a Fest this October — a funded Hack Day or a lighter Meet Up with swag. Applications are confirmed on a rolling basis, usually within a week.',
      cta: 'Apply to host a Fest',
    },
    ghostMore: {
      title: 'Host another Fest.',
      body: 'Want to run both a Hack Day and a Meet Up? Want to run Fests in multiple cities? The sky’s the limit.',
      cta: 'Start another application',
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
      body: (name) =>
        `You applied, you were approved, you published. Three quick confirmations and ${name} heads to hacktoberfest.com.`,
      cta: 'Let’s go',
    },
    title: 'Final acknowledgements',
    intro: (name) => `Confirm these to put ${name} on hacktoberfest.com.`,
    /* The landing after the last Confirm: the one moment the flow gets to
       celebrate, so it closes with a full stop instead of vanishing. */
    success: {
      title: 'All set.',
      body: (name) =>
        `That's everything. The final checks run automatically, and ${name} appears on hacktoberfest.com once they pass.`,
      done: 'Done',
    },
    /* All three statements are real, reviewed copy. The venue slide
       (index 1) also renders the address line and the map pin the
       statement asks the host to check. */
    statements: [
      'I acknowledge that I will follow all Major League Hacking guidelines for my event, including keeping it in person and keeping spending within the policy-approved limits and categories. If my plans need to deviate from these guidelines, I will check with MLH first at hacktoberfest@mlh.io. I understand that unapproved deviations may put my reimbursement eligibility and my ability to work with MLH on future events at risk.',
      'I have double checked that the address and map pin above match my venue.',
      'I understand that I must email hacktoberfest@mlh.io before changing key details of my Fest, including its name, dates, and times, and that I must wait for Major League Hacking to approve a change before making it. If I change these details without checking in first, my Fest will automatically be hidden from hacktoberfest.com.',
    ],
    /* The venue slide's guidance: what the map is, and what to do when it
       is wrong. Split around the address so the email renders as a mailto
       link. */
    venueCheck: {
      intro:
        'This is the venue hacktoberfest.com will show for your Fest, exactly as it will appear on the map.',
      wrongLead: 'If the address or the pin is wrong, stop here and email ',
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
  /* Trimmed to what ApplicationsBand still borrows from the (deleted)
     fests band: the application badge/CTA ladder and the fallback link
     label. Everything else the fests band owned (heading, lede, status
     and role badges, the find/host ghosts) left with it. */
  fests: {
    applicationBadges: {
      draft: 'Application started',
      submitted: 'Application submitted',
      approved: 'Application approved',
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
    },
    applicationCtas: {
      draft: 'Finish your application',
      submitted: 'View application',
      approved: 'Manage event',
      rejected: 'Revise your application',
    },
    viewFestCta: 'View Fest',
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
