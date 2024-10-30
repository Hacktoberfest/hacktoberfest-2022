import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body32, headline90 } from 'themes/typography';
import heroBgTop from 'assets/img/bg-hero-secondary--top.svg';
import heroBgBottom from 'assets/img/bg-hero-secondary--bottom.svg';

export const StyledHeroSecondary = styled.div`
  background: ${({ theme }) => theme.colors.darkGreen};
  overflow: hidden;
  position: relative;

  &::before,
  &::after {
    content: '';
    display: none;
    position: absolute;
    left: 0;
    width: 100%;
    height: calc((200 / 1440) * 100vw);

    ${mQ(bp.tablet)} {
      display: block;
    }
  }

  &::before {
    top: 0;
    background: url('${heroBgTop.src}') no-repeat;
    background-size: 100% auto;
  }

  &::after {
    bottom: calc((70 / 1440) * -100vw);
    background: url('${heroBgBottom.src}') no-repeat;
    background-size: 100% auto;
  }
`;

export const StyledHeroSecondaryContainer = styled.div`
  display: flex;
  gap: 40px;
  flex-direction: column;
  align-items: center;
  padding: 144px 0 138px;
  justify-content: ${({ $hasIcon }) => ($hasIcon ? 'space-between' : 'center')};
  text-align: ${({ $hasIcon }) => ($hasIcon ? 'left' : 'center')};

  ${mQ(bp.desktop)} {
    flex-direction: ${({ $reverse }) => ($reverse ? 'row-reverse' : 'row')};
    gap: 64px;
    padding: ${({ $hasIcon }) => ($hasIcon ? '190px 0 50px' : '288px 0 148px')};
  }
`;

export const StyledHeroSecondaryContent = styled.div`
  max-width: ${({ $hasIcon }) => ($hasIcon ? '768px' : '1240px')};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
  z-index: 5;

  ${mQ(bp.desktop)} {
    align-items: ${({ $hasIcon }) => ($hasIcon ? 'flex-start' : 'center')};
  }
`;

export const StyledHeroSecondaryTitle = styled.h1`
  ${body32}
  color: ${({ theme }) => theme.colors.typography};
  text-align: center;

  ${mQ(bp.desktop)} {
    ${headline90}
  }

  &::before {
    content: '>';
    color: ${({ theme }) => theme.colors.pink};
  }

  ${mQ(bp.desktop)} {
    text-align: left;
  }
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
