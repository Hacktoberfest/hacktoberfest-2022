import styled, { css, keyframes } from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

export const StyledAvatar = styled.div`
  aspect-ratio: 1;
  border: 1px solid ${({ theme }) => theme.colors2025.eastBay};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  width: 184px;
  height: 184px;
  position: relative;

  ${mQ(bp.tablet)} {
    width: 416px;
    height: 416px;
  }
`;

export const StyledAvatarContainer = styled.div`
  margin: 12px;
  position: relative;
  grid-row: 1/-1;
  grid-column: 1/-1;
  overflow: hidden;
  border-radius: 8px;

  ${mQ(bp.tablet)} {
    margin: 28px;
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

export const StyledGlowBox = styled.div`
  background-color: ${({ theme }) => theme.colors2025.space.white};
  box-shadow: 0 0 9px 0
    rgb(from ${({ theme }) => theme.colors2025.space.white} r g b / 0.8);
  height: 14px;
  width: 14px;
  position: absolute;
  top: 0;
  left: 0;

  &:nth-of-type(2) {
    left: calc(100% - 14px);
  }

  &:nth-of-type(3) {
    top: calc(100% - 14px);
  }

  &:nth-of-type(4) {
    left: calc(100% - 14px);
    top: calc(100% - 14px);
  }
`;
