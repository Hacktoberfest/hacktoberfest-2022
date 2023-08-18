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

  p,
  li {
    ${({ $size }) => $size === 'xl' && body24};
    ${({ $size }) => $size === 'lg' && body24};
    ${({ $size }) => $size === 'md' && body20};
    ${({ $size }) => $size === 'sm' && body16};
  }

  p {
    margin: 0 0 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    display: flex;
    gap: 16px;
    flex-direction: column;
    list-style-type: disc;
    padding-left: 20px;
  }

  li > ul {
    margin-top: 16px;
  }

  strong {
    color: ${({ theme }) => theme.colors.bavarian.gold200};
    font-weight: 700;
  }

  a {
    color: ${({ theme }) => theme.colors.bavarian.blue200};
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover {
      color: ${({ theme }) => theme.colors.bavarian.blue200};
      text-decoration: none;
    }
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

export const StyledContentMasterList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;

  ${({ $columns }) => $columns === '2' ? `
    display: flex;
    flex-direction: column;
    gap: 16px;
    ${mQ(bp.desktop)} {
      display: block;
      column-count: 2;
      column-gap: 64px;
    }
  `: `
    display: flex;
    flex-direction: column;
    gap: 16px;
  `};

  li {
    ${body20};
    color: ${({ theme }) => theme.colors.neutral.manga300};
  }

  strong {
    color: ${({ theme }) => theme.colors.bavarian.gold200};
    font-weight: 700;
  }

  a {
    color: ${({ theme }) => theme.colors.bavarian.blue200};
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover {
      color: ${({ theme }) => theme.colors.bavarian.blue200};
      text-decoration: none;
    }
  }
`;