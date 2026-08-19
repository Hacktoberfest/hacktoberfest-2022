import Head from 'next/head';

import FaqDirectory from 'components/FaqDirectory';
import Header from 'components/Header';
import PageHero from 'components/PageHero';
import { faq } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';

const QUESTIONS_URL = absoluteUrl('/questions/');

const Questions = () => (
  <>
    <Head>
      <title>{faq.page.title}</title>
      <meta name="description" content={faq.page.description} />
      <meta name="theme-color" content="#3d5f58" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={QUESTIONS_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={faq.page.title} />
      <meta property="og:description" content={faq.page.description} />
      <meta property="og:url" content={QUESTIONS_URL} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={faq.page.title} />
      <meta name="twitter:description" content={faq.page.description} />
      <meta name="twitter:image" content={meta.imageWide} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
    </Head>
    <Header standalone />
    <main id="main">
      <PageHero
        eyebrow={faq.page.eyebrow}
        lead={faq.page.heading.lead}
        accent={faq.page.heading.accent}
      >
        <p>{faq.page.intro}</p>
      </PageHero>
      <FaqDirectory />
    </main>
  </>
);

export default Questions;
