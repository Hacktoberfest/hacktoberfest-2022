import Head from 'next/head';

import Button from 'components/Button';
import Header from 'components/Header';
import PageHero from 'components/PageHero';
import SponsorSection from 'components/SponsorSection';
import { InfoButton } from 'components/SponsorSection/SponsorSection.styles';
import { sponsor } from 'data/content.mjs';
import { SPONSOR_SETUP_HERO_URL } from 'data/links';
import { meta, absoluteUrl } from 'data/meta';
import { SPONSOR_HERO_FORM } from 'data/typeforms.mjs';

const SPONSOR_URL = absoluteUrl('/sponsor/');

const Sponsor = () => (
  <>
    <Head>
      <title>{sponsor.title}</title>
      <meta name="description" content={sponsor.description} />
      <meta name="theme-color" content="#3d5f58" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={SPONSOR_URL} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={sponsor.title} />
      <meta property="og:description" content={sponsor.description} />
      <meta property="og:url" content={SPONSOR_URL} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={sponsor.title} />
      <meta name="twitter:description" content={sponsor.description} />
      <meta name="twitter:image" content={meta.imageWide} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
    </Head>
    <Header standalone />
    <main id="main">
      <PageHero
        eyebrow={sponsor.eyebrow}
        lead={sponsor.heading.lead}
        accent={sponsor.heading.accent}
        actions={
          <>
            <Button
              href={SPONSOR_SETUP_HERO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sponsor.setupCta}
            </Button>
            <InfoButton form={SPONSOR_HERO_FORM} $variant="secondary">
              {sponsor.infoCta}
            </InfoButton>
          </>
        }
      >
        <p>{sponsor.intro}</p>
      </PageHero>
      <SponsorSection />
    </main>
  </>
);

export default Sponsor;
