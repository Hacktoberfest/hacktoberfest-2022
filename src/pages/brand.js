import Head from 'next/head';

import BrandKit from 'components/BrandKit';
import Header from 'components/Header';
import PageHero from 'components/PageHero';
import { brand } from 'data/content.mjs';
import { absoluteUrl, meta } from 'data/meta';

const BRAND_URL = absoluteUrl('/brand/');

const Brand = () => (
  <>
    <Head>
      <title>{brand.title}</title>
      <meta name="description" content={brand.description} />
      <meta name="theme-color" content="#3d5f58" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={BRAND_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={brand.title} />
      <meta property="og:description" content={brand.description} />
      <meta property="og:url" content={BRAND_URL} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={brand.title} />
      <meta name="twitter:description" content={brand.description} />
      <meta name="twitter:image" content={meta.imageWide} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
    </Head>
    <Header standalone />
    <main id="main">
      <PageHero
        eyebrow={brand.eyebrow}
        lead={brand.heading.lead}
        accent={brand.heading.accent}
      >
        <p>{brand.intro}</p>
      </PageHero>
      <BrandKit />
    </main>
  </>
);

export default Brand;
