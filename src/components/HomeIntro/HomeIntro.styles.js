import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledHomeIntro = styled.div`
  padding: 80px 0;

  ${mQ(bp.desktop)} {
    padding: 32px 0 144px;
  }
`;

export const StyledHomeIntroContainer = styled.div`
  align-items: flex-start;
  display: flex;
  margin: 0 0 48px;
  flex-direction: column;

  ${mQ(bp.desktop)} {
    flex-direction: row;
  }

  > *:first-child {
    display: none;

    ${mQ(bp.desktop)} {
      display: block;
      margin-right: ${(146 / 1280) * 100}%;
    }
  }

  > *:last-child {
    ${mQ(bp.desktop - 1, 'max')} {
      order: -1;
      margin: 0 auto 48px;
    }

    ${mQ(bp.desktop)} {
      margin-left: auto;
    }
  }
`;

export const StyledHomeIntroContent = styled.div`
  ${mQ(bp.desktop)} {
    max-width: 608px;
  }
`;
export const StyledHomeIntroCallout = styled.div`
  ${mQ(bp.desktop)} {
    max-width: 608px;
    margin-left: auto;
  }
`;
