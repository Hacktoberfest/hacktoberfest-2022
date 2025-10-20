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

import brandGuidelines from 'assets/brand-guidelines.pdf';
import { DownloadIcon } from '../icons/Download';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const Footer = () => (
  <>
    <Layout>
      <StyledFooter>
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
              scaling a community, Hacktoberfest gives you a trusted platform to
              do it in a way that gets users excited.
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
      </StyledFooter>
    </Layout>
  </>
);

export default Footer;
