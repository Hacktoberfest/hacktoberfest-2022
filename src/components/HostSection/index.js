import { host } from 'data/content.mjs';
import { HACK_DAYS_EMAIL, HACK_DAYS_URLS, HOST_HANDBOOK_URL } from 'data/links';

import PhotoStrip from './PhotoStrip';

import {
  CardFooter,
  Eyebrow,
  FormatCard,
  FormatCardCopy,
  FormatCardFactRow,
  FormatCardFacts,
  FormatCardNow,
  FormatCardNowLink,
  FormatCardTag,
  FormatCardTitle,
  FormatGrid,
  FormatsRoot,
  GuideActions,
  GuideButton,
  GuideCopy,
  GuideTitle,
  HackDaysBody,
  HackDaysButton,
  HackDaysCard,
  HackDaysCardTitle,
  HackDaysCheck,
  HackDaysEyebrow,
  HackDaysFinePrint,
  HackDaysHeading,
  HackDaysItem,
  HackDaysList,
  HackDaysNote,
  HackDaysRoot,
  HackDaysSplit,
  PhotoPrintMain,
  PhotoPrintOverlay,
  PhotoStack,
  SectionHeading,
  SectionIntro,
  SectionIntroCopy,
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
   at-a-glance facts (the Hack Day card ending on MLH Hack Days), a strip
   of photos from past Fests, the support behind a confirmed Fest (ending
   on this month's hosts' hub and handbook), and the closing band that
   sends anyone who still wants to host to MLH Hack Days. All of it is
   static copy from data/content.mjs with nothing interactive, so
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
            {card.id === 'hack-day' && (
              <FormatCardNow>
                <p>
                  <strong>{host.formats.hackDaysNow.lead}</strong>{' '}
                  {host.formats.hackDaysNow.body}
                </p>
                <FormatCardNowLink
                  href={HACK_DAYS_URLS.hostFormat}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {host.formats.hackDaysNow.cta}
                  {' '}
                  <span aria-hidden="true">→</span>
                </FormatCardNowLink>
              </FormatCardNow>
            )}
          </FormatCard>
        ))}
      </FormatGrid>
    </FormatsRoot>

    <PhotoStrip />

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
            <GuideActions>
              <GuideButton href="/my/hosting/">
                {host.support.guide.hubCta}
              </GuideButton>
              <GuideButton
                href={HOST_HANDBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {host.support.guide.cta}
              </GuideButton>
            </GuideActions>
          </CardFooter>
        </SupportCard>
      </SupportSplit>
    </SupportRoot>

    <HackDaysRoot aria-labelledby="host-hack-days-title">
      <HackDaysSplit>
        <HackDaysEyebrow>{host.hackDays.eyebrow}</HackDaysEyebrow>
        <HackDaysHeading id="host-hack-days-title">
          {host.hackDays.heading.lead} <em>{host.hackDays.heading.accent}</em>
        </HackDaysHeading>
        <HackDaysBody>{host.hackDays.body}</HackDaysBody>
        <HackDaysCard>
          <HackDaysCardTitle>{host.hackDays.cardTitle}</HackDaysCardTitle>
          <HackDaysList>
            {host.hackDays.perks.map((perk) => (
              <HackDaysItem key={perk}>
                {/* Décor, not meaning: the ul already carries the list. */}
                <HackDaysCheck
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10.5l4 4 8-9"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </HackDaysCheck>
                {perk}
              </HackDaysItem>
            ))}
          </HackDaysList>
          <HackDaysButton
            href={HACK_DAYS_URLS.hostBand}
            target="_blank"
            rel="noopener noreferrer"
          >
            {host.hackDays.cta}
          </HackDaysButton>
          <HackDaysNote>{host.hackDays.note}</HackDaysNote>
        </HackDaysCard>
        <HackDaysFinePrint>
          {host.hackDays.finePrint}{' '}
          <a href={`mailto:${HACK_DAYS_EMAIL}`}>{HACK_DAYS_EMAIL}</a>.
        </HackDaysFinePrint>
      </HackDaysSplit>
    </HackDaysRoot>
  </>
);

export default HostSection;
