import styled from 'styled-components';
import repeater from 'img/repeater.svg';

const Wrapper = styled.div`
  max-width: 1312px;
  height: 24px;
  margin: ${(props) => props.top} auto ${(props) => props.bottom} auto;
  background: url(${repeater.src});
  color: 'orange';
`;

const Repeater = (props) => <Wrapper top={props.top} bottom={props.bottom} />;

export default Repeater;
