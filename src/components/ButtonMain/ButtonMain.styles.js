import Corners from 'components/Corners';
import { StyledCorners } from 'components/Corners/Corners.styles';
import Link from 'next/link';
import styled, { css, keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { textSm } from 'themes/typography';

const clipAnimate = keyframes`
  0% { clip-path: inset(0 100% 0 0); }
  50% { clip-path: inset(0); }
`;

export const StyledButtonMain = styled(Link)`
  ${textSm}
  font-weight: 700;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    color 300ms ease-in-out,
    background-color 300ms ease-in-out;
  padding: 12px 16px;
  text-align: center;

  ${({ $variant, theme }) =>
    $variant === 'primary' &&
    `
      color: ${theme.colors2025.space.white};
      background: linear-gradient(90deg, rgb(from ${theme.colors2025.blueViolet} r g b / 0.15) 0%, rgb(from ${theme.colors2025.melrose} r g b / 0.15) 100%);
      box-shadow: 0 0 0 1px rgb(from ${theme.colors2025.space.dust} r g b / 0.25);
      position: relative;

      &:hover {
        background: linear-gradient(270deg, ${theme.colors2025.melrose} 0%, ${theme.colors2025.blueViolet} 100%);
        box-shadow: 0 0 0 1px transparent;

        ${StyledCorners} {
          inset: 0;
          color: transparent;
        }
      }
    `};

  ${({ $variant }) =>
    $variant === 'is-loading' &&
    css`
      &::after {
        animation: ${clipAnimate} 1s infinite;
        animation-timing-function: steps(3);
      }
    `}

  ${({ $variant, theme }) =>
    $variant === 'is-loading' &&
    `
      color: transparent;
      background: linear-gradient(90deg, rgb(from ${theme.colors2025.blueViolet} r g b / 0.15) 0%, rgb(from ${theme.colors2025.melrose} r g b / 0.15) 100%);
      border: 0;
      box-shadow: 0 0 0 1px rgb(from ${theme.colors2025.space.dust} r g b / 0.25);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 56px;
        height: 8px;
        background: linear-gradient(
          to right,
          ${theme.colors2025.melrose} 0px 8px,
          transparent 8px 24px,
          ${theme.colors2025.blueViolet} 24px 32px,
          transparent 32px 48px,
          ${theme.colors2025.eastBay} 48px 56px
        );
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
