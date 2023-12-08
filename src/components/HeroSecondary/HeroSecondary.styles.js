import styled, { keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { headline88 } from 'themes/typography';
import heroBg from 'assets/img/bg-hero-secondary.svg';

const textAnimation = keyframes`
  25% {
    content:
      "01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001 01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001 01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001" // for a surprise!!
  }
  50% {
    content:
      "01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100" // open the console
  }
  75% {
    content:
      "01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001 01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001 01100110 01101111 01110010 00100000 01100001 00100000 01110011 01110101 01110010 01110000 01110010 01101001 01110011 01100101 00100001 00100001" // for a surprise!!
  }
  100% {
    content:
      "01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100" // open the console
  }
`;

export const StyledHeroSecondary = styled.div`
  padding: 0 0 48px;
  position: relative;
  background: url(${heroBg.src}) no-repeat;
  background-size: 300% auto;
  background-position: 100% 0;
  overflow: hidden;

  ${mQ(bp.desktop)} {
    background-position: right 0;
    background-size: auto 100%;
  }

  &:after {
    animation: ${textAnimation} 1s linear infinite;
    content: '01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 01001111 01110000 01100101 01101110 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100'; //open the console
    position: absolute;
    bottom: 0;
    left: 0;
    color: ${({ theme }) => theme.colors.neutral.manga200};
    font-size: 16px;
    line-height: 1;
    font-weight: 500;
    pointer-events: none;
    position: absolute;
    text-align: center;
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(236, 66, 55, 0.3) 0%,
      rgba(255, 251, 164, 0.3) 66.15%,
      rgba(51, 182, 216, 0.3) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-mask-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 5%,
      rgba(0, 0, 0, 1) 10%,
      rgba(0, 0, 0, 1) 90%,
      rgba(0, 0, 0, 0) 95%
    );
    mask-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 5%,
      rgba(0, 0, 0, 1) 10%,
      rgba(0, 0, 0, 1) 90%,
      rgba(0, 0, 0, 0) 95%
    );
    white-space: nowrap;
    overflow: hidden;
    z-index: 200;

    @media (prefers-reduced-motion) {
      animation-play-state: paused;
    }
  }
`;

export const StyledHeroSecondaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-direction: column;
  align-items: center;
  padding: 144px 0 222px;

  ${mQ(bp.desktop)} {
    flex-direction: row;
    gap: 64px;
    padding: 234px 0 156px;
  }
`;

export const StyledHeroSecondaryContent = styled.div`
  max-width: 742px;
  width: 100%;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
  z-index: 5;

  ${mQ(bp.desktop)} {
    align-items: flex-start;
  }
`;

export const StyledHeroSecondaryTitle = styled.h1`
  ${headline88};
  color: ${({ theme }) => theme.colors.neutral.manga200};
  text-align: center;

  ${mQ(bp.desktop)} {
    text-align: left;
  }
`;

export const StyledHeroSecondaryImage = styled.div`
  max-width: 252px;
  margin: 0 auto;
  width: 100%;
  position: relative;

  ${mQ(bp.desktop - 1, 'max')} {
    order: -1;
  }

  ${mQ(bp.desktop)} {
    max-width: 340px;
    margin: 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200%;
    background: radial-gradient(
      circle at 50% 50%,
      ${({ theme }) => theme.colors.neutral.void200},
      ${({ theme }) => theme.colors.neutral.void200} 40%,
      transparent 90%
    );
    height: 200%;
  }
`;
