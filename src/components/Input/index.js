import { StyledInputLabel, StyledInput } from './Input.styles';

const Input = (props) => {
  const { name, label, type = 'text', isDark, ...input } = props;

  return (
    <div>
      <StyledInputLabel htmlFor={name}>{label}</StyledInputLabel>
      <StyledInput
        id={name}
        name={name}
        type={type}
        $isDark={isDark}
        {...input}
      />
    </div>
  );
};

export default Input;
