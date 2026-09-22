import styled, { css } from 'styled-components';

import { buttonStyles } from 'components/Button';
import Shell from 'components/Shell';
import TypeformButton from 'components/TypeformButton.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

/* The section grammar every static page shares (HostSection.styles.js,
   FaqSection.styles.js): a mono eyebrow, the display heading with its
   accent, the intro at the right from tablet up. */
const sectionRoot = css`
  padding-block: clamp(64px, 7vw, 96px);
  border-bottom: 2px solid ${colors.ink};
`;

export const ThenNowRoot = styled.section`
  ${sectionRoot}
  background: ${colors.paper};
`;

/* The rewards on paperDeep, the steps back on paper: the band with the
   cards that matter most sits a step darker than its neighbours. */
export const RewardsRoot = styled.section`
  ${sectionRoot}
  background: ${colors.paperDeep};
`;

/* How it works on the forest, the ground the completion band used to
   own: the steps and the card they add up to are one thing now. */
export const EarnRoot = styled.section`
  ${sectionRoot}
  color: ${colors.white};
  background: ${colors.forest};
  /* The hero's "How it works" anchor lands here, under the sticky nav. */
  scroll-margin-top: 90px;
`;

export const HappensRoot = styled.section`
  ${sectionRoot}
  background: ${colors.paper};
`;

/* The page's own close: ochre, the 2026 card's colour, so it reads as
   the moment rather than another paper band. */
export const ClosingRoot = styled.section`
  padding-block: clamp(56px, 6vw, 80px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.ochre};
`;

/* Common questions a step darker than then-and-now before it, so the two
   paper bands at the page's end read as two; the FAQ list is a white box
   and sits raised on paperDeep the way the rewards cards do. No bottom
   rule: the callout that follows has a border-block of its own. */
export const FaqRoot = styled.section`
  padding-block: clamp(64px, 7vw, 96px);
  background: ${colors.paperDeep};
`;

export const SectionIntro = styled(Shell)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 24px;
  margin-bottom: 40px;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
    gap: 40px;
  }
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  ${(props) =>
    props.$onForest &&
    css`
      color: ${colors.sky};
    `}
`;

export const SectionHeading = styled.h2`
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;

  @media (min-width: ${breakpoints.tablet}) {
    max-width: 22ch;
  }

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }

  ${(props) =>
    props.$onForest &&
    css`
      color: ${colors.white};

      em {
        color: ${colors.ochre};
      }
    `}
`;

export const SectionIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
  font-size: 1.05rem;
  line-height: 1.55;

  ${(props) =>
    props.$onForest &&
    css`
      color: ${colors.white};
    `}
`;

/* A shell that also lays a row out: the CTA and its aside, the quote. */
export const Shell3 = styled(Shell)`
  margin-top: 40px;
  ${(props) =>
    props.$row &&
    css`
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 18px 28px;
      color: ${colors.inkSoft};
    `}
`;

/* --- Then and now ------------------------------------------------------ */

/* Before and after, not a choice: the past card takes the narrower
   column and the 2026 card the wider one. */
export const ThenNowGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 5fr 7fr;
    gap: 32px;
    align-items: center;
  }
`;

/* The past greys out and sits a little askew, a print put down; 2026
   takes the ochre the homepage timeline gives this year's card, with the
   same deep shadow, and stands straight. */
export const ThenNowCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 26px;
  border: 2px solid ${colors.ink};
  background: ${colors.paperDeep};
  color: ${colors.inkSoft};
  box-shadow: 7px 7px 0 ${colors.rule};

  @media (min-width: ${breakpoints.tablet}) {
    transform: rotate(-1.5deg) scale(0.96);
    transform-origin: right center;
  }

  ${(props) =>
    props.$now &&
    css`
      padding: 34px;
      color: ${colors.ink};
      background: ${colors.ochre};
      box-shadow: 9px 9px 0 ${colors.ochreDeep};

      @media (min-width: ${breakpoints.tablet}) {
        transform: none;
      }
    `}
`;

export const ThenNowQuote = styled.div`
  margin-top: 10px;
  padding-top: 20px;
  border-top: 2px solid ${colors.ink};
`;

export const ThenNowTag = styled.span`
  align-self: flex-start;
  padding: 5px 10px;
  color: ${colors.white};
  border-radius: 6px;
  background: ${(props) => (props.$now ? colors.ink : colors.muted)};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const ThenNowTitle = styled.h3`
  margin: 0;
  color: ${colors.ink};
  font-family: ${fonts.display};
  font-size: clamp(1.9rem, 2.8vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 0.95;
`;

/* Square markers in the pixel motif, not the browser's discs. The past's
   are the rule grey; 2026's are ink. */
export const ThenNowPoints = styled.ul`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 1.5;

  li {
    position: relative;
    padding-left: 20px;
  }

  li::before {
    content: '';
    position: absolute;
    top: 0.55em;
    left: 0;
    width: 8px;
    height: 8px;
    background: ${(props) => (props.$now ? colors.ink : colors.rule)};
  }
`;

export const Quote = styled.p`
  max-width: 30ch;
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.5rem, 2.2vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.05;
  text-wrap: balance;

  em {
    color: ${colors.orangeDeep};
    font-style: normal;
  }
`;

/* --- What a Fest is like ----------------------------------------------- */

export const FormatsRoot = styled.section`
  ${sectionRoot}
  background: ${colors.paper};
`;

export const FormatsGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }
`;

/* The host page's format card, at this page's density: tag, title, and
   the shape of the day as three lines with the square marker. */
export const FormatCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 30px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
`;

export const FormatTag = styled.span`
  align-self: flex-start;
  padding: 5px 10px;
  color: ${colors.white};
  border-radius: 6px;
  background: ${colors.ink};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const FormatTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.9rem, 2.8vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.95;
`;

export const FormatLines = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${colors.inkSoft};
  line-height: 1.5;
`;

export const FormatLine = styled.li`
  position: relative;
  padding-left: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0.55em;
    left: 0;
    width: 8px;
    height: 8px;
    background: ${colors.ink};
  }
`;

/* --- What happens online ----------------------------------------------- */

export const HappensGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

/* One kind of activity: its sticker, the name, a line, then the two
   facts a newcomer wants (how long, what it earns) as a small ledger,
   and the way to the page that has the details. */
export const HappenCard = styled.div`
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 24px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.skyDeep};
`;

/* The fourth card, for what the band does not hold: dashed, no shadow,
   the grammar the rewards ghost uses, with the way to the activities. */
export const HappenGhost = styled.div`
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 24px;
  border: 2px dashed ${colors.ink};
  background: transparent;

  a {
    justify-self: start;
    margin-top: 4px;
  }
`;

export const HappenTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.05;
`;

export const HappenCopy = styled.p`
  margin: 0;
  color: ${colors.inkSoft};
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const HappenFacts = styled.div`
  display: grid;
  gap: 4px;
  padding-top: 10px;
  border-top: 1px solid ${colors.rule};
  font-family: ${fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: ${colors.muted};

  span:last-child {
    color: ${colors.skyDeep};
    font-weight: 650;
  }
`;

export const HappenLink = styled.a`
  justify-self: start;
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 3px;
`;

/* --- Closing ----------------------------------------------------------- */

export const ClosingBody = styled.p`
  max-width: 54ch;
  margin: 20px 0 0;
  color: ${colors.ink};
  font-size: 1.05rem;
  line-height: 1.55;
`;

export const ClosingActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 26px;
`;

/* The reminder form's trigger, as the site's outline button. */
export const ClosingReminder = styled(TypeformButton)`
  ${buttonStyles}
  background: ${colors.white};
`;

/* --- Rewards ----------------------------------------------------------- */

export const RewardsGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

/* One reward: the where chip at the top, the sticker in its slot, the
   name and a line. A pending reward is dashed with no shadow, the
   grammar /my uses for a thing still to come. */
export const RewardCard = styled.div`
  display: grid;
  gap: 14px;
  align-content: start;
  padding: 24px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
`;

/* The ghost: the reward the online page cannot give, drawn as the
   outline of a card, dashed with no shadow (the /my grammar for a thing
   not yet yours), twice a card's width, the T-shirt sticker large at the
   left and the way to the other world at the right. */
export const RewardGhost = styled.div`
  display: grid;
  gap: 20px;
  align-items: center;
  padding: 24px;
  border: 2px dashed ${colors.ink};
  background: transparent;

  @media (min-width: ${breakpoints.tablet}) {
    grid-column: span 2;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 28px;
    padding: 28px 32px;
  }
`;

export const RewardGhostArt = styled.div`
  zoom: 1.6;
`;

export const RewardGhostBody = styled.div`
  display: grid;
  gap: 12px;
  justify-items: start;
`;

export const RewardWhere = styled.span`
  justify-self: start;
  padding: 3px 7px;
  background: ${colors.paperDeep};
  color: ${colors.inkSoft};
  font-family: ${fonts.mono};
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const RewardTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.05;
`;

export const RewardCopy = styled.p`
  margin: 0;
  color: ${colors.inkSoft};
  font-size: 0.95rem;
  line-height: 1.5;
`;

/* --- Earn -------------------------------------------------------------- */

/* The steps down the left, the card on the right. */
export const EarnSplit = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: start;

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: 56px;
  }
`;

/* Numbered down the page, in the ochre square: they happen in this
   order. */
export const StepList = styled.ol`
  display: grid;
  gap: 22px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const StepItem = styled.li`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
`;

export const StepNumber = styled.span`
  display: inline-grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 2px solid ${colors.ink};
  background: ${colors.ochre};
  color: ${colors.ink};
  font-family: ${fonts.mono};
  font-size: 0.75rem;
  font-weight: 700;
`;

export const StepTitle = styled.h3`
  margin: 2px 0 4px;
  font-family: ${fonts.display};
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.05;
`;

export const StepCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: rgba(247, 247, 242, 0.82);
  line-height: 1.55;
`;

/* Three steps across from tablet up, for the band with no card beside
   them: the same numbered items, side by side. */
export const StepGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-block: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px;
  }
`;

/* The steps grouped by when they happen: the things to do before the
   day on the left, the day itself on the right, each under a small
   label with a rule. The day's column is the wider of the two, and its
   label is ochre, the numbers' colour, so it reads as the point. */
export const PhaseGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 2fr 1.15fr;
    gap: 40px;
  }
`;

export const Phase = styled.div`
  display: grid;
  gap: 18px;
  align-content: start;
`;

export const PhaseLabel = styled.p`
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(247, 247, 242, 0.25);
  color: ${(props) => (props.$day ? colors.ochre : colors.sky)};
  font-family: ${fonts.mono};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const PhaseSteps = styled.ol`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(${(props) => props.$count}, minmax(0, 1fr));
    gap: 32px;
  }
`;

/* The sign-in, the supporting link and the aside under the steps. */
export const StepsActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 24px;
  margin-top: 28px;
  color: rgba(247, 247, 242, 0.82);
`;

/* --- Complete ---------------------------------------------------------- */

/* The pace line under the steps: what they add up to, and no finish
   line. Marked with the ochre square the steps are numbered in, rather
   than a rule, so it reads as the fourth beat of the list. */
export const CompleteBody = styled.p`
  position: relative;
  max-width: 48ch;
  margin: 30px 0 0;
  padding-left: 50px;
  font-size: 1rem;
  line-height: 1.55;

  &::before {
    content: '';
    position: absolute;
    top: 0.45em;
    left: 11px;
    width: 12px;
    height: 12px;
    background: ${colors.ochre};
  }
`;

/* The milestone card as /my draws it (Milestones.module.css): ink border,
   white, the maroon offset, a rule between the two milestones. */
export const CompleteCard = styled.div`
  padding: 6px 20px 4px;
  color: ${colors.ink};
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 8px 8px 0 ${colors.forestDeep};
`;

export const CardSection = styled.div`
  padding: 14px 0;

  & + & {
    border-top: 1px solid ${colors.rule};
  }
`;

export const CardHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

export const CardTag = styled.span`
  padding: 5px 10px;
  color: ${colors.white};
  border-radius: 6px;
  background: ${colors.ink};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const CardTitle = styled.span`
  font-family: ${fonts.display};
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
`;

export const EarnedBadge = styled.span`
  margin-left: auto;
  padding: 4px 10px;
  border: 1px solid ${colors.ink};
  background: ${colors.ochre};
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;
`;

export const PendingBadge = styled(EarnedBadge)`
  color: ${colors.muted};
  border: 1px dashed ${colors.rule};
  background: transparent;
`;

export const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 11px 0;
  border-top: 1px solid ${colors.rule};
`;

export const CardTick = styled.span`
  display: flex;
  flex: 0 0 23px;
  width: 23px;
  height: 23px;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  border-radius: 50%;
  background: ${colors.forest};
  font-size: 0.72rem;
  font-weight: 700;
`;

export const CardRowText = styled.span`
  display: flex;
  min-width: 0;
  flex-direction: column;

  strong {
    font-weight: 600;
  }

  span {
    color: ${colors.muted};
    font-size: 0.9rem;
  }
`;

export const StickerRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px 22px;
  padding: 18px 0 8px;
`;

/* The sticker in its die-cut slot, as ActivityCard.module.css draws it. */
export const Slot = styled.span`
  position: relative;
  display: block;
  width: 72px;
  height: 72px;
  flex: none;

  &::before {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    border: 1.5px dashed ${colors.rule};
  }
`;

const STICKER_GROUND = {
  online: colors.sky,
  inperson: colors.pink,
  tools: colors.rule,
  ochre: colors.ochre,
  white: colors.white,
  sky: colors.sky,
  rule: colors.rule,
  pink: colors.pink,
};

const peeled = css`
  transform: rotate(-9deg) translate(6px, -6px);
  box-shadow: -3px 6px 0 rgba(16, 32, 29, 0.35);
`;

export const Sticker = styled.span`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 3px solid ${colors.white};
  outline: 2px solid ${colors.ink};
  background: ${(props) => STICKER_GROUND[props.$type] || colors.pink};
  box-shadow: 0 2px 0 rgba(16, 32, 29, 0.25);

  svg {
    width: 58%;
    height: 58%;
  }

  ${(props) => props.$peeled && peeled}

  /* The completion band's first sticker: flat at rest, peeled once the
     band has scrolled into view (data-revealed on CompleteRoot), and
     peeled from the start when motion is reduced. */
  ${(props) =>
    props.$reveals &&
    css`
      transition:
        transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 420ms ease;

      [data-revealed='true'] & {
        ${peeled}
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
        ${peeled}
      }
    `}
`;

export const EarnedTab = styled.span`
  position: absolute;
  bottom: -8px;
  left: 50%;
  z-index: 1;
  transform: translateX(-50%) rotate(-6deg);

  ${(props) =>
    props.$reveals &&
    css`
      opacity: 0;
      transform: translateX(-50%) translateY(-10px) rotate(-6deg);
      transition:
        opacity 240ms ease 300ms,
        transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1) 300ms;

      [data-revealed='true'] & {
        opacity: 1;
        transform: translateX(-50%) rotate(-6deg);
      }

      @media (prefers-reduced-motion: reduce) {
        opacity: 1;
        transform: translateX(-50%) rotate(-6deg);
        transition: none;
      }
    `}
  padding: 2px 6px;
  border: 2px solid ${colors.ink};
  background: ${colors.orange};
  color: ${colors.white};
  font-family: ${fonts.mono};
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const CardCaption = styled.span`
  max-width: 26ch;
  color: ${colors.muted};
  font-size: 0.9rem;

  @media (max-width: 479px) {
    flex-basis: 100%;
    max-width: none;
  }
`;

/* --- The hero ------------------------------------------------------------

   PageHero's grammar (PageHero.module.css), split into two columns from
   desktop up: the copy left, the pack right. The values are the same as
   PageHero's; only the layout differs. */

export const HeroRoot = styled.section`
  position: relative;
  overflow: hidden;
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forest};
`;

export const HeroDeco = styled.div`
  position: absolute;
  z-index: 0;
  display: none;
  pointer-events: none;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  /* The copy in this hero is left-aligned, not centred as in PageHero,
     so the top-left stairs need the shell's gutter to clear them: they
     show only from 1440px, where the gutter is 80px. The bottom-right
     columns sit under the object column's padding at any desktop width. */
  ${(props) =>
    props.$corner === 'topLeft'
      ? css`
          @media (min-width: 1440px) {
            display: block;
            top: 0;
            left: max(0px, calc(50% - 960px));
            width: clamp(110px, 11vw, 170px);
          }
        `
      : css`
          @media (min-width: ${breakpoints.desktop}) {
            display: block;
            right: max(0px, calc(50% - 960px));
            bottom: 0;
            width: clamp(170px, 17vw, 260px);
          }
        `}
`;

export const HeroInner = styled(Shell)`
  position: relative;
  z-index: 1;
  display: grid;
  /* minmax(0, 1fr), not 1fr: a 1fr track's floor is its content's
     min-content width, and the pack stage's fixed geometry would push the
     whole column past a phone's edge. */
  grid-template-columns: minmax(0, 1fr);
  gap: 40px;
  padding-block: clamp(44px, 6vw, 84px);

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: minmax(0, 1fr) 560px;
    gap: 48px;
    align-items: center;
  }
`;

export const HeroCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (min-width: ${breakpoints.desktop}) {
    align-items: flex-start;
    text-align: left;
  }
`;

export const HeroSquares = styled.div`
  display: flex;
  margin-bottom: 16px;

  span {
    width: 14px;
    height: 14px;
  }

  span:nth-child(1) {
    background: ${colors.orange};
  }

  span:nth-child(2) {
    background: ${colors.sky};
  }

  span:nth-child(3) {
    background: ${colors.ochre};
  }

  span:nth-child(4) {
    background: ${colors.pink};
  }
`;

export const HeroEyebrow = styled.p`
  margin: 0 0 10px;
  color: ${colors.pinkLight};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const HeroHeading = styled.h1`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 0.98;
  text-wrap: balance;

  /* The second line takes the world's colour: sky for online, pink for
     in person, the same pair the nav's dropdowns underline with. */
  em {
    display: block;
    color: ${(props) => (props.$accent === 'pink' ? colors.pink : colors.sky)};
    font-style: normal;
  }
`;

export const HeroDeck = styled.p`
  max-width: 54ch;
  margin: 18px 0 0;
  font-size: 1.05rem;
  line-height: 1.5;

  /* When a shorter phone intro follows, this one steps aside below
     tablet width. */
  &:has(+ p) {
    @media (max-width: 767px) {
      display: none;
    }
  }
`;

/* The phone's shorter intro; the two swap at the tablet breakpoint. */
export const HeroDeckShort = styled(HeroDeck)`
  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

/* The facts a stranger wants first, as mono chips on the forest. */
export const HeroFacts = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 5px 9px;
    border: 1.5px solid rgba(247, 247, 242, 0.55);
    color: ${colors.white};
    font-family: ${fonts.mono};
    font-size: 0.66rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  @media (min-width: ${breakpoints.desktop}) {
    justify-content: flex-start;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  width: 100%;
  margin-top: 30px;

  @media (min-width: ${breakpoints.desktop}) {
    justify-content: flex-start;
  }
`;

export const HeroButton = styled.a`
  ${buttonStyles}
  width: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    width: auto;
  }
`;

export const HeroSecondaryButton = styled.a.attrs({ $variant: 'secondary' })`
  ${buttonStyles}
  width: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    width: auto;
  }
`;

/* The partner lockups, as the homepage hero draws them
   (Hero.styles.js), left-aligned under the actions here. */
export const HeroPartners = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px 36px;
  margin-top: 40px;

  @media (min-width: ${breakpoints.desktop}) {
    justify-content: flex-start;
  }
`;

export const HeroPartnerGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  @media (min-width: ${breakpoints.desktop}) {
    align-items: flex-start;
  }
`;

export const HeroPartnerLabel = styled.span`
  color: ${colors.pinkLight};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const HeroPartnerLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  display: inline-flex;
  align-items: center;
`;

export const HeroPartnerChip = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 5px 5px 0 ${colors.forestDeep};

  svg {
    width: auto;
    height: 28px;
  }
`;

export const HeroPartnerTimes = styled.span`
  color: ${colors.ink};
  font-family: ${fonts.display};
  font-size: 1rem;
  font-weight: 700;
`;

/* The pile: a heap of stickers put down on the forest, each one framed
   the way the album frames an earned sticker (Hex below), at the sizes
   they are printed, overlapping the way a handful of stickers does. Fixed
   geometry (a 560px stage) that shrinks as a whole below desktop, so the
   composition never reflows. */
export const PileStage = styled.div`
  position: relative;
  width: 560px;
  max-width: 100%;
  height: 440px;
  margin: 0 auto;

  @media (max-width: 1023px) {
    zoom: 0.8;
  }

  @media (max-width: 479px) {
    zoom: 0.6;
  }
`;

export const PileSticker = styled.span`
  position: absolute;
  display: block;
`;

/* The in-person hero's object: two prints from past Fests laid on the
   ground, the treatment the /host page's "you bring the people" stack
   uses, with forestDeep shadows, the deep end of the hero's own green,
   the way the partner chips cast theirs. A fixed stage, so the overlap
   holds at every width. */
export const Prints = styled.div`
  position: relative;
  width: 560px;
  max-width: 100%;
  height: 470px;
  margin: 0 auto;

  /* Shrinks as a whole below the desktop column, and again on phones,
     so the two prints keep their overlap at every width. */
  @media (max-width: 1023px) {
    zoom: 0.75;
  }

  @media (max-width: 479px) {
    zoom: 0.6;
  }
`;

export const Print = styled.img`
  position: absolute;
  display: block;
  height: auto;
  aspect-ratio: 3 / 2;
  padding: 10px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  object-fit: cover;

  ${(props) =>
    props.$index === 0
      ? css`
          top: 0;
          left: 0;
          width: 440px;
          box-shadow: 8px 8px 0 ${colors.forestDeep};
          transform: rotate(-3deg);
        `
      : css`
          right: 0;
          bottom: 0;
          width: 320px;
          box-shadow: 8px 8px 0 ${colors.forestDeep};
          transform: rotate(4deg);
        `}
`;

/* --- Milestones --------------------------------------------------------- */

/* The three milestones on paperDeep, a step darker than the steps'
   forest neighbour is light: the band with the cards that matter most. */
export const MilestonesRoot = styled.section`
  ${sectionRoot}
  background: ${colors.paperDeep};
`;

/* Three across from tablet up; a world with a fourth card gets two by
   two on a tablet and four across on a desktop. */
export const MilestonesGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(
      ${(props) => (props.$count > 3 ? 2 : props.$count || 3)},
      minmax(0, 1fr)
    );
    gap: 24px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(
      ${(props) => props.$count || 3},
      minmax(0, 1fr)
    );
  }
`;

/* One milestone: the sticker, the count it takes, the name and what it
   gets you. The card /my's rewards band draws, without the meter, since
   nothing here is anyone's yet. */
export const MilestoneCard = styled.div`
  display: grid;
  /* One bounded track: without it the implicit auto column grows to the
     head's min-content (the sticker beside the no-wrap count tag) and
     every line in the card runs past its edge on a tablet. */
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  align-content: start;
  justify-items: start;
  padding: 24px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
`;

/* A hexagon sticker as the album draws an earned one (Album.module.css
   .sticker): the ink outline is the whole box clipped to the hexagon, the
   white ring sits 2.3px in at 72px, and the picture (the file carries
   the ground and the glyph on a clear square) fills the box 5.8px in, so
   it lies over the two rings. Both insets scale with the size. The cast
   shadow is a drop-shadow on the unclipped box, the earned one, since
   nothing on a landing page is anyone's yet and the pictures are shown
   as they will look once they are. */
const HEX =
  'polygon(50% 0, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)';

export const Hex = styled.span`
  position: relative;
  display: grid;
  place-items: center;
  width: ${(props) => props.$size || 96}px;
  height: ${(props) => props.$size || 96}px;
  padding: ${(props) => ((props.$size || 96) * 5.8) / 72}px;
  isolation: isolate;
  filter: drop-shadow(-2px 3px 0 rgba(16, 32, 29, 0.35));

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    clip-path: ${HEX};
    background: ${colors.ink};
  }

  &::after {
    inset: ${(props) => ((props.$size || 96) * 2.3) / 72}px;
    background: ${colors.white};
  }

  img {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
  }
`;

/* The sticker at the left, the count it takes at the top right. */
export const MilestoneHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const MilestoneAt = styled.span`
  flex: none;
  padding: 3px 7px;
  border: 2px solid ${colors.forest};
  white-space: nowrap;
  color: ${colors.forest};
  font-family: ${fonts.mono};
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  /* The in-person page's on-the-day card wears the room's colour. */
  ${(props) =>
    props.$tone === 'pink' &&
    css`
      border-color: ${colors.pink};
      background: ${colors.pinkLight};
      color: ${colors.maroon};
    `}
`;

export const MilestoneTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.05;
`;

export const MilestoneCopy = styled.p`
  margin: 0;
  color: ${colors.inkSoft};
  font-size: 0.95rem;
  line-height: 1.5;
`;

/* The on-the-day card's picture: the Tabler icon itself, in the room's
   pink with a thin ink edge and a hard maroon copy offset behind it, the
   shadow the card it sits on casts, so the two share one light. Not a
   sticker, so no hexagon and no frame (Jacklyn's picks, 2026-09-22).
   overflow visible, so the edge and the offset are not clipped by the
   viewBox. */
export const DayIcon = styled.svg`
  display: block;
  width: 56px;
  height: 56px;
  flex: none;
  overflow: visible;
  fill: ${colors.pink};
  stroke: ${colors.ink};
  stroke-width: 1.6;
  stroke-linejoin: round;
  paint-order: stroke;
  filter: drop-shadow(4px 4px 0 ${colors.maroon});
`;

/* The one way onward a card can carry: a text link, the mono underline
   the site uses for a small link. */
export const MilestoneLink = styled.a`
  margin-top: 2px;
  color: ${colors.forest};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 3px;
`;

/* The line under the cards: small and quiet, the album's disclaimer at
   this band's width. */
export const MilestoneNote = styled(Shell).attrs({ as: 'p' })`
  margin-top: 20px;
  color: ${colors.muted};
  font-size: 0.85rem;
  line-height: 1.5;
`;

/* --- The collection ------------------------------------------------------ */

export const CollectionRoot = styled.section`
  ${sectionRoot}
  background: ${colors.paper};
`;

/* One row per page of the book: the page's name and line at the left,
   its stickers along the right, a rule between rows. */
export const CollectionPages = styled(Shell)`
  display: grid;
`;

export const CollectionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  padding: 18px 0;
  border-top: 2px solid ${colors.paperDeep};

  &:first-child {
    border-top: 0;
    padding-top: 0;
  }

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 28px;
    align-items: center;
  }
`;

export const CollectionTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.05;

  small {
    display: block;
    margin-top: 4px;
    color: ${colors.muted};
    font-family: ${fonts.sans};
    font-size: 0.86rem;
    font-weight: 400;
    line-height: 1.4;
  }
`;

/* The stickers along a row. Under the pointer a sticker says its name
   (data-label on the item), in the mono tag the site labels things with,
   held above the sticker; the name is also the picture's alt, so nothing
   here is hover-only for a reader. */
export const CollectionStickers = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
  }

  li[data-label]::after {
    content: attr(data-label);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    z-index: 2;
    max-width: 22ch;
    padding: 4px 8px;
    border: 2px solid ${colors.ink};
    background: ${colors.ink};
    color: ${colors.white};
    font-family: ${fonts.mono};
    font-size: 0.62rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: 0.04em;
    text-align: center;
    white-space: normal;
    width: max-content;
    transform: translateX(-50%) translateY(4px);
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.12s ease,
      transform 0.12s ease;
  }

  li[data-label]:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    li[data-label]::after {
      transition: none;
    }
  }
`;
