import { useCallback, useEffect, useState } from 'react';
import {
  StyledSelectLabel,
  StyledSelect
} from './Select.styles';

const Select = props => {
  const {
    name,
    label,
    items,
    ...select
  } = props;

  return (
    <div>
      <StyledSelectLabel htmlFor={name}>{label}</StyledSelectLabel>
      <StyledSelect>
        <select id={name} name={name} {...select}>
          {items.map(([ key, value ]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </StyledSelect>
    </div>
  );
};

export default Select;