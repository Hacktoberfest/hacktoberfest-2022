import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import Header from 'components/Header';
import { MyError, MyLoading, MyMlhDown } from 'components/MyStatus';
import SponsorOffers from 'components/SponsorOffers';
import PromosHero from 'components/SponsorOffers/Hero';
import { my } from 'data/content.mjs';
import { getOffers, offersPageState } from 'lib/offers.mjs';
import {
  API_BASE_URL,
  clearSession,
  getSession,
  stashReturnTo,
} from 'lib/session.mjs';

/* The participant's sponsor codes: one card per code from the sponsors of
   their Hacktoberfest events, from GET /api/me/offers.

   The same effect discipline as /my/fest/, for the reasons documented
   there: location.search rather than the router's query, `replace`
   destructured out of the router so a redirect cannot loop, and the
   whole-page loading surface as the exported HTML so nothing personal is
   baked into the export. */
const Promos = () => {
  const { replace } = useRouter();
  const [state, setState] = useState('loading');
  const [offers, setOffers] = useState([]);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setState('loading');
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    const scenario = new URLSearchParams(globalThis.location.search).get(
      'scenario',
    );
    const returnTo = `/my/promos/${globalThis.location.search}`;
    let cancelled = false;

    if (!getSession()) {
      stashReturnTo(returnTo);
      replace('/login/');
      return undefined;
    }

    getOffers({ scenario })
      .then((result) => {
        if (cancelled) return;
        setOffers(result);
        setState('ready');
      })
      .catch((error) => {
        if (cancelled) return;
        const next = offersPageState(error);
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
    if (state === 'mlhDown') return <MyMlhDown />;
    if (state === 'error') {
      return <MyError onRetry={retry} copy={my.promos.error} />;
    }
    if (state === 'loading') return <MyLoading />;
    return (
      <>
        <PromosHero />
        <SponsorOffers offers={offers} />
      </>
    );
  };

  return (
    <>
      <Head>
        <title>{my.promos.title}</title>
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#3d5f58" />
        {/* Same reasoning as /my: warm the API origin while the JS parses.
            Absent in mocked builds, which have no API origin. */}
        {API_BASE_URL ? (
          <link rel="preconnect" href={API_BASE_URL} crossOrigin="anonymous" />
        ) : null}
      </Head>
      <Header standalone />
      <main id="main">{surface()}</main>
    </>
  );
};

export default Promos;
