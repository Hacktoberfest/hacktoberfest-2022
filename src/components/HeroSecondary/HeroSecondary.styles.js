import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body32, headline90 } from 'themes/typography';
import heroBg from 'assets/img/bg-hero-secondary.png';

export const StyledHeroSecondary = styled.div`
  background: ${({ theme }) => theme.colors.darkGreen};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('${heroBg.src}') no-repeat;
    background-size: auto calc(100% + 70px);
    background-position: 0 0;
  }
`;

export const StyledHeroSecondaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-direction: column;
  align-items: center;
  padding: 144px 0 138px;

  ${mQ(bp.desktop)} {
    flex-direction: ${({ $reverse }) => ($reverse ? 'row-reverse' : 'row')};
    gap: 64px;
    padding: 190px 0 50px;
  }
`;

export const StyledHeroSecondaryContent = styled.div`
  max-width: 765px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
  z-index: 5;

  ${mQ(bp.desktop)} {
    align-items: flex-start;
  }
`;

export const StyledHeroSecondaryTitle = styled.h1`
  ${body32};
  color: ${({ theme }) => theme.colors.typography};
  text-align: center;

  ${mQ(bp.desktop)} {
    ${headline90};
  }

  &::before {
    content: '>';
    color: ${({ theme }) => theme.colors.pink};
  }

  ${mQ(bp.desktop)} {
    text-align: left;
  }
`;

export const StyledHeroSecondaryImage = styled.div`
  max-width: 252px;
  margin: 0 auto;
  width: 100%;
  position: relative;

  ${mQ(bp.desktop - 1, 'max')} {
    order: -1;
  }

  ${mQ(bp.desktop)} {
    max-width: 442px;
    margin: 0;
  }

  img {
    width: 100%;
    height: auto;
  }
`;
