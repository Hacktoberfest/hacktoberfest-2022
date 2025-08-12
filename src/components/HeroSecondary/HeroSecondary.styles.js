import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { headline56 } from 'themes/typography';
import bgHero from 'assets/img/bg-header.svg';

export const StyledHeroSecondary = styled.div`
  overflow: hidden;
  padding: 120px 0 64px 0;
  position: relative;

  ${mQ(bp.desktop)} {
    padding-top: 180px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(${bgHero.src}) top center / cover no-repeat;
  }
`;

export const StyledHeroSecondaryContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 28px 0;
  text-align: center;
`;

export const StyledHeroSecondaryContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  z-index: 5;
`;

export const StyledHeroSecondaryTitle = styled.h1`
  ${headline56};
  color: ${({ theme }) => theme.colors.typography};
  font-family: 'Atkinson Hyperlegible Mono';
  font-weight: 800;
  text-align: center;
  text-shadow: 0px 0px 10px
    rgb(from ${({ theme }) => theme.colors2025.space.dust} r g b / 0.5);
`;

export const StyledHeroSecondarybody = styled.div`
  max-width: 694px;
  margin: 0 auto;
  color: white;

  strong {
    color: ${({ theme }) => theme.colors.pink};
  }
`;

export const StyledHeroSecondaryImage = styled.div`
  max-width: 144px;
  margin: 0 auto;
  width: 100%;
  position: relative;

  img {
    width: 100%;
    height: auto;
  }
`;
