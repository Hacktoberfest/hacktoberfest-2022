import styled, { keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { headline32 } from 'themes/typography';

const rotateAnimation = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }

  50% {
    transform: scale(1.2) rotate(-90deg);
  }

  100% {
    transform: scale(1) rotate(-180deg);
  }
`;

export const StyledAccordion = styled.details`
  padding: 48px 0;

  summary {
    position: relative;
    list-style: none;
    cursor: pointer;
    ${headline32};
    padding-right: 60px;

    ${mQ(bp.desktop)} {
      padding-right: 136px;
    }

    strong {
      color: ${({ $isDark, theme }) =>
        $isDark ? theme.colors.green : theme.colors.deepPink};
    }

    &::-webkit-details-marker,
    &::marker {
      display: none;
    }

    &::after {
      margin-left: auto;
      font-size: 20px;
      font-weight: normal;
      text-align: center;
      width: 44px;
      position: absolute;
      top: 0;
      right: 0;
      letter-spacing: 2px;
      font-weight: 700;
      text-indent: 2px;
      content: '${({ open }) => (open ? '[-]' : '[+]')}';
      transition:
        letter-spacing 0.2s ease 0.2s,
        text-indent 0.2s ease 0.2s,
        color 0.4s ease;

      ${mQ(bp.desktop)} {
        width: 72px;
        font-size: 32px;
        letter-spacing: 1px;
        text-indent: 1px;
      }
    }

    &:hover {
      &::after {
        animation: ${rotateAnimation} 0.2s linear;
        color: ${({ $isDark, theme }) =>
          $isDark ? theme.colors.green : theme.colors.deepPink};
        letter-spacing: 4px;
        text-indent: 4px;

        @media (prefers-reduced-motion) {
          animation-play-state: paused;
        }
      }
    }
  }

  > div {
    padding: 24px 0 0;
  }
`;
