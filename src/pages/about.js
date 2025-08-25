import Head from 'next/head';
import styled, { useTheme } from 'styled-components';

import { lore, sharing, rewards, sponsorsAndPartners } from 'lib/about';
import { founders, partners, advocate } from 'lib/sponsors';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import Divider from 'components/Divider';
import Section from 'components/Section';
import HeroSecondary from 'components/HeroSecondary';
import ContentMaster from 'components/ContentMaster';
import Container from 'components/Container';
import AccordionSponsor from 'components/AccordionSponsor';
import ContentSide from 'components/ContentSide';
import about from 'assets/img/heroes/about.svg';
import { StyledSectionSpacing } from 'styles/sharedStyles';
import createMetaTitle from 'lib/createMetaTitle';
import Image from 'next/image';
import Layout from '../components/Layout';

import animation from 'assets/img/heroicon-animation.gif';
import CardCallout from '../components/CardCallout';

export const StyledSponsorsList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 32px;
  align-items: flex-start;

  ${mQ(bp.desktop)} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledLeftSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const StyledDesktopAnimation = styled(Image)`
  display: none;

  ${mQ(bp.desktop)} {
    display: block;
    width: 335px;
    height: auto;
  }
`;
const StyledMobileAnimation = styled(Image)`
  display: block;
  height: auto;
  margin: 0 auto;
  width: 220px;

  ${mQ(bp.desktop)} {
    display: none;
  }
`;

const StyledDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
  grid-column: full-start / full-end;
`;

const StyledSectionDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
`;

const StyledSponsorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 0 auto;

  ${mQ(bp.desktop)} {
    gap: 64px;
    max-width: 560px;
  }
`;

const StyledContentMaster = styled(ContentMaster)`
  margin-top: 18px;

  ${mQ(bp.desktop)} {
    margin-top: 56px;
  }
`;

const StyledContentSide = styled(ContentSide)`
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${mQ(bp.desktop)} {
    flex-direction: row;
    gap: 144px;
  }

  img {
    border-radius: 8px;
    height: 241px;
    object-fit: cover;
    width: 100%;

    ${mQ(bp.desktop)} {
      height: 304px;
      width: 304px;
    }
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

      <HeroSecondary title="About" icon={<Image src={about} alt="" />} />

      <Layout>
        <Section id="lore">
          <Container>
            <StyledSectionSpacing>
              <ContentSide>
                <StyledLeftSide>
                  <ContentMaster title={lore.title} size="lg" />
                  <StyledDesktopAnimation src={animation} alt="" />
                </StyledLeftSide>
                <CardCallout
                  body={
                    <ContentMaster size="lg" links={lore.links}>
                      {lore.contentRight}
                    </ContentMaster>
                  }
                />
                <StyledMobileAnimation src={animation} alt="" />
              </ContentSide>
            </StyledSectionSpacing>
          </Container>
        </Section>

        <StyledDivider />

        <Section id="love">
          <Container>
            <StyledSectionSpacing>
              <ContentMaster title={sharing.intro} size="lg" />
              <ContentSide isEqual>
                <StyledSectionSpacing $isSmall>
                  <ContentMaster
                    size="sm"
                    title={sharing.share.title}
                    titleIcon={sharing.share.titleIcon}
                  >
                    {sharing.share.content}
                  </ContentMaster>
                  <ContentMaster
                    size="sm"
                    title={sharing.social.title}
                    titleIcon={sharing.social.titleIcon}
                  >
                    {sharing.social.content}
                  </ContentMaster>
                </StyledSectionSpacing>
                <ContentMaster
                  size="sm"
                  title={sharing.writing.title}
                  titleIcon={sharing.writing.titleIcon}
                >
                  {sharing.writing.content}
                </ContentMaster>
              </ContentSide>
            </StyledSectionSpacing>
          </Container>
        </Section>

        <StyledDivider />

        <Section id="sponsors">
          <Container>
            <StyledSectionSpacing $isSmall>
              <StyledSponsorsContainer>
                <ContentMaster
                  size="lg"
                  align="center"
                  title={sponsorsAndPartners.title}
                >
                  {sponsorsAndPartners.content}
                </ContentMaster>

                <StyledSectionDivider type="solid" />

                <StyledSectionSpacing $isSmall={true}>
                  <ContentMaster size="md" title="Sponsors" align="center" />

                  {founders.map((item) => (
                    <CardCallout>
                      <AccordionSponsor
                        key={item.title}
                        image={item.image}
                        title={item.title}
                        children={item.content}
                        list={item.list}
                        collapsed
                      />
                    </CardCallout>
                  ))}
                </StyledSectionSpacing>
              </StyledSponsorsContainer>

              <StyledSponsorsList>
                {advocate.map((item) => (
                  <CardCallout>
                    <AccordionSponsor
                      key={item.title}
                      image={item.image}
                      title={item.title}
                      children={item.content}
                      collapsed
                    />
                  </CardCallout>
                ))}
              </StyledSponsorsList>

              <StyledContentMaster size="lg" title="Partners" align="center" />

              <StyledSponsorsList>
                {partners.map((item) => (
                  <CardCallout>
                    <AccordionSponsor
                      key={item.title}
                      image={item.image}
                      title={item.title}
                      children={item.content}
                      collapsed
                    />
                  </CardCallout>
                ))}
              </StyledSponsorsList>
            </StyledSectionSpacing>
          </Container>
        </Section>

        <Section id="rewards">
          <Container>
            <StyledContentSide>
              <Image src={rewards.image} alt="" />

              <ContentMaster size="lg" title={rewards.title}>
                {rewards.content}
              </ContentMaster>
            </StyledContentSide>
          </Container>
        </Section>

        <StyledDivider />
      </Layout>
    </>
  );
};

export default About;
