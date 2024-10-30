import {
  StyledHero,
  StyledHeroContent,
  StyledHeroTitle,
  StyledHeroSubtitle,
  StyledHeroDivider,
  StyledHeroContainer,
} from './Hero.styles';

import { useMemo } from 'react';
import {
  currentHacktoberfest,
  registrationEnd,
  registrationStart,
} from 'lib/config';
import ContentMaster from 'components/ContentMaster';
import { StyledSectionSpacing } from 'styles/sharedStyles';
import { sponsors } from 'lib/sponsors';
import { asList } from 'lib/format';
import Type from 'components/type';
import { useTheme } from 'styled-components';

const Hero = () => {
  const theme = useTheme();
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
                  <Type
                    prefix=">"
                    prefixColor={theme.colors.pink}
                    text="Registration is closed"
                  />
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
                <StyledSectionSpacing>
                  <ContentMaster size="xl2" align="center">
                    {`Thank you for contributing to open source this month. Open source couldn’t survive without the dynamic duo of project maintainers and volunteers like you. **Hacktoberfest #${currentHacktoberfest}** has officially ended.`}
                  </ContentMaster>
                </StyledSectionSpacing>
              </StyledHeroSubtitle>
            )}
          </StyledHeroContent>
        </StyledHeroContainer>
      </StyledHero>

      {!hasRegistrationEnded && (
        <StyledHeroDivider>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1440"
            height="144"
            viewBox="0 0 1440 144"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M214 1.87085e-05V80H285V109H419V80L627 80V19.5091L763.086 19.5091V80H889.801V55.3599L1003.94 55.3599V110.233L1073.44 110.233V29.7522L1256 29.7522V3.44969e-06L1440 1.87085e-05V144H0V0L214 1.87085e-05ZM627 144V80.2358L763 80.2358V144L627 144Z"
              fill="#183717"
            />
            <path d="M419 80L285 80V50L419 50V80Z" fill="#183717" />
          </svg>
        </StyledHeroDivider>
      )}
    </>
  );
};

export default Hero;
