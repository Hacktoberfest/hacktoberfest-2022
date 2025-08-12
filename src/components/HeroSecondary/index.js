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
import ContentMaster from 'components/ContentMaster';

const HeroSecondary = (props) => {
  const { title, body, icon, cta } = props;
  const theme = useTheme();
  return (
    <StyledHeroSecondary>
      <Container>
        <StyledHeroSecondaryContainer>
          {icon && <StyledHeroSecondaryImage>{icon}</StyledHeroSecondaryImage>}
          <StyledHeroSecondaryContent>
            <StyledHeroSecondaryTitle>{title}</StyledHeroSecondaryTitle>
            {body && (
              <StyledHeroSecondarybody>
                <ContentMaster align="center" size="md">
                  {body}
                </ContentMaster>
              </StyledHeroSecondarybody>
            )}
            {cta && <ButtonMain {...cta} />}
          </StyledHeroSecondaryContent>
        </StyledHeroSecondaryContainer>
      </Container>
    </StyledHeroSecondary>
  );
};

export default HeroSecondary;
