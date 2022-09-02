import { useMemo, useState } from 'react';
import { fetchEvents, fetchSpeakers, organize, resources } from '../../lib/events';
import { ContentSections } from 'components/content';
import { MarkdownInline } from 'components/markdown';

import Button from 'components/button';
import Divider from 'components/divider';
import Anchor from 'components/anchor';
import Collapse from 'components/collapse';

import { 
  StyledContainer,
  StyledActions,
  StyledHeader,
  StyledHeaderTitle,
  StyledEvents,
  StyledEventHero,
  StyledList,
  StyledListItem,
  StyledEventsListItemEyebrow,
  StyledSpeakers,
  StyledBrand,
  StyledFAQ,
} from './Styles';

const typesToColors = {
  'Virtual': 'giga',
  'Premium-Partner': 'psybeam',
  'Community': 'surf',
  'In-person': 'giga',
  'Digitalocean': 'giga',
}

const Events = ({ events, speakers }) => {
  const [ eventsCount, setEventsCount ] = useState(3);
  const eventsList = useMemo(() => events.slice(0, eventsCount), [ events, eventsCount ]);
  return (
    <StyledContainer>

      <StyledEventHero>
        <h1>Events for 2022</h1>
        <h3>Find what you need quickly</h3>
        <StyledActions>
        <Button as="a" href="#" color="spark">Event List</Button>
        <Button as="a" href="#" color="giga">Event Organizer Kit</Button>
        <Button as="a" href="#" color="surf">Speakers & Facilitators</Button>
        <Button as="a" href="#" color="psybeam">Brand Guidelines</Button>
        </StyledActions>
      </StyledEventHero>

      <StyledEvents id="events">
        <StyledHeader reverse={true}>
          <StyledHeaderTitle reverse={true}>
            <Anchor href="#prepare-to-hack" />
            <h2>Global Events</h2>
          </StyledHeaderTitle>
          <div>
            <Divider style="reverse" />
            <p>Hacktoberfest events are happening all month long so you can join your friends day or night, from dusk to dawn, as you work to complete your pull/merge requests.</p>
          </div>
        </StyledHeader>
        <StyledList>
          {eventsList.map(event => (
            <StyledListItem key={event.title} >
              {event.type.map(type => 
                <StyledEventsListItemEyebrow color={'surf'}>
                { `[ ${type} ]`}
                </StyledEventsListItemEyebrow>
              )}
              <h3>{event.title}</h3>
              <ul>
                <li><span>Location:</span> {event.location}</li>
                <li><span>Date:</span> {event.date}</li>
                <li><span>Time:</span> {event.time}</li>
                <li><span>Format:</span> {event.format.join(', ')}</li>
                <li><span>RSVP:</span> <a href={event.rsvp} rel="noreferrer noopener">{event.rsvp}</a></li>
              </ul>
            </StyledListItem>
          ))}
        {eventsCount < events.length &&
          <Button special onClick={() => setEventsCount(count => count + 3)}>Load More Events</Button>}
        </StyledList>
      </StyledEvents>

      <div id="organizers">
        <StyledHeader>
          <div>
            <Divider />
            <p>Here are all the resources you need to plan and host a successful Hacktoberfest event. We encourage virtual events and have included a collection of tips and tricks that will help you keep participants engaged.</p>
            <Button special as="a" href="#" >Download the Kit</Button>
          </div>
          <StyledHeaderTitle>
            <Anchor href="#prepare-to-hack" />
            <h2>Event Organizers</h2>
          </StyledHeaderTitle>
        </StyledHeader>
      </div>

      <StyledFAQ>
        <MarkdownInline string={organize.title} as="h3" />
        <ContentSections sections={organize.sections} titleAs="h4" />
      </StyledFAQ>

      <StyledFAQ>
        <MarkdownInline string={resources.title} as="h3" />
        <ContentSections sections={resources.sections} titleAs="h4" />
      </StyledFAQ>

      <StyledSpeakers id="speakers">
        <StyledHeader reverse={true}>
          <StyledHeaderTitle reverse={true}>
            <Anchor href="#prepare-to-hack" />
            <h2>Speakers &amp; Facilitators</h2>
          </StyledHeaderTitle>
          <div>
            <Divider style="reverse" />
            <p>This needs copy. Whether it’s your first time —or your ninth, it’s almost time to hack out four
          pristine pull/merge requests and complete your mission for open source. Join other members of the
          open source community on the Hacktoberfest Discord.</p>
          </div>
        </StyledHeader>
        <StyledList>
          {speakers.map(speaker => (
            <StyledListItem key={speaker.name}>
              <h3>{speaker.name}</h3>
              <ul>
                <li><span>Pronouns:</span> {speaker.pronouns}</li>
                <li><span>Location:</span> {speaker.location}</li>
                <li><span>Company:</span> {speaker.company}</li>
                <li><span>Social:</span> <a href={speaker.social} target="_blank">{speaker.social.replace(/^https?:\/\//, '')}</a></li>
                <li><span>Specialization:</span> {speaker.specialization}</li>
              </ul>
            </StyledListItem>
          ))}
        </StyledList>
      </StyledSpeakers>


      <StyledBrand id="brand">
        <StyledHeader>
          <div>
            <Divider/>
            <p>If you plan to use the Hacktoberfest brand in promotional material, you’ll need to abide by our brand use guidelines. Download them here and dive in.</p>
            <Button special as="a" href="#" >Download the Hacktoberfest Brand Guidelines</Button>
          </div>
          <StyledHeaderTitle>
            <Anchor href="#prepare-to-hack" />
            <h2>Brand Guidelines</h2>
          </StyledHeaderTitle>
        </StyledHeader>
      </StyledBrand>
    </StyledContainer>
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
