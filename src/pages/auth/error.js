import Head from 'next/head';

import Header from 'components/Header';
import MessagePage from 'components/MessagePage';
import { authError } from 'data/content.mjs';

/* Where the API sends OAuth failures. A state mismatch, a denied consent
   and a rejected code all 302 to {FRONTEND_URL}/auth/error (the API's
   oauth.routes.ts and oauthState.ts both name it), and until this page
   existed every one of them landed on the 404 page — "the site is broken"
   instead of "try signing in again".

   Static and stateless on purpose: unlike /auth/callback/ there is no code
   to spend and no state to branch on, so the only job is honest words and
   a way back in. The CTA goes to /login/, which restarts the OAuth hop
   cleanly — the right move for every failure that lands here. */
const AuthError = () => (
  <>
    <Head>
      <title>{authError.title}</title>
      <meta name="robots" content="noindex" />
      <meta name="theme-color" content="#3d5f58" />
    </Head>
    <Header standalone />
    <main id="main">
      <MessagePage
        eyebrow={authError.eyebrow}
        heading={authError.heading.lead}
        accent={authError.heading.accent}
        cta={authError.cta}
        ctaHref="/login/"
        role="status"
      >
        {authError.body}
      </MessagePage>
    </main>
  </>
);

export default AuthError;
