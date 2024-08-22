import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledEvent = styled.div`
  display: grid;
  gap: 64px;
  grid-template-columns: minmax(0, 1fr);

  ${mQ(bp.desktop)} {
    gap: 32px 64px;
    grid-template-columns: 1fr max-content;
  }
`;

export const StyledEventContent = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;

  ${mQ(bp.desktop)} {
    gap: 64px;
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1lh;

  ${mQ(bp.desktop)} {
    padding-top: 40px;
  }
`;

export const StyledRSVP = styled.p`
  ${({ $missing }) => $missing && `font-style: italic;`}

  ${mQ(bp.desktop)} {
    text-align: right;
  }

  a {
    width: auto;
  }
`;
