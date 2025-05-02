import {
  StyledInputContainer,
  StyledSelectLabel,
  StyledSelect,
} from './Select.styles';

const Select = ({ name, label, items, placeholder, required, ...select }) => (
  <StyledInputContainer>
    <StyledSelectLabel htmlFor={name}>
      {label} {required && <span>*</span>}
    </StyledSelectLabel>
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
