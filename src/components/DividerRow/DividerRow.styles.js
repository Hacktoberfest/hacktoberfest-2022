import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledDividerRow = styled.div`
  position: relative;
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr);

  ${mQ(bp.desktop)} {
    gap: ${({ $gap }) => $gap};
    grid-template-columns: repeat(2, minmax(0, 1fr));

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 100%;
      background-image: linear-gradient(
        0deg,
        currentColor,
        currentColor 25%,
        transparent 25%,
        transparent 100%
      );
      background-size: 2px 12px;
      background-position: 0 -50%;
    }
  }
`;
