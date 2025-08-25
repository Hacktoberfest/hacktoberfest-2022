import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledContentSide = styled.div`
  align-items: flex-start;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ $size }) => ($size === 'small' ? '16px' : '24px')};

  ${mQ(bp.desktop)} {
    ${({ $align }) => $align === 'center' && 'align-items: center;'}
    grid-template-columns: minmax(auto, ${({ $size, $isEqual }) =>
      $size === 'small' ? 0 : `${$isEqual ? '1fr' : '400px'}`}) 1fr;
    gap: ${({ $size }) => ($size === 'small' ? '16px' : '48px')};
  }
`;
