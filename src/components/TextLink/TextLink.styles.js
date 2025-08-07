import Link from 'next/link';
import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledTextLinkArrow = styled.span`
  > span {
    transition: opacity 200ms ease-in-out;

    &:nth-child(2) {
      transition-delay: 0ms;
    }

    &:nth-child(3) {
      transition-delay: 200ms;
    }
  }
`;

export const StyledTextLink = styled(Link)`
  color: ${({ theme }) => theme.colors2025.lavendar};
  display: inline-flex;
  width: 100%;
  align-items: center;
  gap: 16px;
  font-family: 'Atkinson Hyperlegible Mono';
  font-weight: 700;
  text-decoration: none;

  ${mQ(bp.desktop)} {
    width: auto;
    display: inline-flex;
  }

  ${({ $size }) =>
    $size === 'lg' &&
    `
    font-size: 20px;
    line-height: 30px;
  `};

  ${({ $size }) =>
    $size === 'sm' &&
    `
    font-size: 16px;
    line-height: 26px;
  `};

  path {
    transition: transform 300ms ease-in-out;

    &:nth-child(1) {
      transform: translateX(0);
    }
  }

  &:hover,
  &:focus {
    path {
      &:nth-child(1) {
        transform: translateX(5px);
      }
    }
  }

  svg {
    flex-shrink: 0;
    height: 16px;
    width: 17px;
    overflow: visible;
  }
`;
