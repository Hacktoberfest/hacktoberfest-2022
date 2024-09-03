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
  display: flex;
  width: 100%;
  align-items: center;
  gap: 16px;
  color: inherit;
  font-weight: 500;
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

  &:hover {
    ${StyledTextLinkArrow} {
      > span {
        &:nth-child(2),
        &:nth-child(3) {
          opacity: 0;
        }

        &:nth-child(2) {
          transition-delay: 200ms;
        }

        &:nth-child(3) {
          transition-delay: 0ms;
        }
      }
    }
  }
`;
