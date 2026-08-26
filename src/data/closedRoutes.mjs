/* Routes whose pages are built but closed to visitors for now.

   Closed means gone, not merely unlinked: the postbuild pruner deletes the
   route's exported HTML and its page chunk from `out/`
   (src/build/post/closedRoutes.mjs), so the URL serves the site's own 404
   and none of the page's copy or fixtures ship at all. The sitemap and the
   llms files drop it for the same reason — advertising a route that answers
   404 is worse than saying nothing. The page's source stays exactly where
   it is: closing a route is adding an entry here, and reopening one is
   deleting it.

   Empty today, and that is the mechanism resting rather than the mechanism
   unused. /fests is the entry this file was written for — the directory had
   nothing real to list until approved Fests were published, so the route
   closed behind a removed nav link. It is open again, so the entry is gone
   and the nav link is back (components/Header). Nothing else has ever been
   closed.

   Entries are routes as the sitemap writes them: leading and trailing
   slash, matching next.config.js's trailingSlash. One path segment only —
   the pruner throws on a nested route rather than guess at where Next put
   its chunk. */
export const CLOSED_ROUTES = [];

export const routeIsClosed = (route) => CLOSED_ROUTES.includes(route);
