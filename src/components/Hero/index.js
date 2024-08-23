import {
  StyledHero,
  StyledHeroContent,
  StyledHeroTitle,
  StyledHeroSubtitle,
  StyledHeroDivider,
  StyledHeroContainer,
} from './Hero.styles';

import { useMemo } from 'react';
import { registrationEnd, registrationStart } from 'lib/config';

const Hero = () => {
  const hasRegistrationEnded = useMemo(
    () => new Date() >= new Date(registrationEnd),
    [],
  );

  return (
    <>
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
                  A month-long <strong>celebration</strong> of all things
                  open-source
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
          </StyledHeroContent>
        </StyledHeroContainer>
      </StyledHero>

      <StyledHeroDivider>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1440"
          height="144"
          viewBox="0 0 1440 144"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M214 1.87085e-05V80H285V109H419V80L627 80V19.5091L763.086 19.5091V80H889.801V55.3599L1003.94 55.3599V110.233L1073.44 110.233V29.7522L1256 29.7522V3.44969e-06L1440 1.87085e-05V144H0V0L214 1.87085e-05ZM627 144V80.2358L763 80.2358V144L627 144Z"
            fill="#183717"
          />
          <path d="M419 80L285 80V50L419 50V80Z" fill="#183717" />
        </svg>
      </StyledHeroDivider>
    </>
  );
};

export default Hero;
