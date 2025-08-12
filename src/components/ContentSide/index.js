import { StyledContentSide } from './ContentSide.styles';

const ContentSide = (props) => {
  const { children, size, align } = props;

  return (
    <StyledContentSide $align={align} $size={size}>
      {children}
    </StyledContentSide>
  );
};

export default ContentSide;
