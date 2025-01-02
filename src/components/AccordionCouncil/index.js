import { useCallback, useEffect, useState } from 'react';
import {
  StyledAccordion,
  StyledAccordionImage,
  StyledAccordionImageWrapper,
  StyledAccordionHeader,
  StyledAccordionLinks,
} from './AccordionCouncil.styles';
import ContentMaster from 'components/ContentMaster';
import { Markdown } from 'components/markdown';

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
            <StyledAccordionImage $rotate={imageRotatation}>
              <img {...image} />
            </StyledAccordionImage>
          </StyledAccordionImageWrapper>
          <ContentMaster
            size="lg"
            eyebrow={subtitle}
            title={<>{title}</>}
            hasCaret={false}
          >
            {skills}
          </ContentMaster>
        </StyledAccordionHeader>
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
            scrolling="no"
          />
        )}
      </div>
    </StyledAccordion>
  );
};

export default AccordionCouncil;
