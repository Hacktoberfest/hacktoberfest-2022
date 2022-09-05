import Link from 'next/link';
import styled from 'styled-components';
// import { Bug } from './logo';
import Logo, { Badge } from './logo-2';
import repeater from 'img/repeater.svg';
import rainbow from 'img/rainbow-bg.svg';
import Repeater from './repeater';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const StyledFooter = styled.footer`
  width: 100%;
  padding: 0 64px 120px 64px;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    // background: url(${rainbow.src});
    background-size: cover;
    width: 100%;
    height: 200%;
    bottom: 0;
    left: 0;
    z-index: -1;
  }

  .wrapper {
    display: flex;
    margin: 0 auto;
    max-width: 1312px;
    gap: 32px;

    @media (max-width: 800px) {
      flex-wrap: wrap;
    }
  }

  dl {
    width: 100%;
    margin-top: 64px;

    dt {
      font-family: 'JetBrains Mono';
      font-size: 24px;
      line-height: 32px;
      margin-bottom: 24px;
      text-shadow: ${(props) => props.theme.glowLite};
    }

    dd {
      margin-bottom: 16px;
      padding-bottom: 4px;
      box-shadow: 0px 1px 0px rgba(229, 225, 230, 0.25);

      a {
        opacity: 0.75;
        transition: 0.1s ease;

        &:hover {
          opacity: 1;
          text-shadow: ${(props) => props.theme.glowLite};
        }
      }
    }
  }

  p {
    margin-top: 16px;
    font-size: 14px;
    line-height: 20px;
    text-shadow: ${(props) => props.theme.glowLite};
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <Repeater top="200px" />
      <div className="wrapper">
        <dl>
          <Badge width="80px" />
          <p>
            &copy; 2022 DigitalOcean, LLC. <br /> All Rights Reserved.
          </p>
        </dl>

        <dl>
          <dt>Share</dt>
          <dd>
            <a
              href={`https://twitter.com/share?url=${encodeURIComponent(
                BASE_URL
              )}&text=${encodeURIComponent(
                'Spread the love for open source with #Hacktoberfest, a month-long celebration of open-source projects, their maintainers, and the entire community of contributors.'
              )}`}
            >
              Twitter
            </a>
          </dd>
          <dd>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                BASE_URL
              )}`}
            >
              Facebook
            </a>
          </dd>
          <dd>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                BASE_URL
              )}`}
            >
              LinkedIn
            </a>
          </dd>
          <dd>
            <a
              href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
                BASE_URL
              )}&t=${encodeURIComponent('Hacktoberfest 2022')}`}
            >
              Hacker News
            </a>
          </dd>
          <dd>
            <a
              href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                BASE_URL
              )}&title=${encodeURIComponent('Hacktoberfest 2022')}`}
            >
              Reddit
            </a>
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
