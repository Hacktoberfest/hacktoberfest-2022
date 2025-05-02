import { StyledContainer } from './Container.styles';

const Container = ({ children, inner = false }) => (
  <StyledContainer $isInner={inner}>{children}</StyledContainer>
);

export default Container;
