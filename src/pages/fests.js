import Head from 'next/head';

import FestsDirectory from 'components/FestsDirectory';
import Header from 'components/Header';
import HostCallout from 'components/HostCallout';
import PageHero from 'components/PageHero';
import { fests } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';

const FESTS_URL = absoluteUrl('/fests/');

const Fests = () => (
  <>
    <Head>
      <title>{fests.title}</title>
      <meta name="description" content={fests.description} />
      <meta name="theme-color" content="#3d5f58" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={FESTS_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={fests.title} />
      <meta property="og:description" content={fests.description} />
      <meta property="og:url" content={FESTS_URL} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fests.title} />
      <meta name="twitter:description" content={fests.description} />
      <meta name="twitter:image" content={meta.imageWide} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
    </Head>
    <Header standalone />
    <main id="main">
      <PageHero
        eyebrow={fests.eyebrow}
        lead={fests.heading.lead}
        accent={fests.heading.accent}
      >
        <p>{fests.intro}</p>
      </PageHero>
      <FestsDirectory />
      <HostCallout />
    </main>
  </>
);

export default Fests;
