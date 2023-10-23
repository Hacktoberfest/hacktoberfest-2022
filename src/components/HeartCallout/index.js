import PixelHearts from 'components/pixels/PixelHearts';

import {
  StyledHeartCallout,
  StyledHeartCalloutImage
} from './HeartCallout.styles';

const HeartCallout = props => {
  const {
    children,
    className
  } = props;

  return (
    <StyledHeartCallout className={className}>
      <StyledHeartCalloutImage>
        <PixelHearts count={1} />
      </StyledHeartCalloutImage>
      <div>
        {children}
      </div>
      <StyledHeartCalloutImage>
        <PixelHearts count={1} offset={2} />
      </StyledHeartCalloutImage>
    </StyledHeartCallout>
  );
};

export default HeartCallout;
