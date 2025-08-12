import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { textSm } from 'themes/typography';
import Image from 'next/image';

export const StyledFooter = styled.footer`
  display: grid;
  gap: 40px 0;
  grid-column: full !important;
  grid-template-columns: subgrid;
  padding: 128px 0 80px 0;
  position: relative;

  ${mQ(bp.tablet)} {
    gap: 80px 0;
    padding: 168px 0
      ${({ $isEasterEggVisible }) => ($isEasterEggVisible ? 0 : '128px')} 0;
  }

  > * {
    grid-column: main-start / main-end;
  }

  &::before {
    background: ${({ theme }) =>
      `radial-gradient(169.98% 55.24% at 50% 100%, ${theme.colors2025.eastBay} 0%, rgb(from ${theme.colors2025.void} r g b / 0) 100%)`};
    bottom: 0;
    content: '';
    height: 100%;
    grid-column: full !important;
    left: 0;
    position: absolute;
    width: 100%;
    z-index: -1;

    ${mQ(bp.tablet)} {
      background: ${({ theme }) =>
        `radial-gradient(78.21% 78.21% at 50% 100%, ${theme.colors2025.eastBay} 0%, rgb(from ${theme.colors2025.void} r g b / 0) 100%)`};
    }
  }
`;

export const StyledFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: space-between;

  ${mQ(bp.tablet)} {
    flex-direction: row;
  }
`;

export const StyledFooterLogo = styled.div`
  max-width: 280px;
  position: relative;
  width: 100%;

  img {
    height: auto;
    width: 100%;
  }
`;

export const StyledFooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${mQ(bp.tablet)} {
    max-width: 416px;
    width: 100%;
  }

  p {
    ${textSm};
  }
`;

export const StyledFooterLinks = styled.nav`
  display: grid;
  gap: 32px;
  grid-template-columns: minmax(0, 1fr);

  ${mQ(bp.tablet)} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 416px;
    width: 100%;
  }
`;

export const StyledFooterLinksColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ul {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  li {
    line-height: 0;
  }
`;

export const StyledFooterLinksTitle = styled.h3`
  ${textSm};
  border-bottom: 1px solid ${({ theme }) => theme.colors2025.eastBay};
  color: ${({ theme }) => theme.colors2025.blueViolet};
  font-weight: 700;
  padding-bottom: 8px;
  text-transform: uppercase;
`;

export const StyledFooterCopyright = styled.ul`
  display: flex;
  gap: 12px;
  flex-direction: column-reverse;

  ${mQ(bp.tablet)} {
    align-items: flex-end;
    flex-direction: row;
    gap: 16px;
  }

  > li {
    ${textSm};

    &:first-child {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 28px;

      ${mQ(bp.tablet)} {
        margin-right: auto;
        margin-top: 0;
      }

      img {
        height: auto;
        max-width: 160px;
        width: 100%;
      }
    }
  }
`;

export const StyledEasterEggContainer = styled.div`
  display: none;

  ${mQ(bp.largeDesktop)} {
    display: block;
    grid-column: full-start / full-end;
    margin: 0 auto;
    position: relative;
  }
`;

export const StyledAlienContainer = styled.div`
  top: ${({ $isVisible }) => ($isVisible ? '50%' : '-283px')};
  opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  transition:
    top 1s ease-out,
    opacity 1s ease-out;
`;

export const StyledFlagImage = styled(Image)`
  left: ${({ $isVisible }) => ($isVisible ? '172px' : '0')};
  opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition:
    left 1s ease-out,
    opacity 1s ease-out;
`;
