import {
  StyledContainer
} from './Container.styles';

const Container = props => {
  const { children, inner } = props;
  return (
    <StyledContainer $isInner={inner}>
      {children}
    </StyledContainer>
  );
};

export default Container;