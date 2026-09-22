import Head from 'next/head';

import Header from 'components/Header';
import BookCallout from 'components/BookCallout';
import WorldLanding from 'components/WorldLanding';
import Hero from 'components/WorldLanding/Hero';
import { online } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';

const ONLINE_URL = absoluteUrl('/online/');

/* The online world's landing page: the case for attending online, with
   the mechanics left to /activities/ and /schedule/. The same shape as
   /in-person (components/WorldLanding), fed its own copy, with its own
   hero rather than PageHero: this is the marketing page, and it opens on
   the thing it is selling. It ends the way /schedule does, with the
   callout to the Fests, the one place it mentions them. */
const Online = () => (
  <>
    <Head>
      <title>{online.title}</title>
      <meta name="description" content={online.description} />
      <meta name="theme-color" content="#3d5f58" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={ONLINE_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={online.title} />
      <meta property="og:description" content={online.description} />
      <meta property="og:url" content={ONLINE_URL} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={online.title} />
      <meta name="twitter:description" content={online.description} />
      <meta name="twitter:image" content={meta.imageWide} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
    </Head>
    <Header standalone />
    <main id="main">
      <Hero world={online} />
      <WorldLanding world={online} />
      <BookCallout />
    </main>
  </>
);

export default Online;
