import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 100%;
  display: flex;
  gap: 32px;

  > * {
    width: 100%;
  }

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

const Column = (props) => {
  return <StyledDiv>{props.children}</StyledDiv>;
};

export default Column;
