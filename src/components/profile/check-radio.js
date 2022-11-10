import { Fragment } from 'react';
import styled from 'styled-components';

import { MarkdownInline } from '../markdown';

export const StyledLabel = styled.label`
  display: block;
  margin: 16px 0;
  cursor: pointer;
  
  &[disabled] {
    cursor: not-allowed;
  }
  
  > div {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    gap: 8px;
    
    > input {
      margin: 0;
    }
    
    > p {
      margin: 0 !important; // Some section somewhere is using classes to get higher precedence
    }
  }
  
  > p {
    margin: 4px 0 0 !important; // Some section somewhere is using classes to get higher precedence
  }
  
  p {
    a {
      text-decoration: underline;
      transition: color 0.2s ease;
    
      &:hover,
      &:focus {
        color: ${(props) => props.theme.surf};
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
        {title && <p><MarkdownInline string={title} as={Fragment} forceNewTab /></p>}
      </div>
      {message && <p><MarkdownInline string={message} as={'i'} forceNewTab /></p>}
    </StyledLabel>
  );
};

export default CheckRadio;
