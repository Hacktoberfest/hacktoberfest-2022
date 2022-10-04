import styled from 'styled-components';

import sponsors from 'lib/sponsors';

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
    
    a {
      margin: 0;

      img {
        margin: 0;
        filter: ${(props) => props.theme.glowLiteDS};
      }
    }
  }
`;

export const FounderSponsors = () => (
  <SponsorsWrapper>
    <h6>Presented by</h6>
    <div>
      {sponsors.presented.map((sponsor) => (
        <a
          key={sponsor.name}
          href={sponsor.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={sponsor.image}
            alt={`${sponsor.name} logo`}
            width={128 * (sponsor.scaleFactor || 1)}
            style={{ marginBottom: sponsor.verticalOffset ? `${sponsor.verticalOffset}px` : undefined }}
            height={'100%'}
          />
        </a>
      ))}
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

    h6 {
      margin-bottom: 24px;
    }

    > div {
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      gap: 40px;
      width: 100%;
      margin: 0 auto;
    }
  }

  @media (max-width: 800px) {
    margin: 64px 0 32px;
    
    .block {
      > div {
        a {
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
        {sponsors.presented.map((sponsor) => (
          <a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              src={sponsor.image}
              alt={`${sponsor.name} logo`}
              width={224 * (sponsor.scaleFactor || 1)}
              style={{ marginBottom: sponsor.verticalOffset ? `${sponsor.verticalOffset * 2}px` : undefined }}
              height={'100%'}
            />
          </a>
        ))}
      </div>
    </div>
    <div className="block">
      <h6>Supported by</h6>
      <div>
        {sponsors.supported.map((sponsor) => (
          <a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              src={sponsor.image}
              alt={`${sponsor.name} logo`}
              width={142 * (sponsor.scaleFactor || 1)}
              style={{ marginBottom: sponsor.verticalOffset ? `${sponsor.verticalOffset}px` : undefined }}
              height={'100%'}
            />
          </a>
        ))}
      </div>
    </div>
  </AllSponsorsWrapper>
);
