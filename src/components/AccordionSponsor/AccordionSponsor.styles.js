import styled, { keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body20 } from 'themes/typography';

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
  border: 1px solid ${({ theme }) => theme.colors.black};
  padding: 48px 24px;

  ${mQ(bp.tablet)} {
    padding: 48px;
  }

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
      font-weight: 700;
      text-indent: 2px;
      content: '${({ open }) => (open ? '[-]' : '[+]')}';
      transition:
        letter-spacing 0.2s ease 0.2s,
        text-indent 0.2s ease 0.2s,
        text-shadow 0.2s ease 0.2s,
        color 0.4s ease;
      top: 0;

      ${mQ(bp.tablet)} {
        top: 50%;
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
        text-shadow: -1px -1px 10px ${({ theme }) => theme.colors.pink};
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
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px 0 0;

    p {
      ${body20}
    }

    ul {
      list-style-type: disc;
      padding-left: 20px;
    }
  }
`;

export const StyledAccordionHeader = styled.div`
  ${mQ(bp.tablet)} {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 40px;
    align-items: center;
  }
`;

export const StyledAccordionImageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  margin-bottom: 40px;
  max-width: 80px;
  width: 100%;
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
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    background-color: ${({ theme }) => theme.colors.deepPink};
    clip-path: polygon(
      0 0,
      calc(100% - 8px) 0,
      100% 8px,
      100% 100%,
      8px 100%,
      0 calc(100% - 8px)
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
    background-color: #fff;
  }
`;

export const StyledAccordionLink = styled.p`
  margin-top: 24px;
`;
