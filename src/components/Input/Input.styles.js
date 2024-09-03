import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body20, body24 } from 'themes/typography';

export const StyledInput = styled.input`
  ${body20}
  background: transparent;
  border: 1px solid currentColor;
  color: currentColor;
  font-weight: 500;
  margin: 0;
  padding: 12px 24px;
  width: 100%;

  ${mQ(bp.desktop)} {
    padding: 16px 24px;
  }

  &:focus {
    outline: 0;
  }

  &:focus-visible {
    outline: 0;
    box-shadow: ${({ theme }) =>
      `-1px -1px 10px 0px ${theme.colors.deepPink}, 1px 1px 10px 0px ${theme.colors.deepPink}`};
    color: ${({ theme }) => theme.colors.deepPink};
  }

  &:user-invalid:not(:placeholder-shown) {
    box-shadow: ${({ theme }) =>
      `-1px -1px 10px 0px ${theme.colors.error}, 1px 1px 10px 0px ${theme.colors.error}`};
    border-color: ${({ theme }) => theme.colors.error};
  }

  &::placeholder {
    color: currentColor;
  }

  &::-webkit-calendar-picker-indicator {
    ${({ $isDark }) =>
      $isDark &&
      `
      filter: invert(1);
    `}
  }
`;

export const StyledInputLabel = styled.label`
  ${body24}
  color: currentColor;
  font-weight: 500;
  display: block;
  margin: 0 0 8px;
`;
