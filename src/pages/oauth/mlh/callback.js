import Head from 'next/head';
import { useEffect } from 'react';

import Header from 'components/Header';
import Loader from 'components/Loader';
import { authCallback } from 'data/content.mjs';
import { API_BASE_URL, oauthCallbackForwardDestination } from 'lib/session.mjs';

/* The missing ingress rule, shipped as a page.

   MyMLH's OAuth app sends every finished sign-in to
   hacktoberfest.com/oauth/mlh/callback — a registered redirect URI that
   expected the platform to forward /oauth/* to the API. That forwarding
   never existed in production, so sign-ins died here on the 404 page with
   the one-time code still in the URL. This page stands at that address and
   completes the hand-off itself: the query string goes to the API's real
   callback (lib/session.mjs owns the destination), the API exchanges the
   code with MyMLH, and the participant comes back to /auth/callback/
   exactly as before.

   location.replace, not assign: a transit hop carrying a one-time code has
   no business in the Back button — Back would re-submit a spent code to
   the API for a guaranteed failure screen. No strict-mode ref guard is
   needed, unlike /auth/callback/: replacing twice with the same URL is
   harmless, spending a code twice is not, and this page only forwards. */
const OauthMlhCallback = () => {
  useEffect(() => {
    globalThis.location.replace(
      oauthCallbackForwardDestination(globalThis.location.search),
    );
  }, []);

  return (
    <>
      <Head>
        <title>{authCallback.title}</title>
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#3d5f58" />
        {/* The forward can only fire after hydration; telling the browser
           about the API origin now lets DNS/TCP/TLS overlap the JS parse
           instead of serializing after it. Absent in mocked builds, where
           there is no API origin to warm. */}
        {API_BASE_URL ? (
          <link rel="preconnect" href={API_BASE_URL} crossOrigin="anonymous" />
        ) : null}
      </Head>
      <Header standalone />
      <main id="main">
        {/* The same four-box loader as /auth/callback/: to the participant
           this hop is one continuous sign-in, not a screen of its own. */}
        <Loader label={authCallback.working.body} />
      </main>
    </>
  );
};

export default OauthMlhCallback;
