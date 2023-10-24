import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';

import { organize, organizeDisclaimer, resources } from 'lib/events';

import Divider from 'components/Divider';
import Section from 'components/Section';
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

import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledAccordionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

export const StyledPromoteSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  ${mQ(bp.tablet)} {
    grid-template-columns: ${(339/1280) * 100}% ${(917/1280) * 100}%;
  }
`;

const Events = () => {
  return (
    <>
      <Head>
        <title>Events | Hacktoberfest 2023</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Events | Hacktoberfest 2023"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Events | Hacktoberfest 2023"
        />
      </Head>

      <DorknamicIsland>
        <a href="#events">Events</a>
        <a href="#organizers">Organizers</a>
        <a href="#resources">Resources</a>
        <a href="#brand">Brand Guidelines</a>
      </DorknamicIsland>

      <HeroSecondary
        title="Events"
        icon={<PixelEvents timing="5" />}
      />

      <Container>
        <Section id="events">
          <SpotHeader
            image={{
              src: IlloDOPumpkin.src,
              alt: ''
            }}
            content={{
              size: 'xl',
              title: 'Global Events',
              children: 'Hacktoberfest events are happening all month long so you can join your friends day or night, from dusk to dawn, as you work to complete your pull/merge requests. Whether your event is in-person, virtual or a combination of both, make sure you let the community know about it! Set up and share your Hacktoberfest event with the community.  Register for a Major League Hacking account and start creating your event today!',
              links: [{
                id: 'global-event-link-1',
                target: '_blank',
                href: 'https://hackp.ac/hacktoberfest-organizehq',
                children: 'Create New Event'
              }, {
                id: 'global-event-link-2',
                target: '_blank',
                href: 'https://hackp.ac/hacktoberfest-ohqlandingpage',
                children: 'View All Events'
              }]
            }}
          />

          {/* <Divider type="doubledashed" /> */}
        </Section>
      </Container>

      <Container>
        <Divider type="pixel" />
        <Section id="organizers">
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
                children: 'Download the Event Kit'
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
                <React.Fragment key={section.title}>
                  <Accordion
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
                </React.Fragment>
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
        <Section id="resources">
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

        <Section small>
          <ContentMaster
            size="md"
            title={resources.sections[3].title}
            titleTag="h3"
            links={resources.sections[3].links}
          >
            {resources.sections[3].content}
          </ContentMaster>
        </Section>
      </Container>

      <Container>
        <Divider type="pixel" />
        <Section id="brand">
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
                rel: "noreferrer noopener",
                href: 'https://do.co/hacktoberbrand',
                children: 'View Brand Guidelines'
              }
            }}
          />
        </Section>
      </Container>
    </>
  );
};

export default Events;
