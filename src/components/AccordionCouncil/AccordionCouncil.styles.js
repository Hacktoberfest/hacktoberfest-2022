import styled, { keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body16, body20 } from 'themes/typography';

const rotateAnimation = keyframes`
  0% {
    transform: translateY(-50%) scale(1) rotate(0deg);
  }

  50% {
    transform: translateY(-50%) scale(1.2) rotate(-90deg);
  }

  100% {
    transform: translateY(-50%) scale(1) rotate(-180deg);
  }
`;

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
    position: relative;
    list-style: none;
    cursor: pointer;

    ${mQ(bp.tablet)} {
      padding-right: 60px;
    }

    ${mQ(bp.tablet)} {
      padding-right: 136px;
    }

    &::-webkit-details-marker,
    &::marker {
      display: none;
    }

    &::after {
      margin-left: auto;
      font-size: 20px;
      font-weight: normal;
      text-align: center;
      width: 44px;
      position: absolute;
      right: 0;
      color: ${({ theme }) => theme.colors.black};
      letter-spacing: 2px;
      font-weight: 500;
      text-indent: 2px;
      content: '${({ open }) => (open ? '[-]' : '[+]')}';
      transition:
        letter-spacing 0.2s ease 0.2s,
        text-indent 0.2s ease 0.2s,
        color 0.4s ease;

      ${({ $isFilled }) =>
        $isFilled
          ? `
        top: 0;

        ${mQ(bp.tablet)} {
          top: 50%;
        }`
          : `top: 18px;`};

      ${mQ(bp.tablet)} {
        width: 72px;
        font-size: 32px;
        letter-spacing: 1px;
        text-indent: 1px;
        transform: translateY(-50%);
      }
    }

    &:hover {
      &::after {
        color: ${({ theme }) => theme.colors.deepPink};
        letter-spacing: 4px;
        text-indent: 4px;
        transform: translateY(-50%);
        animation: ${rotateAnimation} 0.2s linear;

        @media (prefers-reduced-motion) {
          animation-play-state: paused;
        }
      }
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
  color: ${({ theme }) => theme.colors.black};

  ${mQ(bp.tablet)} {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 64px;

    ${({ $isFilled }) => $isFilled && `align-items: center;`};
  }
`;

export const StyledAccordionImageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  margin-bottom: 40px;
  width: 63.53790614%;
  position: relative;

  ${mQ(bp.tablet)} {
    margin-bottom: 0;
    width: 100%;
  }
`;

export const StyledAccordionImage = styled.div`
  margin: 0 auto;
  position: relative;
  grid-row: 1/-1;
  grid-column: 1/-1;
  width: 100%;
  width: 83.33333333%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    background-color: ${({ theme }) => theme.colors.deepPink};
    clip-path: polygon(
      0 0,
      calc(100% - 20px) 0,
      100% 20px,
      100% 100%,
      20px 100%,
      0 calc(100% - 20px)
    );
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
    border: 1px solid ${({ theme }) => theme.colors.typography};
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
