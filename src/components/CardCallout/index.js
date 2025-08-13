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
import TextLink from '../TextLink';

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
      {link && (
        <StyledCardCalloutLink>
          {link.target === '_blank' ? (
            <CustomLink size="lg" {...link} />
          ) : (
            <TextLink {...link} />
          )}
        </StyledCardCalloutLink>
      )}
    </StyledCardCalloutContainer>
  </StyledCardCallout>
);

export default CardCallout;
