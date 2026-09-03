/* Routes whose pages are built but closed to visitors for now.

   Closed means gone, not merely unlinked: the postbuild pruner deletes the
   route's exported HTML and its page chunk from `out/`
   (src/build/post/closedRoutes.mjs), so the URL serves the site's own 404
   and none of the page's copy or fixtures ship at all. The sitemap and the
   llms files drop it for the same reason — advertising a route that answers
   404 is worse than saying nothing. The page's source stays exactly where
   it is: closing a route is adding an entry here, and reopening one is
   deleting it.

   /fests is the entry this file was written for — the directory had nothing
   real to list until approved Fests were published, so the route closed
   behind a removed nav link. It is open again, so the entry is gone and the
   nav link is back (components/Header).

   /schedule is closed, and the reason has changed since it was first added
   here. It was closed because GET /api/schedule did not exist and the live
   page would have rendered only its error state. That endpoint now exists
   and serves the real programme — the page is closed now because it is
   still being worked on, and shipping a half-finished calendar is a
   different mistake from shipping a broken one.

   So do not reopen this on the strength of the API being live: that is no
   longer what the entry is waiting for. It comes out when the page itself
   is ready, which is a judgement call rather than a check somebody can
   run.

   Entries are routes as the sitemap writes them: leading and trailing
   slash, matching next.config.js's trailingSlash. One path segment only —
   the pruner throws on a nested route rather than guess at where Next put
   its chunk. */
export const CLOSED_ROUTES = ['/schedule/'];

export const routeIsClosed = (route) => CLOSED_ROUTES.includes(route);
