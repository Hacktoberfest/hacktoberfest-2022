import Head from 'next/head';
import React from 'react';
import styled, { useTheme } from 'styled-components';

import {
  brand,
  eventOrganizers,
  globalEvents,
  organize,
  register,
} from 'lib/events';

import Divider from 'components/Divider';
import Section from 'components/Section';

import HeroSecondary from 'components/HeroSecondary';
import Container from 'components/Container';

import hero from 'assets/img/heroes/events.svg';
import potion from 'assets/img/potion.svg';
import Accordion from 'components/Accordion';
import ContentMaster from 'components/ContentMaster';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import createMetaTitle from 'lib/createMetaTitle';
import ContentSide from 'components/ContentSide';
import { StyledSectionSpacing } from 'styles/sharedStyles';
import { events } from 'lib';
import Event from 'components/Event';
import Image from 'next/image';
import Layout from '../components/Layout';
import CardCallout from '../components/CardCallout';
import Corners from '../components/Corners';
import TextLink from '../components/TextLink';

export const StyledEvents = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 0;
  margin: 0 0 32px;

  ${mQ(bp.desktop)} {
    margin-bottom: 48px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  p {
    margin: 0;
  }
`;

const StyledDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
`;

const StyledSectionDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
  grid-column: full-start / full-end;
  width: 100%;

  ${mQ(bp.desktop)} {
    display: block;
  }
`;

const StyledContainer = styled(Container)`
  position: relative;
`;

const StyledCornersWrapper = styled.div`
  display: none;

  ${mQ(bp.desktop)} {
    display: block;
  }
`;

const StyledBrandHeader = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 16px;

  img {
    width: 128px;
    height: auto;
  }

  ${mQ(bp.desktop)} {
    flex-direction: column;
    gap: 32px;
    width: 304px;

    img {
      width: 200px;
    }
  }
`;

const StyledMobileAccordionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${mQ(bp.desktop)} {
    display: none;
  }
`;

const StyledDesktopCardCallout = styled(CardCallout)`
  display: none !important;

  ${mQ(bp.desktop)} {
    display: flex !important;
  }
`;

const StyledTextLink = styled(TextLink)`
  margin: 0 auto;
  text-transform: uppercase;
`;

const StyledSectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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

      <HeroSecondary title="Events" icon={<Image src={hero} alt="" />} />

      <Layout>
        <Section id="events">
          <Container>
            <StyledSectionSpacing $isSmall>
              <ContentSide>
                <ContentMaster size="lg" title={globalEvents.title} />
                <ContentMaster links={[globalEvents.cta]}>
                  {globalEvents.content}
                </ContentMaster>
              </ContentSide>

              <StyledDivider type="solid" />

              <StyledEvents>
                {events.map((event, index) => (
                  <React.Fragment key={event.title}>
                    <li>
                      <Event
                        location={event.location}
                        title={event.title}
                        content={event.content}
                        date={event.date}
                        time={event.time}
                        rsvp={event.rsvp}
                      />
                    </li>
                    {index !== events.length - 1 && (
                      <li aria-hidden>
                        <StyledDivider type="solid" />
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </StyledEvents>

              <StyledTextLink href="#" target="_blank">
                Explore Hacktoberfest live streams
              </StyledTextLink>
            </StyledSectionSpacing>
          </Container>
        </Section>

        <StyledSectionDivider />

        <Section id="organizers">
          <Container>
            <StyledSectionSpacing>
              <Container inner>
                <StyledSectionTitle>
                  <ContentMaster
                    align="center"
                    size="lg"
                    title={eventOrganizers.title}
                  />
                  <ContentMaster align="center" size="xl2">
                    {eventOrganizers.content}
                  </ContentMaster>
                </StyledSectionTitle>
              </Container>
              <StyledMobileAccordionSection>
                <ContentMaster
                  align="center"
                  size="lg"
                  title={organize.title}
                  $collapsTopPadding
                />
                {organize.sections.map((section, index) => (
                  <React.Fragment key={section.title}>
                    <Accordion title={section.title} collapsed>
                      {section.items && (
                        <ContentMaster size="md">
                          {section.items[0]}
                        </ContentMaster>
                      )}
                    </Accordion>
                    {index !== organize.sections.length - 1 && (
                      <StyledDivider type="solid" />
                    )}
                  </React.Fragment>
                ))}
              </StyledMobileAccordionSection>
              <StyledDesktopCardCallout
                title={<ContentMaster size="lg" title={organize.title} />}
                bodyGap="lg"
              >
                <StyledDivider type="solid" />
                {organize.sections.map((section, index) => (
                  <React.Fragment key={section.title}>
                    <Accordion title={section.title} collapsed>
                      {section.items && (
                        <ContentMaster size="md">
                          {section.items[0]}
                        </ContentMaster>
                      )}
                    </Accordion>
                    {index !== organize.sections.length - 1 && (
                      <StyledDivider type="solid" />
                    )}
                  </React.Fragment>
                ))}
              </StyledDesktopCardCallout>
            </StyledSectionSpacing>
          </Container>
        </Section>

        <Section id="register">
          <StyledContainer inner>
            <StyledSectionTitle>
              <ContentMaster align="center" size="lg" title={register.title} />
              <ContentMaster align="center" size="xl2" cta={register.cta}>
                {register.content}
              </ContentMaster>
            </StyledSectionTitle>
            <StyledCornersWrapper>
              <Corners />
            </StyledCornersWrapper>
          </StyledContainer>
        </Section>

        <StyledDivider type="solid" />

        <Section id="brand">
          <Container inner>
            <ContentSide size="small">
              <StyledBrandHeader>
                <ContentMaster size="lg" title={brand.title} />
                <Image src={potion} alt="" />
              </StyledBrandHeader>
              <CardCallout body={brand.content} link={brand.link} />
            </ContentSide>
          </Container>
        </Section>
      </Layout>
    </>
  );
};

export default Events;
