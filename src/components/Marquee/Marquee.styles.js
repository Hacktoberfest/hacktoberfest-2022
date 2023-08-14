import styled, { keyframes } from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const marqueeScroll = () => keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
`;

export const MarqueeWrapper = styled.div`
  --gap: 40px;
  display: flex;
  gap: var(--gap);
  overflow: hidden;
  width: 100%;
  user-select: none;

  .marquee_content {
    animation: ${marqueeScroll} 60s linear infinite
      ${(props) => props.direction || 'forwards'};
    display: flex;
    flex-shrink: 0;
    gap: var(--gap);
    justify-content: space-around;
    min-width: 100%;

    @media (prefers-reduced-motion) {
      animation-play-state: paused;
    }

    li {
      display: flex;
      align-items: center;
      font-size: 85px;
      font-style: italic;
      font-weight: 800;
      line-height: 100%; /* 120px */
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.neutral.manga200};

      ${mQ(bp.desktop)} {
        font-size: 120px;
      }

      img {
        max-width: 72px;
        width: 100%;

        ${mQ(bp.desktop)} {
          max-width: 102px;
        }
      }
    }
  }
`;