import Head from 'next/head';

import Header from 'components/Header';
import MissionSection from 'components/MissionSection';
import PageHero from 'components/PageHero';
import TimelineSection from 'components/TimelineSection';
import { missionPage } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';

const MISSION_URL = absoluteUrl('/mission/');

/* About Hacktoberfest: the story so far, then the mission it leads to.
   Both sections moved here from the homepage unchanged, anchors and all
   (#history, #mission), so llms.txt can point into them. */
const Mission = () => (
  <>
    <Head>
      <title>{missionPage.title}</title>
      <meta name="description" content={missionPage.description} />
      <meta name="theme-color" content="#3d5f58" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={MISSION_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={missionPage.title} />
      <meta property="og:description" content={missionPage.description} />
      <meta property="og:url" content={MISSION_URL} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={missionPage.title} />
      <meta name="twitter:description" content={missionPage.description} />
      <meta name="twitter:image" content={meta.imageWide} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
    </Head>
    <Header standalone />
    <main id="main">
      <PageHero
        eyebrow={missionPage.eyebrow}
        lead={missionPage.heading.lead}
        accent={missionPage.heading.accent}
      >
        <p>{missionPage.intro}</p>
      </PageHero>
      <TimelineSection />
      <MissionSection />
    </main>
  </>
);

export default Mission;
