import {
  StyledHero,
  StyledHeroContent,
  StyledHeroTitle,
  StyledHeroPresented,
  StyledHeroCountdown,
  StyledHeroContainer,
  StyledCountdown,
  StyledCountdownItem,
  StyledCountdownHeader,
  StyledCountdownLoading,
  StyledCountdownLoadingContainer,
  StyledCountdownLoadingItem
} from './Hero.styles';

import useCountdown from 'hooks/useCountdown';
import { useMemo } from 'react';
import { registrationEnd, registrationStart } from 'lib/config';
import ButtonMain from 'components/ButtonMain';
import Sponsors from 'components/Sponsors';
import sponsorsList from 'lib/sponsors';

const Hero = props => {
  const { children } = props;

  const [days, hours, minutes, seconds, progress] = useCountdown(
    new Date(registrationStart).getTime()
  );

  const progressBarSegments = 17;
  const progressBarPercentage = Math.floor((progressBarSegments * progress) / 100);

  const hasRegistration = useMemo(
    () =>
      new Date() >= new Date(registrationStart) &&
      new Date() < new Date(registrationEnd),
    []
  );

  const hasRegistrationEnded = useMemo(() => new Date() >= new Date(registrationEnd), []);

  return (
    <StyledHero>
      <StyledHeroContainer>
        <StyledHeroContent>
          <StyledHeroTitle>
            Celebrate
            our <strong>10th year</strong> supporting
            open source!
          </StyledHeroTitle>
          <StyledHeroPresented>
            <Sponsors title="Presented by" sponsors={sponsorsList.presented} />
          </StyledHeroPresented>
        </StyledHeroContent>
        <StyledHeroCountdown>
          {!hasRegistrationEnded && (
            <>
              <StyledCountdownHeader>
                The countdown to Hacktoberfest starts now!
              </StyledCountdownHeader>
              <StyledCountdown>
                <StyledCountdownItem>
                  <p>
                    <span>{days}</span>
                    Days
                  </p>
                </StyledCountdownItem>
                <StyledCountdownItem>
                  <p>
                    <span>{hours}</span>
                    Hours
                  </p>
                </StyledCountdownItem>
                <StyledCountdownItem>
                  <p>
                    <span>{minutes}</span>
                    Minutes
                  </p>
                </StyledCountdownItem>
              </StyledCountdown>
              <StyledCountdownLoading>
                <StyledCountdownLoadingContainer>
                  {Array.from(Array(progressBarSegments), (el, i) => {
                    return <StyledCountdownLoadingItem key={i} $complete={i < progressBarPercentage} />
                  })}
                </StyledCountdownLoadingContainer>
              </StyledCountdownLoading>
              {hasRegistration && (
                <ButtonMain href="/auth">Register now!</ButtonMain>
              )}
            </>
          )}
          {hasRegistrationEnded && (
            <>
              <br />
              <p>
                Thank you for making contributions to open source.
                Hacktoberfest #{new Date(registrationStart).getFullYear() - 2013} {new Date(registrationStart).getFullYear()} has now ended.
              </p>
              <br />
            </>
          )}
        </StyledHeroCountdown>
      </StyledHeroContainer>
    </StyledHero>
  );
};

export default Hero;