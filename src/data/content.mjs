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

/* "Plymouth, Leeds and York", or "Plymouth, Leeds, York and more" when
   there are places the list leaves out. Only ever given the handful of
   cities lib/todayStrip.mjs keeps per day. */
const placeList = (cities, more) => {
  const names = Array.isArray(cities) ? cities.filter(Boolean) : [];
  if (names.length === 0) return '';
  if (more) return `${names.join(', ')} and more`;
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
};

const festCount = (count) => `${count} ${count === 1 ? 'Fest' : 'Fests'}`;

const inPlaces = (cities, more) => {
  const places = placeList(cities, more);
  return places ? `, in ${places}` : '';
};

/* The Today strip under the nav, on every page in October
   (components/TodayStrip). One line of what is happening today, rotating:
   a livestream, the DEV Challenge round, Global Hack Week, the day's
   Fests, and the sticker book, which is always there to fall back on.

   Which item appears, and with which of these lines, is decided by
   lib/todayStrip.mjs; this is only the words. Anything with a count, a
   name or a date in it is a function, the way activitiesPage.strip.count
   is. */
export const todayStrip = {
  /* The region's name, for the screen reader's landmark list. */
  label: 'Today at Hacktoberfest',
  /* The fixed left end, "Today · Tue 6 Oct". "Today" alone is what the
     server renders: the date is the reader's own, and only the browser
     knows it. The separator is its own string so the narrowest phones
     can drop "Today · " and keep the date, which is the part that
     changes. */
  today: 'Today',
  dateSeparator: ' · ',
  dayOf: (day, total) => `Day ${day} of ${total}`,
  pause: 'Pause updates',
  resume: 'Resume updates',
  next: 'Next update',
  livestream: {
    onAir: 'On air now',
    laterToday: 'Livestream today',
    upcoming: 'Next livestream',
    /* Later today carries the zone because it is a time to show up at;
       "5:00 PM" alone is nobody's time in particular. */
    today: (clock, zone, name) =>
      `${zone ? `${clock} ${zone}` : clock} · ${name}`,
    next: (day, clock, name) => `${day}, ${clock} · ${name}`,
    watch: 'Watch now',
    schedule: 'See the schedule',
  },
  challenge: {
    kicker: 'DEV Challenge',
    /* `when` is one of the phrases below: an hour count in the last
       day of a timed round, then today, tomorrow, a weekday within the
       week, or a date. */
    closes: (name, when) => `${name}: submissions close ${when}`,
    opens: (name, day) => `${name}: opens ${day}`,
    withinHour: 'within the hour',
    inHours: (hours) => `in ${hours} ${hours === 1 ? 'hour' : 'hours'}`,
    today: 'today',
    tomorrow: 'tomorrow',
    enter: 'Enter on DEV',
    activities: 'See the activities',
  },
  feature: {
    current: 'On now',
    upcoming: 'Coming up',
    until: (name, day) => `${name}, until ${day}`,
    starts: (name, day) => `${name} starts ${day}`,
    cta: 'See sessions',
  },
  fests: {
    kicker: 'In person',
    today: (count, cities, more) =>
      `${festCount(count)} today${inPlaces(cities, more)}`,
    on: (count, day, cities, more) =>
      `${festCount(count)} on ${day}${inPlaces(cities, more)}`,
    cta: 'Find a Fest',
  },
  /* The evergreen item, and the one the server renders: true on every
     day of the month, and the reason the rest of the strip matters. */
  stickerBook: {
    kicker: 'Sticker book',
    text: 'Collect three stickers and we’ll mail you a real sticker pack.',
    cta: 'Open your sticker book',
  },
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

/* The /mission/ page: the story so far and the mission, which used to
   sit on the homepage between the hero and the sponsor wall. The nav
   reaches it under About, beside the FAQs. The page renders `timeline`
   and `mission` below as they are; this is only its hero and metadata. */
export const missionPage = {
  title: 'Mission | Hacktoberfest 2026',
  description:
    'How Hacktoberfest grew from four pull requests to 300+ events, and why Hacktoberfest 2026 is about building with open source AI.',
  eyebrow: 'About Hacktoberfest',
  heading: { lead: 'Hacktoberfest’s', accent: 'mission.' },
  intro:
    'Hacktoberfest has run every October since 2014. Here is how it grew, and why this year is about building with open source AI.',
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
   carry an inline link, a list, or a second paragraph. One structure then
   renders three ways — as JSX, as plain text for the crawler files, and as
   schema text — without any consumer having to parse markup.

   A segment is prose ({ text }), a link ({ text, href }), a Typeform popup
   trigger ({ text, form }), where `form` names a config the component maps
   to a popup, or a bounded markdown subset ({ markdown }). An href that
   starts with `/` stays in the tab; anything else opens a new one.
   { markdown } exists for answers the flat segment list can't express, like
   how-to-take-part's paragraph, two-item list, and closing line, and
   supports exactly: **bold**, [label](href), blank lines between blocks,
   and blocks whose every line opens `1. ` (an ordered list) or `- ` (a
   bulleted list). parseAnswerMarkdown below turns that subset into
   render-ready blocks; answerText and answerLinks both understand it too, so
   a markdown segment never has to be special-cased by a consumer. Typeform
   is never an href: an anchor to a Typeform URL fails
   test/typeform-pages.test.mjs.

   The set is the participant FAQ (2026-09-26), merged with the
   pull-request questions the host-era FAQ carried: the PR answer itself
   comes from the participant FAQ, and how-2026-differs and
   get-involved-in-open-source join it in their own section.
   sticker-pack-arrival, the shipping window, came back from the old set.

   `items` stays a flat array — src/build/llms.mjs reads faq.items directly,
   and grouping for the /questions page is expressed via each item's `section`
   field instead of nesting, so adding a section never means teaching the
   crawler files or the tests a new shape. `sections` records the headings in
   display order; `homepage` names the four items (chosen for breadth, since
   the homepage serves first-time visitors) that still appear in the homepage
   callout, plus the CTA to the full page. online.faq and inPerson.faq name
   their own slices by id the same way. `page` carries the copy the
   standalone /questions page's Head and PageHero need, the same way host.*
   does for /host. */
const DEV_CHALLENGES_URL = 'https://dev.to/challenges';

export const faq = {
  eyebrow: 'Common questions',
  heading: { lead: 'Everything else,', accent: 'answered.' },
  // The wink under the panel; links to the machine-readable answers.
  llmsNote: 'Are you an LLM? → llms.txt',
  intro:
    'Hacktoberfest works differently this year, and a new format always comes with questions. We have the answers: here’s how to take part, in-person or online, and what you can earn along the way.',
  sections: [
    { id: 'getting-started', title: 'Getting started' },
    { id: 'pull-requests', title: 'Pull requests and open source' },
    { id: 'in-person', title: 'In-person events' },
    { id: 'dev-challenges', title: 'Online DEV Challenges' },
    { id: 'rewards-support', title: 'Rewards and support' },
  ],
  items: [
    // -- Getting started ---------------------------------------------------
    {
      id: 'what-is-hacktoberfest',
      section: 'getting-started',
      question: 'What is Hacktoberfest 2026?',
      answer: [
        {
          text: 'Hacktoberfest is a month-long celebration of open source throughout October. In 2026, the focus is on learning and building with open-source AI and open-weight models, both through in-person and online activities. ',
        },
        { text: 'MLH', href: 'https://www.mlh.com/' },
        { text: ' and ' },
        { text: 'DEV', href: 'https://dev.to' },
        {
          text: ' are managing the event this year in partnership with our friends at ',
        },
        { text: 'DigitalOcean', href: 'https://www.digitalocean.com/' },
        { text: '.' },
      ],
    },
    {
      id: 'how-to-earn-swag',
      section: 'getting-started',
      question: 'How do I earn swag?',
      answer: [
        {
          text: 'Fests will have T-shirts and other swag available in limited quantities. Contact your local host to learn more about what is available at their Fest and how to receive the swag. If your Fest ran out of stickers, don’t worry! We will be sending a sticker pack directly to your door as a thank you for participating.',
        },
      ],
    },
    {
      id: 'how-to-take-part',
      section: 'getting-started',
      question: 'How do I take part?',
      answer: [
        {
          markdown: `Sign in to [My Hacktoberfest](/my/) with your MyMLH account. The participant dashboard will open by October 1 and show the activities and requirements needed to earn your sticker pack. Connecting your DEV account is optional but recommended, since it will award you a special DEV badge and allow you to earn credit for participating in DEV Challenges.

- **In person:** [Find a Fest](/fests/) and register on its event page. Each Fest has a separate registration.
- **Online:** Join [DEV Challenges](${DEV_CHALLENGES_URL}), MLH livestreams, or Global Hack Week: Hacktoberfest to connect with our community and complete digital challenges.

Anyone is welcome to participate online, in person, or both.`,
        },
      ],
    },
    {
      id: 'who-is-eligible',
      section: 'getting-started',
      question: 'Who can take part?',
      answer: [
        {
          text: 'Hacktoberfest welcomes participants aged 13 or older, subject to country eligibility rules. Individual Fests may have their own audience and age restrictions, so check the event page before registering. If you are under 18, ask the host about any parental permission requirements. ',
        },
        { text: 'DEV Challenges', href: DEV_CHALLENGES_URL },
        { text: ' have separate contest eligibility rules.' },
      ],
    },
    {
      id: 'is-it-free',
      section: 'getting-started',
      question: 'Is it free to attend a Fest?',
      answer: [
        {
          text: 'Almost all Fests, including Hack Days and Meetups, are free to attend! Certain pop-ups take place at ticketed conferences.',
        },
      ],
    },
    // -- Pull requests and open source ---------------------------------------
    {
      id: 'still-submit-pull-requests',
      section: 'pull-requests',
      question: 'Do I still submit pull requests to earn swag?',
      answer: [
        {
          text: 'Pull requests and merge requests will no longer count toward Hacktoberfest rewards. It’s easier than ever to submit low-effort spam PRs to projects, so we’re listening to maintainer feedback and no longer actively incentivizing PRs. That being said, we certainly still encourage you to work on open source and share your work with the world during Hacktoberfest. Our new format focuses on learning and building together while reducing the burden of low-effort contributions on maintainers.',
        },
      ],
    },
    {
      id: 'how-2026-differs',
      section: 'pull-requests',
      question: 'How is Hacktoberfest 2026 different from previous years?',
      answer: [
        {
          text: 'Hacktoberfest 2026 will feature 300+ in-person and online community events worldwide focused on hands-on building, experimentation, and learning with open-source AI and open-weight models. In previous years, Hacktoberfest focused on counting individual contributions to open-source projects.',
        },
      ],
    },
    {
      id: 'get-involved-in-open-source',
      section: 'pull-requests',
      question: 'How can I still get involved in open source?',
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
    // -- In-person events ----------------------------------------------------
    {
      id: 'what-is-a-fest',
      section: 'in-person',
      question: 'What happens at a Fest?',
      answer: [
        {
          text: 'A Fest is a locally organized, one-day, in-person event. Hack Days are mini-hackathons where you build and demo a project, while Meetups will vary in their format and could feature talks, workshops, discussions, or other social activities.',
        },
      ],
    },
    {
      id: 'beginners-welcome',
      section: 'in-person',
      question: 'Are beginners welcome?',
      answer: [
        {
          text: 'Beginners are welcome to learn, and you don’t need to build an AI project to attend a Meetup or watch a livestream.',
        },
      ],
    },
    {
      id: 'what-to-bring',
      section: 'in-person',
      question: 'What should I bring to a Fest?',
      answer: [
        {
          text: 'If you are building, bring a laptop and charger. If not, just bring yourself!',
        },
      ],
    },
    {
      id: 'event-details',
      section: 'in-person',
      question: 'Where can I find event details or ask about accommodations?',
      answer: [
        {
          text: 'Check your Fest’s page for the schedule, venue, food, accessibility, check-in instructions, and anything to install or bring. Contact the host about equipment, accommodations, late arrival, or registration changes.',
        },
      ],
    },
    {
      id: 'hack-day-teams',
      section: 'in-person',
      question: 'Can I enter a Hack Day alone or with a team?',
      answer: [
        {
          text: 'You can enter alone or in a team of any size. Events have enough prizes for up to four team members, so larger teams must share their prizes.',
        },
      ],
    },
    {
      id: 'hack-day-project-rules',
      section: 'in-person',
      question: 'What are the Hack Day project rules?',
      answer: [
        {
          text: 'Project details are largely up to the Fest host. Check the event’s requirements before you build, since prize categories may have additional rules or requirements.',
        },
      ],
    },
    {
      id: 'team-registration',
      section: 'in-person',
      question: 'Does every member of my team have to register and check in?',
      answer: [{ text: 'Yes. All team members must register and check in.' }],
    },
    {
      id: 'submit-hack-day-project',
      section: 'in-person',
      question: 'How do I submit a Hack Day project?',
      answer: [
        {
          text: 'One teammate opens Challenges on the Fest’s event page, selects Add Submission, enters the project details, selects the challenges being entered, and submits before the host’s deadline.',
        },
      ],
    },
    {
      id: 'project-deadline',
      section: 'in-person',
      question: 'When do I need to complete and submit my project?',
      answer: [
        {
          text: 'Projects must be completed and submitted on the day of the Hack Day, before the deadline provided by the host.',
        },
      ],
    },
    {
      id: 'hack-day-judging',
      section: 'in-person',
      question: 'How are Hack Day winners chosen?',
      answer: [
        {
          text: 'The host chooses winners based on the event’s challenge rules and project demos. Ask your local host about judging criteria.',
        },
      ],
    },
    // -- Online DEV Challenges -----------------------------------------------
    {
      id: 'how-dev-challenges-work',
      section: 'dev-challenges',
      question: 'How do DEV Challenges work?',
      answer: [
        {
          text: 'There is a Weekend Challenge and four weekly open-source AI rounds, with cash prizes. You need a DEV account to enter. You can sign up for the ',
        },
        { text: 'Hacktoberfest DEV Challenges', href: DEV_CHALLENGES_URL },
        { text: ' today.' },
      ],
    },
    {
      id: 'dev-challenge-rules',
      section: 'dev-challenges',
      question: 'Where can I find DEV Challenge rules and deadlines?',
      answer: [
        { text: 'Hacktoberfest’s ' },
        { text: 'DEV Challenges', href: DEV_CHALLENGES_URL },
        { text: ' follow DEV’s standard ' },
        {
          text: 'Official Challenges and Hackathon Rules',
          href: 'https://dev.to/page/official-hackathon-rules',
        },
        {
          text: ', plus the instructions on each challenge page. Check those pages for age and country eligibility, entry requirements, deadlines, teams, judging, and prizes.',
        },
      ],
    },
    // -- Rewards and support -------------------------------------------------
    {
      id: 'certificate',
      section: 'rewards-support',
      question: 'Will I receive a participation certificate?',
      answer: [
        {
          text: 'All in-person participants receive an official participation certificate. Hosts may also issue their own. Access them in ',
        },
        { text: 'My Hacktoberfest', href: '/my/' },
        { text: '.' },
      ],
    },
    {
      id: 'dev-badge',
      section: 'rewards-support',
      question: 'Can I earn a DEV badge?',
      answer: [
        {
          text: 'There are many ways to receive a DEV badge, including hosting a Fest, attending a Fest, becoming a Hacktoberfest Completionist, and completing or winning a Hacktoberfest DEV Challenge. You’ll need to connect your DEV account to your ',
        },
        { text: 'My Hacktoberfest', href: '/my/' },
        { text: ' profile to receive the badges.' },
      ],
    },
    {
      id: 'hack-day-prizes',
      section: 'rewards-support',
      question: 'What prizes can I win at a Hack Day?',
      answer: [
        {
          text: 'The most common prize for a Hack Day will be a special swag bag filled with MLH+DEV merch that is awarded on site at your Fest to the winning team(s). In the event that your Fest is missing a prize due to shipping delays, we will send a prize of equivalent or greater value directly to you within 60 days of your Fest ending.',
        },
      ],
    },
    {
      id: 'tshirts-and-swag',
      section: 'rewards-support',
      question: 'Can I get a T-shirt or event swag?',
      answer: [
        {
          text: 'T-shirts and event swag are available in person while supplies last. They are not guaranteed, and the host of your local Fest will decide how to distribute them. T-shirts are not promised to online participants.',
        },
      ],
    },
    {
      id: 'who-can-earn-sticker-pack',
      section: 'rewards-support',
      question: 'Who can earn a sticker pack?',
      answer: [
        {
          text: 'All participants can earn a sticker pack, whether participating online or in person, through the activities on their participant page.',
        },
      ],
    },
    {
      id: 'how-to-earn-sticker-pack',
      section: 'rewards-support',
      question: 'How do I earn a sticker pack?',
      answer: [
        { text: 'Sign in to ' },
        { text: 'My Hacktoberfest', href: '/my/' },
        {
          text: ' and complete the activities required on your participant page. We will release the full list there, and the portal will tell you what you need to do. There is no fixed cap on sticker packs, but signing in alone does not qualify you.',
        },
      ],
    },
    {
      id: 'sticker-pack-activities',
      section: 'rewards-support',
      question: 'Which activities count toward a sticker pack?',
      answer: [
        { text: 'Every activity that counts is on the ' },
        { text: 'Activities page', href: '/activities/' },
        { text: ', with the sticker each one earns.' },
      ],
    },
    {
      id: 'sticker-pack-arrival',
      section: 'rewards-support',
      question: 'When will my sticker pack arrive?',
      answer: [
        {
          text: 'Sticker packs will begin shipping after Hacktoberfest concludes and should arrive at most destinations within 30 to 60 days.',
        },
      ],
    },
    {
      id: 'activity-before-milestones',
      section: 'rewards-support',
      question:
        'Does activity completed before the milestones are announced count?',
      answer: [
        {
          text: 'Yes. Eligible Hacktoberfest activity completed before the milestones are announced also counts.',
        },
      ],
    },
    {
      id: 'fest-help',
      section: 'rewards-support',
      question: 'Who can help with questions about my Fest?',
      answer: [
        {
          text: 'Use Contact Host on the Fest’s event page for questions about logistics, project rules, accessibility, or registration.',
        },
      ],
    },
    {
      id: 'dev-challenge-help',
      section: 'rewards-support',
      question: 'Where can I get help with a DEV Challenge?',
      answer: [
        { text: 'For ' },
        { text: 'DEV Challenges', href: DEV_CHALLENGES_URL },
        { text: ', use the relevant challenge page for rules and questions.' },
      ],
    },
    {
      id: 'general-help',
      section: 'rewards-support',
      question:
        'Who can help with swag, prizes, or general Hacktoberfest questions?',
      answer: [
        { text: 'Email ' },
        { text: 'hacktoberfest@mlh.io', href: 'mailto:hacktoberfest@mlh.io' },
        { text: '.' },
      ],
    },
    {
      id: 'report-a-concern',
      section: 'rewards-support',
      question: 'How do I report harassment or a safety concern?',
      answer: [
        { text: 'Contact ' },
        { text: 'incidents@mlh.io', href: 'mailto:incidents@mlh.io' },
        {
          text: '. You can contact MLH directly if the concern involves a host. In an emergency, contact local emergency services.',
        },
      ],
    },
  ],
  homepage: {
    ids: [
      'what-is-hacktoberfest',
      'still-submit-pull-requests',
      'how-to-take-part',
      'how-to-earn-swag',
    ],
    cta: { label: 'See all FAQs', href: '/questions/' },
  },
  page: {
    title: 'FAQ | Hacktoberfest 2026',
    description:
      'Answers to the most common Hacktoberfest 2026 questions: taking part, pull requests, Fests and Hack Days, DEV Challenges, rewards, and where to get help.',
    eyebrow: 'Common questions',
    heading: { lead: 'Everything you need', accent: 'to know.' },
    intro:
      'Hacktoberfest works differently this year, and a new format always comes with questions. Here is how to take part, in person or online, what changed about pull requests, and what you can earn along the way.',
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
const BULLET_LIST_MARKER = /^-\s+/;
const LIST_MARKER = /^(?:\d+\.|-)\s+/;
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

const markdownToPlainText = (markdown) =>
  markdown
    .split('\n')
    .map((line) => line.trim())
    // Blank lines only separate blocks, so they drop out rather than leave
    // a double space behind.
    .filter(Boolean)
    // Each list line was one item; joined with spaces they read as one
    // paragraph, the same way a reader would say the list aloud.
    .map((line) => line.replace(LIST_MARKER, ''))
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
   can render without a markdown library — FaqList walks this rather than the
   raw string. Handles exactly the subset described above and nothing more;
   anything outside it is passed through as literal text.

   Returns an array of blocks, one per run of lines between blank lines:
     { type: 'orderedList', items: [{ parts }, ...] }  — when every line in
       the block opens with a `1. ` / `2. ` marker
     { type: 'bulletList', items: [{ parts }, ...] }   — when every line
       opens with `- `
     { type: 'paragraph', parts }                       — otherwise, its
       lines joined with a space

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

const listItems = (lines, marker) =>
  lines.map((line) => ({ parts: parseInline(line.replace(marker, '')) }));

export const parseAnswerMarkdown = (markdown) =>
  markdown
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0)
    .map((lines) => {
      if (lines.every((line) => ORDERED_LIST_MARKER.test(line))) {
        return {
          type: 'orderedList',
          items: listItems(lines, ORDERED_LIST_MARKER),
        };
      }
      if (lines.every((line) => BULLET_LIST_MARKER.test(line))) {
        return {
          type: 'bulletList',
          items: listItems(lines, BULLET_LIST_MARKER),
        };
      }
      return { type: 'paragraph', parts: parseInline(lines.join(' ')) };
    });

/* The October homepage's hero (components/FestMapHero): the Fest map,
   and a search that answers as you type. One centred axis: the eyebrow,
   the headline, the search and the way online on top, the map under
   them, and a sign-off rail carrying the campaign line and the partners
   (the research round of 2026-09-28: everything on one axis, the task in
   one group and the identity in another, nothing in the corners). `hero`
   above is the Preptember-era hero this replaces, kept for
   components/Hero while that stays in the tree; the partner labels are
   still read from it, so the two can never name the partners
   differently. The map carries no visible legend; its description for
   screen readers is a function of the counts it plots, which come from
   the Fest directory at runtime. */
export const mapHero = {
  eyebrow: ['October 2026', 'In-person and online · Free'],
  heading: { lead: '300+ Fests.', accent: 'One is near you.' },
  tagline: { lead: 'Hacktoberfest 2026:', accent: 'AI belongs to everyone.' },
  online: {
    prompt: 'Can’t make it in person?',
    /* No closing full stop: the link draws its own arrow after it. */
    cta: 'Join online from anywhere and get swag shipped to your door',
    href: '/online/',
  },
  map: {
    label: (fests, countries) =>
      `A map of the world with a square for every place a Fest is happening: ${fests} Fests in ${countries} countries.`,
    loadingLabel: 'A map of the world, with the Fests still loading onto it.',
    /* Beside a hovered square's city: the square's other Fests. */
    nearby: (n) => `+${n} nearby`,
  },
  /* The search (components/FestSearch): a combobox whose list answers as
     you type (lib/festSearch), in a GET form to /fests/ so Enter works
     before any JavaScript does. Every row the list can show is here. */
  search: {
    label: 'Find a Fest by city, country or name',
    placeholder: 'City, country or Fest name',
    placeholderShort: 'City or country',
    submit: 'Find a Fest',
    submitShort: 'Find',
    close: 'Close search',
    clear: 'Clear search',
    locate: {
      title: 'Use my location',
      hint: 'Find the Fests nearest you',
      finding: 'Finding your location…',
      denied: 'Location is off. Type a city instead.',
    },
    groups: {
      countries: 'Most Fests',
      nearest: 'Nearest to you',
    },
    count: (n) => `${n} ${n === 1 ? 'Fest' : 'Fests'}`,
    distance: (km) => (km < 1 ? 'Under 1 km' : `${Math.round(km)} km`),
    browseAll: (n) => (n ? `Browse all ${n} Fests` : 'Browse all Fests'),
    seeAll: (n, query) => `See all ${n} results for “${query}”`,
    noMatch: (query) => `No Fests match “${query}” yet.`,
    online: {
      title: 'Hacktoberfest is online too',
      hint: 'Join from anywhere, all month',
    },
    host: {
      title: 'Host a Fest in your city',
      hint: 'Bring Hacktoberfest to your community',
    },
    /* Announced politely, a beat after typing stops. */
    status: {
      suggestions: (n) => `${n} suggestions. Use up and down arrows to review.`,
      results: (n) =>
        `${n} ${n === 1 ? 'result' : 'results'}. Use up and down arrows to review.`,
      none: 'No Fests match. Other options are listed.',
    },
  },
};

/* Straight under the map hero, for the visitor who arrived not knowing
   what any of this is, set as the mission page's band (MissionSection):
   three paragraphs, each with its key line in bold, drawn from the FAQ's
   and the mission's own wording, the third for anyone who took part in
   the pull-request years. The story and the reasons live on /mission/.
   Paragraphs are segment arrays like `mission`'s, so the emphasis
   survives into the llms files as plain text (answerText). */
export const homeAbout = {
  eyebrow: 'Introduction',
  heading: { lead: 'What is', accent: 'Hacktoberfest?' },
  paragraphs: [
    [
      {
        text: 'Hacktoberfest is a month-long celebration of open source throughout October.',
        bold: true,
      },
      {
        text: ' This year, it’s all about building with open-weight models and open-source AI.',
      },
    ],
    [
      {
        text: 'It’s free, and it’s for everyone, wherever you are in your open-source AI or software creating journey. ',
      },
      {
        text: 'Join one of 300+ Fests in cities around the world, take part online all month, or both.',
        bold: true,
      },
    ],
    [
      {
        text: 'Taken part before? Pull requests no longer count toward rewards but ',
      },
      {
        text: 'there are more ways than ever for you to earn t-shirts, stickers, and more.',
        bold: true,
      },
    ],
  ],
  actions: [{ label: 'Read our mission', href: '/mission/' }],
};

/* Under the upcoming Fests: the three things anyone can do online, each
   drawn with the sticker it earns, for the reader with no Fest nearby.
   The links follow the activities' own (data/eligibility.mjs): the
   schedule for livestreams and Global Hack Week, DEV for the challenges. */
export const homeOnline = {
  eyebrow: 'Attend online',
  heading: { lead: 'Can’t get to a Fest?', accent: 'Join from anywhere.' },
  intro:
    'Hacktoberfest is online all October with livestreams and challenges. Collect virtual stickers for participating and we’ll ship you swag right to your door.',
  cards: [
    {
      id: 'livestreams',
      sticker: 'home-livestreams',
      title: 'Livestreams',
      copy: 'Sessions on open-weight models, agents and tools. Check in with the code on screen to collect a sticker.',
      cta: 'See the schedule',
      href: '/schedule/',
    },
    {
      id: 'dev',
      sticker: 'home-dev',
      title: 'DEV Challenges',
      copy: 'A new mini-hackathon launches every week in October.',
      cta: 'See the challenges',
      href: DEV_CHALLENGES_URL,
    },
    {
      id: 'ghw',
      sticker: 'home-ghw',
      title: 'Global Hack Week',
      copy: 'A one-week hacker festival filled with livestream sessions and challenges.',
      cta: 'See the sessions',
      href: '/schedule/',
    },
  ],
  cta: { label: 'Attend online', href: '/online/' },
};

/* How it works, for both worlds at once: the sticker book is the one
   thing a Fest and a livestream have in common. */
/* How it works. Each step names the stickers drawn above it, by slug
   (public/stickers): the two required ones; a Fest and the three online
   activities as the homepage badges; the first two milestones, the pack
   and the holographic sticker. */
export const homeSteps = {
  eyebrow: 'How it works',
  heading: { lead: 'Sign in, show up,', accent: 'collect stickers.' },
  phases: [
    {
      label: 'Before',
      steps: [
        {
          title: 'Sign in with MyMLH',
          copy: 'Free, and it takes a minute. Sign in and add your address for your first two stickers.',
          stickers: ['signin', 'address'],
        },
      ],
    },
    {
      label: 'In October',
      steps: [
        {
          title: 'Go to a Fest, or join online',
          copy: 'Register on a Fest’s page, or check the schedule for livestreams and challenges.',
          stickers: ['fest', 'home-livestreams', 'home-dev', 'home-ghw'],
        },
        {
          title: 'Get a swag pack in the mail',
          copy: 'Collect three virtual stickers and we mail you a real sticker pack. Keep going for more and unlock even more swag.',
          stickers: ['milestone-pack', 'milestone-complete'],
        },
      ],
    },
  ],
  cta: { label: 'Start your sticker book', href: '/login/' },
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
     lib/festFormat.mjs. A Fest name that follows neither convention gets no
     badge. The third and fourth entries are not read from a name at all:
     the API says which events are MLH Member Events and which are Pop-Ups. */
  /* The partner a Fest is run with, split out of the event name (MLH welds
     the two together). A label rather than a sentence: the host's own name
     follows it, and "Hosted by Hack the 6ix" should read as one line on the
     card, not a claim the site is making. */
  hostedBy: 'Hosted by',
  formatBadges: {
    hackDay: 'Hack Day',
    meetUp: 'Meetup',
    mlhMemberEvent: 'MLH Member Event',
    popup: 'Pop-Up',
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
    mlhMemberEvent:
      'Each year, Major League Hacking partners with hundreds of student hackathons around the world. This year, for the first time, we’re bringing Hacktoberfest swag and stickers to every one of them taking place in October, while supplies last. There are no Hacktoberfest prize categories at these hackathons, but we still encourage you to build with open-source and open-weight models.',
    popup:
      'A conference or community event Hacktoberfest has partnered with, where there is Hacktoberfest swag and stickers to pick up while supplies last. The event runs its own format and sets its own registration, and Hacktoberfest prize categories aren’t guaranteed.',
  },
  /* A Member Event's button. It opens the hackathon's own website, which
     is where its admission happens, so the verb is visit and the label
     carries the host — "Visit bigredhacks.com" — because that is the one
     fact about a website people repeat. */
  visitCta: 'Visit',
  /* "3 days", after the date range in a Member Event's modal. */
  dayCount: (n) => `${n} day${n === 1 ? '' : 's'}`,
  /* Shown between the chips and the results while the MLH Member Events
     chip is selected, and nowhere else: someone who tapped that chip is
     the one person who needs to know these are not Fests. Facts only —
     admission, swag, prizes — nothing a hackathon has not signed up to. */
  memberEventNotice: {
    title:
      'Hacktoberfest swag and stickers are available at MLH Member Events this October.',
    body: 'Each year, Major League Hacking partners with hundreds of student hackathons around the world. This year, for the first time, we’re bringing Hacktoberfest swag to every one of them taking place in October. A few things to know before you go:',
    points: [
      {
        lead: 'Admission requirements are set by each event.',
        rest: 'Many require an application or approval before you can attend, so check the event’s website before you make plans.',
      },
      {
        lead: 'Swag and stickers',
        rest: 'are available at every event while supplies last.',
      },
      {
        lead: 'There are no Hacktoberfest prize categories at these hackathons,',
        rest: 'but we still encourage you to build with open-source and open-weight models.',
      },
    ],
    /* One outbound link, to MLH's season page. The URL is wiring and lives
       in data/links.js. */
    link: {
      lead: 'Learn more about the 2027 Hackathon Season at',
      label: 'mlh.com',
    },
  },
  /* The tinted block in a Member Event's modal. The one thing a visitor
     must not miss, so it is set apart from the blurb above it. */
  memberEventAdmission: {
    label: 'Admission',
    body: 'Admission requirements are set by each event. Many require an application or approval before you can attend, so check the event’s website before you make plans.',
  },
  /* Shown between the chips and the results while the Pop-Ups chip is
     selected, and nowhere else. No link: a Pop-Up's own website is on its
     card's modal, and there is no season page to point at. */
  popupNotice: {
    title: 'Hacktoberfest is popping up at partner events this October.',
    body: 'These are conferences and community gatherings we’ve partnered with, and each one has Hacktoberfest swag and stickers to pick up. A few things to know before you go:',
    points: [
      {
        lead: 'Registration is set by each event.',
        rest: 'Some are free, some sell tickets, and some need an application. Follow the link and register the way the event asks.',
      },
      {
        lead: 'Swag and stickers',
        rest: 'are available while supplies last. How they reach you is the event’s own arrangement: there may be a Hacktoberfest table, or the hosts may be handing them out themselves, so ask at registration if you cannot see them.',
      },
      {
        lead: 'Every Pop-Up runs its own way.',
        rest: 'The schedule is the event’s own, so what’s happening on the day, and whether Hacktoberfest prize categories are part of it, is down to the host. Check the listing before you go.',
      },
    ],
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
  /* Fests an admin has pinned in FestNet lead the list under `heading`;
     everything else follows under `rest`. With nothing pinned (or nothing
     pinned left after a search) the list is one group with neither label,
     as it always was. */
  featured: {
    heading: 'Featured',
    rest: 'All Fests',
  },
  distanceUnit: 'km away',
  formatFilter: {
    label: 'Filter by format',
    all: 'All',
    hackDay: 'Hack Days',
    meetUp: 'Meetups',
    mlhMemberEvent: 'MLH Member Events',
    popup: 'Pop-Ups',
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
    at: `${MILESTONE_STICKERS.pack} virtual stickers`,
    title: 'Receive an IRL sticker pack',
    copy: 'Sign in, add your address, and collect any other virtual sticker to receive Hacktoberfest 2026 stickers in the mail.',
  },
  {
    id: 'complete',
    art: 'milestone-complete',
    at: `${MILESTONE_STICKERS.complete} virtual stickers`,
    title: 'Unlock a bonus holographic sticker',
    copy: `Earn any ${MILESTONE_STICKERS.complete} virtual stickers and we’ll include a bonus holographic sticker in your mailed sticker pack.`,
  },
  {
    id: 'completionist',
    art: 'milestone-completionist',
    at: `${MILESTONE_STICKERS.completionist} virtual stickers`,
    title: 'Become a Completionist',
    copy: `Collect ${MILESTONE_STICKERS.completionist} stickers and get automatically entered in a raffle to win a Hacktoberfest 2026 t-shirt or an Arduino Uno Q board. Congrats on being a Hacktoberfest Completionist!`,
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
    accent: 'Earn stickers, and get stickers shipped to your door.',
  },
  /* Written for someone who has never heard of Hacktoberfest: what it
     is, when, and that it is free, then the deal in two sentences.
     `introShort` is the phone's version, so the first screen there still
     reaches the buttons. */
  intro:
    'Hacktoberfest is a free, month-long celebration of open source throughout October. This year, it’s all about building with open-weight models and open-source AI. Join from anywhere in the world, collect virtual stickers by completing challenges, and we’ll mail you a sticker pack.',
  introShort:
    'A free, month-long celebration of open source throughout October. Join from anywhere in the world, collect virtual stickers by completing challenges, and we’ll mail you a sticker pack.',
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
    'ghw-points-30',
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
      'This Hacktoberfest, rather than opening pull requests, you’ll be learning about open-source and open-weight AI models. Complete challenges to collect virtual stickers and receive real rewards.',
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
    intro: `There are ${BOOK_SIZE} stickers to collect for this Hacktoberfest. Hover over one to see what unlocks it.`,
    pages: ['required', 'livestreams', 'dev', 'ghw', 'tools', 'misc'],
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
    body: 'Your sticker book has every sticker you’ve collected. Sign in to see it.',
    cta: 'See your sticker book',
    href: '/my/',
    stickers: ['livestreams-1', 'milestone-pack', 'ghw'],
  },
  faq: {
    eyebrow: 'Common questions',
    heading: { lead: 'New here?', accent: 'Start with these.' },
    /* Five at most, and only what the page above doesn't already say:
       the milestones band covers how the pack is earned, the sticker
       book band links to /activities. */
    ids: [
      'what-is-hacktoberfest',
      'still-submit-pull-requests',
      'who-is-eligible',
      'how-dev-challenges-work',
      'sticker-pack-arrival',
    ],
    cta: { label: 'See all FAQs', href: '/questions/' },
  },
};

export const inPerson = {
  title: 'Attend In Person | Hacktoberfest 2026',
  description:
    'Hacktoberfest is back with 300+ in-person and online events all about open-source AI. Find a Fest near you, connect with your community, and take home swag while supplies last.',
  eyebrow: 'Attend in-person · October 2026 · Free',
  heading: {
    lead: 'Hacktoberfest is back.',
    accent: 'And it’s coming to a city near you.',
  },
  /* Written for someone who has never heard of a Fest: what it is, that
     it is free, then the two things a room gives: the people, and the
     swag. Nothing here promises a specific item; swag, stickers,
     T-shirts and Arduinos are available while supplies last, every time
     the page says so. The online sticker book is a bonus, introduced once
     on the Virtual rewards card, never the headline. The phone gets the
     same line. */
  intro:
    'A Fest is a free, one-day, in-person Hacktoberfest event all about open-source AI. Come meet your community, learn and explore, and take home swag while supplies last.',
  introShort:
    'A Fest is a free, one-day, in-person Hacktoberfest event all about open-source AI. Come meet your community, learn and explore, and take home swag while supplies last.',
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
    intro: 'Pick the Fest format that suits you best.',
    cards: [
      {
        id: 'hack-day',
        tag: 'Hack Day',
        title: 'A mini hackathon.',
        lines: [
          'Build with open-weight models and/or open-source AI tools and demo at the end.',
          'Prizes for the best projects, and usually food.',
          'Bring a laptop and, if you’d like, a team.',
        ],
      },
      {
        id: 'meetup',
        tag: 'Meetup',
        title: 'A community gathering.',
        lines: [
          'Talks, workshops or a panel, and time to meet the people who came.',
          'No project to ship and no team to find.',
          'Bring curiosity, and a laptop if recommended by your host.',
        ],
      },
    ],
  },
  /* What you get on the day, the room's own rewards, before the steps:
     T-shirts, stickers and swag, Arduinos at select Hack Days, prizes at
     a Hack Day, and the virtual rewards (stickers for the online book,
     and a certificate). These are not stickers, so each card carries a
     plain icon, `icon` naming one of the icons in
     components/WorldLanding/dayIcons. Every card that can says "while
     supplies last", so there is no disclaimer under them. `link` is the
     one card with a way onward. */
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
        title: 'T-shirts, Stickers, and Swag',
        copy: 'Hacktoberfest 2026 t-shirts, stickers, and swag, while supplies last.',
      },
      {
        id: 'arduinos',
        icon: 'infinity',
        at: 'Hack Days',
        title: 'Arduinos',
        copy: 'Arduinos are available for attendees at select Hack Days and while supplies last.',
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
        copy: 'Collect stickers towards your Hacktoberfest sticker book and an official participation certificate with your name, the Fest, and date.',
        link: { label: 'Go to My Hacktoberfest', href: '/my/' },
      },
    ],
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
        copy: 'Every Fest has its own page with the date, the venue and a register button. Register with a free MyMLH account.',
      },
      {
        art: 'checkin',
        phase: 'On the day',
        title: 'Learn, build, and connect with your community',
        copy: 'Check in with your host, say hello to a stranger, and let the Fest begin!',
      },
    ],
    cta: 'Find a Fest',
    ctaHref: '/fests/',
  },
  /* The page's proof: the soonest Fests, read live from the directory's
     endpoint (components/NearbyFests). The button counts every Fest the
     directory lists once they have loaded, and goes without a number
     until then. */
  nearby: {
    eyebrow: 'Where to go',
    heading: { lead: 'Upcoming', accent: 'Fests.' },
    intro:
      '300+ Fests are taking place across the world. Here are a few happening soon.',
    cta: (count) =>
      count > 0 ? `See every Fest (${count})` : 'See every Fest',
    loading: 'Loading the next Fests…',
    empty:
      'The first Fests go on the calendar soon. The directory is where they will appear.',
  },
  faq: {
    eyebrow: 'Before you go',
    heading: { lead: 'Questions', accent: 'before you go.' },
    intro: 'The practical ones first. The full list is on the FAQ page.',
    /* Five at most, and only what the page above doesn't already say:
       the formats band covers what a Fest is, the laptop and the team. */
    ids: [
      'is-it-free',
      'event-details',
      'tshirts-and-swag',
      'certificate',
      'fest-help',
    ],
    cta: { label: 'See all FAQs', href: '/questions/' },
  },
  /* Closes the page, the way schedule.festsCallout closes the online one:
     the one place this page points at the other world. */
  onlineCallout: {
    title: 'No Fest near you?',
    body: 'Join our online events and earn stickers from wherever you are. Our sticker pack ships worldwide. Or, bring a Fest to your city: anyone can host one.',
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

/* Copy for /brand, the short brand kit.

   Three things and no more: the palette, the type system, and the logos in
   the three colorways they ship in. Hosts making a poster, sponsors making
   a slide, and anyone writing about the event get what they need without
   opening a PDF. The full kit (guidelines, templates, print files) is
   handed out separately; this page is the part of it people actually come
   back for.

   Palette hexes are the kit's, which are the site's tokens under their own
   names (styles/tokens.js) with one exception: Ink here is the logo ink
   #231F20, the colour every ink logo file is drawn in, rather than the
   site's slightly greener text ink. A designer sampling a logo and a
   designer reading this page should get the same number. */
export const brand = {
  title: 'Brand Kit | Hacktoberfest 2026',
  description:
    'The Hacktoberfest 2026 colors, fonts, and logos, ready to download. Ink, white, and forest green versions of every mark, as SVG.',
  eyebrow: 'Brand kit',
  heading: { lead: 'Make it look like', accent: 'Hacktoberfest.' },
  intro:
    'The colors, type, and logos for anything you make for Hacktoberfest 2026, whether that is a poster for your Fest or a slide for your sponsors. Everything here is free to use for Hacktoberfest events and coverage.',
  colors: {
    eyebrow: 'Colors',
    heading: { lead: 'Forest first,', accent: 'then the accents.' },
    intro:
      'Forest green is the ground everything sits on, with deep forest beneath it. Ink is for text and paper is the light background. The four accents are for emphasis, a little at a time; the hero squares on this site use all four at once, and that is about the limit.',
    copyHint: 'Click a swatch to copy its hex.',
    copied: 'Copied',
    swatches: [
      {
        id: 'forest',
        name: 'Forest',
        hex: '#3D5F58',
        role: 'The primary. Backgrounds, the green logo, anything that has to say Hacktoberfest at a glance.',
        dark: true,
      },
      {
        id: 'forestDeep',
        name: 'Deep forest',
        hex: '#2E4742',
        role: 'The darker green under forest. Page edges, shadows on green, and depth without reaching for ink.',
        dark: true,
      },
      {
        id: 'ink',
        name: 'Ink',
        hex: '#231F20',
        role: 'Text on light grounds, and the black logo files.',
        dark: true,
      },
      {
        id: 'paper',
        name: 'Paper',
        hex: '#F2F2EB',
        role: 'The light ground. Warmer than white, so pure white still reads as a highlight on it.',
        dark: false,
      },
      {
        id: 'sky',
        name: 'Sky',
        hex: '#8BB2DE',
        role: 'The accent that goes on forest: this site’s headings use it for the highlighted half.',
        dark: false,
      },
      {
        id: 'ochre',
        name: 'Ochre',
        hex: '#F5B726',
        role: 'Warm accent. Labels, badges, small blocks of colour.',
        dark: false,
      },
      {
        id: 'pink',
        name: 'Pink',
        hex: '#E97B77',
        role: 'The button colour, and the one to reach for when something needs a nudge.',
        dark: false,
      },
      {
        id: 'orange',
        name: 'Orange',
        hex: '#E53927',
        role: 'The loud one. Use it sparingly and never for body text.',
        dark: true,
      },
      {
        id: 'maroon',
        name: 'Maroon',
        hex: '#671912',
        role: 'The shadow under the buttons, and a colour for outlines. Too dark to fill an area with.',
        dark: true,
      },
    ],
  },
  type: {
    eyebrow: 'Fonts',
    heading: { lead: 'Three families,', accent: 'all free.' },
    intro:
      'Every typeface is a Google Font under the Open Font License, so it can be installed, embedded, and used commercially with no paperwork. Load them from Google Fonts or download the files from the family page.',
    families: [
      {
        id: 'display',
        name: 'Barlow Semi Condensed',
        role: 'Display',
        use: 'Headlines and anything big. Bold and ExtraBold, tight letter spacing, a little below 1.0 line height.',
        weights: 'Bold 700, ExtraBold 800',
        specimen: 'Build in the open.',
        url: 'https://fonts.google.com/specimen/Barlow+Semi+Condensed',
      },
      {
        id: 'body',
        name: 'Inter',
        role: 'Body',
        use: 'Paragraphs and interface copy, anything that has to be read for more than a line. Regular for text, Bold and ExtraBold for emphasis.',
        weights: 'Regular 400, Bold 700, ExtraBold 800',
        specimen:
          'Hacktoberfest is a month of building with open source AI, at 300+ Fests around the world and one global online event.',
        url: 'https://fonts.google.com/specimen/Inter',
      },
      {
        id: 'mono',
        name: 'Martian Mono',
        role: 'Labels',
        use: 'Eyebrows, buttons, dates, numbers, and small uppercase labels with a little letter spacing. The whole variable range, 400 to 800.',
        weights: 'Variable, 400 to 800',
        specimen: 'OCT 1 – OCT 31 · 300+ FESTS',
        url: 'https://fonts.google.com/specimen/Martian+Mono',
      },
    ],
    embed: {
      label: 'One stylesheet loads all three:',
      href: 'https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@700;800&family=Inter:wght@400;700;800&family=Martian+Mono:wght@400..800&display=swap',
    },
  },
  logos: {
    eyebrow: 'Logos',
    heading: { lead: 'Three marks,', accent: 'three colorways.' },
    intro:
      'Every logo comes in ink, white, and forest green. Green is the one to reach for; ink is for print and light grounds, white for photos and dark grounds. All files are SVG, so they scale to any size without losing quality.',
    recommended: 'Recommended',
    download: 'Download SVG',
    /* Each mark's `file` is the stem under /brand/logos/; the colorway
       slug joins it with a hyphen (`hf-mark-forest.svg`). `ratio` is the
       SVG's viewBox aspect, so the tiles can reserve the right height
       before the file arrives. */
    marks: [
      {
        id: 'horizontal',
        name: 'Hacktoberfest 2026',
        file: 'hacktoberfest-2026-horizontal',
        use: 'The main logo. Use it wherever there is width for it: banners, slides, headers, the top of a poster.',
        ratio: 2243 / 215,
      },
      {
        id: 'lockup',
        name: 'HF26 lockup',
        file: 'hf26-lockup',
        use: 'The short form. For square-ish spaces, stickers, and anywhere the full name is already nearby.',
        ratio: 552 / 214,
      },
      {
        id: 'mark',
        name: 'HF mark',
        file: 'hf-mark',
        use: 'The icon. Avatars, favicons, app tiles, and anything under about 40 pixels wide.',
        ratio: 229 / 208,
      },
    ],
    colorways: [
      { id: 'forest', name: 'Forest green', hex: '#3D5F58', ground: 'paper' },
      { id: 'ink', name: 'Ink', hex: '#231F20', ground: 'paper' },
      { id: 'white', name: 'White', hex: '#FFFFFF', ground: 'forest' },
    ],
  },
  /* The partners' own marks, served from this site so the download links
     work, but byte-for-byte the files each partner publishes (MLH at
     static.mlh.io/brand-assets/logo/official/, DEV at the links on
     dev.to/brand) and never recoloured: someone else's logo is theirs to
     define. Each guidelines link is the authority for anything this page
     does not say. */
  partners: {
    eyebrow: 'Partners',
    heading: { lead: 'Powered by', accent: 'MLH and DEV.' },
    intro:
      'Hacktoberfest 2026 is run by MLH with DEV. When their logos sit next to the Hacktoberfest one, on a Fest poster or a sponsor slide, use the official files below exactly as they are and follow each brand\u2019s own guidelines for clear space and placement.',
    /* Per format, because one DEV file is a PNG (see its note). */
    download: { svg: 'Download SVG', png: 'Download PNG' },
    list: [
      {
        id: 'mlh',
        name: 'MLH logo',
        note: 'Color where you can, black or white where you cannot, grayscale for print in one ink.',
        guidelines: {
          label: 'MLH brand guidelines',
          href: 'https://www.mlh.com/brand-guidelines',
        },
        path: '/brand/logos/partners',
        ratio: 343 / 145,
        variants: [
          {
            id: 'color',
            name: 'Color',
            file: 'mlh-logo-color',
            ground: 'paper',
          },
          {
            id: 'black',
            name: 'Black',
            file: 'mlh-logo-black',
            ground: 'paper',
          },
          {
            id: 'grayscale',
            name: 'Grayscale',
            file: 'mlh-logo-grayscale',
            ground: 'paper',
          },
          {
            id: 'white',
            name: 'White',
            file: 'mlh-logo-white',
            ground: 'forest',
          },
        ],
      },
      {
        id: 'dev',
        name: 'DEV logo',
        note: 'Write it DEV or dev.to, never DEV.to or Dev.to. The badge is the square; the rectangular version is only for when space is tight.',
        guidelines: {
          label: 'DEV brand guidelines',
          href: 'https://dev.to/brand',
        },
        path: '/brand/logos/partners',
        ratio: 1,
        variants: [
          {
            id: 'black',
            name: 'Black',
            file: 'dev-logo-black',
            ground: 'paper',
          },
          /* PNG, not SVG: DEV's rainbow SVG is drawn with square corners,
             and the PNG is the one with the badge's rounded ones. */
          {
            id: 'rainbow',
            name: 'Rainbow',
            file: 'dev-logo-rainbow',
            ext: 'png',
            ground: 'paper',
          },
        ],
      },
    ],
  },
  /* The brand guidelines' Limitations pages, in the site's voice and
     for 2026: what the graphics are for, what they are not, and the do
     and don't lists as the deck lays them out. */
  rules: {
    eyebrow: 'Using them',
    heading: { lead: 'What the brand', accent: 'is for.' },
    intro:
      'The Hacktoberfest graphics are for promoting Fests, projects, and posts that are part of Hacktoberfest. They may not go on merchandise or anything for sale, and they do not signal endorsement. Use of the brand is at the Hacktoberfest team\u2019s discretion: if a use is not in the spirit of the event, we may ask you to stop.',
    dos: {
      title: 'Do',
      items: [
        'Use the logos and colours in any digital promotional graphic for your Fest, project, or post.',
        'Use the brand assets as provided here, in the three colorways they come in.',
        'Give a logo clear space on every side of at least the height of the H.',
        'Write the name as Hacktoberfest, one word, capital H. The year is 2026.',
        'Credit the partners where you can: powered by MLH and DEV, presented by DigitalOcean. Tag them when you post.',
        'Open source your designs so others can build on them.',
      ],
    },
    donts: {
      title: 'Don\u2019t',
      items: [
        'Make physical merchandise, such as t-shirts, with the Hacktoberfest design.',
        'Sell anything that carries the Hacktoberfest graphics.',
        'Modify the logos: no stretching, rotating, outlining, recolouring outside the three colorways, or adding effects.',
        'Use the brand to promote events unrelated to Hacktoberfest.',
        'Change the name itself: not Hacktober, not Hacktober Fest.',
        'Use the logo to suggest official endorsement, such as on certificates.',
        'Recolour a partner or sponsor logo to match this palette. Their marks keep their own colours.',
      ],
    },
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
  /* The schedule lock (data/scheduleLock.mjs): the panel under the section
     heading while the calendar waits. No date: the badge says soon, not
     when, since the switch is flipped by hand. */
  locked: {
    title: 'The schedule is coming soon.',
    copy: 'Every livestream, workshop and Global Hack Week session will be listed here, in your own time zone. Check back soon.',
    badge: 'Coming soon',
  },
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
    '300+ in-person Fests plus a global online event, all about building with open-source AI. Join a Fest near you this October.',
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
    /* The Fest's self check-in code, which only its hosts are ever sent.
       Hidden until asked for, because hosts put this page on a projector.
       Available before the day, unlike the count: signs and slides need it
       early. */
    checkInCode: {
      title: 'Check-in code',
      intro:
        'Share this code with your attendees on the day. It is how they check themselves in to your Fest.',
      showCta: 'Show code',
      hideCta: 'Hide code',
      copyCta: 'Copy',
      copiedCta: 'Copied',
      copyFailedCta: 'Select it',
      hiddenLabel: 'Check-in code, hidden',
      codeLabel: (code) => `Check-in code ${code.split('').join(' ')}`,
      stepsLabel: 'How attendees check in',
      steps: {
        visit: 'On their phone or laptop, go to:',
        enter: 'They enter your code',
        done: 'They’re checked into your Fest! They’ll receive virtual stickers and a certificate on My Hacktoberfest.',
      },
      url: 'mlh.com/checkin',
      href: 'https://mlh.com/checkin',
      hint: 'Only you and your co-hosts can see this code. Share it in the room on the day. Anyone who has it can check in at mlh.com/checkin, so keep it out of social posts.',
      /* self_check_in_mode is not code_required in MLH. */
      none: 'Your Fest does not have a check-in code.',
      noneHint:
        'Self check-in is turned off for this Fest in MLH, so there is no code for attendees to enter. You can still check people in yourself from Organizer HQ.',
      noneCta: 'Check people in on Organizer HQ',
    },
    /* The event pack, as a three-step journey. MLH writes one bare tracking
       number per package onto the event and nothing else, so the number is
       the only fact the card has: while there is none, the pack is at the
       fulfillment centre being packed; once there is one, all three steps
       are done and the number is what proves it. No delivery status is ever
       claimed - MLH sends none, and the carrier link is where a host follows
       the rest. */
    pack: {
      title: 'Event pack',
      notShipped: 'Your event pack has not yet shipped.',
      notShippedHint:
        'Your event pack’s tracking number will appear here shortly after it ships.',
      shipped: 'Your event pack is on its way.',
      shippedMany: (count) =>
        `Your event pack is on its way in ${count} packages.`,
      steps: {
        fulfillment: 'Event pack shipped to fulfillment centre',
        packed: 'Packed event pack for delivery',
        shipped: 'Event pack shipped to you',
      },
      stepStatus: {
        done: 'Done',
        active: 'In progress',
        todo: 'Not yet',
      },
      trackingLabel: 'Tracking',
      trackCta: (carrier) => `Track with ${carrier}`,
      lookUpCta: 'Look up this number',
      copyCta: 'Copy',
      copiedCta: 'Copied',
      /* The clipboard said no (an http origin, or a browser without the
         API). The number is still on screen and selectable. */
      copyFailedCta: 'Select and copy',
      /* The hollow chip on a number whose shape we do not know. */
      unknownCarrier: 'Carrier',
      unknownCarrierHint:
        'We could not tell which carrier this is. Paste the number into your carrier’s tracking page.',
      /* The packing list under the journey, from MLH's shipping sheet: only
         the items the sheet marks TRUE are listed. The note is the wording
         of Jacklyn's doc, with "double check your box" for its "double check
         with your box". The address ends the sentence, so the page adds the
         full stop after the link. */
      box: {
        label: 'In your box',
        items: {
          arduino: 'Arduino',
          tshirts: 'T-shirts',
          beltBags: 'Belt bags',
          infoCards: 'Information cards',
          stickers: 'Stickers',
        },
        pending:
          'Your box’s contents will appear here once we have confirmed them.',
        estimateLead: 'This is an estimate for your planning purposes.',
        estimateBody:
          'Please double check your box to verify exact items and quantities before promising inventory to participants. If your box contents differ from this list, please reach out to us at',
        email: 'hacktoberfest@mlh.io',
      },
    },
    forbidden: {
      eyebrow: 'Fest dashboard',
      heading: { lead: 'This Fest', accent: 'is not yours.' },
      body: 'You are not listed as a host of this Fest. If you think you should be, ask the host who applied to add you in Organizer HQ.',
    },
    /* The Fest's SmugMug album. MLH makes one per Fest and gives its hosts
       two links: the gallery, to share, and a private upload link. For a
       Hack Day the photos are part of what reimbursement asks for, which is
       the only format told so. The links are buttons, never printed: hosts
       project this page. */
    photos: {
      title: 'Photo gallery',
      intro: 'Share photos from your Fest with your community and with MLH.',
      hackDayRequired:
        'Uploading photos is required for your Hack Day reimbursement.',
      pending: 'Your photo gallery links will appear here soon.',
      upload: {
        label: 'Upload',
        cta: 'Upload photos',
        hint: 'Only share this link with people taking photos at your Fest.',
      },
      gallery: {
        label: 'Gallery',
        cta: 'View gallery',
        hint: 'Share this with your community once photos are up.',
      },
    },
    /* Useful info: the opening ceremony slides and, for a Hack Day, the
       prizes to award. Which deck and which lines a Fest gets is decided in
       lib/usefulInfo.mjs, from the format and partners the API sends; this
       is only the words and the links, keyed by what it returns.

       Every URL is untagged, like HOST_HANDBOOK_URL in data/links.js: utm
       params on a deck or a docs link are attribution noise, and the decks
       are mlh.link short links MLH counts itself. Written out here, as
       my.dashboard.checkInCode.href is, so the words and their links are
       pinned together by one content test.

       A prize line is a list of pieces: a string is text, { text, href } a
       link out (new tab), and { text, eventPack: true } the jump to the
       Event pack card on the same page, which is where the prizes arrive.
       The prize text is the Pre-event Host Features doc's, word for word,
       except "(see Package info)" (now "(see Event pack)" after the card's
       name) and the challenge name "Best Open-Source AI Project" (the doc
       said "Best Use of OpenSource AI"). */
    usefulInfo: {
      title: 'Useful info',
      slides: {
        label: 'Slides',
        hint: (deckName) => `Opening ceremony slides for your ${deckName}.`,
        cta: 'View slides',
      },
      decks: {
        gemma: {
          name: 'Gemma Hack Day',
          url: 'https://mlh.link/hacktoberfest-2026-gemma-slides',
        },
        github: {
          name: 'GitHub Hack Day',
          url: 'https://mlh.link/hacktoberfest-2026-github-slides',
        },
        snowflake: {
          name: 'Snowflake Hack Day',
          url: 'https://mlh.link/hacktoberfest-2026-snowflake-slides',
        },
        solana: {
          name: 'Solana Hack Day',
          url: 'https://mlh.link/hacktoberfest-2026-solana-slides',
        },
        meetUp: {
          name: 'Meetup',
          url: 'https://mlh.link/hacktoberfest-2026-meetup-slides',
        },
        hackDay: {
          name: 'Hack Day',
          url: 'https://mlh.link/hacktoberfest-2026-hack-day-slides',
        },
      },
      prizesLabel: 'Prizes',
      lines: {
        openSourceAi: [
          'You have a challenge as the ',
          {
            text: 'Best Open-Source AI Project',
            href: 'https://hacktoberfest-handbook.mlh.com/fest-planning-guide/open-source-prize-categories',
          },
          ' event. Award 4 Belt Bags to the winning team (see ',
          { text: 'Event pack', eventPack: true },
          ').',
        ],
        gemma: [
          {
            text: 'Your event is a Gemma event.',
            href: 'https://hacktoberfest-handbook.mlh.com/hack-days-partner-modules/partner-challenge-google-gemma',
          },
          ' Award 4 Belt Bags to the winning team (see ',
          { text: 'Event pack', eventPack: true },
          ').',
        ],
        snowflake: [
          {
            text: 'Your event is a Snowflake event.',
            href: 'https://hacktoberfest-handbook.mlh.com/hack-days-partner-modules/partner-challenge-snowflake-coco',
          },
          ' Award your Arduino Tiny Machine Learning Kits to the winning team.',
        ],
        github: [
          {
            text: 'Your event is a GitHub event.',
            href: 'https://hacktoberfest-handbook.mlh.com/hack-days-partner-modules/partner-challenge-github-copilot',
          },
          ' Award your Wireless Headphones to the winning team (see ',
          { text: 'Event pack', eventPack: true },
          ').',
        ],
        solana: [
          {
            text: 'Your event is a Solana event.',
            href: 'https://hacktoberfest-handbook.mlh.com/hack-days-partner-modules/partner-challenge-solana',
          },
          ' Award your Ledger Nano S Plus kits to the winning team.',
        ],
      },
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
      required: 'You must collect these stickers to receive any rewards.',
      dev: 'Build with open-weight models and open-source AI, and share what you learned.',
      livestreams: 'Attend live sessions and hone your skills.',
      ghw: 'A week of virtual learning and community events.',
      tools: 'Utilize great tools to help you build awesome projects.',
      misc: 'Complete our pre- and post-event surveys.',
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
      title: 'Receive an IRL sticker pack',
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
       linked to MyMLH, is Unclaimed: MLH has asked DEV for it, and DEV
       adds it the moment the accounts are linked. One word, the line under
       its name and its tag where the kind would be; the page's note, its
       lead set in bold. The button is the welcome band's
       (my.identity.devConnectCta, devConnectHref). */
    devUnlinked: 'Unclaimed',
    devUnlinkedNote: {
      lead: 'Not on DEV yet.',
      body: 'Your DEV account isn’t linked to MyMLH, so this badge is waiting for you. Connect DEV and it’s added to your profile.',
    },
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
  /* The sticker book lock (data/stickerBookLock.mjs): what /my says while
     the book, the milestones and the rewards locker are closed. Each band
     keeps its own heading and intro; these are the panel under it
     (components/LockedBand) and the badge every panel wears. `status` is
     the hero's line in place of the milestone intro: the address ask
     until MLH has one, then only the Fest. The milestones'
     numbers are the rewards band's own (lib/stickerBook.mjs rewardsState):
     the stickers the pack asks for, and the book's target for the
     holographic one. */
  locked: {
    status: {
      noAddress:
        'Your sticker book opens October 1st. Until then, add your address and find a Fest.',
      ready:
        'Your sticker book opens October 1st. Until then, find a Fest near you.',
    },
    badge: 'Unlocks October 1st',
    album: {
      title: 'Your sticker book opens October 1st.',
      copy: 'Stickers to collect from Fests, livestreams, DEV challenges, Global Hack Week and more. Everything you do from October 1st lands here.',
    },
    rewards: {
      title: 'Your milestones start counting October 1st.',
      copy: (pack, holographic) =>
        `${numberWord(pack)} stickers put a sticker pack in the mail. ${numberWord(holographic)} unlock the holographic sticker.`,
    },
    inventory: {
      title: 'Your rewards appear here from October 1st.',
      copy: 'Your sticker pack, the holographic sticker, certificates and DEV badges, as you earn them.',
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
  description: `Every Hacktoberfest 2026 sticker and how to earn it: livestreams, Global Hack Week, DEV Challenges, tools to connect, surveys, and Fests in person. ${ACTIVITIES.length} challenges, a virtual sticker for each, and real ones in the mail once you have collected enough.`,
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
      /* The misc type holds only the two surveys today, so it is named
         for them. A non-survey sticker of this type needs a new name. */
      misc: 'Surveys',
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
