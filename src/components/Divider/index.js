import { StyledDivider } from './Divider.styles';

const Divider = ({ type = 'dashed' }) => {
  return <StyledDivider $type={type} />;
};

export default Divider;
