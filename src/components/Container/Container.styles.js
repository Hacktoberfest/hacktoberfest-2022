import styled from 'styled-components';

export const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 0 24px;

  ${({ $isInner }) => $isInner ? `
    max-width: 1060px;
  ` : `
    max-width: 1328px;
  `};
`;