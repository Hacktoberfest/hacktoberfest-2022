import Head from 'next/head';

import HeroSecondary from 'components/HeroSecondary';
import ascii404 from 'assets/img/ascii-404.svg';
import createMetaTitle from 'lib/createMetaTitle';
import Layout from 'components/Layout';
import RevealSection from 'components/RevealSection';
import ContentMaster from 'components/ContentMaster';
import Section from 'components/Section';

const FourOFour = () => {
  return (
    <>
      <Head>
        <title>{createMetaTitle('404')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('404')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('404')}
        />
      </Head>

      <Layout>
        <Section>
          <ContentMaster
            titleTag="h1"
            title="UH OH... THIS PAGE DOESN'T EXIST"
            cta={{
              href: '/',
              children: 'Return Home',
            }}
          />
        </Section>
      </Layout>
    </>
  );
};

export default FourOFour;
