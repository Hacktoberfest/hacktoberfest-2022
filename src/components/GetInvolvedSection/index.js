import { getInvolved } from 'data/content.mjs';
import { SPONSOR_FORM } from 'data/typeforms.mjs';

import {
  Eyebrow,
  InvolvedButton,
  InvolvedCard,
  InvolvedCardCopy,
  InvolvedCardTitle,
  InvolvedGrid,
  InvolvedHeading,
  InvolvedIntro,
  InvolvedIntroCopy,
  InvolvedLink,
  InvolvedRoot,
  InvolvedTag,
} from './GetInvolvedSection.styles';

/* Where each card's CTA goes. The copy itself lives in data/content.mjs.
   The host ask is a page now — /host/ carries the formats and the
   application — while sponsorship is still a conversation that starts
   with a form. A card is one or the other, never both. */
const LINKS = {
  host: '/host/',
};

const FORMS = {
  sponsor: SPONSOR_FORM,
};

const GetInvolvedSection = () => (
  <InvolvedRoot id="get-involved" aria-labelledby="get-involved-title">
    <InvolvedIntro>
      <div>
        <Eyebrow>{getInvolved.eyebrow}</Eyebrow>
        <InvolvedHeading id="get-involved-title">
          {getInvolved.heading.lead} <em>{getInvolved.heading.accent}</em>
        </InvolvedHeading>
      </div>
      <InvolvedIntroCopy>{getInvolved.intro}</InvolvedIntroCopy>
    </InvolvedIntro>

    <InvolvedGrid>
      {getInvolved.cards.map((card) => (
        <InvolvedCard key={card.id}>
          <InvolvedTag>{card.tag}</InvolvedTag>
          <InvolvedCardTitle>{card.title}</InvolvedCardTitle>
          {card.copy.map((paragraph) => (
            <InvolvedCardCopy key={paragraph}>{paragraph}</InvolvedCardCopy>
          ))}
          {LINKS[card.id] ? (
            <InvolvedLink href={LINKS[card.id]}>{card.cta}</InvolvedLink>
          ) : (
            <InvolvedButton form={FORMS[card.id]}>{card.cta}</InvolvedButton>
          )}
        </InvolvedCard>
      ))}
    </InvolvedGrid>
  </InvolvedRoot>
);

export default GetInvolvedSection;
