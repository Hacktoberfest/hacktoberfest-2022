import Head from 'next/head';
import styled from 'styled-components';

import {
  intro,
  lore,
  digitalRewards,
  advisoryCouncil,
  council,
  founders,
  contributors,
  sustainer,
  partners,
  sharing
} from 'lib/about';

import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import Divider from 'components/Divider';
import Section from 'components/Section';
import DorknamicIsland from 'components/dorknamic-island';
import YouTube from '../components/youtube';
import HeroSecondary from 'components/HeroSecondary';
import PixelLogo from 'components/pixels/PixelLogo';
import ContentMaster from 'components/ContentMaster';
import Container from 'components/Container';
import Marquee from 'components/Marquee';
import SpotHeader from 'components/SpotHeader';

import IlloLeafs from 'assets/img/8bit-leafs.svg';
import AccordionCouncil from 'components/AccordionCouncil';
import DividerRow from 'components/DividerRow';
import HeartCallout from 'components/HeartCallout';
import PixelHearts from 'components/pixels/PixelHearts';
import AccordionSponsor from 'components/AccordionSponsor';
import { headline48 } from 'themes/typography';

const StyledCouncilMembers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin: 80px 0 0;
`;

export const StyledBlogSection = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr);

  ${mQ(bp.desktop)} {
    gap: 24px;
    grid-template-columns: ${(339/1280) * 100}% ${(917/1280) * 100}%;
  }
`;

export const StyledHacktoberfestLove = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: column;

  ${mQ(bp.desktop)} {
    justify-content: space-between;
    gap: 80px;
    flex-direction: row;

    > div:first-child {
      max-width: 762px;
    }
  }
`;

export const StyledSponsorsList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 32px;
  align-items: flex-start;

  ${mQ(bp.desktop)} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const StyledSponsorsListTitle = styled.h2`
  margin: 64px 0 48px;
  ${headline48};
`;

const About = () => {
  return (
    <>
      <Head>
        <title>About | Hacktoberfest 2023</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="About | Hacktoberfest 2023"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="About | Hacktoberfest 2023"
        />
      </Head>

      <DorknamicIsland>
        <a href="#lore">Lore</a>
        <a href="#digital-rewards">Digital Rewards</a>
        <a href="#council">Council</a>
        <a href="#sponsors">Sponsors</a>
        <a href="#hacktoberfest-love">Hacktoberfest Love</a>
      </DorknamicIsland>

      <HeroSecondary
        title="About"
        icon={
          <PixelLogo
            width="1020"
            scale="1"
            timing="5"
            frames="3"
          />
        }
      />

      <Container inner>
        <Section>
          <ContentMaster
            align="center"
            size="xl"
            title={intro.title}
          >
            {intro.content}
          </ContentMaster>

          <YouTube id="BDUtORDL_k4" title="Open Source is Counting on You! Answer the Call, at Hacktoberfest 2023" />
        </Section>

        <Section id="lore">
          <ContentMaster
            size="xl"
            title={lore.title}
          >
            {lore.content}
          </ContentMaster>
        </Section>
      </Container>

      <Marquee
        text1="New for 2023"
        text2="New for 2023"
        direction="forwards"
      />

      <Container inner>
        <Section id="digital-rewards">
          <ContentMaster
            size="xl"
            title={digitalRewards.title}
          >
            {digitalRewards.content}
          </ContentMaster>
        </Section>
      </Container>

      <Container>
        <Divider type="pixel" />
      </Container>

      <Section id="council">
        <Container inner>
          <ContentMaster
            size="xl"
            title={advisoryCouncil.title}
          >
            {advisoryCouncil.content}
          </ContentMaster>
        </Container>

        <Container>
          <StyledCouncilMembers>
            {council.map((member, index) => (
              <AccordionCouncil
                key={member.name}
                filled
                image={{
                  src: member.image,
                  alt: `Profile image of ${member.name}`
                }}
                imageRotatation={ index % 2 ? 'left' : 'right' }
                title={member.name}
                subtitle={`[${member.role}]`}
                skills={member.skills}
                links={member.links}
                collapsed
              >
                {member.bio}
              </AccordionCouncil>
            ))}
          </StyledCouncilMembers>
        </Container>
      </Section>

      <Container>
        <Divider type="pixel" />

        <Section id="sponsors">
          <SpotHeader
            image={{
              src: IlloLeafs.src,
              alt: ''
            }}
            content={{
              size: 'xl',
              title: 'Our Sponsors & Partners',
              children: 'Hacktoberfest could not happen without the generous support of our sponsors and partners. We invite you to learn more about them!'
            }}
          />

          <StyledSponsorsListTitle>
            Founder
          </StyledSponsorsListTitle>

          <StyledSponsorsList>
            {founders.map((item, index) => (
              <AccordionSponsor
                key={item.title}
                image={{ src: item.image, alt: '' }}
                imageRotatation={ index % 2 ? 'left' : 'right' }
                title={item.title}
                link={{
                  href: item.link.href,
                  children: item.link.title
                }}
                children={item.content}
                collapsed
              />
            ))}
          </StyledSponsorsList>

          <StyledSponsorsListTitle>
            Contributor
          </StyledSponsorsListTitle>

          <StyledSponsorsList>
            {contributors.map((item, index) => (
              <AccordionSponsor
                key={item.title}
                image={{ src: item.image, alt: '' }}
                imageRotatation={ index % 2 ? 'left' : 'right' }
                title={item.title}
                link={{
                  href: item.link.href,
                  children: item.link.title
                }}
                children={item.content}
                collapsed
              />
            ))}
          </StyledSponsorsList>

          <StyledSponsorsListTitle>
            Sustainer
          </StyledSponsorsListTitle>

          <StyledSponsorsList>
            {sustainer.map((item, index) => (
              <AccordionSponsor
                key={item.title}
                image={{ src: item.image, alt: '' }}
                imageRotatation={ index % 2 ? 'left' : 'right' }
                title={item.title}
                link={{
                  href: item.link.href,
                  children: item.link.title
                }}
                children={item.content}
                collapsed
              />
            ))}
          </StyledSponsorsList>

          <StyledSponsorsListTitle>
            Our Partners:
          </StyledSponsorsListTitle>

          <StyledSponsorsList>
            {partners.map((item, index) => (
              <AccordionSponsor
                key={item.title}
                image={{ src: item.image, alt: '' }}
                imageRotatation={ index % 2 ? 'left' : 'right' }
                title={item.title}
                link={{
                  href: item.link.href,
                  children: item.link.title
                }}
                children={item.content}
                collapsed
              />
            ))}
          </StyledSponsorsList>
        </Section>

        <Divider type="pixel" />

        <Section id="hacktoberfest-love">
          <StyledHacktoberfestLove>
            <ContentMaster size="xl2" title={sharing.intro} />
            <PixelHearts />
          </StyledHacktoberfestLove>

          <Section small>
            <div style={{maxWidth: '1012px'}}>
              <ContentMaster
                size="md"
                titleTag="h3"
                title={sharing.share.title}
                children={sharing.share.content}
              />
            </div>
          </Section>

          <Divider type="doubledashed" />

          <DividerRow gap="128px">
            <ContentMaster
              size="md"
              titleTag="h3"
              title={sharing.video.title}
              children={sharing.video.content}
            />

            <ContentMaster
              size="md"
              titleTag="h3"
              title={sharing.social.title}
              children={sharing.social.content}
            />
          </DividerRow>

          <Divider type="doubledashed" />

          <Section small>
            <StyledBlogSection>
              <ContentMaster
                size="md"
                titleTag="h3"
                title={sharing.blog.title}
              />

              <ContentMaster
                size="lg"
                children={sharing.blog.content}
              />
            </StyledBlogSection>
          </Section>

          <Divider type="doubledashed" />

          <HeartCallout>
            {sharing.cta}
          </HeartCallout>
        </Section>
      </Container>
    </>
  );
};

export default About;
