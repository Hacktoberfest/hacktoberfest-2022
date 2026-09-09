import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';

import ActivitiesPage from 'components/ActivitiesPage';
import Header from 'components/Header';
import PageHero from 'components/PageHero';
import { activitiesPage } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';
import { milestoneSlot, publicActivities } from 'lib/activitiesPageState.mjs';
import { DEFAULT_THRESHOLDS } from 'lib/eligibility.mjs';
import { getExperience } from 'lib/experience.mjs';
import { pageStateForError } from 'lib/pageState.mjs';
import { getProgress, progressFromPayload } from 'lib/progress.mjs';
import { clearSession, getSession } from 'lib/session.mjs';

const ACTIVITIES_URL = absoluteUrl('/activities/');

/* Public, and never a wall: this is where the nav's Activities entry lands,
   so a visitor with no session reads the same page with the sign-in link in
   place of their milestones.

   One data path per state, not two: signed out, `getProgress(null, ...)`
   needs no network at all — src/lib/progress.mjs already special-cases a
   null session — and is the whole answer. Signed in, `getExperience` alone
   carries everything the page needs (activities, thresholds and the
   address flag the milestone card reads), so the two seams are never both
   in flight for the same visitor; this used to fetch /api/me/progress
   twice, once here and once inside getExperience.

   `hasSession` is read synchronously from storage, not from either fetch's
   result, so `milestoneSlot` (lib/activitiesPageState.mjs) never shows the
   sign-in link to someone who is signed in but whose data has not arrived
   yet. The rows are public content and render from
   `publicActivities()`/`DEFAULT_THRESHOLDS` for as long as there is
   nothing more specific to show — while the signed-in fetch is in flight,
   and if it fails with anything other than a dead session — so a
   transient failure never collapses the whole page to the signed-out
   shape. A 401 clears the session and re-enters the signed-out state; any
   other error stays signed in, with a retry in the milestone slot. */
const Activities = () => {
  const [hasSession, setHasSession] = useState(false);
  const [status, setStatus] = useState('idle');
  const [activities, setActivities] = useState(publicActivities);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [experience, setExperience] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    const scenario = new URLSearchParams(globalThis.location.search).get(
      'scenario',
    );
    let cancelled = false;

    /* The one place either branch lands on "no session": the initial
       check below, and a 401 discovered mid-fetch. Both call getProgress
       the same way, so there is exactly one signed-out data path. */
    const enterSignedOut = () =>
      getProgress(null, { scenario }).then((result) => {
        if (cancelled) return;
        setHasSession(false);
        setActivities(result.activities);
        setThresholds(result.thresholds);
        setExperience(null);
        setStatus('ready');
      });

    const session = getSession();

    if (!session) {
      enterSignedOut();
      return () => {
        cancelled = true;
      };
    }

    setHasSession(true);
    setActivities(publicActivities());
    setThresholds(DEFAULT_THRESHOLDS);
    setStatus('loading');

    getExperience(session, { scenario })
      .then((result) => {
        if (cancelled) return;
        /* Merged onto the catalogue here, not trusted as already merged:
           live, the seam has done it; mocked, the fixture carries only the
           API-shaped entries, and rows need the label and the link. Going
           through progressFromPayload rather than mergeActivities keeps
           `source` alive either way — mergeActivities drops it, and
           ActivityRow's "how" phrase needs it — and the merge is
           idempotent, so both arrive the same. */
        setActivities(
          progressFromPayload({
            thresholds: result.thresholds,
            challenges: result.activities,
          }).activities,
        );
        setThresholds(result.thresholds);
        setExperience(result);
        setStatus('ready');
      })
      .catch((error) => {
        if (cancelled) return;
        if (pageStateForError(error) === 'signedOut') {
          clearSession();
          enterSignedOut();
          return;
        }
        /* Anything else: keep the public rows already on screen (set
           above, before this fetch started) and show the retry slot. */
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return (
    <>
      <Head>
        <title>{activitiesPage.title}</title>
        <meta name="description" content={activitiesPage.description} />
        <meta name="theme-color" content="#3d5f58" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={ACTIVITIES_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={meta.siteName} />
        <meta property="og:title" content={activitiesPage.title} />
        <meta property="og:description" content={activitiesPage.description} />
        <meta property="og:url" content={ACTIVITIES_URL} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={meta.imageAlt} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={activitiesPage.title} />
        <meta name="twitter:description" content={activitiesPage.description} />
        <meta name="twitter:image" content={meta.imageWide} />
        <meta name="twitter:image:alt" content={meta.imageAlt} />
      </Head>
      <Header standalone />
      <main id="main">
        <PageHero
          eyebrow={activitiesPage.eyebrow}
          lead={activitiesPage.heading.lead}
          accent={activitiesPage.heading.accent}
        >
          <p>{activitiesPage.intro}</p>
        </PageHero>
        {/* Rendered only once the seam answers, so the export carries the
            hero and nothing personal; the rows arrive with the first paint
            after hydration in every build. */}
        {status !== 'idle' && (
          <ActivitiesPage
            activities={activities}
            thresholds={thresholds}
            signedIn={hasSession}
            milestone={milestoneSlot({ hasSession, status })}
            experience={experience}
            onRetry={retry}
          />
        )}
      </main>
    </>
  );
};

export default Activities;
