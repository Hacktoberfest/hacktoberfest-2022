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

const Participation = () => {
  return (
    <>
      <h1>Participation</h1>

      <div id="values">
        <MarkdownInline string={values.title} as="h2" />
        <ContentSections sections={values.sections} />
      </div>

      <div id="contributors">
        <MarkdownInline string={contributors.title} as="h2" />
        <ContentSections sections={contributors.sections} />
      </div>

      <div id="beginner-resources">
        <MarkdownInline string={resources.title} as="h2" />
        <ContentSections sections={resources.sections} />
      </div>

      <div id="pr-mr-details">
        <MarkdownInline string={prMrDetails.title} as="h2" />
        <Markdown string={prMrDetails.content} />
        {prMrDetails.sections.map((section) => (
          <div key={section.title}>
            {section.subtitle && <MarkdownInline string={section.subtitle} />}
            <MarkdownInline string={section.title} as="h3" />
            <ContentSections sections={section.items} titleAs="p" />
          </div>
        ))}
      </div>

      <div id="spam">
        <MarkdownInline string={spam.title} as="h2" />
        <ContentSections sections={spam.sections} />
      </div>

      <div id="maintainers">
        <MarkdownInline string={maintainers.title} as="h2" />
        <ContentSections sections={maintainers.sections} />
      </div>
    </>
  );
};

export default Participation;
