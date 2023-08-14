import Link from 'next/link';
import {
  StyledFooter,
  StyledFooterContent,
  StyledFooterContainer,
  StyledFooterLogo,
  StyledFooterLinks,
  StyledFooterLinksColumn,
  StyledFooterLinksTitle,
  StyledFooterBackground
} from './Footer.styles';
import { Badge } from 'components/logo-2';
import Container from 'components/Container';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <StyledFooterContainer>
          <StyledFooterBackground />
          <StyledFooterLogo>
            <Badge width="203px" />
            <p>
              &copy; {new Date().getFullYear()} DigitalOcean, LLC. <br /> All Rights Reserved.
            </p>
          </StyledFooterLogo>
          <StyledFooterContent>
          <StyledFooterLinks aria-label="Footer">
            <StyledFooterLinksColumn>
              <StyledFooterLinksTitle>Share</StyledFooterLinksTitle>
              <ul>
                <li>
                  <a
                    href={`https://twitter.com/share?url=${encodeURIComponent(
                      BASE_URL
                    )}&text=${encodeURIComponent(
                      'Spread the love for open source with #Hacktoberfest, a month-long celebration of open-source projects, their maintainers, and the entire community of contributors.'
                    )}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      BASE_URL
                    )}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      BASE_URL
                    )}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
                      BASE_URL
                    )}&t=${encodeURIComponent('Hacktoberfest 2022')}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Hacker News
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                      BASE_URL
                    )}&title=${encodeURIComponent('Hacktoberfest 2022')}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Reddit
                  </a>
                </li>
              </ul>
            </StyledFooterLinksColumn>
            <StyledFooterLinksColumn>
              <StyledFooterLinksTitle>Follow</StyledFooterLinksTitle>
              <ul>
                <li>
                  <a
                    href="https://discord.gg/hacktoberfest"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/hacktoberfest"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://reddit.com/r/hacktoberfest"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Reddit
                  </a>
                </li>
              </ul>
            </StyledFooterLinksColumn>
            <StyledFooterLinksColumn>
              <StyledFooterLinksTitle>Legal</StyledFooterLinksTitle>
              <ul>
                <li>
                  <a
                    href="https://www.digitalocean.com/legal/terms-of-service-agreement"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.digitalocean.com/legal/privacy-policy"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <Link href="/events#brand">Brand Guidelines</Link>
                </li>
              </ul>
            </StyledFooterLinksColumn>
          </StyledFooterLinks>
          </StyledFooterContent>
        </StyledFooterContainer>
      </Container>
    </StyledFooter>
  );
};

export default Footer;