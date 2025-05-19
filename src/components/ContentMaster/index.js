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
  } = props;

  return (
    <StyledContentMaster $align={align}>
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
        <StyledContentMasterBody $size={size}>
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
