import htmlReactParser, { domToReact } from 'html-react-parser';
import markdownIt from 'markdown-it';
import Link from 'next/link';

const markdown = markdownIt({ typographer: true });

const parse = html => htmlReactParser(html, {
    replace: ({ type, name, attribs, children }) => {
        if (type === 'tag' && name === 'a' && attribs.href) return <Link {...attribs}>{domToReact(children)}</Link>;
    },
});

export const Markdown = ({ string }) => parse(markdown.render(string));

export const MarkdownInline = ({ string, as: Component = 'p' }) =>
    <Component>{parse(markdown.renderInline(string))}</Component>;
