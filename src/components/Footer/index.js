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
  StyledTwinkle,
  StyledBoosters,
  StyledHand,
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

import brandGuidelines from 'assets/brand-guidelines.pdf';
import { DownloadIcon } from '../icons/Download';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const Footer = () => {
  const router = useRouter();

  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const easterEggRef = useRef(null);
  const [isEasterEggVisible, setIsEasterEggVisible] = useState(false);
  const [isFlagVisible, setIsFlagVisible] = useState(false);

  const handleAlienTransitionEnd = (event) => {
    if (event.type === 'animationend' || event.type === 'transitionend') {
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
                      href="https://discord.com/invite/digitalocean"
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
                      BlueSky
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
                <DownloadIcon />
              </CustomLink>
            </li>
          </StyledFooterCopyright>
          {isHomePage && isFooterVisible && (
            <StyledEasterEggContainer ref={easterEggRef}>
              <StyledAlienContainer
                onAnimationEnd={handleAlienTransitionEnd}
                $isVisible={isEasterEggVisible}
              >
                <svg
                  viewBox="0 0 188 283"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M126.261 195.923H104.492V208.984H108.846V222.046H113.2V226.4H126.261V222.046H134.969V217.692H130.615V213.338H126.261L126.261 208.984V195.923Z"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="17.4154"
                    transform="matrix(-1 0 0 1 126.258 195.923)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 130.613 213.338)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 134.969 217.691)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="17.4154"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 121.906 195.923)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="21.7692"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.383 204.631)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="21.7692"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.383 195.923)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 134.969 204.631)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 134.969 195.923)"
                    fill="#C2C2FF"
                  />
                  <path
                    d="M139.319 217.692H134.965V213.338H156.734V217.692H148.027V222.046H139.319V217.692Z"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 139.32 213.338)"
                    fill="#C2C2FF"
                  />
                  <path
                    d="M152.381 226.4V222.046H156.734V226.4V230.754H126.257V235.107H113.196V230.754H108.842V226.4H113.196H126.257H152.381Z"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 156.734 226.4)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 156.734 222.046)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 156.734 217.691)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 126.258 235.107)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 126.258 226.4)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="21.7692"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.383 200.276)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.383 200.276)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="21.7692"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.383 208.984)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="26.1231"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.383 222.046)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="30.4769"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 156.734 230.754)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 156.734 230.754)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.383 222.046)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="52.2462"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.383 191.568)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 113.195 235.107)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 113.195 226.4)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 139.32 222.046)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 134.969 217.691)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="17.4154"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 161.086 230.754)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="17.4154"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 156.734 213.338)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="17.4154"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 130.613 213.338)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="26.1231"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 108.84 235.107)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="17.4154"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 104.488 213.338)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.383 208.984)"
                    fill="#A0A0FF"
                  />
                  <path
                    d="M60.9538 195.923H82.723V208.984H78.3692V222.046H74.0153V226.4H60.9538V222.046H52.2461V217.692H56.5999V213.338H60.9538L60.9538 208.984V195.923Z"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="60.957"
                    y="195.923"
                    width="4.35385"
                    height="17.4154"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="56.6016"
                    y="213.338"
                    width="8.7077"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="52.2461"
                    y="217.691"
                    width="8.7077"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="65.3086"
                    y="195.923"
                    width="17.4154"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="34.832"
                    y="204.631"
                    width="21.7692"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="34.832"
                    y="195.923"
                    width="21.7692"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="52.2461"
                    y="204.631"
                    width="4.35385"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="52.2461"
                    y="195.923"
                    width="4.35385"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <path
                    d="M47.8959 217.692H52.2497V213.338H30.4805V217.692H39.1882V222.046H47.8959V217.692Z"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="47.8945"
                    y="213.338"
                    width="4.35385"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <path
                    d="M34.8343 226.4V222.046H30.4805V226.4V230.754H60.9574V235.107H74.019V230.754H78.3728V226.4H74.019H60.9574H34.8343Z"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="30.4805"
                    y="226.4"
                    width="13.0615"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="30.4805"
                    y="222.046"
                    width="4.35385"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="30.4805"
                    y="217.691"
                    width="8.7077"
                    height="4.35385"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="60.9531"
                    y="235.107"
                    width="13.0615"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="60.9531"
                    y="226.4"
                    width="13.0615"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="34.8359"
                    y="200.276"
                    width="21.7692"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="34.8359"
                    y="200.276"
                    width="8.7077"
                    height="4.35385"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="34.8359"
                    y="208.984"
                    width="21.7692"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="34.8359"
                    y="222.046"
                    width="26.1231"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="30.4805"
                    y="230.754"
                    width="30.4769"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="30.4805"
                    y="230.754"
                    width="13.0615"
                    height="4.35385"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="34.8359"
                    y="222.046"
                    width="8.7077"
                    height="4.35385"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="34.8359"
                    y="191.568"
                    width="52.2462"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="74.0195"
                    y="235.107"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 74.0195 235.107)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="74.0195"
                    y="226.4"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 74.0195 226.4)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="47.8945"
                    y="222.046"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 47.8945 222.046)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="52.25"
                    y="217.691"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 52.25 217.691)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="26.125"
                    y="230.754"
                    width="17.4154"
                    height="4.35385"
                    transform="rotate(-90 26.125 230.754)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="30.4805"
                    y="213.338"
                    width="17.4154"
                    height="4.35385"
                    transform="rotate(-90 30.4805 213.338)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="56.6055"
                    y="213.338"
                    width="17.4154"
                    height="4.35385"
                    transform="rotate(-90 56.6055 213.338)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="78.3711"
                    y="235.107"
                    width="26.1231"
                    height="4.35385"
                    transform="rotate(-90 78.3711 235.107)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="82.7266"
                    y="213.338"
                    width="17.4154"
                    height="4.35385"
                    transform="rotate(-90 82.7266 213.338)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="34.8359"
                    y="208.984"
                    width="8.7077"
                    height="4.35385"
                    fill="#A0A0FF"
                  />
                  <path
                    d="M82.726 130.615V126.261H65.3106V117.553H52.249V115.784V113.199H43.5413V117.553H47.8952V126.261H52.249V148.03H47.8952V161.092H43.5413V178.507H39.1875V191.568H47.8952H82.726V178.515H104.495V191.568H139.326H148.034V178.507H143.68V161.092H139.326V148.03H134.972V126.261H139.326V117.553H143.68V113.199H134.972V115.784V117.553H121.911V126.261H104.495V130.615H82.726Z"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(1.45705e-08 -1 -1 -1.31134e-07 82.7266 191.567)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="39.1846"
                    height="8.70769"
                    transform="matrix(-1 1.74845e-07 -1.45705e-08 1 78.3711 182.86)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="21.7692"
                    transform="matrix(-1 1.74845e-07 -1.45705e-08 1 52.2461 161.091)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="21.7692"
                    transform="matrix(-1 1.74845e-07 -1.45705e-08 1 143.676 161.091)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="39.1846"
                    height="8.70769"
                    transform="matrix(-1 1.74845e-07 -1.45705e-08 1 148.031 182.86)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="104.496"
                    y="191.567"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 104.496 191.567)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="82.7266"
                    y="178.507"
                    width="4.35385"
                    height="21.7692"
                    transform="rotate(-90 82.7266 178.507)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="87.0781"
                    y="174.152"
                    width="4.35385"
                    height="13.0615"
                    transform="rotate(-90 87.0781 174.152)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="39.1846"
                    height="4.35385"
                    transform="matrix(4.16299e-08 -1 -1 -4.5897e-08 56.6016 165.444)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="39.1846"
                    height="4.35385"
                    transform="matrix(4.16299e-08 -1 -1 -4.5897e-08 134.969 165.444)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(4.16299e-08 -1 -1 -4.5897e-08 52.2461 161.091)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(4.16299e-08 -1 -1 -4.5897e-08 43.5391 182.86)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(4.16299e-08 -1 -1 -4.5897e-08 148.031 182.86)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(4.16299e-08 -1 -1 -4.5897e-08 139.324 161.091)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="78.3711"
                    y="178.509"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 78.3711 178.509)"
                    fill="#403F7D"
                  />
                  <rect
                    x="39.1875"
                    y="178.509"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 39.1875 178.509)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 108.848 178.509)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 148.035 178.509)"
                    fill="#403F7D"
                  />
                  <rect
                    x="34.832"
                    y="191.569"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 34.832 191.569)"
                    fill="#403F7D"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(5.82819e-08 -1 -1 -3.27835e-08 152.387 191.569)"
                    fill="#403F7D"
                  />
                  <path
                    d="M82.7229 182.862L82.7229 178.508L87.0768 178.508L100.138 178.508L104.492 178.508L104.492 182.862L104.492 191.569H100.138L100.138 182.862L87.0768 182.862L87.0768 191.569H82.7229L82.7229 182.862Z"
                    fill="#403F7D"
                  />
                  <rect
                    x="108.848"
                    y="143.677"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 108.848 143.677)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="108.848"
                    y="152.385"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 108.848 152.385)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="113.203"
                    y="156.738"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 113.203 156.738)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="117.559"
                    y="152.385"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 117.559 152.385)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="121.91"
                    y="156.739"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 121.91 156.739)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="126.262"
                    y="152.385"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 126.262 152.385)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="126.262"
                    y="139.323"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(180 126.262 139.323)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(-1 0 0 1 152.391 161.092)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 161.094 161.092)"
                    fill="#F2F4F7"
                  />
                  <path
                    d="M143.68 121.907L143.68 117.554L148.034 117.554L148.034 121.907L156.742 121.907L156.742 126.261L156.742 134.969L165.449 134.969L165.449 156.738L139.326 156.738L139.326 148.031L139.326 134.969L139.326 126.261L143.68 126.261L143.68 121.907Z"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35385"
                    height="13.0615"
                    transform="matrix(-1 0 0 1 148.039 143.678)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.391 152.386)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="21.7692"
                    transform="matrix(-1 0 0 1 143.684 126.262)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 156.742 169.801)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="30.4769"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 169.805 156.739)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 148.031 117.554)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 161.094 169.801)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 165.449 165.447)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 152.387 121.907)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 161.094 134.97)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 156.742 130.615)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 143.68 126.262)"
                    fill="#403F7D"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 156.742 169.801)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 165.449 143.677)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 143.68 156.739)"
                    fill="#403F7D"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 169.805 156.739)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="21.7692"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 139.328 148.031)"
                    fill="#403F7D"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 148.031 174.154)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="34.832"
                    y="161.092"
                    width="4.35385"
                    height="8.7077"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="26.125"
                    y="161.092"
                    width="4.35385"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <path
                    d="M43.5388 121.907L43.5388 117.554L39.1849 117.554L39.1849 121.907L30.4772 121.907L30.4772 126.261L30.4772 134.969L21.7695 134.969L21.7695 156.738L47.8926 156.738L47.8926 148.031L47.8926 134.969L47.8926 126.261L43.5388 126.261L43.5388 121.907Z"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="39.1875"
                    y="143.676"
                    width="4.35385"
                    height="13.0615"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="34.832"
                    y="152.384"
                    width="4.35385"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="43.543"
                    y="126.261"
                    width="4.35385"
                    height="21.7692"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="30.4805"
                    y="169.8"
                    width="8.7077"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="17.4141"
                    y="156.738"
                    width="30.4769"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="39.1875"
                    y="117.554"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 39.1875 117.554)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="26.125"
                    y="169.8"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 26.125 169.8)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="21.7695"
                    y="165.446"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 21.7695 165.446)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="34.832"
                    y="121.906"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 34.832 121.906)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="26.125"
                    y="134.969"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 26.125 134.969)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="30.4805"
                    y="130.614"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 30.4805 130.614)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="43.543"
                    y="126.261"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 43.543 126.261)"
                    fill="#403F7D"
                  />
                  <rect
                    x="30.4805"
                    y="169.8"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 30.4805 169.8)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="21.7695"
                    y="143.676"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 21.7695 143.676)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="43.543"
                    y="156.738"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 43.543 156.738)"
                    fill="#403F7D"
                  />
                  <rect
                    x="17.4141"
                    y="156.738"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 17.4141 156.738)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="47.8945"
                    y="148.03"
                    width="21.7692"
                    height="4.35385"
                    transform="rotate(-90 47.8945 148.03)"
                    fill="#403F7D"
                  />
                  <rect
                    x="39.1875"
                    y="174.153"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 39.1875 174.153)"
                    fill="#5A5AB5"
                  />
                  <path
                    d="M52.2461 113.199H60.9538V117.553H69.6615V121.941H78.3692V126.26H108.846V121.941H117.554V117.553H126.262V113.199H134.969V104.491H52.2461V113.199Z"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 82.7266 126.261)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 87.082 117.554)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 74.0195 121.907)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="113.207"
                    y="121.907"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 113.207 121.907)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 69.668 117.554)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="117.559"
                    y="117.554"
                    width="4.35385"
                    height="8.7077"
                    transform="rotate(-90 117.559 117.554)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 56.6055 113.199)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="130.621"
                    y="113.199"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 130.621 113.199)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 104.5 117.554)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 108.852 126.261)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="21.7692"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 104.5 126.262)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="52.2461"
                    y="113.198"
                    width="8.7077"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 134.973 113.198)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="65.3086"
                    y="121.905"
                    width="8.7077"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 121.91 121.905)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="43.543"
                    y="108.845"
                    width="8.7077"
                    height="4.35385"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 143.68 108.845)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="56.6016"
                    y="117.552"
                    width="13.0615"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 130.617 117.552)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="74.0156"
                    y="126.26"
                    width="39.1846"
                    height="4.35385"
                    fill="#403F7D"
                  />
                  <rect
                    x="78.3711"
                    y="117.552"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 78.3711 117.552)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 108.848 117.552)"
                    fill="#403F7D"
                  />
                  <rect
                    x="82.7266"
                    y="113.198"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 82.7266 113.198)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 104.492 113.198)"
                    fill="#403F7D"
                  />
                  <rect
                    x="47.8945"
                    y="108.845"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 47.8945 108.845)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 139.324 108.845)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="74.0156"
                    y="126.26"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 74.0156 126.26)"
                    fill="#403F7D"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 113.203 126.26)"
                    fill="#403F7D"
                  />
                  <path
                    d="M104.497 26.1219V21.7681H82.7276V26.1219H60.9584V30.4758H56.6045V34.8296H52.2507V43.5373H47.8968V56.5989H43.543V91.4297H47.8968V95.7835H52.2507V100.137H60.9584V104.491H126.266V100.137H134.974V95.7835H139.328V91.4297H143.681V56.5989H139.328V43.5373H134.974V34.8296H130.62V30.4758H126.266V26.1219H104.497Z"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="60.957"
                    y="100.137"
                    width="65.3077"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="52.2461"
                    y="95.7832"
                    width="13.0615"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(-1 0 1.16564e-07 1 134.973 95.7832)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="47.8945"
                    y="91.4287"
                    width="8.7077"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 1.16564e-07 1 139.324 91.4287)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="43.5391"
                    y="87.0752"
                    width="13.0615"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(-1 0 1.16564e-07 1 143.68 87.0752)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="43.5391"
                    y="65.3057"
                    width="8.7077"
                    height="21.7692"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="21.7692"
                    transform="matrix(-1 0 1.16564e-07 1 143.68 65.3057)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="30.4769"
                    height="8.7077"
                    transform="matrix(-1 0 1.16564e-07 1 108.848 52.2441)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="21.7692"
                    height="4.35385"
                    transform="matrix(-1 0 1.16564e-07 1 104.492 60.9521)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(-1 0 1.16564e-07 1 47.8945 56.5986)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(-1 0 1.16564e-07 1 143.68 56.5986)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(-1 0 1.16564e-07 1 134.973 78.3672)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(-1 0 1.16564e-07 1 56.6016 78.3672)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="13.0615"
                    transform="matrix(-1 0 1.16564e-07 1 82.7227 87.0752)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 1.16564e-07 1 82.7227 65.3057)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="104.492"
                    y="65.3057"
                    width="4.35385"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="82.7227"
                    y="69.6592"
                    width="21.7692"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="13.0615"
                    transform="matrix(-1 0 1.16564e-07 1 108.848 87.0752)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="13.0615"
                    transform="matrix(-4.37114e-08 1 1 -7.28523e-08 87.0742 87.0752)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="52.2461"
                    y="100.139"
                    width="8.7077"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 134.973 100.139)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="60.957"
                    y="21.7695"
                    width="21.7692"
                    height="4.35385"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="104.492"
                    y="21.7695"
                    width="21.7692"
                    height="4.35385"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="78.3711"
                    y="17.415"
                    width="30.4769"
                    height="4.35385"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="60.957"
                    y="104.491"
                    width="65.3077"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="56.6016"
                    y="30.4766"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 56.6016 30.4766)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 130.617 30.4766)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="52.2461"
                    y="34.8301"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 52.2461 34.8301)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 134.973 34.8301)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="43.543"
                    y="95.7852"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 43.543 95.7852)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 143.68 95.7852)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="47.8945"
                    y="100.139"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 47.8945 100.139)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 139.324 100.139)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="47.8945"
                    y="43.5381"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 47.8945 43.5381)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 139.324 43.5381)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="43.543"
                    y="56.5996"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 43.543 56.5996)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 143.68 56.5996)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="39.1875"
                    y="91.4307"
                    width="26.1231"
                    height="4.35385"
                    transform="rotate(-90 39.1875 91.4307)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="26.1231"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 148.035 91.4307)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 39.1875 56.5996)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="148.035"
                    y="56.5996"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(90 148.035 56.5996)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="47.8945"
                    y="69.6602"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 47.8945 69.6602)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 139.324 69.6602)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="56.6016"
                    y="60.9531"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 56.6016 60.9531)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 130.617 60.9531)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="52.2461"
                    y="56.5986"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 52.2461 56.5986)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="130.617"
                    y="56.5986"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 130.617 56.5986)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="69.6602"
                    y="69.6602"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 69.6602 69.6602)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 117.559 69.6602)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="74.0156"
                    y="74.0146"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 74.0156 74.0146)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 113.203 74.0146)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="126.262"
                    y="39.1836"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(180 126.262 39.1836)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="69.6602"
                    y="39.1836"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(180 69.6602 39.1836)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="69.6602"
                    y="65.3066"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(180 69.6602 65.3066)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(1 8.74228e-08 8.74228e-08 -1 117.559 65.3066)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="69.6602"
                    y="78.3682"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(180 69.6602 78.3682)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(1 8.74228e-08 8.74228e-08 -1 117.559 78.3682)"
                    fill="#403F7D"
                  />
                  <rect
                    x="87.0742"
                    y="91.4297"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(90 87.0742 91.4297)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="104.492"
                    y="91.4297"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(90 104.492 91.4297)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-5.99471e-07 -1 -1 3.18729e-09 87.0742 91.4297)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-5.99471e-07 -1 -1 3.18729e-09 104.492 91.4297)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="74.0156"
                    y="91.4297"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(90 74.0156 91.4297)"
                    fill="#403F7D"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(4.37114e-08 1 1 -4.37114e-08 113.203 91.4297)"
                    fill="#403F7D"
                  />
                  <rect
                    x="69.6602"
                    y="82.7227"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 69.6602 82.7227)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 117.559 82.7227)"
                    fill="#403F7D"
                  />
                  <rect
                    x="74.0156"
                    y="91.4297"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 74.0156 91.4297)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 113.203 91.4297)"
                    fill="#403F7D"
                  />
                  <rect
                    x="78.3711"
                    y="82.7227"
                    width="30.4769"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="78.3711"
                    y="39.1836"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 78.3711 39.1836)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="78.3711"
                    y="65.3066"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 78.3711 65.3066)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="104.492"
                    y="65.3066"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 104.492 65.3066)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="100.141"
                    y="52.2451"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 100.141 52.2451)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="91.4297"
                    y="60.9531"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 91.4297 60.9531)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="82.7266"
                    y="52.2451"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 82.7266 52.2451)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="87.0742"
                    y="52.2451"
                    width="8.7077"
                    height="13.0615"
                    transform="rotate(-90 87.0742 52.2451)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="87.0742"
                    y="56.5986"
                    width="4.35385"
                    height="13.0615"
                    transform="rotate(-90 87.0742 56.5986)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="121.91"
                    y="34.8301"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 121.91 34.8301)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="60.957"
                    y="34.8301"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 60.957 34.8301)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="104.492"
                    y="39.1836"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 104.492 39.1836)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="74.0156"
                    y="60.9531"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 74.0156 60.9531)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="74.0156"
                    y="52.2451"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 74.0156 52.2451)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="108.848"
                    y="60.9531"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 108.848 60.9531)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="108.848"
                    y="52.2451"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 108.848 52.2451)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="91.4297"
                    y="52.2451"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 91.4297 52.2451)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="65.3086"
                    y="74.0146"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(180 65.3086 74.0146)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(1 8.74228e-08 8.74228e-08 -1 121.91 74.0146)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="69.6602"
                    y="91.4297"
                    width="17.4154"
                    height="4.35385"
                    transform="rotate(180 69.6602 91.4297)"
                    fill="#403F7D"
                  />
                  <rect
                    width="17.4154"
                    height="4.35385"
                    transform="matrix(1 8.74228e-08 8.74228e-08 -1 117.559 91.4297)"
                    fill="#403F7D"
                  />
                  <rect
                    x="74.0156"
                    y="39.1836"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(90 74.0156 39.1836)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="117.559"
                    y="39.1836"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(90 117.559 39.1836)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="104.492"
                    y="82.7227"
                    width="21.7692"
                    height="4.35385"
                    transform="rotate(180 104.492 82.7227)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="104.492"
                    y="69.6602"
                    width="21.7692"
                    height="4.35385"
                    transform="rotate(180 104.492 69.6602)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="104.492"
                    y="34.8301"
                    width="21.7692"
                    height="4.35385"
                    transform="rotate(180 104.492 34.8301)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="82.7266"
                    y="30.4756"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 82.7266 30.4756)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="100.141"
                    y="30.4756"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 100.141 30.4756)"
                    fill="#C2C2FF"
                  />
                  <path
                    d="M104.497 26.1234V21.7695H82.7276V26.1234H56.6045V34.8311H52.2507V43.5388H47.8968V56.6003H43.543V95.785H52.2507V100.139H60.9584V104.493H126.266V100.139H134.974V95.785H143.681V56.6003H139.328V43.5388H134.974V34.8311H130.62V26.1234H104.497ZM117.558 87.0773V91.4311H69.6661V87.0773H65.3122V78.3696H56.6045V56.6003V43.5388H60.9584V34.8311H126.266V43.5388H130.62V56.6003V78.3696H121.912V87.0773H117.558Z"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="91.4297"
                    y="26.123"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(90 91.4297 26.123)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="65.3086"
                    y="91.4307"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(90 65.3086 91.4307)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="126.262"
                    y="91.4307"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(90 126.262 91.4307)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="100.141"
                    y="26.123"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(90 100.141 26.123)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="95.7852"
                    y="30.4766"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(90 95.7852 30.4766)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="56.6016"
                    y="60.9531"
                    width="26.1231"
                    height="8.70743"
                    transform="rotate(90 56.6016 60.9531)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="26.1231"
                    height="8.70743"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 130.617 60.9531)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="60.957"
                    y="78.3691"
                    width="13.0615"
                    height="8.70743"
                    transform="rotate(90 60.957 78.3691)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="13.0615"
                    height="8.70743"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 126.262 78.3691)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="60.957"
                    y="91.4307"
                    width="4.35385"
                    height="4.35358"
                    transform="rotate(90 60.957 91.4307)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35358"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 126.262 91.4307)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="56.6016"
                    y="47.8926"
                    width="13.0615"
                    height="4.35358"
                    transform="rotate(90 56.6016 47.8926)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35358"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 130.617 47.8926)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="69.668"
                    y="87.0771"
                    width="4.35385"
                    height="8.70743"
                    transform="rotate(90 69.668 87.0771)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="60.957"
                    y="39.1846"
                    width="4.35385"
                    height="4.35412"
                    transform="rotate(90 60.957 39.1846)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35412"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 126.262 39.1846)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="87.082"
                    y="30.4766"
                    width="4.35385"
                    height="21.7687"
                    transform="rotate(90 87.082 30.4766)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="21.7687"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 100.141 30.4766)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="8.70743"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 117.555 87.0771)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="65.3125"
                    y="82.7227"
                    width="4.35385"
                    height="4.35358"
                    transform="rotate(90 65.3125 82.7227)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35358"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 121.91 82.7227)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="56.6016"
                    y="65.3076"
                    width="17.4154"
                    height="4.35385"
                    transform="rotate(90 56.6016 65.3076)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="17.4154"
                    height="4.35385"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 130.617 65.3076)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="60.957"
                    y="78.3691"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(90 60.957 78.3691)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 126.262 78.3691)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="65.3125"
                    y="82.7227"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(90 65.3125 82.7227)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 121.914 82.7227)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="117.555"
                    y="100.139"
                    width="4.35385"
                    height="47.8921"
                    transform="rotate(90 117.555 100.139)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="113.199"
                    y="95.7852"
                    width="4.35385"
                    height="39.1846"
                    transform="rotate(90 113.199 95.7852)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="100.141"
                    y="95.7852"
                    width="4.35385"
                    height="8.7077"
                    transform="rotate(90 100.141 95.7852)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="104.496"
                    y="100.139"
                    width="4.35385"
                    height="17.4157"
                    transform="rotate(90 104.496 100.139)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="52.2461"
                    y="100.139"
                    width="8.7077"
                    height="4.35385"
                    fill="#403F7D"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 134.973 100.139)"
                    fill="#403F7D"
                  />
                  <rect
                    x="60.957"
                    y="21.7695"
                    width="21.7692"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="104.492"
                    y="21.7695"
                    width="21.7692"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="78.3711"
                    y="17.415"
                    width="30.4769"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="60.957"
                    y="104.491"
                    width="65.3077"
                    height="4.35385"
                    fill="#403F7D"
                  />
                  <rect
                    x="82.7266"
                    y="104.491"
                    width="21.7692"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="60.957"
                    y="34.8301"
                    width="65.3077"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="69.6602"
                    y="34.8301"
                    width="21.7692"
                    height="4.35385"
                    fill="#403F7D"
                  />
                  <rect
                    x="60.957"
                    y="43.5381"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 60.957 43.5381)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="121.91"
                    y="43.5381"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 121.91 43.5381)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 91.4297 34.8301)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 100.141 34.8301)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 104.492 30.4766)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 87.0742 30.4766)"
                    fill="#403F7D"
                  />
                  <rect
                    x="60.957"
                    y="100.139"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 60.957 100.139)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="65.3086"
                    y="95.7852"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 65.3086 95.7852)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="69.6602"
                    y="91.4307"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 69.6602 91.4307)"
                    fill="black"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 117.559 91.4307)"
                    fill="black"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 121.91 87.0771)"
                    fill="black"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 69.6602 87.0771)"
                    fill="black"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 126.262 82.7227)"
                    fill="black"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 130.617 78.3691)"
                    fill="black"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 60.957 78.3691)"
                    fill="black"
                  />
                  <rect
                    x="130.617"
                    y="43.5381"
                    width="21.7692"
                    height="4.35385"
                    transform="rotate(90 130.617 43.5381)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="60.957"
                    y="43.5381"
                    width="21.7692"
                    height="4.35385"
                    transform="rotate(90 60.957 43.5381)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 65.3086 82.7227)"
                    fill="black"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 121.91 95.7852)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 126.262 100.139)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="56.6016"
                    y="30.4766"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 56.6016 30.4766)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 130.617 30.4766)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="52.2461"
                    y="34.8301"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 52.2461 34.8301)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 134.973 34.8301)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="43.543"
                    y="95.7852"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 43.543 95.7852)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 143.68 95.7852)"
                    fill="#403F7D"
                  />
                  <rect
                    x="47.8945"
                    y="100.139"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 47.8945 100.139)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 139.324 100.139)"
                    fill="#403F7D"
                  />
                  <rect
                    x="47.8945"
                    y="43.5381"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 47.8945 43.5381)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 139.324 43.5381)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="43.543"
                    y="56.5996"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 43.543 56.5996)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="113.203"
                    y="95.7852"
                    width="39.1846"
                    height="4.35385"
                    transform="rotate(180 113.203 95.7852)"
                    fill="black"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 143.68 56.5996)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="39.1875"
                    y="91.4307"
                    width="26.1231"
                    height="4.35385"
                    transform="rotate(-90 39.1875 91.4307)"
                    fill="#403F7D"
                  />
                  <rect
                    width="26.1231"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 148.035 91.4307)"
                    fill="#403F7D"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1.31134e-07 1 1 1.45705e-08 39.1875 56.5996)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="148.035"
                    y="56.5996"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(90 148.035 56.5996)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="87.0742"
                    y="91.4307"
                    width="21.7692"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="91.4297"
                    y="82.7227"
                    width="4.35385"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="82.7266"
                    y="82.7227"
                    width="4.35385"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="78.3711"
                    y="87.0771"
                    width="30.4769"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="100.141"
                    y="82.7227"
                    width="4.35385"
                    height="4.35385"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="78.3711"
                    y="82.7236"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="104.492"
                    y="82.7236"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="87.0742"
                    y="82.7236"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="95.7852"
                    y="82.7236"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="104.492"
                    y="82.7236"
                    width="21.7692"
                    height="4.35385"
                    transform="rotate(180 104.492 82.7236)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="56.6016"
                    y="191.569"
                    width="26.1231"
                    height="4.35385"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 113.203 174.153)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="74.0156"
                    y="174.153"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 74.0156 174.153)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 130.617 174.153)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 60.957 174.153)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="130.617"
                    y="161.092"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 130.617 161.092)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="52.2461"
                    y="161.092"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 52.2461 161.092)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 134.973 182.861)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="52.2461"
                    y="182.861"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 52.2461 182.861)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 139.324 191.569)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="47.8945"
                    y="191.569"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(-90 47.8945 191.569)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(0 -1 -1 -4.37114e-08 139.324 156.739)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="47.8945"
                    y="156.739"
                    width="4.35385"
                    height="4.35385"
                    transform="rotate(-90 47.8945 156.739)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 117.559 169.8)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 74.0156 169.8)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 126.262 165.445)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 69.6602 165.445)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="34.832"
                    y="191.569"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(-90 34.832 191.569)"
                    fill="#403F7D"
                  />
                  <rect
                    width="26.1231"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 130.617 191.569)"
                    fill="#403F7D"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 152.387 191.569)"
                    fill="#403F7D"
                  />
                  <path
                    d="M78.3711 243.815H108.848V239.462H78.3711V243.815Z"
                    fill="#5A5AB5"
                  />
                  <path
                    d="M34.8324 165.446H39.1863V169.799H43.5401V178.507H52.2478V187.215H56.6017V200.277H60.9555V213.338H56.6017V217.692H60.9555V235.107H47.894V230.753H39.1863V226.4H30.4786V222.046H21.7709V213.338H17.417V204.63H13.0632V200.276H8.70932V182.861H4.35547V169.8H8.70932V161.092H34.8324V165.446Z"
                    fill="#5A5AB5"
                  />
                  <path
                    d="M152.386 165.446H148.032V169.799H143.679V178.507H134.971V187.215H130.617V200.277H126.263V213.338H130.617V217.692H126.263V235.107H139.325V230.753H148.032V226.4H156.74V222.046H165.448V213.338H169.802V204.63H174.156V200.276H178.509V182.861H182.863V169.8H178.509V161.092H152.386V165.446Z"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="26.1226"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 143.676 174.153)"
                    fill="#403F7D"
                  />
                  <rect
                    x="43.5391"
                    y="174.153"
                    width="26.1231"
                    height="4.35398"
                    transform="rotate(180 43.5391 174.153)"
                    fill="#403F7D"
                  />
                  <rect
                    x="39.1836"
                    y="169.8"
                    width="8.70557"
                    height="4.35398"
                    transform="rotate(180 39.1836 169.8)"
                    fill="#403F7D"
                  />
                  <rect
                    width="8.70637"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 148.031 169.8)"
                    fill="#403F7D"
                  />
                  <rect
                    x="56.5977"
                    y="191.569"
                    width="8.7077"
                    height="4.35398"
                    transform="rotate(180 56.5977 191.569)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35358"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 130.617 191.569)"
                    fill="#403F7D"
                  />
                  <rect
                    x="34.8281"
                    y="165.446"
                    width="4.35358"
                    height="4.35398"
                    transform="rotate(180 34.8281 165.446)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35358"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 152.383 165.446)"
                    fill="#403F7D"
                  />
                  <rect
                    x="52.2461"
                    y="187.216"
                    width="4.35358"
                    height="8.70796"
                    transform="rotate(180 52.2461 187.216)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35358"
                    height="13.0618"
                    transform="matrix(1 0 0 -1 134.965 191.569)"
                    fill="#403F7D"
                  />
                  <rect
                    x="60.9531"
                    y="208.984"
                    width="4.35358"
                    height="8.70796"
                    transform="rotate(180 60.9531 208.984)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35358"
                    height="8.70796"
                    transform="matrix(1 0 0 -1 126.262 208.984)"
                    fill="#403F7D"
                  />
                  <rect
                    x="60.9531"
                    y="226.4"
                    width="4.35358"
                    height="8.70796"
                    transform="rotate(180 60.9531 226.4)"
                    fill="#403F7D"
                  />
                  <rect
                    width="4.35358"
                    height="8.70796"
                    transform="matrix(1 0 0 -1 126.262 226.4)"
                    fill="#403F7D"
                  />
                  <rect
                    width="34.8305"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 130.617 195.923)"
                    fill="#403F7D"
                  />
                  <rect
                    x="56.5977"
                    y="195.923"
                    width="34.8284"
                    height="4.35398"
                    transform="rotate(180 56.5977 195.923)"
                    fill="#403F7D"
                  />
                  <rect
                    width="26.1231"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 126.262 213.339)"
                    fill="#403F7D"
                  />
                  <rect
                    x="60.9531"
                    y="213.339"
                    width="26.1231"
                    height="4.35398"
                    transform="rotate(180 60.9531 213.339)"
                    fill="#403F7D"
                  />
                  <rect
                    width="13.0613"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 126.262 235.108)"
                    fill="#403F7D"
                  />
                  <rect
                    x="60.9531"
                    y="235.108"
                    width="13.0613"
                    height="4.35398"
                    transform="rotate(180 60.9531 235.108)"
                    fill="#403F7D"
                  />
                  <rect
                    width="21.769"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 126.262 230.754)"
                    fill="#403F7D"
                  />
                  <rect
                    x="60.9531"
                    y="230.754"
                    width="21.769"
                    height="4.35398"
                    transform="rotate(180 60.9531 230.754)"
                    fill="#403F7D"
                  />
                  <rect
                    width="13.061"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 165.449 178.508)"
                    fill="#403F7D"
                  />
                  <rect
                    x="21.7695"
                    y="178.508"
                    width="13.0597"
                    height="4.35398"
                    transform="rotate(180 21.7695 178.508)"
                    fill="#403F7D"
                  />
                  <rect
                    x="13.0625"
                    y="182.861"
                    width="4.35332"
                    height="4.35398"
                    transform="rotate(180 13.0625 182.861)"
                    fill="#403F7D"
                  />
                  <rect
                    width="8.70663"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 165.449 204.631)"
                    fill="#403F7D"
                  />
                  <rect
                    x="21.7695"
                    y="204.631"
                    width="8.70743"
                    height="4.35398"
                    transform="rotate(180 21.7695 204.631)"
                    fill="#403F7D"
                  />
                  <rect
                    width="17.4133"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 148.031 217.692)"
                    fill="#403F7D"
                  />
                  <rect
                    x="39.1836"
                    y="217.692"
                    width="17.4133"
                    height="4.35398"
                    transform="rotate(180 39.1836 217.692)"
                    fill="#403F7D"
                  />
                  <rect
                    width="8.70663"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 156.734 222.046)"
                    fill="#403F7D"
                  />
                  <rect
                    x="30.4805"
                    y="222.046"
                    width="8.70663"
                    height="4.35398"
                    transform="rotate(180 30.4805 222.046)"
                    fill="#403F7D"
                  />
                  <rect
                    width="17.4135"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 161.094 200.276)"
                    fill="#403F7D"
                  />
                  <rect
                    x="26.1211"
                    y="200.276"
                    width="13.0597"
                    height="4.35398"
                    transform="rotate(180 26.1211 200.276)"
                    fill="#403F7D"
                  />
                  <rect
                    width="8.70663"
                    height="4.35398"
                    transform="matrix(1 0 0 -1 174.152 182.861)"
                    fill="#403F7D"
                  />
                  <rect
                    x="17.4141"
                    y="174.153"
                    width="8.70584"
                    height="4.35372"
                    transform="rotate(180 17.4141 174.153)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="8.70584"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 169.801 174.153)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="30.4766"
                    y="169.8"
                    width="17.4109"
                    height="4.35372"
                    transform="rotate(180 30.4766 169.8)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="17.4138"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 156.734 169.8)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="47.8945"
                    y="191.568"
                    width="30.4775"
                    height="4.35372"
                    transform="rotate(180 47.8945 191.568)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="30.4785"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 139.32 191.568)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="8.71094"
                    y="182.861"
                    width="4.35358"
                    height="13.0614"
                    transform="rotate(180 8.71094 182.861)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="13.0614"
                    transform="matrix(1 0 0 -1 178.508 182.861)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="13.0625"
                    y="200.276"
                    width="4.35358"
                    height="8.7073"
                    transform="rotate(180 13.0625 200.276)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="8.7073"
                    transform="matrix(1 0 0 -1 174.156 200.276)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35425"
                    transform="matrix(-1 0 0 1 21.7695 191.568)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="165.449"
                    y="191.568"
                    width="8.7077"
                    height="4.35425"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="26.1211"
                    y="217.692"
                    width="4.35358"
                    height="4.35345"
                    transform="rotate(180 26.1211 217.692)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35345"
                    transform="matrix(1 0 0 -1 161.098 217.692)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="34.8281"
                    y="213.339"
                    width="17.4151"
                    height="4.35425"
                    transform="rotate(180 34.8281 213.339)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="17.4151"
                    height="4.35425"
                    transform="matrix(1 0 0 -1 152.387 213.339)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="56.5977"
                    y="208.985"
                    width="26.121"
                    height="4.35425"
                    transform="rotate(180 56.5977 208.985)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="26.121"
                    height="4.35425"
                    transform="matrix(1 0 0 -1 130.617 208.985)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="56.5977"
                    y="226.399"
                    width="26.1215"
                    height="4.35425"
                    transform="rotate(180 56.5977 226.399)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="26.1215"
                    height="4.35425"
                    transform="matrix(1 0 0 -1 130.617 226.399)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35146"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 169.797 169.8)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35146"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 165.445 191.569)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35146"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 152.387 208.985)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35146"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 165.449 213.338)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35146"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 152.387 226.4)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35146"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 174.148 195.923)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35146"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 178.512 174.153)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="17.418"
                    y="169.8"
                    width="4.35146"
                    height="4.35372"
                    transform="rotate(180 17.418 169.8)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="21.7734"
                    y="191.569"
                    width="4.35146"
                    height="4.35372"
                    transform="rotate(180 21.7734 191.569)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="34.832"
                    y="208.985"
                    width="4.35146"
                    height="4.35372"
                    transform="rotate(180 34.832 208.985)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="21.7695"
                    y="213.338"
                    width="4.35146"
                    height="4.35372"
                    transform="rotate(180 21.7695 213.338)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="34.832"
                    y="226.4"
                    width="4.35146"
                    height="4.35372"
                    transform="rotate(180 34.832 226.4)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="13.0703"
                    y="195.923"
                    width="4.35146"
                    height="4.35372"
                    transform="rotate(180 13.0703 195.923)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="8.70703"
                    y="174.153"
                    width="4.35146"
                    height="4.35372"
                    transform="rotate(180 8.70703 174.153)"
                    fill="#F2F4F7"
                  />
                  <path
                    d="M60.9567 169.798L65.3106 169.799V174.152L69.6644 174.152V178.506H74.0183V182.86H113.203V178.506H117.557V174.152L121.911 174.152V169.799L126.264 169.798V161.091H148.034V165.445H143.68V169.798L139.326 169.799V174.152L134.972 174.152V178.506L130.618 178.506V182.86H126.264V195.922H121.911V235.106H65.3106V195.922H60.9567V182.86H56.6029V178.506L52.249 178.506V174.152L47.8952 174.152V169.799L43.5413 169.798V165.445H39.1875V161.091H60.9567V169.798Z"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="13.0613"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 47.8945 165.445)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 52.2461 169.8)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 56.6016 174.153)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 60.957 178.507)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 65.3086 182.861)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="139.324"
                    y="165.445"
                    width="13.0613"
                    height="4.35385"
                    transform="rotate(180 139.324 165.445)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="134.973"
                    y="169.8"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(180 134.973 169.8)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="130.617"
                    y="174.153"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(180 130.617 174.153)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="126.262"
                    y="178.507"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(180 126.262 178.507)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="121.91"
                    y="182.861"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(180 121.91 182.861)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="56.5998"
                    height="8.7077"
                    transform="matrix(1 0 0 -1 65.3086 191.568)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="47.8918"
                    height="34.8308"
                    transform="matrix(1 0 0 -1 69.6602 226.399)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="30.4772"
                    height="30.4771"
                    transform="matrix(1 0 0 -1 78.3711 222.046)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 74.0156 191.568)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 82.7266 191.568)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 91.4297 191.568)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 100.141 191.568)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 82.7266 226.398)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 91.4297 226.398)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 100.141 226.398)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 74.0156 226.398)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 69.6602 187.215)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 65.3086 182.861)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 60.957 178.507)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 56.6016 174.153)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 52.2461 169.799)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35411"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 47.8906 165.445)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="113.199"
                    y="191.568"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 113.199 191.568)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="113.199"
                    y="226.398"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 113.199 226.398)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="113.199"
                    y="217.691"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 113.199 217.691)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="113.199"
                    y="208.984"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 113.199 208.984)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="113.199"
                    y="200.276"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 113.199 200.276)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="78.3711"
                    y="217.691"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 78.3711 217.691)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="78.3711"
                    y="208.984"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 78.3711 208.984)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="78.3711"
                    y="200.276"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 78.3711 200.276)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="117.555"
                    y="187.215"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 117.555 187.215)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="121.902"
                    y="182.861"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 121.902 182.861)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="126.258"
                    y="178.507"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 126.258 178.507)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="130.613"
                    y="174.153"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 130.613 174.153)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="134.969"
                    y="169.799"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 134.969 169.799)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="139.324"
                    y="165.445"
                    width="4.35411"
                    height="4.35385"
                    transform="rotate(180 139.324 165.445)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="74.0156"
                    y="226.399"
                    width="39.1846"
                    height="4.35385"
                    fill="#C2C2FF"
                  />
                  <path
                    d="M69.6624 169.799V174.153H74.0163V178.506H113.201V174.153H117.555V169.799H121.909V161.091H65.3086V169.799H69.6624Z"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="39.1841"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 74.0156 178.507)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.70743"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 69.6602 174.153)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="21.7692"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 82.7266 169.799)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 87.0742 174.153)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35411"
                    height="8.70756"
                    transform="matrix(1 0 0 -1 91.4297 174.153)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="117.559"
                    y="174.153"
                    width="8.70717"
                    height="4.35372"
                    transform="rotate(180 117.559 174.153)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="8.7077"
                    transform="matrix(1 0 0 -1 65.3086 169.799)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="47.8923"
                    height="4.35372"
                    transform="matrix(1 0 0 -1 69.6602 165.445)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="121.91"
                    y="169.799"
                    width="8.70717"
                    height="8.7077"
                    transform="rotate(180 121.91 169.799)"
                    fill="#5A5AB5"
                  />
                  <path
                    d="M13.0648 143.676H174.157V148.029H178.511V156.737H8.71094V148.029H13.0648V143.676Z"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="169.8"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 8.71094 156.737)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="13.0613"
                    height="13.0615"
                    transform="matrix(1 0 0 -1 87.0742 156.737)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35358"
                    height="13.0615"
                    transform="matrix(1 0 0 -1 13.0625 156.737)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 8.71094 152.384)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 174.152 152.384)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 161.094 156.737)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 148.035 156.737)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 134.973 156.737)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 121.91 156.737)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 108.848 156.737)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 74.0156 156.737)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 60.957 156.737)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 47.8945 156.737)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 34.832 156.737)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 21.7695 156.737)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 161.094 148.03)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 148.035 148.03)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 134.973 148.03)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 121.91 148.03)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 108.848 148.03)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 74.0156 148.03)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 60.957 148.03)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 47.8945 148.03)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 34.832 148.03)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35358"
                    height="4.35385"
                    transform="matrix(1 0 0 -1 21.7695 148.03)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35358"
                    height="13.0615"
                    transform="matrix(1 0 0 -1 169.805 156.737)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="8.71094"
                    y="139.322"
                    width="169.8"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="8.71094"
                    y="156.737"
                    width="169.8"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="21.7695"
                    y="148.03"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="108.848"
                    y="148.03"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="34.832"
                    y="148.03"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="121.91"
                    y="148.03"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="47.8945"
                    y="148.03"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="134.973"
                    y="148.03"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="60.957"
                    y="148.03"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="148.035"
                    y="148.03"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="74.0156"
                    y="148.03"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="161.094"
                    y="148.03"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="91.4297"
                    y="143.676"
                    width="4.35385"
                    height="13.0615"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="8.71094"
                    y="143.676"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 178.508 143.676)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="4.35547"
                    y="148.03"
                    width="4.35385"
                    height="13.0617"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="13.0617"
                    transform="matrix(-1 0 0 1 182.863 148.03)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="34.832"
                    y="161.092"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="39.1875"
                    y="165.445"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="43.543"
                    y="169.8"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="52.2461"
                    y="178.507"
                    width="4.35385"
                    height="8.7077"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="17.4141"
                    y="204.631"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="13.0625"
                    y="204.631"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="21.7695"
                    y="200.276"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="39.1875"
                    y="213.338"
                    width="21.7692"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="30.4805"
                    y="217.691"
                    width="8.7077"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="26.125"
                    y="195.923"
                    width="34.8308"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="60.957"
                    y="195.923"
                    width="4.35385"
                    height="39.1846"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="56.6016"
                    y="182.861"
                    width="4.35385"
                    height="13.0615"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="21.7695"
                    y="174.153"
                    width="30.4769"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="13.0625"
                    y="178.507"
                    width="8.7077"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="8.71094"
                    y="182.861"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="4.35547"
                    y="161.092"
                    width="4.35385"
                    height="8.70756"
                    fill="#1C1C3F"
                  />
                  <rect
                    y="165.445"
                    width="4.35385"
                    height="17.4154"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="4.35547"
                    y="182.861"
                    width="4.35385"
                    height="17.4154"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="8.71094"
                    y="200.276"
                    width="4.35385"
                    height="8.7077"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="13.0625"
                    y="208.984"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="17.4141"
                    y="213.338"
                    width="4.35385"
                    height="8.7077"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="21.7695"
                    y="222.046"
                    width="8.7077"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="26.125"
                    y="226.4"
                    width="13.0615"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="30.4805"
                    y="230.754"
                    width="17.4154"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="47.8945"
                    y="235.107"
                    width="17.4151"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.387 161.092)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 148.035 165.445)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 143.68 169.8)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(-1 0 0 1 134.973 178.507)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 169.805 204.631)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 174.152 204.631)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 165.449 200.276)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="21.7692"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 148.035 213.338)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 156.738 217.691)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="34.8308"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 161.094 195.923)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="39.1846"
                    transform="matrix(-1 0 0 1 126.262 195.923)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="13.0615"
                    transform="matrix(-1 0 0 1 130.617 182.861)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="30.4769"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 165.449 174.153)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 174.152 178.507)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 178.508 182.861)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="8.70756"
                    transform="matrix(-1 0 0 1 182.863 161.092)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="17.4154"
                    transform="matrix(-1 0 0 1 187.219 165.445)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="17.4154"
                    transform="matrix(-1 0 0 1 182.863 182.861)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(-1 0 0 1 178.508 200.276)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 174.152 208.984)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(-1 0 0 1 169.805 213.338)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 165.449 222.046)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 161.094 226.4)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="17.4154"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 156.738 230.754)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="121.906"
                    y="235.107"
                    width="17.4154"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="60.957"
                    y="161.092"
                    width="4.35385"
                    height="8.70756"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="8.70756"
                    transform="matrix(-1 0 0 1 126.262 161.092)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="65.3086"
                    y="169.8"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 121.91 169.8)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="69.6602"
                    y="174.153"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 117.559 174.153)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="74.0156"
                    y="178.507"
                    width="39.1846"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="65.3086"
                    y="235.107"
                    width="56.6"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="74.0156"
                    y="239.461"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 113.203 239.461)"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="78.3711"
                    y="243.815"
                    width="30.4769"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="87.0742"
                    y="195.923"
                    width="13.0615"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="87.0742"
                    y="213.338"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="82.7266"
                    y="208.984"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="82.7266"
                    y="200.276"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="95.7852"
                    y="213.338"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="91.4297"
                    y="208.984"
                    width="4.35385"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="100.141"
                    y="200.276"
                    width="4.35385"
                    height="13.0615"
                    fill="#1C1C3F"
                  />
                  <path
                    d="M152.384 74.0139L152.384 78.3678L156.738 78.3678L156.738 113.199V117.552L156.738 121.906L152.384 121.906L152.384 117.552L148.031 117.552L148.031 113.199L143.677 113.199L143.677 104.491L134.969 104.491L134.969 100.137L143.677 100.137L143.677 91.4293L148.031 91.4293L148.031 82.7216L148.031 78.3678L148.031 74.0139L152.384 74.0139Z"
                    fill="black"
                  />
                  <path
                    d="M34.8343 74.0139L34.8343 78.3678L30.4805 78.3678L30.4805 113.199L30.4805 117.552L30.4805 121.906L34.8343 121.906L34.8343 117.552L39.1882 117.552L39.1882 113.199L43.542 113.199L43.542 104.491L52.2497 104.491L52.2497 100.137L43.542 100.137L43.542 91.4293L39.1882 91.4293L39.1882 82.7216L39.1882 78.3678L39.1882 74.0139L34.8343 74.0139Z"
                    fill="black"
                  />
                  <rect
                    x="26.125"
                    y="78.3691"
                    width="4.35385"
                    height="52.2462"
                    fill="#403F7D"
                  />
                  <rect
                    x="30.4805"
                    y="74.0156"
                    width="4.35385"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="34.832"
                    y="69.6611"
                    width="4.35385"
                    height="4.35385"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="39.1875"
                    y="95.7852"
                    width="8.7077"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    x="39.1875"
                    y="104.491"
                    width="8.7077"
                    height="4.35385"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="52.2462"
                    transform="matrix(-1 0 0 1 161.094 78.3691)"
                    fill="#403F7D"
                  />
                  <rect
                    x="26.125"
                    y="78.3691"
                    width="4.35385"
                    height="26.1231"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="26.1231"
                    transform="matrix(-1 0 0 1 161.094 78.3691)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="26.125"
                    y="113.199"
                    width="4.35385"
                    height="17.4154"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="17.4154"
                    transform="matrix(-1 0 0 1 161.094 113.199)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 156.738 74.0156)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 152.387 69.6611)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 148.035 95.7852)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-1 0 0 1 148.035 104.491)"
                    fill="#1C1C3F"
                  />
                  <rect
                    width="4.35385"
                    height="39.1846"
                    transform="matrix(-1 0 0 1 13.0625 65.3076)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="174.156"
                    y="65.3076"
                    width="4.35385"
                    height="39.1846"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="4.35385"
                    height="34.8308"
                    transform="matrix(-1 0 0 1 13.0625 104.491)"
                    fill="#403F7D"
                  />
                  <rect
                    x="174.156"
                    y="104.491"
                    width="4.35385"
                    height="34.8308"
                    fill="#403F7D"
                  />
                  <rect
                    x="13.0625"
                    y="65.3076"
                    width="4.35385"
                    height="8.7077"
                    transform="rotate(180 13.0625 65.3076)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(1 0 0 -1 174.156 65.3076)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="4.35385"
                    height="74.0154"
                    transform="matrix(-4.37114e-08 1 1 4.37114e-08 56.6016 0)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(-4.37114e-08 1 1 4.37114e-08 39.1875 8.70703)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="148.031"
                    y="8.70703"
                    width="4.35385"
                    height="8.7077"
                    transform="rotate(90 148.031 8.70703)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="4.35385"
                    height="13.0615"
                    transform="matrix(-4.37114e-08 1 1 4.37114e-08 47.8945 4.35352)"
                    fill="#F2F4F7"
                  />
                  <rect
                    x="139.328"
                    y="4.35352"
                    width="4.35385"
                    height="13.0615"
                    transform="rotate(90 139.328 4.35352)"
                    fill="#F2F4F7"
                  />
                  <rect
                    width="4.35385"
                    height="8.7077"
                    transform="matrix(-4.37114e-08 1 1 4.37114e-08 30.4766 13.0605)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="156.742"
                    y="13.0605"
                    width="4.35385"
                    height="8.7077"
                    transform="rotate(90 156.742 13.0605)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-4.37114e-08 1 1 4.37114e-08 26.125 17.415)"
                    fill="#C2C2FF"
                  />
                  <rect
                    x="161.094"
                    y="17.415"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(90 161.094 17.415)"
                    fill="#C2C2FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-4.37114e-08 1 1 4.37114e-08 17.418 34.8301)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="169.801"
                    y="34.8301"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(90 169.801 34.8301)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="8.7077"
                    height="4.35385"
                    transform="matrix(-4.37114e-08 1 1 4.37114e-08 21.7734 26.123)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="165.445"
                    y="26.123"
                    width="8.7077"
                    height="4.35385"
                    transform="rotate(90 165.445 26.123)"
                    fill="#A0A0FF"
                  />
                  <rect
                    width="13.0615"
                    height="4.35385"
                    transform="matrix(-4.37114e-08 1 1 4.37114e-08 13.0625 43.5381)"
                    fill="#A0A0FF"
                  />
                  <rect
                    x="174.156"
                    y="43.5381"
                    width="13.0615"
                    height="4.35385"
                    transform="rotate(90 174.156 43.5381)"
                    fill="#A0A0FF"
                  />
                  <StyledBoosters>
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 121.656 261.23)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="13.061"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 126.008 265.584)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 104.242 261.23)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 104.242 274.292)"
                      fill="#9DC1D8"
                    />
                    <rect
                      width="13.061"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 108.594 265.584)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 86.8281 261.23)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 86.8281 274.292)"
                      fill="#9DC1D8"
                    />
                    <rect
                      width="13.0615"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 91.1797 265.584)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 69.4141 261.23)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 69.4141 274.292)"
                      fill="#9DC1D8"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 134.719 274.292)"
                      fill="#9DC1D8"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 56.3516 274.292)"
                      fill="#9DC1D8"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 121.656 274.292)"
                      fill="#9DC1D8"
                    />
                    <rect
                      width="13.0607"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 73.7656 265.584)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="74.0152"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 130.363 269.938)"
                      fill="#9DC1D8"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 69.4141 269.938)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 86.8281 269.938)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 104.242 269.938)"
                      fill="#E0F7FA"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 121.656 269.938)"
                      fill="#E0F7FA"
                    />
                    <rect
                      x="82.832"
                      y="256.877"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="65.4141"
                      y="256.877"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="87.1875"
                      y="261.23"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="78.4805"
                      y="261.23"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="61.0664"
                      y="261.23"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="69.7695"
                      y="261.23"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="91.5391"
                      y="265.584"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="104.602"
                      y="261.23"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="108.953"
                      y="265.584"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="100.246"
                      y="256.877"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="95.8945"
                      y="261.23"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 117.66 261.23)"
                      fill="#5A7C90"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 122.016 256.877)"
                      fill="#5A7C90"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 126.371 261.23)"
                      fill="#5A7C90"
                    />
                    <rect
                      x="74.125"
                      y="265.584"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="56.7109"
                      y="265.584"
                      width="4.35385"
                      height="4.35385"
                      fill="#5A7C90"
                    />
                    <rect
                      x="65.4141"
                      y="278.646"
                      width="4.35385"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="52.3555"
                      y="278.646"
                      width="4.35385"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="56.7109"
                      y="274.292"
                      width="8.7077"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="69.7695"
                      y="274.292"
                      width="13.0615"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="104.602"
                      y="274.292"
                      width="13.0615"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="135.078"
                      y="274.292"
                      width="4.35385"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="48"
                      y="274.292"
                      width="4.35385"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="82.832"
                      y="278.646"
                      width="4.35385"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="117.66"
                      y="278.646"
                      width="4.35385"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="87.1875"
                      y="274.292"
                      width="13.0618"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="122.016"
                      y="274.292"
                      width="8.7077"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="100.246"
                      y="278.646"
                      width="4.35385"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="130.727"
                      y="278.646"
                      width="4.35385"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="130.727"
                      y="269.938"
                      width="4.35385"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      x="52.3555"
                      y="269.938"
                      width="4.35385"
                      height="4.35385"
                      fill="#3A4A69"
                    />
                    <rect
                      width="4.35385"
                      height="4.35385"
                      transform="matrix(-1 0 0 1 130.727 265.584)"
                      fill="#5A7C90"
                    />
                  </StyledBoosters>
                </svg>

                <StyledFlagImage $isVisible={isFlagVisible}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 141 172"
                    fill="none"
                  >
                    <path
                      d="M135.119 56.6379H129.97V61.7867H119.672V66.9356H109.374V61.7867H99.0767H73.3324V66.9356H68.1836V61.7867V15.4471H73.3324V10.2983H83.6301V5.14941H99.0767V10.2983H109.374V15.4471H119.672V10.2983H129.97V5.14941H135.119V56.6379Z"
                      fill="#9DC1D8"
                    />
                    <rect
                      x="83.625"
                      y="5.14941"
                      width="15.4465"
                      height="5.14885"
                      fill="#E0F7FA"
                    />
                    <rect
                      x="73.3281"
                      y="10.2979"
                      width="36.0419"
                      height="5.14885"
                      fill="#E0F7FA"
                    />
                    <rect
                      x="83.625"
                      y="15.4463"
                      width="15.4465"
                      height="20.5954"
                      fill="#E0F7FA"
                    />
                    <rect
                      x="73.3281"
                      y="15.4463"
                      width="10.2977"
                      height="25.7444"
                      fill="#E0F7FA"
                    />
                    <rect
                      x="68.1836"
                      y="15.4463"
                      width="5.14885"
                      height="30.8931"
                      fill="#E0F7FA"
                    />
                    <rect
                      x="99.0703"
                      y="15.4463"
                      width="10.2977"
                      height="25.7444"
                      fill="#E0F7FA"
                    />
                    <rect
                      x="109.371"
                      y="15.4463"
                      width="10.2977"
                      height="30.8932"
                      fill="#E0F7FA"
                    />
                    <rect
                      x="119.664"
                      y="10.2979"
                      width="10.2977"
                      height="30.8931"
                      fill="#E0F7FA"
                    />
                    <rect
                      x="129.965"
                      y="5.14941"
                      width="5.14885"
                      height="30.8931"
                      fill="#E0F7FA"
                    />
                    <rect
                      x="68.1836"
                      y="66.9346"
                      width="5.14885"
                      height="5.14885"
                      fill="#3A4A69"
                    />
                    <rect
                      x="68.1836"
                      y="10.2979"
                      width="5.14885"
                      height="5.14885"
                      fill="#5A7C90"
                    />
                    <rect
                      x="73.3281"
                      y="61.7861"
                      width="10.2977"
                      height="5.14885"
                      fill="#3A4A69"
                    />
                    <rect
                      x="73.3281"
                      y="5.14941"
                      width="10.2977"
                      height="5.14885"
                      fill="#5A7C90"
                    />
                    <rect
                      x="99.0703"
                      y="61.7861"
                      width="10.2977"
                      height="5.14885"
                      fill="#3A4A69"
                    />
                    <rect
                      x="99.0703"
                      y="5.14941"
                      width="10.2977"
                      height="5.14885"
                      fill="#5A7C90"
                    />
                    <rect
                      x="109.371"
                      y="66.9346"
                      width="10.2977"
                      height="5.14885"
                      fill="#3A4A69"
                    />
                    <rect
                      x="109.371"
                      y="10.2979"
                      width="10.2977"
                      height="5.14885"
                      fill="#5A7C90"
                    />
                    <rect
                      x="119.664"
                      y="61.7861"
                      width="10.2977"
                      height="5.14885"
                      fill="#3A4A69"
                    />
                    <rect
                      x="119.664"
                      y="5.14941"
                      width="10.2977"
                      height="5.14885"
                      fill="#5A7C90"
                    />
                    <rect
                      x="129.965"
                      y="56.6377"
                      width="10.2977"
                      height="5.14885"
                      fill="#3A4A69"
                    />
                    <rect
                      x="135.113"
                      y="5.14941"
                      width="5.14885"
                      height="30.8931"
                      fill="#5A7C90"
                    />
                    <rect
                      x="135.113"
                      y="36.042"
                      width="5.14885"
                      height="20.5954"
                      fill="#3A4A69"
                    />
                    <rect x="63" y="46" width="5" height="126" fill="#3A4A69" />
                    <rect
                      x="63.0312"
                      y="5.14941"
                      width="5.14885"
                      height="41.1906"
                      fill="#5A7C90"
                    />
                    <rect
                      x="129.965"
                      width="10.2977"
                      height="5.14885"
                      fill="#5A7C90"
                    />
                    <rect
                      x="83.625"
                      y="56.6377"
                      width="15.4465"
                      height="5.14885"
                      fill="#3A4A69"
                    />
                    <rect
                      x="83.625"
                      width="15.4465"
                      height="5.14885"
                      fill="#5A7C90"
                    />
                    <rect
                      x="88.7773"
                      y="30.8936"
                      width="5.14885"
                      height="5.14885"
                      transform="rotate(-90 88.7773 30.8936)"
                      fill="#3A4A69"
                    />
                    <rect
                      x="88.7773"
                      y="41.1914"
                      width="5.14885"
                      height="5.14885"
                      transform="rotate(-90 88.7773 41.1914)"
                      fill="#3A4A69"
                    />
                    <rect
                      x="93.9219"
                      y="46.3398"
                      width="5.14885"
                      height="5.14885"
                      transform="rotate(-90 93.9219 46.3398)"
                      fill="#3A4A69"
                    />
                    <rect
                      x="99.0703"
                      y="41.1914"
                      width="5.14885"
                      height="5.14885"
                      transform="rotate(-90 99.0703 41.1914)"
                      fill="#3A4A69"
                    />
                    <rect
                      x="104.219"
                      y="46.3398"
                      width="5.14885"
                      height="5.14885"
                      transform="rotate(-90 104.219 46.3398)"
                      fill="#3A4A69"
                    />
                    <rect
                      x="109.371"
                      y="41.1914"
                      width="15.4465"
                      height="5.14885"
                      transform="rotate(-90 109.371 41.1914)"
                      fill="#3A4A69"
                    />
                    <rect
                      x="109.371"
                      y="25.7441"
                      width="15.4465"
                      height="5.14885"
                      transform="rotate(180 109.371 25.7441)"
                      fill="#3A4A69"
                    />
                    <StyledHand>
                      <rect
                        y="134"
                        width="4"
                        height="68"
                        transform="rotate(-90 0 134)"
                        fill="#A0A0FF"
                      />
                    </StyledHand>
                  </svg>
                </StyledFlagImage>
              </StyledAlienContainer>
              <svg
                viewBox="0 0 1440 682"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_4623_124989)">
                  <ellipse
                    cx="700.5"
                    cy="763.5"
                    rx="975.5"
                    ry="339.5"
                    fill="url(#paint0_linear_4623_124989)"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.827157 0.56197 -0.867698 -0.497093 972.695 521.513)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.827157 0.56197 -0.867698 -0.497093 973.445 541.02)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.867698 0.497093 -0.827157 0.56197 1052.6 567.295)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.867698 0.497093 -0.827157 0.56197 1083.83 566.096)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.827157 0.56197 -0.867698 -0.497093 910.262 523.9)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.827157 -0.56197 0.867697 0.497093 1184.14 557.983)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1076 591.429)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.827157 0.56197 -0.867698 -0.497093 1125.45 657.91)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.867698 0.497093 -0.827157 0.56197 1233.59 624.466)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="55.2581"
                    transform="matrix(0.827157 -0.56197 0.867697 0.497093 1123.2 599.389)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="55.2581"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1139.93 628.052)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.827157 -0.56197 0.867697 0.497093 1277.8 554.398)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1073.77 532.906)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.827157 -0.56197 0.867697 0.497093 1277.05 534.893)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1042.55 534.102)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1197.89 508.615)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1166.67 509.812)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.827157 0.56197 -0.867698 -0.497093 997.578 584.659)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.827157 -0.56197 0.867698 0.497093 1312.01 631.232)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.827157 0.56197 -0.867698 -0.497093 998.332 604.17)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.827157 -0.56197 0.867698 0.497093 1311.26 611.723)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1072.27 493.89)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.827157 -0.56197 0.867698 0.497093 1340.24 552.006)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6763"
                    transform="matrix(0.867698 0.497093 -0.827157 0.56197 1107.22 590.232)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.867698 0.497093 -0.827157 0.56197 1267.05 681.792)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6764"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1202.37 625.662)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="36.8376"
                    transform="matrix(0.867698 0.497093 -0.827157 0.56197 1107.97 609.74)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6763"
                    transform="matrix(-0.827157 0.56197 -0.867698 -0.497093 1184.89 577.492)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6763"
                    transform="matrix(0.827157 -0.56197 0.867698 0.497093 1124.7 638.402)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4182"
                    transform="matrix(0.867698 0.497093 -0.827157 0.56197 1108.71 629.247)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="36.8376"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1201.62 606.155)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="36.8376"
                    transform="matrix(-0.827157 0.56197 -0.867698 -0.497093 1153.68 578.688)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6775"
                    transform="matrix(0.867698 0.497093 -0.827157 0.56197 1060.77 601.778)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="36.8376"
                    transform="matrix(0.827157 -0.56197 0.867698 0.497093 1155.92 637.208)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4182"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1200.88 586.647)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4182"
                    transform="matrix(-0.827157 0.56197 -0.867698 -0.497093 1122.46 579.882)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4182"
                    transform="matrix(0.827157 -0.56197 0.867698 0.497093 1187.14 636.013)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6775"
                    transform="matrix(-0.867698 -0.497093 0.827157 -0.56197 1248.82 614.116)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6775"
                    transform="matrix(-0.827157 0.56197 -0.867698 -0.497093 1168.16 548.828)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6775"
                    transform="matrix(0.827157 -0.56197 0.867698 0.497093 1141.43 667.065)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4193"
                    transform="matrix(0.748413 0.663233 0.924193 -0.381926 462.656 546.575)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4193"
                    transform="matrix(0.748413 0.663233 0.924193 -0.381926 459.418 565.826)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4193"
                    height="18.4194"
                    transform="matrix(-0.924193 0.381926 0.748412 0.663233 377.547 581.752)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4193"
                    height="18.4194"
                    transform="matrix(-0.924193 0.381926 0.748412 0.663233 346.734 576.565)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4193"
                    transform="matrix(0.748413 0.663233 0.924193 -0.381926 524.273 556.936)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.748413 -0.663233 -0.924193 0.381926 248.277 555.678)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 351.25 602.69)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.748413 0.663233 0.924193 -0.381926 293.703 662.296)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.924193 0.381926 0.748412 0.663233 190.73 615.283)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="55.2581"
                    transform="matrix(-0.748413 -0.663233 -0.924193 0.381926 303.414 604.543)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="55.2581"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 283.156 630.829)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.748413 -0.663233 -0.924193 0.381926 155.852 540.134)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 360.961 544.938)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.924193 0.381926 0.748412 0.663233 181.02 673.037)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.748413 -0.663233 -0.924193 0.381926 159.09 520.883)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 391.77 550.119)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 240.965 504.956)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 271.777 510.141)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.748413 0.663233 0.924193 -0.381926 429.895 606.017)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.748412 -0.663233 -0.924193 0.381926 112.086 611.955)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.748413 0.663233 0.924193 -0.381926 426.652 625.271)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.748412 -0.663233 -0.924193 0.381926 115.328 592.702)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 367.434 506.432)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.748412 -0.663233 -0.924193 0.381926 94.2344 529.768)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6764"
                    transform="matrix(-0.924193 0.381926 0.748412 0.663233 320.438 597.509)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4194"
                    transform="matrix(-0.924193 0.381926 0.748412 0.663233 150.211 667.855)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6763"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 221.539 620.467)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="36.8376"
                    transform="matrix(-0.924193 0.381926 0.748412 0.663233 317.203 616.76)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6763"
                    transform="matrix(0.748413 0.663233 0.924193 -0.381926 245.039 574.93)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6764"
                    transform="matrix(-0.748412 -0.663233 -0.924193 0.381926 296.941 643.045)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4182"
                    transform="matrix(-0.924193 0.381926 0.748412 0.663233 313.965 636.011)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="36.8376"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 224.777 601.215)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="36.8376"
                    transform="matrix(0.748413 0.663233 0.924193 -0.381926 275.848 580.111)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6775"
                    transform="matrix(-0.924193 0.381926 0.748412 0.663233 365.031 614.905)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="36.8376"
                    transform="matrix(-0.748412 -0.663233 -0.924193 0.381926 266.133 637.863)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4182"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 228.016 581.964)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4182"
                    transform="matrix(0.748413 0.663233 0.924193 -0.381926 306.656 585.293)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="18.4182"
                    transform="matrix(-0.748412 -0.663233 -0.924193 0.381926 235.324 632.683)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6775"
                    transform="matrix(0.924193 -0.381926 -0.748413 -0.663233 176.945 603.069)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6775"
                    transform="matrix(0.748413 0.663233 0.924193 -0.381926 265.301 548.644)"
                    fill="#323269"
                  />
                  <rect
                    width="18.4194"
                    height="73.6775"
                    transform="matrix(-0.748412 -0.663233 -0.924193 0.381926 276.68 669.33)"
                    fill="#323269"
                  />
                  <rect
                    x="1028"
                    y="409.26"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="1035.26"
                    y="402"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <StyledTwinkle>
                    <rect
                      x="76.2656"
                      y="374.408"
                      width="6.28567"
                      height="12.5713"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="69.9766"
                      y="386.979"
                      width="6.28567"
                      height="6.28567"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="69.9766"
                      y="399.551"
                      width="6.28567"
                      height="6.28567"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="82.5508"
                      y="386.979"
                      width="6.28567"
                      height="6.28567"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="82.5508"
                      y="399.551"
                      width="6.28567"
                      height="6.28567"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="76.2656"
                      y="405.836"
                      width="6.28567"
                      height="12.5713"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="57.4062"
                      y="399.551"
                      width="6.28567"
                      height="12.5713"
                      transform="rotate(-90 57.4062 399.551)"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="88.8359"
                      y="399.551"
                      width="6.28567"
                      height="12.5713"
                      transform="rotate(-90 88.8359 399.551)"
                      fill="#5A5AB5"
                    />
                  </StyledTwinkle>
                  <StyledTwinkle>
                    <rect
                      x="736.145"
                      y="144"
                      width="5.38119"
                      height="10.7624"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="730.762"
                      y="154.763"
                      width="5.38119"
                      height="5.38119"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="730.762"
                      y="165.524"
                      width="5.38119"
                      height="5.38119"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="741.523"
                      y="154.763"
                      width="5.38119"
                      height="5.38119"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="741.523"
                      y="165.524"
                      width="5.38119"
                      height="5.38119"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="736.145"
                      y="170.906"
                      width="5.38119"
                      height="10.7624"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="720"
                      y="165.524"
                      width="5.38119"
                      height="10.7624"
                      transform="rotate(-90 720 165.524)"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="746.906"
                      y="165.524"
                      width="5.38119"
                      height="10.7624"
                      transform="rotate(-90 746.906 165.524)"
                      fill="#5A5AB5"
                    />
                  </StyledTwinkle>
                  <rect
                    x="306"
                    y="159"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="313.258"
                    y="166.26"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="84"
                    y="11"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="91.2578"
                    y="18.2598"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="59.5195"
                    y="200"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="45"
                    y="214.52"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="247.52"
                    y="332"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="233"
                    y="346.52"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="7.2595"
                    height="7.2595"
                    transform="matrix(-1 0 0 1 667.258 337)"
                    fill="#5A5AB5"
                  />
                  <rect
                    width="7.2595"
                    height="7.2595"
                    transform="matrix(-1 0 0 1 681.777 351.52)"
                    fill="#5A5AB5"
                  />
                  <StyledTwinkle>
                    <rect
                      width="7.2595"
                      height="7.2595"
                      transform="matrix(-1 0 0 1 1331.26 160)"
                      fill="#5A5AB5"
                    />
                  </StyledTwinkle>
                  <rect
                    width="7.2595"
                    height="7.2595"
                    transform="matrix(-1 0 0 1 1345.78 174.52)"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="1434.52"
                    y="61"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="1420"
                    y="75.5195"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="430.258"
                    y="293"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="423"
                    y="300.26"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="437.52"
                    y="300.26"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="430.258"
                    y="307.52"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <StyledTwinkle>
                    <rect
                      x="469.258"
                      y="51"
                      width="7.2595"
                      height="7.2595"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="462"
                      y="58.2598"
                      width="7.2595"
                      height="7.2595"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="476.52"
                      y="58.2598"
                      width="7.2595"
                      height="7.2595"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="469.258"
                      y="65.5195"
                      width="7.2595"
                      height="7.2595"
                      fill="#5A5AB5"
                    />
                  </StyledTwinkle>
                  <StyledTwinkle>
                    <rect
                      x="1068.27"
                      y="61.4082"
                      width="6.28567"
                      height="12.5713"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="1061.98"
                      y="73.9795"
                      width="6.28567"
                      height="6.28567"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="1061.98"
                      y="86.5508"
                      width="6.28567"
                      height="6.28567"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="1074.55"
                      y="73.9795"
                      width="6.28567"
                      height="6.28567"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="1074.55"
                      y="86.5508"
                      width="6.28567"
                      height="6.28567"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="1068.27"
                      y="92.8369"
                      width="6.28567"
                      height="12.5713"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="1049.41"
                      y="86.5508"
                      width="6.28567"
                      height="12.5713"
                      transform="rotate(-90 1049.41 86.5508)"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="1080.84"
                      y="86.5508"
                      width="6.28567"
                      height="12.5713"
                      transform="rotate(-90 1080.84 86.5508)"
                      fill="#5A5AB5"
                    />
                  </StyledTwinkle>
                  <rect
                    x="1346"
                    y="430"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="504"
                    y="152"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="167"
                    y="109"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <StyledTwinkle>
                    <rect
                      x="1259"
                      y="87"
                      width="7.2595"
                      height="7.2595"
                      fill="#5A5AB5"
                    />
                  </StyledTwinkle>
                  <rect
                    x="815"
                    y="48"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="1246"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="943"
                    y="278.26"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <rect
                    x="950.258"
                    y="271"
                    width="7.2595"
                    height="7.2595"
                    fill="#5A5AB5"
                  />
                  <StyledTwinkle>
                    <rect
                      x="1197.26"
                      y="286"
                      width="7.2595"
                      height="7.2595"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="1190"
                      y="293.26"
                      width="7.2595"
                      height="7.2595"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="1204.52"
                      y="293.26"
                      width="7.2595"
                      height="7.2595"
                      fill="#5A5AB5"
                    />
                    <rect
                      x="1197.26"
                      y="300.519"
                      width="7.2595"
                      height="7.2595"
                      fill="#5A5AB5"
                    />
                  </StyledTwinkle>
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_4623_124989"
                    x1="700.5"
                    y1="1057.04"
                    x2="701"
                    y2="424"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#23234C" />
                    <stop offset="1" stopColor="#252551" />
                  </linearGradient>
                  <clipPath id="clip0_4623_124989">
                    <rect width="1440" height="682" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </StyledEasterEggContainer>
          )}
        </StyledFooter>
      </Layout>
    </>
  );
};

export default Footer;
