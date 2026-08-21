import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

import Header from 'components/Header';
import Loader from 'components/Loader';
import MessagePage from 'components/MessagePage';
import { login } from 'data/content.mjs';
import { canPersistSession, startLogin } from 'lib/session.mjs';

/* The hand-off point. startLogin is the only thing that knows whether the
   session is real or mocked, so this page never changes when the backend
   lands. MyMLH is the only sign-in option, so there's nothing left for a
   click to decide — the page starts the redirect itself and shows the
   same loader /auth/callback does, so the whole arrival reads as one
   continuous transit rather than a page someone has to act on.

   The ref survives React Strict Mode's double-invoke in development:
   startLogin itself is harmless to call twice (it just restashes the same
   return-to value before reassigning location), but the guard keeps the
   redirect's intent — fire once — honest. */
const Login = () => {
  const started = useRef(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    /* Refusing to start is the whole point. A browser that will not keep a
       session turns this page into one step of a loop with no exit: the hop
       below completes in silence against MLH's cookie, /auth/callback
       stores a good session into nothing, /my finds nothing and sends them
       back here. /auth/callback catches that too, and has to, since it is
       the only place that can see a write fail for a reason no probe
       predicts. This end catches it a whole round trip through MyMLH
       earlier, and is the only end the mocked build has at all — there
       startLogin writes the fake session itself and there is no callback
       page in the loop to stop it. */
    if (!canPersistSession()) {
      setBlocked(true);
      return;
    }

    startLogin('/my/');
  }, []);

  return (
    <>
      <Head>
        <title>{login.title}</title>
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#3d5f58" />
      </Head>
      <Header standalone />
      <main id="main">
        {/* role="status" for the same reason /auth/callback passes it: this
            replaces the Loader, whose aria-live paragraph unmounts with it,
            so without it a screen-reader user who just heard "we're taking
            you to MyMLH" gets silence instead of the reason they aren't. */}
        {blocked ? (
          <MessagePage
            eyebrow={login.eyebrow}
            heading={login.blocked.heading.lead}
            accent={login.blocked.heading.accent}
            details={login.blocked.steps}
            cta={login.blocked.cta}
            ctaHref="/login/"
            role="status"
          >
            {login.blocked.body}
          </MessagePage>
        ) : (
          <Loader label={login.redirecting} />
        )}
      </main>
    </>
  );
};

export default Login;
