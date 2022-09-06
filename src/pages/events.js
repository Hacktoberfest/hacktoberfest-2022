import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { fetchEvents, fetchSpeakers, organize, resources } from 'lib/events';

import { ContentSections } from 'components/content';
import { MarkdownInline } from 'components/markdown';
import Button from 'components/button';
import Divider from 'components/divider';
import Anchor from 'components/anchor';
import Section from 'components/section';

export const StyledEventsListItemEyebrow = styled.div`
  color: ${(props) => props.theme[props.color] || props.theme.text};
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
    background: linear-gradient(
      90deg,
      ${(props) => props.theme.spark} 0%,
      ${(props) => props.theme.surf} 50%,
      ${(props) => props.theme.psybeam} 100%
    );
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

export const StyledActions = styled.div`
  display: flex;
  gap: 24px;
  flex-flow: row wrap;
`;

const typesToColors = {
  virtual: 'giga',
  'premium-partner': 'psybeam',
  community: 'surf',
  'in-person': 'giga',
  digitalocean: 'giga',
};

const Events = ({ events, speakers }) => {
  const [eventsCount, setEventsCount] = useState(3);
  const eventsList = useMemo(
    () => events.slice(0, eventsCount),
    [events, eventsCount]
  );

  return (
    <>
      <Section>
        <h1>Events for 2022</h1>
        <h3>Find what you need quickly</h3>
        <StyledActions>
          <Button as="a" href="#events" color_bg="spark">
            Event List
          </Button>
          <Button as="a" href="#organizers" color_bg="giga">
            Event Organizer Kit
          </Button>
          <Button as="a" href="#speakers" color_bg="surf">
            Speakers & Facilitators
          </Button>
          <Button as="a" href="#brand" color_bg="psybeam">
            Brand Guidelines
          </Button>
        </StyledActions>
      </Section>

      <Section id="events">
        <Divider />
        <Anchor href="#events" />
        <h2>Global Events</h2>
        <p>
          Hacktoberfest events are happening all month long so you can join your
          friends day or night, from dusk to dawn, as you work to complete your
          pull/merge requests.
        </p>
        <StyledList>
          {eventsList.map((event) => (
            <StyledListItem key={event.title}>
              {event.type.map((type) => (
                <StyledEventsListItemEyebrow
                  key={type}
                  color={typesToColors[type.toLowerCase()] || 'surf'}
                >
                  {`[ ${type} ]`}
                </StyledEventsListItemEyebrow>
              ))}
              <h3>{event.title}</h3>
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
                  <a href={event.rsvp} rel="noreferrer noopener">
                    {event.rsvp}
                  </a>
                </li>
              </ul>
            </StyledListItem>
          ))}
          {eventsCount < events.length && (
            <Button
              special
              onClick={() => setEventsCount((count) => count + 3)}
            >
              Load More Events
            </Button>
          )}
        </StyledList>
      </Section>

      <Section id="organizers">
        <Divider />
        <Anchor href="#organizers" />
        <h2>Event Organizers</h2>
        <p>
          Here are all the resources you need to plan and host a successful
          Hacktoberfest event. We encourage virtual events and have included a
          collection of tips and tricks that will help you keep participants
          engaged.
        </p>
        <Button special as="a" href="#">
          Download the Kit
        </Button>

        <MarkdownInline string={organize.title} as="h4" />
        <ContentSections sections={organize.sections} titleAs="h5" />
        <MarkdownInline string={resources.title} as="h4" />
        <ContentSections sections={resources.sections} titleAs="h5" />
      </Section>

      <Section id="speakers">
        <Divider />
        <Anchor href="#speakers" />
        <h2>Speakers &amp; Facilitators</h2>
        <p>
          Open source experts and community leaders are all in on Hacktoberfest.
          Find them helping contributors complete their pull/merge requests all
          month long in events throughout October.
        </p>
        <StyledList>
          {speakers.map((speaker) => (
            <StyledListItem key={speaker.name}>
              <h3>{speaker.name}</h3>
              <ul>
                <li>
                  <span>Pronouns:</span> {speaker.pronouns}
                </li>
                <li>
                  <span>Location:</span> {speaker.location}
                </li>
                <li>
                  <span>Company:</span> {speaker.company}
                </li>
                <li>
                  <span>Social:</span>{' '}
                  <a href={speaker.social} target="_blank">
                    {speaker.social.replace(/^https?:\/\//, '')}
                  </a>
                </li>
                <li>
                  <span>Specialization:</span> {speaker.specialization}
                </li>
              </ul>
            </StyledListItem>
          ))}
        </StyledList>
      </Section>

      <Section id="brand">
        <Divider />
        <Anchor href="#brand" />
        <h2>Brand Guidelines</h2>
        <p>
          If you plan to use the Hacktoberfest brand in promotional material,
          you’ll need to abide by our brand use guidelines Download them here
          and dive in.
        </p>
        <Button special as="a" href="#">
          Download the Hacktoberfest Brand Guidelines
        </Button>
      </Section>
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
