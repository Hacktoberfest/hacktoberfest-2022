import ButtonMain from 'components/ButtonMain';
import {
  StyledCard,
  StyledCardImage,
  StyledCardContent,
  StyledCardTitle,
  StyledCardBG
} from './Card.styles';

const Card = props => {
  const { image, imageRotatation = 'left', bgImage, title, cta } = props;
  return (
    <StyledCard>
      <StyledCardBG />
      <StyledCardImage $rotate={imageRotatation} $bgImage={bgImage}>
        <img {...image} />
      </StyledCardImage>
      <StyledCardContent>
        <StyledCardTitle>{title}</StyledCardTitle>
        <ButtonMain size="lg" {...cta} />
      </StyledCardContent>
    </StyledCard>
  );
};

export default Card;