import Head from 'next/head';
import React from 'react';
import styled, { useTheme } from 'styled-components';

import {
  brand,
  eventOrganizers,
  globalEvents,
  organize,
  organizeDisclaimer,
  register,
} from 'lib/events';

import Divider from 'components/Divider';
import Section from 'components/Section';
import DorknamicIsland from 'components/dorknamic-island';

import HeroSecondary from 'components/HeroSecondary';
import SpotHeader from 'components/SpotHeader';
import Container from 'components/Container';

import asciiEvents from 'assets/img/ascii-events.svg';
import asciiBrandKit from 'assets/img/ascii-brandkit.svg';
import Accordion from 'components/Accordion';
import ContentMaster from 'components/ContentMaster';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import createMetaTitle from 'lib/createMetaTitle';
import ContentSide from 'components/ContentSide';
import { StyledSectionSpacing } from 'styles/sharedStyles';
import SectionDivider from 'components/SectionDivider';
import { events } from 'lib';
import Event from 'components/Event';

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
    grid-template-columns: ${(339 / 1280) * 100}% ${(917 / 1280) * 100}%;
  }
`;

export const StyledEvents = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const Events = () => {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>{createMetaTitle('Events')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('Events')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('Events')}
        />
      </Head>

      <DorknamicIsland>
        <a href="#events">Events</a>
        <a href="#organizers">Organizers</a>
        <a href="#register">Register</a>
        <a href="#brand">Brand Guidelines</a>
      </DorknamicIsland>

      <HeroSecondary
        title="Events"
        icon={<img src={asciiEvents.src} alt="" width="608" height="608" />}
      />

      <Section id="events">
        <Container>
          <StyledSectionSpacing>
            <ContentSide>
              <ContentMaster size="xl" title={globalEvents.title} />
              <ContentMaster links={[globalEvents.cta]}>
                {globalEvents.content}
              </ContentMaster>
            </ContentSide>

            <Divider type="doubledashed" />

            <StyledEvents>
              {events.map((event, index) => (
                <React.Fragment key={event.title}>
                  <li>
                    <Event
                      eyebrow={`[${event.location}]`}
                      title={event.title}
                      content={event.content}
                      date={event.date}
                      time={event.time}
                      rsvp={event.rsvp}
                      buttonVariant="secondary-deep-pink"
                    />
                  </li>
                  {index !== events.length - 1 && (
                    <li aria-hidden>
                      <Divider />
                    </li>
                  )}
                </React.Fragment>
              ))}
            </StyledEvents>

            <Divider type="doubledashed" />
          </StyledSectionSpacing>
        </Container>
      </Section>

      <SectionDivider
        bgColor={theme.colors.green}
        fgColor={theme.colors.typography}
        isFlipped
      />

      <Section id="organizers" bgColor={theme.colors.green}>
        <Container>
          <ContentSide>
            <ContentMaster size="xl" title={eventOrganizers.title} />
            <ContentMaster>{eventOrganizers.content}</ContentMaster>
          </ContentSide>
        </Container>
      </Section>

      <SectionDivider
        align="right"
        bgColor={theme.colors.green}
        fgColor={theme.colors.typography}
      />

      <Section>
        <Container>
          <StyledSectionSpacing>
            <StyledAccordionGroup>
              <div>
                {organize.sections.map((section, index) => (
                  <React.Fragment key={section.title}>
                    <Accordion title={section.title} collapsed>
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
          </StyledSectionSpacing>
        </Container>
      </Section>

      <SectionDivider
        align="right"
        bgColor={theme.colors.typography}
        fgColor={theme.colors.black}
      />

      <Section
        id="register"
        bgColor={theme.colors.black}
        color={theme.colors.typography}
      >
        <Container>
          <ContentSide>
            <ContentMaster size="xl" title={register.title} />
            <ContentMaster size="xl" cta={register.cta}>
              {register.content}
            </ContentMaster>
          </ContentSide>
        </Container>
      </Section>

      <SectionDivider
        bgColor={theme.colors.typography}
        fgColor={theme.colors.black}
        isFlipped
      />

      <Section id="brand">
        <Container>
          <SpotHeader
            image={{
              src: asciiBrandKit.src,
              alt: '',
            }}
            content={{
              size: 'xl',
              title: brand.title,
              children: brand.content,
              links: brand.links,
            }}
          />
        </Container>
      </Section>
    </>
  );
};

export default Events;
