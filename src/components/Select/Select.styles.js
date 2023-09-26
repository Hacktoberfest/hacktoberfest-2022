import styled from 'styled-components';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import { body20 } from 'themes/typography';

export const StyledSelect = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
    background: url('data:image/svg+xml,<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.50563 10.2556C7.05481 9.70646 7.94519 9.70646 8.49437 10.2556L15 16.7613L21.5056 10.2556C22.0548 9.70646 22.9452 9.70646 23.4944 10.2556C24.0435 10.8048 24.0435 11.6952 23.4944 12.2444L15.9944 19.7444C15.4452 20.2935 14.5548 20.2935 14.0056 19.7444L6.50563 12.2444C5.95646 11.6952 5.95646 10.8048 6.50563 10.2556Z" fill="%23EFEDEF"/></svg>');
    width: 30px;
    height: 30px;
    z-index: 1;
    pointer-events: none;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    background: ${({ theme }) => theme.card.bg};
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &::after,
  select {
    border-radius: 12px;
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.neutral.manga400};

    ${mQ(bp.desktop)} {
      border-radius: 16px;
    }
  }

  select {
    ${body20};
    appearance: none;
    background: ${({ theme }) => theme.colors.neutral.void200};
    backdrop-filter: blur(5px);
    border: 0;
    color: ${({ theme }) => theme.colors.neutral.manga200};
    margin: 0;
    padding: 12px 78px 12px 24px;
    width: 100%;

    ${mQ(bp.desktop)} {
      padding: 16px 78px 16px 24px;
    }

    &:focus {
      outline: 0;
    }

    &:focus-visible {
      outline: 1px solid ${({ theme }) => theme.colors.neutral.manga200};
      outline-offset: -6px;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.neutral.manga300};
    }
  }
`;

export const StyledSelectLabel = styled.label`
  ${body20};
  color: ${({ theme }) => theme.colors.neutral.manga300};
  display: block;
  margin: 0 0 8px;
`;
