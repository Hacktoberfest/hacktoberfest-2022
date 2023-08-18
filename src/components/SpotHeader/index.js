import ContentMaster from 'components/ContentMaster';
import {
  StyledSpotHeader,
  StyledSpotHeaderImage
} from './SpotHeader.styles';

const SpotHeader = props => {
  const { image, content } = props;
  return (
    <StyledSpotHeader>
      <StyledSpotHeaderImage>
        <img {...image} />
      </StyledSpotHeaderImage>
      <ContentMaster {...content} />
    </StyledSpotHeader>
  );
};

export default SpotHeader;