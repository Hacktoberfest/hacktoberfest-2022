import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

export const StyledNote = styled.div`
  display: grid;
  gap: 64px;
  align-items: center;
  grid-template-columns: minmax(0, 1fr);

  ${mQ(bp.desktop)} {
    grid-template-columns: 204px minmax(0, 1fr);
  }
`;

export const StyledNoteImage = styled.div`
  position: relative;
  line-height: 0;
  max-width: 204px;
  width: 100%;
  margin: 0 auto;

  ${mQ(bp.desktop)} {
    max-width: 100%;
    margin: 0;
  }

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;