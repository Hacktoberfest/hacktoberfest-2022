import Head from 'next/head';

import Header from 'components/Header';
import NearbyFests from 'components/NearbyFests';
import OnlineCallout from 'components/OnlineCallout';
import WorldLanding from 'components/WorldLanding';
import Hero from 'components/WorldLanding/Hero';
import { inPerson } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';

const IN_PERSON_URL = absoluteUrl('/in-person/');

/* The in-person world's landing page: the case for a day in a room, with
   the mechanics left to /fests/ and /host/. The same shape as /online
   (components/WorldLanding), fed its own copy, with the soonest Fests
   after the steps: a day in a room is the argument, and the hero's prints
   and the directory make it. It
   ends on the fork for the reader with no Fest nearby: attend online, or
   host one. */
const InPerson = () => (
  <>
    <Head>
      <title>{inPerson.title}</title>
      <meta name="description" content={inPerson.description} />
      <meta name="theme-color" content="#3d5f58" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={IN_PERSON_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={inPerson.title} />
      <meta property="og:description" content={inPerson.description} />
      <meta property="og:url" content={IN_PERSON_URL} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={inPerson.title} />
      <meta name="twitter:description" content={inPerson.description} />
      <meta name="twitter:image" content={meta.imageWide} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
    </Head>
    <Header standalone />
    <main id="main">
      <Hero world={inPerson} />
      <WorldLanding world={inPerson} afterEarn={<NearbyFests />} />
      <OnlineCallout />
    </main>
  </>
);

export default InPerson;
