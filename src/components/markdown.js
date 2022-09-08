import htmlReactParser, { domToReact } from 'html-react-parser';
import markdownIt from 'markdown-it';
import Link from 'next/link';

const markdown = markdownIt({ typographer: true });

const parse = html => htmlReactParser(html, {
    replace: ({ type, name, attribs, children }) => {
        if (type === 'tag' && name === 'a' && attribs.href) {
          if (!attribs.href.startsWith('/')) {
            attribs.target = '_blank';
            attribs.rel = 'noopener noreferrer';
          }
          return <Link href={attribs.href} passHref><a {...attribs}>{domToReact(children)}</a></Link>;
        }
    },
});

export const Markdown = ({ string }) => parse(markdown.render(string));

export const MarkdownInline = ({ string, as: Component = 'p', ...props }) =>
    <Component {...props}>{parse(markdown.renderInline(string))}</Component>;
