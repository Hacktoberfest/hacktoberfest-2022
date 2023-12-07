import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyledAccordion,
  StyledAccordionImage,
  StyledAccordionImageWrapper,
  StyledAccordionHeader,
  StyledAccordionLink,
} from './AccordionSponsor.styles';
import ContentMaster from 'components/ContentMaster';
import { Markdown } from 'components/markdown';
import Frame from 'components/Frame';
import TextLink from 'components/TextLink';

const AccordionSponsor = (props) => {
  const {
    filled,
    image,
    frame,
    imageRotatation = 'left',
    bgImage,
    title,
    collapsed,
    link,
    children,
    skills,
  } = props;

  const [open, setOpen] = useState(!collapsed);
  useEffect(() => setOpen(!collapsed), [collapsed]);
  const toggle = useCallback((evt) => setOpen(evt.target.open), []);

  return (
    <StyledAccordion $isFilled={filled} open={open} onToggle={toggle}>
      <summary>
        <StyledAccordionHeader $isFilled={filled}>
          <StyledAccordionImageWrapper $bgImage={bgImage}>
            <Frame color={frame} />
            <StyledAccordionImage $rotate={imageRotatation}>
              <img {...image} />
            </StyledAccordionImage>
          </StyledAccordionImageWrapper>
          <ContentMaster size="md" title={title}>
            {skills}
          </ContentMaster>
        </StyledAccordionHeader>
      </summary>
      <div>
        {children && <Markdown string={children} />}

        {link && (
          <StyledAccordionLink>
            <TextLink {...link} />
          </StyledAccordionLink>
        )}
      </div>
    </StyledAccordion>
  );
};

export default AccordionSponsor;
