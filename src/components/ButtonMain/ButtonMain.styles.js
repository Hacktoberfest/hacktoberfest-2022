import Link from 'next/link';
import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body16 } from 'themes/typography';

export const StyledButtonMain = styled(Link)`
  ${body16}
  line-height: 30px;
  font-weight: 500;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    color 300ms ease-in-out,
    background-color 300ms ease-in-out;
  padding: 12px 30px;
  width: 100%;
  text-align: center;

  ${mQ(bp.tablet)} {
    width: auto;
    padding: 16px 40px;
  }

  ${({ $variant, theme }) =>
    $variant === 'primary' &&
    `
    background-color: ${theme.colors.black};
    color: ${theme.colors.green};

    &:hover {
      background-color: ${theme.colors.darkGreen};
    }
  `};

  ${({ $variant, theme }) =>
    $variant === 'primary-black' &&
    `
    background-color: ${theme.colors.black};
    color: ${theme.colors.typography};

    &:hover {
      background-color: ${theme.colors.darkGreen};
    }
  `};

  ${({ $variant, theme }) =>
    $variant === 'primary-green' &&
    `
    background-color: ${theme.colors.green};
    color: ${theme.colors.black};


    &:hover {
      background-color: ${theme.colors.lightGreen};
    }
  `};

  ${({ $variant, theme }) =>
    $variant === 'secondary-deep-pink' &&
    `
    background-color: ${theme.colors.deepPink};
    color: ${theme.colors.typography};

    &:hover {
      background-color: ${theme.colors.lightPink};
      color: ${theme.colors.black};
    }
  `};

  ${({ $variant, theme }) =>
    $variant === 'secondary-pink' &&
    `
    background-color: ${theme.colors.pink};
    color: ${theme.colors.black};


    &:hover {
      background-color: ${theme.colors.lightPink};
    }
  `};

  ${({ $variant, theme }) =>
    $variant === 'secondary-beige' &&
    `
    background-color: ${theme.colors.typography};
    color: ${theme.colors.black};


    &:hover {
      background-color: ${theme.colors.light};
    }
  `};
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  flex-flow: column;
  gap: 8px;
  justify-content: ${({ $align }) => $align || 'flex-start'};

  ${mQ(bp.tablet)} {
    flex-direction: row;
    gap: 16px;
  }
`;
