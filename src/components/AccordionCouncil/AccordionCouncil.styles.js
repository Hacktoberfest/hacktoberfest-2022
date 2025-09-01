import styled, { keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body16, body20 } from 'themes/typography';

export const StyledAccordion = styled.details`
  ${({ $isFilled, theme }) =>
    $isFilled &&
    `
    border: 1px solid ${theme.colors.black};
    padding: 48px 24px;

    ${mQ(bp.tablet)} {
      padding: 48px 64px;
    }
  `};

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
      top: 0;
    }
  }

  > div {
    max-width: 1012px;
    margin: 0 auto;
    padding: 48px 0 0;

    p {
      margin: 0 0 24px;
      ${body20}

      &:last-child {
        margin-bottom: 0;
      }
    }

    li {
      ${body16}
    }
  }
`;

export const StyledAccordionHeader = styled.div`
  color: ${({ theme }) => theme.colors2025.space.white};
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${mQ(bp.tablet)} {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 96px;

    ${({ $isFilled }) => $isFilled && `align-items: center;`};
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
  width: 188px;
  position: relative;

  ${mQ(bp.tablet)} {
    margin-bottom: 0;
    width: 100%;
  }
`;

export const StyledGlowBox = styled.div`
  background-color: ${({ theme }) => theme.colors2025.space.white};
  box-shadow: 0 0 5px 0
    rgb(from ${({ theme }) => theme.colors2025.space.white} r g b / 0.8);
  height: 8px;
  width: 8px;
  position: absolute;
  top: 0;
  left: 0;

  &:nth-of-type(2) {
    left: calc(100% - 8px);
  }

  &:nth-of-type(3) {
    top: calc(100% - 8px);
  }

  &:nth-of-type(4) {
    left: calc(100% - 8px);
    top: calc(100% - 8px);
  }
`;

export const StyledAccordionImage = styled.div`
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  margin: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #fff;
  }
`;

export const StyledAccordionLinks = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 24px 8px;
  margin: 24px 0 0;

  &::before {
    content: '= = = ';
    width: 100%;
    display: block;
    font-size: 24px;
    line-height: 1.4166666667;
  }

  li {
    font-weight: 600;
    text-transform: uppercase;

    &::after {
      content: ' | ';
    }

    &:last-child {
      &::after {
        content: '';
      }
    }
  }
`;
