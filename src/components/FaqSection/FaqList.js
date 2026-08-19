import { parseAnswerMarkdown } from 'data/content.mjs';

import {
  FaqAnswer,
  FaqItem,
  FaqLink,
  FaqMarker,
  FaqOrderedList,
  FaqPanel,
  FaqQuestion,
  FaqQuestionText,
} from './FaqSection.styles';

/* Shared by every href, whether it arrives as a { text, href } segment or
   as a [label](href) inside a { markdown } segment: only outbound links get
   the new-tab treatment and the rel guard that has to come with it, since a
   link to another page of this site keeps the reader in the tab they're
   already in. */
const AnswerLink = ({ href, children }) => {
  const outbound = !href.startsWith('/');

  return (
    <FaqLink
      href={href}
      {...(outbound ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </FaqLink>
  );
};

/* Renders one parseAnswerMarkdown `parts` array. Plain text, **bold**, and
   [label](href) all reduce to this same trio of node kinds, so both the
   markdown paragraph case and each ordered-list item can share it. */
const InlineParts = ({ parts }) =>
  parts.map((part, index) => {
    if (part.href) {
      return (
        <AnswerLink key={index} href={part.href}>
          {part.text}
        </AnswerLink>
      );
    }

    if (part.bold) {
      return <strong key={index}>{part.text}</strong>;
    }

    return part.text;
  });

const AnswerSegment = ({ segment }) => {
  if (segment.href) {
    return <AnswerLink href={segment.href}>{segment.text}</AnswerLink>;
  }

  if (segment.markdown) {
    const parsed = parseAnswerMarkdown(segment.markdown);

    if (parsed.type === 'orderedList') {
      return (
        <FaqOrderedList>
          {parsed.items.map((item, index) => (
            <li key={index}>
              <InlineParts parts={item.parts} />
            </li>
          ))}
        </FaqOrderedList>
      );
    }

    return <InlineParts parts={parsed.parts} />;
  }

  return segment.text;
};

/* The single place that knows how a question and its answer segments become
   markup — the homepage band and the /questions page both render their items
   through this, so the accordion itself never has two implementations to
   keep in sync. */
const FaqList = ({ items }) => (
  <FaqPanel>
    {items.map((item) => (
      <FaqItem key={item.id}>
        <FaqQuestion>
          <FaqQuestionText>{item.question}</FaqQuestionText>
          <FaqMarker aria-hidden="true" />
        </FaqQuestion>
        <FaqAnswer>
          {item.answer.map((segment, index) => (
            <AnswerSegment key={`${item.id}-${index}`} segment={segment} />
          ))}
        </FaqAnswer>
      </FaqItem>
    ))}
  </FaqPanel>
);

export default FaqList;
