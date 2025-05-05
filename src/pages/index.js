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

import iconFile from 'assets/img/icons/icon-pixel-file.svg';
import iconQuestion from 'assets/img/icons/icon-pixel-question.svg';
import logoDigitalOcean from 'assets/img/logo-digitalocean.svg';
import bgHero from 'assets/img/bg-header.svg';

import Image from 'next/image';
import Link from 'next/link';
import Marquee from 'components/Marquee';
import RevealSection from 'components/RevealSection';
import { textLg, textXl } from 'themes/typography';
import SponsorForm from 'components/SponsorForm';
import sponsorshipProspectus from 'assets/hacktoberfest2025-sponsorship_prospectus.pdf';

const parallaxScroll = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-250px); }
`;

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

export const StyledHome = styled.div`
  position: relative;
  isolation: isolate;
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
  background-size: 1786px 865px;

  view-timeline-name: --scrollTimeline;
  view-timeline-axis: block;

  animation-name: ${parallaxScroll};
  animation-timeline: --scrollTimeline;
  animation-range: entry 100% exit 100%;
  animation-fill-mode: both;
`;

export const StyledPoweredBy = styled.div`
  ${textXl};
  align-items: center;
  color: ${({ theme }) => theme.colors2025.space.white};
  display: flex;
  gap: 16px;
  flex-direction: column;
  font-weight: 700;
  justify-content: center;
  margin-top: 40px;
  text-shadow: 0 0 8px rgba(194, 194, 255, 0.5);

  ${mQ(bp.tablet)} {
    flex-direction: row;
  }

  img {
    max-width: 240px;
    width: 100%;
    height: auto;
    filter: drop-shadow(0 0 8px rgba(194, 194, 255, 0.5));
  }
`;

export const StyledColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  ${mQ(bp.tablet)} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StyledSponsorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;

  > div > div:first-child {
    text-align: left;

    ${mQ(bp.tablet)} {
      text-align: center;
    }
  }
`;

export const StyledList = styled.ul`
  > li {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
    padding-bottom: 32px;
    border-bottom: 1px solid ${({ theme }) => theme.colors2025.eastBay};

    ${mQ(bp.tablet)} {
      gap: 24px;
      grid-template-columns: 1fr minmax(640px, 1fr);
      padding-bottom: 24px;
    }

    &:not(:first-child) {
      padding: 32px 0;

      ${mQ(bp.tablet)} {
        padding: 24px 0;
      }
    }

    &:last-child {
      border: 0;
      padding-bottom: 0;
    }
  }

  h3 {
    ${textLg};
    font-weight: 700;
    color: ${({ theme }) => theme.colors2025.space.white};
  }
`;

const Home = () => {
  return (
    <StyledHome>
      <Layout>
        <StyledHero>
          <StyledHeroImage />
          <Container inner>
            <video
              autoPlay
              muted
              loop
              playsInline
              width={180}
              height={90}
              poster="/logo-hacktoberfest-12--hero.png"
            >
              <source
                src="/logo-hacktoberfest-12--hero.mov"
                type='video/mp4; codecs="hvc1"'
              />
              <source
                src="/logo-hacktoberfest-12--hero.webm"
                type="video/webm"
              />
              Your browser does not support the video tag.
            </video>
            <ContentMaster
              align="center"
              title="In a few short months… Hacktoberfest returns!"
              titleTag="h1"
              size="xl2"
            >
              {
                'Hacktoberfest is one of the biggest global celebrations of open-source software online, bringing together hundreds of thousands of open-source-loving developers across the world to contribute, connect, and collaborate.\n\nLast year saw nearly 100,000 participants from 150+ countries, and thousands of repositories energized with meaningful—and useful—contributions from users all over the world.'
              }
            </ContentMaster>

            <StyledPoweredBy>
              Powered by{' '}
              <Image
                src={logoDigitalOcean}
                alt="DigitalOcean"
                width="161"
                height="29"
              />
            </StyledPoweredBy>
          </Container>
        </StyledHero>

        <Section isFullWidth size="md">
          <Marquee
            text1={'Hacktoberfest 2025'}
            text2={'Hacktoberfest 2025'}
            direction="reverse"
          />
          <Marquee
            text1={'Get ready to ship'}
            text2={'Support Open Source'}
            direction="forwards"
          />
        </Section>

        <Section>
          <StyledSponsorSection>
            <Container inner>
              <ContentMaster
                align="center"
                title="Be a key part of Hacktoberfest 2025—become a sponsor"
                size="lg"
              >
                Hacktoberfest couldn’t exist without support from incredible
                sponsors who love open source. Becoming a Hacktoberfest sponsor
                comes with a lot of benefits:
              </ContentMaster>
            </Container>

            <Container>
              <StyledList>
                <li>
                  <h3>Reach highly engaged developers</h3>
                  <p>
                    Showcase your brand across our global platform, Discord,
                    GitHub/GitLab integrations, and the websites of thousands of
                    open-source projects.
                  </p>
                </li>

                <li>
                  <h3>Build developer goodwill</h3>
                  <p>
                    Hacktoberfest is about giving back. By sponsoring, you align
                    your brand with a global movement focused on education,
                    inclusion, and innovation.
                  </p>
                </li>

                <li>
                  <h3>Drive product awareness</h3>
                  <p>
                    Sponsors are invited to host events, promote tools, and
                    offer perks, all while engaging directly with their core
                    developer audience.
                  </p>
                </li>

                <li>
                  <h3>Targeted impact</h3>
                  <p>
                    The benefits of reaching a dedicated, engaged developer
                    audience speak for themselves—and we’re offering tiered
                    sponsorships that help you get the most bang for your buck.
                    Plus, this year, get a chance to demo your product in front
                    of excited devs in one of our community events.
                  </p>
                </li>
              </StyledList>
            </Container>
          </StyledSponsorSection>
        </Section>

        <RevealSection>
          Let’s build the future of open source, together. Whether you’re
          launching a developer tool, hiring open-source contributors, or
          scaling a community, Hacktoberfest gives you a trusted platform to do
          it in a way that gets users excited.
        </RevealSection>

        <Section>
          <StyledColumns>
            <ContentMaster
              title="Interested in sponsoring Hacktoberfest?"
              size="lg"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu
              dui justo. Vivamus ultrices vulputate placerat. Suspendisse
              consectetur tempor augue eget lacinia. Donec finibus in sem
              commodo dapibus. Nam a augue sed ex ullamcorper vestibulum vitae a
              lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Cras eu dui justo.
            </ContentMaster>

            <SponsorForm />
          </StyledColumns>
        </Section>

        <Section>
          <StyledColumns>
            <CardCallout
              icon={<Image src={iconFile} alt="" />}
              title="Download the 2025 Sponsor Prospectus"
              body="Get all the details on packages, audience insights, and opportunities."
              link={{
                href: sponsorshipProspectus,
                children: 'Download',
                download: true,
              }}
            />
            <CardCallout
              icon={<Image src={iconQuestion} alt="" />}
              title="Have additional questions?"
              body={
                <>
                  We’re happy to answer any additional questions you may have
                  regarding Hacktoberfest sponsorships! Please email us at{' '}
                  <Link href="mailto:hacktoberfest@digitalocean.com">
                    hacktoberfest@digitalocean.com
                  </Link>
                  .
                </>
              }
              link={{
                href: 'mailto:hacktoberfest@digitalocean.com',
                children: 'Email us',
              }}
            />
          </StyledColumns>
        </Section>
      </Layout>
    </StyledHome>
  );
};

export default Home;
