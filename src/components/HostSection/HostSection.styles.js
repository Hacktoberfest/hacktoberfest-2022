import styled, { css, keyframes } from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const FormatsRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paper};
`;

export const SupportRoot = styled(FormatsRoot)`
  background: ${colors.paperDeep};
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
    max-width: 14ch;
  }

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const SectionIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
`;

export const FormatGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const FormatCard = styled.article`
  display: flex;
  flex-direction: column;
  padding: 30px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
`;

export const FormatCardTag = styled.span`
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

export const FormatCardTitle = styled.h3`
  margin: 22px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.05rem, 3vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 0.95;
`;

export const FormatCardCopy = styled.p`
  margin: 18px 0 0;
  color: ${colors.ink};
  font-size: 0.93rem;
  text-wrap: pretty;
`;

/* The at-a-glance facts, moved inside each card: the old comparison
   table's cell vocabulary (mono values, hairline rows) without saying
   everything twice. The auto margin pins both cards' facts to a shared
   bottom edge; the padding keeps a floor under the copy when the cards
   are the same height. */
export const FormatCardFacts = styled.dl`
  margin: auto 0 0;
  padding-top: 26px;
`;

export const FormatCardFactRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-block: 9px;
  border-top: 1px solid rgba(16, 32, 29, 0.22);

  &:first-child {
    border-top-width: 2px;
    border-top-color: ${colors.ink};
  }

  dt {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
  }

  dd {
    margin: 0;
    font-family: ${fonts.mono};
    font-size: 0.85rem;
    font-weight: 650;
    text-align: right;
  }
`;

/* The photo reel between the formats and the support story: the same
   full-bleed sky chapter as /my's why-host band, with the photos as the
   tilted prints that band lays on its box. The band above already draws
   the shared ink edge, so this only closes its own bottom. */
export const PhotoStripRoot = styled.section`
  padding-block: clamp(40px, 5vw, 72px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.sky};
`;

/* The reel loop: the track holds the strip twice and slides by half of
   itself, so the second copy lands exactly where the first began and the
   wrap is invisible. Half the track is half its width plus half of one
   gap (the track's midpoint falls inside the gap between the copies).
   Each print's tilt keys off its place in the photo list, not the DOM,
   so a print and its loop copy always lean the same way and the wrap
   never twitches, whatever the photo count. */
const reelLoop = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-50% - 12px));
  }
`;

/* The clip box: full-bleed, hiding whichever prints the track has slid
   past. When motion is reduced the reel stands still and becomes the
   reader's own sideways scroller instead. */
export const PhotoReel = styled.div`
  overflow: hidden;

  @media (prefers-reduced-motion: reduce) {
    overflow-x: auto;
  }
`;

/* The block padding is canvas for the tilt and the press-down shadows,
   which would otherwise clip against the reel's box. Hovering holds the
   reel still for a proper look. */
export const PhotoReelTrack = styled.ul`
  display: flex;
  width: max-content;
  margin: 0;
  padding: 14px 0 22px;
  gap: 24px;
  list-style: none;
  animation: ${reelLoop} 48s linear infinite;

  &:hover {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    padding-inline: 15px;
    animation: none;
  }
`;

export const PhotoStripItem = styled.li`
  flex: none;
  /* Phone-to-desktop is the 72vw-capped-at-320px print. The 13vw floor
     is the ultrawide (and zoomed-out) guarantee: with eight photos,
     8 x 13vw > 100vw, so one copy of the strip always outspans the
     viewport and the loop never runs off the right edge mid-cycle. If
     the photo list shrinks, this floor must grow to at least
     100 / (photo count) vw. */
  width: max(min(72vw, 320px), 13vw);

  /* With the reel parked, the loop copy is six stale repeats at the end
     of the scroller; it only exists to close the moving loop. */
  @media (prefers-reduced-motion: reduce) {
    &[aria-hidden='true'] {
      display: none;
    }
  }
`;

/* The why-host band's print treatment: a white mount inside the ink
   keyline, the press-down shadow in skyDeep (the deep end of the band's
   own blue), and a couple of degrees of tilt alternating down the strip.
   The fixed aspect keeps the prints even whatever each source file's
   ratio is; object-fit takes the difference out of the crop. */
export const PhotoStripPrint = styled.img`
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 2;
  padding: 8px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  object-fit: cover;
  box-shadow: 6px 6px 0 ${colors.skyDeep};
  transform: rotate(${({ $tilt }) => $tilt}deg);
`;

/* The support section as the two sides of the deal the headline names:
   the host's half carries faces, MLH's half is the manifest card. One
   grid holds both columns so the heading's two halves can sit at the
   top of the column each one describes; the areas re-stack into a
   single reading order on phones (your side first, then ours). */
export const SupportSplit = styled(Shell)`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'eyebrow'
    'lead'
    'photos'
    'accent'
    'card';

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    column-gap: clamp(40px, 6vw, 90px);
    grid-template-areas:
      'eyebrow accent'
      'lead    accent'
      'photos  card';
  }
`;

export const SupportEyebrow = styled(Eyebrow)`
  grid-area: eyebrow;
`;

/* The one h2 the section is labelled by. display: contents dissolves
   its box so the two halves become grid items of SupportSplit; the h2
   itself keeps the full sentence pair as the section's accessible
   name. */
export const SupportHeading = styled.h2`
  display: contents;
  margin: 0;
`;

const supportHeadline = css`
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;
`;

export const SupportLead = styled.span`
  ${supportHeadline};
  grid-area: lead;
  margin-top: 13px;
`;

/* Bottom-aligned against the lead so the two halves share a baseline
   whatever their line counts; on phones it instead opens MLH's half of
   the section, after the photos. */
export const SupportAccent = styled.em`
  ${supportHeadline};
  grid-area: accent;
  margin: 40px 0 0;
  color: ${colors.orange};
  font-style: normal;

  @media (min-width: ${breakpoints.tablet}) {
    margin-top: 0;
    align-self: end;
  }
`;

/* The photo pair under the host's half: the reel's print treatment,
   standing still. The bottom padding is canvas for the smaller print's
   overhang; align-self keeps the stack sized to its prints instead of
   stretching down the card's row, which would drag the overhang print
   off the big one. */
export const PhotoStack = styled.div`
  grid-area: photos;
  position: relative;
  align-self: start;
  margin-top: 44px;
  padding-bottom: 60px;
`;

export const PhotoPrintMain = styled.img`
  display: block;
  width: min(440px, 94%);
  height: auto;
  aspect-ratio: 3 / 2;
  padding: 8px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  object-fit: cover;
  box-shadow: 6px 6px 0 ${colors.maroon};
  transform: rotate(-2deg);
`;

export const PhotoPrintOverlay = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: min(250px, 56%);
  height: auto;
  aspect-ratio: 3 / 2;
  padding: 6px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  object-fit: cover;
  box-shadow: 5px 5px 0 ${colors.skyDeep};
  transform: rotate(2.2deg);
`;

/* MLH's half: everything a confirmed Fest gets, packed into one card
   with the handbook as its footer instead of an orphaned band below. */
export const SupportCard = styled.div`
  grid-area: card;
  margin-top: 30px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
`;

export const SupportList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SupportListItem = styled.li`
  display: flex;
  gap: 18px;
  padding: 24px 28px;

  & + & {
    border-top: 1px solid rgba(16, 32, 29, 0.22);
  }
`;

/* The list marker, drawn: an asterisk in the accent orange. */
export const SupportMark = styled.svg`
  flex: none;
  margin-top: 2px;

  path {
    stroke: ${colors.orange};
  }
`;

export const SupportItemTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const SupportItemCopy = styled.p`
  max-width: 56ch;
  margin: 8px 0 0;
  color: #34433f;
  font-size: 0.93rem;
  text-wrap: pretty;
`;

export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 22px;
  padding: 24px 28px;
  border-top: 2px solid ${colors.ink};
  background: ${colors.paper};

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

/* The card's own headline, the piece that made it read as filler: every
   other box on the page opens with display type, this one opened with a
   bare sentence. Sized to the FormatCardTitle's floor rather than a
   section heading, so it stays a card voice, not a chapter voice. */
export const GuideTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.5rem, 2vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.95;
`;

export const GuideCopy = styled.p`
  max-width: 46ch;
  margin: 12px 0 0;
  font-size: 0.95rem;
  text-wrap: pretty;
`;

/* Outline demotion: the apply CTA one screen later stays the page's
   only loud button. flex: none keeps the footer row from folding the
   label when the copy takes its share of the width. */
export const GuideButton = styled(Button)`
  flex: none;
  background: transparent;
  box-shadow: none;

  &:hover {
    background: ${colors.pinkLight};
    box-shadow: none;
  }
`;

export const ApplyRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forest};
`;

/* The apply band as a split: the pitch and the button on the left, the
   organizer journey as a vertical rail on the right. The areas keep
   the phone order the centered layout had (steps before the button, so
   the section still ends on the CTA); the 1fr tail row keeps the
   button pinned under the body when the rail runs taller. */
export const ApplySplit = styled(Shell)`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'eyebrow'
    'heading'
    'body'
    'rail'
    'button';

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: auto auto auto 1fr;
    column-gap: clamp(40px, 6vw, 90px);
    grid-template-areas:
      'eyebrow rail'
      'heading rail'
      'body    rail'
      'button  rail';
  }
`;

export const ApplyEyebrow = styled(Eyebrow)`
  grid-area: eyebrow;
  color: ${colors.pinkLight};
`;

export const ApplyHeading = styled.h2`
  grid-area: heading;
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;

  /* Sky for the accent, matching PageHero: orange reads muddy on the
     forest ground at display sizes. */
  em {
    color: ${colors.sky};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const ApplyBody = styled.p`
  grid-area: body;
  max-width: 42ch;
  margin: 22px 0 0;
  text-wrap: pretty;
`;

/* The organizer journey as a rail: the three steps hang off one
   vertical rule, each pinned to it by a sky node. */
export const StepsList = styled.ol`
  display: flex;
  flex-direction: column;
  align-self: start;
  gap: 34px;
  grid-area: rail;
  margin: 44px 0 0;
  padding: 8px 0 0 36px;
  border-left: 2px solid rgba(247, 247, 242, 0.35);
  list-style: none;

  @media (min-width: ${breakpoints.tablet}) {
    margin-top: 0;
  }
`;

export const StepItem = styled.li`
  position: relative;
`;

/* The node that ties a step to the rail, sized to sit astride the
   rule: item content starts 36px right of it, so -44px centers the
   14px square on the 2px line. */
export const StepNode = styled.span`
  position: absolute;
  top: 4px;
  left: -44px;
  width: 14px;
  height: 14px;
  border: 2px solid ${colors.ink};
  background: ${colors.sky};
`;

export const StepNumber = styled.span`
  display: block;
  color: ${colors.sky};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

export const StepTitle = styled.h3`
  margin: 8px 0 0;
  font-family: ${fonts.display};
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
`;

export const StepCopy = styled.p`
  margin: 8px 0 0;
  color: rgba(247, 247, 242, 0.82);
  font-size: 0.9rem;
  text-wrap: pretty;
`;

export const ApplyButton = styled(Button)`
  align-self: start;
  justify-self: start;
  grid-area: button;
  margin-top: 34px;
`;
