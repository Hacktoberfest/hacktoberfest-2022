import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body18, body32, headline2, textSm } from 'themes/typography';

export const StyledCountdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${mQ(bp.desktop)} {
    gap: 16px;
  }
`;

export const StyledCountdownHeader = styled.div`
  ${textSm};
  color: ${({ theme }) => theme.colors2025.space.white};
  font-weight: 700;
  text-align: center;
`;

export const StyledCountdown = styled.div`
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors2025.eastBay};
  display: flex;
  gap: 8px;
  margin: 0px auto;
  padding: 10px 16px;
  position: relative;
  width: fit-content;

  ${mQ(bp.desktop)} {
    padding: 16px 32px;
  }
`;

export const StyledCounter = styled.span`
  ${headline2};
  background: ${({ $isActive, theme }) =>
    `linear-gradient(180deg, ${theme.colors2025.void} 0%, rgb(from ${theme.colors2025.blueViolet} r g b / 0.15) 100%)`};
  border: 1px solid
    rgb(from ${({ theme }) => theme.colors2025.space.gray} r g b / 0.25);
  color: ${({ theme }) => theme.colors2025.eastBay};
  display: block;
  font-size: 28px;
  margin-bottom: 10px;
  padding: 9px 14px;

  ${mQ(bp.desktop)} {
    margin-bottom: 16px;
    padding: 16px 24px;
  }
`;

export const StyledCountdownItem = styled.div`
  text-align: center;
  position: relative;

  p {
    font-family: 'Atkinson Hyperlegible Mono';
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    margin: 0;

    ${({ $isActive, theme }) =>
      !$isActive &&
      `
        color: ${theme.colors2025.eastBay};
    `}
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    `
      ${StyledCounter} {
        background: linear-gradient(270deg, #575785 -0.11%, #35356D 99.89%);
        color: ${theme.colors2025.space.white};
        text-shadow: 0px 0px 10px
          rgb(from ${theme.colors2025.space.dust} r g b / 0.5);
      }
    `}
`;

export const StyledSpan = styled.span`
  line-height: 12px;
`;

export const StyledCountdownItemDivider = styled.div`
  ${body18};
  font-weight: 800;
  padding-bottom: 32px;

  ${mQ(bp.desktop)} {
    ${body32};
    font-weight: 800;
  }
`;

export const StyledLoader = styled.div`
  border: 1px solid ${({ theme }) => theme.colors2025.eastBay};
  margin: 0 auto;
  padding: 3px;
  width: 245px;

  ${mQ(bp.desktop)} {
    padding: 6px;
    width: 416px;
  }
`;

export const StyledLoaderContent = styled.div`
  background: linear-gradient(
    270deg,
    #d0cce3 0.85%,
    #575785 16.72%,
    #403f7d 76.82%
  );
  height: 8px;
  mask-image: repeating-linear-gradient(
    90deg,
    #000 0px,
    #000 4px,
    transparent 4px,
    transparent 6px
  );
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  max-width: 100%;
  width: ${({ $progress }) => `${$progress || 0}%`};
  transition: width 1s ease-out;

  ${mQ(bp.desktop)} {
    height: 14px;
    mask-image: repeating-linear-gradient(
      90deg,
      #000 0px,
      #000 8px,
      transparent 8px,
      transparent 12px
    );
  }
`;
