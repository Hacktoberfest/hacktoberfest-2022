import { values, quality, spam, contributors, maintainers, prMrDetails } from 'lib/resources';

const ContentSections = ({ sections, titleAs: Title = 'h3', contentAs: Content = 'p' }) => sections.map(section => (
    <div key={ section.title || section.content }>
        { section.title && <Title>{ section.title }</Title> }
        { section.content && <Content>{ section.content }</Content> }
        { section.items && (
            <ul>
                { section.items.map(item => (
                    <li key={ item }>
                        <p>{ item }</p>
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
                <h2>{ values.title }</h2>
                <ContentSections sections={ values.sections } />
            </div>

            <div>
                <h2>{ quality.title }</h2>
                <ContentSections sections={ quality.sections } />
            </div>

            <div>
                <h2>{ spam.title }</h2>
                <ContentSections sections={ spam.sections } />
                <p><b><i>{ spam.moto }</i></b></p>
                <p>{ spam.report }</p>
            </div>

            <div>
                <h2>{ contributors.title }</h2>
                <ContentSections sections={ contributors.sections } />
            </div>

            <div>
                <h2>{ maintainers.title }</h2>
                <ContentSections sections={ maintainers.sections } />
            </div>

            <div>
                <h2>{ prMrDetails.title }</h2>
                <p>{ prMrDetails.content }</p>
                { prMrDetails.sections.map(section => (
                    <div key={ section.title }>
                        <h3>{ section.title }</h3>
                        <ContentSections sections={ section.items } titleAs='p' />
                        <div>
                            <p>
                                <i>{ section.check.type }</i>
                                { section.check.content }
                            </p>
                        </div>
                    </div>
                )) }
            </div>
        </>
    );
};

export default Resources;
