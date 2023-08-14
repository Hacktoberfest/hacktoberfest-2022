import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledEvent = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr);
  padding: 48px 0;

  ${mQ(bp.desktop)} {
    gap: 64px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const StyledEventInfo = styled.div`
  ${mQ(bp.desktop)} {
    padding: 40px 0 0;
  }

  li {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;