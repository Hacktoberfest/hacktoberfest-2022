import { useCallback, useEffect, useState, useRef } from 'react';
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

  const [open, setOpen] = useState(!collapsed);
  useEffect(() => setOpen(!collapsed), [collapsed]);
  const toggle = useCallback((evt) => setOpen(evt.target.open), []);

  // iframe handling: default height, allow postMessage-based resizing if the
  // embed provider supports it, and expose a fallback "open in new tab" link.
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(920);
  useEffect(() => {
    const onMessage = (e) => {
      if (!iframeRef.current) return;
      try {
        // Restrict messages to the same origin as the iframe src when possible.
        if (iframe) {
          const srcOrigin = new URL(iframe).origin;
          if (e.origin !== srcOrigin) return;
        }

        const data = e.data;
        // Accept common message shapes: number, or { height: number }
        if (typeof data === 'number') {
          if (data > 0) setIframeHeight(data);
        } else if (data && typeof data === 'object') {
          const h = data.height || data.iframeHeight || data.h;
          if (typeof h === 'number' && h > 0) setIframeHeight(h);
        }
      } catch (err) {
        // ignore malformed messages
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [iframe]);

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
          <div>
            <iframe
              ref={iframeRef}
              src={iframe}
              style={{ backgroundColor: '#fff' }}
              width="100%"
              height={iframeHeight}
              frameBorder="0"
              scrolling="yes"
              title={`${title} embed`}
            />

            <div style={{ marginTop: 8 }}>
              <a href={iframe} target="_blank" rel="noreferrer noopener">
                Open embed in new tab
              </a>
            </div>
          </div>
        )}
      </div>
    </StyledAccordion>
  );
};

export default AccordionCouncil;
