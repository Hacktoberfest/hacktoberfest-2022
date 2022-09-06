import styled from 'styled-components';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

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

export const StyledActions = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns:
    fit-content(100%) fit-content(100%) fit-content(100%) fit-content(100%)
    fit-content(100%) fit-content(100%);

  ${mQ(bp.tablet, 'max')} {
    grid-template-columns: 1fr;
  }
`;

const Participation = () => {
  return (
    <>
      <Section>
        <h1>Participation</h1>
        <h4>Find what you need quickly</h4>
        <StyledActions>
          <Button as="a" href="#values" color_bg="spark">
            Values
          </Button>
          <Button as="a" href="#contributors" color_bg="giga">
            Contributors
          </Button>
          <Button as="a" href="#beginner-resources" color_bg="surf">
            Resources
          </Button>
          <Button as="a" href="#pr-mr-details" color_bg="psybeam">
            PULL/MERGE REQUEST DETAILS
          </Button>
          <Button as="a" href="#spam" color_bg="spark">
            Spam
          </Button>
          <Button as="a" href="#maintainers" color_bg="giga">
            Maintainers
          </Button>
        </StyledActions>
      </Section>

      <Section id="values">
        <Divider />
        <Anchor href="#values" />
        <MarkdownInline string={values.title} as="h2" />
        <ContentSections sections={values.sections} titleAs="h4" />
      </Section>

      <Section id="contributors">
        <Divider />
        <Anchor href="#contributors" />
        <MarkdownInline string={contributors.title} as="h2" />
        <ContentSections sections={contributors.sections} />
      </Section>

      <Section id="beginner-resources">
        <Divider />
        <Anchor href="#beginner-resources" />
        <MarkdownInline string={resources.title} as="h2" />
        <ContentSections sections={resources.sections} />
      </Section>

      <Section id="pr-mr-details">
        <Divider />
        <Anchor href="#pr-mr-details" />
        <MarkdownInline string={prMrDetails.title} as="h2" />
        <Markdown string={prMrDetails.content} />
        {prMrDetails.sections.map((section) => (
          <Collapse
            key={section.title}
            title={
              <div>
                {section.subtitle && (
                  <MarkdownInline string={`[ ${section.subtitle} ]`} />
                )}
                <MarkdownInline string={section.title} as="h3" />
              </div>
            }
            collapsed
          >
            <ContentSections sections={section.items} titleAs="p" />
          </Collapse>
        ))}
      </Section>

      <Section id="spam">
        <Divider />
        <Anchor href="#spam" />
        <MarkdownInline string={spam.title} as="h2" />
        <ContentSections sections={spam.sections} />
      </Section>

      <Section id="maintainers">
        <Divider />
        <Anchor href="#maintainers" />
        <MarkdownInline string={maintainers.title} as="h2" />
        <ContentSections sections={maintainers.sections} />
      </Section>
    </>
  );
};

export default Participation;
