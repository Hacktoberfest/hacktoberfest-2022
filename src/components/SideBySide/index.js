import {
  StyledSideBySide,
  StyledContentMaster,
  StyledContent,
} from './SideBySide.styles';

const SideBySide = ({ title, subtitle, size = 'small', children }) => (
  <StyledSideBySide>
    <StyledContentMaster $size={size} title={title} titleAs="h3" size="lg">
      {subtitle}
    </StyledContentMaster>
    <StyledContent>{children}</StyledContent>
  </StyledSideBySide>
);

export default SideBySide;
