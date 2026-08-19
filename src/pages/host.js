import Head from 'next/head';

import Button from 'components/Button';
import Header from 'components/Header';
import HostSection from 'components/HostSection';
import PageHero from 'components/PageHero';
import { host } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';

const HOST_URL = absoluteUrl('/host/');

const Host = () => (
  <>
    <Head>
      <title>{host.title}</title>
      <meta name="description" content={host.description} />
      <meta name="theme-color" content="#3d5f58" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={HOST_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={host.title} />
      <meta property="og:description" content={host.description} />
      <meta property="og:url" content={HOST_URL} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={host.title} />
      <meta name="twitter:description" content={host.description} />
      <meta name="twitter:image" content={meta.imageWide} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
    </Head>
    <Header standalone />
    <main id="main">
      <PageHero
        eyebrow={host.eyebrow}
        lead={host.heading.lead}
        accent={host.heading.accent}
        actions={<Button href="/my/">{host.apply.cta}</Button>}
      >
        <p>{host.intro}</p>
      </PageHero>
      <HostSection />
    </main>
  </>
);

export default Host;
