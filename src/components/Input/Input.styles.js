import styled from 'styled-components';

import { textBase, textSm } from 'themes/typography';

export const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors2025.eastBay};
    transition: opacity 300ms ease-in-out;
  }

  &::before {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors2025.blueViolet} 0%,
      ${({ theme }) => theme.colors2025.melrose} 100%
    );
    opacity: 0;
  }

  &::after {
    background-color: ${({ theme }) => theme.colors2025.eastBay};
  }

  &:has(input:hover, input:focus-visible) {
    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 0;
    }
  }

  &:has(input:user-invalid:not(:placeholder-shown)) {
    &::after {
      background-color: ${({ theme }) => theme.colors2025.error};
    }
  }
`;

export const StyledInput = styled.input`
  ${textBase}
  background: transparent;
  border: 0;
  color: ${({ theme }) => theme.colors2025.space.white};
  margin: 0;
  padding: 8px 0;
  width: 100%;

  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors2025.blueViolet};
  }
`;

export const StyledInputLabel = styled.label`
  ${textSm};
  color: ${({ theme }) => theme.colors2025.space.white};
  display: block;

  span {
    color: ${({ theme }) => theme.colors2025.error};
  }
`;
