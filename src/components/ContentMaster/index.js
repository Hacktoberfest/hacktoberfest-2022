import {
  StyledContentMaster,
  StyledContentMasterEyebrow,
  StyledContentMasterTitle,
  StyledContentMasterTitleRow,
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
import Image from 'next/image';

const ContentMaster = (props) => {
  const {
    eyebrow,
    eyebrowBold = false,
    title,
    titleIcon,
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
            <StyledContentMasterEyebrow $bold={eyebrowBold} $size={size}>
              {eyebrow}
            </StyledContentMasterEyebrow>
          )}
          {title && (
            <StyledContentMasterTitleRow>
              {titleIcon && <Image {...titleIcon} />}
              <StyledContentMasterTitle $size={size} as={titleTag}>
                {title}
              </StyledContentMasterTitle>
            </StyledContentMasterTitleRow>
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
