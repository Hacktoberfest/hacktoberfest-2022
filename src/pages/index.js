import styled, { keyframes } from 'styled-components';

import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import Section from 'components/Section';
import Layout from 'components/Layout';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import CardCallout from 'components/CardCallout';

import iconPlay from 'assets/img/icons/play.svg';
import logoDigitalOcean from 'assets/img/logo-digitalocean.svg';
import bgHero from 'assets/img/bg-header.svg';
import amd from 'assets/img/sponsors/amd.svg';
import cloudNative from 'assets/img/partners/cloud-native.svg';
import dev from 'assets/img/partners/dev.svg';
import github from 'assets/img/partners/github.svg';
import githubEducation from 'assets/img/partners/github_education.svg';
import gitlab from 'assets/img/partners/gitlab.svg';
import holopin from 'assets/img/partners/holopin.svg';
import mlh from 'assets/img/partners/mlh.svg';
import opensource from 'assets/img/partners/opensource.svg';
import auth0 from 'assets/img/sponsors/auth0.svg';

import Image from 'next/image';
import Marquee from 'components/Marquee';
import { textLg, textSm } from 'themes/typography';
import Divider from '../components/Divider';
import heroAnimation from 'assets/img/heroicon-animation.gif';

const blinkExpand = keyframes`
  0% { --shadowAlpha: 0.5; }
  2.5% { --shadowAlpha: 0.5; }
  5% { --shadowAlpha: 0.5; }
  7.5% { --shadowAlpha: 0; }
  10% { --shadowAlpha: 0; }
  12.5% { --shadowAlpha: 0; }
  15% { --shadowAlpha: 0.5; }
  17.5% { --shadowAlpha: 0.5; }
  20% { --shadowAlpha: 0; }
  22.5% { --shadowAlpha: 0; }
  25% { --shadowAlpha: 1; }
  27.5% { --shadowAlpha: 1; }
  30% { --shadowAlpha: 1; }
  32.5% { --shadowAlpha: 0; }
  35% { --shadowAlpha: 0.5; }
  37.5% { --shadowAlpha: 0; }
  40% { --shadowAlpha: 0.5; }
  42.5% { --shadowAlpha: 0; }
  45% { --shadowAlpha: 0.5; }
  47.5% { --shadowAlpha: 0; }
  75% { --shadowAlpha: 0.5; }
  100% { --shadowAlpha: 0.5; }
`;

const bubbleUp = keyframes`
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  90% {
    opacity: 0;
  }
  100% {
    transform: translateY(-650px);
  }
`;

export const StyledHome = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
`;

export const StyledHero = styled.div`
  position: relative;
  padding: 120px 0 64px 0;
  display: grid;
  grid-column: full;
  grid-template-columns: subgrid;

  ${mQ(bp.desktop)} {
    padding: 180px 0 128px 0;
  }

  > * {
    grid-column: main-start / main-end;
  }

  &::before {
    background: ${({ theme }) =>
      `radial-gradient(134.04% 67.32% at 50% 0%, ${theme.colors2025.eastBay} 0%, rgb(from ${theme.colors2025.void} r g b / 0) 100%)`};
    top: 0;
    content: '';
    height: 100%;
    grid-column: full;
    left: 0;
    position: absolute;
    width: 100%;
    z-index: -1;

    ${mQ(bp.tablet)} {
      background: ${({ theme }) =>
        `radial-gradient(85.48% 85.48% at 50% 0%, ${theme.colors2025.eastBay} 0%, rgb(from ${theme.colors2025.void} r g b / 0) 100%)`};
    }
  }

  video {
    max-width: 180px;
    height: auto;
    display: block;
    margin: 0 auto 32px;
  }

  h1 {
    --shadowAlpha: 0.5;
    animation: ${blinkExpand} 1333ms ease-in-out forwards;
    text-shadow: 0px 0px 10px
      rgb(
        from ${({ theme }) => theme.colors2025.space.dust} r g b /
          var(--shadowAlpha)
      );
  }
`;

export const StyledHeroImage = styled.div`
  grid-column: full;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${bgHero.src});
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
`;

export const StyledPoweredBy = styled.div`
  ${textSm};
  align-items: center;
  color: ${({ theme }) => theme.colors2025.space.white};
  display: flex;
  gap: 8px;
  flex-direction: row;
  font-weight: 700;
  justify-content: center;
  margin-top: 24px;
  text-shadow: 0 0 8px rgba(194, 194, 255, 0.5);
  width: 100%;

  ${mQ(bp.desktop)} {
    ${textLg};
    font-weight: 700;
  }
`;

export const StyledPoweredByLogo = styled(Image)`
  max-width: 135px;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 8px rgba(194, 194, 255, 0.5));

  &:last-of-type {
    max-width: 54px;
  }

  ${mQ(bp.desktop)} {
    max-width: 202px;

    &:last-of-type {
      max-width: 87px;
    }
  }
`;

export const StyledSponsorSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;

  ${mQ(bp.desktop)} {
    gap: 64px;
  }
`;

export const StyledSponsorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  div {
    justify-content: center;
  }

  ${mQ(bp.tablet)} {
    gap: 56px;
  }
`;

export const StyledSponsorLogos = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 38px;
  justify-content: center;
  width: 100%;

  ${mQ(bp.desktop)} {
    gap: 59px;
  }
`;

const StyledLogoContainer = styled.div`
  align-content: flex-end;
  object-fit: contain;
  width: 100%;

  img {
    width: 100%;
    height: 100%;
  }

  &:first-of-type {
    height: 46px;
    width: 123px;

    ${mQ(bp.desktop)} {
      height: 72px;
      width: 190px;
    }
  }

  &:last-of-type {
    height: 42px;
    width: 116px;

    ${mQ(bp.desktop)} {
      height: 43px;
      width: 180px;
    }
  }
`;

const StyledHeroContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 40px;

  ${mQ(bp.tablet)} {
    gap: 32px;
  }

  p {
    margin-bottom: 0;
  }

  > div {
    text-align: center;

    p {
      display: inline;

      ${mQ(bp.desktop)} {
        display: block;
      }
    }
  }
`;

const StyledPartnerContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
  width: 295px;

  ${mQ(bp.desktop)} {
    gap: 18px;
    width: 640px;
  }
`;

const StyledPartnerLogos = styled.div`
  align-items: center;
  display: flex;
  gap: 16px;
  max-width: 100%;

  ${mQ(bp.desktop)} {
    gap: 40px;
  }

  img {
    width: 100%;
    height: 100%;
  }

  &:first-of-type {
    :first-child {
      height: 29px;
      width: 79px;

      ${mQ(bp.desktop)} {
        height: 49px;
        width: 134px;
      }
    }

    :nth-child(2) {
      height: 20px;
      width: 101px;

      ${mQ(bp.desktop)} {
        height: 33px;
        width: 172px;
      }
    }

    :last-child {
      height: 17px;
      width: 80px;

      ${mQ(bp.desktop)} {
        height: 30px;
        width: 136px;
      }
    }
  }

  &:last-of-type {
    :first-child {
      height: 13px;
      width: 84px;

      ${mQ(bp.desktop)} {
        height: 23px;
        width: 143px;
      }
    }

    :nth-child(2) {
      height: 42px;
      width: 32px;

      ${mQ(bp.desktop)} {
        height: 71px;
        width: 55px;
      }
    }

    :nth-child(3) {
      height: 31px;
      width: 31px;

      ${mQ(bp.desktop)} {
        height: 53px;
        width: 53px;
      }
    }

    :last-child {
      height: 16px;
      width: 63px;

      ${mQ(bp.desktop)} {
        height: 26px;
        width: 106px;
      }
    }
  }
`;

const StyledCardCallout = styled(CardCallout)`
  margin: 0 auto;
  max-width: 928px;
`;

const StyledDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
  grid-column: full-start / full-end;
  width: 100%;
`;

const StyledSmallDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
  margin: 0 auto;
  width: 200px;

  ${mQ(bp.desktop)} {
    width: 416px;
  }
`;

const Home = () => (
  <StyledHome>
    <Layout>
      <StyledHero>
        <StyledHeroImage />
        <Container inner>
          <StyledHeroContent>
            <Image src={heroAnimation} alt="" width={186} height={93} />
            <ContentMaster
              align="center"
              title="Hacktoberfest 2025 has now ended"
              titleTag="h1"
              size="xl2"
            >
              {
                'Thank you for contributing to open source this month. Open source couldn’t survive without the dynamic duo of project maintainers and volunteers like you. Hacktoberfest #12 has officially ended. \n\n&nbsp;\n\nBut don’t let that stop you from contributing to open source all year long. We look forward to seeing you next year! Be sure to [sign up for updates](https://www.digitalocean.com/open-source/hacktoberfest#open-source-stay-up-to-date) to get the latest announcements about future Hacktoberfest events.'
              }
            </ContentMaster>

            <StyledPoweredBy>
              <Image src={iconPlay} alt="" width={12} height={12} />
              Powered by
              <StyledPoweredByLogo
                src={logoDigitalOcean}
                alt="DigitalOcean"
                width={161}
                height={29}
              />
              and
              <StyledPoweredByLogo src={mlh} alt="MLH" width={44} height={19} />
            </StyledPoweredBy>
          </StyledHeroContent>
        </Container>
      </StyledHero>

      <Section isFullWidth size="md">
        {/*  This svg is used to create a shadow effect on the text. */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter
              id="outerShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
              <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
              <feComposite
                in="offsetBlur"
                in2="SourceAlpha"
                operator="out"
                result="shadowOuter"
              />
              <feColorMatrix
                in="shadowOuter"
                type="matrix"
                values="0 0 0 0 0.7607
              0 0 0 0 0.7607
              0 0 0 0 1
              0 0 0 0.15 0"
                result="shadow"
              />
              <feMerge>
                <feMergeNode in="shadow" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        <Marquee
          text1={'Thank you'}
          text2={'See you next year'}
          direction="forwards"
        />
        <Marquee
          text1={'Thank you'}
          text2={'See you next year'}
          direction="reverse"
        />
      </Section>

      <StyledDivider />

      <Section>
        <Container>
          <StyledCardCallout>
            <ContentMaster
              align="center"
              title="Stay Connected"
              size="lg"
              titleAs="h3"
              links={[
                {
                  href: 'https://discord.com/invite/digitalocean',
                  target: '_blank',
                  children: 'Join the discord',
                },
              ]}
            >
              Keep your connection to open source strong! Join other members of
              the open-source community in lively discussion on the
              Hacktoberfest Discord.
            </ContentMaster>
          </StyledCardCallout>
        </Container>
      </Section>

      <StyledDivider />

      <Section>
        <Container inner>
          <StyledSponsorSections>
            <ContentMaster
              align="center"
              title="Thank you to all our Sponsors and Community Partners"
              size="lg"
              titleAs="h3"
            >
              A special thank you to the great folks at DigitalOcean, MLH, Auth0
              and AMD for their sponsorship of Hacktoberfest. Thank you to ALL
              our Sponsors and Community Partners, we ❤️ you!
            </ContentMaster>

            <StyledSmallDivider type="solid" />

            <StyledSponsorSection>
              <ContentMaster
                align="center"
                title="Sponsors"
                size="lg"
                titleAs="h3"
              />
              <StyledSponsorLogos>
                <StyledLogoContainer>
                  <Image src={auth0} alt="Auth0" />
                </StyledLogoContainer>
                <StyledLogoContainer>
                  <Image src={amd} alt="AMD" />
                </StyledLogoContainer>
              </StyledSponsorLogos>
            </StyledSponsorSection>
            <StyledSponsorSection>
              <ContentMaster
                align="center"
                title="Community Partners"
                size="lg"
                titleAs="h3"
              />
              <StyledPartnerContainer>
                <StyledPartnerLogos>
                  <Image src={github} alt="Github" />
                  <Image src={githubEducation} alt="Github Education" />
                  <Image src={gitlab} alt="GitLab" />
                </StyledPartnerLogos>
                <StyledPartnerLogos>
                  <Image
                    src={cloudNative}
                    alt="Cloud Native Computing Foundation"
                  />
                  <Image src={opensource} alt="Open Source Initiative" />
                  <Image src={dev} alt="DEV" />
                  <Image src={holopin} alt="Holopin" />
                </StyledPartnerLogos>
              </StyledPartnerContainer>
            </StyledSponsorSection>
          </StyledSponsorSections>
        </Container>
      </Section>
    </Layout>
  </StyledHome>
);

export default Home;
