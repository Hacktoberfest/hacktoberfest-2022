import { useMemo } from 'react';
import styled from 'styled-components';

import { events } from 'lib';
import { registrationEnd, registrationStart } from 'lib/config';

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

import IlloComputer from 'assets/img/8bit-computer.svg';
import IlloGit from 'assets/img/8bit-git.svg';
import IlloDiscord from 'assets/img/8bit-discord.svg';
import IlloBranch from 'assets/img/8bit-branch.svg';
import IlloPumpkin from 'assets/img/8bit-pumpkin.svg';
import Events from 'components/Events';
import PixelIntro from 'components/pixels/PixelIntro';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledHome = styled.div`
  overflow: hidden;
  position: relative;
  isolation: isolate;
`;

export const StyledHomeBg = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  overflow: hidden;
  z-index: -1;
  mask-image: radial-gradient(circle at 50% 0%, #000, transparent 100%);
  mask-size: 100% 100%;

  ${mQ(bp.tablet)} {
    mask-image: radial-gradient(circle at 100% 0%, #000, transparent 60%);
  }

  &::after {
    content: '';
    display: block;
    padding-bottom: 296.53333333%;

    ${mQ(bp.tablet)} {
      padding-bottom: 103.194444444%;
    }
  }

  > div {
    width: 429.86666667%;
    top: -46.33333333vw;
    right: -178.066667vw;
    position: absolute;

    ${mQ(bp.tablet)} {
      top: -35.48611111vw;
      right: -58.68055556%;
      width: 161.38888889%;
    }

    &::after {
      padding-bottom: 75.12406948%;

      ${mQ(bp.tablet)} {
        padding-bottom: 79.51807229%;
      }
    }
  }
`;

export const StyledHomeCallout = styled.div`
  background: url(${IlloPumpkin.src}) no-repeat;
  background-size: ${(537/1440)*100}% auto;
  background-position: 0 -35px;
`;

const Home = () => {
  const hasRegistration = useMemo(
    () =>
      new Date() >= new Date(registrationStart) &&
      new Date() < new Date(registrationEnd),
    []
  );

  const hasRegistrationEnded = useMemo(() => new Date() >= new Date(registrationEnd), []);

  return (
    <StyledHome>
      <StyledHomeBg>
        <PixelIntro
          width="5976"
          scale="1"
          timing="5"
          frames="3"
        />
      </StyledHomeBg>
      <Container>
        <Hero />

        <HomeIntro
          callout={{
            title: 'Join other members of the open-source community on the Hacktoberfest Discord.',
            link: {
              href: 'https://discord.gg/hacktoberfest',
              children: 'Join the discord'
            },
            image: {
              src: IlloDiscord.src,
              alt: ''
            }
          }}>
            This year marks the 10th anniversary of Hacktoberfest, and we're calling on your support! Whether it’s your first time participating—or your tenth—it’s almost time to hack out four pristine pull/merge requests as we continue our month of support for open source.
        </HomeIntro>

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
                  href: '/events#organizers'
                }, {
                  id: 'preptember-link-2',
                  children: 'How to Participate',
                  href: '/participation'
                }
              ]}
            >
              September is the perfect time to prepare for Hacktoberfest. Get a jump start by finding projects to contribute to, adding the **‘hacktoberfest’** tag to your projects, or familiarizing yourself with Git.
            </ContentMaster>
          </ContentSide>
        </Section>
      </Container>

      <Marquee
        text1={
          hasRegistration
            ? 'Get in the repo, Hacker!'
            : (hasRegistrationEnded
              ? 'Keep contributing!'
              : 'New for 2023')
        }
        text2={
          hasRegistration
            ? 'Get in the repo, Hacker!'
            : (hasRegistrationEnded
              ? 'Keep contributing!'
              : 'New for 2023')
        }
        direction="forwards"
      />

      <StyledHomeCallout>
        <Section>
          <Callout
            link={{
              children: 'Learn more',
              href: '/about#digital-rewards'
            }}>
            **Hacktoberfest has grown from 676 participants in 2014 to nearly 147,000 participants last year. To ensure Hacktoberfest can be sustained for another decade, this year we’re moving away from a free t-shirt reward to a digital reward.**
          </Callout>
        </Section>
      </StyledHomeCallout>

      <Container>
        <Divider type="doubledashed" />

        <DividerRow>
          <SpotCard
            image={{
              src: IlloGit.src,
              alt: ''
            }}
            links={[{
              id: 'spot-card-1',
              href: '/about#hacktoberfest-love',
              children: 'Share your love for Hacktoberfest'
            }]}
          >
            This year we’re celebrating 10 years of open source love and we want to hear your Hacktoberfest story!
          </SpotCard>
          <SpotCard
            image={{
              src: IlloComputer.src,
              alt: ''
            }}
            links={[{
              id: 'spot-card-2',
              href: 'https://ghw.mlh.io/events/open-source',
              children: 'MLH Global Hack Week'
            }]}
          >
            We’re teaming up with Major League Hacking for Global Hack Week! Join the Hacktoberfest Guild, win daily challenges!
          </SpotCard>
        </DividerRow>

        <Divider type="doubledashed" />
      </Container>

      <Container inner>
        <Section>
          <ContentMaster
            align="center"
            size="xl"
            title="Events All Month Long"
            cta={{
              size: 'lg',
              href: "/events",
              children: 'Learn more'
            }}
          >
            Join forces in virtual and in-person events to get your pull/merge requests done as a team, learn new skills, and meet lifelong friends. This year we’re partnering with Major League Hacking to help the community connect.
          </ContentMaster>

          <Events
            title="Event_Info.exe"
            events={events}
            link={{
              href: '/events',
              children: 'See all events'
            }}
          />
        </Section>
      </Container>

      <Container>
        <Divider type="pixel" />

        <SupportSection
          title="Support Open Source"
          callout={{
            title: 'You have skills that can help keep these projects continue running—let’s get to it.',
            link: {
              href: '/donate',
              children: 'Donate to open source projects'
            },
            image: {
              src: IlloBranch.src,
              alt: ''
            }
        }}>
          Open source projects, maintained by community-minded coders, make the modern internet function. Supporting that essential work, and the folks behind it, is what Hacktoberfest is all about.
        </SupportSection>
      </Container>
    </StyledHome>
  );
};

export default Home;
