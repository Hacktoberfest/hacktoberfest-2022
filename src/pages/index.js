import { Fragment, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';

import { communityPartners, events, months } from 'lib';
import { registrationEnd, registrationStart } from 'lib/config';
import sponsors from 'lib/sponsors';

import Button from 'components/button';
import Section from 'components/section';
import Divider from 'components/divider';
import Anchor from 'components/anchor';
import Marquee from 'components/marquee';
import Card from 'components/card';
import Column from 'components/column';
import Logo from 'components/logo-2';
import Repeater from 'components/repeater';
import Loader from 'components/loader';
import { FauxHero } from 'components/hero';
import { PixelHeart, PixelFirework1, PixelFirework2 } from 'components/pixels';
import { FounderSponsors } from 'components/sponsors';

import useCountdown from 'hooks/useCountdown';

import {
  StyledEventsListItemEyebrow,
  StyledList,
  StyledListItem,
} from './events';

const flash = () => keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const StyledCountdownContainer = styled.div`
  .title {
    span {
      animation: ${flash} 1.5s linear infinite;
    }

    @media (prefers-reduced-motion) {
      animation-play-state: paused;
    }
  }

  .ticker {
    display: flex;
    justify-content: space-between;
    box-shadow: 0px 1px 0px ${(props) => props.theme.text};
    align-items: flex-end;
    margin-top: 16px;

    p,
    h5 {
      padding-bottom: 4px;
    }
  }
`;

export const StyledAnimations = styled.div`
  z-index: -1;

  & > * {
    position: absolute;

    svg {
      opacity: 0.5;
    }
  }

  #f1 {
    top: 50%;
    left: 40px;
  }

  #f2 {
    top: 40px;
    right: 100px;
  }

  #f3 {
    bottom: 0px;
    right: 250px;
  }
`;

const StyledHeroContent = styled.div`
  display: block;

  div {
    margin: 0 auto;
    text-align: center;
  }

  a {
    margin: 40px auto 0;
    display: flex;
    justify-content: center;

    .btn {
      width: 344px;
    }
  }

  @media (max-width: 500px) {
    a {
      width: 100%;
      .btn {
        width: 100%;
      }
    }
  }
`;

const StyledThanks = styled.div`
  p {
    margin: 48px 0 0;
  }
  
  ul {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    margin: 24px 0 0;
    
    li {
      margin: 4px;
      
      a {
        padding: 8px;
        text-shadow: ${(props) => props.theme.glowLite};
      }
    }
  }
`;

const Home = () => {
  const [days, hours, minutes, seconds] = useCountdown(
    new Date(registrationStart).getTime()
  );

  const hasRegistration = useMemo(
    () =>
      new Date() >= new Date(registrationStart) &&
      new Date() < new Date(registrationEnd),
    []
  );

  const hasRegistrationEnded = useMemo(() => new Date() >= new Date(registrationEnd), []);

  return (
    <>
      <FauxHero
        h="205"
        s="8"
        b="0.4"
        gradientLeft="#0049FF"
        gradientRight="#FF69B9"
        height="632px"
        spacing_btm="-24px"
        spacing_top="24px"
      >
        <StyledHeroContent>
          <Logo width="80px" />
          {hasRegistration && (
            <Link href="/auth" passHref>
              <Button special as="a">
                Registration now open
              </Button>
            </Link>
          )}
          <FounderSponsors />
        </StyledHeroContent>
        <StyledAnimations>
          <PixelFirework1
            width="840"
            scale="1"
            timing="1.5"
            frames="7"
            id="f1"
          />

          <PixelFirework2 width="840" scale="1" timing="1" frames="7" id="f2" />
          <PixelFirework1
            width="840"
            scale="1.5"
            timing="1.25"
            frames="7"
            id="f3"
          />
        </StyledAnimations>
      </FauxHero>
      <Section spacing_top="64px">
        <StyledCountdownContainer>
          <p className="title">
            {' '}
            {'>>'}{' '}
            <span>
              {hasRegistration
                ? 'Launch initiated'
                : (hasRegistrationEnded
                  ? 'Registration is closed'
                  : 'Time to launch')}
            </span>
          </p>
          {!hasRegistrationEnded && (
            <Column>
              <div className="ticker">
                <p>Days:</p>
                <h5>{days}</h5>
              </div>
              <div className="ticker">
                <p>Hours:</p>
                <h5>{hours}</h5>
              </div>
              <div className="ticker">
                <p>Minutes:</p>
                <h5>{minutes}</h5>
              </div>
              <div className="ticker">
                <p>Seconds:</p>
                <h5>{seconds}</h5>
              </div>
            </Column>
          )}
          {hasRegistrationEnded && (
            <>
              <br/>
              <p>
                Thank you for making contributions to open source.
                Hacktoberfest #{new Date(registrationStart).getFullYear() - 2013} {new Date(registrationStart).getFullYear()} has now ended.
              </p>
              <br/>
            </>
          )}
        </StyledCountdownContainer>
        <Divider spacing_top="40px" spacing_btm="64px" />
      </Section>
      <Marquee
        text1={
          hasRegistration
            ? 'Get in the repo, Hacker!'
            : (hasRegistrationEnded
              ? 'Keep contributing!'
              : 'Systems critical')
        }
        text2={
          hasRegistration
            ? 'Get in the repo, Hacker!'
            : (hasRegistrationEnded
              ? 'Keep contributing!'
              : 'Systems critical')
        }
        direction="forwards"
      />
      <Marquee
        text1={
          hasRegistration
            ? 'Launch sequence Initiated'
            : (hasRegistrationEnded
              ? `See you for ${new Date(registrationStart).getFullYear() + 1}`
              : 'Registration begins')
        }
        text2={
          hasRegistration
            ? 'It\'s time to hack'
            : (hasRegistrationEnded
              ? `See you for ${new Date(registrationStart).getFullYear() + 1}`
              : `${months.short[new Date(registrationStart).getMonth()]} ${new Date(registrationStart).getDate()}`)
        }
        direction="reverse"
      />
      <Section spacing_top="64px">
        <Repeater spacing_btm="64px" />
        <Loader
          message={`>> Boot Dialogue: ${
            hasRegistration
              ? 'Registration is now open!'
              : (hasRegistrationEnded
                ? `System paused until ${new Date(registrationStart).getFullYear() + 1}`
                : `Registration begins ${months.long[new Date(registrationStart).getMonth()]} ${new Date(registrationStart).getDate()}`)
          }`}
        />
        {hasRegistrationEnded && (
          <StyledThanks>
            <Button
              as="a"
              href="https://discord.gg/hacktoberfest"
              target="_blank"
              rel="noreferrer noopener"
              special
              spacing_top="48px"
            >
              Join the Hacktoberfest Discord
            </Button>
            <p>
              A special thank you to the great people at
              {' '}
              {sponsors.presented.concat(sponsors.supported)
                .map((sponsor, idx, arr) => (
                  <Fragment key={sponsor.name}>
                    {idx === arr.length - 1 && ' and '}
                    <a
                      href={sponsor.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {sponsor.name}
                    </a>
                    {idx < arr.length - 1 && ', '}
                  </Fragment>
                ))}
              {' '}
              for their partnership and support of Hacktoberfest. We couldn’t
              do it without you!
            </p>
            <p>
              Thank you to our Community Partners, we &lt;3 you!
            </p>
            <ul>
              {communityPartners.map((partner) => (
                <li key={partner.name}>
                  <a href={partner.url} target="_blank" rel="noreferrer noopener">
                    {partner.name}
                  </a>
                </li>
              ))}
            </ul>
            <p>
              Keep contributing to open source. We look forward to seeing you
              for Hacktoberfest {new Date(registrationStart).getFullYear() + 1}!
              <br/>
              <br/>
              - The Hacktoberfest Team :)
            </p>
            <p>
              <a href="https://youtu.be/hzDrGs2PZ0Y" target="_blank" rel="noreferrer noopener">
                Watch the Hacktoberfest 2022 Recap ->
              </a>
            </p>
          </StyledThanks>
        )}
      </Section>

      <Section id="prepare-to-hack" type="home_content">
        <Divider />
        <Anchor href="#prepare-to-hack" />
        <h2>Prepare to Hack</h2>
        <h5>
          Hacktoberfest is for everyone. Whether it’s your first time—or your
          ninth—it’s almost time to hack out four pristine pull/merge requests
          and complete your mission for open source. Join other members of the
          open-source community on the Hacktoberfest Discord.
        </h5>
        <Button
          as="a"
          href="https://discord.gg/hacktoberfest"
          target="_blank"
          rel="noreferrer noopener"
          special
          spacing_top="40px"
        >
          Join the Hacktoberfest Discord
        </Button>
        <div>
          <Column spacing_top="64px">
            <Card primary="psybeam" secondary="surf">
              <h3>Preptember</h3>
              <p>
                Now is the perfect time to prepare for Hacktoberfest. Get a jump
                start by finding projects to contribute to, adding the
                ‘hacktoberfest’ tag to your projects, or familiarizing yourself
                with Git.
              </p>
              <Link href="/events#organizers" passHref>
                <Button
                  as="a"
                  color_bg="body"
                  color_text="text"
                  spacing_all="40px 16px 0 0"
                >
                  Get the Event Kit
                </Button>
              </Link>
              <Link href="/participation" passHref>
                <Button as="a" color_bg="body" color_text="text">
                  How to Participate
                </Button>
              </Link>
            </Card>
            <Card primary="surf" secondary="psybeam">
              <h3>New for 2022</h3>
              <p>
                Hacktoberfest isn’t <i>all</i> about code. Anyone who writes,
                designs, tests, mentors, or organizes offers much needed support
                for open-source projects all over the world.
              </p>
              <Link href="/about#low-or-non-code" passHref>
                <Button
                  as="a"
                  color_bg="body"
                  color_text="text"
                  spacing_top="40px"
                >
                  Learn About Non-Code Contributions
                </Button>
              </Link>
            </Card>
          </Column>
        </div>
      </Section>

      {/*<Section id="beanie" type="home_content">
        <Divider style="reverse" />
        <Anchor href="#beanie" />
        <h2>Hacktoberfest Beanie</h2>
        <h5>
          Official Hacktoberfest 2022 Beanie - $15.95
          <br/>
          Commemorate Hacktoberfest 2022 with a collectible beanie, available
          for the first time ever.
        </h5>
        <Button
          as="a"
          href="https://stores.kotisdesign.com/wf6xjr1eyd/items/unisex-port-company-100-acrylic-rolled-beanie/145268"
          target="_blank"
          rel="noreferrer noopener"
          special
          spacing_top="40px"
        >
          Buy Your Beanie
        </Button>
      </Section>*/}

      {!hasRegistrationEnded && (
        <Section id="events-all-month-long" type="home_content">
          <Divider style="reverse" />
          <Anchor href="#events-all-month-long" />
          <h2>Events All Month Long</h2>
          <h5>
            Join forces in virtual and in-person events to get your pull/merge
            requests done as a team, learn new skills, and meet lifelong friends.
          </h5>
          <StyledList>
            {events.map((event) => (
              <StyledListItem key={event.title}>
                <StyledEventsListItemEyebrow color="surf">
                  [ DigitalOcean ]
                </StyledEventsListItemEyebrow>
                <h3>{event.title}</h3>
                <p>{event.content}</p>
                <ul>
                  <li>
                    <span>Location:</span> {event.location}
                  </li>
                  <li>
                    <span>Date:</span> {event.date}
                  </li>
                  <li>
                    <span>Time:</span> {event.time}
                  </li>
                  <li>
                    <span>Format:</span> {event.format.join(', ')}
                  </li>
                  <li>
                    <span>RSVP:</span>{' '}
                    {event.rsvp && (
                      <a
                        href={event.rsvp}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {event.rsvp}
                      </a>
                    )}
                    {!event.rsvp && 'Coming Soon'}
                  </li>
                </ul>
              </StyledListItem>
            ))}
          </StyledList>

          <Link href="/events" passHref>
            <Button special as="a" spacing_top="40px">
              See All Events
            </Button>
          </Link>
        </Section>
      )}

      <FauxHero
        h="220"
        s="8"
        b="0.4"
        gradientLeft="#E800FF"
        gradientRight="#FF2020"
        height="456px"
        spacing_btm="-64px"
        spacing_top="128px"
      >
        <PixelHeart />
      </FauxHero>
      <Section type="center home_content">
        <h2>Support Open Source</h2>
        <h5>
          Open-source projects, maintained by community-minded coders, make the
          modern internet function. Supporting that essential work, and the
          folks behind it, is what Hacktoberfest is all about.
          <br />
          <br />
          You have skills that can help keep these projects continue
          running—let’s get to it.
        </h5>
        <Link href="/donate" passHref>
          <Button special as="a" spacing_top="40px">
            Donate To Open-Source Projects
          </Button>
        </Link>
      </Section>
    </>
  );
};

export default Home;
