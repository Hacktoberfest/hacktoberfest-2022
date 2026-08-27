import styled from 'styled-components';

import { buttonStyles } from 'components/Button';
import Shell from 'components/Shell';
import TypeformButton from 'components/TypeformButton.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

/* The /sponsor bands reuse the /host vocabulary: paper and paper-deep
   grounds under ink rules, mono eyebrows, condensed display headings,
   and one loud forest band to close. */

export const Eyebrow = styled.p`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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
    max-width: 16ch;
  }

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const SectionIntro = styled(Shell)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 40px;
  margin-bottom: 50px;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
  }
`;

export const SectionIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
`;

/* The Typeform popup wearing the shared button clothes; the page passes
   $variant="secondary" in the hero (forest ground) and default elsewhere. */
export const InfoButton = styled(TypeformButton)`
  ${buttonStyles}
`;

/* --- Sponsor wall ------------------------------------------------------ */

export const WallRoot = styled.section`
  padding: 64px 0;
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paper};

  @media (min-width: ${breakpoints.tablet}) {
    padding: 80px 0 120px;
  }
`;

export const WallHeadingWrap = styled(Shell)`
  margin-bottom: 48px;
`;

export const WallHeading = styled.h2`
  max-width: none;
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(2.25rem, 4vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  text-wrap: balance;

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

/* A fixed grid rather than auto-fit: the top row is the three partner
   seats (DigitalOcean double-width), the next two rows the seven
   sponsors plus the empty seat, so the wall always resolves into full
   rows instead of a ragged tail. */
export const WallGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin: 0 auto;
  padding-left: 0;
  list-style: none;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const WallItem = styled.li`
  display: flex;
  flex-direction: column;
`;

export const WallLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 104px;
  padding: 14px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 ${colors.maroon};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:focus-visible {
    outline: 3px solid ${colors.orange};
    outline-offset: 3px;
  }
`;

export const WallLogo = styled.img`
  display: block;
  width: min(100%, ${(props) => (props.$wide ? '200px' : '150px')});
  max-height: 52px;
  object-fit: contain;
`;

/* The partner marks live in the wall grid now, first three tiles: the
   same white tile as a sponsor logo, with a small role label on top.
   Label and tile sit inside one anchor, so the whole composite is the
   click target and lifts together on hover. The icon components are
   inline SVGs, so the tile sizes them itself. */
export const PartnerTileLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  display: flex;
  flex: 1;
  flex-direction: column;
  text-decoration: none;
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 ${colors.maroon};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:focus-visible {
    outline: 3px solid ${colors.orange};
    outline-offset: 3px;
  }
`;

export const PartnerTileBody = styled.span`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 104px;
  padding: 14px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};

  svg {
    width: auto;
    max-width: 100%;
    height: 42px;
  }
`;

export const PartnerTileLabel = styled.span`
  display: flex;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 7px 12px;
  border: 2px solid ${colors.ink};
  border-bottom: 0;
  background: ${colors.forest};
  color: ${colors.white};
  font-family: ${fonts.mono};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.25;
  text-transform: uppercase;

  &::before {
    width: 9px;
    height: 9px;
    flex: 0 0 auto;
    background: ${(props) => (props.$presenter ? colors.ochre : colors.sky)};
    /* Deep green, not maroon: on the forest ground the maroon offset
       reads muddy, the way the hero's partner chips already shadow. */
    box-shadow: 3px 3px 0 ${colors.forestDeep};
    content: '';
  }
`;

/* The presenting partner reads louder than anyone else on the wall: a
   double-width seat in the top row, its wordmark a step larger. */
export const PresenterItem = styled(WallItem)`
  @media (min-width: ${breakpoints.tablet}) {
    grid-column: span 2;
  }
`;

export const PresenterTileLink = styled(PartnerTileLink)`
  svg {
    height: 36px;
  }
`;

/* The grid's empty seat: a dashed, non-interactive tile holding a place
   for the next sponsor. Hidden from assistive tech; it is a visual
   invitation, not a list entry. */
export const GhostTile = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 104px;
  padding: 20px;
  border: 2px dashed rgba(16, 32, 29, 0.4);
  color: ${colors.muted};
  font-family: ${fonts.mono};
  font-size: 0.7rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

/* The wall's close: the ask as a full-width dashed band under the grid.
   The whole band is one link, with a button-shaped label inside for the
   eye to land on. */
export const WallBandWrap = styled(Shell)`
  margin-top: 14px;
`;

export const WallBand = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  display: flex;
  min-height: 94px;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 24px;
  border: 2px dashed ${colors.ink};
  color: ${colors.ink};
  text-decoration: none;

  &:hover {
    background: ${colors.white};
  }

  &:focus-visible {
    outline: 3px solid ${colors.orange};
    outline-offset: 3px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
  }
`;

export const WallBandTitle = styled.strong`
  font-family: ${fonts.display};
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
`;

/* The button-shaped label presses like the real Button when the band
   (the actual link) is hovered. */
export const WallBandButton = styled.span`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: 2px solid ${colors.ink};
  background: ${colors.pink};
  box-shadow: 5px 5px 0 ${colors.maroon};
  font-family: ${fonts.mono};
  font-size: 0.85rem;
  font-weight: 650;
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;

  ${WallBand}:hover & {
    transform: translate(2px, 2px);
    box-shadow: 3px 3px 0 ${colors.maroon};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* --- Stats band -------------------------------------------------------- */

export const StatsRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paperDeep};
`;

export const StatsGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

/* Stat cards in the wall tiles' clothes: white, ink border, maroon
   offset. Each wears one of the four-square accent colors as a chip,
   tying the band to the hero's motif. */
export const StatItem = styled.article`
  padding: 26px 28px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
`;

export const StatChipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const chipTones = {
  dev: colors.orange,
  mlh: colors.sky,
  packs: colors.ochre,
};

export const StatChip = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid ${colors.ink};
  background: ${(props) => chipTones[props.$tone]};
`;

export const StatEyebrow = styled(Eyebrow)`
  color: ${colors.inkSoft};
  font-size: 0.72rem;
`;

export const StatValue = styled.h3`
  margin: 18px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 3.6vw, 3.8rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.9;
`;

export const StatUnit = styled.p`
  margin: 6px 0 0;
  font-family: ${fonts.display};
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const StatCopy = styled.p`
  max-width: 40ch;
  margin: 12px 0 0;
  color: #34433f;
  font-size: 0.9rem;
  text-wrap: pretty;
`;

/* --- Partnership band -------------------------------------------------- */

export const PartnershipRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forest};
`;

/* Two columns from tablet up: the pitch and its CTAs on the left, the
   partnership card on the right. Centered single column below. */
export const PartnershipGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 50px;
  align-items: center;

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 5fr 6fr;
    gap: 60px;
  }
`;

export const PartnershipEyebrow = styled(Eyebrow)`
  color: ${colors.pinkLight};
`;

export const PartnershipHeading = styled.h2`
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;
  max-width: 14ch;

  /* Sky for the accent, matching PageHero: orange reads muddy on the
     forest ground at display sizes. */
  em {
    color: ${colors.sky};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const PartnershipCopy = styled.p`
  max-width: 44ch;
  margin: 22px 0 0;
  text-wrap: pretty;
`;

export const PartnershipActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 34px;
`;

/* The partnership card: what a sponsorship carries, as one artifact.
   The activation split is its header row, the benefits its ledger
   lines. Deep-green shadow: on the forest ground the maroon offset
   reads muddy, the way the hero's partner chips already shadow. */
export const Card = styled.div`
  color: ${colors.ink};
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.forestDeep};
`;

export const CardSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  border-bottom: 2px solid ${colors.ink};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const SplitCell = styled.div`
  padding: 16px 24px;

  & + & {
    border-top: 2px solid ${colors.ink};
  }

  @media (min-width: ${breakpoints.tablet}) {
    & + & {
      border-top: none;
      border-left: 2px solid ${colors.ink};
    }
  }
`;

export const SplitEyebrow = styled(Eyebrow)`
  color: ${colors.inkSoft};
  font-size: 0.68rem;
`;

export const SplitCopy = styled.p`
  margin: 4px 0 0;
  font-family: ${fonts.display};
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.05;
`;

export const Benefit = styled.article`
  display: flex;
  gap: 12px;
  padding: 16px 24px;

  & + & {
    border-top: 1px solid rgba(16, 32, 29, 0.22);
  }
`;

export const BenefitCheck = styled.span`
  color: ${colors.orange};
  font-family: ${fonts.display};
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1;
`;

export const BenefitTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const BenefitCopy = styled.p`
  margin: 6px 0 0;
  color: #34433f;
  font-size: 0.9rem;
  text-wrap: pretty;
`;
