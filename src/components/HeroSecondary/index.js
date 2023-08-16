import Container from 'components/Container';
import {
  StyledHeroSecondary,
  StyledHeroSecondaryContent,
  StyledHeroSecondaryTitle,
  StyledHeroSecondaryImage
} from './HeroSecondary.styles';
import Divider from 'components/Divider';
import PixelComputer2023 from 'components/pixels/PixelComputer2023';

const HeroSecondary = props => {
  const { children, title } = props;
  return (
    <StyledHeroSecondary>
      <Container>
        <StyledHeroSecondaryContent>
          <StyledHeroSecondaryTitle>
            {title}
          </StyledHeroSecondaryTitle>
          <StyledHeroSecondaryImage>
            <PixelComputer2023
              width="1680"
              scale="1"
              timing="5"
              frames="7"
              id="f2"
            />
          </StyledHeroSecondaryImage>
        </StyledHeroSecondaryContent>
        <Divider type="pixelarrow" />
      </Container>
    </StyledHeroSecondary>
  );
};

export default HeroSecondary;