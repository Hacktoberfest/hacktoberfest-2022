import { Markdown, MarkdownInline } from './markdown';

export const ContentSections = ({ sections, titleAs = 'h3' }) => sections.map(section => (
  <div key={section.title || section.content}>
    {section.title && <MarkdownInline string={section.title} as={titleAs} />}
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
  </div>
));
