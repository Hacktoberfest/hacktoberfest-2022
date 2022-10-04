import styled from 'styled-components';

import appwrite from 'assets/img/sponsors/appwrite-logo.svg';
import devtron from 'assets/img/sponsors/devtron-logo.svg';
import digitalocean from 'assets/img/sponsors/digitalocean-logo.svg';
import docker from 'assets/img/sponsors/docker-logo.svg';
import novu from 'assets/img/sponsors/novu-logo.svg';
import rapidapi from 'assets/img/sponsors/rapidapi-logo.svg';

const SponsorsWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding-top: 64px;
  flex-flow: row wrap;

  h6 {
    opacity: 0.75;
    text-shadow: none;
    margin: 0 auto;
  }

  div {
    display: inherit;
    align-items: flex-end;
    gap: 20px;
    flex-flow: row wrap;

    img {
      margin: 0 auto;
      filter: ${(props) => props.theme.glowLiteDS};

      &#docker {
        margin-bottom: 2px;
      }
    }
  }
`;

export const FounderSponsors = () => (
  <SponsorsWrapper>
    <h6>Presented by</h6>
    <div>
      <a
        href="https://digitalocean.com"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src={digitalocean.src}
          alt="DigitalOcean logo"
          width={160}
          height={'100%'}
        />
      </a>
      <a
        href="https://appwrite.io/"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src={appwrite.src}
          alt="Appwrite logo"
          width={128}
          height={'100%'}
        />
      </a>
      <a
        href="https://docker.com/"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src={docker.src}
          alt="Docker logo"
          width={112}
          height={'100%'}
          id="docker"
        />
      </a>
    </div>
  </SponsorsWrapper>
);

const AllSponsorsWrapper = styled(SponsorsWrapper)`
  display: flex;
  flex-direction: column;
  text-align: center;

  .block {
    display: block;
    margin-bottom: 40px;
    width: 100%;
    flex-flow: row reverse;

    h6 {
      margin-bottom: 24px;
    }

    > div {
      display: flex;
      gap: 40px;
      width: max-content;
      margin: 0 auto;

      img {
        &#docker {
          margin-bottom: 4px;
        }
      }
    }
  }

  @media (max-width: 800px) {
    .block {
      > div {
        display: block;
        img {
          display: block;
          margin-bottom: 24px;
        }
      }
    }
  }
`;

export const AllSponsors = () => (
  <AllSponsorsWrapper>
    <div className="block">
      <h6>Presented by</h6>
      <div>
        <a
          href="https://digitalocean.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={digitalocean.src}
            alt="DigitalOcean logo"
            width={235}
            height={'100%'}
          />
        </a>
        <a
          href="https://appwrite.io/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={appwrite.src}
            alt="Appwrite logo"
            width={226}
            height={'100%'}
          />
        </a>
        <a
          href="https://docker.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={docker.src}
            alt="Docker logo"
            width={187}
            height={'100%'}
            id="docker"
          />
        </a>
      </div>
    </div>
    <div className="block">
      <h6>Supported by</h6>
      <div>
        <a
          href="https://novu.co/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={novu.src}
            alt="Novu logo"
            width={140}
            height={'100%'}
          />
        </a>
        <a
          href="https://rapidapi.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={rapidapi.src}
            alt="RapidApi logo"
            width={142}
            height={'100%'}
          />
        </a>
        <a
          href="https://devtron.ai/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={devtron.src}
            alt="Devtron logo"
            width={174}
            height={'100%'}
            id="docker"
          />
        </a>
      </div>
    </div>
  </AllSponsorsWrapper>
);
