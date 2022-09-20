import styled, { keyframes } from 'styled-components';

const StyledDiv = styled.div``;

const FairyWrapper = styled(StyledDiv)`
  background: red;
`;

export const AsciiFairy = () => {
  console.log('ok');

  return (
    <FairyWrapper>
      <div>test</div>
    </FairyWrapper>
  );
};
