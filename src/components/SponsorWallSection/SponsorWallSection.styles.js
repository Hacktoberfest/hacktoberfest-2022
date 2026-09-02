import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

/* The homepage's copy of the /sponsor wall: same tile vocabulary, no
   recruitment furniture (the ghost seat and the dashed ask stay on
   /sponsor). Header follows the homepage section pattern the way
   GetInvolvedSection sets it. */

export const WallRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paper};
`;

export const WallIntro = styled(Shell)`
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

export const WallHeading = styled.h2`
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;

  @media (min-width: ${breakpoints.tablet}) {
    max-width: 12ch;
  }

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const WallIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
`;

/* A 12-column grid so every row resolves full: the partner row seats
   3 + 3 + 6 (DigitalOcean double-width), the nine sponsors 4 each,
   three to a row. Below tablet the grid halves to two seats a row
   instead of stacking one logo per line, which would run the section
   sixteen rows tall; the double-width seats (DigitalOcean, and
   Backboard closing the last row) span both columns. */
export const WallGrid = styled(Shell)`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-inline: auto;
  padding-left: 0;
  list-style: none;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 14px;
  }
`;

export const WallItem = styled.li`
  display: flex;
  flex-direction: column;
  grid-column: span ${(props) => props.$spanMobile || 1};

  @media (min-width: ${breakpoints.tablet}) {
    grid-column: span ${(props) => props.$span};
  }
`;

export const WallLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 78px;
  padding: 14px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;

  @media (min-width: ${breakpoints.tablet}) {
    min-height: 104px;
  }

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
  max-height: 40px;
  object-fit: contain;

  @media (min-width: ${breakpoints.tablet}) {
    max-height: 52px;
  }
`;

/* Partner seats: the same white tile with a small role label on top,
   label and tile one anchor so the composite lifts together on hover. */
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
  min-height: 78px;
  padding: 14px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};

  svg {
    width: auto;
    max-width: 100%;
    height: 34px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    min-height: 104px;

    svg {
      height: 42px;
    }
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

export const PresenterTileLink = styled(PartnerTileLink)`
  svg {
    height: 30px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    svg {
      height: 36px;
    }
  }
`;

/* The powered-by seat pairs MLH and DEV in one box, the way the hero's
   chip does: the two wordmarks either side of a times sign. The whole
   seat is one PartnerTileLink to mlh.com. */
export const PartnerPairBody = styled.span`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 78px;
  padding: 14px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};

  svg {
    width: auto;
    max-width: 100%;
    height: 30px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    gap: 18px;
    min-height: 104px;

    svg {
      height: 36px;
    }
  }
`;

export const PartnerPairTimes = styled.span`
  color: ${colors.ink};
  font-family: ${fonts.display};
  font-size: 1.15rem;
  font-weight: 700;
`;
