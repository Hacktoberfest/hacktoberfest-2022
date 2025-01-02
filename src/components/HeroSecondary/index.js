import Container from 'components/Container';
import {
  StyledHeroSecondary,
  StyledHeroSecondaryContainer,
  StyledHeroSecondaryContent,
  StyledHeroSecondaryTitle,
  StyledHeroSecondarybody,
  StyledHeroSecondaryImage,
} from './HeroSecondary.styles';
import ButtonMain from 'components/ButtonMain';
import { useTheme } from 'styled-components';
import SectionDivider from 'components/SectionDivider';
import Glitch from 'components/Glitch';
import ContentMaster from 'components/ContentMaster';

const HeroSecondary = (props) => {
  const {
    title,
    body,
    icon,
    cta,
    reverse = false,
    includeDivider = true,
  } = props;
  const theme = useTheme();
  return (
    <StyledHeroSecondary $hasIcon={!!icon}>
      <Container>
        <StyledHeroSecondaryContainer $hasIcon={!!icon} $reverse={reverse}>
          <StyledHeroSecondaryContent $hasIcon={!!icon}>
            <StyledHeroSecondaryTitle>{title}</StyledHeroSecondaryTitle>
            <StyledHeroSecondarybody>
              <ContentMaster align="center" size="md">
                {body}
              </ContentMaster>
            </StyledHeroSecondarybody>
            {cta && <ButtonMain {...cta} />}
          </StyledHeroSecondaryContent>
          {icon && (
            <StyledHeroSecondaryImage>
              <Glitch image={icon} />
            </StyledHeroSecondaryImage>
          )}
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
