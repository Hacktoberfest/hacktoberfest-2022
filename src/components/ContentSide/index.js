import { StyledContentSide } from './ContentSide.styles';

const ContentSide = (props) => {
  const { children, size, align, ...rest } = props;

  return (
    <StyledContentSide $align={align} $size={size} {...rest}>
      {children}
    </StyledContentSide>
  );
};

export default ContentSide;
