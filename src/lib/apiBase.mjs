/* Where "which API is this build talking to?" is decided, exactly once.

   Production cannot set NEXT_PUBLIC_API_BASE_URL, so unset defaults to the
   live origin: the build with no configuration at all is the production
   build, and real data shows up without any wiring. The mocked build —
   fixtures, no backend — did not go away, but it has to be asked for by
   name now: the literal value `mocked`. An explicit sentinel because an
   empty string cannot survive `raw ||` below, and once unset stopped
   meaning "no API" there is no other way left to say it.

   Shared by lib/session.mjs (the client bundle), src/build/post/buildMode.mjs
   (records what a build baked) and scripts/check-build-mode.mjs (refuses to
   serve a contradiction), so the three can never disagree about which mode
   a value means. */
export const LIVE_API_BASE_URL = 'https://hacktoberfest-api.mlh.com';
export const MOCKED_SENTINEL = 'mocked';

/* The public events snapshot as an absolute URL, for the two places that
   publish the endpoint rather than call it: the LLM note under the /fests
   directory (via FESTS_API_URL in data/links.js) and the crawler files
   (src/build/llms.mjs). Deliberately built on LIVE_API_BASE_URL and not on
   the resolved base — an address a reader is given has to be the live one
   even in a mocked build, where the resolved base is ''. Callers inside the
   app still go through resolveApiBaseUrl; this constant is only ever
   printed. Lives here, beside the origin it is made of, so the build
   scripts can import it without reaching into a .js file. */
export const LIVE_EVENTS_URL = `${LIVE_API_BASE_URL}/api/events`;

/* Resolves the raw env value to the API origin the build will call, or ''
   for the mocked build — every mock-vs-live seam switches on that
   falsiness, unchanged. */
export const resolveApiBaseUrl = (raw) => {
  const value = raw || LIVE_API_BASE_URL;
  return value === MOCKED_SENTINEL ? '' : value.replace(/\/*$/, '');
};
