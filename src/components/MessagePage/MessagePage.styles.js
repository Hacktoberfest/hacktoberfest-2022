import styled from 'styled-components';

import Button from 'components/Button';
import Shell from 'components/Shell';
import { breakpoints, colors, fonts } from 'styles/tokens';

export const MessageRoot = styled.section`
  position: relative;
  overflow: hidden;
  color: ${colors.white};
  border-bottom: 2px solid ${colors.ink};
  background: ${colors.forest};
`;

export const MessageInner = styled(Shell)`
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

export const Eyebrow = styled.p`
  margin: 0;
  color: ${colors.pinkLight};
  font-family: ${fonts.mono};
  font-size: 0.78rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const MessageHeading = styled.h1`
  margin: 20px auto 0;
  font-family: ${fonts.display};
  font-size: clamp(2.5rem, 9vw, 6.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.92;
  text-wrap: balance;

  em {
    display: block;
    color: ${colors.sky};
    font-family: inherit;
    font-style: normal;
    font-weight: inherit;
    letter-spacing: inherit;
  }
`;

export const MessageCopy = styled.p`
  max-width: 52ch;
  margin: 26px auto 0;
  font-size: clamp(1.06rem, 1.6vw, 1.25rem);
  line-height: 1.56;
`;

export const MessageButton = styled(Button)`
  margin-top: 32px;
`;
