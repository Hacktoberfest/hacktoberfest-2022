import styled from 'styled-components';

export const StyledContainer = styled.div`
  margin: 0 auto;
  max-width: ${({ $isInner }) => ($isInner ? '864px' : '100%')};
`;
