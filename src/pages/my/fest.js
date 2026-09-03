import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import FestDashboard from 'components/FestDashboard';
import Header from 'components/Header';
import {
  MyError,
  MyForbidden,
  MyLoading,
  MyMlhDown,
  MyNotFound,
} from 'components/MyStatus';
import { my } from 'data/content.mjs';
import { getFestDashboard } from 'lib/festDashboard.mjs';
import { readCachedExperience } from 'lib/experienceCache.mjs';
import { pageStateForError } from 'lib/pageState.mjs';
import {
  API_BASE_URL,
  clearSession,
  getSession,
  stashReturnTo,
} from 'lib/session.mjs';

/* One Fest, for its hosts.

   Access control is the API's, not this page's: a static export ships to
   everyone and event ids are guessable, so the endpoint answers 403 to a
   signed-in user who does not organize the event and 404 to an id with no
   Fest behind it. This page is an honest reporter of that answer.

   The same effect discipline as /my, and for the same reasons documented
   there: location.search rather than the router's query (an exported page's
   query is empty on first render), `replace` destructured out of the router
   so a redirect cannot loop, and the whole-page loading surface as the
   exported HTML so nothing personal is ever baked into the export. */
const Fest = () => {
  const { replace } = useRouter();
  const [state, setState] = useState('loading');
  const [fest, setFest] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [attempt, setAttempt] = useState(0);
  /* Fixed at mount rather than read at render: the day-of rule for the
     check-ins card must not change under a re-render, and a pure render is
     what keeps it testable. */
  const [now] = useState(() => Date.now());

  const retry = useCallback(() => {
    setState('loading');
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);
    const festId = params.get('id');
    const scenario = params.get('scenario');
    /* Computed once and reused by both signed-out exits below: a cold
       arrival with no session yet, and a session that dies while the
       dashboard fetch is in flight. Either way, /login/ starts the OAuth
       hop on mount and would otherwise land everyone back on the hub, which
       is not the page they asked for. stashReturnTo sanitises and stores
       this; takeReturnTo reads it back on the other side. */
    const returnTo = `/my/fest/${globalThis.location.search}`;

    let cancelled = false;

    const session = getSession();
    if (!session) {
      stashReturnTo(returnTo);
      replace('/login/');
      return undefined;
    }

    /* No id is not an error worth a retry: there is no Fest to look for. */
    if (!festId) {
      setState('notFound');
      return undefined;
    }

    /* The card this page was opened from is already in the tab's cached
       experience payload, so the header paints immediately while the numbers
       are still in flight. Cold arrivals (a pasted link, a reload) simply
       show the loading surface. */
    const cached = readCachedExperience(session);
    const cachedFest =
      cached && Array.isArray(cached.fests)
        ? cached.fests.find((entry) => entry.id === festId)
        : null;
    if (cachedFest) setFest(cachedFest);

    getFestDashboard(festId, { scenario })
      .then((result) => {
        if (cancelled) return;
        setFest(result.fest);
        setDashboard(result.dashboard);
        setState('ready');
      })
      .catch((error) => {
        if (cancelled) return;
        const next = pageStateForError(error);
        if (next === 'signedOut') {
          clearSession();
          stashReturnTo(returnTo);
          replace('/login/');
          return;
        }
        setState(next);
      });

    return () => {
      cancelled = true;
    };
  }, [replace, attempt]);

  const surface = () => {
    /* The refusals come first: a cached card is no reason to show a Fest the
       API has just told us is not this host's, or no longer there. */
    if (state === 'forbidden') return <MyForbidden />;
    if (state === 'notFound') return <MyNotFound />;
    if (state === 'mlhDown') return <MyMlhDown />;
    if (state === 'error') return <MyError onRetry={retry} />;
    /* Whole-page loading only on a cold arrival - a pasted link, a reload.
       Coming from /my the card is already in the tab's cached payload, so the
       header paints at once and the loader stands in for the numbers alone
       (see FestDashboard). */
    if (!fest) return <MyLoading />;
    return <FestDashboard fest={fest} dashboard={dashboard} now={now} />;
  };

  return (
    <>
      <Head>
        <title>{my.dashboard.title}</title>
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#3d5f58" />
        {/* Same reasoning as /my: the fetch can only start after hydration,
           so warming the API origin now overlaps DNS/TCP/TLS with the JS
           parse. Absent in mocked builds, which have no API origin. */}
        {API_BASE_URL ? (
          <link rel="preconnect" href={API_BASE_URL} crossOrigin="anonymous" />
        ) : null}
      </Head>
      <Header standalone />
      <main id="main">{surface()}</main>
    </>
  );
};

export default Fest;
