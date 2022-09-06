import styled from 'styled-components';

import Collapse from './collapse';
import { Markdown, MarkdownInline } from './markdown';

const StyledDiv = styled.div`
  p {
    text-transform: none;
    opacity: 0.75;
    text-shadow: none;
  }
  h5 {
    display: flex;

    &::before {
      font-size: 16px;
      font-weight: normal;
      font-family: 'JetBrains Mono', monospace;
      text-align: center;
      width: 48px;
      flex: 0 0 48px;
      letter-spacing: 1px;
      text-indent: 1px;
      content: '[ ]';
    }
  }
`;

const ContentSectionBody = ({ section }) => (
  <>
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
  </>
);

export const ContentSections = ({ sections, titleAs = 'h4' }) =>
  sections.map((section) =>
    section.collapsible ? (
      <Collapse
        key={section.title}
        title={<MarkdownInline string={section.title} as={titleAs} />}
        collapsed={section.collapsed}
      >
        <ContentSectionBody section={section} />
      </Collapse>
    ) : (
      <StyledDiv key={section.title || section.content}>
        {section.title && (
          <MarkdownInline string={section.title} as={titleAs} />
        )}
        <ContentSectionBody section={section} />
      </StyledDiv>
    )
  );
