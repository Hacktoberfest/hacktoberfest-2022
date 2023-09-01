import styled, { keyframes } from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledSupportSection = styled.div`
  padding: 80px 0;

  ${mQ(bp.desktop)} {
    padding: 144px 0;
  }
`;

export const StyledSupportSectionContainer = styled.div`
  ${mQ(bp.desktop)} {
    display: flex;
    margin: 0 0 44px;
  }
`;

export const StyledSupportSectionContent = styled.div`
  max-width: 742px;
`;

export const StyledSupportSectionCallout = styled.div`
  max-width: 608px;
  margin-left: auto;
`;

export const StyledSupportSectionHearts = styled.div`
  width: 100%;
  margin: 24px 0;

  ${mQ(bp.desktop)} {
    margin: 0 0 0 auto;
    max-width: 460px;
  }
`;