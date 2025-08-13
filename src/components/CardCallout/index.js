import {
  StyledCardCallout,
  StyledCardCalloutContent,
  StyledCardCalloutTitle,
  StyledCardCalloutBody,
  StyledCardCalloutContainer,
  StyledCardCalloutWrap,
  StyledCardCalloutLink,
  StyledCardCalloutWrapContainer,
} from './CardCallout.styles';
import TextLink from '../TextLink';
import CustomLink from '../CustomLink';

const CardCallout = ({
  icon,
  title,
  body,
  link,
  smallBody,
  bodyGap,
  children,
}) => (
  <StyledCardCallout>
    <StyledCardCalloutContainer>
      <StyledCardCalloutWrapContainer $bodyGap={bodyGap}>
        <StyledCardCalloutWrap>
          {icon}
          <StyledCardCalloutContent>
            {title && <StyledCardCalloutTitle>{title}</StyledCardCalloutTitle>}
            {body && (
              <StyledCardCalloutBody $smallBody={smallBody}>
                {body}
              </StyledCardCalloutBody>
            )}
          </StyledCardCalloutContent>
        </StyledCardCalloutWrap>
        {children}
      </StyledCardCalloutWrapContainer>
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
