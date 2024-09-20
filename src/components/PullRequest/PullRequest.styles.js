import styled from 'styled-components';
import { body16, body20 } from 'themes/typography';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

const stateColors = {
  excluded: (theme) => theme.colors.black,
  spam: (theme) => theme.colors.deepPink,
  'not-participating': (theme) => theme.colors.black,
  invalid: (theme) => theme.colors.error,
  'not-accepted': (theme) => theme.colors.deepPink,
  waiting: (theme) => theme.colors.lightPink,
  accepted: (theme) => theme.colors.green,
};

export const StyledState = styled.button`
  width: 36px;
  height: 36px;
  position: relative;
  transition: 0.2s;
  cursor: pointer;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.black};
  background: transparent;
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.black};

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
  gap: 8px;
`;

export const StyledEyebrow = styled.p`
  ${body16}
  border-radius: 8px;
  padding: 6px 14px;
`;

export const StyledInfo = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 24px;

  ${mQ(bp.tablet)} {
    gap: 64px;
    flex-direction: row;
  }
`;

export const StyledPRTitle = styled.h3`
  flex-basis: 0;
  flex-grow: 1;
  ${body20}
`;

export const StyledPRMR = styled.p`
  flex-basis: 0;
  flex-grow: 1;
  ${body20}
`;

export const StyledPullRequest = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  width: 100%;
  transition: 0.2s ease;

  ${StyledEyebrow} {
    background: ${({ $state, theme }) => stateColors[$state](theme)};
    color: ${({ $state, theme }) =>
      $state === 'accepted' || $state === 'waiting'
        ? theme.colors.black
        : theme.colors.typography};
  }
`;
