/* After Hacktoberfest the site is the homepage and /my, plus the sign-in
   path /my cannot work without: /login/, the two OAuth callbacks,
   /auth/error/ and /signed-out/. Every other page the season had is
   retired, and this is the list.

   A retired route still exports a page, because the export is static and
   there is no server to answer a 301. Its file under src/pages is
   components/RedirectHome, which sends the visitor to /. The copy and the
   components the page used to render stay in the repo; only the route is
   gone. Bringing one back means restoring its src/pages file from git,
   taking it off this list, and putting it back in SITE_PAGES
   (src/build/sitemap.mjs) and the nav.

   test/retired-routes.test.mjs holds src/pages, the sitemap and the nav
   to this list. Same format as data/closedRoutes.mjs: routes as the
   sitemap writes them, leading and trailing slash. */
export const RETIRED_ROUTES = Object.freeze([
  '/online/',
  '/in-person/',
  '/fests/',
  '/host/',
  '/sponsor/',
  '/schedule/',
  '/activities/',
  '/questions/',
  '/brand/',
  '/mission/',
  '/subscribed/',
]);

export const routeIsRetired = (route) => RETIRED_ROUTES.includes(route);
