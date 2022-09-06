import styled from 'styled-components';

import repeater from 'img/repeater.svg';

const Wrapper = styled.div`
  max-width: 1312px;
  padding: 0 64px;
  height: 24px;
  margin-top: ${(props) => props.spacing_top};
  margin-right: auto;
  margin-bottom: ${(props) => props.spacing_btm};
  margin-left: auto;
  background: url(${repeater.src});
`;

const Repeater = (props) => (
  <Wrapper spacing_top={props.spacing_top} spacing_btm={props.spacing_btm} />
);

export default Repeater;
