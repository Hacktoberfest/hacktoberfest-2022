import { StyledDivider } from './Divider.styles';

const Divider = ({ type = 'dashed', ...rest }) => {
  return <StyledDivider {...rest} $type={type} />;
};

export default Divider;
