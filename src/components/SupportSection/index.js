import ContentMaster from 'components/ContentMaster';
import {
  StyledSupportSection,
  StyledSupportSectionContainer,
  StyledSupportSectionContent,
  StyledSupportSectionCallout,
  StyledSupportSectionHearts
} from './SupportSection.styles';
import CardCallout from 'components/CardCallout';
import PixelHearts from 'components/pixels/PixelHearts';


const SupportSection = props => {
  const { children, title, callout } = props;
  return (
    <StyledSupportSection>
      <StyledSupportSectionContainer>
        <StyledSupportSectionContent>
          <ContentMaster size="xl" title={title}>
            {children}
          </ContentMaster>
        </StyledSupportSectionContent>
        <StyledSupportSectionHearts>
          <PixelHearts />
        </StyledSupportSectionHearts>
      </StyledSupportSectionContainer>

      <StyledSupportSectionCallout>
        <CardCallout {...callout} />
      </StyledSupportSectionCallout>
    </StyledSupportSection>
  );
};

export default SupportSection;