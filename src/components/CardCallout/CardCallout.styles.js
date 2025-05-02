import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body16, body20, textBase, textXl } from 'themes/typography';

export const StyledCardCallout = styled.div`
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors2025.eastBay};
`;

export const StyledCardCalloutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 40px 40px 40px;
  position: relative;
`;

export const StyledCardCalloutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;

  > img {
    width: 48px;
    height: 48px;
    filter: drop-shadow(
      0px 0px 10px
        rgb(from ${({ theme }) => theme.colors2025.melrose} r g b / 0.65)
    );
  }
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
