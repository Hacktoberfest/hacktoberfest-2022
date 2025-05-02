import { StyledContentMaster } from 'components/ContentMaster/ContentMaster.styles';
import styled, { css, keyframes } from 'styled-components';
import { textXl } from 'themes/typography';

const blinkExpand = keyframes`
  0% { opacity: 1; width: 50px; height: 50px; }
  2.5% { opacity: 1; }
  5% { opacity: 1; }
  7.5% { opacity: 0; }
  10% { opacity: 0; }
  12.5% { opacity: 0; }
  15% { opacity: 1; }
  17.5% { opacity: 1; }
  20% { opacity: 0; }
  22.5% { opacity: 0; }
  25% { opacity: 1; }
  27.5% { opacity: 1; }
  30% { opacity: 1; }
  32.5% { opacity: 0; }
  35% { opacity: 1; }
  37.5% { opacity: 0; }
  40% { opacity: 1; }
  42.5% { opacity: 0; }
  45% { opacity: 1; }
  47.5% { opacity: 0; }
  75% { opacity: 1; width: 50px; height: 50px; }
  100% { opacity: 1; width: 100%; height: 100%; }
`;

export const StyledCornersWrapper = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 500ms ease-in-out;

  > div {
    --border-width: 2px;
  }
`;

export const StyledSection = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 16px 24px;
  position: relative;

  ${StyledContentMaster} {
    opacity: 0;
    transition: opacity 500ms ease-in-out 0ms;
  }

  ${({ $inView }) =>
    $inView &&
    css`
      ${StyledContentMaster} {
        opacity: 1;
        transition-delay: 1000ms;
      }
      ${StyledCornersWrapper} {
        animation: ${blinkExpand} 1333ms ease-in-out forwards;
      }
    `}

  p {
    ${textXl};
  }
`;
