import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { textBase, textXl } from 'themes/typography';

export const StyledCardCallout = styled.div`
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors2025.eastBay};
  display: flex;
`;

export const StyledCardCalloutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 32px 32px 32px;
  position: relative;

  ${mQ(bp.tablet)} {
    padding: 32px 40px 40px 40px;
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
  gap: 8px;
  align-items: flex-start;
`;

export const StyledCardCalloutTitle = styled.h2`
  ${textXl}
  font-weight: 700;
  color: ${({ theme }) => theme.colors2025.space.white};
`;

export const StyledCardCalloutBody = styled.p`
  ${textBase}

  a {
    position: relative;
    display: inline-block;
    color: ${({ theme }) => theme.colors2025.lavendar};
    text-decoration: none;

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
