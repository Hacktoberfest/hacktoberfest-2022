import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import {
  body16,
  body18,
  body20,
  headline1,
  headline2,
  headline3,
  headline4,
  headline5,
  textBase,
  textLg,
  textSm,
  textXl,
} from 'themes/typography';

export const StyledContentMasterTitleRow = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;

  img {
    height: 24px;
    width: 24px;
  }

  ${mQ(bp.desktop)} {
    gap: 16px;

    img {
      height: 24px;
      width: 24px;
    }
  }
`;

export const StyledContentMaster = styled.div`
  position: relative;
  display: flex;
  gap: 16px;
  flex-direction: column;
  text-align: ${({ $mobileAlign }) => $mobileAlign};

  ${mQ(bp.desktop)} {
    text-align: ${({ $align }) => $align};

    ${StyledContentMasterTitleRow} {
      justify-content: ${({ $align }) => $align};
    }
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const StyledContentMasterHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledContentMasterEyebrow = styled.p`
  ${textSm};
  text-transform: uppercase;
  margin: 0;

  ${({ $bold, theme }) =>
    $bold &&
    `
    ${body16};
    color: ${theme.colors2025.space.white};
    font-family: 'Atkinson Hyperlegible Mono';
    font-weight: 700;
    margin-bottom: 8px;
    
    ${mQ(bp.desktop)} {
      ${body18};
      font-weight: 700;
    }
  `}
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
    ${({ $size }) => $size === 'xl2' && textLg};
    ${({ $size }) => $size === 'xl' && textXl};

    ${({ $color }) => $color && `color: ${$color};`}
  }

  ul > li::marker {
    color: ${({ theme }) => theme.colors2025.melrose};
    font-size: 20px;
  }

  p {
    margin: 0 0 1lh;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ul,
  ol {
    display: flex;
    gap: 16px;
    flex-direction: column;
    padding-left: 20px;
    margin: 0;
  }

  ul {
    list-style-type: square;
  }

  ol ol {
    display: inline-flex;
    flex-direction: column;
    gap: 1rem;
    list-style-type: lower-alpha;
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
  margin-top: 16px;
  padding: 0;
  text-align: left;

  ${mQ(bp.desktop)} {
    text-align: center;
  }
`;

export const StyledContentMasterList = styled.ul`
  list-style-type: square;
  padding-left: 20px;
  margin: 0;

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
      
      li {
        margin-bottom: 16px;
      }
      
      li:nth-child(4), li:last-child {
        margin-bottom: 0;
      }
    }
  `
      : `
    display: flex;
    flex-direction: column;
    gap: 16px;
  `};

  li {
    ${body16}
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
