import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const FestsRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.white};
`;

export const FestsIntro = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-bottom: 50px;

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: end;
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

export const FestsHeading = styled.h2`
  max-width: 14ch;
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

export const FestsCopy = styled.div`
  display: grid;
  gap: 14px;
  max-width: 52ch;
  color: #34433f;

  p {
    margin: 0;
  }
`;

export const FestsBeats = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const FestsBeat = styled.div`
  display: grid;
  gap: 14px;
  padding: 26px;
  border: 2px solid ${colors.ink};
  background: ${colors.paper};
  box-shadow: 7px 7px 0 ${colors.forestDeep};
`;

export const FestsBeatNumber = styled.span`
  color: ${colors.orangeDeep};
  font-family: ${fonts.mono};
  font-size: 0.67rem;
  font-weight: 700;
`;

export const FestsBeatLabel = styled.p`
  margin: 0;
  font-family: ${fonts.display};
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.05;
`;
