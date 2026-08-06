import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const MissionRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forestDeep};
`;

export const MissionInner = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(45px, 7vw, 100px);

  @media (min-width: ${breakpoints.desktop}) {
    /* Size the copy column to its reading measure rather than a fraction of
       the shell, so wide screens don't leave dead space to its right. */
    grid-template-columns: 1fr minmax(0, 62ch);
    align-items: start;
  }
`;

export const Eyebrow = styled.p`
  margin: 0;
  color: ${colors.sky};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const MissionHeading = styled.h2`
  margin: 13px 0 0;
  font-family: ${fonts.display};
  font-size: clamp(2.6rem, 4.8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.94;
  text-wrap: balance;

  @media (min-width: ${breakpoints.desktop}) {
    max-width: 11ch;
  }

  em {
    color: ${colors.ochre};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;

export const MissionCopy = styled.div`
  display: grid;
  gap: 22px;
  max-width: 62ch;
  font-size: 1.08rem;
  line-height: 1.6;

  p {
    margin: 0;
  }
`;
