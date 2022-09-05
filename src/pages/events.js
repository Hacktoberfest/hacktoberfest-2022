import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import { fetchEvents, fetchSpeakers, organize, resources } from 'lib/events';
import { ContentSections } from 'components/content';
import { MarkdownInline } from 'components/markdown';
import Button from 'components/button';
import Divider from 'components/divider';
import Anchor from 'components/anchor';

export const StyledContainer = styled.div`
  margin: 0 42px;
  padding: 0;
  
  ${mQ(bp.xLargeDesktop, 'min')} {
    max-width: 1440px;
    margin: 0 auto;
  }
`;

export const StyledEventHero = styled.div`
  h1 {
    margin: 48px 0 40px;
    text-shadow: -1px -1px 6px rgba(255, 227, 126, 0.5), 1px 1px 6px rgba(144, 148, 255, 0.5);
  }
  
  h3 {
    font-family: 'Elevon';
    margin-bottom: 16px;
    text-shadow: -1px -1px 6px rgba(255, 227, 126, 0.5), 1px 1px 6px rgba(144, 148, 255, 0.5);
  }
`;

export const StyledEvents = styled.div`
  margin: 128px 0 64px;
`;

export const StyledHeader = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: ${props => props.reverse ? '1fr 3fr' : '3fr 1fr'};

  ${mQ(bp.tablet, 'max')} {
    grid-template-columns: 1fr;
  }

  p {
    margin: 16px 0 0;
  }

  .special {
    margin: 40px 0 0;
  }
`;

export const StyledHeaderTitle = styled.div`
  h2 {
    text-shadow: -1px -1px 6px rgba(255, 227, 126, 0.5), 1px 1px 6px rgba(144, 148, 255, 0.5);
  }
  
  ${mQ(bp.tablet, 'max')} {
    ${props => props.reverse ? '' : 'grid-row-start: 1'};
  }
`;

export const StyledEventsListItemEyebrow = styled.div`
  color: ${props => props.theme[props.color] || props.theme.text};
`;

export const StyledList = styled.div`
  margin: 64px 0 0;
  position: relative;
`;

export const StyledListItem = styled.div`
  border-top: 1px solid rgba(229, 225, 230, 0.5);
  padding: 40px 16px;
  text-transform: uppercase;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    content: '';
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, ${props => props.theme.spark} 0%, ${props => props.theme.surf} 50%, ${props => props.theme.psybeam} 100%);
  }

  h3 {
    margin: 16px 0;
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  ul {
    li {
      display: inline-block;
      margin: 0 40px 0 0;

      span {
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        opacity: 0.5;
      }
    }
  }
`;

export const StyledSpeakers = styled.div`
  margin: 126px 0 0;  
`;

export const StyledBrand = styled.div`
  margin: 126px 0 0;  
`;

export const StyledFAQ = styled.div`
  margin: 42px 0 0;

  &::after {
    position: relative;
    top: 16px;
    left: 0;
    display: block;
    content: '';
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, ${props => props.theme.spark} 0%, ${props => props.theme.surf} 50%, ${props => props.theme.psybeam} 100%);
  }

  h3 {
    margin-bottom: 20px;
    text-shadow: -1px -1px 6px rgba(255, 227, 126, 0.5), 1px 1px 6px rgba(144, 148, 255, 0.5);
  }

  details,
  div {
    margin: 16px 0;
  }

  details {
    ul {
      li {
        margin: 16px 0 16px 16px;
        list-style: disc;
      }
    }
  }
`;

export const StyledActions = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: fit-content(100%) fit-content(100%) fit-content(100%) fit-content(100%);

  ${mQ(bp.tablet, 'max')} {
    grid-template-columns: 1fr;
  }
`;

const typesToColors = {
  'virtual': 'giga',
  'premium-partner': 'psybeam',
  'community': 'surf',
  'in-person': 'giga',
  'digitalocean': 'giga',
};

const Events = ({ events, speakers }) => {
  const [ eventsCount, setEventsCount ] = useState(3);
  const eventsList = useMemo(() => events.slice(0, eventsCount), [ events, eventsCount ]);

  return (
    <StyledContainer>
      <StyledEventHero>
        <h1>Events for 2022</h1>
        <h3>Find what you need quickly</h3>
        <StyledActions>
          <Button as="a" href="#events" color="spark">Event List</Button>
          <Button as="a" href="#organizers" color="giga">Event Organizer Kit</Button>
          <Button as="a" href="#speakers" color="surf">Speakers & Facilitators</Button>
          <Button as="a" href="#brand" color="psybeam">Brand Guidelines</Button>
        </StyledActions>
      </StyledEventHero>

      <StyledEvents id="events">
        <StyledHeader reverse={true}>
          <StyledHeaderTitle reverse={true}>
            <Anchor href="#events" />
            <h2>Global Events</h2>
          </StyledHeaderTitle>
          <div>
            <Divider style="reverse" />
            <p>
              Hacktoberfest events are happening all month long so you can join your friends day or night, from dusk to dawn, as you work to complete your pull/merge requests.
            </p>
          </div>
        </StyledHeader>
        <StyledList>
          {eventsList.map(event => (
            <StyledListItem key={event.title}>
              {event.type.map(type => (
                <StyledEventsListItemEyebrow key={type} color={typesToColors[type.toLowerCase()] || 'surf'}>
                  {`[ ${type} ]`}
                </StyledEventsListItemEyebrow>
              ))}
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
            <p>
              Here are all the resources you need to plan and host a successful Hacktoberfest event.
              We encourage virtual events and have included a collection of tips and tricks that will help you keep participants engaged.
            </p>
            <Button special as="a" href="#">Download the Kit</Button>
          </div>
          <StyledHeaderTitle>
            <Anchor href="#organizers" />
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
            <Anchor href="#speakers" />
            <h2>Speakers &amp; Facilitators</h2>
          </StyledHeaderTitle>
          <div>
            <Divider style="reverse" />
            <p>
              Open source experts and community leaders are all in on Hacktoberfest.
              Find them helping contributors complete their pull/merge requests all month long in events throughout October.
            </p>
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
            <Divider />
            <p>
              If you plan to use the Hacktoberfest brand in promotional material, you’ll need to abide by our brand use guidelines
              Download them here and dive in.
            </p>
            <Button special as="a" href="#">Download the Hacktoberfest Brand Guidelines</Button>
          </div>
          <StyledHeaderTitle>
            <Anchor href="#brand" />
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
