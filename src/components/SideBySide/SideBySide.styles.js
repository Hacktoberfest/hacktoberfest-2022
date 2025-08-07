import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import ContentMaster from '../ContentMaster';

export const StyledSideBySide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;

  ${mQ(bp.desktop)} {
    flex-direction: row;
  }
`;

export const StyledContentMaster = styled(ContentMaster)`
  flex-shrink: 0;
  width: 100%;

  ${({ $size }) => $size === 'small' && 'width: 304px;'};

  ${({ $size }) => $size === 'medium' && 'width: 416px;'};
`;

export const StyledContent = styled.div``;
