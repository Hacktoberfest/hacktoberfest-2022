import { useCallback, useEffect, useState } from 'react';
import {
  StyledAccordion,
  StyledAccordionImage,
  StyledAccordionImageWrapper,
  StyledAccordionHeader,
  StyledAccordionLink,
  StyledGlowBox,
} from './AccordionSponsor.styles';
import ContentMaster from 'components/ContentMaster';
import TextLink from 'components/TextLink';
import ButtonMain from '../ButtonMain';
import Image from 'next/image';

const AccordionSponsor = (props) => {
  const {
    filled,
    image,
    imageSize,
    bgImage,
    title,
    collapsed,
    link,
    list,
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
          <StyledAccordionImageWrapper $size={imageSize} $bgImage={bgImage}>
            <StyledGlowBox />
            <StyledGlowBox />
            <StyledGlowBox />
            <StyledGlowBox />
            <StyledAccordionImage>
              <Image {...image} />
            </StyledAccordionImage>
          </StyledAccordionImageWrapper>
          <ContentMaster size="md" title={<>{title}</>}>
            {skills}
          </ContentMaster>
        </StyledAccordionHeader>
        <ButtonMain
          onClick={() => setOpen((prev) => !prev)}
          as="button"
          size="xs"
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="2"
              viewBox="0 0 16 2"
              fill="none"
            >
              <path
                d="M15.9998 1.49973H0.000164141V0.499836H15.9998V1.49973Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M15.9998 8.5001L8.49995 8.4994L8.50064 16.0007L7.50005 16V8.4994L0.000164141 8.5001V7.5002L7.50005 7.49951V0.000312794H8.49995V7.49951L15.9998 7.5002V8.5001Z"
                fill="white"
              />
            </svg>
          )}
        </ButtonMain>
      </summary>
      <div>
        {children && <ContentMaster list={list}>{children}</ContentMaster>}

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
