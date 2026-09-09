import Head from 'next/head';
import { useEffect, useState } from 'react';

import ActivitiesPage from 'components/ActivitiesPage';
import Header from 'components/Header';
import PageHero from 'components/PageHero';
import { activitiesPage } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';
import { getExperience } from 'lib/experience.mjs';
import { pageStateForError } from 'lib/pageState.mjs';
import { getProgress } from 'lib/progress.mjs';
import { clearSession, getSession } from 'lib/session.mjs';

const ACTIVITIES_URL = absoluteUrl('/activities/');

/* Public, and never a wall: this is where the nav's Activities entry lands,
   so a visitor with no session reads the same page with the sign-in link in
   place of their milestones. Signed in, two fetches: the progress for the
   rows, and the experience for the address flag the milestone card needs.
   A 401 here is "you are signed out", not a redirect — clear the dead
   session and render the public shape. Anything else keeps the public
   shape too; the rows do not depend on the fetch succeeding. */
const Activities = () => {
  const [progress, setProgress] = useState(null);
  const [experience, setExperience] = useState(null);

  useEffect(() => {
    const scenario = new URLSearchParams(globalThis.location.search).get(
      'scenario',
    );
    let cancelled = false;
    const session = getSession();

    getProgress(session, { scenario })
      .then((result) => {
        if (cancelled) return;
        setProgress(result);
        if (!result.signedIn) return;
        return getExperience(session, { scenario }).then((exp) => {
          if (!cancelled)
            setExperience({ ...exp, thresholds: result.thresholds });
        });
      })
      .catch((error) => {
        if (cancelled) return;
        if (pageStateForError(error) === 'signedOut') clearSession();
        return getProgress(null).then((result) => {
          if (!cancelled) setProgress(result);
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        {progress && (
          <ActivitiesPage progress={progress} experience={experience} />
        )}
      </main>
    </>
  );
};

export default Activities;
