import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

import Collapse, { FakeCollapse } from './collapse';
import { Markdown, MarkdownInline } from './markdown';

const textAnimation = () => keyframes`
  0% {
    content: " >"
  }
  33% {
    content: " ->"
  }
  66% {
    content: " -->"
  }
`;

const StyledDiv = styled.div`
  a {
    transition: color 0.2s ease, filter 0.2s ease;
    font-variant-ligatures: none;

    &:after {
      content: ' >';
    }

    &:hover,
    &:focus {
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
  
  ul {
    padding: 8px 0 8px 16px;
    
    li {
      position: relative;
      
      &::before {
        position: absolute;
        width: 16px;
        left: -16px;
        content: '-';
      }
    }
  }
  
  code {
    color: ${(props) => props.theme.surf};
    text-transform: none;
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
        <StyledDiv>
          <ContentSectionBody section={section} />
        </StyledDiv>
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
