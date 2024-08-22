import Head from 'next/head';
import React, { useCallback, useRef, useState } from 'react';
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
import Form from 'components/form';
import Select from 'components/Select';
import Input from 'components/Input';
import ButtonMain from 'components/ButtonMain';
import { dropdownCountries } from 'components/profile/metadata-fields';

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

export const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: flex-start;
`;

export const StyledFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 60px 64px;
  width: 100%;

  ${mQ(bp.tablet)} {
    grid-template-columns: repeat(2, 1fr);
  }

  > *:last-child {
    grid-column: 1/-1;
  }
`;

const Events = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    city: '',
    eventName: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // Handle form submission
  const form = useRef();
  const submit = useCallback(async (e) => {
    e.preventDefault();
    if (disabled) return;
    setDisabled(true);
    setError(null);
    setSuccess(false);

    if (!form.current?.reportValidity()) {
      setDisabled(false);
      setError('Please fill out all the fields.');
      return;
    }

    console.log(formData);
  }, []);

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
        icon={<img src={asciiEvents.src} alt="" />}
      />

      <Section id="events">
        <Container>
          <StyledSectionSpacing>
            <ContentSide>
              <ContentMaster
                size="xl"
                title={globalEvents.title}
                titleCursorColor={theme.colors.black}
              />
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
            <ContentMaster
              size="xl"
              title={eventOrganizers.title}
              titleCursorColor={theme.colors.black}
            />
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
            <ContentSide>
              <ContentMaster
                size="xl"
                title={organize.title}
                titleCursorColor={theme.colors.black}
              />
            </ContentSide>

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
            <ContentMaster size="xl">{register.content}</ContentMaster>
          </ContentSide>
        </Container>
      </Section>

      <Section bgColor={theme.colors.black} color={theme.colors.typography}>
        <Container>
          <Form
            ref={form}
            onSubmit={submit}
            success={success && 'Something should go here'}
            error={error}
          >
            <StyledFormContainer>
              <StyledFormGrid>
                <Input
                  name="name"
                  label="Name"
                  placeholder="First and last name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={disabled}
                  required
                />

                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="hacker@digitalocean.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={disabled}
                  required
                />

                <Select
                  name="country"
                  label="Country"
                  value={formData.country}
                  items={dropdownCountries}
                  onChange={handleChange}
                  disabled={disabled}
                  isDark
                  required
                />

                <Input
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={disabled}
                  required
                />

                <Input
                  name="eventName"
                  label="Event name"
                  placeholder="Hackathon"
                  value={formData.eventName}
                  onChange={handleChange}
                  disabled={disabled}
                  required
                />

                <Select
                  name="eventType"
                  label="Event type"
                  value={formData.eventType}
                  items={[
                    ['In-Person', 'In-person'],
                    ['Virtual', 'Virtual'],
                    ['Hybrid', 'Hybrid'],
                  ]}
                  onChange={handleChange}
                  disabled={disabled}
                  isDark
                  required
                />

                <Input
                  type="date"
                  name="eventDate"
                  label="Event date"
                  value={formData.eventDate}
                  onChange={handleChange}
                  disabled={disabled}
                  isDark
                  required
                />

                <Input
                  type="time"
                  name="eventTime"
                  label="Event time"
                  value={formData.eventTime}
                  onChange={handleChange}
                  disabled={disabled}
                  isDark
                  required
                />

                <Input
                  name="eventLocation"
                  label="Event location"
                  placeholder="101 Avenue of the Americas, 10th Floor"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  disabled={disabled}
                  required
                />
              </StyledFormGrid>

              <ButtonMain
                size="lg"
                as="button"
                type="submit"
                variant="primary-green"
                onClick={submit}
                disabled={disabled}
              >
                Submit
              </ButtonMain>
            </StyledFormContainer>
          </Form>
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
              titleCursorColor: theme.colors.black,
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
