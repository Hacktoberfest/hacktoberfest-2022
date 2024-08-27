import Container from 'components/Container';
import {
  StyledHeroSecondary,
  StyledHeroSecondaryContainer,
  StyledHeroSecondaryContent,
  StyledHeroSecondaryTitle,
  StyledHeroSecondaryImage,
} from './HeroSecondary.styles';
import ButtonMain from 'components/ButtonMain';
import { useTheme } from 'styled-components';
import SectionDivider from 'components/SectionDivider';
import Glitch from 'components/Glitch';

const HeroSecondary = (props) => {
  const { title, icon, cta, reverse = false, includeDivider = true } = props;
  const theme = useTheme();
  return (
    <StyledHeroSecondary>
      <Container>
        <StyledHeroSecondaryContainer $reverse={reverse}>
          <StyledHeroSecondaryContent>
            <StyledHeroSecondaryTitle>{title}</StyledHeroSecondaryTitle>
            {cta && <ButtonMain {...cta} />}
          </StyledHeroSecondaryContent>
          <StyledHeroSecondaryImage>
            <Glitch image={icon} />
          </StyledHeroSecondaryImage>
        </StyledHeroSecondaryContainer>
      </Container>
      {includeDivider && (
        <SectionDivider
          align="left"
          bgColor="transparent"
          fgColor={theme.colors.typography}
        />
      )}
    </StyledHeroSecondary>
  );
};

export default HeroSecondary;
