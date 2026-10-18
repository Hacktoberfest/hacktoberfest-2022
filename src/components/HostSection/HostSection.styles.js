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

/* Cards keep their own heights: the Hack Day card runs longer by its
   MLH Hack Days foot, and stretching the Meet Up card to match would
   leave a blank band in it. */
export const FormatGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
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
   everything twice. They follow the copy directly, so the two cards'
   rows line up whenever their copy runs to the same number of lines. */
export const FormatCardFacts = styled.dl`
  margin: 0;
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

/* The Hack Day card's foot: MLH Hack Days, the same format still on
   offer. Bled to the card's edges by its padding so it reads as the
   card's footer rather than another row of facts. */
export const FormatCardNow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 20px;
  margin: 26px -30px -30px;
  padding: 18px 30px;
  border-top: 2px solid ${colors.ink};
  background: ${colors.pinkLight};

  p {
    margin: 0;
    font-size: 0.93rem;
    text-wrap: pretty;
  }
`;

export const FormatCardNowLink = styled.a`
  color: ${colors.ink};
  font-family: ${fonts.mono};
  font-size: 0.8rem;
  font-weight: 700;
  text-underline-offset: 3px;
  white-space: nowrap;
`;

/* The photo reel between the formats and the support story: the same
   full-bleed sky chapter as /my's why-host band, with the photos as the
   tilted prints that band lays on its box. The band above already draws
   the shared ink edge, so this only closes its own bottom. */
export const PhotoStripRoot = styled.section`
  padding-block: clamp(40px, 5vw, 72px);
  border-bottom: 2px solid ${colors.ink};
  /* Sky on /host; pink on /in-person, that world's colour (PhotoStrip.js). */
  background: ${(props) => (props.$tone === 'pink' ? colors.pink : colors.sky)};
`;

/* The reel's visible label, in the shell so it lines up with the bands
   above and below; the reel itself bleeds. */
export const PhotoStripCaption = styled(Shell)`
  margin-bottom: 4px;
  color: ${colors.ink};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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
  /* The deep end of whichever band the strip is on. */
  box-shadow: 6px 6px 0
    ${(props) => (props.$tone === 'pink' ? colors.maroon : colors.skyDeep)};
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

/* Stacked at every width: the copy over a row of two buttons, which
   would crowd the copy into a sliver if they shared one line. */
export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 22px;
  padding: 24px 28px;
  border-top: 2px solid ${colors.ink};
  background: ${colors.paper};
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

export const GuideActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px 18px;
`;

/* Outline demotion: the hero's Find a Fest and the Hack Days card's
   button stay the page's only loud ones. flex: none keeps a wrapped row
   from folding a label. */
export const GuideButton = styled(Button)`
  flex: none;
  background: transparent;
  box-shadow: none;

  &:hover {
    background: ${colors.pinkLight};
    box-shadow: none;
  }
`;

/* The closing band, where the apply band used to be: the forest chapter
   with the pitch on the left and, on the right, a white card of what an
   MLH Hack Day comes with. The areas keep the phone order (the card
   before the small print) and the 1fr tail row keeps the small print
   under the body when the card runs taller. */
export const HackDaysRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forest};
`;

export const HackDaysSplit = styled(Shell)`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'eyebrow'
    'heading'
    'body'
    'card'
    'fineprint';

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: auto auto auto 1fr;
    column-gap: clamp(40px, 6vw, 90px);
    grid-template-areas:
      'eyebrow   card'
      'heading   card'
      'body      card'
      'fineprint card';
  }
`;

export const HackDaysEyebrow = styled(Eyebrow)`
  grid-area: eyebrow;
  color: ${colors.pinkLight};
`;

export const HackDaysHeading = styled.h2`
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

export const HackDaysBody = styled.p`
  grid-area: body;
  max-width: 42ch;
  margin: 22px 0 0;
  text-wrap: pretty;
`;

export const HackDaysFinePrint = styled.p`
  grid-area: fineprint;
  max-width: 46ch;
  margin: 34px 0 0;
  color: rgba(247, 247, 242, 0.82);
  font-size: 0.85rem;
  text-wrap: pretty;

  a {
    color: inherit;
    text-underline-offset: 3px;
  }
`;

export const HackDaysCard = styled.div`
  grid-area: card;
  align-self: start;
  margin-top: 44px;
  padding: clamp(24px, 3vw, 32px);
  color: ${colors.ink};
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};

  @media (min-width: ${breakpoints.tablet}) {
    margin-top: 0;
  }
`;

export const HackDaysCardTitle = styled.h3`
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.5rem, 2vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.95;
`;

export const HackDaysList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
`;

export const HackDaysItem = styled.li`
  display: flex;
  gap: 12px;
  font-size: 0.95rem;
  text-wrap: pretty;
`;

/* The list marker, drawn: a tick in the forest green. */
export const HackDaysCheck = styled.svg`
  flex: none;
  margin-top: 2px;

  path {
    stroke: ${colors.forest};
  }
`;

export const HackDaysButton = styled(Button)`
  margin-top: 26px;
`;

export const HackDaysNote = styled.p`
  margin: 16px 0 0;
  color: ${colors.muted};
  font-size: 0.85rem;
`;

/* The band above the hero: Fest applications are closed, and where to
   go instead. Ochre, the palette's attention colour, so it reads as a
   notice rather than another chapter of the page. */
export const ClosedRoot = styled.aside`
  padding-block: 18px;
  color: ${colors.ink};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.ochre};
`;

export const ClosedRow = styled(Shell)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px 32px;
`;

export const ClosedMessage = styled.div`
  display: flex;
  flex: 1 1 520px;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
`;

export const ClosedBadge = styled.span`
  flex: none;
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

export const ClosedText = styled.p`
  flex: 1 1 320px;
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  text-wrap: pretty;

  strong {
    font-weight: 700;
  }
`;

/* A white button with an ink shadow: the maroon shadow the pink buttons
   wear turns to mud on ochre. */
export const ClosedButton = styled(Button)`
  flex: none;
  background: ${colors.white};
  box-shadow: 4px 4px 0 ${colors.ink};

  &:hover {
    background: ${colors.paperDeep};
    box-shadow: 2px 2px 0 ${colors.ink};
  }
`;
