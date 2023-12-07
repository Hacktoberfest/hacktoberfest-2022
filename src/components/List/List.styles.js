import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledListWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 64px;

  ${mQ(bp.desktop)} {
    grid-template-columns: 1fr 742px;
  }

  ul {
    display: block;
    margin-bottom: -16px;

    ${mQ(bp.desktop)} {
      column-count: 2;
      column-gap: 64px;
    }
  }

  li {
    margin-bottom: 16px;
  }
`;

export const StyledList = styled.div``;
