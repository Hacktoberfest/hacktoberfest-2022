import Head from 'next/head';
import styled, { keyframes, useTheme } from 'styled-components';

import {
  values,
  contributors,
  resources,
  prMrDetails,
  spam,
  maintainers,
  faqs,
  note,
  lowNoCode,
} from 'lib/participation';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import Divider from 'components/Divider';
import Section from 'components/Section';
import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import ContentSide from 'components/ContentSide';
import Accordion from 'components/Accordion';

import HeroSecondary from 'components/HeroSecondary';
import participation from 'assets/img/heroes/participation.svg';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import createMetaTitle from 'lib/createMetaTitle';
import Image from 'next/image';
import Layout from '../components/Layout';
import CardCallout from '../components/CardCallout';
import CustomLink from '../components/CustomLink';

import scrollMore from 'assets/img/8-bit-down.svg';
import resource from 'assets/img/resource.svg';
import curvedArrow from 'assets/img/curved-arrow.svg';
import TextLink from '../components/TextLink';
import { headline5 } from '../themes/typography';
import globe from '../assets/img/globe.svg';

const bounceAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(80%);
  }
  100% {
    transform: translateY(0);
  }
`;

const StyledPRDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${mQ(bp.tablet)} {
    gap: 40px;
  }
`;

const StyledParticipationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const StyledLowOrNoCodenSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${mQ(bp.desktop)} {
    gap: 62px;
  }
`;

const StyledFAQSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledFAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledFAQTitle = styled.h5`
  ${headline5};
  color: ${({ theme }) => theme.colors2025.blueViolet};
`;

const StyledValueTitle = styled.div`
  p {
    color: ${({ theme }) => theme.colors2025.space.white};
    font-weight: 700;
  }
`;

const StyledDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
`;

const StyledSectionDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
  display: none;
  grid-column: full-start / full-end;
  width: 100%;

  ${mQ(bp.desktop)} {
    display: block;
  }
`;

const StyledResourcesImage = styled(Image)`
  display: none;

  ${mQ(bp.desktop)} {
    display: block;
    left: ${({ $isVisible }) => ($isVisible ? '0%' : '-100%')};
    opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition:
      left 1s ease-out,
      opacity 1s ease-out;
  }
`;

const StyledLowCodeImage = styled(Image)`
  display: none;

  ${mQ(bp.desktop)} {
    display: block;
    right: ${({ $isVisible }) => ($isVisible ? '0%' : '-100%')};
    opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition:
      right 1s ease-out,
      opacity 1s ease-out;
  }
`;

const StyledResourcesContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  ${mQ(bp.desktop)} {
    gap: 32px;
  }
`;

const StyledResourceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledResourceList = styled.ul`
  list-style-type: square;
  padding-left: 20px;
`;

const StyledSection = styled(Section)`
  ${mQ(bp.desktop)} {
    padding-bottom: 80px;
  }
`;

const StyledRelativeSection = styled(Section)`
  position: relative;
`;

const StyledScrollMoreSection = styled.div`
  display: none;

  ${mQ(bp.desktop)} {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 92px;

    img {
      animation: ${bounceAnimation} 2s ease-in-out infinite;
    }
  }
`;

const Participation = () => {
  const theme = useTheme();

  const resourcesRef = useRef(null);
  const [isResourcesVisible, setIsResourcesVisible] = useState(false);

  const lowCodeRef = useRef(null);
  const [isLowCodeVisible, setIsLowCodeVisible] = useState(false);

  useEffect(() => {
    const resourcesObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsResourcesVisible(true);
          // Once visible, we can disconnect the observer
          resourcesObserver.disconnect();
        }
      },
      { threshold: 0.8 },
    );

    const lowCodeObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsLowCodeVisible(true);
          // Once visible, we can disconnect the observer
          lowCodeObserver.disconnect();
        }
      },
      { threshold: 0.8 },
    );

    if (resourcesRef.current) {
      resourcesObserver.observe(resourcesRef.current);
    }

    if (lowCodeRef.current) {
      lowCodeObserver.observe(lowCodeRef.current);
    }

    return () => {
      if (resourcesRef.current) {
        resourcesObserver.disconnect();
      }
      if (lowCodeRef.current) {
        lowCodeObserver.disconnect();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>{createMetaTitle('Participation')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('Participation')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('Participation')}
        />
      </Head>

      <HeroSecondary
        title="Participation"
        icon={<Image src={participation} alt="" />}
      />

      <Layout>
        <Section id="values">
          <Container>
            <StyledParticipationSection>
              <ContentMaster title="Values" size="lg" align="center" />
              <>
                {values.map((value, index) => (
                  <Fragment key={value.title}>
                    <ContentSide key={value.title}>
                      <ContentSide align="center" size="small">
                        <Image src={value.icon} alt="" width={40} height={40} />
                        <StyledValueTitle>
                          <ContentMaster size="xl2">
                            {value.title}
                          </ContentMaster>
                        </StyledValueTitle>
                      </ContentSide>
                      <ContentMaster size="md">{value.content}</ContentMaster>
                    </ContentSide>
                    <StyledDivider type="solid" />
                  </Fragment>
                ))}
              </>
            </StyledParticipationSection>
          </Container>
        </Section>

        <Section id="contributors">
          <Container>
            <ContentSide>
              <ContentMaster size="lg" title={contributors.title}>
                Join the [Hacktoberfest Discord
                server](https://discord.com/invite/hacktoberfest) to meet other
                participants and [share your Hacktoberfest love](/about#love)
                with a blog or post on socials.
              </ContentMaster>
              <CardCallout
                body={
                  <ContentMaster
                    bodyColor={theme.colors2025.space.white}
                    size="xl2"
                    list={contributors.items}
                  >
                    {`**${contributors.content}**`}
                  </ContentMaster>
                }
              />
            </ContentSide>
          </Container>
        </Section>

        <StyledSectionDivider />

        <StyledRelativeSection id="beginner-resources" ref={resourcesRef}>
          <Container>
            <StyledResourcesImage
              src={resource}
              alt=""
              width="304"
              height="217"
              $isVisible={isResourcesVisible}
            />
            <ContentSide>
              <ContentMaster size="lg" title={resources.title} />
              <StyledResourcesContent>
                {resources.sections.map((section) => (
                  <StyledResourceItem>
                    <ContentMaster size="xl">
                      {`**${section.title}**`}
                    </ContentMaster>
                    <StyledResourceList>
                      {section.items.map((item) => (
                        <li>
                          <CustomLink href={item.link} target="_blank">
                            {item.content}
                          </CustomLink>
                        </li>
                      ))}
                    </StyledResourceList>
                  </StyledResourceItem>
                ))}
              </StyledResourcesContent>
            </ContentSide>
          </Container>
        </StyledRelativeSection>

        <StyledSection id="pr-mr-details">
          <Container>
            <CardCallout
              smallBody
              title={<ContentMaster size="lg" title={prMrDetails.title} />}
              body={
                <ContentMaster size="lg">{prMrDetails.content}</ContentMaster>
              }
            >
              <StyledPRDetails>
                {prMrDetails.sections.map((section) => (
                  <React.Fragment key={section.title}>
                    <StyledDivider type="solid" />
                    <Accordion
                      title={section.title}
                      subtitle={section.subtitle}
                      collapsed
                    >
                      <ContentMaster size="md">
                        {section.items[0].content}
                      </ContentMaster>
                    </Accordion>
                  </React.Fragment>
                ))}
              </StyledPRDetails>
            </CardCallout>
          </Container>
        </StyledSection>

        <StyledScrollMoreSection>
          <Image src={scrollMore} width={128} height={128} alt="" />
        </StyledScrollMoreSection>

        <Section id="spam">
          <Container>
            <CardCallout
              smallBody
              title={<ContentMaster size="lg" title={spam.title} />}
              body={<ContentMaster size="lg">{spam.content}</ContentMaster>}
            >
              <StyledPRDetails>
                {spam.sections.map((section) => (
                  <React.Fragment key={section.title}>
                    <StyledDivider type="solid" />
                    <Accordion
                      title={section.title}
                      subtitle={section.subtitle}
                      collapsed
                    >
                      <ContentMaster size="md">
                        {section.items[0].content}
                      </ContentMaster>
                      {section.items[0].link && (
                        <TextLink href={section.items[0].link.href}>
                          {section.items[0].link.text}
                        </TextLink>
                      )}
                    </Accordion>
                  </React.Fragment>
                ))}
              </StyledPRDetails>
            </CardCallout>
          </Container>
        </Section>

        <StyledSectionDivider />

        <Section id="maintainers">
          <Container>
            <StyledParticipationSection>
              <ContentMaster size="xl" title={maintainers.title}>
                {maintainers.content}
              </ContentMaster>
              <ContentMaster
                size="xl"
                listColumns="2"
                list={maintainers.sections[0].items}
              />
            </StyledParticipationSection>
          </Container>
        </Section>

        <StyledSectionDivider />

        <StyledRelativeSection id="low-or-non-code" ref={lowCodeRef}>
          <Container>
            <StyledLowCodeImage
              src={curvedArrow}
              alt=""
              width="412"
              height="281"
              $isVisible={isLowCodeVisible}
            />
            <StyledLowOrNoCodenSection>
              <ContentSide>
                <ContentMaster
                  size="lg"
                  title={lowNoCode.title}
                  prefixColor={theme.colors.pink}
                />
                <ContentMaster children={lowNoCode.content} />
              </ContentSide>

              <StyledDivider type="solid" />

              <ContentSide>
                <ContentMaster
                  size="md"
                  title={<>{lowNoCode.sections[0].title}</>}
                  titleTag="h3"
                  hasCaret={false}
                  list={lowNoCode.sections[0].lists}
                >
                  {lowNoCode.sections[0].content}
                </ContentMaster>

                <ContentMaster
                  size="md"
                  title={<>{lowNoCode.sections[1].title}</>}
                  titleTag="h3"
                  hasCaret={false}
                  list={lowNoCode.sections[1].lists}
                />
              </ContentSide>

              <CardCallout
                body={
                  <ContentMaster size="md">
                    {`${note.sections[0].content} ${note.sections[1].content}`}
                  </ContentMaster>
                }
              />
            </StyledLowOrNoCodenSection>
          </Container>
        </StyledRelativeSection>

        <Section id="faq" size="none">
          <Container>
            <CardCallout
              bodyGap="xl"
              title={<ContentMaster size="lg" title={faqs.title} />}
            >
              {faqs.sections.map((section) => (
                <React.Fragment key={section.title}>
                  <StyledFAQSection>
                    <StyledFAQTitle>{section.title}</StyledFAQTitle>
                    <StyledFAQContainer>
                      {section.questions.map((item, index) => (
                        <React.Fragment key={item.question}>
                          <Accordion title={item.question} collapsed>
                            <ContentMaster size="md">
                              {item.answer}
                            </ContentMaster>
                          </Accordion>
                          {section.questions.length !== index + 1 && (
                            <StyledDivider type="solid" />
                          )}
                        </React.Fragment>
                      ))}
                    </StyledFAQContainer>
                  </StyledFAQSection>
                </React.Fragment>
              ))}
            </CardCallout>
          </Container>
        </Section>
      </Layout>
    </>
  );
};

export default Participation;
