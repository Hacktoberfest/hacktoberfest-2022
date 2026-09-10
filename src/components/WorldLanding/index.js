import { useEffect, useRef, useState } from 'react';

import { ART } from 'components/ActivityCard/stickerArt';
import Button from 'components/Button';
import FaqList from 'components/FaqSection/FaqList';
import DevLogo from 'components/icons/DevLogo';
import TypeformButton from 'components/TypeformButton.mjs';
import { faq } from 'data/content.mjs';
import { WAYS_ONLINE_FORM } from 'data/typeforms.mjs';

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
  CompleteBody,
  CompleteCard,
  EarnRoot,
  EarnSplit,
  EarnedBadge,
  EarnedTab,
  Eyebrow,
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

/* A world landing page's body (/online and /in-person): what happens
   (online only), the rewards, how it works (the three steps and the
   milestone card they add up to), then and now
   (early on /in-person, late on /online), the FAQ slice, and a closing
   ask (online only). Every optional band is a key on the world's copy. `world` is the page's copy
   (data/content.mjs `online` or `inPerson`); `afterOpening` and
   `afterEarn` are optional bands slotted between the moves, which is
   where /in-person puts its nearby Fests. All static copy, rendered server-side, so
   styled-components is safe here the way it is on /host. The FAQ band
   renders faq.items by id through the same FaqList the homepage uses. */

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
  const faqItems = world.faq.ids.map((id) =>
    faq.items.find((item) => item.id === id),
  );
  const { card } = world.complete;

  /* The returner's story: at the top on /in-person, below completion on
     /online (world.thenNow.late), where a first-timer meets it after the
     what and the how. */
  const thenNow = (
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
      {!world.thenNow.late && thenNow}

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

      {/* How it works and what it earns, one band: the steps down the
          left, the milestone card on the right as the picture of what they
          add up to. The card's earned sticker peels when the band scrolls
          in (useRevealed). */}
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
          <SectionIntroCopy $onForest>{world.earn.intro}</SectionIntroCopy>
        </SectionIntro>
        <EarnSplit>
          <div>
            {/* Numbered because they happen in this order: nothing counts
                before the sign-in, and nothing ships without the address. */}
            <StepList>
              {world.earn.steps.map((step, index) => (
                <StepItem key={step.title}>
                  <StepNumber>{String(index + 1).padStart(2, '0')}</StepNumber>
                  <div>
                    <StepTitle>{step.title}</StepTitle>
                    <StepCopy>{step.copy}</StepCopy>
                  </div>
                </StepItem>
              ))}
            </StepList>
            {/* The pace line: what the steps add up to, and no finish line. */}
            <CompleteBody>{world.complete.body}</CompleteBody>
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
                    <Sticker $type={sticker.type} $reveals={sticker.earned}>
                      {ART[sticker.art]}
                    </Sticker>
                    {sticker.earned && <EarnedTab $reveals>Earned</EarnedTab>}
                  </Slot>
                ))}
                <CardCaption>{card.milestone2.caption}</CardCaption>
              </StickerRow>
            </CardSection>
          </CompleteCard>
        </EarnSplit>
      </EarnRoot>

      {afterEarn}

      {world.thenNow.late && thenNow}

      <FaqRoot aria-labelledby="world-faq-title">
        <SectionIntro>
          <div>
            <Eyebrow>{world.faq.eyebrow}</Eyebrow>
            <SectionHeading id="world-faq-title">
              {world.faq.heading.lead} <em>{world.faq.heading.accent}</em>
            </SectionHeading>
          </div>
          <SectionIntroCopy>{world.faq.intro}</SectionIntroCopy>
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
