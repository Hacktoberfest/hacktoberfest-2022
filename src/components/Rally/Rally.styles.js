import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const RallyRoot = styled.section`
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forestDeep};
`;

export const RallyInner = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(30px, 6vw, 90px);
  align-items: center;
  padding-block: clamp(45px, 6vw, 72px);

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: auto 1fr;
  }
`;

export const RallyTag = styled.span`
  display: grid;
  width: 86px;
  height: 86px;
  place-items: center;
  color: ${colors.ink};
  border: 2px solid ${colors.ink};
  background: linear-gradient(135deg, ${colors.pink} 0 49%, ${colors.sky} 50%);
  box-shadow: 5px 5px 0 ${colors.maroon};
  font-family: ${fonts.mono};
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  text-transform: uppercase;

  @media (min-width: ${breakpoints.tablet}) {
    width: 112px;
    height: 112px;
    box-shadow: 6px 6px 0 ${colors.maroon};
  }
`;

export const RallyText = styled.p`
  max-width: 31ch;
  margin: 0;
  font-family: ${fonts.display};
  font-size: clamp(1.8rem, 3.25vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  text-wrap: balance;

  em {
    color: ${colors.orange};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
  }
`;
