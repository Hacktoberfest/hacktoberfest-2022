import styled from 'styled-components';

export const StyledLayout = styled.div`
  display: grid;
  grid-template-columns:
    [full-start] minmax(24px, 1fr)
    [main-start] minmax(0, 1088px) [main-end]
    minmax(24px, 1fr) [full-end];

  > * {
    grid-column: main-start / main-end;
  }
`;
