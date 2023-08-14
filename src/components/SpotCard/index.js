import ContentMaster from 'components/ContentMaster';
import {
  StyledSpotCard,
  StyledSpotCardImage
} from './SpotCard.styles';

const SpotCard = props => {
  const { children, image, links } = props;
  return (
    <StyledSpotCard>
      <StyledSpotCardImage>
        <img {...image} />
      </StyledSpotCardImage>
      <ContentMaster
        size="lg"
        links={links}>
        {children}
      </ContentMaster>
    </StyledSpotCard>
  );
};

export default SpotCard;