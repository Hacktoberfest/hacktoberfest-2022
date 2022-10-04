import Link from 'next/link';
import styled from 'styled-components';

import { Badge } from './logo-2';
import Repeater from './repeater';
import { FauxHero } from './hero';
import { AllSponsors } from './sponsors';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');

const StyledFooter = styled.footer`
  width: 100%;
  padding: 0 64px 120px 64px;
  margin-top: 200px;

  @media (max-width: 600px) {
    padding: 0 24px;
    margin-bottom: 64px;
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

      .brand {
        order: 3;
      }
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
        color: ${(props) => props.theme.text};
        opacity: 0.75;
        transition: opacity 0.2s ease, text-shadow 0.2s ease;

        &:hover,
        &:focus {
          color: ${(props) => props.theme.text};
          opacity: 1;
          text-shadow: ${(props) => props.theme.glowLite};
        }
      }
    }

    h6 {
      opacity: 0.75;
      margin-top: 16px;
    }
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <div className="wrapper">
        <Repeater top="200px" />

        <FauxHero
          h="180"
          s="6"
          b="0.3"
          gradientLeft="#00A6FF"
          gradientRight="#9700FF"
          height="540px"
          spacing_btm="-16px"
          spacing_top="-64px"
        >
          <AllSponsors />
        </FauxHero>

        <div className="content_wrapper">
          <dl className="brand">
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
              <a
                href="https://discord.gg/hacktoberfest"
                target="_blank"
                rel="noreferrer noopener"
              >
                Discord
              </a>
            </dd>
            <dd>
              <a
                href="https://twitter.com/hacktoberfest"
                target="_blank"
                rel="noreferrer noopener"
              >
                Twitter
              </a>
            </dd>
            <dd>
              <a
                href="https://reddit.com/r/hacktoberfest"
                target="_blank"
                rel="noreferrer noopener"
              >
                Reddit
              </a>
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
