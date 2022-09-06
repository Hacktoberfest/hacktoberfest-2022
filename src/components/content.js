import { useMemo } from 'react';
import styled from 'styled-components';

import Collapse, { FakeCollapse } from './collapse';
import { Markdown, MarkdownInline } from './markdown';

const StyledDiv = styled.div`
  p {
    text-transform: none;
    opacity: 0.75;
    text-shadow: none;
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

export const ContentSections = ({ sections, titleAs = 'h4'  }) => {
  const hasCollapse = useMemo(() => sections.some((section) => section.collapsible), [sections]);

  return sections.map((section) =>
    section.collapsible ? (
      <Collapse
        key={section.title}
        title={<MarkdownInline string={section.title} as={titleAs} />}
        collapsed={section.collapsed}
      >
        <ContentSectionBody section={section} />
      </Collapse>
    ) : (
      hasCollapse ? (
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
    ))
  );
};
