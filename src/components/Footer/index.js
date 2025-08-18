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
import brandGuidelines from 'assets/brand-guidelines.pdf';

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
              <CustomLink
                showExternal={false}
                iconSize="sm"
                target="_blank"
                href={brandGuidelines}
              >
                Brand Guidelines
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12 13"
                  fill="none"
                >
                  <g clipPath="url(#clip0_5372_8423)">
                    <path
                      d="M11 10.8994H1V12.3994H11V10.8994Z"
                      fill="currentColor"
                    />
                    <path
                      d="M10 4.89941V5.89941H9.5V6.39941H9V6.89941H8.5V7.39941H8V7.89941H7.5V8.39941H7V8.89941H6.5V9.39941H5.5V8.89941H5V8.39941H4.5V7.89941H4V7.39941H3.5V6.89941H3V6.39941H2.5V5.89941H2V4.89941H2.5V4.39941H3.5V4.89941H4V5.39941H4.5V5.89941H5V1.39941H7V5.89941H7.5V5.39941H8V4.89941H8.5V4.39941H9.5V4.89941H10Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5372_8423">
                      <rect
                        width="12"
                        height="12"
                        fill="white"
                        transform="translate(0 0.899414)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </CustomLink>
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
