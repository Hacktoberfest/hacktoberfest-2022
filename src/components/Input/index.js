import {
  StyledInputLabel,
  StyledInput,
  StyledInputContainer,
  StyledInputWrapper,
  StyledError,
} from './Input.styles';

const Input = ({
  name,
  label,
  labelSize,
  error,
  type = 'text',
  required = false,
  ...input
}) => (
  <StyledInputWrapper>
    <StyledInputContainer $hasError={!!error}>
      <StyledInputLabel $size={labelSize} htmlFor={name}>
        {label} {required && <span>[Required]</span>}
      </StyledInputLabel>
      <StyledInput
        id={name}
        name={name}
        type={type}
        required={required}
        {...input}
      />
    </StyledInputContainer>
    {error && <StyledError>{error}</StyledError>}
  </StyledInputWrapper>
);

export default Input;
