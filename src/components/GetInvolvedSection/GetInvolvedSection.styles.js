import styled from 'styled-components';

import { buttonStyles } from 'components/Button';
import Shell from 'components/Shell';
import TypeformButton from 'components/TypeformButton.mjs';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const InvolvedRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paperDeep};
`;

export const InvolvedIntro = styled(Shell)`
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

export const InvolvedHeading = styled.h2`
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

export const InvolvedIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
`;

export const InvolvedGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const InvolvedCard = styled.article`
  display: flex;
  flex-direction: column;
  padding: 30px;
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};
`;

export const InvolvedTag = styled.span`
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

export const InvolvedCardTitle = styled.h3`
  margin: 22px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.05rem, 3vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 0.95;
`;

export const InvolvedCardCopy = styled.p`
  margin-top: 18px;
  margin-bottom: 26px;
  color: ${colors.ink};
  font-size: 0.93rem;
  /* Copy runs as wide as the card, like its heading, so orphan control
     falls entirely to pretty-wrapping. Ignored where unsupported, which
     just falls back to plain wrapping. */
  text-wrap: pretty;

  /* The card is a flex column, so margins don't collapse — drop the top
     margin on stacked paragraphs to keep one 26px gap between them. */
  & + & {
    margin-top: 0;
  }
`;

export const InvolvedButton = styled(TypeformButton)`
  ${buttonStyles}
  align-self: start;
  margin-top: auto;
`;
