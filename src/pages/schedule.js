import Head from 'next/head';

import Header from 'components/Header';
import PageHero from 'components/PageHero';
import ScheduleCallout from 'components/ScheduleCallout';
import ScheduleDirectory from 'components/ScheduleDirectory';
import { schedule } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';

const SCHEDULE_URL = absoluteUrl('/schedule/');

/* October's online programme.

   The route is closed for now (data/closedRoutes.mjs): the /api/schedule
   endpoint this page reads does not exist yet, and a live page stuck on its
   error state is worse than no page. The source stays here regardless —
   closing a route never means deleting the page — and opening it is deleting
   one line in that file.

   No `actions` on the hero: the calendar itself is what the reader came for,
   and the one link off this page belongs at the foot of it, in the callout. */
const Schedule = () => (
  <>
    <Head>
      <title>{schedule.title}</title>
      <meta name="description" content={schedule.description} />
      <meta name="theme-color" content="#3d5f58" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={SCHEDULE_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={schedule.title} />
      <meta property="og:description" content={schedule.description} />
      <meta property="og:url" content={SCHEDULE_URL} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={schedule.title} />
      <meta name="twitter:description" content={schedule.description} />
      <meta name="twitter:image" content={meta.imageWide} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
    </Head>
    <Header standalone />
    <main id="main">
      <PageHero
        eyebrow={schedule.eyebrow}
        lead={schedule.heading.lead}
        accent={schedule.heading.accent}
      >
        <p>{schedule.intro}</p>
      </PageHero>
      <ScheduleDirectory />
      <ScheduleCallout />
    </main>
  </>
);

export default Schedule;
