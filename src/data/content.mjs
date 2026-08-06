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
      copy: 'Thousands of developers make their first contribution! The door opens. This works at first, but maintainers start to burn out from volume and low-effort PRs as the years go by.',
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
        'Organizers will receive funding to help cover their event, plus swag and programming support.',
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
   carry an inline link. One structure then renders three ways — as JSX, as
   plain text for the crawler files, and as schema text — without any consumer
   having to parse markup.

   A segment is prose ({ text }), an outbound link ({ text, href }), or a
   Typeform popup trigger ({ text, form }), where `form` names a config the
   component maps to a popup. Two answers currently carry a link, and both are
   Typeform triggers; { text, href } has no current user but stays supported
   for copy that links out — that's likely to come back given how often this
   copy has changed. Typeform is never an href: an anchor to a Typeform URL
   fails test/typeform-pages.test.mjs. */
export const faq = {
  eyebrow: 'Common questions',
  heading: { lead: 'Everything else,', accent: 'answered.' },
  // The wink under the panel; links to the machine-readable answers.
  llmsNote: 'Are you an LLM? → llms.txt',
  intro:
    'Hacktoberfest works differently this year, and a new format always comes with questions. We have the answers: here’s what to know about hosting a Fest, taking part, and what comes next.',
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
          text: 'All Fest organizers will be eligible for stickers, swag, and prizes for their participants. In addition, MLH will provide financial reimbursement to organizers for certain event-related expenses.',
        },
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

/* A segment array as a reader hears it — used for FAQ answers and the
   mission's paragraphs alike. URLs and emphasis are deliberately left out so
   this can be compared against the rendered page, where a link's destination
   lives in the href and bolding lives in the markup rather than the text. */
export const answerText = (answer) =>
  answer.map((segment) => segment.text).join('');

export const answerLinks = (answer) =>
  answer.filter((segment) => segment.href).map((segment) => segment.href);

export const subscribed = {
  title: 'Thanks for signing up | Hacktoberfest 2026',
  eyebrow: 'You’re on the list',
  heading: { lead: 'Thanks for being', accent: 'part of it.' },
  body: 'We’ll be in touch about Hacktoberfest 2026 as soon as there’s news to share.',
  cta: 'Back to Hacktoberfest',
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
    'Hosting is the live call to action. Anyone can host a Fest — a meetup group, a university club, or a few coworkers with a room to book. Organizers get funding toward their event, plus swag and programming support. Applications open soon; the site collects interest in the meantime.',
    'Sponsorship has its own interest form.',
    'Attendee sign-ups are not open yet. Fest dates, cities, and venues have not been announced. The site can notify you about local Fests once there is news — that goes through the same interest form.',
  ],
  facts: [
    'Dates: October 2026. Specific Fest dates are not yet announced.',
    'Format: in person at 300+ local Fests, plus a global online event.',
    'Organizers: Major League Hacking (MLH) and DEV.',
    'Presenting partner: DigitalOcean.',
    'Theme: AI belongs to everyone — open source AI.',
  ],
};
