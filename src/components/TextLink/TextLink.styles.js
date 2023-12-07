import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

const textAnimation = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const StyledTextLinkArrow = styled.span`
  margin-top: -2px;
  font-size: 24px;
  line-height: 1;

  > span {
    transition: opacity 300ms ease-in-out, color 300ms ease-in-out;

    &:nth-child(2),
    &:nth-child(3) {
      opacity: 0;
    }

    &:nth-child(2) {
      animation-delay: 300ms;
    }

    &:nth-child(3) {
      animation-delay: 600ms;
    }
  }
`;

export const StyledTextLink = styled(Link)`
  display: flex;
  /* grid-template-columns: 10px minmax(min-content, 1fr) 44px; */
  width: 100%;
  align-items: center;
  gap: 16px;
  color: ${({ theme }) => theme.colors.neutral.manga300};
  font-weight: 600;
  text-transform: uppercase;
  transition: color 300ms ease-in-out, text-shadow 300ms ease-in-out;

  ${mQ(bp.desktop)} {
    width: auto;
    display: inline-flex;
  }

  ${({ $size }) => $size === 'lg' && (`
    font-size: 20px;
    line-height: 30px;
  `)};

  ${({ $size }) => $size === 'sm' && (`
    font-size: 16px;
    line-height: 26px;
  `)};

  &::before {
    content: '';
    aspect-ratio: 1/1;
    display: block;
    background-color: ${({ theme }) => theme.colors.bavarian.blue100};
    transition: background-color 300ms ease-in-out, transform 300ms ease-in-out, box-shdadow 300ms ease-in-out;
    flex-shrink: 0;
    ${({ $size }) => $size === 'lg' && (`
      width: 10px;
    `)};
    ${({ $size }) => $size === 'sm' && (`
      width: 8px;
    `)};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.neutral.manga200};
    text-shadow: 1px 1px 10px rgba(236, 66, 55, 0.50), -1px -1px 10px rgba(255, 251, 164, 0.50);

    &::before {
      background-color: ${({ theme }) => theme.colors.bavarian.blue200};
      transform: scale(1.2);
      box-shadow: 1px 1px 10px rgba(236, 66, 55, 0.50), -1px -1px 10px rgba(255, 251, 164, 0.50);
    }

    ${StyledTextLinkArrow} {
      > span {
        &:nth-child(1) {
          opacity: 0;
        }

        &:nth-child(2) {
          animation: ${textAnimation} 300ms ease-in-out;
        }

        &:nth-child(3) {
          opacity: 1;
          color: ${({ theme }) => theme.colors.bavarian.blue200};
        }
      }
    }
  }
`;
