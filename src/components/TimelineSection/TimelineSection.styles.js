import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const TimelineRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paper};
`;

export const TimelineIntro = styled(Shell)`
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

export const TimelineIntroCopy = styled.p`
  max-width: 48ch;
  margin: 0;
  color: #34433f;
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const TimelineHeading = styled.h2`
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

export const TimelineGrid = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const TimelineCard = styled.article`
  display: flex;
  flex-direction: column;
  padding: 30px;
  color: ${colors.ink};
  border: 2px solid ${colors.ink};
  background: ${colors.white};
  box-shadow: 7px 7px 0 ${colors.maroon};

  &:last-of-type {
    background: ${colors.ochre};
    box-shadow: 7px 7px 0 ${colors.ochreDeep};
  }
`;

export const TimelineYear = styled.span`
  font-family: ${fonts.display};
  font-size: clamp(2.4rem, 3.4vw, 3.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 0.95;
`;

export const TimelineCardTitle = styled.h3`
  margin: 20px 0 0;
  font-family: ${fonts.display};
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
`;

export const TimelineCardCopy = styled.p`
  max-width: 34ch;
  margin-top: 12px;
  color: inherit;
  font-size: 0.93rem;
`;
