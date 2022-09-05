import Collapse from './collapse';
import { Markdown, MarkdownInline } from './markdown';
import styled from 'styled-components';

const StyledDiv = styled.div`
  h4 {
    display: flex;

    &::before {
      font-size: 16px;
      font-weight: normal;
      font-family: 'JetBrains Mono', monospace;
      text-align: center;
      width: 64px;
      flex: 0 0 64px;
      letter-spacing: 1px;
      text-indent: 1px;
      content: "[ ]";
    }
  }
`;

const ContentSectionBody = ({ section }) => (
  <>
    {section.content && <Markdown string={section.content} />}
    {section.items && (
      <ul>
        {section.items.map(item => (
          <li key={item}>
            <Markdown string={item} />
          </li>
        ))}
      </ul>
    )}
  </>
);

export const ContentSections = ({ sections, titleAs = 'h3' }) => sections.map(section => (
  section.collapsible
    ? (
      <Collapse
        key={section.title}
        title={<MarkdownInline string={section.title} as={titleAs} />}
        collapsed={section.collapsed}
      >
        <ContentSectionBody section={section} />
      </Collapse>
    )
    : (
      <StyledDiv key={section.title || section.content}>
        {section.title && <MarkdownInline string={section.title} as={titleAs} />}
        <ContentSectionBody section={section} />
      </StyledDiv>
    )
));
