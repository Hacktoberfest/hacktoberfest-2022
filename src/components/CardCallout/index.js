import TextLink from 'components/TextLink';
import {
  StyledCardCallout,
  StyledCardCalloutImage,
  StyledCardCalloutContent,
  StyledCardCalloutTitle,
  StyledCardCalloutContainer,
  StyledCardBackground,
} from './CardCallout.styles';

const CardCallout = (props) => {
  const { children, image, title, link } = props;
  return (
    <StyledCardCallout>
      <StyledCardBackground />
      <StyledCardCalloutContainer>
        <StyledCardCalloutImage>
          <img {...image} />
        </StyledCardCalloutImage>
        <StyledCardCalloutContent>
          <StyledCardCalloutTitle>{title}</StyledCardCalloutTitle>
          <TextLink {...link} />
        </StyledCardCalloutContent>
      </StyledCardCalloutContainer>
    </StyledCardCallout>
  );
};

export default CardCallout;
