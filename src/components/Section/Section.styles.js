import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledSection = styled.div`
  ${({ $isFullWidth }) => $isFullWidth && `grid-column: full;`};

  ${({ $size }) =>
    $size === 'sm' &&
    `
    padding: 80px 0;
  `};

  ${({ $size }) =>
    $size === 'md' &&
    `
    padding: 40px 0;

    ${mQ(bp.desktop)} {
      padding: 104px 0;
    }
  `};

  ${({ $size }) =>
    $size === 'lg' &&
    `
    padding: 64px 0;

    ${mQ(bp.desktop)} {
      padding: 128px 0;
    }
  `};
`;
