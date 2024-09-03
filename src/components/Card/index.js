import ButtonMain from 'components/ButtonMain';
import {
  StyledCard,
  StyledCardImage,
  StyledCardContent,
  StyledCardTitle,
} from './Card.styles';

const Card = (props) => {
  const { image, title, cta } = props;
  return (
    <StyledCard>
      <StyledCardImage>
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
