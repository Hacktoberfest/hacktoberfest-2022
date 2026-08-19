import Head from 'next/head';
import { useEffect, useRef } from 'react';

import Header from 'components/Header';
import Loader from 'components/Loader';
import { login } from 'data/content.mjs';
import { startLogin } from 'lib/session.mjs';

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

  useEffect(() => {
    if (started.current) return;
    started.current = true;
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
        <Loader label={login.redirecting} />
      </main>
    </>
  );
};

export default Login;
