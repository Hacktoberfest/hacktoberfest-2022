import { getInvolved } from 'data/content.mjs';
import { HOST_A_FEST_FORM, SPONSOR_FORM } from 'data/typeforms.mjs';

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
  InvolvedRoot,
  InvolvedTag,
} from './GetInvolvedSection.styles';

// Which popup each card opens. The copy itself lives in data/content.mjs.
const FORMS = {
  host: HOST_A_FEST_FORM,
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
          <InvolvedButton form={FORMS[card.id]}>{card.cta}</InvolvedButton>
        </InvolvedCard>
      ))}
    </InvolvedGrid>
  </InvolvedRoot>
);

export default GetInvolvedSection;
