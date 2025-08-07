import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import {
  body16,
  body20,
  headline1,
  headline2,
  headline3,
  headline4,
  headline5,
  textBase,
  textLg,
  textXl,
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
  ${({ $size }) => ($size === 'xl' || $size === 'lg') && body20};
  ${({ $size }) => ($size === 'md' || $size === 'sm') && body16};
`;

export const StyledContentMasterTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors2025.space.white};
  text-shadow: 0px 0px 10px
    rgb(from ${({ theme }) => theme.colors2025.space.dust} r g b / 0.5);

  ${({ $size }) => $size === 'xl2' && headline1};
  ${({ $size }) => $size === 'xl' && headline2};
  ${({ $size }) => $size === 'lg' && headline3};
  ${({ $size }) => $size === 'md' && headline4};
  ${({ $size }) => $size === 'sm' && headline5};
`;

export const StyledContentMasterBody = styled.div`
  p,
  li {
    ${textBase}

    ${mQ(bp.desktop)} {
      ${({ $size }) => $size === 'xl2' && textLg};
      ${({ $size }) => $size === 'xl' && textXl};
    }
  }

  p {
    margin: 0 0 1lh;

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
    color: ${({ theme }) => theme.colors2025.lavendar};
    text-decoration: underline;
    text-underline-offset: 4px;
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
    ${body16}

    ${mQ(bp.desktop)} {
      ${body20}
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
