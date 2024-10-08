import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledContentSide = styled.div`
  align-items: flex-start;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  ${mQ(bp.desktop)} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 64px;
  }
`;
