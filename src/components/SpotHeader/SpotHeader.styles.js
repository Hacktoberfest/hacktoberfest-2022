import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledSpotHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 64px;
  align-items: center;

  ${mQ(bp.desktop)} {
    grid-template-columns: 340px minmax(0, 1fr);
  }
`;

export const StyledSpotHeaderImage = styled.div`
  position: relative;

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
    object-fit: contain;
  }
`;
