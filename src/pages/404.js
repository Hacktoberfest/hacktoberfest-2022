import Head from 'next/head';

import HeroSecondary from 'components/HeroSecondary';
import ascii404 from 'assets/img/ascii-404.svg';
import createMetaTitle from 'lib/createMetaTitle';

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

      <HeroSecondary
        title="UH OH... THIS PAGE DOESN'T EXIST"
        cta={{
          size: 'lg',
          href: '/',
          children: 'Return Home',
          variant: 'primary-green',
        }}
        icon={<img src={ascii404.src} alt="" />}
        reverse
        includeDivider={false}
      />
    </>
  );
};

export default FourOFour;
