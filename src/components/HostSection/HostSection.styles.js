import styled, { keyframes } from 'styled-components';

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

export const SupportGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 26px 40px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const SupportItem = styled.div`
  padding-top: 16px;
  border-top: 2px solid ${colors.ink};
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
  max-width: 52ch;
  margin: 10px 0 0;
  color: #34433f;
  font-size: 0.93rem;
  text-wrap: pretty;
`;

export const GuideBand = styled(Shell)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 22px;
  margin-top: 56px;
  padding: 30px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};

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
   only loud button. */
export const GuideButton = styled(Button)`
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

export const ApplyInner = styled(Shell)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const ApplyEyebrow = styled(Eyebrow)`
  color: ${colors.pinkLight};
`;

export const ApplyHeading = styled.h2`
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
  max-width: 52ch;
  margin: 22px 0 0;
  text-wrap: pretty;
`;

/* The organizer journey inside the apply band: three numbered steps
   between the pitch and the button. */
export const StepsList = styled.ol`
  display: grid;
  width: 100%;
  max-width: 880px;
  margin: 44px 0 0;
  padding: 0;
  gap: 22px;
  list-style: none;
  text-align: left;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 34px;
  }
`;

export const StepItem = styled.li`
  padding-top: 14px;
  border-top: 2px solid rgba(247, 247, 242, 0.35);
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
  margin-top: 34px;
`;
