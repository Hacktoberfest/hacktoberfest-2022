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
import Type from 'components/type';
import { useTheme } from 'styled-components';

const ContentMaster = (props) => {
  const theme = useTheme();

  const {
    eyebrow,
    title,
    titleTag = 'h2',
    titleCursorColor = 'inherit',
    prefixColor = null,
    children,
    size,
    align = 'left',
    list,
    listColumns,
    hasCaret = true,
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
            <StyledContentMasterTitle
              $size={size}
              $isTyping={typeof title === 'string'}
              $hasCaret={hasCaret}
              as={titleTag}
            >
              {typeof title === 'string' ? (
                <Type
                  text={title}
                  backgroundColor={
                    hasCaret ? theme.colors.black : 'transparent'
                  }
                  cursorColor={titleCursorColor}
                  prefix={hasCaret ? '>' : null}
                  prefixColor={
                    hasCaret
                      ? prefixColor
                        ? prefixColor
                        : theme.colors.green
                      : null
                  }
                />
              ) : (
                title
              )}
            </StyledContentMasterTitle>
          )}
        </StyledContentMasterHeader>
      )}
      {children && (
        <StyledContentMasterBody $size={size}>
          {/* <MarkdownInline string={children} /> */}
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
