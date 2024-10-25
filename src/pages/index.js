import { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';

import { events } from 'lib';
import {
  registrationEnd,
  registrationStart,
  trackingEnd,
  trackingEndExtended,
} from 'lib/config';
import { asList } from 'lib/format';
import { partners, sponsors } from 'lib/sponsors';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import Hero from 'components/Hero';
import ContentSide from 'components/ContentSide';
import Divider from 'components/Divider';
import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import HomeIntro from 'components/HomeIntro';
import Section from 'components/Section';
import Events from 'components/Events';
import Sponsors from 'components/Sponsors';
import asciiShare from 'assets/img/ascii-share--black.svg';

import Progress from 'components/Progress';
import CardCallout from 'components/CardCallout';
import SectionDivider from 'components/SectionDivider';
import asciiParticipation from 'assets/img/ascii-participation.svg';
import Glitch from 'components/Glitch';
import { trackingStartDate } from 'lib/participation';
import Link from 'next/link';
import SpotHeader from 'components/SpotHeader';
import { StyledSectionSpacing } from 'styles/sharedStyles';
import HeroSecondary from 'components/HeroSecondary';

export const StyledHome = styled.div`
  overflow: hidden;
  position: relative;
  isolation: isolate;
`;

export const StyledHomeBg = styled.div`
  position: absolute;
  z-index: -1;

  top: -35vw;
  left: -100%;
  width: 300%;

  mask-image: radial-gradient(circle at 50% 0%, #000, transparent 100%);
  mask-size: 100% 100%;

  ${mQ(bp.desktop)} {
    left: ${({ $offset }) => ($offset ? '0%' : '-25%')};
    width: 150%;

    mask-image: ${({ $offset }) =>
      $offset
        ? 'radial-gradient(circle at 100% 0%, #000, transparent 80%)'
        : 'radial-gradient(circle at 50% 50%, #000, transparent 40%)'};
  }
`;

export const StyledHomeDivider = styled.div`
  line-height: 0;
  color: ${({ theme }) => theme.colors.green};
  background-color: ${({ theme }) => theme.colors.black};

  svg {
    transform: translateY(1px) translateX(calc((259 / 375) * -100vw));
    width: calc((800 / 375) * 100%);
    height: auto;

    ${mQ(bp.tablet)} {
      width: 100%;
      transform: translateY(1px);
    }
  }
`;

export const StyledThanksCallout = styled.div`
  margin: 0 0 24px;
`;

export const StyledHomeEvents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;

export const StyledSponsorImage = styled.img`
  order: -1;
  width: 100%;

  ${mQ(bp.desktop)} {
    order: unset;
  }
`;

const Home = () => {
  const theme = useTheme();

  const hasRegistrationEnded = useMemo(
    () => new Date() >= new Date(registrationEnd),
    [],
  );

  return (
    <StyledHome>
      {hasRegistrationEnded ? (
        <HeroSecondary
          title="Registration Is Closed"
          body="Thank you for contributing to open source this month. Open source couldn’t survive without the dynamic duo of project maintainers and volunteers like you. **Hacktoberfest #11** has officially ended."
        />
      ) : (
        <Hero />
      )}

      {!hasRegistrationEnded && (
        <>
          <HomeIntro />
          <Progress />
        </>
      )}

      <Section>
        <Container>
          <ContentSide>
            <ContentMaster
              size="xl2"
              title={
                hasRegistrationEnded ? 'Sign up for updates' : 'Preptember'
              }
              cta={
                hasRegistrationEnded
                  ? null
                  : {
                      href: '/participation',
                      children: 'How to Participate',
                      variant: 'secondary-deep-pink',
                    }
              }
            >
              {`${
                hasRegistrationEnded
                  ? `But don’t let that stop you from contributing to open source all year long. We look forward to seeing you next year! Be sure to [sign up for updates](https://www.digitalocean.com/open-source/hacktoberfest#stay-up-to-date) to get the latest announcements about future Hacktoberfest events.`
                  : `September is prep time for Hacktoberfest. Spend September
              getting a jump start on your four pull/merge requests by
              tracking down projects to contribute to, adding the
              ‘hacktoberfest’ tag to your own projects, or familiarizing
              yourself with Git so you can hit the ground running when
              Hacktoberfest begins on ${trackingStartDate}.`
              }`}
            </ContentMaster>
            <CardCallout
              title="Keep your connection to open source strong! Join other members of the open-source community in lively discussion on the Hacktoberfest Discord."
              link={{
                href: 'https://discord.gg/hacktoberfest',
                target: '_blank',
                rel: 'noreferrer noopener',
                children: 'Join the Discord',
              }}
            />
          </ContentSide>
        </Container>
      </Section>

      {!hasRegistrationEnded && (
        <>
          <SectionDivider />
          <Section bgColor={theme.colors.black} color={theme.colors.typography}>
            <Container>
              <ContentSide>
                <ContentMaster
                  size="xl2"
                  title={`Sponsors and Awards for ${new Date(registrationStart).getFullYear()}`}
                  cta={{
                    href: '/about',
                    children: (
                      <>
                        Learn more{' '}
                        <span className="sr-only">about Hacktoberfest</span>
                      </>
                    ),
                    variant: 'primary-green',
                  }}
                >
                  {`This year, Hacktoberfest is sponsored by ${asList(sponsors.map(({ title }) => `**${title}**`))}. We thank them for their ongoing support of open source ❤️\n\nWhen Hacktoberfest started in 2014, 676 participants showed up to contribute. In 2023, nearly 98,000 people participated. To help ensure we can keep the Hacktoberfest party going for another decade, this year you’ll get an evolving digital badge for participating.`}
                </ContentMaster>

                <Glitch
                  image={
                    <StyledSponsorImage
                      src={asciiParticipation.src}
                      alt=""
                      width="608"
                      height="608"
                    />
                  }
                />
              </ContentSide>
            </Container>
          </Section>

          <StyledHomeDivider>
            <svg
              width="1440"
              height="149"
              viewBox="0 0 1440 149"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1440 1.52588e-05L1256.36 0V49.7521L1073.44 49.752L1003.94 49.752V50L890 50V100L691 100L691 50L555 50L555 100L2.58629e-06 100L0 149L555 149V100L691 100V149H889.357H1003.94L1073 149L1256.36 149L1440 149L1440 100.236L1440 100L1440 1.52588e-05Z"
                fill="currentColor"
              />
            </svg>
          </StyledHomeDivider>
        </>
      )}

      {hasRegistrationEnded ? (
        <>
          <SectionDivider
            isFlipped
            bgColor={theme.colors.green}
            fgColor={theme.colors.cream}
          />

          <Section bgColor={theme.colors.green}>
            <Container>
              <SpotHeader
                image={{
                  src: asciiShare.src,
                  alt: '',
                }}
                content={{
                  size: 'xl',
                  title: 'Thank you to all our Sponsors and Community Partners',
                  children: `A special thank you to the great folks at ${asList(
                    sponsors.map(({ title }) => `**${title}**`),
                  )} for their sponsorship of Hacktoberfest. Thank you to ALL our Sponsors and Community Partners, we ❤️ you!`,
                }}
              />
            </Container>
          </Section>

          <SectionDivider
            align="right"
            bgColor={theme.colors.green}
            fgColor={theme.colors.black}
          />

          <Section bgColor={theme.colors.black}>
            <Container>
              <StyledSectionSpacing>
                <Sponsors title="Sponsors" sponsors={sponsors} centered large />

                <Sponsors
                  title="Community Partners"
                  sponsors={partners}
                  centered
                />
              </StyledSectionSpacing>
            </Container>
          </Section>
          <SectionDivider
            isFlipped
            bgColor={theme.colors.cream}
            fgColor={theme.colors.black}
          />
        </>
      ) : (
        <>
          <Section bgColor={theme.colors.green} color={theme.colors.dark}>
            <Container>
              <StyledHomeEvents>
                <ContentSide>
                  <ContentMaster size="xl2" title="Event Spotlight" />

                  <ContentMaster
                    size="xl"
                    links={[
                      {
                        id: 'explore-events',
                        size: 'lg',
                        href: '/events',
                        children: 'Explore More Hacktoberfest Events',
                      },
                    ]}
                  >
                    Events that bring the community together to learn and
                    explore are a cornerstone of Hacktoberfest. Save these dates
                    and come connect with other lovers of open source!
                  </ContentMaster>
                </ContentSide>

                <Divider type="doubledashed" />

                <Events events={events} />
              </StyledHomeEvents>
            </Container>
          </Section>
          <SectionDivider
            align="right"
            bgColor={theme.colors.green}
            fgColor={theme.colors.cream}
          />
        </>
      )}

      <Section>
        <Container>
          <ContentSide>
            <ContentMaster size="xl2" title="Support Open Source">
              {
                'Open-source projects, maintained by community-minded coders, make the modern internet function. Supporting that essential work, and the folks behind it, is what Hacktoberfest is all about.'
              }
            </ContentMaster>
            <CardCallout
              body={
                <>
                  DigitalOcean is proud to support open-source projects of all
                  kinds. We offer credit grants to projects, assist with
                  development, infrastructure, and testing, so open-source
                  projects like yours can get a boost.{' '}
                  <Link
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://www.digitalocean.com/open-source/credits-for-projects"
                  >
                    Learn more and apply now
                  </Link>
                  <br />
                  <br />
                  You have skills that can help keep these projects continue
                  running—let’s get to it.
                </>
              }
              link={{
                href: '/donate',
                children: 'Donate To Open Source Projects',
              }}
            />
          </ContentSide>
        </Container>
      </Section>
    </StyledHome>
  );
};

export default Home;
