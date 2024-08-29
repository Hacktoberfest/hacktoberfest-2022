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
                <StyledSectionSpacing>
                  <ContentMaster
                    size="xl2"
                    align="center"
                    links={[
                      {
                        id: 'join-the-discord-hero',
                        href: 'http://discord.gg/hacktoberfest',
                        children: 'Join the Discord',
                      },
                    ]}
                  >
                    {`Thank you for contributing to open source this month. Open source couldn’t survive without the dynamic duo of project maintainers and volunteers like you. **Hacktoberfest ${currentHacktoberfest}** has officially ended.\n\n` +
                      'But don’t let that stop you from contributing to open source all year long. We look forward to seeing you next year! Be sure to [sign up for updates](https://www.digitalocean.com/open-source/hacktoberfest#open-source-stay-up-to-date) to get the latest announcements about future Hacktoberfest events.\n\n' +
                      'Keep your connection to open source strong! Join other members of the open-source community in lively discussion on the Hacktoberfest Discord.'}
                  </ContentMaster>

                  <ContentMaster size="xl2" align="center">
                    A special thank you to the great folks at DigitalOcean,
                    Twilio, Cloudflare and Quira for their sponsorship of
                    Hacktoberfest. Thank you to ALL our Sponsors and Community
                    Partners, we ❤️ you!
                  </ContentMaster>
                </StyledSectionSpacing>
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
            fillRule="evenodd"
            clipRule="evenodd"
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
