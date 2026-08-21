import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import ApplicationsBand from 'components/ApplicationsBand';
import CountdownBand from 'components/CountdownBand';
import Header from 'components/Header';
import HostResourcesBand from 'components/HostResourcesBand';
import { MyError, MyLoading, MyMlhDown } from 'components/MyStatus';
import ThankYouBand from 'components/ThankYouBand';
import WelcomeBand from 'components/WelcomeBand';
import WhyHostBand from 'components/WhyHostBand';
import { my } from 'data/content.mjs';
import { PREPTEMBER } from 'data/preptember.mjs';
import { endSession } from 'lib/apiClient.mjs';
import { getExperience } from 'lib/experience.mjs';
import {
  readCachedExperience,
  writeCachedExperience,
} from 'lib/experienceCache.mjs';
import { hasApplied, isHost } from 'lib/fests.mjs';
import { pageStateForError } from 'lib/pageState.mjs';
import {
  API_BASE_URL,
  clearSession,
  getSession,
  signOutDestination,
} from 'lib/session.mjs';

/* The only component in the feature with effects.

   The static export has no server, so the signed-in check has to run in the
   browser: the page always renders the loading state first, then either
   redirects or shows the hub. It never flashes personalized content at
   someone who is not signed in. */
const My = () => {
  /* Destructured deliberately: depending on the whole `router` object
     re-runs this effect on every route change, which with a redirect inside
     it is a loop waiting to happen. `replace` is stable. */
  const { replace } = useRouter();
  const [state, setState] = useState('loading');
  const [experience, setExperience] = useState(null);
  /* The fast half of the split fetch: set the moment /api/me/profile
     answers, while the fests half is still in flight, so the welcome band
     can greet by name before the whole hub is ready. Null until then — and
     null in the exported HTML always, which is what keeps the export the
     whole-page loading surface the contract test pins. */
  const [profileUser, setProfileUser] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setState('loading');
    setAttempt((value) => value + 1);
  }, []);

  /* endSession, not clearSession: the refresh token is good for thirty days
     and the API keeps honouring it until it is told not to, so a local-only
     sign-out leaves a working credential behind on a shared machine. It
     revokes and clears without waiting on the network — see the note there —
     so the redirect below is as immediate as it ever was.

     And /signed-out/, not /login/. Revoking our token is only half of it:
     MLH keeps its own cookie, so /login/ — which starts the OAuth hop the
     moment it mounts — completed silently and put the participant straight
     back on this page. Pressing "Sign out" visibly did nothing. The
     signed-out page says which half ended and offers MLH's own sign-out —
     the only thing that can clear that cookie — as a link for shared
     machines, instead of navigating everyone there only to be stranded on
     mlh.com/signin's form.

     endSession's `keepalive: true` is what carries the revocation POST across
     the navigation below — load-bearing because that navigation unloads the
     document. */
  const signOut = useCallback(() => {
    endSession();
    globalThis.location.href = signOutDestination();
  }, []);

  useEffect(() => {
    /* location.search rather than useRouter().query, and no isReady gate.
       Same reasoning as /auth/callback/, which carries the long version: an
       exported page's query is empty on first render, so this waited on the
       router's initial route resolution — a step that has nothing to do with
       what this page needs and that failed outright on Aug 21, 2026 when
       DigitalOcean's two origin nodes sat on different builds and a
       _buildManifest.js 404 wedged the router. The address bar is the
       authority on what is in the address bar.

       Read inside the effect because that is its only consumer, which also
       keeps it out of the dependency list below. */
    const scenario = new URLSearchParams(globalThis.location.search).get(
      'scenario',
    );

    let cancelled = false;

    const session = getSession();
    if (!session) {
      replace('/login/');
      return undefined;
    }

    /* Back from /signed-out/ is a bfcache restore, which does not re-run
       this effect — the hub would repaint from React state with the session
       already revoked and cleared. Landing back on /signed-out/ keeps the
       sign-out true. A reload here (the previous fix) re-ran the check
       above and bounced to /login/, where OAuth starts on mount — and with
       MLH's cookie now surviving sign-out by default, it completes
       silently: Back would quietly undo the sign-out. `persisted` keeps
       this to genuine bfcache restores; `replace` keeps the dead hub out
       of history, so Back from the landing page cannot come straight back
       here. */
    const onPageShow = (event) => {
      if (event.persisted && !getSession())
        globalThis.location.replace(signOutDestination());
    };
    globalThis.addEventListener('pageshow', onPageShow);

    /* A cached copy — this signed-in user's own last payload, live builds
       only (see lib/experienceCache.mjs) — paints the whole hub instantly;
       the fetch below then revalidates it. `cached` is also why the catch
       can afford to stay quiet: with a rendered hub on screen, replacing it
       with an error surface because the refresh failed would be strictly
       worse than keeping slightly-old data. A 401 is the exception — that is
       not staleness but a dead session, and still signs out. */
    const cached = readCachedExperience(session);
    if (cached) {
      setExperience(cached);
      setState('ready');
    }

    getExperience(session, {
      scenario,
      onProfile: (user) => {
        if (!cancelled) setProfileUser(user);
      },
    })
      .then((result) => {
        if (cancelled) return;
        writeCachedExperience(session, result);
        setExperience(result);
        setState('ready');
      })
      .catch((error) => {
        if (cancelled) return;
        /* The choice itself lives in lib/pageState.mjs, where it is unit
           tested — including which statuses earn a surface of their own and
           which fall through. Only the side effects stay here, because only
           they need the router. */
        const next = pageStateForError(error);
        if (next === 'signedOut') {
          clearSession();
          replace('/login/');
          return;
        }
        if (cached) return; // keep the rendered hub; see the note above
        setState(next);
      });

    return () => {
      cancelled = true;
      globalThis.removeEventListener('pageshow', onPageShow);
    };
  }, [replace, attempt]);

  /* mlhDown is a whole-page state: nothing from the hub renders, only the
     surface itself — deliberate caution, because a name beside an empty
     events list reads as "my data is wrong", not "MLH is down". Loading
     starts whole-page too (the exported HTML is exactly this render), but
     the moment the fast profile half answers it falls through to the frame
     below: the participant's name on screen while the fests are still in
     flight. */
  if (state === 'mlhDown' || (state === 'loading' && !profileUser)) {
    return (
      <>
        <Head>
          <title>{my.title}</title>
          <meta name="robots" content="noindex" />
          <meta name="theme-color" content="#3d5f58" />
          {/* The experience fetch can only start after hydration; telling
             the browser about the API origin now lets DNS/TCP/TLS overlap
             the JS parse instead of serializing after it. Absent in mocked
             builds, where there is no API origin to warm. */}
          {API_BASE_URL ? (
            <link
              rel="preconnect"
              href={API_BASE_URL}
              crossOrigin="anonymous"
            />
          ) : null}
        </Head>
        <Header standalone />
        <main id="main">
          {state === 'loading' ? <MyLoading /> : <MyMlhDown />}
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{my.title}</title>
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#3d5f58" />
        {/* Same preconnect as the loading surface above, for the same
           reason: revalidation fetches start from this state too. */}
        {API_BASE_URL ? (
          <link rel="preconnect" href={API_BASE_URL} crossOrigin="anonymous" />
        ) : null}
      </Head>
      <Header standalone />
      <main id="main">
        {/* The welcome band renders in the error and profile-first loading
           states too: the heading and account area belong to the page, and
           the surface below — the error card, or the loading animation —
           stands in for the bands. profileUser is the early answer from the
           split fetch; the full experience simply replaces it when the
           fests half lands. */}
        <WelcomeBand
          user={state === 'ready' && experience ? experience.user : profileUser}
          host={
            state === 'ready' && experience ? isHost(experience.fests) : false
          }
          onSignOut={signOut}
        />
        {/* The same four-box animation the whole-page surface shows, now
           standing in for the bands only, under the participant's name —
           `inline`, so it drops that surface's full-bleed forest and
           viewport-tall column and waits on the page's own paper. */}
        {state === 'loading' && <MyLoading inline />}
        {state === 'error' && <MyError onRetry={retry} />}
        {/* Preptember mode (data/preptember.mjs): the hub is two bands,
           the countdown then Your Applications, since September's work
           is getting a Fest organized. */}
        {state === 'ready' && experience && (
          <>
            {PREPTEMBER && <CountdownBand />}
            {PREPTEMBER && <ApplicationsBand experience={experience} />}
            {/* `approved` is isHost, not isOrganizing: a draft or
               submitted application keeps the operational resources
               locked — funding, swag, and a listing only become real
               once MLH approves. */}
            {PREPTEMBER && (
              <HostResourcesBand approved={isHost(experience.fests)} />
            )}
            {/* The closing band forks on the application gate — the pitch
               until an application is actually sent (hasApplied: submitted
               or beyond, not drafts), a thank-you postcard after. */}
            {PREPTEMBER &&
              (hasApplied(experience.fests) ? (
                <ThankYouBand user={experience.user} />
              ) : (
                <WhyHostBand />
              ))}
          </>
        )}
      </main>
    </>
  );
};

export default My;
