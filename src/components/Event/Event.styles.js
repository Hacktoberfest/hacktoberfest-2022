import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { textXl } from '../../themes/typography';

export const StyledEvent = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: minmax(0, 1fr);

  ${mQ(bp.desktop)} {
    gap: 32px 64px;
    grid-template-columns: 1fr max-content;
  }
`;

export const StyledEventHeading = styled.span`
  ${textXl};
  font-weight: 700;
`;

export const StyledEventContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  ${mQ(bp.desktop)} {
    gap: 64px;
    flex-direction: row;

    > :first-child {
      flex-shrink: 0;
      max-width: 304px;
      min-width: 304px;
    }
  }
`;

export const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1lh;

  ul {
    color: ${({ theme }) => theme.colors2025.space.white};
    font-weight: 700;
  }
`;

export const StyledRSVP = styled.div`
  ${({ $missing }) => $missing && `font-style: italic;`}

  ${mQ(bp.desktop)} {
    text-align: right;
  }

  a {
    width: auto;
  }
`;
