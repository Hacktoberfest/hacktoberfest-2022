import Link from 'next/link';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  display: flex;
`;

const Footer = () => {
  console.log('ok');
  return (
    <StyledFooter>
      <div>
        {/* <Logo /> */}
        <p>&copy; 2022 DigitalOcean, LLC. All Rights Reserved.</p>

        <dl>
          <dt>Share</dt>
          <dd>
            <a href="">Twitter</a>
          </dd>
          <dd>
            <a href="">Facebook</a>
          </dd>
          <dd>
            <a href="">LinkedIn</a>
          </dd>
          <dd>
            <a href="">Hacker News</a>
          </dd>
          <dd>
            <a href="">Reddit</a>
          </dd>
        </dl>

        <dl>
          <dt>Follow</dt>
          <dd>
            <a href="https://discord.gg/hacktoberfest">Discord</a>
          </dd>
          <dd>
            <a href="https://twiter.com/hacktoberfest">Twitter</a>
          </dd>
          <dd>
            <a href="https://reddit.com/r/hacktoberfest">Reddit</a>
          </dd>
        </dl>

        <dl>
          <dt>Legal</dt>
          <dd>
            <a href="https://www.digitalocean.com/legal/terms-of-service-agreement">
              Terms
            </a>
          </dd>
          <dd>
            <a href="https://www.digitalocean.com/legal/privacy-policy">
              Privacy
            </a>
          </dd>
          <dd>
            <Link href="/events#brand">Brand Guidelines</Link>
          </dd>
        </dl>
      </div>
    </StyledFooter>
  );
};

export default Footer;
