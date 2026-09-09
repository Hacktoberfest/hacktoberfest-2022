/* The site's navigation, as data.

   Hacktoberfest is two things, an online month and an in-person season,
   and the nav says so in the visitor's own words: a verb per world, with
   the two destinations each world has. Home stays spelled out because on
   the landing page the wordmark scrolls to the top rather than navigating.

   Rendered by components/Header. test/nav.test.mjs asserts every href is
   an exported, open route, which is what makes "we forgot to open
   /schedule/" a failed build rather than a live 404.

   The account chip is not here: its label depends on the Preptember flag
   and it is styled as the call to action, so Header owns it. */
export const NAV = Object.freeze([
  Object.freeze({ label: 'Home', href: '/' }),
  Object.freeze({
    label: 'Attend online',
    items: Object.freeze([
      Object.freeze({ label: 'Schedule', href: '/schedule/' }),
      Object.freeze({ label: 'Activities', href: '/activities/' }),
    ]),
  }),
  Object.freeze({
    label: 'Attend in-person',
    items: Object.freeze([
      Object.freeze({ label: 'Find a Fest', href: '/fests/' }),
      Object.freeze({ label: 'Host a Fest', href: '/host/' }),
    ]),
  }),
  Object.freeze({ label: 'FAQs', href: '/questions/' }),
]);

export const navGroups = (nav) =>
  nav.filter((entry) => Array.isArray(entry.items));

export const navRoutes = (nav) =>
  nav.flatMap((entry) =>
    Array.isArray(entry.items)
      ? entry.items.map((item) => item.href)
      : [entry.href],
  );
