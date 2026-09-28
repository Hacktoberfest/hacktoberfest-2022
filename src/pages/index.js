import Head from 'next/head';

// Temporarily hidden sections — restore the imports and the commented
// lines in <main> below to bring them back:
// import CurriculumSection from 'components/CurriculumSection'; // "What you'll build"
// import WaysInSection from 'components/WaysInSection'; // "How to take part"
// import Rally from 'components/Rally'; // "The idea"
// import FestsSection from 'components/FestsSection'; // "The Fests"
// import EraSection from 'components/EraSection'; // "What changes in 2026"
// import GetInvolvedSection from 'components/GetInvolvedSection'; // "Help make it happen"
// import Hero from 'components/Hero'; // "AI belongs to everyone", the Preptember hero
import FaqSection from 'components/FaqSection';
import FestMapHero from 'components/FestMapHero';
import Header from 'components/Header';
import {
  HomeAboutBand,
  HomeOnlineBand,
  HomeStepsBand,
} from 'components/HomeBands';
import NearbyFests from 'components/NearbyFests';
import SponsorWallSection from 'components/SponsorWallSection';
import { meta } from 'data/meta';
import { homepageJsonLdScript } from 'data/structuredData';

const Home = () => (
  <>
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="theme-color" content="#3d5f58" />
      <link rel="canonical" href={meta.url} />
      {/* Default indexing, but lift the caps on how much search and answer
          engines may quote and how large a preview image they may show. */}
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.imageWide} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
      <link
        rel="alternate"
        type="text/plain"
        href="/llms.txt"
        title="Hacktoberfest 2026 for AI agents"
      />
      <link
        rel="alternate"
        type="text/plain"
        href="/llms-full.txt"
        title="Complete Hacktoberfest 2026 context"
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: homepageJsonLdScript }}
      />
    </Head>
    <Header />
    <main id="main">
      {/* October: every Fest on the map, what Hacktoberfest is, the
          soonest Fests, the way in for anyone with none nearby, and how
          the sticker book works. */}
      <FestMapHero />
      <HomeAboutBand />
      {/* The Fests pinned to the homepage in FestNet lead the six here,
          unlabelled. */}
      <NearbyFests homepagePins />
      <HomeOnlineBand />
      <HomeStepsBand />
      {/* <Rally /> */}
      {/* <EraSection /> */}
      {/* <FestsSection /> */}
      {/* <WaysInSection /> */}
      {/* <CurriculumSection /> */}
      {/* The story so far and the mission live on /mission/ now. */}
      <SponsorWallSection />
      {/* <GetInvolvedSection /> */}
      <FaqSection />
    </main>
  </>
);

export default Home;
