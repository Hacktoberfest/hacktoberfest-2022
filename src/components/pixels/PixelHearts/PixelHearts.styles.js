import styled, { keyframes } from 'styled-components';

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
  display: flex;

  svg {
    width: 100%;
    filter: drop-shadow(1px 1px 10px rgba(236, 66, 55, 0.50)) drop-shadow(-1px -1px 10px rgba(255, 251, 164, 0.50));

    path {
      animation: ${heartAnimation} 2000ms ease-in-out infinite;
      fill: currentColor;
    }
  }

  ${({ $count, $offset }) => [...Array($count)].map((_, i) => `
    svg:nth-child(${i + 1}) {
      path {
        animation-delay: ${(i + $offset) * 250}ms;
      }
    }
  `)}
`;
