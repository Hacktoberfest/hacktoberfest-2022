import { host } from 'data/content.mjs';
import { HOST_GUIDE_URL } from 'data/links';

import {
  ApplyBody,
  ApplyButton,
  ApplyEyebrow,
  ApplyHeading,
  ApplyInner,
  ApplyRoot,
  Eyebrow,
  FormatCard,
  FormatCardCopy,
  FormatCardFactRow,
  FormatCardFacts,
  FormatCardTag,
  FormatCardTitle,
  FormatGrid,
  FormatsRoot,
  GuideBand,
  GuideButton,
  GuideCopy,
  SectionHeading,
  SectionIntro,
  SectionIntroCopy,
  StepCopy,
  StepItem,
  StepNumber,
  StepsList,
  StepTitle,
  SupportGrid,
  SupportItem,
  SupportItemCopy,
  SupportItemTitle,
  SupportRoot,
} from './HostSection.styles';

/* The /host page body: the two Fest formats, each carrying its own
   at-a-glance facts, the support behind a confirmed Fest (ending on the
   hosting guide), and the apply band. All of it is static copy from
   data/content.mjs — the only interactive piece is the apply popup, so
   styled-components is safe here the same way it is on the homepage
   sections. */
const { comparison } = host.formats;

/* Which comparison column each card renders; the comparison data itself
   stays shared with llms.mjs. */
const FACT_KEYS = { 'hack-day': 'hackDay', meetup: 'meetUp' };

const HostSection = () => (
  <>
    <FormatsRoot aria-labelledby="host-formats-title">
      <SectionIntro>
        <div>
          <Eyebrow>{host.formats.eyebrow}</Eyebrow>
          <SectionHeading id="host-formats-title">
            {host.formats.heading.lead} <em>{host.formats.heading.accent}</em>
          </SectionHeading>
        </div>
        <SectionIntroCopy>{host.formats.intro}</SectionIntroCopy>
      </SectionIntro>
      <FormatGrid>
        {host.formats.cards.map((card) => (
          <FormatCard key={card.id}>
            <FormatCardTag>{card.tag}</FormatCardTag>
            <FormatCardTitle>{card.title}</FormatCardTitle>
            {card.copy.map((paragraph) => (
              <FormatCardCopy key={paragraph}>{paragraph}</FormatCardCopy>
            ))}
            <FormatCardFacts>
              {comparison.rows.map((row) => (
                <FormatCardFactRow key={row.id}>
                  <dt>{row.label}</dt>
                  <dd>{row[FACT_KEYS[card.id]]}</dd>
                </FormatCardFactRow>
              ))}
            </FormatCardFacts>
          </FormatCard>
        ))}
      </FormatGrid>
    </FormatsRoot>

    <SupportRoot aria-labelledby="host-support-title">
      <SectionIntro>
        <div>
          <Eyebrow>{host.support.eyebrow}</Eyebrow>
          <SectionHeading id="host-support-title">
            {host.support.heading.lead} <em>{host.support.heading.accent}</em>
          </SectionHeading>
        </div>
        <SectionIntroCopy>{host.support.intro}</SectionIntroCopy>
      </SectionIntro>
      <SupportGrid>
        {host.support.items.map((item) => (
          <SupportItem key={item.id}>
            <SupportItemTitle>{item.title}</SupportItemTitle>
            <SupportItemCopy>{item.copy}</SupportItemCopy>
          </SupportItem>
        ))}
      </SupportGrid>
      <GuideBand>
        <GuideCopy>{host.support.guide.copy}</GuideCopy>
        <GuideButton
          href={HOST_GUIDE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {host.support.guide.cta}
        </GuideButton>
      </GuideBand>
    </SupportRoot>

    <ApplyRoot aria-labelledby="host-apply-title">
      <ApplyInner>
        <ApplyEyebrow>{host.apply.eyebrow}</ApplyEyebrow>
        <ApplyHeading id="host-apply-title">
          {host.apply.heading.lead} <em>{host.apply.heading.accent}</em>
        </ApplyHeading>
        <ApplyBody>{host.apply.body}</ApplyBody>
        <StepsList>
          {host.apply.steps.map((step, index) => (
            <StepItem key={step.id}>
              {/* The ol conveys order to AT; the printed number is décor. */}
              <StepNumber aria-hidden="true">{`0${index + 1}`}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepCopy>{step.copy}</StepCopy>
            </StepItem>
          ))}
        </StepsList>
        <ApplyButton href="/my/">{host.apply.cta}</ApplyButton>
      </ApplyInner>
    </ApplyRoot>
  </>
);

export default HostSection;
