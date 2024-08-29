import ContentMaster from 'components/ContentMaster';
import {
  StyledHomeIntro,
  StyledHomeIntroContent,
  StyledHomeIntroCallout,
  StyledHomeIntroContainer,
  StyledSloth,
} from './HomeIntro.styles';

import Countdown from 'components/Countdown';
import dots from 'assets/img/dots.svg';
import sloth from 'assets/img/sloan-the-sloth.svg';
import topDots from 'assets/img/top-dots.svg';
import { useMemo } from 'react';
import { registrationEnd, registrationStart } from 'lib/config';

const HomeIntro = () => {
  const hasRegistration = useMemo(
    () =>
      new Date() >= new Date(registrationStart) &&
      new Date() < new Date(registrationEnd),
    [],
  );

  return (
    <StyledHomeIntro>
      <StyledHomeIntroContainer>
        <StyledHomeIntroContent>
          <ContentMaster
            title={
              hasRegistration ? (
                'Now’s the time; now’s the hour—Hacktoberfest is on!'
              ) : (
                <>
                  It’s that time of year again. <strong>Hacktoberfest</strong>{' '}
                  is nearly upon us!
                </>
              )
            }
            size="xl"
          >
            {hasRegistration
              ? 'Register and start contributing your four pull/merge requests today!'
              : 'Prepare your projects, brace yourself for action—registration opens September 23, 2024.'}
          </ContentMaster>
        </StyledHomeIntroContent>

        <StyledHomeIntroCallout>
          {hasRegistration ? (
            <ContentMaster
              align="right"
              cta={{
                children: 'Register for Hacktoberfest',
                href: '/auth',
                variant: 'secondary-beige',
              }}
            />
          ) : (
            <Countdown />
          )}
        </StyledHomeIntroCallout>

        <StyledSloth>
          <img src={topDots.src} alt="" width="1030" height="211" />
          <img src={sloth.src} alt="" width="520" height="235" />
        </StyledSloth>
      </StyledHomeIntroContainer>
      <img src={dots.src} alt="" />
    </StyledHomeIntro>
  );
};

export default HomeIntro;
