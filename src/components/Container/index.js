import { StyledContainer } from './Container.styles';

const Container = ({ children, inner = false, ...props }) => (
  <StyledContainer {...props} $isInner={inner}>
    {children}
  </StyledContainer>
);

export default Container;
