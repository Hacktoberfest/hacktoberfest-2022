/* Nothing is closed today. /schedule/ opened for October: the endpoint it
   reads is live and the nav points at it, and test/nav.test.mjs fails the
   build if a nav destination is ever listed here. The mechanism stays for
   the next page that is built before it is ready. */
export const CLOSED_ROUTES = [];

export const routeIsClosed = (route) => CLOSED_ROUTES.includes(route);
