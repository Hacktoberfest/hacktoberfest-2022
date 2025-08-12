import hacktoberfestLogomark from 'assets/img/logo-hacktoberfest-12--footer.svg';
import logoDigitalOcean from 'assets/img/logo-digitalocean.svg';
import {
  StyledFooter,
  StyledFooterContent,
  StyledFooterContainer,
  StyledFooterLogo,
  StyledFooterLinks,
  StyledFooterLinksColumn,
  StyledFooterLinksTitle,
  StyledFooterCopyright,
  StyledEasterEggContainer,
  StyledAlienContainer,
  StyledFlagImage,
} from './Footer.styles';
import { registrationStart } from 'lib/config';
import Layout from 'components/Layout';
import CustomLink from 'components/CustomLink';
import {
  BlueSkyIcon,
  DiscordIcon,
  EmailIcon,
  FacebookIcon,
  HackerNewsIcon,
  LinkedInIcon,
  RedditIcon,
  XTwitterIcon,
} from 'components/SocialIcons';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import earth from 'assets/img/easter-egg/earth.svg';
import alien from 'assets/img/easter-egg/alien.svg';
import flag from 'assets/img/easter-egg/flag.svg';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const Footer = () => {
  const router = useRouter();

  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const easterEggRef = useRef(null);
  const [isEasterEggVisible, setIsEasterEggVisible] = useState(false);
  const [isFlagVisible, setIsFlagVisible] = useState(false);

  const handleAlienTransitionEnd = (event) => {
    // Only trigger for the specific properties we care about (top or opacity)
    if (event.propertyName === 'top' || event.propertyName === 'opacity') {
      // Trigger the second component's transition
      setIsFlagVisible(true);
    }
  };

  const isHomePage = useMemo(() => router.asPath === '/', [router.asPath]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setIsFooterVisible(true);
          // Once visible, we can disconnect the observer
          observer.disconnect();
        }
      },
      { threshold: 1, rootMargin: '100px' },
    );

    const eggObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setIsEasterEggVisible(true);
          // Once visible, we can disconnect the observer
          eggObserver.disconnect();
        }
      },
      { threshold: 1, rootMargin: '150px' },
    );

    if (easterEggRef.current) {
      eggObserver.observe(easterEggRef.current);
    }

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.disconnect();
      }

      if (easterEggRef.current) {
        eggObserver.disconnect();
      }
    };
  }, [isFooterVisible]);

  return (
    <>
      <Layout>
        <StyledFooter
          $isEasterEggVisible={isHomePage && isFooterVisible}
          ref={footerRef}
        >
          <StyledFooterContainer>
            <StyledFooterContent>
              <StyledFooterLogo>
                <img
                  src={hacktoberfestLogomark.src}
                  alt="Hacktoberfest"
                  width="280"
                  height="36"
                />
              </StyledFooterLogo>

              <p>
                Let’s build the future of open source, together. Whether you’re
                launching a developer tool, hiring open-source contributors, or
                scaling a community, Hacktoberfest gives you a trusted platform
                to do it in a way that gets users excited.
              </p>
            </StyledFooterContent>

            <StyledFooterLinks aria-label="Footer">
              <StyledFooterLinksColumn>
                <StyledFooterLinksTitle>Share</StyledFooterLinksTitle>
                <ul>
                  <li>
                    <CustomLink
                      icon={<XTwitterIcon />}
                      href={`https://twitter.com/share?url=${encodeURIComponent(
                        BASE_URL,
                      )}&text=${encodeURIComponent(
                        'Spread the love for open source with #Hacktoberfest, a month-long celebration of open-source projects, their maintainers, and the entire community of contributors.',
                      )}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      X (Twitter)
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink
                      icon={<FacebookIcon />}
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        BASE_URL,
                      )}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Facebook
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink
                      icon={<LinkedInIcon />}
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        BASE_URL,
                      )}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      LinkedIn
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink
                      icon={<HackerNewsIcon />}
                      href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
                        BASE_URL,
                      )}&t=${encodeURIComponent(`Hacktoberfest ${new Date(registrationStart).getFullYear()}`)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Hacker News
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink
                      icon={<RedditIcon />}
                      href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                        BASE_URL,
                      )}&title=${encodeURIComponent(`Hacktoberfest ${new Date(registrationStart).getFullYear()}`)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Reddit
                    </CustomLink>
                  </li>
                </ul>
              </StyledFooterLinksColumn>
              <StyledFooterLinksColumn>
                <StyledFooterLinksTitle>Follow</StyledFooterLinksTitle>
                <ul>
                  <li>
                    <CustomLink
                      icon={<DiscordIcon />}
                      href="https://discord.gg/hacktoberfest"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Discord
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink
                      icon={<XTwitterIcon />}
                      href="https://twitter.com/hacktoberfest"
                      target="_blank"
                      rel="me noreferrer noopener"
                    >
                      X (Twitter)
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink
                      icon={<BlueSkyIcon />}
                      href="https://bsky.app/profile/hacktoberfest.com"
                      target="_blank"
                      rel="me noreferrer noopener"
                    >
                      Bluesky
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink
                      icon={<RedditIcon />}
                      href="https://reddit.com/r/hacktoberfest"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Reddit
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink
                      icon={<EmailIcon />}
                      href="https://www.digitalocean.com/open-source/hacktoberfest#stay-up-to-date"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Email
                    </CustomLink>
                  </li>
                </ul>
              </StyledFooterLinksColumn>
            </StyledFooterLinks>
          </StyledFooterContainer>

          <StyledFooterCopyright>
            <li>
              <Image
                src={logoDigitalOcean}
                alt="DigitalOcean"
                width="161"
                height="29"
              />
              <span>
                &copy; {new Date().getFullYear()} DigitalOcean, LLC. All Rights
                Reserved.
              </span>
            </li>
            <li>
              <CustomLink
                href="https://www.digitalocean.com/legal/terms-of-service-agreement"
                target="_blank"
                rel="noreferrer noopener"
              >
                Terms
              </CustomLink>
            </li>
            <li>
              <CustomLink
                href="https://www.digitalocean.com/legal/privacy-policy"
                target="_blank"
                rel="noreferrer noopener"
              >
                Privacy
              </CustomLink>
            </li>
            <li>
              <CustomLink href="/events#brand">Brand Guidelines</CustomLink>
            </li>
          </StyledFooterCopyright>
          {isHomePage && isFooterVisible && (
            <StyledEasterEggContainer ref={easterEggRef}>
              <StyledAlienContainer
                onTransitionEnd={handleAlienTransitionEnd}
                $isVisible={isEasterEggVisible}
              >
                <Image src={alien} alt="Alien" />
                <StyledFlagImage
                  src={flag}
                  alt="Flag"
                  $isVisible={isFlagVisible}
                />
              </StyledAlienContainer>
              <Image src={earth} alt="Earth" />
            </StyledEasterEggContainer>
          )}
        </StyledFooter>
      </Layout>
    </>
  );
};

export default Footer;
