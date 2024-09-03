import styled, { css, keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

const loadAvi = keyframes`
 to {
    transform: translate(34px, 34px) rotate(0deg);
    opacity: 1;
  }
`;

const loadAviToPlace = keyframes`
 to {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
`;

const loadAviBackdrop = keyframes`
  to {
    clip-path: polygon(0 0, calc(100% - 34px) 0, 100% 34px, 100% 100%, 34px 100%, 0 calc(100% - 34px));
  }
`;

export const StyledAvatar = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  position: relative;

  ${mQ(bp.tablet)} {
    margin-bottom: 0;
    width: 100%;
  }

  svg {
    grid-row: 1/-1;
    grid-column: 1/-1;
    width: 100%;
    height: auto;
  }
`;

export const StyledAvatarContainer = styled.div`
  margin: 0 auto;
  position: relative;
  grid-row: 1/-1;
  grid-column: 1/-1;
  width: ${({ $placeholder }) => ($placeholder ? '100%' : '84.07079646%')};
  transition:
    opacity 500ms ease,
    transform 500ms ease;

  &::before {
    ${({ $placeholder, theme }) =>
      !$placeholder &&
      css`
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100% + 34px);
        height: calc(100% + 34px);
        background-color: ${theme.colors.green};
        clip-path: polygon(
          100% 100%,
          100% 34px,
          100% 34px,
          100% 100%,
          34px 100%,
          34px 100%
        );
        animation: ${loadAviBackdrop} 500ms 1000ms ease forwards;
      `}
  }

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 1px solid
      ${({ theme, $placeholder }) =>
        $placeholder ? 'transparent' : theme.colors.typography};

    ${({ $placeholder }) =>
      !$placeholder &&
      css`
        transform: translateY(200px) rotate(-16deg);
        opacity: 0;
        animation:
          ${loadAvi} 500ms 500ms ease forwards,
          ${loadAviToPlace} 500ms 1000ms ease forwards;
      `}
  }
`;
