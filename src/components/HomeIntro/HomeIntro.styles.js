import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { headline56 } from 'themes/typography';

export const StyledHomeIntro = styled.div`
  background-color: ${({ theme }) => theme.colors.darkGreen};
  color: ${({ theme }) => theme.colors.typography};
  display: flex;
  flex-direction: column;
  gap: 42px;
  padding: 70px 0 0;
  position: relative;

  ${mQ(bp.desktop)} {
    padding: 140px 0 0;
  }

  > img {
    position: absolute;
    top: 50%;
    left: 0;
    transform: rotate(90deg) translateX(-100%);
    transform-origin: 0 100%;
    display: none;

    ${mQ(bp.desktop)} {
      display: block;
    }
  }
`;

export const StyledHomeIntroContainer = styled.div`
  max-width: 1328px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;
  display: grid;
  gap: 64px;
  grid-template-columns: 1fr;

  ${mQ(bp.desktop)} {
    grid-template-columns: 1fr calc((608 / 1280) * 100%);
  }
`;

export const StyledHomeIntroContent = styled.div`
  ${mQ(bp.desktop)} {
    max-width: 474px;
    margin-left: auto;
  }

  h2 {
    ${headline56};
  }
`;

export const StyledHomeIntroCallout = styled.div`
  color: ${({ theme }) => theme.colors.black};
`;

export const StyledSloth = styled.div`
  max-width: 1146px;
  margin-left: auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: flex-end;
  grid-column: 1/-1;

  > * {
    grid-row: 1/-1;
    grid-column: 1/-1;
  }

  img {
    height: auto;
  }

  > img:nth-child(1) {
    padding: 20px 0;
    width: 100%;
    display: none;

    ${mQ(bp.tablet)} {
      display: block;
    }
  }

  > img:nth-child(2) {
    width: 100%;

    ${mQ(bp.tablet)} {
      width: 45.37521815%;
    }
  }
`;
