import { StyledInputLabel, StyledInput } from './Input.styles';

const Input = (props) => {
  const { name, label, type = 'text', ...input } = props;

  return (
    <div>
      <StyledInputLabel htmlFor={name}>{label}</StyledInputLabel>
      <StyledInput id={name} name={name} type={type} {...input} />
    </div>
  );
};

export default Input;
