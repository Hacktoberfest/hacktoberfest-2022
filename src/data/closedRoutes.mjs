/* Nothing is closed today. /schedule/ opened for October: the page was
   signed off as ready to be public on 2026-09-09 (the API being live was
   never the bar; the page itself was), the nav points at it, and
   test/nav.test.mjs fails the run if a nav destination is ever listed
   here. The mechanism stays for the next page that is built before it is
   ready.

   The format contract, for whoever lists a route here next: entries are
   routes exactly as the sitemap writes them — leading and trailing
   slash, e.g. '/fests/' — and one path segment only. The pruner
   (src/build/post/closedRoutes.mjs) derives Next's chunk name from that
   single segment, so it throws rather than guess when a route is
   nested. */
export const CLOSED_ROUTES = [];

export const routeIsClosed = (route) => CLOSED_ROUTES.includes(route);
