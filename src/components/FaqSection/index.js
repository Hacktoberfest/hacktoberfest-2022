import Button from 'components/Button';
import { faq } from 'data/content.mjs';

import FaqList from './FaqList';
import {
  Eyebrow,
  FaqCtaRow,
  FaqHeading,
  FaqIntro,
  FaqIntroCopy,
  FaqLlmsLink,
  FaqLlmsNote,
  FaqRoot,
} from './FaqSection.styles';

/* The homepage keeps four broad questions — chosen in data/content.mjs for
   breadth over depth, since the homepage serves first-time visitors — and
   sends everyone else to the full /questions page via the CTA below the panel.
   Mapping over homepage.ids (rather than filtering items) is what keeps
   the display order the ids declare, independent of items' own order. */
const homepageItems = faq.homepage.ids.map((id) =>
  faq.items.find((item) => item.id === id),
);

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

    <FaqList items={homepageItems} />

    <FaqCtaRow>
      <Button href={faq.homepage.cta.href}>{faq.homepage.cta.label}</Button>
    </FaqCtaRow>

    <FaqLlmsNote>
      <FaqLlmsLink href="/llms.txt">{faq.llmsNote}</FaqLlmsLink>
    </FaqLlmsNote>
  </FaqRoot>
);

export default FaqSection;
