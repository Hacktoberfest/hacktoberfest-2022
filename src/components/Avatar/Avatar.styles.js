import styled, { keyframes } from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

const loadAvi = () => keyframes`
  to {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
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
  width: 84.07079646%;
  transition: opacity 500ms ease, transform 500ms ease;

  ${({ $placeholder }) => $placeholder && `
    opacity: 0.5;
  `}

  ${({ $placeholder, $rotate }) => !$placeholder && ($rotate === 'left' ? `
    transform: rotate(-14deg);
  ` : `
    transform: rotate(14deg);
  `)}

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
    border-radius: 16px;
    border: 1px solid ${({ theme, $placeholder }) => $placeholder ? 'transparent' : theme.colors.neutral.manga400};
    animation ${loadAvi} 500ms 500ms ease forwards;
    transform: translateY(200px) rotate(-16deg);
    opacity: 0;
    transition: border-color 500ms ease;
  }
`;
