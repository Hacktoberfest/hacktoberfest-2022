import Link from 'next/link';
import Button from 'components/button';
import { events } from 'lib';

const Home = () => {
  return (
    <>
      <h1>Registration Begins<br />September 26</h1>

      <div>
        <h2>Prepare to Hack</h2>
        <p>
          Hacktoberfest is for everyone.
          Whether it’s your first time—or your ninth—it’s almost time to hack out four pristine pull/merge requests and
          complete your mission for open source.
          Join other members of the open-source community on the Hacktoberfest Discord.
        </p>
        <Button special as="a" href="https://discord.gg/hacktoberfest">Join the Hacktoberfest Discord</Button>
      </div>

      <div>
        <h3>Preptember</h3>
        <p>
          September is the perfect time to prepare for Hacktoberfest.
          Get a jump start by finding projects to contribute to, adding the ‘hacktoberfest’ tag to your projects, or familiarizing yourself with Git.
        </p>
        <Link href="/events#kit" passHref>
          <Button as="a" color="giga">Get the Event Kit</Button>
        </Link>
        <Link href="/participation" passHref>
          <Button as="a" color="giga">How to Participate</Button>
        </Link>
      </div>

      <div>
        <h3>New for 2022</h3>
        <p>
          Hacktoberfest isn’t all about code.
          Anyone who writes, designs, tests, mentors, or organizes offers much needed support for open-source projects all over the world.
        </p>
        <Link href="/about#non-code" passHref>
          <Button as="a" color="giga">Learn About Non-Code Contributions</Button>
        </Link>
      </div>

      <div>
        <h2>Events All Month Long</h2>
        <p>
          Join forces in virtual and in-person events to get your pull/merge requests done as a team, learn new skills, and meet lifelong friends.
        </p>

        {events.map(event => (
          <div key={event.title}>
            <h3>{event.title}</h3>
            <p>{event.content}</p>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <p>Location: {event.location}</p>
          </div>
        ))}

        <Link href="/events" passHref>
          <Button special as="a">See All Events</Button>
        </Link>
      </div>

      <div>
        <h2>Support Open Source</h2>
        <p>
          Open-source projects, maintained by community-minded coders, make the modern internet function.
          Supporting that essential work, and the folks behind it, is what Hacktoberfest is all about.
        </p>
        <p>
          You have skills that can help keep these projects continue running—let’s get to it.
        </p>
        <Link href="/donate">
          <Button special as="a">Donate To Open-Source Projects</Button>
        </Link>
      </div>
    </>
  );
};

export default Home;
