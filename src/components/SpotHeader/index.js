import ContentMaster from 'components/ContentMaster';
import { StyledSpotHeader, StyledSpotHeaderImage } from './SpotHeader.styles';
import Glitch from 'components/Glitch';

const SpotHeader = (props) => {
  const { image, content } = props;
  return (
    <StyledSpotHeader>
      <StyledSpotHeaderImage>
        <Glitch image={<img {...image} />} />
      </StyledSpotHeaderImage>
      <ContentMaster {...content} />
    </StyledSpotHeader>
  );
};

export default SpotHeader;
