import { useCallback, useEffect, useState } from 'react';
import {
  StyledAccordion,
  StyledAccordionImage,
  StyledAccordionImageWrapper,
  StyledAccordionHeader,
  StyledAccordionLinks,
  StyledGlowBox,
} from './AccordionCouncil.styles';
import ContentMaster from 'components/ContentMaster';
import { Markdown } from 'components/markdown';
import ButtonMain from '../ButtonMain';

const AccordionCouncil = (props) => {
  const {
    filled,
    frame,
    image,
    imageRotatation = 'left',
    bgImage,
    title,
    subtitle,
    collapsed,
    links,
    children,
    iframe,
    skills,
  } = props;

  const [iframeHeight, setIframeHeight] = useState(0);

  useEffect(() => {
    const fetchIframeHeight = (event) => {
      if (event.origin === 'https://opencollective.com') {
        if (event.data?.size?.height) {
          setIframeHeight(event.data.size.height);
        }
      }
    };

    window.addEventListener('message', fetchIframeHeight);
  }, []);

  const [open, setOpen] = useState(!collapsed);
  useEffect(() => setOpen(!collapsed), [collapsed]);
  const toggle = useCallback((evt) => setOpen(evt.target.open), []);

  return (
    <StyledAccordion $isFilled={filled} open={open} onToggle={toggle}>
      <summary>
        <StyledAccordionHeader $isFilled={filled}>
          <StyledAccordionImageWrapper $bgImage={bgImage}>
            <StyledGlowBox />
            <StyledGlowBox />
            <StyledGlowBox />
            <StyledGlowBox />
            <StyledAccordionImage $rotate={imageRotatation}>
              <img {...image} />
            </StyledAccordionImage>
          </StyledAccordionImageWrapper>
          <ContentMaster size="sm" eyebrow={subtitle} title={<>{title}</>}>
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
        {children && <Markdown string={children} />}

        {links && (
          <StyledAccordionLinks>
            {links.map((link) => (
              <li key={link.title}>
                <a href={link.url} target="_blank" rel="noreferrer noopener">
                  {link.title}
                </a>
              </li>
            ))}
          </StyledAccordionLinks>
        )}

        {iframe && (
          <iframe
            src={iframe}
            style={{ backgroundColor: '#fff' }}
            width="100%"
            height={iframeHeight > 0 ? iframeHeight : 920}
            frameBorder="0"
          />
        )}
      </div>
    </StyledAccordion>
  );
};

export default AccordionCouncil;
