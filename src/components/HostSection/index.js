import { host } from 'data/content.mjs';
import { HOST_HANDBOOK_URL } from 'data/links';

import {
  ApplyBody,
  ApplyButton,
  ApplyEyebrow,
  ApplyHeading,
  ApplyRoot,
  ApplySplit,
  CardFooter,
  Eyebrow,
  FormatCard,
  FormatCardCopy,
  FormatCardFactRow,
  FormatCardFacts,
  FormatCardTag,
  FormatCardTitle,
  FormatGrid,
  FormatsRoot,
  GuideButton,
  GuideCopy,
  GuideTitle,
  PhotoPrintMain,
  PhotoPrintOverlay,
  PhotoReel,
  PhotoReelTrack,
  PhotoStack,
  PhotoStripItem,
  PhotoStripPrint,
  PhotoStripRoot,
  SectionHeading,
  SectionIntro,
  SectionIntroCopy,
  StepCopy,
  StepItem,
  StepNode,
  StepNumber,
  StepsList,
  StepTitle,
  SupportAccent,
  SupportCard,
  SupportEyebrow,
  SupportHeading,
  SupportItemCopy,
  SupportItemTitle,
  SupportLead,
  SupportList,
  SupportListItem,
  SupportMark,
  SupportRoot,
  SupportSplit,
} from './HostSection.styles';

/* The /host page body: the two Fest formats, each carrying its own
   at-a-glance facts, a strip of photos from past Fests, the support
   behind a confirmed Fest (ending on the hosting guide), and the apply
   band. All of it is static copy from
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

    <PhotoStripRoot aria-label={host.photoStrip.label}>
      <PhotoReel>
        <PhotoReelTrack>
          {host.photoStrip.photos.map((photo, index) => (
            <PhotoStripItem key={photo.id}>
              <PhotoStripPrint
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width="640"
                height="427"
                $tilt={index % 2 === 0 ? -1.8 : 1.4}
              />
            </PhotoStripItem>
          ))}
          {/* The strip again, so the reel has somewhere to wrap to. Pure
             repetition for the eyes: hidden from AT, empty alts. */}
          {host.photoStrip.photos.map((photo, index) => (
            <PhotoStripItem key={`${photo.id}-loop`} aria-hidden="true">
              <PhotoStripPrint
                src={photo.src}
                alt=""
                loading="lazy"
                width="640"
                height="427"
                $tilt={index % 2 === 0 ? -1.8 : 1.4}
              />
            </PhotoStripItem>
          ))}
        </PhotoReelTrack>
      </PhotoReel>
    </PhotoStripRoot>

    <SupportRoot aria-labelledby="host-support-title">
      <SupportSplit>
        <SupportEyebrow>{host.support.eyebrow}</SupportEyebrow>
        {/* One heading for AT, split visually across the two columns it
           describes; the space inside the lead keeps the accessible
           name reading as a sentence pair. */}
        <SupportHeading id="host-support-title">
          <SupportLead>{host.support.heading.lead} </SupportLead>
          <SupportAccent>{host.support.heading.accent}</SupportAccent>
        </SupportHeading>
        {/* Two prints standing still under the host's half of the
           headline. */}
        <PhotoStack>
          {host.support.photos.map((photo, index) =>
            index === 0 ? (
              <PhotoPrintMain
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width="640"
                height="427"
              />
            ) : (
              <PhotoPrintOverlay
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width="640"
                height="427"
              />
            ),
          )}
        </PhotoStack>
        <SupportCard>
          <SupportList>
            {host.support.items.map((item) => (
              <SupportListItem key={item.id}>
                {/* Décor, not meaning: the ul already carries the list. */}
                <SupportMark
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 2v16M3 6l14 8M17 6L3 14"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </SupportMark>
                <div>
                  <SupportItemTitle>{item.title}</SupportItemTitle>
                  <SupportItemCopy>{item.copy}</SupportItemCopy>
                </div>
              </SupportListItem>
            ))}
          </SupportList>
          <CardFooter>
            <div>
              <GuideTitle>{host.support.guide.title}</GuideTitle>
              <GuideCopy>{host.support.guide.copy}</GuideCopy>
            </div>
            <GuideButton
              href={HOST_HANDBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {host.support.guide.cta}
            </GuideButton>
          </CardFooter>
        </SupportCard>
      </SupportSplit>
    </SupportRoot>

    <ApplyRoot aria-labelledby="host-apply-title">
      <ApplySplit>
        <ApplyEyebrow>{host.apply.eyebrow}</ApplyEyebrow>
        <ApplyHeading id="host-apply-title">
          {host.apply.heading.lead} <em>{host.apply.heading.accent}</em>
        </ApplyHeading>
        <ApplyBody>{host.apply.body}</ApplyBody>
        <StepsList>
          {host.apply.steps.map((step, index) => (
            <StepItem key={step.id}>
              {/* The ol conveys order to AT; the node and the printed
                 number are décor. */}
              <StepNode aria-hidden="true" />
              <StepNumber aria-hidden="true">{`0${index + 1}`}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepCopy>{step.copy}</StepCopy>
            </StepItem>
          ))}
        </StepsList>
        <ApplyButton href="/my/">{host.apply.cta}</ApplyButton>
      </ApplySplit>
    </ApplyRoot>
  </>
);

export default HostSection;
