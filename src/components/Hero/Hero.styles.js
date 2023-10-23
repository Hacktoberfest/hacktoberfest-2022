import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import { body16, body20, body24, headline88 } from 'themes/typography';

export const StyledHero = styled.div`
  text-align: center;
  padding: 144px 0 80px;

  ${mQ(bp.desktop)} {
    padding: 224px 0 114px;
    ${({ $centered }) => !$centered && 'text-align: left;'}
  }
`;

export const StyledHeroContainer = styled.div`
  ${mQ(bp.desktop)} {
    display: flex;
    justify-content: ${({ $centered }) => $centered ? 'center' : 'space-between'};
  }
`;

export const StyledHeroContent = styled.div`
  margin-bottom: 64px;

  ${mQ(bp.desktop)} {
    width: 57.96875%;
    margin-bottom: 0;
  }
`;

export const StyledHeroTitle = styled.h1`
  ${headline88};
  color: ${({ theme }) => theme.colors.neutral.manga200};
  margin: 0 0 24px;

  strong {
    color: ${({ theme }) => theme.colors.bavarian.gold200};
  }
`;

export const StyledHeroSubtitle = styled.p`
  ${body24};
  color: ${({ theme }) => theme.colors.neutral.manga300};
  margin: 0 0 24px;

  strong {
    color: ${({ theme }) => theme.colors.bavarian.gold200};
    font-weight: inherit;
  }
`;

export const StyledHeroPresented = styled.div``;

export const StyledHeroCountdown = styled.div`
  text-align: center;

  ${mQ(bp.desktop)} {
    width: 37.03125%;
  }
`;

export const StyledCountdownHeader = styled.div`
  ${body20};
  margin: 0 auto 16px;

  ${mQ(bp.desktop)} {
    margin: 0 auto 24px;
    max-width: 340px;
  }
`;

export const StyledCountdown = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0 0 24px;
`;

export const StyledCountdownItem = styled.div`
  p {
    ${body16};
    color: ${({ theme }) => theme.colors.neutral.manga300};
    font-weight: 600;
    text-transform: uppercase;

    span {
      ${headline88};
      color: ${({ theme }) => theme.colors.neutral.manga200};
      display: block;
    }
  }
`;

export const StyledCountdownLoading = styled.div`
  /* border: 2px dashed ${({ theme }) => theme.colors.bavarian.gold200}; */
  border-radius: 8px;
  box-shadow: 1px 1px 10px 0px rgba(236, 66, 55, 0.50), -1px -1px 10px 0px rgba(255, 251, 164, 0.50);
  padding: 10px;
  margin: 0 0 32px;
  position: relative;

  ${mQ(bp.desktop)} {
    margin: 0 0 48px;
  }
`;

export const StyledCountdownLoadingBorder = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  color: ${({ theme }) => theme.colors.bavarian.gold200};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const StyledCountdownLoadingContainer = styled.div`
  border-radius: 4px;
  display: flex;
  gap: 3px;
  height: 16px;
  overflow: hidden;
`;

export const StyledCountdownLoadingItem = styled.div`
  background: ${({ $complete, theme }) => $complete ? theme.gradients.metal.blueLight : theme.colors.neutral.manga400};
  flex-grow: 1;
  flex-basis: 0;
`;
