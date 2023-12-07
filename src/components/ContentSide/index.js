import { StyledContentSide } from './ContentSide.styles';

const ContentSide = (props) => {
  const { children } = props;

  return <StyledContentSide>{children}</StyledContentSide>;
};

export default ContentSide;
