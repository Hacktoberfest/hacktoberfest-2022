import styled, {keyframes} from 'styled-components';

const flickerAnimation = () => keyframes`
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

const stdAnim = () => keyframes`
  to {
    transform: translate3d(-100%, 0, 0);
  }
`;

export const PixelWrapper = styled.div`
  position: relative;
  overflow: hidden;
  animation: ${flickerAnimation} 2s infinite;
  transform: scale(${(props) => props.scale});

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    height: 100%;
    animation: ${stdAnim} ${({timing, frames}) => `${timing}s steps(${frames}) infinite`};
    shape-rendering: crispEdges;
  }
`;