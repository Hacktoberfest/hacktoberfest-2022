import {
  StyledCardCallout,
  StyledCardCalloutContent,
  StyledCardCalloutTitle,
  StyledCardCalloutBody,
  StyledCardCalloutContainer,
} from './CardCallout.styles';
import ButtonMain from 'components/ButtonMain';

const CardCallout = ({ icon, title, body, link }) => (
  <StyledCardCallout>
    <StyledCardCalloutContainer>
      <StyledCardCalloutContent>
        {icon}
        {title && <StyledCardCalloutTitle>{title}</StyledCardCalloutTitle>}
        {body && <StyledCardCalloutBody>{body}</StyledCardCalloutBody>}
      </StyledCardCalloutContent>
      <div>
        <ButtonMain {...link} />
      </div>
    </StyledCardCalloutContainer>
  </StyledCardCallout>
);

export default CardCallout;
