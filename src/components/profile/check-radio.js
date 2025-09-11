import { Fragment } from 'react';
import styled from 'styled-components';

import { Markdown, MarkdownInline } from '../markdown';
import { body16, body20, textBase, textLg } from 'themes/typography';

const StyledCheckBox = styled.span`
  display: inline-block;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors2025.space.white};
  text-align: center;
  margin: 2px 0 0;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  position: relative;
  user-select: none;
`;

export const StyledLabel = styled.label`
  display: block;
  cursor: pointer;

  &[disabled] {
    cursor: not-allowed;
  }

  > div {
    display: flex;
    align-items: flex-start;
    flex-flow: row nowrap;
    gap: 16px;

    > input {
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.colors2025.space.white};
      appearance: none;
      -webkit-appearance: none;
      margin: 2px 0 0;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      position: relative;
    }

    > input[type='radio'] {
      &:checked::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        background-color: ${({ theme }) => theme.colors2025.lavendar};
        border-radius: 50%;
      }
    }

    > input[type='checkbox'] {
      display: none;

      &:checked {
        + ${StyledCheckBox} {
          background-color: ${({ theme }) => theme.colors2025.lavendar};
          border-color: ${({ theme }) => theme.colors2025.lavendar};

          &::before {
            content: '';
            inset: 0;
            background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7' fill='none'><path d='M9.58317 1.08101V1.49768H9.1665V1.91435H8.74984V2.33101H8.33317V2.74768H7.9165V3.16435H7.49984V3.58101H7.08317V3.99768H6.6665V4.41435H6.24984V4.83101H5.83317V5.24768H5.4165V5.66435H4.99984V6.08101H4.58317V6.49768H4.1665V6.91435H3.33317V6.49768H2.9165V6.08101H2.49984V5.66435H2.08317V5.24768H1.6665V4.83101H1.24984V4.41435H0.833171V3.99768H0.416504V3.58101H0.833171V3.16435H1.24984V2.74768H1.6665V3.16435H2.08317V3.58101H2.49984V3.99768H2.9165V4.41435H3.33317V4.83101H4.1665V4.41435H4.58317V3.99768H4.99984V3.58101H5.4165V3.16435H5.83317V2.74768H6.24984V2.33101H6.6665V1.91435H7.08317V1.49768H7.49984V1.08101H7.9165V0.664347H8.33317V0.247681H8.74984V0.664347H9.1665V1.08101H9.58317Z' fill='white'/></svg>")
              no-repeat center;
            position: absolute;
            top: 47%;
            left: 50%;
            transform: translate(-50%, -50%);
            line-height: 1;
          }
        }
      }
    }
  }

  > p {
    margin: 8px 0 0 !important; // Some section somewhere is using classes to get higher precedence
    padding-left: 32px;
  }

  p {
    a {
      color: ${({ theme }) => theme.colors2025.lavendar};
      text-decoration: underline;
      transition: color 0.2s ease;

      &:hover,
      &:focus {
        text-decoration: none;
      }
    }
  }

  ul {
    list-style-type: disc;
  }
`;

const StyledLabelTitle = styled.p`
  margin: 0 !important; // Some section somewhere is using classes to get higher precedence
  ${textLg};
  color: ${({ theme }) => theme.colors2025.space.white};
  font-weight: 700;

  ${({ $size, $isBasic, theme }) =>
    $size === 'small' &&
    `
    ${textBase};
    ${$isBasic ? `color: ${theme.colors2025.space.dust};` : 'font-weight: 700;'}
  `}
`;

const CheckRadio = ({
  radio,
  title,
  titleSize,
  message,
  disabled = false,
  titleIsBasic = false,
  ...props
}) => {
  return (
    <StyledLabel disabled={disabled}>
      <div>
        <input
          type={radio ? 'radio' : 'checkbox'}
          disabled={disabled}
          {...props}
        />
        {!radio && <StyledCheckBox />}
        {title && (
          <StyledLabelTitle $size={titleSize} $isBasic={titleIsBasic}>
            <MarkdownInline string={title} as={Fragment} forceNewTab />
          </StyledLabelTitle>
        )}
      </div>
      {message && <Markdown string={message} forceNewTab />}
    </StyledLabel>
  );
};

export default CheckRadio;
