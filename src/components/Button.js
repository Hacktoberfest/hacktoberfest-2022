import styled, { css } from 'styled-components';

import { colors, fonts } from 'styles/tokens';

/* The site's one button. The client-rendered surfaces (everything under
   /my, /activities/, /fests/ and /schedule/) cannot use a styled-component,
   so src/styles/buttons.css restates these values as global classes; a
   change here is a change there. */
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

  /* The card size: the same button, shrunk to sit inside a card without
     outweighing the card's own border. Mirrored in src/styles/buttons.css
     as .hf-button--small for the client-rendered surfaces. */
  ${(props) =>
    props.$size === 'small' &&
    css`
      min-height: 40px;
      padding: 8px 14px;
      font-size: 0.78rem;
      box-shadow: 4px 4px 0 ${colors.maroon};

      &:hover {
        box-shadow: 2px 2px 0 ${colors.maroon};
      }
    `}

  /* The quieter ask on a light ground: white, the same border and
     shadow. Mirrored as .hf-button--outline in src/styles/buttons.css. */
  ${(props) =>
    props.$variant === 'outline' &&
    css`
      background: ${colors.white};

      &:hover {
        background: ${colors.paperDeep};
      }
    `}

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
