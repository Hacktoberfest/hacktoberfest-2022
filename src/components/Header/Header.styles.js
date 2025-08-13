import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

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
  }
`;

export const StyledHeaderContainer = styled.div`
  max-width: 1088px;
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

  a {
    color: ${({ theme }) => theme.colors2025.space.white};
  }
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
