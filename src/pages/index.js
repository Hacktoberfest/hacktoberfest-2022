import { useCallback, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';

import { events } from 'lib';

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

import osGrid from 'assets/img/os-grid.svg';
import osHeart from 'assets/img/os-heart.svg';
import grid from 'assets/img/grid.svg';

import {
  StyledEventsListItemEyebrow,
  StyledList,
  StyledListItem,
} from './events';

const StyledHero = styled.section`
  width: 100%;

  .content {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    padding: 64px 0;
    align-items: center;
    max-width: 1312px;
    position: relative;

    &:before {
      position: absolute;
      left: 0;
      top: 0;
      content: '';
      background: url(${grid.src}) no-repeat center center;
      background-size: cover;
      width: 100%;
      height: 456px;
    }
  }
`;

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
    animation: ${flash} 1.5s linear infinite;

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

const StyledHeart = styled.div`
  background: url(${osGrid.src}) center center / cover no-repeat;
  padding: 64px;

  img {
    max-width: 100%;
  }
`;

const Home = () => {
  const [days, setDays] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);

  const setCountdown = useCallback(() => {
    const target = new Date('2022-09-26T18:00:00Z');
    const diff = target - new Date();
    setDays(
      Math.floor(diff / 1000 / 60 / 60 / 24)
        .toString()
        .padStart(2, '0')
    );
    setHours(
      Math.floor((diff / 1000 / 60 / 60) % 24)
        .toString()
        .padStart(2, '0')
    );
    setMinutes(
      Math.floor((diff / 1000 / 60) % 60)
        .toString()
        .padStart(2, '0')
    );
    setSeconds(
      Math.floor((diff / 1000) % 60)
        .toString()
        .padStart(2, '0')
    );
  }, []);

  useEffect(() => {
    setCountdown();

    const interval = setInterval(() => {
      setCountdown();
    }, 1000);
    return () => clearInterval(interval);
  }, [setCountdown]);

  return (
    <>
      <StyledHero>
        <div className="content">
          <Logo width="80px" />
        </div>
      </StyledHero>
      <Section spacing_top="64px">
        <StyledCountdownContainer>
          <p className="title"> {'>>'} Time to launch</p>
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
        </StyledCountdownContainer>
        <Divider spacing_top="40px" spacing_btm="64px" />
      </Section>
      <Marquee
        text1="systems critical"
        text2="systems critical"
        direction="forwards"
      />
      <Marquee
        text1="registration begins"
        text2="sept 26"
        direction="reverse"
      />
      <Section spacing_top="64px">
        <Repeater spacing_btm="64px" />
        <Loader message=">> Boot Dialogue: registration begins september 26" />
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
          Join the hacktoberfest discord
        </Button>
        <div>
          <Column spacing_top="64px">
            <Card primary="psybeam" secondary="surf">
              <h3>Preptember</h3>
              <p>
                September is the perfect time to prepare for Hacktoberfest. Get
                a jump start by finding projects to contribute to, adding the
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

      <Section type="center home_content">
        <StyledHeart>
          <img src={osHeart.src} alt="" height="256" />
        </StyledHeart>
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
