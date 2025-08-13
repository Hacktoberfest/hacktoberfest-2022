import Link from 'next/link';
import styled from 'styled-components';
import { textSm } from 'themes/typography';

import { StyledCorners } from 'components/Corners/Corners.styles';

export const StyledCustomLink = styled(Link)`
  ${textSm};
  color: ${({ theme }) => theme.colors2025.lavendar};
  position: relative;
  font-family: 'Atkinson Hyperlegible Mono';
  font-weight: 700;
  text-decoration: none;
  transition: color 300ms ease-in-out;
  text-transform: uppercase;

  ${({ $isTopNav }) =>
    $isTopNav &&
    `
      letter-spacing: normal;
      padding: 12px 16px;
      ${StyledCorners} {
        inset: 0;
        color: transparent; 
      }
    `}

  &:hover {
    ${({ $isTopNav, theme }) =>
      $isTopNav
        ? `
          background-color: rgb(from ${theme.colors2025.melrose} r g b / 0.06);
          color: ${theme.colors2025.melrose};
          
          ${StyledCorners} {
            color: ${theme.colors2025.space.white};
            inset: -2px;
          }
      `
        : `
          color: ${theme.colors2025.space.white};
          text-shadow: 0 0 5px
            rgb(from ${theme.colors2025.space.white} r g b / 0.5);
        `}
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

export const StyledCustomLinkContent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;

  ${({ $isExternal }) =>
    $isExternal &&
    `
    padding-right: 7px;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 4px;
      border: 1px solid currentColor;
      border-left: 0;
      border-bottom: 0;
    }
  `};
`;
