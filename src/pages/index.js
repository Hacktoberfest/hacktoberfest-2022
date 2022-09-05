import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { events } from 'lib';
import Button from 'components/button';
import Section from 'components/section';
import Divider from 'components/divider';
import Anchor from 'components/anchor';
import Marquee from 'components/marquee';
import Card, { NewCard } from 'components/card';
import Column from 'components/column';
import osheart from 'img/os-heart.svg';
import Logo from 'components/logo-2';
import grid from 'img/grid.svg';

// const StyledCards = styled.div`
//   display: flex;
//   flex-flow: row wrap;
//   justify-content: center;
//   gap: 40px;
// `;

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

const Home = () => {
  const [days, setDays] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);

  const setCountdown = useCallback(() => {
    const target = new Date('2022-09-26T12:00:00Z');
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
      {/* <StyledCards>
        <Card
          primary="spark"
          secondary="psybeam"
          title="days"
          number={days}
          delay="0s"
        />
        <Card
          primary="psybeam"
          secondary="surf"
          title="hours"
          number={hours}
          delay="0.5s"
        />
        <Card
          primary="surf"
          secondary="spark"
          title="minutes"
          number={minutes}
          delay="1.3s"
        />
      </StyledCards> */}
      <StyledHero>
        <div className="content">
          <Logo width="80px" />
        </div>
      </StyledHero>
      <Marquee
        text1="registration begins"
        text2="sept 26"
        direction="forwards"
      />
      <Marquee
        text1="systems critical"
        text2="systems critical"
        direction="reverse"
      />

      <Section id="prepare-to-hack">
        <Divider />
        <Anchor href="#prepare-to-hack" />
        <h2>Prepare to Hack</h2>
        <h3>
          Hacktoberfest is for everyone. Whether it’s your first time —or your
          ninth, it’s almost time to hack out four pristine pull/merge requests
          and complete your mission for open source. Join other members of the
          open source community on the Hacktoberfest Discord.
        </h3>
        <Button as="a" href="https://discord.gg/hacktoberfest" special>
          Join the hacktoberfest discord
        </Button>
        <div>
          <Column>
            <NewCard primary="psybeam" secondary="surf">
              <h3>Preptember</h3>
              <p>
                September is the perfect time to prepare for Hacktoberfest. Get
                a jump start by finding projects to contribute to, adding the
                ‘hacktoberfest’ tag to your projects, or familiarizing yourself
                with Git.
              </p>
              <Link href="/events#organizers" passHref>
                <Button as="a" color="giga">
                  Get the Event Kit
                </Button>
              </Link>
              <Link href="/participation" passHref>
                <Button as="a" color="giga">
                  How to Participate
                </Button>
              </Link>
            </NewCard>
            <NewCard primary="surf" secondary="psybeam">
              <h3>New for 2022</h3>
              <p>
                Hacktoberfest isn’t all about code. Anyone who writes, designs,
                tests, mentors, or organizes offers much needed support for
                open-source projects all over the world.
              </p>
              <Link href="/about#low-or-non-code" passHref>
                <Button as="a" color="giga">
                  Learn About Non-Code Contributions
                </Button>
              </Link>
            </NewCard>
          </Column>
        </div>
      </Section>

      <Section id="events-all-month-long" style="right">
        <Divider style="reverse" />
        <Anchor href="#events-all-month-long" />
        <h2>Events All Month Long</h2>
        <h3>
          Join forces in virtual and in-person events to get your pull/merge
          requests done as a team, learn new skills, and meet lifelong friends.
        </h3>
        {events.map((event) => (
          <div key={event.title}>
            <h3>{event.title}</h3>
            <p>{event.content}</p>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <p>Location: {event.location}</p>
          </div>
        ))}

        <Link href="/events" passHref>
          <Button special as="a">
            See All Events
          </Button>
        </Link>
      </Section>

      <Section style="center">
        {/* <img
          src={osheart.src}
          alt="Girl in a jacket"
          width="1256"
          height="400"
        /> */}
        <h2>Support Open Source</h2>
        <h3>
          Open-source projects, maintained by community-minded coders, make the
          modern internet function. Supporting that essential work, and the
          folks behind it, is what Hacktoberfest is all about. <br />
          <br />
          You have skills that can help keep these projects continue
          running—let’s get to it.
        </h3>
        <Link href="/donate">
          <Button special as="a">
            Donate To Open-Source Projects
          </Button>
        </Link>
      </Section>
    </>
  );
};

export default Home;
