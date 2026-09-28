import styled, { keyframes } from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

const iconIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.7);
  }
`;

export const SkipLink = styled.a`
  position: fixed;
  z-index: 1100;
  top: 12px;
  left: -999px;
  padding: 10px 16px;
  border: 2px solid ${colors.ink};
  background: ${colors.pink};
  color: ${colors.ink};
  font-family: ${fonts.mono};
  font-weight: 700;
  text-decoration: none;

  &:focus {
    left: 12px;
  }
`;

export const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forest};

  /* iOS Safari repositions sticky elements a frame late while its toolbar
     collapses, letting page content peek out above the nav. Extend an
     opaque band upward to cover that gap. */
  &::before {
    position: absolute;
    top: -120px;
    right: 0;
    left: 0;
    height: 120px;
    background: ${colors.forest};
    content: '';
  }
`;

export const Nav = styled(Shell)`
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (min-width: ${breakpoints.tablet}) {
    min-height: 82px;
    gap: 30px;
  }
`;

export const Wordmark = styled.a`
  display: inline-flex;
  min-width: 0;
  /* The wordmark absorbs any squeeze so the nav links and CTA are never
     pushed past the shell's gutter. */
  flex: 0 1 auto;
  align-items: center;
  gap: 7px;
  color: ${colors.white};
  text-decoration: none;

  @media (min-width: ${breakpoints.tablet}) {
    gap: 11px;
  }
`;

export const Logo = styled.svg`
  display: block;
  width: 100%;
  max-width: 190px;
  height: auto;

  @media (min-width: ${breakpoints.tablet}) {
    max-width: 260px;
  }
`;

/* Below tablet width the links collapse behind the hamburger toggle: a
   full-width panel dropping from the header, shown only while
   [data-open="true"]. From tablet up they're always visible, back in
   their normal inline row — the attribute stops mattering entirely.

   The open/closed state is read off a DOM attribute rather than
   interpolated into the template so every rule below is static CSS,
   present in the stylesheet from the first render. Toggling a boolean
   prop straight into a styled-components template generates a second,
   client-only class whose CSS never makes it into the page's stylesheet
   on this static export — the attribute selector sidesteps that.

   Stays position: absolute (out of flow) at every width below tablet, so
   closed and open states can cross-fade/slide without reflowing the page
   underneath — no max-height accordion needed. `visibility` carries the
   actual show/hide (and keeps the closed panel out of tab order); it
   flips the instant the panel opens but only after the fade finishes on
   close, via the transition-delay swap below.

   `transition` only applies once [data-animate="true"] shows up, which
   Header sets a tick after mount — styled-components' SSR-to-client
   handoff on this static export briefly drops and re-inserts its style
   rules, and an unguarded transition here replays across that gap as a
   flash on every page load. Gating it behind a post-mount attribute
   means only real, user-triggered toggles ever animate. */
export const NavLinks = styled.div`
  display: flex;
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  padding: 20px 15px 24px;
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forest};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 400;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);

  &[data-animate='true'] {
    transition:
      opacity 180ms ease,
      transform 180ms ease,
      visibility 0s linear 180ms;
  }

  &[data-open='true'] {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    transition-delay: 0s;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &[data-animate='true'] {
      transition: none;
    }
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: flex;
    position: static;
    flex-direction: row;
    flex-shrink: 0;
    align-items: center;
    /* Tighter until desktop: the wordmark takes the squeeze in this band,
       and About's chevron made the row 25px wider than FAQs alone was. */
    gap: 20px;
    padding: 0;
    border-bottom: none;
    opacity: 1;
    visibility: visible;
    transform: none;
    transition: none;
  }

  @media (min-width: ${breakpoints.desktop}) {
    gap: 27px;
  }
`;

/* Only ever shown below tablet width — the links render inline from
   tablet up, so the toggle has nothing to control there. */
export const MenuToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  color: ${colors.white};
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
    animation: ${iconIn} 150ms ease;
  }

  @media (prefers-reduced-motion: reduce) {
    svg {
      animation: none;
    }
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

/* The nav's cross-page links. */
export const PageNavLink = styled.a`
  display: inline;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

/* The nav's one ask: the signed-in hub, with the countdown and the
   application behind it. Keeps the button chip treatment so it reads as
   the call to action next to the plain links. */
export const NavCta = styled.a`
  /* The offset shadow paints outside the border box and layout ignores it,
     so without this the button's visual edge overhangs the shell gutter. */
  margin-right: 4px;
  padding: 8px 11px;
  color: ${colors.ink};
  border: 2px solid ${colors.ink};
  background: ${colors.pink};
  box-shadow: 4px 4px 0 ${colors.maroon};
  cursor: pointer;
  font-family: inherit;
  font-size: 0.66rem;
  font-weight: 650;
  line-height: inherit;
  white-space: nowrap;
  text-decoration: none;
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 ${colors.maroon};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: 10px 17px;
    font-size: inherit;
  }
`;

/* One dropdown: a button and the panel it controls. The panel is always in
   the DOM and hidden by attribute for the reason NavLinks gives — a panel
   that first appeared on click would appear unstyled on this static
   export. Below tablet width the group is a labelled section of the
   slide-down list, always expanded; the button becomes a static eyebrow
   and the attribute stops mattering. */
export const NavGroupRoot = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  /* The world's colour (data/nav.mjs accent), read by the open button's
     underline and the panel's rule below. Static rules keyed on a DOM
     attribute, for the reason NavLinks gives. */
  --group-accent: ${colors.white};

  &[data-accent='sky'] {
    --group-accent: ${colors.sky};
  }

  &[data-accent='pink'] {
    --group-accent: ${colors.pink};
  }

  &[data-accent='ochre'] {
    --group-accent: ${colors.ochre};
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: block;
  }
`;

/* Below tablet width the group's label is plain text over its links — an
   eyebrow, not a control — and the button is not in the DOM's accessible
   tree at all (display: none). From tablet up the two swap. Two elements
   rather than one restyled, because a button that does nothing is still a
   button to a screen reader. */
export const NavGroupEyebrow = styled.span`
  display: block;
  color: ${colors.white};
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

/* The button exists only from tablet up — below that the group's label is
   the plain-text NavGroupEyebrow above. */
export const NavGroupButton = styled.button`
  display: none;
  padding: 0;
  border: none;
  background: none;
  color: ${colors.white};
  font: inherit;

  & > svg {
    display: none;
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding-bottom: 2px;
    /* The underline is drawn, not text-decoration, so it can take the
       world's colour and sit under the chevron too. The negative margin
       gives back the padding and border, so the label stays on the same
       line as Home and FAQs beside it. */
    margin-bottom: -4px;
    border-bottom: 2px solid transparent;
    cursor: pointer;

    &:hover {
      border-bottom-color: ${colors.white};
    }

    /* The world's colour while the panel is open, and all the time on
       the pages that belong to this world (data-current on the root). */
    &[aria-expanded='true'],
    [data-current='true'] > & {
      border-bottom-color: var(--group-accent);
    }

    & > svg {
      display: block;
      width: 10px;
      height: 10px;
      transition: transform 150ms ease;
    }

    &[aria-expanded='true'] > svg {
      transform: rotate(180deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    & > svg {
      transition: none;
    }
  }
`;

/* The links. In the slide-down list they are simply indented under their
   eyebrow. From tablet up they are a floating panel under the button, shown
   by [data-open="true"], with the same fade NavLinks uses and the same
   post-mount gate on the transition. */
export const NavGroupPanel = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0 0 0 14px;
  list-style: none;

  @media (min-width: ${breakpoints.tablet}) {
    position: absolute;
    top: calc(100% + 12px);
    left: -18px;
    min-width: 280px;
    gap: 0;
    padding: 6px 0;
    /* The card language the rest of the site speaks: ink border, a hard
       offset in ink (the panel is forest on forest, and maroon fought the
       accent rule), and the world's colour as a rule along the top, where
       the label's underline points. */
    border: 2px solid ${colors.ink};
    border-top: 4px solid var(--group-accent);
    background: ${colors.forest};
    box-shadow: 5px 5px 0 ${colors.ink};
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px);

    &[data-animate='true'] {
      transition:
        opacity 150ms ease,
        transform 150ms ease,
        visibility 0s linear 150ms;
    }

    &[data-open='true'] {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      transition-delay: 0s;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &[data-animate='true'] {
      transition: none;
    }
  }
`;

export const NavGroupLink = styled.a`
  display: block;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: 11px 18px;

    &:hover,
    &:focus-visible {
      background: ${colors.forestDeep};
      text-decoration: none;
    }

    &:hover span:first-child,
    &:focus-visible span:first-child {
      text-decoration: underline;
      text-decoration-color: var(--group-accent);
      text-underline-offset: 3px;
    }
  }
`;

export const NavGroupLinkLabel = styled.span`
  display: block;
  font-weight: 650;
`;

/* One line under the label, in the body face rather than mono: it is a
   sentence about the page, not a control. Only in the floating panel;
   below tablet the links are a plain list under an eyebrow. */
export const NavGroupLinkDescription = styled.span`
  display: none;

  @media (min-width: ${breakpoints.tablet}) {
    display: block;
    margin-top: 3px;
    font-family: ${fonts.sans};
    font-size: 0.8rem;
    line-height: 1.35;
    opacity: 0.8;
  }
`;
