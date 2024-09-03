import TextLink from 'components/TextLink';
import {
  StyledCardCallout,
  StyledCardCalloutImage,
  StyledCardCalloutContent,
  StyledCardCalloutTitle,
  StyledCardCalloutContainer,
  StyledCardBackground,
} from './CardCallout.styles';
import ButtonMain from 'components/ButtonMain';

const CardCallout = ({ title, link }) => (
  <StyledCardCallout>
    <StyledCardBackground />
    <StyledCardCalloutContainer>
      <StyledCardCalloutContent>
        <StyledCardCalloutTitle>{title}</StyledCardCalloutTitle>
        <ButtonMain {...link} />
      </StyledCardCalloutContent>
    </StyledCardCalloutContainer>
  </StyledCardCallout>
);

export default CardCallout;
