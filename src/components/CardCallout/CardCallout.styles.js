import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body16, body20 } from 'themes/typography';

export const StyledCardCallout = styled.div`
  --offset: 0;
  --square: 28, 28, 28;

  padding: var(--offset);
  position: relative;
  color: ${({ theme }) => theme.colors.dark};
  isolation: isolate;

  ${mQ(bp.desktop)} {
    --offset: 24px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: linear-gradient(
        90deg,
        rgba(var(--square), 1) 0%,
        rgba(var(--square), 1) calc(0% + var(--offset)),
        rgba(var(--square), 0) calc(0% + var(--offset)),
        rgba(var(--square), 0) calc(100% - var(--offset)),
        rgba(var(--square), 1) calc(100% - var(--offset))
      );
      width: 100%;
      height: var(--offset);
      left: 0;
    }

    &::before {
      top: 0;
    }

    &::after {
      bottom: 0;
    }
  }
`;

export const StyledCardCalloutContainer = styled.div`
  padding: 40px;
  position: relative;
`;

export const StyledCardCalloutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
`;

export const StyledCardCalloutTitle = styled.h2`
  ${body16};

  ${mQ(bp.desktop)} {
    ${body20};
  }
`;

export const StyledCardBackground = styled.div`
  inset: var(--offset);
  background-color: ${({ theme }) => theme.colors.green};
  content: '';
  position: absolute;
`;
