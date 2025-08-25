import { StyledContentSide } from './ContentSide.styles';

const ContentSide = (props) => {
  const { children, size, align, isEqual = false, ...rest } = props;

  return (
    <StyledContentSide $align={align} $size={size} $isEqual={isEqual} {...rest}>
      {children}
    </StyledContentSide>
  );
};

export default ContentSide;
