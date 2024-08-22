import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body24, headline90 } from 'themes/typography';

export const StyledHero = styled.div`
  text-align: center;
  padding: 216px 0 140px;
  background-color: ${({ theme }) => theme.colors.green};
`;

export const StyledHeroContainer = styled.div`
  max-width: 1266px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const StyledHeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
`;

export const StyledHeroTitle = styled.h1`
  ${headline90};
  color: ${({ theme }) => theme.colors.darkGreen};
  text-align: center;
`;

export const StyledHeroSubtitle = styled.p`
  ${body24};
  color: ${({ theme }) => theme.colors.darkGreen};
  margin: 0 0 24px;

  strong {
    font-weight: 700;
  }
`;

export const StyledHeroPresented = styled.div``;

export const StyledHeroDivider = styled.div`
  line-height: 0;
  background-color: ${({ theme }) => theme.colors.green};

  svg {
    transform: translateY(1px) translateX(calc((259 / 375) * -100vw));
    width: calc((800 / 375) * 100%);
    height: auto;

    ${mQ(bp.tablet)} {
      width: 100%;
      transform: translateY(1px);
    }
  }
`;
