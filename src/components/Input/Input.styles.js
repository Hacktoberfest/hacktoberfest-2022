import styled from 'styled-components';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body20 } from 'themes/typography';

export const StyledInput = styled.input`
  ${body20};
  background: ${({ theme }) => theme.card.bg};
  backdrop-filter: blur(5px);
  border: 0;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.neutral.manga400};
  color: ${({ theme }) => theme.colors.neutral.manga200};
  margin: 0;
  padding: 12px 24px;
  width: 100%;

  ${mQ(bp.desktop)} {
    border-radius: 16px;
    padding: 16px 24px;
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
`;

export const StyledInputLabel = styled.label`
  ${body20};
  color: ${({ theme }) => theme.colors.neutral.manga300};
  display: block;
  margin: 0 0 8px;
`;
