import ContentMaster from 'components/ContentMaster';
import {
  StyledHomeIntro,
  StyledHomeIntroContent,
  StyledHomeIntroCallout,
  StyledHomeIntroContainer,
} from './HomeIntro.styles';

import Countdown from 'components/Countdown';
import dots from 'assets/img/dots.svg';

const HomeIntro = () => {
  return (
    <StyledHomeIntro>
      <StyledHomeIntroContainer>
        <StyledHomeIntroContent>
          <ContentMaster
            title={
              <>
                It’s that time of year again. <strong>Hacktoberfest</strong> is
                nearly upon us!
              </>
            }
            size="xl"
          >
            Prepare your projects, brace yourself for action—registration opens
            September 23, 2024.
          </ContentMaster>
        </StyledHomeIntroContent>

        <StyledHomeIntroCallout>
          <Countdown />
        </StyledHomeIntroCallout>
      </StyledHomeIntroContainer>
      <img src={dots.src} alt="" />
    </StyledHomeIntro>
  );
};

export default HomeIntro;
