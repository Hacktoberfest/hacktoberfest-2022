import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import Divider from '../Divider';

export const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  color: ${({ theme }) => theme.colors2025.space.white};

  ${mQ(bp.tablet)} {
    top: 24px;
    padding: 12px 24px;
    width: calc(100% - 48px);

    ${({ $isOpen }) =>
      $isOpen &&
      `
      top: 0;
      padding: 0;
    `};
  }
`;

export const StyledHeaderContainer = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors2025.eastBay};
  background-color: rgb(
    from ${({ theme }) => theme.colors2025.void} r g b / 0.15
  );
  backdrop-filter: blur(15px);

  ${mQ(bp.tablet)} {
    border: 1px solid ${({ theme }) => theme.colors2025.eastBay};
    border-radius: 16px;
    padding: 16px 26px;

    ${({ $isOpen }) =>
      $isOpen &&
      `
      padding: 24px;
    `};
  }
`;

export const StyledHeaderLogo = styled.div`
  line-height: 0;
  z-index: 5;

  img {
    width: auto;
    height: 24px;

    ${mQ(bp.tablet)} {
      height: 32px;
    }
  }
`;

export const StyledDesktopHeaderNav = styled.nav`
  display: none;

  ${mQ(bp.desktop)} {
    align-items: center;
    display: flex;
    flex-grow: 1;
    gap: 32px;
  }

  > *:first-child {
    ${mQ(bp.desktop)} {
      margin-left: auto;
    }
  }

  a {
    color: ${({ theme }) => theme.colors2025.space.white};
  }
`;

export const StyledMobileHeaderNav = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  inset: 0;
  height: 100dvh;
  color: ${({ theme }) => theme.colors.green};
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  padding: 32px 24px 64px;
  margin-top: 80px;
  flex-direction: column;
  background: rgb(from ${({ theme }) => theme.colors2025.void} r g b / 0.1);
  backdrop-filter: blur(20px);

  > div > a {
    color: ${({ theme }) => theme.colors2025.space.white};
    font-size: 16px;
    padding: 8px 0;
  }

  > div {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
  }

  ${mQ(bp.desktop)} {
    display: none;
  }
`;

export const StyledDivider = styled.div`
  background-color: rgb(
    from ${({ theme }) => theme.colors2025.space.gray} r g b / 0.25
  );
  height: 1px;
  margin: 12px 0;
`;

export const StyledHeaderToggle = styled.div`
  margin-left: auto;

  ${mQ(bp.desktop)} {
    display: none;
  }

  svg {
    width: 16px;
    height: 10px;
  }
`;
