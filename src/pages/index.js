import { useMemo } from 'react';
import styled from 'styled-components';

import { events } from 'lib';
import { registrationEnd, registrationStart } from 'lib/config';
import { asList, withOrdinal } from 'lib/format';
import { partners, sponsors } from 'lib/sponsors';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import Marquee from 'components/Marquee';
import Hero from 'components/Hero';
import ContentSide from 'components/ContentSide';
import Callout from 'components/Callout';
import Divider from 'components/Divider';
import Container from 'components/Container';
import DividerRow from 'components/DividerRow';
import SpotCard from 'components/SpotCard';
import ContentMaster from 'components/ContentMaster';
import HomeIntro from 'components/HomeIntro';
import SupportSection from 'components/SupportSection';
import Section from 'components/Section';
import Events from 'components/Events';
import Sponsors from 'components/Sponsors';
import HeartCallout from 'components/HeartCallout';
import PixelIntro from 'components/pixels/PixelIntro';

import IlloMLH from 'assets/img/logo-MLH.svg';
import IlloGit from 'assets/img/8bit-git.svg';
import IlloDiscord from 'assets/img/8bit-discord.svg';
import IlloBranch from 'assets/img/8bit-branch.svg';
import IlloPumpkin from 'assets/img/8bit-pumpkin.svg';

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

export const StyledHomeCallout = styled.div`
  background: url(${IlloPumpkin.src}) no-repeat;
  background-size: ${(537 / 1440) * 100}% auto;
  background-position: 0 -35px;
`;

export const StyledThanksCallout = styled(HeartCallout)`
  margin: 0 0 24px;
`;

const Home = () => {
  const hasRegistration = useMemo(
    () =>
      new Date() >= new Date(registrationStart) &&
      new Date() < new Date(registrationEnd),
    [],
  );

  const hasRegistrationEnded = useMemo(
    () => new Date() >= new Date(registrationEnd),
    [],
  );

  return (
    <StyledHome>
      <StyledHomeBg $offset={!hasRegistrationEnded}>
        <PixelIntro timing="5" />
      </StyledHomeBg>

      <Container>
        <Hero />

        <HomeIntro
          callout={{
            title:
              'Join other members of the open-source community on the Hacktoberfest Discord.',
            link: {
              href: 'https://discord.gg/hacktoberfest',
              target: '_blank',
              rel: 'noreferrer noopener',
              children: 'Join the discord',
            },
            image: {
              src: IlloDiscord.src,
              alt: '',
            },
          }}
        >
          {hasRegistrationEnded
            ? 'Keep contributing to open source. We look forward to seeing you next year! Be sure to [sign up for updates](https://www.digitalocean.com/open-source/hacktoberfest#open-source-stay-up-to-date) to get the latest announcements.'
            : `This year marks the ${withOrdinal(
                new Date(registrationStart).getFullYear() - 2013,
              )} anniversary of Hacktoberfest, and we're calling on your support! Whether it&apos;s your first time participating—or your tenth—it&apos;s almost time to hack out four pristine pull/merge requests as we continue our month of support for open source.`}
        </HomeIntro>

        {!hasRegistrationEnded && (
          <>
            <Divider type="pixel" />

            <Section>
              <ContentSide>
                <ContentMaster size="xl" title="Preptember" />
                <ContentMaster
                  size="md"
                  links={[
                    {
                      id: 'preptember-link-1',
                      children: 'Get the Event Kit',
                      href: '/events#organizers',
                    },
                    {
                      id: 'preptember-link-2',
                      children: 'How to Participate',
                      href: '/participation',
                    },
                  ]}
                >
                  September is the perfect time to prepare for Hacktoberfest.
                  Get a jump start by finding projects to contribute to, adding
                  the **‘hacktoberfest’** tag to your projects, or familiarizing
                  yourself with Git.
                </ContentMaster>
              </ContentSide>
            </Section>
          </>
        )}
      </Container>

      <Marquee
        text1={
          hasRegistration
            ? "It's time to hack"
            : hasRegistrationEnded
              ? `See you for ${new Date(registrationStart).getFullYear() + 1}`
              : 'Prepare to hack'
        }
        text2={
          hasRegistration
            ? 'Get in the repo, Hacker!'
            : hasRegistrationEnded
              ? 'Keep contributing!'
              : `New for ${new Date(registrationStart).getFullYear()}`
        }
        direction="forwards"
      />

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
        <>
          <StyledHomeCallout>
            <Section>
              <Callout
                link={{
                  children: 'Learn more',
                  href: '/about#digital-rewards',
                }}
              >
                **Hacktoberfest has grown from 676 participants in 2014 to
                nearly 147,000 participants last year. To help ensure
                Hacktoberfest can be sustained for another decade, this year
                we’re moving away from a free t-shirt reward to a digital
                reward.**
              </Callout>
            </Section>
          </StyledHomeCallout>

          <Container>
            <Divider type="doubledashed" />

            <DividerRow>
              <SpotCard
                image={{
                  src: IlloGit.src,
                  alt: '',
                }}
                links={[
                  {
                    id: 'spot-card-1',
                    href: '/about#hacktoberfest-love',
                    children: 'Share your love for Hacktoberfest',
                  },
                ]}
              >
                This year we’re celebrating 10 years of open source love and we
                want to hear your Hacktoberfest story!
              </SpotCard>
              <SpotCard
                image={{
                  style: {
                    objectFit: 'contain',
                  },
                  src: IlloMLH.src,
                  alt: '',
                }}
                links={[
                  {
                    id: 'spot-card-2',
                    href: 'https://ghw.mlh.io/events/open-source',
                    target: '_blank',
                    rel: 'noreferrer noopener',
                    children: 'MLH Global Hack Week',
                  },
                ]}
              >
                We’re teaming up with Major League Hacking for Global Hack Week!
                Complete Open-Source themed daily challenges and enjoy live
                streamed workshops.
              </SpotCard>
            </DividerRow>

            <Divider type="doubledashed" />
          </Container>

          <Container inner>
            <Section>
              <ContentMaster
                align="center"
                size="xl"
                title="Event Spotlight"
                cta={{
                  size: 'lg',
                  href: '/events',
                  children: 'Learn more',
                }}
              >
                No Hacktoberfest is complete without joining the community to
                learn and explore together. Save the dates and come connect!
              </ContentMaster>

              <Events title="Featured Events" events={events} />
            </Section>
          </Container>
        </>
      )}

      <Container>
        <Divider type="pixel" />

        <SupportSection
          title="Support Open Source"
          callout={{
            title:
              'You have skills that can help keep these projects continue running—let’s get to it.',
            link: {
              href: '/donate',
              children: 'Donate to open source projects',
            },
            image: {
              src: IlloBranch.src,
              alt: '',
            },
          }}
        >
          Open source projects, maintained by community-minded coders, make the
          modern internet function. Supporting that essential work, and the
          folks behind it, is what Hacktoberfest is all about.
        </SupportSection>
      </Container>
    </StyledHome>
  );
};

export default Home;
