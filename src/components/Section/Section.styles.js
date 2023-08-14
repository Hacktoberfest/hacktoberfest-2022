import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledSection = styled.div`
  padding: 80px 0%;

  ${mQ(bp.desktop)} {
    padding: 144px 0;
  }
`;