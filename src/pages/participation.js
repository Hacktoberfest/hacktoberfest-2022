import Head from 'next/head';
import styled from 'styled-components';

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

import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

import Divider from 'components/Divider';
import Section from 'components/Section';
import DorknamicIsland from 'components/dorknamic-island';
import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import ContentSide from 'components/ContentSide';
import DividerRow from 'components/DividerRow';
import Accordion from 'components/Accordion';
import List from 'components/List';
import Note from 'components/Note';

import IlloPencil from 'assets/img/8bit-pencil.svg';
import HeroSecondary from 'components/HeroSecondary';
import PixelComputer2023 from 'components/pixels/PixelComputer2023';
import React from 'react';

const StyledPRDetails = styled.div`
  margin: 16px 0 0;

  ${mQ(bp.desktop)} {
    margin: 32px 0 0;
  }
`;

export const StyledSpacer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;

  ${mQ(bp.desktop)} {
    gap: 80px;
  }
`;

const StyledValues = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;

  ${mQ(bp.desktop)} {
    gap: 64px;
  }
`;

const Participation = () => {
  return (
    <>
      <Head>
        <title>Participation | Hacktoberfest 2023</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Participation | Hacktoberfest 2023"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Participation | Hacktoberfest 2023"
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
        icon={<PixelComputer2023 timing="5" />}
      />

      <Container>
        <Section id="values">
          <StyledValues>
            <ContentMaster size="lg" eyebrow={`[${values.title}]`} />
            {values.sections.map(value => (
              <ContentSide key={value.title}>
                <ContentMaster size="lg" title={value.title} />
                <ContentMaster size="md">
                  {value.content}
                </ContentMaster>
              </ContentSide>
            ))}
          </StyledValues>
        </Section>

        <Divider type="pixel" />
      </Container>

      <Container inner>
        <Section id="contributors">
          <StyledSpacer>
            <ContentMaster
              size="xl"
              title={contributors.title}
            >
              {contributors.sections[0].title}
            </ContentMaster>

            <ContentMaster
              size="xl"
              list={contributors.sections[0].items}
            />
          </StyledSpacer>
        </Section>
      </Container>

      <Container>
        <Divider type="doubledashed" />
        <Section id="beginner-resources" small>
          <ContentSide>
            <ContentMaster
              size="xl"
              title={resources.title}
            />
            <ContentMaster
              size="md"
              title={resources.sections[0].title}
              titleTag="h3"
              list={resources.sections[0].items}
            />
          </ContentSide>
        </Section>
        <Divider type="doubledashed" />
        <DividerRow gap="128px">
          <ContentMaster
            size="md"
            title={resources.sections[1].title}
            titleTag="h3"
            list={resources.sections[1].items}
          />
          <ContentMaster
            size="md"
            title={resources.sections[2].title}
            titleTag="h3"
            list={resources.sections[2].items}
          />
        </DividerRow>
        <Divider type="doubledashed" />
      </Container>

      <Container inner>
        <Section id="pr-mr-details">
          <ContentMaster
            size="xl"
            title={prMrDetails.title}
          >
            {prMrDetails.content}
          </ContentMaster>
          <StyledPRDetails>
            {prMrDetails.sections.map((section, index) => (
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
                {prMrDetails.sections.length !== (index + 1) && (
                  <Divider />
                )}
              </React.Fragment>
            ))}
          </StyledPRDetails>
        </Section>
      </Container>

      <Container>
        <Divider type="pixel" />
      </Container>

      <Container inner>
        <Section id="spam">
          <ContentMaster
            size="xl"
            title={spam.title}
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
                  <ContentMaster
                    size="md"
                    list={section.items[0].items}
                  >
                    {section.items[0].content}
                  </ContentMaster>
                </Accordion>
                {spam.sections.length !== (index + 1) && (
                  <Divider />
                )}
              </React.Fragment>
            ))}
          </StyledPRDetails>
        </Section>
      </Container>

      <Container>
        <Divider type="pixel" />

        <Section id="maintainers">
          <StyledSpacer>
            <div style={{maxWidth: '1020px'}}>
              <ContentMaster
                size="xl"
                title={maintainers.title}
              >
                {maintainers.content}
              </ContentMaster>
            </div>
            <ContentMaster
              size="xl"
              listColumns="2"
              list={maintainers.sections[0].items}
            />
          </StyledSpacer>
        </Section>

        <Divider type="pixel" />

        <Section id="low-or-non-code">
          <div style={{maxWidth: '1020px'}}>
            <ContentMaster
              size="xl"
              title={lowNoCode.title}
              children={lowNoCode.content}
            />
          </div>
        </Section>

        <Divider type="doubledashed" />

        <Section small>
          <ContentSide>
            <ContentMaster size="xl">
              [Low-code and non-code contributions](https://opensource.com/article/22/8/non-code-contribution-powers-open-source) are an excellent way to get involved in supporting open source. Here are some examples of ways you can contribute to open-source projects:
            </ContentMaster>
            <ContentMaster
              size="md"
              title="Low-Code Contributions:"
              titleTag="h3"
              list={[
                'Technical documentation',
                'User experience testing',
                'Technical blog post or tutorial',
                'Case studies'
              ]}
            />
          </ContentSide>
        </Section>

        <Divider type="doubledashed" />

        <Section small>
          <List
            content={{
              size: 'md',
              title: 'Non-Code Contributions:',
              titleTag: 'h3'
            }}
            list={[
              'Writing',
              'Translating',
              'Copy editing',
              'Talks or presentations',
              'Event organization',
              'Podcasts',
              'Social media',
              'Blog posts',
              'Video production',
              'Graphic design'
            ]}
          />
        </Section>

        <Divider type="doubledashed" />

        <Section small>
          <Note image={{
            src: IlloPencil.src,
            alt: ''
          }}>
            {note.content}
          </Note>
        </Section>

        <Divider type="pixel" />
      </Container>

      <Container inner>
        <Section id="faq">
          <ContentMaster
            size="xl"
            title={faqs.title}
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
                {faqs.sections.length !== (index + 1) && (
                  <Divider />
                )}
              </React.Fragment>
            ))}
          </StyledPRDetails>
        </Section>
      </Container>
    </>
  );
};

export default Participation;
