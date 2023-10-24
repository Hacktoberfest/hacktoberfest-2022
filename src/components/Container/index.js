import {
  StyledContainer
} from './Container.styles';

const Container = props => {
  const { children, inner, slim } = props;
  return (
    <StyledContainer $isInner={inner} $isSlim={slim}>
      {children}
    </StyledContainer>
  );
};

export default Container;
