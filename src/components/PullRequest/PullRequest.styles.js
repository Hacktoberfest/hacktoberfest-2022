import styled from 'styled-components';
import { body16, body20, textLg, textSm } from 'themes/typography';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import ButtonMain from 'components/ButtonMain';
import CustomLink from '../CustomLink';

const stateColors = {
  excluded: (theme) => theme.colors2025.blueViolet,
  spam: (theme) => theme.colors2025.dragonfruit,
  'not-participating': (theme) => theme.colors2025.space.haze,
  invalid: (theme) => theme.colors2025.orange,
  'not-accepted': (theme) => theme.colors2025.error,
  waiting: (theme) => theme.colors2025.lake1,
  accepted: (theme) => theme.colors2025.green2,
};

export const StyledState = styled.button`
  ${textSm};
  font-family: 'Atkinson Hyperlegible Mono';
  font-weight: 700;
  position: relative;
  transition: 0.2s;
  cursor: pointer;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors2025.space.white};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors2025.eastBay};
  padding: 8px 12px;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.black};
    color: ${({ theme }) => theme.colors.typography};
  }

  div {
    background: ${({ theme }) => theme.colors.black};
    color: ${({ theme }) => theme.colors.typography};
    display: none;
    width: 600px;
    z-index: 100;
    padding: 16px 48px 16px 24px;
    border-radius: 6px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: left;

    &:after {
      content: 'x';
      position: absolute;
      text-align: center;
      top: 8px;
      right: 8px;
      line-height: 30px;
      border-radius: 4px;
      width: 32px;
      height: 32px;
      color: ${({ theme }) => theme.colors.typography};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.typography};
      transition: 0.2s ease;
      opacity: 0.5;
    }

    &:hover {
      &:after {
        opacity: 1;
      }
    }

    p {
      a {
        color: ${({ theme }) => theme.colors.pink};
        text-decoration: underline;

        &:hover,
        &:focus {
          text-decoration: none;
        }
      }
    }
  }

  &[aria-selected='true'] {
    opacity: 1;

    div {
      display: block;
    }
  }

  @media (max-width: 550px) {
    position: static;

    div {
      top: 48px;
      width: 100%;
    }
  }
`;

export const StyledEyebrowWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  gap: 12px;
`;

export const StyledEyebrow = styled.p`
  ${textSm};
  text-transform: uppercase;
  font-weight: 700;
  color: ${({ theme }) => theme.colors2025.space.white};
  border-radius: 8px;
  font-variant-numeric: tabular-nums;
  padding: 8px 12px;
  margin: 0;
`;

export const StyledInfo = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 16px;

  ${mQ(bp.tablet)} {
    gap: 32px;
    flex-direction: row;
  }
`;

export const StyledTitle = styled.h3`
  flex-basis: 0;
  flex-grow: 1;
  ${textLg};
  color: ${({ theme }) => theme.colors2025.space.white};
  font-weight: 700;
  margin: 0;
`;

export const StyledDetails = styled.p`
  flex-basis: 0;
  flex-grow: 1;
  margin: 0;
  color: ${({ theme }) => theme.colors2025.space.white};
`;

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  width: 100%;

  ${mQ(bp.desktop)} {
    gap: 32px;
  }

  ${StyledEyebrow} {
    background: ${({ $state, theme }) => stateColors[$state](theme)};
  }
`;

export const StyledButton = styled(CustomLink)`
  line-height: 30px;
  white-space: nowrap;
  align-self: flex-start;

  ${mQ(bp.tablet)} {
    align-self: flex-end;
  }
`;

export const StyledPullRequest = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${mQ(bp.tablet)} {
    gap: 64px;
    flex-direction: row;
  }
`;
