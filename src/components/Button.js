import styled, { css } from 'styled-components';

import { colors, fonts } from 'styles/tokens';

export const buttonStyles = css`
  appearance: none;
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  padding: 12px 22px;
  color: ${colors.ink};
  border: 2px solid ${colors.ink};
  background: ${colors.pink};
  box-shadow: 5px 5px 0 ${colors.maroon};
  cursor: pointer;
  font-family: ${fonts.mono};
  font-size: 0.85rem;
  font-weight: 650;
  letter-spacing: 0.02em;
  line-height: 1.1;
  text-align: center;
  text-decoration: none;
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 3px 3px 0 ${colors.maroon};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 5px ${colors.ink};
  }

  ${(props) =>
    props.$variant === 'secondary' &&
    css`
      color: ${colors.white};
      border-color: rgba(255, 255, 255, 0.72);
      background: transparent;
      /* Same offset as the primary, but in the deep green the hero's partner
         chips already shadow with — present without competing. */
      box-shadow: 5px 5px 0 ${colors.forestDeep};

      &:hover {
        color: ${colors.ink};
        background: ${colors.white};
        box-shadow: 3px 3px 0 ${colors.forestDeep};
      }
    `}
`;

const Button = styled.a`
  ${buttonStyles}
`;

export default Button;
