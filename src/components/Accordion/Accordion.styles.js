import styled, {keyframes} from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import { headline32 } from 'themes/typography';

const rotateAnimation = () => keyframes`
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
    color: ${({ theme }) => theme.colors.neutral.manga200};
    padding-right: 60px;

    ${mQ(bp.desktop)} {
      padding-right: 136px;
    }

    span {
      color: ${({ theme }) => theme.colors.bavarian.red200};
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
      color: ${({ theme }) => theme.colors.neutral.manga300};
      letter-spacing: 2px;
      font-weight: 700;
      text-indent: 2px;
      content: '${(props) => (props.open ? '[-]' : '[+]')}';
      transition:
        letter-spacing 0.2s ease 0.2s,
        text-indent 0.2s ease 0.2s,
        text-shadow 0.2s ease 0.2s,
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
        color: ${({ theme }) => theme.colors.bavarian.blue200};
        text-shadow: 1px 1px 10px rgba(236, 66, 55, 0.50), -1px -1px 10px rgba(255, 251, 164, 0.50);
        letter-spacing: 4px;
        text-indent: 4px;
        animation: ${rotateAnimation()} 0.2s linear;

        @media (prefers-reduced-motion) {
          animation-play-state: paused;
        }
      }
    }
  }

  &[open] {
    summary {
      &::before {
        letter-spacing: 4px;
        text-indent: 4px;
        transition-delay: 0s;
      }

      &:hover {
        &::before {
          color: ${(props) => props.theme.psybeam};
          letter-spacing: 1px;
          text-indent: 1px;
          animation: none;
        }
      }
    }
  }

  > div {
    padding: 24px 0 0;
  }
`;