import Link from 'next/link';
import styled from 'styled-components';

import { Badge } from './logo-2';
import Repeater from './repeater';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const StyledFooter = styled.footer`
  width: 100%;
  padding: 0 64px 120px 64px;
  margin-top: 200px;

  @media (max-width: 600px) {
    padding: 0 24px;
  }

  &:before {
    content: '';
    position: absolute;
    background-size: cover;
    width: 100%;
    height: 200%;
    bottom: 0;
    left: 0;
    z-index: -1;
  }

  .wrapper {
    max-width: 1312px;
    margin: 0 auto;
  }

  .content_wrapper {
    display: flex;
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

  h6 {
    margin-top: 16px;
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <div className="wrapper">
        <Repeater top="200px" />
        <div className="content_wrapper">
          <dl>
            <Badge width="80px" />
            <h6>
              &copy; 2022 DigitalOcean, LLC. <br /> All Rights Reserved.
            </h6>
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
                target="_blank"
                rel="noreferrer noopener"
              >
                Twitter
              </a>
            </dd>
            <dd>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  BASE_URL
                )}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Facebook
              </a>
            </dd>
            <dd>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  BASE_URL
                )}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                LinkedIn
              </a>
            </dd>
            <dd>
              <a
                href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
                  BASE_URL
                )}&t=${encodeURIComponent('Hacktoberfest 2022')}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Hacker News
              </a>
            </dd>
            <dd>
              <a
                href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                  BASE_URL
                )}&title=${encodeURIComponent('Hacktoberfest 2022')}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Reddit
              </a>
            </dd>
          </dl>

          <dl>
            <dt>Follow</dt>
            <dd>
              <a href="https://discord.gg/hacktoberfest" target="_blank" rel="noreferrer noopener">Discord</a>
            </dd>
            <dd>
              <a href="https://twiter.com/hacktoberfest" target="_blank" rel="noreferrer noopener">Twitter</a>
            </dd>
            <dd>
              <a href="https://reddit.com/r/hacktoberfest" target="_blank" rel="noreferrer noopener">Reddit</a>
            </dd>
          </dl>

          <dl>
            <dt>Legal</dt>
            <dd>
              <a
                href="https://www.digitalocean.com/legal/terms-of-service-agreement"
                target="_blank"
                rel="noreferrer noopener"
              >
                Terms
              </a>
            </dd>
            <dd>
              <a
                href="https://www.digitalocean.com/legal/privacy-policy"
                target="_blank"
                rel="noreferrer noopener"
              >
                Privacy
              </a>
            </dd>
            <dd>
              <Link href="/events#brand">Brand Guidelines</Link>
            </dd>
          </dl>
        </div>
      </div>
    </StyledFooter>
  );
};

export default Footer;
