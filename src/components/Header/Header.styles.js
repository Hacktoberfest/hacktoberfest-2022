import styled from 'styled-components';

import Shell from 'components/Shell';
import TypeformButton from 'components/TypeformButton.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

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

export const NavLinks = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 27px;
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 400;
`;

export const NavLink = styled.a`
  display: none;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  /* Only from desktop: between tablet and desktop the links, wordmark, and
     CTA together overflow the shell and clip the CTA at the viewport edge. */
  @media (min-width: ${breakpoints.desktop}) {
    display: inline;
  }
`;

export const NavCta = styled(TypeformButton)`
  appearance: none;
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
