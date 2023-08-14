import styled, {css} from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import { body16, body20, body24, headline20, headline32, headline48, headline56 } from 'themes/typography';

export const StyledContentMaster = styled.div`
  position: relative;
  display: flex;
  gap: 24px;
  flex-direction: column;
  text-align: ${({ $align }) => $align};

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const StyledContentMasterHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledContentMasterEyebrow = styled.p`
  color: ${({ theme }) => theme.colors.bavarian.red200};
  font-weight: 600;
  text-transform: uppercase;

  ${({ $size }) => ($size === 'xl' || $size === 'lg') && body20};
  ${({ $size }) => ($size === 'md' || $size === 'sm') && body16};
`;

export const StyledContentMasterTitle = styled.h2`
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral.manga200};
  margin: 0;

  ${({ $size }) => $size === 'xl' && headline56};
  ${({ $size }) => $size === 'lg' && headline48};
  ${({ $size }) => $size === 'md' && headline32};
  ${({ $size }) => $size === 'sm' && headline20};
`;

export const StyledContentMasterBody = styled.div`
  color: ${({ theme }) => theme.colors.neutral.manga300};

  p {
    margin: 0 0 24px;

    &:last-child {
      margin-bottom: 0;
    }

    ${({ $size }) => $size === 'xl' && body24};
    ${({ $size }) => $size === 'lg' && body24};
    ${({ $size }) => $size === 'md' && body20};
    ${({ $size }) => $size === 'sm' && body16};
  }
`;

export const StyledContentMasterLinks = styled.ul`
  margin: 0;
  padding: 24px 0 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledContentMasterCta = styled.div`
  padding: 24px 0 0;
`;