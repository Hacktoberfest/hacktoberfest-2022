import styled from 'styled-components';

export const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 0 24px;
  max-width: ${({ $isSlim, $isInner }) =>
    $isSlim ? '934px' : $isInner ? '1060px' : '1328px'};
`;
