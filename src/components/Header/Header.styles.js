import ButtonMain from 'components/ButtonMain';
import { StyledButtonMain } from 'components/ButtonMain/ButtonMain.styles';
import styled, { keyframes } from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import { body18 } from 'themes/typography';

export const StyledHeader = styled.header`
  padding: 12px 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.manga400};
  z-index: 100;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: ${({ theme }) => theme.colors.neutral.void200};
    opacity: .8;
  }

  ${mQ(bp.desktop)} {
    padding: 40px 0;
    border-bottom: 0;
  }
`;

export const StyledHeaderContainer = styled.div`
  position: relative;
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

  img {
    width: auto;
    height: 40px;

    ${mQ(bp.desktop)} {
      height: 64px;
    }
  }
`;

export const StyledHeaderNav = styled.nav`
  display: flex;
  flex-grow: 1;
  align-items: center;
  gap: 32px;

  > *:first-child {
    margin-left: auto;
  }

  ${StyledButtonMain} {
    margin-left: auto;
  }

  > button {
    margin-left: auto;
  }

  a {
    @media (max-width: 964px) {
      display: none;
    }
  }

  .menu_toggle {
    display: none;

    @media (max-width: 964px) {
      display: block;
    }
  }
`;

export const StyledMobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const StyledMobileWrapper = styled.div`
  background: ${({ theme }) => theme.colors.neutral.void200};
  display: block;
  height: 100%;
  left: 0;
  opacity: 0;
  padding: 12px 0;
  position: fixed;
  top: 0;
  transition: 0.5s ease;
  visibility: hidden;
  width: 100%;
  z-index: 500;

  &[aria-selected='true'] {
    opacity: 1;
    visibility: visible;
  }
`;

export const StyledMobileContainer = styled.div`
  max-width: 1328px;
  margin: 0 auto;
  padding: 0 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const StyledMobileNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 48px 0;
  flex-grow: 1;

  a {
    display: block;
    width: 100%;
    padding: 16px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.manga300};
  }

  ${StyledButtonMain} {
    margin-top: auto;
    text-align: center;
    border-bottom: 0;
  }
`;

export const StyledHeaderLink = styled.a`
  ${body18};
  position: relative;
  text-transform: uppercase;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.neutral.manga300};
  transition: 0.1s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.neutral.manga200};
    transform: scaleX(0);
    transition: transform 300ms ease-in-out;
  }

  &:hover {
    text-shadow: 1px 1px 10px rgba(236, 66, 55, 0.50), -1px -1px 10px rgba(255, 251, 164, 0.50);
    color: ${({ theme }) => theme.colors.neutral.manga200};

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
    background-color: ${({ theme }) => theme.colors.neutral.manga300};
  }

  &::before {
    ${({ $isOpen }) => $isOpen ? `
      top: calc(50%);
      transform: translate(-50%) rotate(45deg);
    ` : `
      top: calc(50% - 4px);
      transform: translate(-50%);
    `}
  }

  &::after {
    ${({ $isOpen }) => $isOpen ? `
      top: calc(50%);
      transform: translate(-50%) rotate(-45deg);
    ` : `
      top: calc(50% + 4px);
      transform: translate(-50%);
    `}
  }
`;