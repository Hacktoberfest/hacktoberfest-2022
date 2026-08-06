import styled from 'styled-components';

import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const EraRoot = styled.section`
  padding-block: clamp(80px, 9vw, 124px);
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.paper};
`;

export const SectionHeading = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(42px, 8vw, 116px);
  align-items: start;

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 0.72fr 1.28fr;
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

export const EraHeading = styled.h2`
  max-width: 15ch;
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

export const SectionCopy = styled.div`
  max-width: 60ch;
  padding-top: 0;
  color: #34433f;
  font-size: clamp(1.03rem, 1.65vw, 1.2rem);

  @media (min-width: ${breakpoints.desktop}) {
    padding-top: 27px;
  }

  p + p {
    margin-top: 22px;
  }
`;

export const ThesisLine = styled.p`
  margin: 32px 0 0;
  color: ${colors.ink};
  font-weight: 700;
`;

export const EraShift = styled(Shell)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 13px;
  margin-top: clamp(58px, 8vw, 95px);

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const EraPanel = styled.article`
  min-height: 320px;
  padding: clamp(30px, 4vw, 49px);
  border: 2px solid ${colors.ink};
  background: ${colors.sky};
  box-shadow: 8px 8px 0 ${colors.maroon};

  @media (min-width: ${breakpoints.tablet}) {
    min-height: 360px;
  }

  & + & {
    background: ${colors.pink};
  }
`;

export const EraLabel = styled.span`
  display: inline-flex;
  padding: 6px 11px;
  border: 1px solid ${colors.ink};
  background: ${colors.white};
  font-family: ${fonts.mono};
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  ${EraPanel} + ${EraPanel} & {
    background: ${colors.orange};
  }
`;

export const EraPanelTitle = styled.h3`
  max-width: 13ch;
  margin-top: 55px;
  font-family: ${fonts.display};
  font-size: clamp(2.15rem, 3.6vw, 3.4rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 0.95;

  @media (min-width: ${breakpoints.tablet}) {
    margin-top: 72px;
  }
`;

export const EraPanelCopy = styled.p`
  max-width: 38ch;
  margin-top: 20px;
  color: ${colors.ink};
`;
