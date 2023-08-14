import Link from 'next/link';
import {
  StyledContentMaster,
  StyledContentMasterEyebrow,
  StyledContentMasterTitle,
  StyledContentMasterHeader,
  StyledContentMasterBody,
  StyledContentMasterLinks,
  StyledContentMasterCta
} from './ContentMaster.styles';
import TextLink from 'components/TextLink';
import { MarkdownInline } from 'components/markdown';
import ButtonMain from 'components/ButtonMain';

const ContentMaster = props => {
  const {
    eyebrow,
    title,
    titleTag = 'h2',
    children,
    size,
    align = 'left',
    links,
    cta
  } = props;

  return (
    <StyledContentMaster $align={align}>
      {(eyebrow || title) && (
        <StyledContentMasterHeader>
          {eyebrow && (
            <StyledContentMasterEyebrow $size={size}>{eyebrow}</StyledContentMasterEyebrow>
          )}
          {title && (
            <StyledContentMasterTitle $size={size} as={titleTag}>
              {title}
            </StyledContentMasterTitle>
          )}
        </StyledContentMasterHeader>
      )}
      {children && (
        <StyledContentMasterBody $size={size}>
          <MarkdownInline string={children} />
        </StyledContentMasterBody>
      )}
      {links && (
        <StyledContentMasterLinks>
          {links.map(link => (
            <li key={link.id}>
              <TextLink size="lg" {...link} />
            </li>
          ))}
        </StyledContentMasterLinks>
      )}
      {cta && (
        <StyledContentMasterCta>
          <ButtonMain {...cta} />
        </StyledContentMasterCta>
      )}
    </StyledContentMaster>
  );
};

export default ContentMaster;