import styled, { keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { textLg } from 'themes/typography';

export const StyledAccordion = styled.details`
  summary {
    position: relative;
    list-style: none;
    cursor: pointer;
    ${textLg};
    font-weight: 700;
    color: ${({ theme }) => theme.colors2025.space.white};
    display: flex;
    justify-content: space-between;
    gap: 32px;
    width: 100%;

    strong {
      color: ${({ theme }) => theme.colors2025.blueViolet};
    }

    &::-webkit-details-marker,
    &::marker {
      display: none;
    }

    span {
      max-width: 752px;
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 40px;
    max-width: 752px;
    padding: 24px 0 0;
  }
`;
