import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { textBase, textXl } from 'themes/typography';

export const StyledCardCallout = styled.div`
  background: linear-gradient(
    180deg,
    rgb(from ${({ theme }) => theme.colors2025.void} r g b / 0) 0%,
    rgb(from ${({ theme }) => theme.colors2025.blueViolet} r g b / 0.15) 100%
  );
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors2025.eastBay};
  display: flex;
`;

export const StyledCardCalloutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px;
  position: relative;
  width: calc(100% - 64px);

  ${mQ(bp.tablet)} {
    padding: 40px;
    width: calc(100% - 80px);
  }
`;

export const StyledCardCalloutWrapContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${({ $bodyGap }) => $bodyGap === 'xl' && 'gap: 64px;'}

  ${mQ(bp.tablet)} {
    ${({ $bodyGap }) => $bodyGap === 'xl' && 'gap: 80px;'}
    ${({ $bodyGap }) => $bodyGap === 'lg' && 'gap: 40px;'}
  }
`;

export const StyledCardCalloutWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  > img {
    width: 48px;
    height: 48px;
    filter: drop-shadow(
      0px 0px 4px
        rgb(from ${({ theme }) => theme.colors2025.melrose} r g b / 0.65)
    );
  }
`;

export const StyledCardCalloutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
`;

export const StyledCardCalloutTitle = styled.h2`
  ${textXl};
  margin: 0;
  font-weight: 700;
  color: ${({ theme }) => theme.colors2025.space.white};
`;

export const StyledCardCalloutBody = styled.div`
  ${textBase};

  margin: 0;
  width: 100%;

  ${({ $smallBody }) => $smallBody && 'max-width: 752px;'}
  a {
    position: relative;
    color: ${({ theme }) => theme.colors2025.lavendar};

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: ${({ theme }) => theme.colors2025.lavendar};
      bottom: 0;
      left: 0;
      transform-origin: right;
      transform: scaleX(0);
      transition: transform 0.3s ease-in-out;
    }

    &:hover::before {
      transform-origin: left;
      transform: scaleX(1);
    }
  }
`;

export const StyledCardCalloutLink = styled.div`
  margin-top: auto;
`;
