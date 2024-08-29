import Link from 'next/link';
import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body16, body18, body32, headline32 } from 'themes/typography';

export const StyledHeader = styled.header`
  padding: 12px 0;
  position: ${({ $isOpen }) => ($isOpen ? 'fixed' : 'absolute')};
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  color: ${({ $isHome, theme }) =>
    $isHome ? theme.colors.darkGreen : theme.colors.typography};

  ${mQ(bp.desktop)} {
    padding: 40px 0;
    position: absolute;
  }
`;

export const StyledHeaderContainer = styled.div`
  max-width: 1328px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${mQ(bp.desktop)} {
    padding: 0 24px;
  }
`;

export const StyledHeaderLogo = styled.div`
  line-height: 0;
  z-index: 5;

  img {
    width: auto;
    height: 40px;

    ${mQ(bp.desktop)} {
      height: 80px;
    }
  }
`;

export const StyledHeaderNav = styled.nav`
  display: flex;
  flex-grow: 1;
  gap: 30px;

  ${mQ(bp.desktop)} {
    align-items: center;
    gap: 32px;
  }

  ${mQ(bp.desktop - 1, 'max')} {
    position: absolute;
    inset: 0;
    width: 100dvw;
    height: 100dvh;
    color: ${({ theme }) => theme.colors.green};
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    padding: 120px 24px 64px;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.darkGreen};
    overflow: scroll;
  }

  > *:first-child {
    ${mQ(bp.desktop)} {
      margin-left: auto;
    }
  }
`;

export const StyledHeaderLink = styled(Link)`
  ${body32}
  position: relative;
  transition: 0.1s ease;
  text-decoration: none;
  color: inherit;

  ${mQ(bp.desktop)} {
    ${body16}
    text-transform: uppercase;
    font-weight: 500;
  }

  &::before {
    content: '>';
    color: ${({ theme }) => theme.colors.pink};

    ${mQ(bp.desktop)} {
      display: none;
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: currentColor;
    transform: scaleX(0);
    transition: transform 300ms ease-in-out;
  }

  &:hover {
    &::after {
      transform: scaleX(1);
    }
  }
`;

export const StyledHeaderToggle = styled.button`
  overflow: hidden;
  text-indent: -9999px;
  width: 32px;
  height: 32px;
  position: relative;
  z-index: 5;
  margin-left: auto;

  ${mQ(bp.desktop)} {
    display: none;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 75%;
    height: 2px;
    background-color: ${({ $isOpen, $isHome, theme }) =>
      $isHome && !$isOpen ? theme.colors.darkGreen : theme.colors.pink};
    transition:
      transform 500ms ease-in-out,
      top 500ms ease-in-out;
  }

  &::before {
    ${({ $isOpen }) =>
      $isOpen
        ? `
      top: calc(50%);
      transform: translate(-50%) rotate(45deg);
    `
        : `
      top: calc(50% - 4px);
      transform: translate(-50%);
    `}
  }

  &::after {
    ${({ $isOpen }) =>
      $isOpen
        ? `
      top: calc(50%);
      transform: translate(-50%) rotate(-45deg);
    `
        : `
      top: calc(50% + 4px);
      transform: translate(-50%);
    `}
  }
`;
