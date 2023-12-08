import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledDividerRow = styled.div`
  position: relative;
  display: grid;
  gap: 24px;
  padding: 64px 0;
  grid-template-columns: minmax(0, 1fr);

  ${mQ(bp.desktop)} {
    gap: ${({ $gap }) => $gap};
    grid-template-columns: repeat(2, minmax(0, 1fr));

    &::after {
      content: '';
      position: absolute;
      top: 64px;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: calc(100% - 128px);
      background-image: linear-gradient(
        0deg,
        ${({ theme }) => theme.colors.neutral.manga400},
        ${({ theme }) => theme.colors.neutral.manga400} 50%,
        transparent 50%,
        transparent 100%
      );
      background-size: 1px 12px;
      background-position: 0 -50%;
    }
  }
`;
