import { values, quality, spam, contributors, maintainers, prMrDetails } from 'lib/resources';
import { MarkdownInline, Markdown } from 'components/markdown';

const ContentSections = ({ sections, titleAs = 'h3' }) => sections.map(section => (
    <div key={ section.title || section.content }>
        { section.title && <MarkdownInline string={ section.title } as={ titleAs } /> }
        { section.content && <Markdown string={ section.content } /> }
        { section.items && (
            <ul>
                { section.items.map(item => (
                    <li key={ item }>
                        <Markdown string={ item } />
                    </li>
                )) }
            </ul>
        ) }
    </div>
));

const Resources = () => {
    return (
        <>
            <h1>Resources</h1>

            <div>
                <MarkdownInline string={ values.title } as="h2" />
                <ContentSections sections={ values.sections } />
            </div>

            <div>
                <MarkdownInline string={ quality.title } as="h2" />
                <ContentSections sections={ quality.sections } />
            </div>

            <div>
                <MarkdownInline string={ spam.title } as="h2" />
                <ContentSections sections={ spam.sections } />
                <p><b><MarkdownInline string={ spam.motto } as="i" /></b></p>
                <MarkdownInline string={ spam.report } />
            </div>

            <div>
                <MarkdownInline string={ contributors.title } as="h2" />
                <ContentSections sections={ contributors.sections } />
            </div>

            <div>
                <MarkdownInline string={ maintainers.title } as="h2" />
                <ContentSections sections={ maintainers.sections } />
            </div>

            <div>
                <MarkdownInline string={ prMrDetails.title } as="h2" />
                <Markdown string={ prMrDetails.content } />
                { prMrDetails.sections.map(section => (
                    <div key={ section.title }>
                        <MarkdownInline string={ section.title } as="h2" />
                        <ContentSections sections={ section.items } titleAs='p' />
                        <div>
                            <p><i>{ section.check.type }</i></p>
                            <Markdown string={ section.check.content } />
                        </div>
                    </div>
                )) }
            </div>
        </>
    );
};

export default Resources;
