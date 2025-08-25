import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledSectionSpacing = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $isSmall }) => ($isSmall ? '32px' : '32px')};

  ${mQ(bp.desktop)} {
    gap: ${({ $isSmall }) => ($isSmall ? '32px' : '48px')};
  }
`;
