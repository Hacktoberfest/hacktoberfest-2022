import htmlReactParser, { domToReact } from 'html-react-parser';
import markdownIt from 'markdown-it';
import Link from 'next/link';

const markdown = markdownIt({ typographer: true });

const parse = (html, forceNewTab = false) =>
  htmlReactParser(html, {
    replace: ({ type, name, attribs, children }) => {
      if (type === 'tag' && name === 'a' && attribs.href) {
        if (
          forceNewTab ||
          (attribs.href[0] !== '/' && attribs.href[0] !== '#')
        ) {
          attribs.target = '_blank';
          attribs.rel = 'noopener noreferrer';
        }
        return <Link {...attribs}>{domToReact(children)}</Link>;
      }
    },
  });

export const Markdown = ({ string, forceNewTab = false }) =>
  parse(markdown.render(string), forceNewTab);

export const MarkdownInline = ({
  string,
  forceNewTab = false,
  as: Component = 'p',
  ...props
}) => (
  <Component {...props}>
    {parse(markdown.renderInline(string), forceNewTab)}
  </Component>
);
