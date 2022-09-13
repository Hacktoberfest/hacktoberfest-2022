import Head from 'next/head';
import styled from 'styled-components';

import {
  values,
  contributors,
  resources,
  prMrDetails,
  spam,
  maintainers,
} from 'lib/participation';

import { MarkdownInline, Markdown } from 'components/markdown';
import { ContentSections } from 'components/content';
import Collapse from 'components/collapse';
import Button from 'components/button';
import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Hero from 'components/hero';

const StyledPRDetails = styled.div`
  margin: 32px 0 0;
`;

const StyledPREyebrow = styled.p`
  color: ${(props) => props.theme[props.color] || props.theme.text};
  margin: 0 !important;
`;

const Participation = () => {
  return (
    <>
      <Head>
        <title>Participation | Hacktoberfest 2022</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Participation | Hacktoberfest 2022"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Participation | Hacktoberfest 2022"
        />
      </Head>

      {/* <Hero />
      <Section spacing_top="64px">
        <Divider />
      </Section> */}

      <Section type="sub_hero">
        <h1>Participation</h1>
        <h4>Find what you need quickly</h4>
        <div>
          <Button as="a" href="#values" color_bg="spark">
            Values
          </Button>
          <Button as="a" href="#contributors" color_bg="spark">
            Contributors
          </Button>
          <Button as="a" href="#beginner-resources" color_bg="giga">
            Resources
          </Button>
          <Button as="a" href="#pr-mr-details" color_bg="giga">
            PULL/MERGE REQUEST DETAILS
          </Button>
          <Button as="a" href="#spam" color_bg="surf">
            Spam
          </Button>
          <Button as="a" href="#maintainers" color_bg="surf">
            Maintainers
          </Button>
        </div>
      </Section>

      <Section type="sub_content" id="values">
        <Divider />
        <Anchor href="#values" />
        <MarkdownInline string={values.title} as="h2" />
        <ContentSections sections={values.sections} titleAs="h5" />
      </Section>

      <Section type="sub_content" id="contributors">
        <Divider />
        <Anchor href="#contributors" />
        <MarkdownInline string={contributors.title} as="h2" />
        <ContentSections sections={contributors.sections} />
      </Section>

      <Section type="sub_content" id="beginner-resources">
        <Divider />
        <Anchor href="#beginner-resources" />
        <MarkdownInline string={resources.title} as="h2" />
        <ContentSections sections={resources.sections} />
      </Section>

      <Section type="sub_content" id="pr-mr-details">
        <Divider />
        <Anchor href="#pr-mr-details" />
        <MarkdownInline string={prMrDetails.title} as="h2" />
        <Markdown string={prMrDetails.content} />
        <StyledPRDetails>
          {prMrDetails.sections.map((section) => (
            <Collapse
              key={section.title}
              title={
                <div>
                  {section.subtitle && (
                    <MarkdownInline
                      string={`[ ${section.subtitle} ]`}
                      as={StyledPREyebrow}
                      color="spark"
                    />
                  )}
                  <MarkdownInline string={section.title} as="h4" />
                </div>
              }
              collapsed
            >
              <ContentSections sections={section.items} titleAs="p" />
            </Collapse>
          ))}
        </StyledPRDetails>
      </Section>

      <Section type="sub_content" id="spam">
        <Divider />
        <Anchor href="#spam" />
        <MarkdownInline string={spam.title} as="h2" />
        <ContentSections sections={spam.sections} />
      </Section>

      <Section type="sub_content" id="maintainers">
        <Divider />
        <Anchor href="#maintainers" />
        <MarkdownInline string={maintainers.title} as="h2" />
        <ContentSections sections={maintainers.sections} />
      </Section>
    </>
  );
};

export default Participation;
