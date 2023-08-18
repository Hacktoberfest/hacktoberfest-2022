import Head from 'next/head';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { fetchEvents, fetchSpeakers, organize, organizeDisclaimer, resources } from 'lib/events';
import { registrationEnd, registrationStart } from 'lib/config';

import { ContentSections } from 'components/content';
import { MarkdownInline } from 'components/markdown';
import Button from 'components/button';
import Divider from 'components/Divider';
import Anchor from 'components/anchor';
import Section from 'components/Section';
import Hero from 'components/Hero';
import { PixelGlobe } from 'components/pixels';
import DorknamicIsland from 'components/dorknamic-island';

import eventKitZip from 'assets/event-kit.zip';
import HeroSecondary from 'components/HeroSecondary';
import PixelEvents from 'components/pixels/PixelEvents';
import SpotHeader from 'components/SpotHeader';
import Container from 'components/Container';

import IlloDOPumpkin from 'assets/img/8bit-do-pumpkin.svg';
import IlloShip from 'assets/img/8bit-ship.svg';
import IlloBeer from 'assets/img/8bit-beer.svg';
import IlloHacktoberfest from 'assets/img/8bit-hacktoberfest.svg';

import Accordion from 'components/Accordion';
import ContentMaster from 'components/ContentMaster';
import DividerRow from 'components/DividerRow';

export const StyledEventsListItemEyebrow = styled.div`
  color: ${(props) => props.theme[props.color] || props.theme.text};
`;

export const StyledList = styled.div`

`;

export const StyledListItem = styled.div`

`;

export const StyledSubText = styled.p`
  margin: 32px 0;
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
  opacity: 0.75;
  text-shadow: ${(props) => props.theme.smallTextShadow};
`;

export const StyledSearch = styled.input`
  padding: 16px;
  width: 100%;
  height: 56px;
  background: linear-gradient(
    90deg,
    rgba(255, 226, 125, 0.1) 0%,
    rgba(100, 227, 255, 0.1) 50.52%,
    rgba(145, 146, 255, 0.1) 100%
  );
  border: 1px solid ${(props) => props.theme.text};
  border-radius: 4px;
  color: ${(props) => props.theme.text};

  &::placeholder {
    color: ${(props) => props.theme.text};
  }
`;

export const StyledAccordionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

export const StyledPromoteSection = styled.div`
  display: grid;
  grid-template-columns: ${(339/1280) * 100}% ${(917/1280) * 100}%;
  gap: 24px;
`;

const typesToColors = {
  virtual: 'giga',
  'premium-partner': 'psybeam',
  community: 'surf',
  'in-person': 'giga',
  digitalocean: 'giga',
};

const Events = ({ events, speakers }) => {
  const [eventsSearch, setEventsSearch] = useState('');
  const eventsFiltered = useMemo(
    () =>
      events.filter((event) =>
        event.title.toLowerCase().includes(eventsSearch.toLowerCase())
        || event.location.toLowerCase().includes(eventsSearch.toLowerCase())
      ),
    [events, eventsSearch]
  );

  const [eventsCount, setEventsCount] = useState(3);
  const eventsList = useMemo(
    () => eventsFiltered.slice(0, eventsCount),
    [eventsFiltered, eventsCount]
  );

  const hasRegistrationEnded = useMemo(() => new Date() >= new Date(registrationEnd), []);

  return (
    <>
      <Head>
        <title>Events | Hacktoberfest 2022</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Events | Hacktoberfest 2022"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Events | Hacktoberfest 2022"
        />
      </Head>

      <DorknamicIsland>
        <a href="#events">Events</a>
        <a href="#organizers">Organizers</a>
        <a href="#speakers">Speakers</a>
        <a href="#brand">Brand Guidelines</a>
      </DorknamicIsland>

      <HeroSecondary
        title="Events"
        icon={
          <PixelEvents
            width="1020"
            scale="1"
            timing="5"
            frames="3"
            id="f3"
          />
        }
      />

      <Container>
        <Section>
          <SpotHeader
            image={{
              src: IlloDOPumpkin.src,
              alt: ''
            }}
            content={{
              size: 'xl',
              title: 'Global events',
              children: 'Hacktoberfest events are happening all month long so you can join your friends day or night, from dusk to dawn, as you work to complete your pull/merge requests.'
            }}
          />

          <Divider type="doubledashed" />
        </Section>
      </Container>

      <Container>
        <Divider type="pixel" />
        <Section>
          <SpotHeader
            image={{
              src: IlloShip.src,
              alt: ''
            }}
            content={{
              size: 'xl',
              title: 'Event Organizers',
              children: 'Here are all the resources you need to plan and host a successful Hacktoberfest event. We encourage virtual events and have included a collection of tips and tricks that will help you keep participants engaged.',
              cta: {
                size: 'lg',
                href: eventKitZip,
                children: 'Download the event kit'
              }
            }}
          />
        </Section>
        <Divider type="pixel" />
      </Container>

      <Container inner>
        <Section>
          <StyledAccordionGroup>
            <ContentMaster
              size="xl"
              title={organize.title}
            />

            <div>
              {organize.sections.map((section, index) => (
                <>
                  <Accordion
                    key={section.title}
                    title={section.title}
                    collapsed
                  >
                    {section.items && (
                    <ContentMaster size="md">
                      {section.items[0]}
                    </ContentMaster>
                    )}
                  </Accordion>
                  <Divider />
                </>
              ))}
            </div>

            <ContentMaster size="xl">
              {organizeDisclaimer.content}
            </ContentMaster>
          </StyledAccordionGroup>
        </Section>
      </Container>

      <Container>
        <Divider type="pixel" />
        <Section>
          <SpotHeader
            image={{
              src: IlloBeer.src,
              alt: ''
            }}
            content={{
              size: 'xl',
              eyebrow: resources.eyebrow,
              title: resources.title,
              children: resources.content
            }}
          />
        </Section>

        <Divider type="doubledashed" />

        <DividerRow>
          <ContentMaster
            size="md"
            title={resources.sections[0].title}
            titleTag="h3"
          >
            {resources.sections[0].content}
          </ContentMaster>
          <ContentMaster
            size="md"
            title={resources.sections[1].title}
            titleTag="h3"
          >
            {resources.sections[1].content}
          </ContentMaster>
        </DividerRow>

        <Divider type="doubledashed" />

        <Section small>
          <StyledPromoteSection>
            <ContentMaster
              size="md"
              title={resources.sections[2].title}
              titleTag="h3"
            />
            <ContentMaster size="md">
              {resources.sections[2].content}
            </ContentMaster>
          </StyledPromoteSection>
        </Section>

        <Divider type="doubledashed" />

        <DividerRow>
          <ContentMaster
            size="md"
            title={resources.sections[3].title}
            titleTag="h3"
            links={resources.sections[3].links}
          >
            {resources.sections[3].content}
          </ContentMaster>
          <ContentMaster
            size="md"
            title={resources.sections[4].title}
            titleTag="h3"
          >
            {resources.sections[4].content}
          </ContentMaster>
        </DividerRow>

        <Divider type="doubledashed" />
      </Container>

      <Container inner>
        <Section>
          <ContentMaster
            size="xl"
            title="Speakers and Facilitators"
          >
            Open source experts and community leaders are all in on Hacktoberfest. Find them helping contributors complete their pull/merge requests all month long in events throughout October.
          </ContentMaster>
        </Section>
      </Container>

      <Container>
        <Divider type="pixel" />
        <Section>
          <SpotHeader
            image={{
              src: IlloHacktoberfest.src,
              alt: ''
            }}
            content={{
              size: 'xl',
              title: 'Brand Guidelines',
              children: 'If you plan to use the Hacktoberfest brand in promotional material, you’ll need to abide by our brand use guidelines. Access them here and dive in.',
              cta: {
                size: 'lg',
                target: '_blank',
                href: 'https://do.co/hacktoberbrand',
                children: 'View Brand Guidelines'
              }
            }}
          />
        </Section>
      </Container>

      {/* <Section type="sub_content" id="events">
        <Divider />
        <Anchor href="#events" />
        <h2>Global Events</h2>
        <StyledSubText>
          Hacktoberfest events are happening all month long so you can join your
          friends day or night, from dusk to dawn, as you work to complete your
          pull/merge requests.
        </StyledSubText>
        {hasRegistrationEnded ? (
          <StyledList>
            <p>
              [ Hacktoberfest #{new Date(registrationStart).getFullYear() - 2013} {new Date(registrationStart).getFullYear()} has now ended. ]
              <br/>
              [ We look forward to seeing you for Hacktoberfest {new Date(registrationStart).getFullYear() + 1}, where we can host even more events! ]
            </p>
          </StyledList>
        ) : (
          <>
            <StyledSearch
              type="text"
              placeholder="[ Search events... ]"
              value={eventsSearch}
              onChange={(e) => setEventsSearch(e.target.value)}
            />
            <StyledList>
              {events.length === 0 && (
                <p>[ Sorry, there are no events listed currently ]</p>
              )}
              {events.length > 0 && eventsList.length === 0 && (
                <p>[ Sorry, no events matched your search query ]</p>
              )}
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
                      <a
                        href={event.rsvp}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {event.rsvp}
                      </a>
                    </li>
                  </ul>
                </StyledListItem>
              ))}
              {eventsCount < eventsFiltered.length && (
                <Button
                  special
                  onClick={() => setEventsCount((count) => count + 3)}
                >
                  Load More Events
                </Button>
              )}
            </StyledList>
          </>
        )}
      </Section> */}

      {/* <Section type="sub_content" id="organizers">
        <Divider />
        <Anchor href="#organizers" />
        <h2>Event Organizers</h2>
        <p>
          Here are all the resources you need to plan and host a successful
          Hacktoberfest event. We encourage virtual events and have included a
          collection of tips and tricks that will help you keep participants
          engaged.
        </p>
        <Button special as="a" href={eventKitZip}>
          Download the Kit
        </Button>

        <MarkdownInline string={organize.title} as="h4" />
        <ContentSections sections={organize.sections} titleAs="h5" />
        <MarkdownInline string={resources.title} as="h4" />
        <ContentSections sections={resources.sections} titleAs="h5" />
      </Section> */}

      {/* <Section type="sub_content" id="speakers">
        <Divider />
        <Anchor href="#speakers" />
        <h2>Speakers &amp; Facilitators</h2>
        <p>
          Open source experts and community leaders are all in on Hacktoberfest.
          Find them helping contributors complete their pull/merge requests all
          month long in events throughout October.
        </p>
        {hasRegistrationEnded ? (
          <StyledList>
            <p>
              [ Hacktoberfest #{new Date(registrationStart).getFullYear() - 2013} {new Date(registrationStart).getFullYear()} has now ended. ]
              <br/>
              [ We look forward to seeing you for Hacktoberfest {new Date(registrationStart).getFullYear() + 1}, where we can host even more events! ]
            </p>
          </StyledList>
        ) : (
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
                    <a
                      href={speaker.social}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
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
        )}
      </Section> */}

      {/* <Section type="sub_content" id="brand">
        <Divider />
        <Anchor href="#brand" />
        <h2>Brand Guidelines</h2>
        <p>
          If you plan to use the Hacktoberfest brand in promotional material,
          you’ll need to abide by our brand use guidelines. Access them here and
          dive in.
        </p>
        <Button
          special
          as="a"
          href="https://do.co/hacktoberbrand"
          target="_blank"
          rel="noreferrer noopener"
        >
          View the Hacktoberfest Brand Guidelines
        </Button>
      </Section> */}
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
