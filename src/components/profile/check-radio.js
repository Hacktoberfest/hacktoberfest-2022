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
      margin: 2px 0 0;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
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

  ${({ $size, theme }) =>
    $size === 'small' &&
    `
    ${textBase};
    color: ${theme.colors2025.space.dust};
  `}
`;

const CheckRadio = ({
  radio,
  title,
  titleSize,
  message,
  disabled = false,
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
          <StyledLabelTitle $size={titleSize}>
            <MarkdownInline string={title} as={Fragment} forceNewTab />
          </StyledLabelTitle>
        )}
      </div>
      {message && <Markdown string={message} forceNewTab />}
    </StyledLabel>
  );
};

export default CheckRadio;
