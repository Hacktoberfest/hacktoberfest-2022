import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';

import Button from 'components/button';
import HeroSecondary from 'components/HeroSecondary';
import PixelLogo from 'components/pixels/PixelLogo';

const StyledSection = styled.section`
  width: 100%;
  padding: 160px 64px 0;

  div {
    max-width: 1312px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    a {
      margin: 40px auto 0;
    }

    h1 {
      font-size: 80px;
      line-height: 100%;
      text-align: center;
    }
  }
`;

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
          <PixelLogo
            width="1360"
            scale="1"
            timing="5"
            frames="4"
            id="f3"
          />
        }
      />
    </>
  );
};

export default FourOFour;
