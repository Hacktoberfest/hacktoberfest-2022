import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

/* Above the sticky nav and scrolling away with the page: an announcement
   is worth the first screen, not every screen.

   z-index sits one above HeaderRoot's 10 because of the band that header
   paints 120px above itself to cover iOS's late sticky repaint. That
   band is inside HeaderRoot's stacking context, so at scroll top it
   would otherwise paint straight over this strip and leave a slab of
   forest where the banner should be. The two never actually overlap:
   sticky pins the nav at the top only once this strip has scrolled off,
   so winning the paint order here costs the nav nothing.

   Sky on ink rather than the nav's forest or the CTA's pink: cool
   against the warm chrome, so it reads as an announcement rather than
   an alarm, and as a different kind of thing from both the bar it sits
   on and the buttons it competes with. */
export const BannerRoot = styled.div`
  display: grid;
  position: relative;
  z-index: 11;
  grid-template-rows: 1fr;
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.sky};
  color: ${colors.ink};
  transition:
    grid-template-rows 200ms ease,
    opacity 150ms ease;

  /* The close click. The root is a single-row grid so the strip can
     animate shut: a track can go from 1fr to 0fr where height cannot
     reach auto, and the page below rides the collapse up instead of
     jumping. The fade runs alongside because the border and any
     sub-pixel remainder of the track do not collapse to nothing — by
     the time the height is gone, so is the paint. The state is a DOM
     attribute for the same reason Header's menu state is: static CSS
     survives this static export where prop interpolation does not.

     A browser that cannot animate a grid track just snaps shut; either
     way the timer in components/Banner unmounts the strip afterwards,
     so nothing invisible is left in the tab order. */
  &[data-closing='true'] {
    grid-template-rows: 0fr;
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  /* Set on <html> before first paint by the inline script in _document,
     for someone who closed the banner on an earlier page load. The mount
     effect in Banner then unmounts the strip outright; this only has to
     hold for the moments before hydration, so the closed state never
     flashes past on the way to being removed. */
  html[data-banner-dismissed='true'] & {
    display: none;
  }
`;

/* The grid's one row. min-height: 0 lets the track actually reach zero
   — a grid item's default min-height of auto would hold the row open —
   and overflow: hidden closes over the content as it goes. */
export const Collapse = styled.div`
  min-height: 0;
  overflow: hidden;
`;

export const BannerRow = styled(Shell)`
  display: flex;
  position: relative;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  /* Clearance for the close button, on both sides so the message stays
     centred in the strip rather than in what is left of it. */
  padding: 6px 34px;

  @media (min-width: ${breakpoints.tablet}) {
    min-height: 44px;
  }
`;

/* Set like the nav's links — same mono, same weight — rather than bold
   and underlined: bold Martian Mono under an underline reads as clutter
   at this size, and the strip's colour already does the shouting. The
   arrow is what says "this goes somewhere"; the whole line is the link.

   The strip is one line of chrome, so the link gets the nav's type
   treatment, not the page's. */
export const BannerLink = styled.a`
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 0.78rem;
  }
`;

/* The link's affordance, in place of the underline: an arrow that leans
   into the hover the way the CTA chips lean into theirs. Bound to the
   link's hover, not its own, so sweeping the text moves it too.
   Decorative — the component hides it from the screen reader, which
   already has a perfectly good link. */
export const Arrow = styled.span`
  display: inline-block;
  transition: transform 150ms ease;

  ${BannerLink}:hover & {
    transform: translateX(4px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* Pinned to the strip's right gutter, out of the flow, so a message of
   any length stays centred and the button never moves with it. */
export const CloseButton = styled.button`
  display: inline-flex;
  position: absolute;
  top: 50%;
  right: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  transform: translateY(-50%);

  &:hover {
    opacity: 0.65;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;
