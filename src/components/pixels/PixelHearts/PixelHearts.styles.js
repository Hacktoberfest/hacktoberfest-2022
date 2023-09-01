import styled, { keyframes } from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

const heartAnimation = ({ theme }) => keyframes`
  0% {
    color: ${theme.colors.bavarian.gold300};
  }
  33% {
    color: ${theme.colors.bavarian.gold200};
  }
  66% {
    color: ${theme.colors.bavarian.gold100};
  }
  100% {
    color: ${theme.colors.bavarian.gold300};
  }
`;

export const StyledPixelHearts = styled.div`
  line-height: 0;

  svg {
    width: 100%;
    filter: drop-shadow(1px 1px 10px rgba(236, 66, 55, 0.50)) drop-shadow(-1px -1px 10px rgba(255, 251, 164, 0.50));

    path {
      animation: ${heartAnimation} 2000ms ease-in-out infinite;
      fill: currentColor;
    }

    path:nth-child(2) {
      animation-delay: 250ms;
    }

    path:nth-child(3) {
      animation-delay: 500ms;
    }
  }
`;