import {
  StyledContentMaster,
  StyledContentMasterEyebrow,
  StyledContentMasterTitle,
  StyledContentMasterHeader,
  StyledContentMasterBody,
  StyledContentMasterLinks,
  StyledContentMasterCta,
  StyledContentMasterList,
} from './ContentMaster.styles';

import TextLink from 'components/TextLink';
import { Markdown, MarkdownInline } from 'components/markdown';
import ButtonMain from 'components/ButtonMain';
import CustomLink from '../CustomLink';

const ContentMaster = (props) => {
  const {
    eyebrow,
    title,
    titleTag = 'h2',
    children,
    size,
    align = 'left',
    list,
    listColumns,
    links,
    cta,
    bodyColor,
    ...rest
  } = props;

  return (
    <StyledContentMaster $align={align} {...rest}>
      {(eyebrow || title) && (
        <StyledContentMasterHeader>
          {eyebrow && (
            <StyledContentMasterEyebrow $size={size}>
              {eyebrow}
            </StyledContentMasterEyebrow>
          )}
          {title && (
            <StyledContentMasterTitle $size={size} as={titleTag}>
              {title}
            </StyledContentMasterTitle>
          )}
        </StyledContentMasterHeader>
      )}
      {children && (
        <StyledContentMasterBody $color={bodyColor} $size={size}>
          <Markdown string={children} />
        </StyledContentMasterBody>
      )}
      {list && (
        <StyledContentMasterList $columns={listColumns}>
          {list.map((item) => (
            <MarkdownInline key={item} string={item} as="li" />
          ))}
        </StyledContentMasterList>
      )}
      {links && (
        <StyledContentMasterLinks>
          {links.map((link) => (
            <li key={link.id}>
              {link.target === '_blank' ? (
                <CustomLink size="lg" {...link} />
              ) : (
                <TextLink size="lg" {...link} />
              )}
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
