import {
  StyledSection
} from './Section.styles';

const Section = props => {
  const { children, id, small } = props;
  return (
    <StyledSection id={id} $small={small}>
      {children}
    </StyledSection>
  );
};

export default Section;