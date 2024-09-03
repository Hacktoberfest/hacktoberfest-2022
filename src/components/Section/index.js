import { StyledSection } from './Section.styles';

const Section = ({
  children,
  id,
  small,
  bgColor,
  color,
  isDark = false,
  linkColor = null,
}) => (
  <StyledSection
    id={id}
    $small={small}
    $bgColor={bgColor}
    $color={color}
    $isDark={isDark}
    $linkColor={linkColor}
  >
    {children}
  </StyledSection>
);

export default Section;
