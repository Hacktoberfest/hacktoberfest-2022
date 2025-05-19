import {
  StyledInputLabel,
  StyledInput,
  StyledInputContainer,
} from './Input.styles';

const Input = ({ name, label, type = 'text', required = false, ...input }) => (
  <StyledInputContainer>
    <StyledInputLabel htmlFor={name}>
      {label} {required && <span>*</span>}
    </StyledInputLabel>
    <StyledInput
      id={name}
      name={name}
      type={type}
      required={required}
      {...input}
    />
  </StyledInputContainer>
);

export default Input;
