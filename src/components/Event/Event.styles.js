import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledEvent = styled.div`
  display: grid;
  gap: 12px 24px;
  grid-template-columns: minmax(0, 1fr);
  padding: 48px 0;

  ${mQ(bp.desktop)} {
    gap: 32px 64px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const StyledContent = styled.div`
  align-self: end;
`;

export const StyledRSVP = styled.p`
  align-self: end;
  ${({ $missing }) => $missing && `font-style: italic;`}
`;
