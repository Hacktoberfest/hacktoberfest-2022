import { Fragment } from 'react';
import styled from 'styled-components';

import { Markdown, MarkdownInline } from '../markdown';
import { body16, body20, textBase, textLg } from 'themes/typography';

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
      border: 1px solid #fff;
      appearance: none;
      margin: 2px 0 0;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      accent-color: ${({ theme }) => theme.colors2025.lavendar};
    }

    > input[type='checkbox'] {
      border-radius: 4px;
    }

    > input:checked {
      appearance: auto;
    }

    > input:hover,
    input:focus {
      accent-color: ${({ theme }) => theme.colors2025.lavendar};
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
