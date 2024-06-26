import {
  StyledHero,
  StyledHeroContent,
  StyledHeroTitle,
  StyledHeroSubtitle,
  StyledHeroPresented,
  StyledHeroCountdown,
  StyledHeroContainer,
  StyledCountdown,
  StyledCountdownItem,
  StyledCountdownHeader,
  StyledCountdownLoading,
  StyledCountdownLoadingContainer,
  StyledCountdownLoadingItem,
  StyledCountdownLoadingBorder,
} from './Hero.styles';

import useCountdown from 'hooks/useCountdown';
import { useMemo } from 'react';
import { registrationEnd, registrationStart } from 'lib/config';
import ButtonMain from 'components/ButtonMain';
import Sponsors from 'components/Sponsors';
import { founders } from 'lib/sponsors';

const Hero = () => {
  const [days, hours, minutes, seconds, progress] = useCountdown(
    new Date(registrationStart).getTime(),
  );

  const progressBarSegments = 17;
  const progressBarPercentage = Math.floor(
    (progressBarSegments * progress) / 100,
  );

  const hasRegistration = useMemo(
    () =>
      new Date() >= new Date(registrationStart) &&
      new Date() < new Date(registrationEnd),
    [],
  );

  const hasRegistrationEnded = useMemo(
    () => new Date() >= new Date(registrationEnd),
    [],
  );

  return (
    <StyledHero $centered={hasRegistrationEnded}>
      <StyledHeroContainer $centered={hasRegistrationEnded}>
        <StyledHeroContent>
          <StyledHeroTitle>
            {hasRegistrationEnded ? (
              <>
                Registration is <strong>closed</strong>
              </>
            ) : (
              <>
                Celebrate our <strong>10th year</strong> supporting open source!
              </>
            )}
          </StyledHeroTitle>

          {hasRegistrationEnded && (
            <StyledHeroSubtitle>
              Thank you for making contributions to open source.
              <br />
              <strong>
                Hacktoberfest #
                {new Date(registrationStart).getFullYear() - 2013}
              </strong>{' '}
              {new Date(registrationStart).getFullYear()} has now ended.
            </StyledHeroSubtitle>
          )}

          <StyledHeroPresented>
            <Sponsors
              title="Presented by"
              sponsors={founders}
              centered={hasRegistrationEnded}
            />
          </StyledHeroPresented>
        </StyledHeroContent>

        {!hasRegistrationEnded && (
          <StyledHeroCountdown>
            <>
              <StyledCountdownHeader>
                {hasRegistration
                  ? 'Hacktoberfest registration is open now!'
                  : 'The countdown to Hacktoberfest starts now!'}
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
                <StyledCountdownLoadingBorder>
                  <svg viewBox="0 0 474 36" preserveAspectRatio="none">
                    <rect
                      x=".5"
                      y=".5"
                      width="473"
                      height="35"
                      rx="8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="6,6"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </StyledCountdownLoadingBorder>
                <StyledCountdownLoadingContainer>
                  {Array.from(Array(progressBarSegments), (el, i) => {
                    return (
                      <StyledCountdownLoadingItem
                        key={i}
                        $complete={i < progressBarPercentage}
                      />
                    );
                  })}
                </StyledCountdownLoadingContainer>
              </StyledCountdownLoading>

              {hasRegistration && (
                <ButtonMain href="/auth">Register now!</ButtonMain>
              )}
            </>
          </StyledHeroCountdown>
        )}
      </StyledHeroContainer>
    </StyledHero>
  );
};

export default Hero;
