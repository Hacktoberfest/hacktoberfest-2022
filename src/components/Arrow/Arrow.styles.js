import styled from 'styled-components';

export const StyledArrow = styled.div`
  display: flex;
  gap: 16px;
  filter: drop-shadow(1px 1px 10px rgba(236, 66, 55, 0.50)) drop-shadow(-1px -1px 10px rgba(255, 251, 164, 0.50));
  color: ${({$color}) => $color };
`;