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

import {
  StyledEventHero,
  StyledHeader,
  StyledHeaderTitle,
} from './events';

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

export const StyledValues = styled.div`
  margin: 128px 0 64px;

  details {
    margin: 24px 0;
  }
`;

export const StyledContent = styled.div`
  margin: 64px 0;
`;

export const StyledContentSections = styled.div`
  margin: 64px 0;

  div {
    ul {
      li {
        display: inline-block;
        margin: 0 40px 0 0;
      }
    }
  }
`;

const Participation = () => {
  return (
    <Section>
      <StyledEventHero>
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
      </StyledEventHero>

      <StyledValues id="values">
        <StyledHeader reverse={true}>
          <StyledHeaderTitle reverse={true}>
            <Anchor href="#values" />
            <MarkdownInline string={values.title} as="h2" />
          </StyledHeaderTitle>
          <Divider style="reverse" />
        </StyledHeader>
        <StyledContentSections>
          <ContentSections sections={values.sections} titleAs="h4" />
        </StyledContentSections>
      </StyledValues>

      <StyledContent id="contributors">
        <StyledHeader>
          <Divider />
          <StyledHeaderTitle>
            <Anchor href="#values" />
            <MarkdownInline string={contributors.title} as="h2" />
          </StyledHeaderTitle>
        </StyledHeader>
        <StyledContentSections>
          <ContentSections sections={contributors.sections} />
        </StyledContentSections>
      </StyledContent>

      <StyledContent id="beginner-resources">
        <StyledHeader reverse={true}>
          <StyledHeaderTitle reverse={true}>
            <Anchor href="#values" />
            <MarkdownInline string={resources.title} as="h2" />
          </StyledHeaderTitle>
          <Divider style="reverse" />
        </StyledHeader>
        <StyledContentSections>
          <ContentSections sections={resources.sections} />
        </StyledContentSections>
      </StyledContent>

      <StyledContent id="pr-mr-details">
        <StyledHeader>
          <div>
            <Divider />
            <Markdown string={prMrDetails.content} />
          </div>
          <StyledHeaderTitle>
            <Anchor href="#values" />
            <MarkdownInline string={prMrDetails.title} as="h2" />
          </StyledHeaderTitle>
        </StyledHeader>

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
      </StyledContent>

      <StyledContent id="spam">
        <StyledHeader reverse={true}>
          <StyledHeaderTitle reverse={true}>
            <Anchor href="#values" />
            <MarkdownInline string={spam.title} as="h2" />
          </StyledHeaderTitle>
          <Divider style="reverse" />
        </StyledHeader>
        <StyledContentSections>
          <ContentSections sections={spam.sections} />
        </StyledContentSections>
      </StyledContent>

      <StyledContent id="maintainers">
        <StyledHeader>
          <Divider />
          <StyledHeaderTitle>
            <Anchor href="#values" />
            <MarkdownInline string={maintainers.title} as="h2" />
          </StyledHeaderTitle>
        </StyledHeader>
        <StyledContentSections>
          <ContentSections sections={maintainers.sections} />
        </StyledContentSections>
      </StyledContent>
    </Section>
  );
};

export default Participation;
