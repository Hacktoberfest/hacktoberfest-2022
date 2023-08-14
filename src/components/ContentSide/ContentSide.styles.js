import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import { body24 } from 'themes/typography';

export const StyledContentSide = styled.div`
  padding: 80px 0;

  ${mQ(bp.desktop)} {
    padding: 144px 0;
  }
`;

export const StyledContentSideContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;

  ${mQ(bp.desktop)} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 64px;
  }
`;
