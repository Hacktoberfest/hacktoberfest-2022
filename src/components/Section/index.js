import {
  StyledSection
} from './Section.styles';

const Section = props => {
  const { children } = props;
  return (
    <StyledSection>
      {children}
    </StyledSection>
  );
};

export default Section;