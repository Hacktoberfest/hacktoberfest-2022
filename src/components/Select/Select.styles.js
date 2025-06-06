import styled from 'styled-components';
import { textBase, textSm } from 'themes/typography';

export const StyledInputContainer = styled.div`
  position: relative;
`;

export const StyledSelect = styled.div`
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

  &:has(select:hover, select:focus-visible, select:focus-within) {
    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 0;
    }
  }

  ::picker(select) {
    @supports (appearance: base-select) {
      appearance: base-select;
    }
  }

  select {
    ${textBase};
    appearance: none;
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors2025.space.white};
    padding: 8px 0;
    transition: 0.4s;
    width: 100%;
    outline: 0;
    cursor: pointer;

    @supports (appearance: base-select) {
      appearance: base-select;
    }

    &::picker-icon {
      content: '';
      background-image: url("data:image/svg+xml,%3Csvg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.82666 8.51074L10.2461 12.9302L11.13 12.0463L6.71054 7.62686L5.82666 8.51074Z' fill='%23F2F4F7'/%3E%3Cpath d='M10.2461 12.9307L14.6655 8.51125L13.7816 7.62736L9.36221 12.0468L10.2461 12.9307Z' fill='%23F2F4F7'/%3E%3C/svg%3E");
      width: 21px;
      height: 21px;
      transition: 0.4s rotate;
    }

    &:open::picker-icon {
      rotate: 180deg;
    }

    &:has(option:checked:disabled) {
      color: ${({ theme }) => theme.colors2025.blueViolet};
    }
  }

  ::picker(select) {
    border: 1px solid ${({ theme }) => theme.colors2025.eastBay};
    border-radius: 16px;
    background: ${({ theme }) => theme.colors2025.void};
    opacity: 0;
    transition: all 0.4s allow-discrete;
    left: 0;
    top: calc(anchor(bottom) + 12px);
    max-height: 260px;
  }

  option {
    ${textBase};
    border-bottom: 1px solid ${({ theme }) => theme.colors2025.eastBay};
    color: ${({ theme }) => theme.colors2025.space.dust};
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 12px;
    position: relative;
    transition: 0.4s;

    &:last-child {
      border-bottom: none;
    }

    &:hover,
    &:focus {
      background: rgb(
        from ${({ theme }) => theme.colors2025.melrose} r g b / 0.08
      );
      color: ${({ theme }) => theme.colors2025.space.white};
    }

    &:checked {
      background-color: ${({ theme }) => theme.colors2025.eastBay};
      color: ${({ theme }) => theme.colors2025.space.white};
    }

    svg {
      flex-shrink: 0;
    }
  }

  option::checkmark {
    order: 1;
    content: '';
    position: absolute;
    top: 50%;
    right: 24px;
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors2025.eastBay};
    transform: translateY(-50%);
    border-radius: 50%;
    opacity: 0;
  }

  ::picker(select):popover-open {
    opacity: 1;
  }

  @starting-style {
    ::picker(select):popover-open {
      opacity: 0;
    }
  }
  ::picker(select) {
  }
`;

export const StyledSelectLabel = styled.label`
  ${textSm};
  color: ${({ theme }) => theme.colors2025.space.white};
  display: block;

  span {
    color: ${({ theme }) => theme.colors2025.error};
  }
`;
