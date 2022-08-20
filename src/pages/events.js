import { fetchEvents, fetchSpeakers } from 'lib/events';
import { useMemo, useState } from 'react';

const Events = ({ events, speakers }) => {
    const [ eventsCount, setEventsCount ] = useState(3);
    const eventsList = useMemo(() => events.slice(0, eventsCount), [ events, eventsCount ]);

    return (
        <>
            <h1>Events for 2022</h1>

            <div>
                <h2>Global Events</h2>
                <p>
                    Hacktoberfest events are happening all month long so you can join your friends day or night, from
                    dusk to dawn, as you work to complete your pull/merge requests.
                </p>

                <div>
                    { eventsList.map(event => (
                        <div key={ event.title }>
                            <p>{ event.type.map(type => `[ ${type} ]`).join(' ') }</p>
                            <h3>{ event.title }</h3>
                            <ul>
                                <li>Location: { event.location }</li>
                                <li>Date: { event.date }</li>
                                <li>Time: { event.time }</li>
                                <li>Format: { event.format.join(', ') }</li>
                            </ul>
                        </div>
                    )) }
                </div>

                { eventsCount < events.length &&
                    <button onClick={() => setEventsCount(count => count + 3)}>Load More Events</button> }
            </div>

            <div>
                <h2>Event Organizers</h2>
                <p>
                    This kit gives you all that you need to host a successful Hacktoberfest event. We encourage virtual
                    events and have included a collection of tips and tricks that will help you keep participants
                    engaged.
                </p>
                <a href="">Download the Kit</a>

                <div>
                    <h3>Create an Online Meet Up</h3>
                </div>

                <div>
                    <h3>Video Platforms &amp; Resources for Online Meetups</h3>
                </div>

                <div>
                    <h3>Promoting Your Event</h3>
                </div>
            </div>

            <div>
                <h2>Speakers &amp; Facilitators</h2>
                <p>
                    This needs copy. Whether it’s your first time —or your ninth, it’s almost time to hack out four
                    pristine pull/merge requests and complete your mission for open source. Join other members of the
                    open source community on the Hacktoberfest Discord.
                </p>

                <div>
                    { speakers.map(speaker => (
                        <div key={speaker.name}>
                            <h3>{speaker.name}</h3>
                            <ul>
                                <li>Pronouns: {speaker.pronouns}</li>
                                <li>Location: {speaker.location}</li>
                                <li>Company: {speaker.company}</li>
                                <li>Social: {speaker.social}</li>
                            </ul>
                        </div>
                    )) }
                </div>
            </div>

            <div>
                <h2>Brand Guidelines</h2>
                <p>
                    This Needs copy. kit gives you all that you need to host a successful Hacktoberfest event! We
                    encourage virtual events and have included tips and tricks to keep participants engaged
                    virtually.
                </p>
                <a href="">Download the Hacktoberfest Brand Guidelines</a>
            </div>
        </>
    );
};

export const getStaticProps = async () => {
    const events = await fetchEvents();
    const speakers = await fetchSpeakers();

    return {
        props: {
            events,
            speakers,
        },
    };
};

export default Events;
