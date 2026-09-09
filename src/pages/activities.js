import Head from 'next/head';

import Header from 'components/Header';
import PageHero from 'components/PageHero';
import { activitiesPage } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';

const ACTIVITIES_URL = absoluteUrl('/activities/');

/* The hero only, for now: the page exists so the nav can point at it and
   the sitemap can list it. The bands under it arrive with the progress
   seam. */
const Activities = () => (
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
    </main>
  </>
);

export default Activities;
