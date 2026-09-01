import styled, { css } from 'styled-components';

import { buttonStyles } from 'components/Button';
import Shell from 'components/Shell';
import TypeformButton from 'components/TypeformButton.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const WaysRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paperDeep};
`;

export const WaysIntro = styled(Shell)`
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

export const WaysHeading = styled.h2`
  max-width: 12ch;
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const WaysIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
`;

export const WaysGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const WaysCard = styled.article`
  display: flex;
  flex-direction: column;
  padding: 30px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};

  &:nth-of-type(2) {
    background: ${colors.sky};
  }
`;

export const WaysTag = styled.span`
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const WaysCardTitle = styled.h3`
  max-width: 12ch;
  margin-top: 22px;
  font-family: ${fonts.display};
  font-size: clamp(2.05rem, 3vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 0.95;
`;

export const WaysCardCopy = styled.p`
  max-width: 40ch;
  margin-top: 18px;
  color: ${colors.ink};
  font-size: 0.93rem;
`;

export const WaysReward = styled.p`
  margin-top: 24px;
  padding-top: 18px;
  border-top: 2px solid ${colors.ink};
  font-weight: 760;
`;

/* The two cards' CTAs have to be indistinguishable, and they are no longer
   the same element: the in-person card links to the published directory
   while the online card still opens the interest form, since there is
   nothing to link an online sign-up at yet. One block of styles, worn by
   an anchor and by a popup trigger. */
const waysCta = css`
  ${buttonStyles}
  align-self: start;
  margin-top: 26px;
  color: ${colors.white};
  border-color: ${colors.ink};
  background: ${colors.forestDeep};
  box-shadow: 5px 5px 0 ${colors.maroon};

  &:focus-visible {
    box-shadow: 0 0 0 5px ${colors.ink};
  }
`;

export const WaysLink = styled.a`
  ${waysCta}
`;

export const WaysButton = styled(TypeformButton)`
  ${waysCta}
`;
