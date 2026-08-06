import styled, { css } from 'styled-components';

import { buttonStyles } from 'components/Button';
import Shell from 'components/Shell';
import TypeformButton from 'components/TypeformButton.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const HeroRoot = styled.section`
  position: relative;
  overflow: hidden;
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forest};
`;

export const HeroInner = styled(Shell)`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 72px);
  min-height: calc(100svh - 72px);
  padding-block: clamp(60px, 6vw, 100px);
  text-align: center;

  @media (min-width: ${breakpoints.tablet}) {
    min-height: calc(100vh - 82px);
    min-height: calc(100svh - 82px);
  }
`;

/* Beyond this width the decorations stop tracking the viewport edges and
   hold a centered band, so they keep framing the content instead of
   stranding themselves against the bezel on ultrawide displays. */
const decoInset = 'max(0px, calc(50% - 960px))';

const heroDeco = css`
  position: absolute;
  z-index: 0;
  display: none;
  pointer-events: none;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (min-width: ${breakpoints.desktop}) {
    display: block;
  }
`;

export const DecoTopLeft = styled.div`
  ${heroDeco}
  top: 0;
  left: ${decoInset};
  width: clamp(150px, 15vw, 260px);
`;

export const DecoTopRight = styled.div`
  ${heroDeco}
  top: 0;
  right: ${decoInset};
  width: clamp(150px, 15vw, 260px);
`;

export const DecoBottomLeft = styled.div`
  ${heroDeco}
  bottom: 0;
  left: ${decoInset};
  width: clamp(230px, 24vw, 400px);
`;

export const DecoBottomRight = styled.div`
  ${heroDeco}
  bottom: 0;
  right: ${decoInset};
  width: clamp(250px, 26vw, 440px);
`;

export const HeroSquares = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

export const HeroSquare = styled.span`
  width: 14px;
  height: 14px;
  background: ${(props) => props.$color};
`;

export const Eyebrow = styled.p`
  margin: 0;
  color: ${colors.pinkLight};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

/* The eyebrow is too long for one phone line and wraps mid-clause, so each
   clause gets its own line there and they only share one from tablet up. */
export const EyebrowLine = styled.span`
  display: block;

  @media (min-width: ${breakpoints.tablet}) {
    display: inline;

    /* Back on one line, the clauses need the separator the break stood in
       for. */
    & + &::before {
      content: ' · ';
    }
  }
`;

export const HeroHeading = styled.h1`
  margin: 20px auto 0;
  font-family: ${fonts.display};
  font-size: clamp(2.5rem, 9vw, 6.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.92;
  text-wrap: balance;

  span {
    white-space: nowrap;
  }

  em {
    display: block;
    color: ${colors.sky};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
    letter-spacing: inherit;
  }
`;

export const HeroDeck = styled.p`
  max-width: 56ch;
  margin: 26px auto 0;
  color: ${colors.white};
  font-size: clamp(1.06rem, 1.6vw, 1.25rem);
  line-height: 1.56;
`;

export const HeroActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  margin-top: 32px;
  align-self: stretch;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    justify-content: center;
    align-self: auto;
  }
`;

export const HeroButton = styled(TypeformButton)`
  ${buttonStyles}
  width: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    width: auto;
  }
`;

/* Button's ghost variant — transparent with the shared offset shadow — so
   this reads as a real button beside the primary without competing with it.
   The variant sat unused since the old attend button was cut; this is the
   same job back. */
export const HeroSecondaryButton = styled(TypeformButton).attrs({
  $variant: 'secondary',
})`
  ${buttonStyles}
  width: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    width: auto;
  }
`;

export const HeroPartners = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px 44px;
  margin-top: 44px;
`;

export const HeroPartnerGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const HeroPartnerLabel = styled.span`
  color: ${colors.pinkLight};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

// Partner sites are always external, so every link opens in a new tab.
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
