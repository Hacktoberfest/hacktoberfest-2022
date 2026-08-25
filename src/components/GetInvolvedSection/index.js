import { getInvolved } from 'data/content.mjs';

import {
  Eyebrow,
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
   Both asks are pages now — /host/ carries the formats and the
   application, and /sponsor/ carries the wall, the footprint, and the
   partnership pitch. */
const LINKS = {
  host: '/host/',
  sponsor: '/sponsor/',
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
          <InvolvedLink href={LINKS[card.id]}>{card.cta}</InvolvedLink>
        </InvolvedCard>
      ))}
    </InvolvedGrid>
  </InvolvedRoot>
);

export default GetInvolvedSection;
