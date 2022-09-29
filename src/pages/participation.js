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
import { PixelPus } from 'components/pixels';
import DorknamicIsland from '../components/dorknamic-island';
import YouTube from '../components/youtube';

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

      <DorknamicIsland>
        <a href="#values">Values</a>
        <a href="#contributors">Contributors</a>
        <a href="#beginner-resources">Beginner-resources</a>
        <a href="#pr-mr-details">Pull/Merge Request Details</a>
        <a href="#spam">Spam</a>
        <a href="#maintainers">maintainers</a>
      </DorknamicIsland>

      <Hero
        h="200"
        s="10"
        b="0.5"
        gradientLeft="#9131ff"
        gradientRight="#2effcd"
        title="Participation"
      >
        <PixelPus />
      </Hero>

      {/* <Section type="sub_hero">
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
      </Section> */}

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

        <YouTube id="nkuYH40cjo4" title="How to Do Your First Pull Request" />
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
