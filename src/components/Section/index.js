import { StyledSection } from './Section.styles';

const Section = ({ children, id, size = 'lg', isFullWidth, ...props }) => (
  <StyledSection id={id} $size={size} $isFullWidth={isFullWidth} {...props}>
    {children}
  </StyledSection>
);

export default Section;
