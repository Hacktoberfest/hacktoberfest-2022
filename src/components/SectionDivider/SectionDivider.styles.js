import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledSectionDivider = styled.div`
  ${({ $align, $bgColor, $fgColor, $isFlipped, theme }) => `
    background-color: ${$bgColor ? $bgColor : theme.colors.typography};
    color: ${$fgColor ? $fgColor : theme.colors.black};
    display: flex;
    line-height: 0;

    svg {
      height: auto;
      width: auto;
      ${$align === 'left' && `transform: scaleX(-1)`};
      ${$align === 'right' && `margin-left: auto;`};

      ${
        $isFlipped &&
        `
        ${$align === 'left' && `transform: scale(-1)`};
        ${$align === 'right' && `transform: scaleY(-1); margin-left: auto;`};
      `
      }
    }
  `};
`;
