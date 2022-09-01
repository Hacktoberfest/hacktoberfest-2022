import Collapse from './collapse';
import { Markdown, MarkdownInline } from './markdown';

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
      <div key={section.title || section.content}>
        {section.title && <MarkdownInline string={section.title} as={titleAs} />}
        <ContentSectionBody section={section} />
      </div>
    )
));
