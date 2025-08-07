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
  StyledSvg,
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

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const Footer = () => {
  const router = useRouter();

  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.disconnect();
      }
    };
  }, []);

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
            <StyledSvg
              width="1440"
              height="682"
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
                <rect
                  width="7.2595"
                  height="7.2595"
                  transform="matrix(-1 0 0 1 1331.26 160)"
                  fill="#5A5AB5"
                />
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
                <rect
                  x="1259"
                  y="87"
                  width="7.2595"
                  height="7.2595"
                  fill="#5A5AB5"
                />
                <rect
                  x="815"
                  y="48"
                  width="7.2595"
                  height="7.2595"
                  fill="#5A5AB5"
                />
                <rect x="1246" width="7.2595" height="7.2595" fill="#5A5AB5" />
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
            </StyledSvg>
          )}
        </StyledFooter>
      </Layout>
    </>
  );
};

export default Footer;
