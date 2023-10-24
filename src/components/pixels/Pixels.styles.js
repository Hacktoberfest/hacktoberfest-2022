import styled, { keyframes } from 'styled-components';

const flickerAnim = keyframes`
  0% {
    opacity: 1;
  }

  18% {
    opacity: 1;
  }

  19% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  96% {
    opacity: 1;
  }

  97% {
    opacity: 0;
  }

  98% {
    opacity: 1;
  }
`;

const transformAnim = keyframes`
  from {
    transform: translate3d(0, -50%, 0);
  }

  to {
    transform: translate3d(-100%, -50%, 0);
  }
`;

export const PixelWrapper = styled.div`
  position: relative;
  overflow: hidden;
  animation: ${flickerAnim} ${({ $timing }) => Math.floor(($timing - 0.5) / 2)}s infinite;

  &::after {
    content: '';
    display: block;
    padding-bottom: calc(100% / ${({ $aspect }) => $aspect});
  }

  svg {
    position: absolute;

    top: 50%;
    transform: translate3d(0, -50%, 0);

    left: 0;
    width: calc(100% * ${({ $frames }) => $frames});
    height: auto;

    animation: ${transformAnim} ${({ $timing }) => $timing}s steps(${({ $frames }) => $frames}) infinite;
    shape-rendering: crispEdges;
  }
`;
