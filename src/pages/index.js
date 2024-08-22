import { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';

import { events } from 'lib';
import { registrationEnd, registrationStart } from 'lib/config';
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

import dots from 'assets/img/dots.svg';
import Progress from 'components/Progress';
import CardCallout from 'components/CardCallout';
import SectionDivider from 'components/SectionDivider';
import asciiParticipation from 'assets/img/ascii-participation.svg';

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

export const StyledHomeContinue = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;

  > img {
    max-width: 401px;
    width: 100%;
  }
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
      <Hero />

      <HomeIntro />

      <Progress />

      {!hasRegistrationEnded && (
        <>
          <Section>
            <Container>
              <ContentSide>
                <ContentMaster
                  size="xl2"
                  title="Preptember"
                  titleCursorColor={theme.colors.black}
                  cta={{
                    href: '/participation',
                    children: 'How to Participate',
                  }}
                >
                  September is prep time for Hacktoberfest. Spend September
                  getting a jump start on your four pull/merge requests by
                  tracking down projects to contribute to, adding the
                  ‘hacktoberfest’ tag to your own projects, or familiarizing
                  yourself with Git so you can hit the ground running when
                  Hacktoberfest begins on October 1.
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
        </>
      )}

      <SectionDivider />

      <Section bgColor={theme.colors.black} color={theme.colors.typography}>
        <Container>
          <ContentSide>
            <StyledHomeContinue>
              <ContentMaster
                size="xl2"
                title="Sponsors and Awards for 2024"
                cta={{
                  href: '/about',
                  children: 'Learn more',
                  variant: 'primary-green',
                }}
              >
                {
                  'This year, Hacktoberfest is sponsored by DigitalOcean, Twilio, Cloudflare, and Quira. We thank them for their ongoing support of open source ❤️\n\nWhen Hacktoberfest started in 2014, 676 participants showed up to contribute. In 2023, nearly 98,000 people participated. To help ensure we can keep the Hacktoberfest party going for another decade, this year you’ll get an evolving digital badge for participating.'
                }
              </ContentMaster>
              <img src={dots.src} alt="" />
            </StyledHomeContinue>

            <StyledSponsorImage src={asciiParticipation.src} alt="" />
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

      {hasRegistrationEnded ? (
        <>
          <Section>
            <Container>
              <StyledThanksCallout>
                <ContentMaster
                  align="center"
                  size="lg"
                  title={
                    <>
                      Thank you to <strong>all</strong> our sponsors and
                      community partners, we ❤️ you!
                    </>
                  }
                />
              </StyledThanksCallout>
            </Container>

            <Container slim>
              <ContentMaster
                align="center"
                size="lg"
                children={`A special thank you to the great folks at ${asList(
                  sponsors.map(({ title }) => `**${title}**`),
                )} for their sponsorship of Hacktoberfest.`}
              />
            </Container>
          </Section>

          <Container>
            <Divider type="doubledashed" />
          </Container>

          <Section>
            <Container slim>
              <Sponsors title="Sponsors" sponsors={sponsors} centered large />

              <Section small>
                <Sponsors
                  title="Community Partners"
                  sponsors={partners}
                  centered
                />
              </Section>
            </Container>
          </Section>
        </>
      ) : (
        <Section bgColor={theme.colors.green} color={theme.colors.dark}>
          <Container>
            <StyledHomeEvents>
              <ContentSide>
                <ContentMaster
                  size="xl2"
                  title="Event Spotlight"
                  titleCursorColor={theme.colors.black}
                />

                <ContentMaster
                  size="xl"
                  links={[
                    {
                      size: 'lg',
                      href: '/events',
                      children: 'Explore More Hacktoberfest Events',
                    },
                  ]}
                >
                  Events that bring the community together to learn and explore
                  are a cornerstone of Hacktoberfest. Save these dates and come
                  connect with other lovers of open source!
                </ContentMaster>
              </ContentSide>

              <Divider type="doubledashed" />

              <Events events={events} />
            </StyledHomeEvents>
          </Container>
        </Section>
      )}

      <SectionDivider
        align="right"
        bgColor={theme.colors.green}
        fgColor={theme.colors.cream}
      />

      <Section>
        <Container>
          <ContentSide>
            <ContentMaster
              size="xl2"
              title="Support Open Source"
              titleCursorColor={theme.colors.black}
            >
              {
                'Open-source projects, maintained by community-minded coders, make the modern internet function. Supporting that essential work, and the folks behind it, is what Hacktoberfest is all about.\n\nDigitalOcean is proud to support open-source projects of all kinds. We offer credit grants to projects, assist with development, infrastructure, and testing, so open-source projects like yours can get a boost. [Learn more and apply now.](https://www.digitalocean.com/open-source/credits-for-projects)'
              }
            </ContentMaster>
            <CardCallout
              title="You have skills that can help keep these projects continue running—let’s get to it."
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
