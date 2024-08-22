import styled from 'styled-components';

export const StyledEvents = styled.div`
  > ul {
    display: flex;
    flex-direction: column;
    gap: 48px;

    > li {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }
  }
`;

export const StyledEventsLink = styled.p`
  text-align: center;
`;
