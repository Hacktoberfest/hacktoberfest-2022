import styled from 'styled-components';

const StyledDiv = styled.div`
  margin-top: ${(props) => props.spacing_top};
  width: 100%;
  display: flex;
  gap: 32px;

  > * {
    width: 100%;
  }

  @media (max-width: 800px) {
    flex-wrap: wrap;
  }
`;

const Column = (props) => {
  return (
    <StyledDiv spacing_top={props.spacing_top}>{props.children}</StyledDiv>
  );
};

export default Column;
