import {
  StyledSponsors,
  StyledSponsorsTitle,
  StyledSponsorsList,
} from './Sponsors.styles';

const Sponsors = (props) => {
  const { title, sponsors, centered, large } = props;

  return (
    <StyledSponsors $centered={centered}>
      {title && <StyledSponsorsTitle>{title}</StyledSponsorsTitle>}
      <StyledSponsorsList $centered={centered} $large={large}>
        {sponsors.map((sponsor) => (
          <a key={sponsor.title} {...sponsor.link}>
            <img
              src={sponsor.hero?.image}
              alt={`${sponsor.title} logo`}
              height={'100%'}
            />
          </a>
        ))}
      </StyledSponsorsList>
    </StyledSponsors>
  );
};

export default Sponsors;
