import Head from 'next/head';

import Header from 'components/Header';
import MessagePage from 'components/MessagePage';
import { signedOut } from 'data/content.mjs';
import { MLH_SIGNOUT_URL } from 'lib/session.mjs';

/* Where the sign-out control on /my lands, in both modes. Ending here
   instead of on mlh.com/signout keeps the goodbye on this origin:
   MLH's route ignores return_to and strands people on their sign-in
   form. The cost is that MLH's own cookie survives by default, so the
   copy says so and the inline link — MLH_SIGNOUT_URL, the one spelling
   that works — is the shared-machine escape hatch.

   Nothing here reads or clears the session: endSession has already run
   before the navigation that arrives here, and a page that works the
   same signed in or out has nothing to flash or misstate. */
const SignedOut = () => (
  <>
    <Head>
      <title>{signedOut.title}</title>
      <meta name="robots" content="noindex" />
      <meta name="theme-color" content="#3d5f58" />
    </Head>
    <Header standalone />
    <main id="main">
      <MessagePage
        eyebrow={signedOut.eyebrow}
        heading={signedOut.heading.lead}
        accent={signedOut.heading.accent}
        cta={signedOut.cta}
        ctaHref="/"
      >
        {signedOut.body} {signedOut.mlh.lead}{' '}
        <a href={MLH_SIGNOUT_URL}>{signedOut.mlh.linkLabel}</a>{' '}
        {signedOut.mlh.tail}
      </MessagePage>
    </main>
  </>
);

export default SignedOut;
