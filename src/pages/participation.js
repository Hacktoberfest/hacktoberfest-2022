import Head from 'next/head';
import styled, { useTheme } from 'styled-components';

import {
  values,
  contributors,
  resources,
  prMrDetails,
  spam,
  maintainers,
  faqs,
  note,
  lowNoCode,
} from 'lib/participation';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import Divider from 'components/Divider';
import Section from 'components/Section';
import DorknamicIsland from 'components/dorknamic-island';
import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import ContentSide from 'components/ContentSide';
import DividerRow from 'components/DividerRow';
import Accordion from 'components/Accordion';

import HeroSecondary from 'components/HeroSecondary';
import asciiParticipation from 'assets/img/ascii-participation.svg';
import React from 'react';
import SectionDivider from 'components/SectionDivider';
import createMetaTitle from 'lib/createMetaTitle';

const StyledPRDetails = styled.div`
  margin: 16px 0 0;

  ${mQ(bp.desktop)} {
    margin: 32px 0 0;
  }
`;

const StyledParticipationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

const Participation = () => {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>{createMetaTitle('Participation')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('Participation')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('Participation')}
        />
      </Head>

      <DorknamicIsland>
        <a href="#values">Values</a>
        <a href="#contributors">Contributors</a>
        <a href="#beginner-resources">Beginner-Resources</a>
        <a href="#pr-mr-details">pr-mr-details</a>
        <a href="#spam">Spam</a>
        <a href="#maintainers">Maintainers</a>
        <a href="#low-or-non-code">low-or-non-code</a>
        <a href="#faq">FAQ</a>
      </DorknamicIsland>

      <HeroSecondary
        title="Participation"
        icon={<img src={asciiParticipation.src} alt="" />}
      />

      <Section id="values">
        <Container>
          <StyledParticipationSection>
            <>
              {values.map((value, index) => (
                <>
                  <ContentSide key={value.title}>
                    <ContentMaster
                      size="xl"
                      title={value.title}
                      titleCursorColor={theme.colors.black}
                    />
                    <ContentMaster size="md">{value.content}</ContentMaster>
                  </ContentSide>
                  {index + 1 !== values.length && (
                    <Divider type="doubledashed" />
                  )}
                </>
              ))}
            </>
          </StyledParticipationSection>
        </Container>
      </Section>

      <SectionDivider align="right" />

      <Section
        id="contributors"
        bgColor={theme.colors.black}
        color={theme.colors.typography}
        isDark
      >
        <Container>
          <ContentSide>
            <ContentMaster size="xl" title={contributors.title} />
            <ContentMaster size="xl" list={contributors.sections[0].items}>
              {contributors.sections[0].content}
            </ContentMaster>
          </ContentSide>
        </Container>
      </Section>

      <SectionDivider align="left" isFlipped />

      <Section id="beginner-resources">
        <Container>
          <StyledParticipationSection>
            <ContentSide>
              <ContentMaster
                size="xl"
                title={resources.title}
                titleCursorColor={theme.colors.black}
              />
              <ContentMaster
                size="md"
                title={resources.sections[0].title}
                titleTag="h3"
                hasCaret={false}
                list={resources.sections[0].items}
              />
            </ContentSide>

            <Divider type="doubledashed" />

            <DividerRow gap="128px">
              <ContentMaster
                size="md"
                title={resources.sections[1].title}
                titleTag="h3"
                hasCaret={false}
                list={resources.sections[1].items}
              />
              <ContentMaster
                size="md"
                title={resources.sections[2].title}
                titleTag="h3"
                hasCaret={false}
                list={resources.sections[2].items}
              />
            </DividerRow>
          </StyledParticipationSection>
        </Container>
      </Section>

      <SectionDivider align="right" />

      <Section
        id="pr-mr-details"
        bgColor={theme.colors.black}
        color={theme.colors.typography}
        isDark
      >
        <Container>
          <ContentMaster size="xl" title={prMrDetails.title}>
            {prMrDetails.content}
          </ContentMaster>
          <StyledPRDetails>
            {prMrDetails.sections.map((section, index) => (
              <React.Fragment key={section.title}>
                <Accordion
                  isDark
                  title={section.title}
                  subtitle={section.subtitle}
                  collapsed
                >
                  <ContentMaster size="md">
                    {section.items[0].content}
                  </ContentMaster>
                </Accordion>
                {prMrDetails.sections.length !== index + 1 && <Divider />}
              </React.Fragment>
            ))}
          </StyledPRDetails>
        </Container>
      </Section>

      <SectionDivider align="left" isFlipped />

      <Section id="spam">
        <Container>
          <ContentMaster
            size="xl"
            title={spam.title}
            titleCursorColor={theme.colors.black}
          >
            {spam.content}
          </ContentMaster>
          <StyledPRDetails>
            {spam.sections.map((section, index) => (
              <React.Fragment key={section.title}>
                <Accordion
                  title={section.title}
                  subtitle={section.subtitle}
                  collapsed
                >
                  <ContentMaster size="md" list={section.items[0].items}>
                    {section.items[0].content}
                  </ContentMaster>
                </Accordion>
                {spam.sections.length !== index + 1 && <Divider />}
              </React.Fragment>
            ))}
          </StyledPRDetails>
        </Container>
      </Section>

      <SectionDivider
        align="left"
        isFlipped
        bgColor={theme.colors.green}
        fgColor={theme.colors.typography}
      />

      <Section
        id="maintainers"
        bgColor={theme.colors.green}
        color={theme.colors.black}
      >
        <Container>
          <StyledParticipationSection>
            <ContentMaster
              size="xl"
              title={maintainers.title}
              titleCursorColor={theme.colors.black}
            >
              {maintainers.content}
            </ContentMaster>
            <ContentMaster
              size="xl"
              listColumns="2"
              list={maintainers.sections[0].items}
            />
          </StyledParticipationSection>
        </Container>
      </Section>

      <SectionDivider
        align="right"
        bgColor={theme.colors.green}
        fgColor={theme.colors.black}
      />

      <Section
        id="low-or-non-code"
        bgColor={theme.colors.black}
        color={theme.colors.typography}
        linkColor={theme.colors.pink}
      >
        <Container>
          <StyledParticipationSection>
            <ContentSide>
              <ContentMaster
                size="xl"
                title={lowNoCode.title}
                prefixColor={theme.colors.pink}
              />
              <ContentMaster size="xl" children={lowNoCode.content} />
            </ContentSide>

            <Divider type="doubledashed" />

            <ContentSide>
              <ContentMaster
                size="md"
                title={lowNoCode.sections[0].title}
                titleTag="h3"
                hasCaret={false}
                list={lowNoCode.sections[0].lists}
              >
                {lowNoCode.sections[0].content}
              </ContentMaster>

              <ContentMaster
                size="md"
                title={lowNoCode.sections[1].title}
                titleTag="h3"
                hasCaret={false}
                list={lowNoCode.sections[1].lists}
              />
            </ContentSide>

            <Divider type="doubledashed" />

            <ContentSide>
              <ContentMaster size="md">
                {note.sections[0].content}
              </ContentMaster>

              <ContentMaster size="md">
                {note.sections[1].content}
              </ContentMaster>
            </ContentSide>
          </StyledParticipationSection>
        </Container>
      </Section>

      <SectionDivider align="left" isFlipped />

      <Section id="faq">
        <Container>
          <ContentMaster
            size="xl"
            title={faqs.title}
            titleCursorColor={theme.colors.black}
          >
            {faqs.content}
          </ContentMaster>
          <StyledPRDetails>
            {faqs.sections.map((section, index) => (
              <React.Fragment key={section.title}>
                <Accordion
                  title={section.title}
                  subtitle={section.subtitle}
                  collapsed
                >
                  <ContentMaster size="md">
                    {section.items[0].content}
                  </ContentMaster>
                </Accordion>
                {faqs.sections.length !== index + 1 && <Divider />}
              </React.Fragment>
            ))}
          </StyledPRDetails>
        </Container>
      </Section>
    </>
  );
};

export default Participation;
