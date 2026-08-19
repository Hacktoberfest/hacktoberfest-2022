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
export const LIVE_API_BASE_URL = 'https://hacktoberfest.com';
export const MOCKED_SENTINEL = 'mocked';

/* Resolves the raw env value to the API origin the build will call, or ''
   for the mocked build — every mock-vs-live seam switches on that
   falsiness, unchanged. */
export const resolveApiBaseUrl = (raw) => {
  const value = raw || LIVE_API_BASE_URL;
  return value === MOCKED_SENTINEL ? '' : value.replace(/\/*$/, '');
};
