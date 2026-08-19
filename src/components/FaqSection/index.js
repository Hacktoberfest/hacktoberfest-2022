import { faq } from 'data/content.mjs';
import { FAQ_UPDATES_FORM } from 'data/typeforms.mjs';

import {
  Eyebrow,
  FaqAnswer,
  FaqFormLink,
  FaqHeading,
  FaqIntro,
  FaqIntroCopy,
  FaqItem,
  FaqLink,
  FaqLlmsLink,
  FaqLlmsNote,
  FaqMarker,
  FaqPanel,
  FaqQuestion,
  FaqQuestionText,
  FaqRoot,
} from './FaqSection.styles';

// Which popup each inline link opens. The copy lives in data/content.mjs.
const FORMS = {
  faqUpdates: FAQ_UPDATES_FORM,
};

const AnswerSegment = ({ segment }) => {
  if (segment.form) {
    return <FaqFormLink form={FORMS[segment.form]}>{segment.text}</FaqFormLink>;
  }

  if (segment.href) {
    /* Only outbound links get the new-tab treatment and the rel guard that
       has to come with it; a link to another page of this site keeps the
       reader in the tab they are already in. */
    const outbound = !segment.href.startsWith('/');

    return (
      <FaqLink
        href={segment.href}
        {...(outbound ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {segment.text}
      </FaqLink>
    );
  }

  return segment.text;
};

const FaqSection = () => (
  <FaqRoot id="faq" aria-labelledby="faq-title">
    <FaqIntro>
      <div>
        <Eyebrow>{faq.eyebrow}</Eyebrow>
        <FaqHeading id="faq-title">
          {faq.heading.lead} <em>{faq.heading.accent}</em>
        </FaqHeading>
      </div>
      <FaqIntroCopy>{faq.intro}</FaqIntroCopy>
    </FaqIntro>

    <FaqPanel>
      {faq.items.map((item) => (
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

    <FaqLlmsNote>
      <FaqLlmsLink href="/llms.txt">{faq.llmsNote}</FaqLlmsLink>
    </FaqLlmsNote>
  </FaqRoot>
);

export default FaqSection;
