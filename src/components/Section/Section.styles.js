import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledSection = styled.div`
  ${({ $small }) =>
    $small
      ? `
    padding: 80px 0;
  `
      : `
    padding: 80px 0;

    ${mQ(bp.desktop)} {
      padding: 140px 0;
    }
  `};

  background-color: ${({ $bgColor }) => ($bgColor ? $bgColor : 'transparent')};
  color: ${({ $color, theme }) => ($color ? $color : theme.colors.dark)};

  :where(&) a {
    color: ${({ $linkColor, $isDark, theme }) =>
      $linkColor
        ? $linkColor
        : $isDark
          ? theme.colors.green
          : theme.colors.deepPink};
  }
`;
