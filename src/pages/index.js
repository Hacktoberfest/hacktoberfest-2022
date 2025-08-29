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
import globe from 'assets/img/globe.svg';
import opensourceIcon from 'assets/img/icons/opensource.svg';

import Image from 'next/image';
import Marquee from 'components/Marquee';
import { textBase, textLg, textSm } from 'themes/typography';
import Countdown from '../components/Countdown';
import { useEffect, useMemo, useRef, useState } from 'react';
import { registrationStart } from '../lib/config';
import ButtonMain from '../components/ButtonMain';
import Divider from '../components/Divider';
import SideBySide from '../components/SideBySide';
import Corners from '../components/Corners';
import heroAnimation from 'assets/img/heroicon-animation.gif';
import { events } from '../lib';
import { MarkdownInline } from '../components/markdown';

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
  max-width: 111px;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 8px rgba(194, 194, 255, 0.5));

  &:last-of-type {
    max-width: 44px;
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
    gap: 128px;
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

const StyledRegisterButtonContainer = styled.div`
  padding: 16px 0;
  text-align: center;
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

const StyledDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
  display: none;
  grid-column: full-start / full-end;
  width: 100%;

  ${mQ(bp.desktop)} {
    display: block;
  }
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  ${mQ(bp.desktop)} {
    gap: 32px;
  }
`;

const StyledEventGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-top: 32px;

  ${mQ(bp.desktop)} {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 56px;
  }
`;

const StyledEventCTA = styled.div`
  display: flex;
  margin-top: 32px;

  ${mQ(bp.desktop)} {
    justify-content: center;
    margin-top: 56px;
  }
`;

const StyledSpotlightContent = styled.span`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledSpotlightList = styled.span`
  display: flex;
  flex-direction: column;
  font-weight: 700;
`;

const StyledRelativeSection = styled(Section)`
  position: relative;
`;

const StyledFullSection = styled(Section)`
  overflow: hidden;
  position: relative;

  ${mQ(bp.desktop)} {
    grid-column: full;
  }
`;

const StyledContainer = styled(Container)`
  position: relative;
`;

const StyledPreptemberGlobeImage = styled(Image)`
  display: none;

  ${mQ(bp.desktop)} {
    display: block;
    left: ${({ $isVisible }) => ($isVisible ? '-25%' : '-100%')};
    opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition:
      left 2s ease-out,
      opacity 2s ease-out;
  }
`;

const StyledSponsorsGlobeImage = styled(Image)`
  display: none;

  ${mQ(bp.desktop)} {
    display: block;
    opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
    position: absolute;
    right: ${({ $isVisible }) => ($isVisible ? '-30%' : '-55%')};
    top: 13%;
    transition:
      right 1s ease-out,
      opacity 1s ease-out;
  }
`;

const StyledSectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledOpenSourceIcon = styled(Image)`
  display: none;

  ${mQ(bp.desktop)} {
    animation-name: ${({ $isVisible }) => $isVisible && bubbleUp};
    animation-duration: 2s;
    animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
    animation-fill-mode: backwards;
    display: block;
    opacity: 0;
    position: absolute;
    top: 105%;

    &:nth-of-type(1) {
      animation-delay: 0.1s;
      left: 10%;
    }

    &:nth-of-type(2) {
      animation-delay: 0.7s;
      left: 20%;
    }

    &:nth-of-type(3) {
      animation-delay: 0.3s;
      left: 60%;
    }

    &:nth-of-type(4) {
      animation-delay: 0.5s;
      left: 70%;
    }
  }
`;

const StyledCornersContainer = styled.div`
  display: none;

  ${mQ(bp.desktop)} {
    display: block;
  }
`;

const Home = () => {
  const hasRegistrationStarted = useMemo(
    () => new Date() >= new Date(registrationStart),
    [],
  );

  const preptemberRef = useRef(null);
  const [isPreptemberVisible, setIsPreptemberVisible] = useState(false);

  const sponsorsRef = useRef(null);
  const [isSponsorsVisible, setIsSponsorsVisible] = useState(false);

  const openSourceIconsRef = useRef(null);
  const [iconsVisible, setIconsVisible] = useState(false);

  useEffect(() => {
    const preptemberObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsPreptemberVisible(true);
          // Once visible, we can disconnect the observer
          preptemberObserver.disconnect();
        }
      },
      { threshold: 0.8 },
    );

    const sponsorsObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsSponsorsVisible(true);
          // Once visible, we can disconnect the observer
          sponsorsObserver.disconnect();
        }
      },
      { threshold: 1 },
    );

    const openSourceIconsObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIconsVisible(true);
          // Once visible, we can disconnect the observer
          openSourceIconsObserver.disconnect();
        }
      },
      { threshold: 1, rootMargin: '0px 0px -150px' },
    );

    if (preptemberRef.current) {
      preptemberObserver.observe(preptemberRef.current);
    }

    if (sponsorsRef.current) {
      sponsorsObserver.observe(sponsorsRef.current);
    }

    if (openSourceIconsRef.current) {
      openSourceIconsObserver.observe(openSourceIconsRef.current);
    }

    return () => {
      if (preptemberRef.current) {
        preptemberObserver.disconnect();
      }
      if (sponsorsRef.current) {
        sponsorsObserver.disconnect();
      }
      if (openSourceIconsRef.current) {
        openSourceIconsObserver.disconnect();
      }
    };
  }, []);

  return (
    <StyledHome>
      <Layout>
        <StyledHero>
          <StyledHeroImage />
          <Container inner>
            <StyledHeroContent>
              {hasRegistrationStarted && (
                <Image src={heroAnimation} alt="" width={186} height={93} />
              )}
              <ContentMaster
                align="center"
                title="A month-long celebration of all things open source"
                titleTag="h1"
                size="xl2"
              >
                {
                  'It’s that time of year again. Hacktoberfest is nearly upon us! \n\nPrepare your projects, brace yourself for action—registration opens September 15, 2025.'
                }
              </ContentMaster>

              {hasRegistrationStarted ? (
                <StyledRegisterButtonContainer>
                  <ButtonMain href="/register" passHref variant="primary">
                    REGISTER FOR HACKTOBERFEST
                  </ButtonMain>
                </StyledRegisterButtonContainer>
              ) : (
                <Countdown />
              )}

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
                <StyledPoweredByLogo
                  src={mlh}
                  alt="MLH"
                  width={44}
                  height={19}
                />
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
                <feGaussianBlur
                  in="SourceAlpha"
                  stdDeviation="5"
                  result="blur"
                />
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
            text1={'Hacktoberfest 2025'}
            text2={'Hacktoberfest 2025'}
            direction="forwards"
          />
          <Marquee
            text1={'Get ready to ship'}
            text2={'Support Open Source'}
            direction="reverse"
          />
        </Section>

        <Section>
          <Container>
            <StyledSponsorSections>
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
        <StyledDivider />

        <StyledRelativeSection ref={preptemberRef}>
          <Container>
            <StyledPreptemberGlobeImage
              src={globe}
              alt=""
              width="429"
              height="208"
              $isVisible={isPreptemberVisible}
            />
            <SideBySide title="Preptember">
              <StyledGrid>
                <CardCallout
                  body="September is prep time for Hacktoberfest. Spend September getting a jump start on your four pull/merge requests by tracking down projects to contribute to, adding the ‘hacktoberfest’ tag to your own projects, or familiarizing yourself with Git so you can hit the ground running when Hacktoberfest begins on October 1."
                  link={{
                    children: 'HOW TO PARTICIPATE',
                    href: '/participation',
                  }}
                />
                <CardCallout
                  body="Keep your connection to open source strong! Join other members of the open-source community in lively discussion on the Hacktoberfest Discord."
                  link={{
                    children: 'JOIN THE DISCORD',
                    target: '_blank',
                    href: 'https://discord.com/invite/hacktoberfest',
                  }}
                />
              </StyledGrid>
            </SideBySide>
          </Container>
        </StyledRelativeSection>

        <StyledRelativeSection ref={sponsorsRef}>
          <Container inner>
            <StyledSponsorsGlobeImage
              src={globe}
              alt=""
              width="351"
              height="170"
              $isVisible={isSponsorsVisible}
            />
            <StyledSectionTitle>
              <ContentMaster
                title="Sponsors and awards for 2025"
                size="lg"
                align="center"
              />
              <ContentMaster
                size="xl2"
                align="center"
                cta={{
                  children: 'LEARN MORE',
                  href: '/about#sponsors',
                }}
              >
                {
                  'This year, Hacktoberfest is sponsored by DigitalOcean and MLH. We thank them for their ongoing support of open source ❤️ \n\nWhen DigitalOcean started Hacktoberfest in 2014, 676 participants showed up to contribute. In 2024, nearly 90,000 people participated. To help ensure we can keep the Hacktoberfest party going for another decade, this year as well, you’ll get an evolving digital badge for participating.'
                }
              </ContentMaster>
            </StyledSectionTitle>
          </Container>
        </StyledRelativeSection>

        <StyledDivider />

        <Section>
          <Container>
            <Container inner>
              <StyledSectionTitle>
                <ContentMaster
                  title="Event spotlight"
                  size="lg"
                  align="center"
                />
                <ContentMaster size="xl2" align="center">
                  {
                    'Events that bring the community together to learn and explore are a cornerstone of Hacktoberfest. Save these dates and come connect with other lovers of open source!'
                  }
                </ContentMaster>
              </StyledSectionTitle>
            </Container>
            <StyledEventGrid>
              {events.map(
                ({
                  title,
                  content,
                  date,
                  time,
                  location,
                  rsvp,
                  details,
                  link,
                }) => (
                  <CardCallout
                    key={title}
                    title={title}
                    link={rsvp}
                    body={
                      <StyledSpotlightContent>
                        <span>
                          <MarkdownInline string={content} />
                        </span>
                        <StyledSpotlightList>
                          {details && <span>Details: {details}</span>}
                          {date && <span>Date: {date}</span>}
                          {time && <span>Time: {time}</span>}
                          {location && <span>Location: {location}</span>}
                          {link && <span>Link to register: {link}</span>}
                        </StyledSpotlightList>
                      </StyledSpotlightContent>
                    }
                  />
                ),
              )}
            </StyledEventGrid>
            <StyledEventCTA>
              <ButtonMain as="a" href="/events">
                See more
              </ButtonMain>
            </StyledEventCTA>
          </Container>
        </Section>

        <StyledDivider />

        <StyledFullSection ref={openSourceIconsRef}>
          <StyledContainer inner>
            <ContentMaster
              title="Support Open Source"
              size="lg"
              align="center"
              cta={{
                children: 'DONATE TO OPEN SOURCE PROJECTS',
                href: '/donate',
              }}
            >
              {
                'Open-source projects, maintained by community-minded coders, make the modern internet function. Supporting that essential work, and the folks behind it, is what Hacktoberfest is all about.\n\nDigitalOcean is proud to support open-source projects of all kinds. We offer credit grants to projects, assist with development, infrastructure, and testing, so open-source projects like yours can get a boost. [Learn more and apply now](https://www.digitalocean.com/open-source/credits-for-projects).\n\nYou have skills that can help keep these projects continue running—let’s get to it.'
              }
            </ContentMaster>

            <StyledCornersContainer>
              <Corners />
            </StyledCornersContainer>
          </StyledContainer>

          <StyledOpenSourceIcon
            src={opensourceIcon}
            alt=""
            width={144}
            height={131}
            $isVisible={iconsVisible}
          />
          <StyledOpenSourceIcon
            src={opensourceIcon}
            alt=""
            width={144}
            height={131}
            $isVisible={iconsVisible}
          />
          <StyledOpenSourceIcon
            src={opensourceIcon}
            alt=""
            width={144}
            height={131}
            $isVisible={iconsVisible}
          />
          <StyledOpenSourceIcon
            src={opensourceIcon}
            alt=""
            width={144}
            height={131}
            $isVisible={iconsVisible}
          />
        </StyledFullSection>

        <StyledDivider />
      </Layout>
    </StyledHome>
  );
};

export default Home;
