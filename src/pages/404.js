import Head from 'next/head';
import styled from 'styled-components';

import HeroSecondary from 'components/HeroSecondary';
import PixelHops from 'components/pixels/PixelHops';

const FourOFour = () => {
  return (
    <>
      <Head>
        <title>404 | Hacktoberfest 2022</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Report | Hacktoberfest 2022"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Report | Hacktoberfest 2022"
        />
      </Head>

      <HeroSecondary
        title="UH OH... THIS PAGE DOESN'T EXIST"
        cta={{
          size: 'lg',
          href: '/',
          children: 'Return Home',
        }}
        icon={
          <PixelHops
            width="1360"
            scale="1"
            timing="5"
            frames="4"
          />
        }
      />
    </>
  );
};

export default FourOFour;
