import styled, { keyframes } from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledSupportSection = styled.div`
  padding: 80px 0;

  ${mQ(bp.desktop)} {
    padding: 144px 0;
  }
`;

export const StyledSupportSectionContainer = styled.div`
  ${mQ(bp.desktop)} {
    display: flex;
    margin: 0 0 44px;
  }
`;

export const StyledSupportSectionContent = styled.div`
  max-width: 742px;
`;

export const StyledSupportSectionCallout = styled.div`
  max-width: 608px;
  margin-left: auto;
`;

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

export const StyledSupportSectionHearts = styled.div`
  width: 100%;
  line-height: 0;
  margin: 24px 0;

  ${mQ(bp.desktop)} {
    margin: 0 0 0 auto;
    max-width: 460px;
  }

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