import styled, { keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body20 } from 'themes/typography';

export const StyledAccordion = styled.details`
  summary {
    display: flex;
    position: relative;
    list-style: none;
    cursor: pointer;

    &::-webkit-details-marker,
    &::marker {
      display: none;
    }

    button {
      position: absolute;
      right: 0;
      bottom: 0;

      ${mQ(bp.tablet)} {
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px 0 0;

    a {
      color: ${({ theme }) => theme.colors2025.lavendar};
      word-wrap: break-word;
    }

    p,
    li {
      line-height: 19.8px;
    }

    li::marker {
      font-size: 20px;
    }

    ul {
      list-style-type: square;
      padding-left: 20px;
    }
  }
`;

export const StyledAccordionHeader = styled.div`
  h2 {
    text-shadow: none;
  }

  ${mQ(bp.tablet)} {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 40px;
    align-items: center;
  }
`;

export const StyledAccordionImageWrapper = styled.div`
  aspect-ratio: 1;
  border: 1px solid ${({ theme }) => theme.colors2025.eastBay};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors2025.void} 0%,
    rgb(from ${({ theme }) => theme.colors2025.blueViolet} r g b / 0.15) 100%
  );
  box-shadow: 0 2.884px 4.326px 0
    rgb(from ${({ theme }) => theme.colors2025.void} r g b / 0.25);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  width: ${({ $size }) => ($size === 'small' ? '80px' : '120px')};
  position: relative;
  margin-bottom: 24px;

  ${mQ(bp.tablet)} {
    margin-bottom: 0;
    width: ${({ $size }) => ($size === 'small' ? '80px' : '100%')};
  }
`;

export const StyledGlowBox = styled.div`
  background-color: ${({ theme }) => theme.colors2025.space.white};
  box-shadow: 0 0 5px 0
    rgb(from ${({ theme }) => theme.colors2025.space.white} r g b / 0.8);
  height: 4px;
  width: 4px;
  position: absolute;
  top: 0;
  left: 0;

  &:nth-of-type(2) {
    left: calc(100% - 4px);
  }

  &:nth-of-type(3) {
    top: calc(100% - 4px);
  }

  &:nth-of-type(4) {
    left: calc(100% - 4px);
    top: calc(100% - 4px);
  }
`;

export const StyledAccordionImage = styled.div`
  aspect-ratio: 1;
  border-radius: 3px;
  overflow: hidden;
  margin: auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #fff;
  }
`;

export const StyledAccordionLink = styled.p`
  margin-top: 24px;
`;
