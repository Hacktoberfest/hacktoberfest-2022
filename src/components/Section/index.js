import {
  StyledSection
} from './Section.styles';

const Section = props => {
  const { children, small } = props;
  return (
    <StyledSection $small={small}>
      {children}
    </StyledSection>
  );
};

export default Section;