import {
  StyledDivider
} from './Divider.styles';

const Divider = props => {
  const { type = 'dashed' } = props;
  return (
    <StyledDivider $type={type} />
  );
};

export default Divider;