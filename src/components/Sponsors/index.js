import {
  StyledSponsors,
  StyledSponsorsTitle,
  StyledSponsorsList
} from './Sponsors.styles';

const Sponsors = props => {
  const {
    title,
    sponsors
  } = props;

  return (
    <StyledSponsors>
      {title && (
        <StyledSponsorsTitle>{title}</StyledSponsorsTitle>
      )}
      <StyledSponsorsList>
        {sponsors.map((sponsor) => (
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
              height={'100%'}
              />
          </a>
        ))}
      </StyledSponsorsList>
    </StyledSponsors>
  );
};

export default Sponsors;