import {
  StyledHeartCallout,
  StyledHeartCalloutImage
} from './HeartCallout.styles';
import ContentMaster from 'components/ContentMaster';
import IlloHeart from 'assets/img/pixel-heart.svg';

const HeartCallout = props => {
  const {
    children,
  } = props;

  return (
    <StyledHeartCallout>
      <StyledHeartCalloutImage>
        <img src={IlloHeart.src} alt="" />
      </StyledHeartCalloutImage>
      <ContentMaster align="center" size="xl">
        {children}
      </ContentMaster>
      <StyledHeartCalloutImage>
        <img src={IlloHeart.src} alt="" />
      </StyledHeartCalloutImage>
    </StyledHeartCallout>
  );
};

export default HeartCallout;