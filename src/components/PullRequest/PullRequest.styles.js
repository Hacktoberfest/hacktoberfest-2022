import styled from 'styled-components';
import { body20, headline20 } from 'themes/typography';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

const stateColors = {
  excluded: (theme) => theme.colors.bavarian.blue200,
  spam: (theme) => theme.colors.bavarian.red200,
  'not-participating': (theme) => theme.colors.bavarian.blue100,
  invalid: (theme) => theme.colors.bavarian.red200,
  'not-accepted': (theme) => theme.colors.bavarian.red200,
  waiting: (theme) => theme.colors.bavarian.gold200,
  accepted: (theme) => theme.colors.bavarian.gold100,
};

export const StyledState = styled.button`
  width: 36px;
  height: 36px;
  position: relative;
  transition: 0.2s;
  cursor: pointer;
  border-radius: 6px;
  color: ${({theme}) => theme.colors.neutral.manga300};
  box-shadow: inset 0 0 0 1px ${({theme}) => theme.colors.neutral.manga400};
  background: transparent;

  &:hover,
  &:focus {
    background: ${({theme}) => theme.colors.neutral.manga400};
  }

  div {
    background: ${({theme}) => theme.colors.neutral.manga200};
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
      color: ${({theme}) => theme.colors.neutral.manga300};
      background: ${({theme}) => theme.colors.neutral.void200};
      transition: 0.2s ease;
      opacity: .5;
    }

    &:hover {
      &:after {
        opacity: 1;
      }
    }

    p {
      color: ${({theme}) => theme.colors.neutral.void200};

      a {
        color: ${({theme}) => theme.colors.bavarian.gold300};
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
  border-radius: 8px;
  color: ${({theme}) => theme.colors.neutral.void200};
  font-size: 14px;
  font-weight: 600;
  line-height: 1.7142857143;
  padding: 6px 14px;
  text-transform: uppercase;
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
  color: ${({theme}) => theme.colors.neutral.manga200};
  flex-basis: 0;
  flex-grow: 1;
  ${headline20};
`;

export const StyledPRMR = styled.p`
  color: ${({theme}) => theme.colors.neutral.manga200};
  flex-basis: 0;
  flex-grow: 1;
  ${body20};
`;

export const StyledPullRequest = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  width: 100%;
  transition: 0.2s ease;

  ${StyledEyebrow} {
    background: ${(props) => stateColors[props.state](props.theme)};
  }
`;