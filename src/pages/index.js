import Link from 'next/link';

const Home = () => {
    return (
        <>
            <h1>Registration Begins<br/>September 26</h1>

            <div>
                <h2>Prepare to Hack</h2>
                <p>
                    Hacktoberfest is for everyone.
                    Whether it’s your first time —or your ninth, it’s almost time to hack out four pristine pull/merge requests and complete your mission for open source.
                    Join other members of the open source community on the Hacktoberfest Discord.
                </p>
                <a href="https://discord.gg/hacktoberfest">Join the Hacktoberfest Discord</a>
            </div>

            <div>
                <h3>Preptember</h3>
                <p>
                    September is the perfect time to prepare for Hacktoberfest.
                    Jump start by choosing projects to contribute to, helping maintainers add the ‘hacktoberfest’ tag to their projects, or familiarizing yourself with Git.
                </p>
                <Link href="/events#kit">Get the Event Kit</Link>
                <Link href="/resources">View Resources</Link>
            </div>

            <div>
                <h3>New for 2022</h3>
                <p>
                    Hacktoberfest isn’t all about code.
                    Keyboard jockeys who write, design, test, mentor, or organize all offer much needed support for open-source projects all over the world.
                </p>
                <Link href="/about#non-code">Learn About Non-Code Contributions</Link>
            </div>

            <div>
                <h2>Events All Month Long</h2>
                <p>
                    It’s dangerous to code alone.
                    Join forces in virtual and in-person events to get your pull/merge requests done as a team, learn new skills, and meet lifelong friends.
                </p>
                <Link href="/events">View &amp; Organize Events</Link>
            </div>

            <div>
                <h3>Hacktoberfest Kick-Off</h3>
                <p>
                    The official beginning of Hacktoberfest.
                    Join DigitalOcean developers as we begin the month-long hacking event you’ve been waiting for.
                </p>
                <ul>
                    <li>Date: September 29</li>
                    <li>Time: 00:00</li>
                    <li>Location: Online</li>
                </ul>
            </div>

            <div>
                <h3>H-Fest Hack Party</h3>
                <p>
                    Get started with non-code contributions to Hacktoberfest no matter your experience level.
                </p>
                <ul>
                    <li>Date: October 5</li>
                    <li>Time: 17:30-19:30 EST</li>
                    <li>Location: WeWork NY</li>
                </ul>
            </div>

            <div>
                <h2>Support Open Source</h2>
                <p>
                    Hacktoberfest is for everyone.
                    Whether it’s your first time —or your ninth, it’s almost time to hack out four pristine pull/merge requests and complete your mission for open source.
                    Join other members of the open source community on the Hacktoberfest Discord.
                </p>
                <Link href="/donate">Donate to Projects in Need</Link>
            </div>
        </>
    );
};

export default Home;
