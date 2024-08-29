import { Fragment } from 'react';
import styled from 'styled-components';

import { MarkdownInline } from '../markdown';
import { body16, body20 } from 'themes/typography';

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
      margin: 7px 0 0;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      accent-color: ${({ theme }) => theme.colors.deepPink};
    }

    > p {
      margin: 0 !important; // Some section somewhere is using classes to get higher precedence
      ${body20}
    }
  }

  > p {
    margin: 8px 0 0 !important; // Some section somewhere is using classes to get higher precedence
    padding-left: 32px;
    ${body16}
  }

  p {
    a {
      text-decoration: underline;
      transition: color 0.2s ease;

      &:hover,
      &:focus {
        text-decoration: none;
      }
    }
  }
`;

const CheckRadio = ({ radio, title, message, disabled = false, ...props }) => {
  return (
    <StyledLabel disabled={disabled}>
      <div>
        <input
          type={radio ? 'radio' : 'checkbox'}
          disabled={disabled}
          {...props}
        />
        {title && (
          <p>
            <MarkdownInline string={title} as={Fragment} forceNewTab />
          </p>
        )}
      </div>
      {message && (
        <p>
          <MarkdownInline string={message} as={'span'} forceNewTab />
        </p>
      )}
    </StyledLabel>
  );
};

export default CheckRadio;
