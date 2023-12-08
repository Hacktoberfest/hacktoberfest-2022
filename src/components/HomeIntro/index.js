import ContentMaster from 'components/ContentMaster';
import {
  StyledHomeIntro,
  StyledHomeIntroContent,
  StyledHomeIntroCallout,
  StyledHomeIntroContainer,
} from './HomeIntro.styles';
import Arrow from 'components/Arrow';
import { useTheme } from 'styled-components';
import CardCallout from 'components/CardCallout';

const HomeIntro = (props) => {
  const theme = useTheme();
  const { children, callout } = props;

  return (
    <StyledHomeIntro>
      <StyledHomeIntroContainer>
        <Arrow direction="right" color={theme.colors.bavarian.gold100} />
        <StyledHomeIntroContent>
          <ContentMaster size="xl">{children}</ContentMaster>
        </StyledHomeIntroContent>
        <Arrow />
      </StyledHomeIntroContainer>

      <StyledHomeIntroCallout>
        <CardCallout {...callout} />
      </StyledHomeIntroCallout>
    </StyledHomeIntro>
  );
};

export default HomeIntro;
