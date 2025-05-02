import Head from 'next/head';
import styled, { useTheme } from 'styled-components';

import {
  lore,
  advisoryCouncil,
  council,
  sharing,
  rewards,
  sponsorsAndPartners,
} from 'lib/about';
import { founders, sustainer, partners, advocate } from 'lib/sponsors';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import Divider from 'components/Divider';
import Section from 'components/Section';
import DorknamicIsland from 'components/dorknamic-island';
import HeroSecondary from 'components/HeroSecondary';
import ContentMaster from 'components/ContentMaster';
import Container from 'components/Container';
import SpotHeader from 'components/SpotHeader';
import AccordionCouncil from 'components/AccordionCouncil';
import DividerRow from 'components/DividerRow';
import AccordionSponsor from 'components/AccordionSponsor';
import ContentSide from 'components/ContentSide';
import SectionDivider from 'components/SectionDivider';
import asciiAbout from 'assets/img/ascii-about.svg';
import asciiShare from 'assets/img/ascii-share.svg';
import asciiSponsors from 'assets/img/ascii-sponsors--black.svg';
import { StyledSectionSpacing } from 'styles/sharedStyles';
import createMetaTitle from 'lib/createMetaTitle';

export const StyledSponsorsList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 32px;
  align-items: flex-start;

  ${mQ(bp.desktop)} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const StyledLoreContent = styled.div`
  a {
    color: ${({ theme }) => theme.colors.deepPink};
  }
`;

const About = () => {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>{createMetaTitle('About')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('About')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('About')}
        />
      </Head>

      <DorknamicIsland>
        <a href="#lore">Lore</a>
        <a href="#love">Love</a>
        <a href="#sponsors">Sponsors</a>
        <a href="#rewards">Rewards</a>
        <a href="#council">Council</a>
      </DorknamicIsland>

      <HeroSecondary
        title="About"
        icon={<img src={asciiAbout.src} alt="" width="608" height="608" />}
      />

      <Section id="lore">
        <Container>
          <StyledSectionSpacing>
            <ContentMaster size="xl" title={lore.title} />

            <StyledLoreContent>
              <ContentSide>
                <ContentMaster size="xl">{lore.content}</ContentMaster>
                <ContentMaster size="xl" links={lore.links}>
                  {lore.contentRight}
                </ContentMaster>
              </ContentSide>
            </StyledLoreContent>
          </StyledSectionSpacing>
        </Container>
      </Section>

      <SectionDivider
        align="right"
        bgColor={theme.colors.typography}
        fgColor={theme.colors.black}
      />

      <Section
        id="love"
        bgColor={theme.colors.black}
        isDark
        color={theme.colors.typography}
      >
        <Container>
          <StyledSectionSpacing>
            <SpotHeader
              image={{
                src: asciiShare.src,
                alt: '',
              }}
              content={{
                size: 'xl',
                title: sharing.share.title,
                children: sharing.share.content,
              }}
            />

            <Divider type="doubledashed" />

            <DividerRow gap="128px">
              <ContentMaster
                size="md"
                titleTag="h3"
                title={<>{sharing.writing.title}</>}
                children={sharing.writing.content}
                hasCaret={false}
              />

              <ContentMaster
                size="md"
                titleTag="h3"
                title={<>{sharing.social.title}</>}
                children={sharing.social.content}
                hasCaret={false}
              />
            </DividerRow>

            <ContentMaster align="center" size="xl2">
              {sharing.cta}
            </ContentMaster>
          </StyledSectionSpacing>
        </Container>
      </Section>

      <SectionDivider
        bgColor={theme.colors.typography}
        fgColor={theme.colors.black}
        isFlipped
      />

      <Section id="sponsors">
        <Container>
          <StyledSectionSpacing>
            <SpotHeader
              image={{
                src: asciiSponsors.src,
                alt: '',
              }}
              content={{
                size: 'xl',
                title: sponsorsAndPartners.title,
                children: sponsorsAndPartners.content,
              }}
            />

            <StyledSectionSpacing $isSmall={true}>
              <ContentMaster size="lg" title="Our Sponsors" hasCaret={false} />

              <ContentMaster
                size="md"
                title={<>Founder</>}
                titleTag="h3"
                hasCaret={false}
              />

              <StyledSponsorsList>
                {founders.map((item) => (
                  <AccordionSponsor
                    key={item.title}
                    image={{ src: item.image, alt: '' }}
                    title={item.title}
                    link={{ children: item.link.title, ...item.link }}
                    children={item.content}
                    collapsed
                  />
                ))}
              </StyledSponsorsList>
            </StyledSectionSpacing>

            <StyledSectionSpacing $isSmall={true}>
              <ContentMaster
                size="md"
                title={<>Advocate</>}
                titleTag="h3"
                hasCaret={false}
              />

              <StyledSponsorsList>
                {advocate.map((item) => (
                  <AccordionSponsor
                    key={item.title}
                    image={{ src: item.image, alt: '' }}
                    title={item.title}
                    link={{ children: item.link.title, ...item.link }}
                    children={item.content}
                    collapsed
                  />
                ))}
              </StyledSponsorsList>
            </StyledSectionSpacing>

            <StyledSectionSpacing $isSmall={true}>
              <ContentMaster
                size="md"
                title={<>Sustainer</>}
                titleTag="h3"
                hasCaret={false}
              />

              <StyledSponsorsList>
                {sustainer.map((item) => (
                  <AccordionSponsor
                    key={item.title}
                    image={{ src: item.image, alt: '' }}
                    title={item.title}
                    link={{ children: item.link.title, ...item.link }}
                    children={item.content}
                    collapsed
                  />
                ))}
              </StyledSponsorsList>
            </StyledSectionSpacing>

            <StyledSectionSpacing $isSmall={true}>
              <ContentMaster size="lg" title="Our Partners" hasCaret={false} />

              <StyledSponsorsList>
                {partners.map((item) => (
                  <AccordionSponsor
                    key={item.title}
                    image={{ src: item.image, alt: '' }}
                    title={item.title}
                    link={{ children: item.link.title, ...item.link }}
                    children={item.content}
                    collapsed
                  />
                ))}
              </StyledSponsorsList>
            </StyledSectionSpacing>
          </StyledSectionSpacing>
        </Container>
      </Section>

      <SectionDivider
        bgColor={theme.colors.green}
        fgColor={theme.colors.typography}
        isFlipped
      />

      <Section id="rewards" bgColor={theme.colors.green}>
        <Container>
          <StyledSectionSpacing>
            <ContentMaster size="xl" title={rewards.title} />

            <ContentSide>
              <ContentMaster size="xl">{rewards.content}</ContentMaster>

              <ContentMaster size="xl">{rewards.contentRight}</ContentMaster>
            </ContentSide>
          </StyledSectionSpacing>
        </Container>
      </Section>

      <SectionDivider
        align="right"
        bgColor={theme.colors.green}
        fgColor={theme.colors.typography}
      />

      <Section id="council">
        <Container>
          <StyledSectionSpacing>
            <ContentMaster size="xl" title={advisoryCouncil.title}>
              {advisoryCouncil.content}
            </ContentMaster>

            <StyledSectionSpacing $isSmall>
              {council.map((member, index) => (
                <AccordionCouncil
                  key={member.name}
                  filled
                  image={{
                    src: member.image,
                    alt: `Profile image of ${member.name}`,
                  }}
                  title={member.name}
                  subtitle={`[${member.role}]`}
                  skills={member.skills}
                  links={member.links}
                  collapsed
                >
                  {member.bio}
                </AccordionCouncil>
              ))}
            </StyledSectionSpacing>
          </StyledSectionSpacing>
        </Container>
      </Section>
    </>
  );
};

export const getStaticProps = async () => {
  const shouldRender404 = true;

  if (shouldRender404) {
    return {
      notFound: true,
    };
  }

  return { props: {} };
};

export default About;
