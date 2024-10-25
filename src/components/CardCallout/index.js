import TextLink from 'components/TextLink';
import {
  StyledCardCallout,
  StyledCardCalloutImage,
  StyledCardCalloutContent,
  StyledCardCalloutTitle,
  StyledCardCalloutBody,
  StyledCardCalloutContainer,
  StyledCardBackground,
} from './CardCallout.styles';
import ButtonMain from 'components/ButtonMain';

const CardCallout = ({ title, body, link }) => (
  <StyledCardCallout>
    <StyledCardBackground />
    <StyledCardCalloutContainer>
      <StyledCardCalloutContent>
        {title && <StyledCardCalloutTitle>{title}</StyledCardCalloutTitle>}
        {body && <StyledCardCalloutBody>{body}</StyledCardCalloutBody>}
        <ButtonMain {...link} />
      </StyledCardCalloutContent>
    </StyledCardCalloutContainer>
  </StyledCardCallout>
);

export default CardCallout;
