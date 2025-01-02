import Type from 'components/type';
import {
  StyledSponsors,
  StyledSponsorsTitle,
  StyledSponsorsList,
} from './Sponsors.styles';
import { useTheme } from 'styled-components';

const Sponsors = (props) => {
  const theme = useTheme();
  const { title, sponsors, centered, large } = props;

  return (
    <StyledSponsors $centered={centered}>
      {title && (
        <StyledSponsorsTitle $large={large}>
          <Type
            text={title}
            backgroundColor="transparent"
            cursorColor={theme.colors.green}
            prefix=">"
            prefixColor={theme.colors.pink}
          />
        </StyledSponsorsTitle>
      )}
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
