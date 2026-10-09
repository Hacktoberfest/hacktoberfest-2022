import { useEffect, useRef, useState } from 'react';

import { ART } from 'components/ActivityCard/stickerArt';
import Button from 'components/Button';
import FaqList from 'components/FaqSection/FaqList';
import DevLogo from 'components/icons/DevLogo';
import TypeformButton from 'components/TypeformButton.mjs';
import { activitiesPage, faq, my } from 'data/content.mjs';
import { ACTIVITIES, REQUIRED_STICKERS } from 'data/eligibility.mjs';
import { WAYS_ONLINE_FORM } from 'data/typeforms.mjs';
import { stickerImageSrc } from 'lib/stickerImage.mjs';

import { DAY_ICONS } from './dayIcons';

import {
  CardCaption,
  CardHead,
  CardRow,
  CardRowText,
  CardSection,
  CardTag,
  CardTick,
  CardTitle,
  ClosingActions,
  ClosingBody,
  ClosingReminder,
  ClosingRoot,
  CollectionPages,
  CollectionRoot,
  CollectionRow,
  CollectionStickers,
  CollectionTitle,
  CompleteBody,
  DayIcon,
  CompleteCard,
  EarnRoot,
  EarnSplit,
  EarnedBadge,
  EarnedTab,
  Eyebrow,
  Phase,
  PhaseGrid,
  PhaseLabel,
  PhaseSteps,
  FaqRoot,
  FormatCard,
  FormatLine,
  FormatLines,
  FormatTag,
  FormatTitle,
  FormatsGrid,
  FormatsRoot,
  HappenCard,
  HappenCopy,
  HappenFacts,
  HappenGhost,
  HappenLink,
  HappenTitle,
  HappensGrid,
  HappensRoot,
  Hex,
  MilestoneAt,
  MilestoneCard,
  MilestoneCopy,
  MilestoneHead,
  MilestoneLink,
  MilestoneNote,
  MilestoneTitle,
  MilestonesGrid,
  MilestonesRoot,
  PendingBadge,
  Quote,
  RewardCard,
  RewardCopy,
  RewardGhost,
  RewardGhostArt,
  RewardGhostBody,
  RewardTitle,
  RewardWhere,
  RewardsGrid,
  RewardsRoot,
  SectionHeading,
  SectionIntro,
  SectionIntroCopy,
  Shell3,
  Slot,
  StepCopy,
  StepGrid,
  StepItem,
  StepList,
  StepNumber,
  StepTitle,
  StepsActions,
  Sticker,
  StickerRow,
  ThenNowCard,
  ThenNowGrid,
  ThenNowPoints,
  ThenNowQuote,
  ThenNowRoot,
  ThenNowTag,
  ThenNowTitle,
} from './WorldLanding.styles';

/* A world landing page's body (/online and /in-person). Every band is a
   key on the world's copy, and a world without the key skips the band:
   what happens (online, gone now), what a Fest is like (in person), the
   rewards (in person), how it works (both: three steps, beside the
   milestone card on /in-person and across the band on /online), the
   milestones and the collection (online), then and now (in person), the
   FAQ slice, and a closing ask. `world` is the page's copy
   (data/content.mjs `online` or `inPerson`); `afterOpening` and
   `afterEarn` are optional bands slotted between the moves, which is
   where /in-person puts its nearby Fests. All static copy, rendered
   server-side, so styled-components is safe here the way it is on /host.
   The FAQ band renders faq.items by id through the same FaqList the
   homepage uses. */

/* The stickers on one page of the book, from the catalogue the album
   draws (lib/stickerBook.mjs does the same for /my). */
const pageStickers = (type) =>
  type === 'required'
    ? REQUIRED_STICKERS
    : ACTIVITIES.filter((activity) => activity.type === type);

/* One drawing per step, in the activity card's die-cut slot. Online: the
   MLH mark on a white sticker, an envelope on ochre, a sticker mid-peel
   with its tab. In person: the map pin, a ticket, and the Fest sticker
   mid-peel, which is what checking in earns. */
/* The rewards' stickers: a sheet of stickers for the pack, the DEV mark
   for the badges, a T-shirt, a trophy for the Hack Day prizes. */
const PACK_ART = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#10201d" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" />
    <circle cx="9" cy="9" r="2.5" />
    <circle cx="15" cy="15" r="2.5" />
  </svg>
);

const TEE_ART = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#10201d" strokeWidth="2">
    <path d="M8 4l4 2 4-2 5 3-2 4-3-1v10H8V10l-3 1-2-4z" />
  </svg>
);

const PRIZE_ART = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#10201d" strokeWidth="2">
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8" />
  </svg>
);

const REWARD_ART = {
  pack: { type: 'ochre', glyph: PACK_ART },
  badge: { type: 'white', glyph: <DevLogo /> },
  tee: { type: 'inperson', glyph: TEE_ART },
  prize: { type: 'ochre', glyph: PRIZE_ART },
};

const RewardIllustration = ({ art }) => {
  const drawing = REWARD_ART[art] || REWARD_ART.pack;
  return (
    <Slot>
      <Sticker $type={drawing.type}>{drawing.glyph}</Sticker>
    </Slot>
  );
};

/* The kinds of activity on the "what happens" band, in the sticker
   language: the catalogue's own glyphs where a kind maps to an activity,
   a pen for the write-up challenges. */
const PEN_ART = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#10201d" strokeWidth="2">
    <path d="M4 20l4-1 11-11-3-3L5 16z" />
  </svg>
);

const HAPPEN_ART = {
  play: { type: 'online', glyph: ART.play },
  bolt: { type: 'online', glyph: ART.bolt },
  pen: { type: 'ochre', glyph: PEN_ART },
  plug: { type: 'tools', glyph: ART.plug },
};

/* The one orchestrated moment on the page: when the how-it-works band
   scrolls into view, the earned sticker on its milestone card peels off
   its slot and the Earned tab drops in. At rest the sticker sits flat in the slot, which is a
   complete picture on its own, so nothing is hidden waiting for the
   observer. Under prefers-reduced-motion the stylesheet applies the
   peeled state outright and the observer changes nothing visible. */
const useRevealed = () => {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, revealed];
};

const WorldLanding = ({ world, afterOpening = null, afterEarn = null }) => {
  const [completeRef, revealed] = useRevealed();
  /* Consecutive steps that share a phase ("Before the day", "On the
     day") are drawn under one label; a world whose steps carry none gets
     the plain row. */
  const phases = world.earn?.steps.some((step) => step.phase)
    ? world.earn.steps.reduce((acc, step, index) => {
        const last = acc[acc.length - 1];
        if (last && last.label === step.phase)
          last.steps.push({ ...step, index });
        else acc.push({ label: step.phase, steps: [{ ...step, index }] });
        return acc;
      }, [])
    : null;
  const faqItems = world.faq.ids.map((id) =>
    faq.items.find((item) => item.id === id),
  );
  const card = world.complete ? world.complete.card : null;

  /* The returner's story: at the top on /in-person, below completion on
     /online (world.thenNow.late), where a first-timer meets it after the
     what and the how. */
  const thenNow = world.thenNow && (
    <ThenNowRoot aria-labelledby="world-then-now-title">
      <SectionIntro>
        <div>
          <Eyebrow>{world.thenNow.eyebrow}</Eyebrow>
          <SectionHeading id="world-then-now-title">
            {world.thenNow.heading.lead} <em>{world.thenNow.heading.accent}</em>
          </SectionHeading>
        </div>
        <SectionIntroCopy>{world.thenNow.intro}</SectionIntroCopy>
      </SectionIntro>
      <ThenNowGrid>
        {world.thenNow.cards.map((entry) => (
          <ThenNowCard key={entry.id} $now={entry.id === 'now'}>
            <ThenNowTag $now={entry.id === 'now'}>{entry.tag}</ThenNowTag>
            <ThenNowTitle>{entry.title}</ThenNowTitle>
            <ThenNowPoints $now={entry.id === 'now'}>
              {entry.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ThenNowPoints>
            {/* The mission's line closes the 2026 card, since it is the
                  card's argument in one sentence. */}
            {entry.id === 'now' && (
              <ThenNowQuote>
                <Quote>
                  {world.thenNow.quote.lead}{' '}
                  <em>{world.thenNow.quote.accent}</em>
                </Quote>
              </ThenNowQuote>
            )}
          </ThenNowCard>
        ))}
      </ThenNowGrid>
    </ThenNowRoot>
  );

  return (
    <>
      {world.thenNow && !world.thenNow.late && thenNow}

      {/* What an October online looks like: the kinds of thing to do,
          each with a time and what it earns. Only the world that has it
          renders it. */}
      {world.happens && (
        <HappensRoot aria-labelledby="world-happens-title">
          <SectionIntro>
            <div>
              <Eyebrow>{world.happens.eyebrow}</Eyebrow>
              <SectionHeading id="world-happens-title">
                {world.happens.heading.lead}{' '}
                <em>{world.happens.heading.accent}</em>
              </SectionHeading>
            </div>
            <SectionIntroCopy>{world.happens.intro}</SectionIntroCopy>
          </SectionIntro>
          <HappensGrid>
            {world.happens.items.map((item) => {
              const drawing = HAPPEN_ART[item.art] || HAPPEN_ART.play;
              return (
                <HappenCard key={item.id}>
                  <span aria-hidden="true">
                    <Slot>
                      <Sticker $type={drawing.type}>{drawing.glyph}</Sticker>
                    </Slot>
                  </span>
                  <HappenTitle>{item.title}</HappenTitle>
                  <HappenCopy>{item.copy}</HappenCopy>
                  <HappenFacts>
                    <span>{item.time}</span>
                    <span>{item.earns}</span>
                  </HappenFacts>
                  <HappenLink href={item.href}>{item.cta}</HappenLink>
                </HappenCard>
              );
            })}
            {/* The fourth card: the rest lives on the activities page. */}
            {world.happens.more && (
              <HappenGhost>
                <HappenTitle>{world.happens.more.title}</HappenTitle>
                <HappenCopy>{world.happens.more.copy}</HappenCopy>
                <Button href={world.happens.more.href} $size="small">
                  {world.happens.more.cta}
                </Button>
              </HappenGhost>
            )}
          </HappensGrid>
        </HappensRoot>
      )}

      {/* What a Fest is like: the two formats side by side. Only the world
          that has it. */}
      {world.formats && (
        <FormatsRoot aria-labelledby="world-formats-title">
          <SectionIntro>
            <div>
              <Eyebrow>{world.formats.eyebrow}</Eyebrow>
              <SectionHeading id="world-formats-title">
                {world.formats.heading.lead}{' '}
                <em>{world.formats.heading.accent}</em>
              </SectionHeading>
            </div>
            <SectionIntroCopy>{world.formats.intro}</SectionIntroCopy>
          </SectionIntro>
          <FormatsGrid>
            {world.formats.cards.map((card) => (
              <FormatCard key={card.id}>
                <FormatTag>{card.tag}</FormatTag>
                <FormatTitle>{card.title}</FormatTitle>
                <FormatLines>
                  {card.lines.map((line) => (
                    <FormatLine key={line}>{line}</FormatLine>
                  ))}
                </FormatLines>
              </FormatCard>
            ))}
          </FormatsGrid>
        </FormatsRoot>
      )}

      {afterOpening}

      {world.rewards && (
        <RewardsRoot aria-labelledby="world-rewards-title">
          <SectionIntro>
            <div>
              <Eyebrow>{world.rewards.eyebrow}</Eyebrow>
              <SectionHeading id="world-rewards-title">
                {world.rewards.heading.lead}{' '}
                <em>{world.rewards.heading.accent}</em>
              </SectionHeading>
            </div>
            <SectionIntroCopy>{world.rewards.intro}</SectionIntroCopy>
          </SectionIntro>
          <RewardsGrid>
            {world.rewards.items.map((item) => (
              <RewardCard key={item.id}>
                <RewardWhere>{item.where}</RewardWhere>
                <span aria-hidden="true">
                  <RewardIllustration art={item.art} />
                </span>
                <RewardTitle>{item.title}</RewardTitle>
                <RewardCopy>{item.copy}</RewardCopy>
              </RewardCard>
            ))}
            {/* The reward this world cannot give, as a ghost of a card: dashed,
              no shadow, twice the width, with the way to the world that
              can. Only the online page has one. */}
            {world.rewards.ghost && (
              <RewardGhost>
                <RewardGhostArt aria-hidden="true">
                  <Slot>
                    <Sticker $type="inperson">{TEE_ART}</Sticker>
                  </Slot>
                </RewardGhostArt>
                <RewardGhostBody>
                  <RewardWhere>{world.rewards.ghost.where}</RewardWhere>
                  <RewardTitle>{world.rewards.ghost.title}</RewardTitle>
                  <RewardCopy>{world.rewards.ghost.copy}</RewardCopy>
                  <Button href={world.rewards.ghost.href}>
                    {world.rewards.ghost.cta}
                  </Button>
                </RewardGhostBody>
              </RewardGhost>
            )}
          </RewardsGrid>
        </RewardsRoot>
      )}

      {/* What you get on the day, the room's own rewards (in person only):
          the milestones band's grammar, each card's picture a plain icon,
          since none of these is a sticker. */}
      {world.onTheDay && (
        <MilestonesRoot aria-labelledby="world-on-the-day-title">
          <SectionIntro>
            <div>
              <Eyebrow>{world.onTheDay.eyebrow}</Eyebrow>
              <SectionHeading id="world-on-the-day-title">
                {world.onTheDay.heading.lead}{' '}
                <em>{world.onTheDay.heading.accent}</em>
              </SectionHeading>
            </div>
            <SectionIntroCopy>{world.onTheDay.intro}</SectionIntroCopy>
          </SectionIntro>
          <MilestonesGrid $count={world.onTheDay.cards.length}>
            {world.onTheDay.cards.map((item) => (
              <MilestoneCard key={item.id}>
                <MilestoneHead>
                  <DayIcon viewBox="0 0 24 24" aria-hidden="true">
                    {DAY_ICONS[item.icon].map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </DayIcon>
                  <MilestoneAt $tone="pink">{item.at}</MilestoneAt>
                </MilestoneHead>
                <MilestoneTitle>{item.title}</MilestoneTitle>
                <MilestoneCopy>{item.copy}</MilestoneCopy>
                {item.link && (
                  <MilestoneLink href={item.link.href}>
                    {item.link.label}
                  </MilestoneLink>
                )}
              </MilestoneCard>
            ))}
          </MilestonesGrid>
          {world.onTheDay.disclaimer && (
            <MilestoneNote>{world.onTheDay.disclaimer}</MilestoneNote>
          )}
        </MilestonesRoot>
      )}

      {/* How it works, one band. With a milestone card (the old in-person
          shape) the steps run down the left and the card sits on the
          right, its earned sticker peeling when the band scrolls in
          (useRevealed). Without one, the steps run across the band,
          grouped under when they happen if they carry a phase. Only the
          world that has it; /online tells how it works as its
          milestones. */}
      {world.earn && (
        <EarnRoot
          aria-labelledby="world-earn-title"
          id="how-it-works"
          ref={completeRef}
          data-revealed={revealed ? 'true' : 'false'}
        >
          <SectionIntro>
            <div>
              <Eyebrow $onForest>{world.earn.eyebrow}</Eyebrow>
              <SectionHeading id="world-earn-title" $onForest>
                {world.earn.heading.lead} <em>{world.earn.heading.accent}</em>
              </SectionHeading>
            </div>
            {world.earn.intro && (
              <SectionIntroCopy $onForest>{world.earn.intro}</SectionIntroCopy>
            )}
          </SectionIntro>
          {card ? (
            <EarnSplit>
              <div>
                {/* Numbered because they happen in this order: nothing counts
                  before the sign-in, and nothing ships without the address. */}
                <StepList>
                  {world.earn.steps.map((step, index) => (
                    <StepItem key={step.title}>
                      <StepNumber>
                        {String(index + 1).padStart(2, '0')}
                      </StepNumber>
                      <div>
                        <StepTitle>{step.title}</StepTitle>
                        <StepCopy>{step.copy}</StepCopy>
                      </div>
                    </StepItem>
                  ))}
                </StepList>
                {/* The pace line: what the steps add up to, and no finish line. */}
                {world.complete && (
                  <CompleteBody>{world.complete.body}</CompleteBody>
                )}
                {/* The page's one ask sits here, beside the step that explains
                  MyMLH, when the world has it. The other link stays as the
                  supporting one. */}
                <StepsActions>
                  {world.earn.signIn && (
                    <Button href={world.earn.signIn.href}>
                      {world.earn.signIn.cta}
                    </Button>
                  )}
                  <Button
                    href={world.earn.ctaHref}
                    $variant={world.earn.signIn ? 'outline' : undefined}
                  >
                    {world.earn.cta}
                  </Button>
                  {world.earn.aside && <span>{world.earn.aside}</span>}
                </StepsActions>
              </div>
              {/* A picture of /my's milestone card, mid-October: the first
                milestone earned, the second one activity in. Decorative, and
                hidden from assistive tech, because the words beside it say
                the same thing and the card's rows would read as a to-do list
                the visitor has not started. */}
              {card && (
                <CompleteCard aria-hidden="true">
                  <CardSection>
                    <CardHead>
                      <CardTag>{card.milestone1.tag}</CardTag>
                      <CardTitle>{card.milestone1.title}</CardTitle>
                      <EarnedBadge>{card.milestone1.badge}</EarnedBadge>
                    </CardHead>
                    {card.milestone1.rows.map((row) => (
                      <CardRow key={row.title}>
                        <CardTick>✓</CardTick>
                        <CardRowText>
                          <strong>{row.title}</strong>
                          <span>{row.detail}</span>
                        </CardRowText>
                      </CardRow>
                    ))}
                  </CardSection>
                  <CardSection>
                    <CardHead>
                      <CardTag>{card.milestone2.tag}</CardTag>
                      <CardTitle>{card.milestone2.title}</CardTitle>
                      <PendingBadge>{card.milestone2.badge}</PendingBadge>
                    </CardHead>
                    <StickerRow>
                      {card.milestone2.stickers.map((sticker) => (
                        <Slot key={sticker.art}>
                          <Sticker
                            $type={sticker.type}
                            $reveals={sticker.earned}
                          >
                            {ART[sticker.art]}
                          </Sticker>
                          {sticker.earned && (
                            <EarnedTab $reveals>Earned</EarnedTab>
                          )}
                        </Slot>
                      ))}
                      <CardCaption>{card.milestone2.caption}</CardCaption>
                    </StickerRow>
                  </CardSection>
                </CompleteCard>
              )}
            </EarnSplit>
          ) : phases ? (
            <>
              {/* Grouped under when they happen: the things to do before
                the day, then the day itself, which gets the last and
                widest column. The numbers run on across the groups. */}
              <PhaseGrid>
                {phases.map((phase, phaseIndex) => (
                  <Phase key={phase.label}>
                    <PhaseLabel $day={phaseIndex === phases.length - 1}>
                      {phase.label}
                    </PhaseLabel>
                    <PhaseSteps $count={phase.steps.length}>
                      {phase.steps.map((step) => (
                        <StepItem key={step.title}>
                          <StepNumber>
                            {String(step.index + 1).padStart(2, '0')}
                          </StepNumber>
                          <div>
                            <StepTitle>{step.title}</StepTitle>
                            <StepCopy>{step.copy}</StepCopy>
                          </div>
                        </StepItem>
                      ))}
                    </PhaseSteps>
                  </Phase>
                ))}
              </PhaseGrid>
              <Shell3 as="div" style={{ marginTop: 0 }}>
                <StepsActions>
                  <Button href={world.earn.ctaHref}>{world.earn.cta}</Button>
                  {world.earn.aside && <span>{world.earn.aside}</span>}
                </StepsActions>
              </Shell3>
            </>
          ) : (
            <>
              {/* Numbered because they happen in this order. Across the
                band, since there is no card beside them. */}
              <StepGrid as="ol">
                {world.earn.steps.map((step, index) => (
                  <StepItem key={step.title}>
                    <StepNumber>
                      {String(index + 1).padStart(2, '0')}
                    </StepNumber>
                    <div>
                      <StepTitle>{step.title}</StepTitle>
                      <StepCopy>{step.copy}</StepCopy>
                    </div>
                  </StepItem>
                ))}
              </StepGrid>
              <Shell3 as="div" style={{ marginTop: 0 }}>
                <StepsActions>
                  <Button href={world.earn.ctaHref}>{world.earn.cta}</Button>
                  {world.earn.aside && <span>{world.earn.aside}</span>}
                </StepsActions>
              </Shell3>
            </>
          )}
        </EarnRoot>
      )}

      {/* The three milestones, the same three /my shows once you are
          signed in: the sticker, the count it takes, and what you get.
          /my adds a fourth, Completionist++, for Completionists only; it
          never appears here (test/online-content.test.mjs guards that). */}
      {world.milestones && (
        <MilestonesRoot aria-labelledby="world-milestones-title">
          <SectionIntro>
            <div>
              <Eyebrow>{world.milestones.eyebrow}</Eyebrow>
              <SectionHeading id="world-milestones-title">
                {world.milestones.heading.lead}{' '}
                <em>{world.milestones.heading.accent}</em>
              </SectionHeading>
            </div>
            <SectionIntroCopy>{world.milestones.intro}</SectionIntroCopy>
          </SectionIntro>
          <MilestonesGrid $count={world.milestones.cards.length}>
            {world.milestones.cards.map((item) => (
              <MilestoneCard key={item.id}>
                <MilestoneHead>
                  <Hex aria-hidden="true">
                    <img
                      src={stickerImageSrc(item.art)}
                      alt=""
                      draggable="false"
                    />
                  </Hex>
                  <MilestoneAt $tone={item.tone}>{item.at}</MilestoneAt>
                </MilestoneHead>
                <MilestoneTitle>{item.title}</MilestoneTitle>
                <MilestoneCopy>{item.copy}</MilestoneCopy>
              </MilestoneCard>
            ))}
          </MilestonesGrid>
          {/* When the real things arrive, said once under the cards, the
              way the book's disclaimer sits under the album on /my. */}
          <MilestoneNote>{world.milestones.disclaimer}</MilestoneNote>
        </MilestonesRoot>
      )}

      {/* Everything there is to collect, page by page, drawn from the
          catalogue the album uses, so the pictures here are the ones the
          reader will earn. Each sticker's name is its alt text, so the
          band reads as the list it is, and the same name shows under the
          pointer (data-label, CollectionStickers). The last row is the
          in-person page, with no button of its own: the callout that
          closes the page is the way to the other world. */}
      {world.collection && (
        <CollectionRoot aria-labelledby="world-collection-title">
          <SectionIntro>
            <div>
              <Eyebrow>{world.collection.eyebrow}</Eyebrow>
              <SectionHeading id="world-collection-title">
                {world.collection.heading.lead}{' '}
                <em>{world.collection.heading.accent}</em>
              </SectionHeading>
            </div>
            <SectionIntroCopy>{world.collection.intro}</SectionIntroCopy>
          </SectionIntro>
          <CollectionPages>
            {world.collection.pages.map((type) => (
              <CollectionRow key={type}>
                <CollectionTitle>
                  {activitiesPage.list.types[type]}
                  <small>{my.album.pages[type]}</small>
                </CollectionTitle>
                <CollectionStickers>
                  {pageStickers(type).map((sticker) => (
                    <li key={sticker.id} data-label={sticker.label}>
                      <Hex $size={64}>
                        <img
                          src={stickerImageSrc(sticker.id)}
                          alt={sticker.label}
                          draggable="false"
                        />
                      </Hex>
                    </li>
                  ))}
                </CollectionStickers>
              </CollectionRow>
            ))}
            <CollectionRow>
              <CollectionTitle>
                {world.collection.inPerson.title}
                <small>{world.collection.inPerson.copy}</small>
              </CollectionTitle>
              <CollectionStickers>
                {pageStickers('inperson').map((sticker) => (
                  <li key={sticker.id} data-label={sticker.label}>
                    <Hex $size={64}>
                      <img
                        src={stickerImageSrc(sticker.id)}
                        alt={sticker.label}
                        draggable="false"
                      />
                    </Hex>
                  </li>
                ))}
              </CollectionStickers>
            </CollectionRow>
          </CollectionPages>
          <Shell3 $row>
            <Button href={world.collection.ctaHref}>
              {world.collection.cta}
            </Button>
          </Shell3>
        </CollectionRoot>
      )}

      {afterEarn}

      {world.thenNow && world.thenNow.late && thenNow}

      <FaqRoot aria-labelledby="world-faq-title">
        <SectionIntro>
          <div>
            <Eyebrow>{world.faq.eyebrow}</Eyebrow>
            <SectionHeading id="world-faq-title">
              {world.faq.heading.lead} <em>{world.faq.heading.accent}</em>
            </SectionHeading>
          </div>
          {world.faq.intro && (
            <SectionIntroCopy>{world.faq.intro}</SectionIntroCopy>
          )}
        </SectionIntro>
        <FaqList items={faqItems} />
        <Shell3 $row>
          <Button href={world.faq.cta.href}>{world.faq.cta.label}</Button>
        </Shell3>
      </FaqRoot>

      {/* The page's own close, before whatever callout the page adds: the
          one ask again, and the reminder form for a reader here before
          October. A Typeform popup, never an outbound link. */}
      {world.closing && (
        <ClosingRoot aria-labelledby="world-closing-title">
          <Shell3 as="div" style={{ marginTop: 0 }}>
            <Eyebrow>{world.closing.eyebrow}</Eyebrow>
            <SectionHeading id="world-closing-title">
              {world.closing.heading.lead}{' '}
              <em>{world.closing.heading.accent}</em>
            </SectionHeading>
            <ClosingBody>{world.closing.body}</ClosingBody>
            <ClosingActions>
              <Button href={world.closing.cta.href}>
                {world.closing.cta.label}
              </Button>
              <ClosingReminder form={WAYS_ONLINE_FORM}>
                {world.closing.reminder}
              </ClosingReminder>
            </ClosingActions>
          </Shell3>
        </ClosingRoot>
      )}
    </>
  );
};

export default WorldLanding;
