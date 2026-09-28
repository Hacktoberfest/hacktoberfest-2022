/* The site's navigation, as data.

   Hacktoberfest is two things, an online month and an in-person season,
   and the nav says so in the visitor's own words: a verb per world, with
   the destinations each world has. About holds what is true of both, the
   mission and the FAQs. Home stays spelled out because on the landing
   page the wordmark scrolls to the top rather than navigating.

   Rendered by components/Header. test/nav.test.mjs asserts every href is
   an exported, open route, which is what makes "we forgot to open
   /schedule/" a failed build rather than a live 404.

   Each group names the world's colour (`accent`, a styles/tokens.js key)
   so the open dropdown can underline itself in it, and each destination
   carries one line of description for the panel: sentence case, a full
   stop, under sixty characters, which test/nav.test.mjs holds it to.

   The account chip is not here: its label depends on the Preptember flag
   and it is styled as the call to action, so Header owns it. */
export const NAV = Object.freeze([
  Object.freeze({ label: 'Home', href: '/' }),
  Object.freeze({
    label: 'Attend online',
    accent: 'sky',
    items: Object.freeze([
      Object.freeze({
        label: 'Overview',
        href: '/online/',
        description: 'Hacktoberfest is back, and how to earn the pack.',
      }),
      Object.freeze({
        label: 'Schedule',
        href: '/schedule/',
        description: 'Everything happening online this October.',
      }),
      Object.freeze({
        label: 'Activities',
        href: '/activities/',
        description: 'The activities, and your progress.',
      }),
    ]),
  }),
  Object.freeze({
    label: 'Attend in-person',
    accent: 'pink',
    items: Object.freeze([
      Object.freeze({
        label: 'Overview',
        href: '/in-person/',
        description: 'A day in a room, in your city, and what you get.',
      }),
      Object.freeze({
        label: 'Find a Fest',
        href: '/fests/',
        description: 'Hundreds of one-day events, in your city or near it.',
      }),
      Object.freeze({
        label: 'Host a Fest',
        href: '/host/',
        description: 'Bring Hacktoberfest to your community.',
      }),
    ]),
  }),
  Object.freeze({
    label: 'About',
    accent: 'ochre',
    items: Object.freeze([
      Object.freeze({
        label: 'Mission',
        href: '/mission/',
        description: 'How Hacktoberfest grew, and why we’re doing this.',
      }),
      Object.freeze({
        label: 'FAQs',
        href: '/questions/',
        description: 'Answers to the most common questions.',
      }),
    ]),
  }),
]);

export const navGroups = (nav) =>
  nav.filter((entry) => Array.isArray(entry.items));

export const navRoutes = (nav) =>
  nav.flatMap((entry) =>
    Array.isArray(entry.items)
      ? entry.items.map((item) => item.href)
      : [entry.href],
  );
