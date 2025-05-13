import {
  StyledCardCallout,
  StyledCardCalloutContent,
  StyledCardCalloutTitle,
  StyledCardCalloutBody,
  StyledCardCalloutContainer,
  StyledCardCalloutWrap,
  StyledCardCalloutLink,
} from './CardCallout.styles';
import ButtonMain from 'components/ButtonMain';

const CardCallout = ({ icon, title, body, link }) => (
  <StyledCardCallout>
    <StyledCardCalloutContainer>
      <StyledCardCalloutWrap>
        {icon}
        <StyledCardCalloutContent>
          {title && <StyledCardCalloutTitle>{title}</StyledCardCalloutTitle>}
          {body && <StyledCardCalloutBody>{body}</StyledCardCalloutBody>}
        </StyledCardCalloutContent>
      </StyledCardCalloutWrap>
      <StyledCardCalloutLink>
        <ButtonMain {...link} />
      </StyledCardCalloutLink>
    </StyledCardCalloutContainer>
  </StyledCardCallout>
);

export default CardCallout;
