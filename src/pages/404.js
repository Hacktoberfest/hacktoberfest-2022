import Head from 'next/head';

import createMetaTitle from 'lib/createMetaTitle';
import ContentMaster from 'components/ContentMaster';
import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from '../themes/breakpoints';
import bgHero from '../assets/img/bg-header.svg';
import ButtonMain from '../components/ButtonMain';
import Divider from '../components/Divider';

import globe from '../assets/img/globe.svg';
import Image from 'next/image';

const bounce = keyframes`
  0%   { top: 0; left: 25%; }
  16%  { top: 50%; left: 0; }
  32%  { top: 100%; left: 25%; transform: translateY(-100%); }
  52%  { top: 0; left: 75%; transform: translateY(0); }
  60% { top: 25%; left: 100%; transform: translateX(-100%); }
  80% { top: 100%; left: 75%; transform: translate(0, -100%); }
  100% { top: 0; left: 25%; }
`;

const StyledHero = styled.div`
  overflow: hidden;
  padding: 120px 24px 64px;
  position: relative;
  ${mQ(bp.desktop)} {
    padding: 264px 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(
        85.48% 85.48% at 50% 0%,
        ${({ theme }) => theme.colors2025.eastBay} 0%,
        rgb(from ${({ theme }) => theme.colors2025.void} r g b / 0) 100%
      ),
      url(${bgHero.src}) top center / cover no-repeat;
  }
`;

const StyledHeroContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 2;

  ${mQ(bp.desktop)} {
    gap: 40px;
    margin: 0 auto;
    max-width: 640px;
  }
`;

const StyledGlobeImage = styled(Image)`
  animation: ${bounce} 10s linear infinite;
  display: block;
  position: absolute;
  width: 200px;
  height: 97px;
  z-index: 1;
`;

const StyledDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
`;

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

      <StyledHero
        title="Uh oh...This page doesn’t exist"
        cta={{
          children: 'Return home',
          href: '/',
        }}
      >
        <StyledHeroContainer>
          <ContentMaster
            size="xl2"
            align="center"
            title="Uh oh...This page doesn’t exist"
          />
          <ButtonMain href="/">Return home</ButtonMain>
        </StyledHeroContainer>

        <StyledGlobeImage src={globe} alt="" />
      </StyledHero>
      <StyledDivider />
    </>
  );
};

export default FourOFour;
