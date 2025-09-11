import styled, { keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { textSm } from 'themes/typography';
import Image from 'next/image';

const twinkle = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const landing = keyframes`
  0% {
    opacity: 0;
    top: -283px;
  }
  10% {
    opacity: 1;
  }
  80% {
    top: 48%;
  }
  90% {
    top: 47%;
  }
  100% {
    top: 50%;
  }
`;

const boosters = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
    transform-origin: center;
  }
  60% {
    opacity: 1;
    transform: scale(0.6);
  }
  70% {
    opacity: 1;
  }
  80% {
    transform: scale(1);
  }
  100% {
    opacity: 0;
    display: none;
  }
`;

const flag = keyframes`
  0% {
    left: 50%;
    top: 0;
  }
  80% {
    left: 172px;
    top: 0;
  }
  100% {
    left: 172px;
    top: 10px;
  }
`;

const withdraw = keyframes`
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
    display: none;
  }
`;

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
    margin: 0;
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

  h3,
  ul {
    margin: 0;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-left: 0;
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
  padding-left: 0;

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

  ${mQ(bp.desktop)} {
    display: block;
    grid-column: full-start / full-end;
    margin: 0 auto;
    position: relative;
    width: 100%;

    > img {
      object-fit: cover;
      width: 100%;
    }
  }
`;

export const StyledBoosters = styled.g`
  animation-duration: 6s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  transform-box: fill-box;

  /* These ensure the boosters stay in the correct position */
  will-change: transform, opacity;
  transform-origin: center bottom;
`;

export const StyledAlienContainer = styled.div`
  animation-name: ${({ $isVisible }) => $isVisible && landing};
  animation-duration: 6s;
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 188px;

  > svg {
    position: absolute;
    top: 0;
    z-index: 2;
  }

  ${StyledBoosters} {
    animation-name: ${({ $isVisible }) => $isVisible && boosters};
  }
`;

export const StyledHand = styled.g`
  animation-delay: 3s;
  animation-duration: 2s;
  animation-fill-mode: forwards;
`;

export const StyledFlagImage = styled.div`
  animation-name: ${({ $isVisible }) => $isVisible && flag};
  animation-duration: 3s;
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  position: absolute;
  left: 172px;
  top: 10px;
  z-index: 1;
  width: 100%;

  ${StyledHand} {
    animation-name: ${({ $isVisible }) => $isVisible && withdraw};
  }
`;

export const StyledTwinkle = styled.g`
  animation: ${twinkle} 6s infinite;
  animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);

  &:nth-of-type(1) {
    animation-delay: 1s;
  }

  &:nth-of-type(2) {
    animation-delay: 0.7s;
  }

  &:nth-of-type(3) {
    animation-delay: 1.3s;
  }

  &:nth-of-type(4) {
    animation-delay: 2.5s;
  }

  &:nth-of-type(5) {
    animation-delay: 3s;
  }

  &:nth-of-type(6) {
    animation-delay: 1s;
  }
`;
