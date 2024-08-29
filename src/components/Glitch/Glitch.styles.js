import styled, { keyframes } from 'styled-components';

const generateRandom = (maxLimit = 500) => Math.floor(Math.random() * maxLimit);

const glitchEeffect = keyframes`
  5% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  10% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  15% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  20% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  25% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  30% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  35% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  40% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  45% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  50% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  55% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  60% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  65% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  70% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  75% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  80% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  85% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  90% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  95% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
  100% {
    clip: rect(${generateRandom() + 'px'}, 9999px, ${generateRandom() + 'px'}, 0);
  }
`;

export const StyledGlitch = styled.div`
  position: relative;

  img {
    animation: ${glitchEeffect} 5000ms infinite linear alternate-reverse;
    animation-delay: 1000ms;
    width: 100%;

    @media (prefers-reduced-motion) {
      animation-play-state: paused;
    }
  }

  span {
    > * {
      position: absolute;
      top: 0;
      clip: rect(0, 900px, 0, 0);
      left: 0;
      overflow: hidden;

      &:first-child {
        left: 16px;
        animation: ${glitchEeffect} 3000ms infinite linear alternate-reverse;

        @media (prefers-reduced-motion) {
          animation-play-state: paused;
        }
      }

      &:last-child {
        left: 8px;
        animation: ${glitchEeffect} 2000ms infinite linear alternate-reverse;

        @media (prefers-reduced-motion) {
          animation-play-state: paused;
        }
      }
    }
  }
`;
