import { forwardRef } from 'react';
import styled from 'styled-components';

import Notification from './notification';

const StyledForm = styled.form`
  fieldset {
    border: 1px solid ${(props) => props.theme.text};
    border-radius: 8px;
    padding: 16px;
    margin: 0 0 16px;
    transition: 0.2s ease border-color;

    &:hover,
    &:focus-within {
      border-color: ${(props) => props.theme.surf};
    }
    
    fieldset {
      padding: 8px 0;
      border-width: 0 0 1px;
      border-radius: 0;
      
      &:last-child {
        border-width: 0;
        margin-bottom: 0;
      }
    }
  }
  
  > fieldset {
    &:hover,
    &:focus-within {
      > label:first-child {
        color: ${(props) => props.theme.surf};
      }
    }
    
    > label:first-child {
      font-size: 1.1em;
      transition: 0.2s ease color;
      
      &::before {
        content: '[';
        margin-right: 1ch;
      }
      
      &::after {
        content: ']';
        margin-left: 1ch;
      }
    }
  }
  
  label {
    display: block;
  }
  
  input,
  select,
  label {
    margin: 0 0 8px;
  }
  
  input,
  select {
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 8px;
    background: ${(props) => props.theme.text};
    color: ${(props) => props.theme.body};
    transition: 0.2s ease background, 0.2s ease border-color;
    
    &:user-invalid {
      background: ${(props) => props.theme.spark};
      border-color: ${(props) => props.theme.spark};
    }

    &::placeholder {
      color: ${(props) => props.theme.body};
    }
  }
  
  input[type='text'],
  input[type='email'],
  select {
    width: 100%;
  }
`;

const Form = forwardRef(({ children, success, error, ...props }, ref) => (
  <StyledForm ref={ref} {...props}>
    {success && (
      <Notification title="Success" color="giga">
        <p>{success}</p>
      </Notification>
    )}

    {error && (
      <Notification title="Error" color="spark">
        <p>{error}</p>
      </Notification>
    )}

    {children}
  </StyledForm>
));

export default Form;
