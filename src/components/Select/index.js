import { StyledInputContainer, StyledSelect } from './Select.styles';
import { StyledInputLabel } from '../Input/Input.styles';

const Select = ({
  name,
  label,
  labelSize,
  items,
  placeholder,
  required,
  ...select
}) => (
  <StyledInputContainer>
    {label && (
      <StyledInputLabel $size={labelSize} htmlFor={name}>
        {label} {required && <span>[Required]</span>}
      </StyledInputLabel>
    )}
    <StyledSelect>
      <select id={name} name={name} required={required} {...select}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {items.map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </StyledSelect>
  </StyledInputContainer>
);

export default Select;
