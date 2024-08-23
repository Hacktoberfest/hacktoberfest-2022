import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import {
  body16,
  body20,
  body24,
  headline20,
  headline32,
  headline48,
  headline56,
  headline90,
} from 'themes/typography';

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
  font-weight: 600;
  text-transform: lowercase;

  ${({ $size }) => ($size === 'xl' || $size === 'lg') && body20};
  ${({ $size }) => ($size === 'md' || $size === 'sm') && body16};
`;

export const StyledContentMasterTitle = styled.h2`
  font-weight: 400;
  margin: 0;
  color: ${({ $hasCaret, theme }) =>
    $hasCaret ? theme.colors.cream : 'inherit'};

  strong {
    color: ${({ theme }) => theme.colors.green};
    font-weight: 400;
  }

  ${({ $size }) => $size === 'xl2' && headline90};
  ${({ $size }) => $size === 'xl' && headline56};
  ${({ $size }) => $size === 'lg' && headline48};
  ${({ $size }) => $size === 'md' && headline32};
  ${({ $size }) => $size === 'sm' && headline20};

  ${({ $isTyping, $size }) =>
    $size === 'xl2' &&
    $isTyping &&
    `
    ${mQ(bp.desktop)} {
      line-height: 100px;
    }
  `};
`;

export const StyledContentMasterBody = styled.div`
  p,
  li {
    ${body16};
    ${mQ(bp.desktop)} {
      ${({ $size }) => $size === 'xl2' && body24};
      ${({ $size }) => $size === 'xl' && body20};
      ${({ $size }) => $size === 'lg' && body24};
      ${({ $size }) => $size === 'md' && body20};
      ${({ $size }) => $size === 'sm' && body16};
    }
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
    font-weight: 700;
  }

  a {
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover {
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
  padding: 0;
`;

export const StyledContentMasterList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;

  ${({ $columns }) =>
    $columns === '2'
      ? `
    display: flex;
    flex-direction: column;
    gap: 16px;
    ${mQ(bp.desktop)} {
      display: block;
      column-count: 2;
      column-gap: 64px;
    }
  `
      : `
    display: flex;
    flex-direction: column;
    gap: 16px;
  `};

  li {
    ${body16};
    ${mQ(bp.desktop)} {
      ${body20};
    }
  }

  strong {
    font-weight: 700;
  }

  a {
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover {
      text-decoration: none;
    }
  }
`;
