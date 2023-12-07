import Container from 'components/Container';
import {
  StyledHeroSecondary,
  StyledHeroSecondaryContainer,
  StyledHeroSecondaryContent,
  StyledHeroSecondaryTitle,
  StyledHeroSecondaryImage,
} from './HeroSecondary.styles';
import Divider from 'components/Divider';
import ButtonMain from 'components/ButtonMain';

const HeroSecondary = (props) => {
  const { title, icon, cta } = props;
  return (
    <StyledHeroSecondary>
      <Container>
        <StyledHeroSecondaryContainer>
          <StyledHeroSecondaryContent>
            <StyledHeroSecondaryTitle>{title}</StyledHeroSecondaryTitle>
            {cta && <ButtonMain {...cta} />}
          </StyledHeroSecondaryContent>
          <StyledHeroSecondaryImage>{icon}</StyledHeroSecondaryImage>
        </StyledHeroSecondaryContainer>
        <Divider type="pixelarrow" />
      </Container>
    </StyledHeroSecondary>
  );
};

export default HeroSecondary;
