import Section from 'components/Section';
import { StyledSection, StyledCornersWrapper } from './RevealSection.styles';
import ContentMaster from 'components/ContentMaster';
import Corners from 'components/Corners';
import { useEffect, useRef, useState } from 'react';

const RevealSection = ({ children, id }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <Section id={id} ref={ref}>
      <StyledSection $inView={isVisible}>
        <ContentMaster align="center" size="xl">
          {children}
        </ContentMaster>
        <StyledCornersWrapper>
          <Corners />
        </StyledCornersWrapper>
      </StyledSection>
    </Section>
  );
};

export default RevealSection;
