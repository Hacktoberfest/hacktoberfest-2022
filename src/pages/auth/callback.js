import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import Header from 'components/Header';
import Loader from 'components/Loader';
import MessagePage from 'components/MessagePage';
import { authCallback } from 'data/content.mjs';
import { MLH_EMAIL_URL } from 'data/links';
import { exchangeCode } from 'lib/apiClient.mjs';
import { callbackStateForSession } from 'lib/pageState.mjs';
import {
  API_BASE_URL,
  parseSession,
  saveSession,
  takeReturnTo,
} from 'lib/session.mjs';

/* Every state's CTA restarts the sign-in, which is the right move for all of
   them but one: coming back through MyMLH with the same profile lands on
   `noEmail` again. Only editing the profile breaks that loop, so that is
   where its CTA goes. */
const CTA_HREFS = { noEmail: MLH_EMAIL_URL };
const DEFAULT_CTA_HREF = '/login/';

/* Both lookups below are keyed by a state name, and both have a fallback that
   has to be able to fire. See the note above `copy`. */
const own = (table, key) => Object.prototype.hasOwnProperty.call(table, key);

/* Where MyMLH sends people back to.

   The backend has already done the OAuth dance and handed us a single-use
   code with a sixty-second life. All this page does is spend it, store what
   comes back, and get out of the way. */
const AuthCallback = () => {
  const { isReady, query } = useRouter();
  const [state, setState] = useState('working');

  /* React strict mode double-invokes effects in development. The code can
     only be spent once, so a second POST would fail with INVALID_CODE and
     strand someone whose sign-in actually worked. */
  const started = useRef(false);

  useEffect(() => {
    // The query is empty on the very first render of an exported page.
    if (!isReady) return;
    if (started.current) return;
    started.current = true;

    const code = Array.isArray(query.code) ? query.code[0] : query.code;
    if (!code) {
      setState('failed');
      return;
    }

    /* Take the code out of the URL before anything can put it in history or
       resubmit it on a refresh. */
    try {
      globalThis.history.replaceState(null, '', globalThis.location.pathname);
    } catch (_) {
      // Not fatal: the exchange below is what actually matters.
    }

    exchangeCode(code)
      .then((session) => {
        /* saveSession does not validate, but parseSession does — on the read
           side, where the damage is invisible. Round-tripping through the
           same parser that will read it back is the only check that cannot
           drift from it.

           The ways it can say no need different words, though — a withheld
           MyMLH email and a missing refresh token are both 200s that arrived
           intact, and "that link has expired" is false for either. Which
           screen each one earns lives in callbackStateForSession, where it is
           unit tested; only the setState stays here.

           requireRefreshToken because this is the write side: a session
           stored without one works until the access token expires and then
           signs the participant out for no visible reason. See the note on
           parseSession. */
        const stored = parseSession(JSON.stringify(session), {
          requireRefreshToken: true,
        });
        if (!stored) {
          setState(callbackStateForSession(session));
          return;
        }

        saveSession(stored);
        globalThis.location.assign(takeReturnTo());
      })
      .catch((error) => {
        /* A 400 is the API rejecting the code itself — spent, malformed, or
           past its sixty seconds — and is the only case where "that link has
           expired, start again" is the true story. Everything else lands here
           too: offline, DNS, CORS, a 5xx, all of which fetch reports as a
           bare TypeError with no status. Telling someone on a flaky
           connection that their link expired sends them round a loop that
           cannot work, because nothing about the link is wrong. */
        setState(error && error.status === 400 ? 'failed' : 'unavailable');
      });
  }, [isReady, query]);

  /* One block per state, so adding a state is a content change rather than a
     new ternary. Only `working` omits `cta`, which is what keeps the transit
     screen free of a control that does nothing.

     The fallback is not decoration: a setState with any value this object
     does not carry would make `copy` undefined and throw on copy.heading.lead
     during render — a white screen on the one page a participant cannot skip.
     `working` is the safe landing because it is the state the page starts in
     and the only one that promises nothing.

     hasOwnProperty rather than `authCallback[state] ||`: every object
     inherits toString, valueOf, constructor and the rest, so a state sharing
     one of those names reads back a truthy function from Object.prototype,
     the fallback never engages, and the render throws on exactly the screen
     this guard exists to keep alive. Same convention selectScenario uses in
     data/fixtures.mjs, and applied to the CTA lookup below for the same
     reason — there it would hand href a function. */
  const copy = own(authCallback, state)
    ? authCallback[state]
    : authCallback.working;
  const ctaHref = own(CTA_HREFS, state) ? CTA_HREFS[state] : DEFAULT_CTA_HREF;

  return (
    <>
      <Head>
        <title>{authCallback.title}</title>
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#3d5f58" />
        {/* The code exchange can only start after hydration; telling the
           browser about the API origin now lets DNS/TCP/TLS overlap the JS
           parse instead of serializing after it. Absent in mocked builds,
           where there is no API origin to warm. */}
        {API_BASE_URL ? (
          <link rel="preconnect" href={API_BASE_URL} crossOrigin="anonymous" />
        ) : null}
      </Head>
      <Header standalone />
      <main id="main">
        {/* The transit screen is the same four-box loader /my shows while
           it fetches, so the whole arrival — MyMLH, here, the hub — reads
           as one continuous load. Strictly `working`, not the copy
           fallback: an unknown state still gets MessagePage with the
           working words, a screen that shows something rather than a
           loader that spins over a stalled exchange. */}
        {state === 'working' ? (
          <Loader label={authCallback.working.body} />
        ) : (
          <MessagePage
            eyebrow={authCallback.eyebrow}
            heading={copy.heading.lead}
            accent={copy.heading.accent}
            cta={copy.cta}
            ctaHref={copy.cta ? ctaHref : undefined}
            role="status"
          >
            {copy.body}
          </MessagePage>
        )}
      </main>
    </>
  );
};

export default AuthCallback;
