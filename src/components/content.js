import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

import Collapse, { FakeCollapse } from './collapse';
import { Markdown, MarkdownInline } from './markdown';

const textAnimation = () => keyframes`
  50% {
    content: " ->"
  }
  100% {
    content: " -->"
  }
`;

const StyledDiv = styled.div`
  a {
    transition: 0.2s ease;
    font-variant-ligatures: none;
    &:after {
      content: ' >';
    }

    &:hover {
      color: rgba(229, 225, 230, 1);
      &:after {
        filter: ${(props) => props.theme.glowLiteDS};
        animation: ${textAnimation} 1.5s linear infinite;
      }
    }
  }

  p,
  li {
    text-transform: none;
    text-shadow: none;
    color: rgba(229, 225, 230, 0.75);
  }
`;

const ContentSectionBody = ({ section }) => (
  <div>
    {section.content && <Markdown string={section.content} />}
    {section.items && (
      <ul>
        {section.items.map((item) => (
          <li key={item}>
            <Markdown string={item} />
          </li>
        ))}
      </ul>
    )}
  </div>
);

export const ContentSections = ({ sections, titleAs = 'h4' }) => {
  const hasCollapse = useMemo(
    () => sections.some((section) => section.collapsible),
    [sections]
  );

  return sections.map((section) =>
    section.collapsible ? (
      <Collapse
        key={section.title}
        title={<MarkdownInline string={section.title} as={titleAs} />}
        collapsed={section.collapsed}
      >
        <ContentSectionBody section={section} />
      </Collapse>
    ) : hasCollapse ? (
      <FakeCollapse
        key={section.title}
        title={<MarkdownInline string={section.title} as={titleAs} />}
      >
        <StyledDiv>
          <ContentSectionBody section={section} />
        </StyledDiv>
      </FakeCollapse>
    ) : (
      <StyledDiv key={section.title || section.content}>
        {section.title && (
          <MarkdownInline string={section.title} as={titleAs} />
        )}
        <ContentSectionBody section={section} />
      </StyledDiv>
    )
  );
};
