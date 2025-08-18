import styled, { keyframes } from 'styled-components';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const marqueeScroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
`;

const BaseMarqueeWrapper = styled.div`
  --gap: 40px;
  display: flex;
  gap: var(--gap);
  overflow: hidden;
  width: 100%;
  user-select: none;

  .marquee_content {
    animation: ${marqueeScroll} 80s linear infinite
      ${({ $direction }) => $direction || 'forwards'};
    display: flex;
    flex-shrink: 0;
    gap: var(--gap);
    justify-content: space-around;
    min-width: 100%;
    margin: 0;

    @media (prefers-reduced-motion) {
      animation-play-state: paused;
    }

    li {
      display: flex;
      align-items: center;
      font-style: italic;
      font-weight: 800;
      font-size: 64px;
      line-height: 1.2954545455;
      letter-spacing: -1.92px;
      text-transform: uppercase;
      color: transparent;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: ${({ theme }) => theme.colors2025.blueViolet};
      position: relative;

      &::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        color: white;
        -webkit-text-stroke: 0 transparent;
        filter: url(#outerShadow);
        z-index: -1;
      }

      ${mQ(bp.desktop)} {
        font-size: 88px;
        line-height: 1.2954545455;
        letter-spacing: -2.64px;
      }

      span {
        width: 68px;
        height: 12px;
        background: linear-gradient(
          to right,
          ${({ theme }) => theme.colors2025.melrose} 0px 12px,
          transparent 12px 28px,
          ${({ theme }) => theme.colors2025.blueViolet} 28px 40px,
          transparent 40px 56px,
          ${({ theme }) => theme.colors2025.eastBay} 56px 68px
        );
      }
    }
  }
`;

export const MarqueeWrapper = styled(BaseMarqueeWrapper)`
  & + ${BaseMarqueeWrapper} {
    margin-top: -24px;
  }
`;
