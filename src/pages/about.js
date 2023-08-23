import Head from 'next/head';
import styled, { keyframes } from 'styled-components';

import { intro, lore, digitalRewards, advisoryCouncil, council, lowNonCode } from 'lib/about';

import Collapse from 'components/collapse';
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

const About = () => {
  return (
    <>
      <Head>
        <title>About | Hacktoberfest 2022</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="About | Hacktoberfest 2022"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="About | Hacktoberfest 2022"
        />
      </Head>

      <DorknamicIsland>
        <a href="#lore">Hacktoberfest Lore</a>
        <a href="#low-or-non-code">Low or Non Code Contributions</a>
        <a href="#council">Advisory Council</a>
      </DorknamicIsland>

      <HeroSecondary
        title="About"
        icon={
          <PixelLogo
            width="1360"
            scale="1"
            timing="5"
            frames="4"
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

          <YouTube id="BDUtORDL_k4" title="Open Source is Counting on You! Answer the Call, at Hacktoberfest 2022" />
        </Section>

        <Section>
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
        <Section>
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

      <Section>
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

        <Section>
          <SpotHeader
            image={{
              src: IlloLeafs.src,
              alt: ''
            }}
            content={{
              size: 'xl',
              title: 'Our Sponsors & Partners',
              children: 'Hacktoberfest could not happen without the generous support of our sponsors and partners. We invite you to learn more about them here.'
            }}
          />
        </Section>

        <Divider type="pixel" />

        <Section>
          <StyledHacktoberfestLove>
            <ContentMaster size="xl" title="Hacktoberfest Love" />
            <PixelHearts />
          </StyledHacktoberfestLove>

          <Section small>
            <div style={{maxWidth: '1012px'}}>
              <ContentMaster size="md" titleTag="h3" title="Share your Hacktoberfest">
                Join the Hacktoberfest community by sharing your story through photos, videos, or a blog post! Whether you're a  contributor, maintainer, event organizer, sponsor, or partner we want to hear from you.
              </ContentMaster>
            </div>
          </Section>

          <Divider type="doubledashed" />

          <DividerRow gap="128px">
            <ContentMaster
              size="md"
              titleTag="h3"
              title="Video"
            >
              To share a photo or short video, simply fill out our video submissions form.
            </ContentMaster>

            <ContentMaster
              size="md"
              titleTag="h3"
              title="Social Media"
            >
              Share your Hacktoberfest experience on social media! Use the official hashtag #hacktoberfest10 and tell others about your favorite contributions, any swag you've received in the past (share a pic!), or a particularly memorable hack.
            </ContentMaster>
          </DividerRow>

          <Divider type="doubledashed" />

          <Section small>
            <StyledBlogSection>
              <ContentMaster
                size="md"
                titleTag="h3"
                title="Blog post"
              />

              <ContentMaster
                size="lg"
              >
                If you'd like to write about your experience participating in Hacktoberfest, we encourage you to create a blog post. Our partners at DEV welcome your writings, here are some great examples. You can share how you first heard about Hacktoberfest, how being part of the community has impacted your personal or professional development, and your favorite or most useful hack. Creativity is welcome! Once your blog post is live, let us know by tagging us in your social media posts about it.
              </ContentMaster>
            </StyledBlogSection>
          </Section>

          <Divider type="doubledashed" />

          <HeartCallout>
            We look forward to hearing from you and seeing how you've been part of the **Hacktoberfest community**!
          </HeartCallout>
        </Section>
      </Container>
    </>
  );
};

export default About;
