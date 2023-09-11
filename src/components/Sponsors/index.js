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
            key={sponsor.title}
            {...sponsor.link}
          >
            <img
              src={sponsor.hero.image}
              alt={`${sponsor.title} logo`}
              width={128 * (sponsor.hero.scaleFactor || 1)}
              height={'100%'}
            />
          </a>
        ))}
      </StyledSponsorsList>
    </StyledSponsors>
  );
};

export default Sponsors;
