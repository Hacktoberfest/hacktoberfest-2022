import Head from 'next/head';
import { Fragment } from 'react';
import styled from 'styled-components';

import {
  values,
  contributors,
  resources,
  prMrDetails,
  spam,
  maintainers,
  faqs,
} from 'lib/participation';

import { MarkdownInline, Markdown } from 'components/markdown';
import { ContentSections } from 'components/content';
import Collapse from 'components/collapse';
import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Hero from 'components/hero';
import { PixelPus } from 'components/pixels';
import DorknamicIsland from 'components/dorknamic-island';
import YouTube from 'components/youtube';

const StyledPRDetails = styled.div`
  margin: 32px 0 0;
`;

const StyledFAQs = styled.div`
  h3 {
    font-size: 48px;
    line-height: 1.25;
    margin: 32px 0;
  }
  
  details {
    margin: 16px 0;
    
    h4 {
      font-size: 24px;
      text-shadow: none;
      font-weight: normal;
      text-transform: none;
      color: rgba(229, 225, 230, 0.75);
    }
    
    p {
      opacity: 1;
    }
  }
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
        <a href="#beginner-resources">Beginner-Resources</a>
        <a href="#pr-mr-details">Pull/Merge Request Details</a>
        <a href="#spam">Spam</a>
        <a href="#maintainers">Maintainers</a>
        <a href="#faqs">Swag/Shipping FAQs</a>
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

      <Section type="sub_content" id="faqs">
        <Divider />
        <Anchor href="#faqs" />
        <MarkdownInline string={faqs.title} as="h2" />
        <StyledFAQs>
          {faqs.sections.map((section) => (
            <Fragment key={section.title}>
              <MarkdownInline string={section.title} as="h3" />
              <ContentSections sections={section.items} />
            </Fragment>
          ))}
        </StyledFAQs>
      </Section>
    </>
  );
};

export default Participation;
