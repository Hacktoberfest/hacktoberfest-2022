/* The site's navigation, as data.

   After Hacktoberfest the site is the homepage and /my, so the nav is Home
   alone. The season's two worlds, Attend online and Attend in-person, and
   About went with the pages they pointed at (data/retiredRoutes.mjs).
   Header still renders groups the way it did, so a destination can come
   back as an entry with `items`: a label, the world's colour as `accent`
   (a styles/tokens.js key), and one line of description per destination
   in sentence case, a full stop, under sixty characters. Home stays
   spelled out because on the landing page the wordmark scrolls to the top
   rather than navigating.

   Rendered by components/Header. test/nav.test.mjs asserts every href is
   an exported, open route, which is what makes "we forgot to open
   /schedule/" a failed build rather than a live 404.

   The account chip is not here: its label depends on the Preptember flag
   and it is styled as the call to action, so Header owns it. */
export const NAV = Object.freeze([Object.freeze({ label: 'Home', href: '/' })]);

export const navGroups = (nav) =>
  nav.filter((entry) => Array.isArray(entry.items));

export const navRoutes = (nav) =>
  nav.flatMap((entry) =>
    Array.isArray(entry.items)
      ? entry.items.map((item) => item.href)
      : [entry.href],
  );
