import Head from 'next/head';
import styled, { keyframes } from 'styled-components';

import { intro, lore, digitalRewards, advisoryCouncil, council, lowNonCode } from 'lib/about';

import Collapse from 'components/collapse';
import Anchor from 'components/anchor';
import Divider from 'components/Divider';
import Section from 'components/section';
import Hero from 'components/hero';
import { PixelComputer } from 'components/pixels';
import DorknamicIsland from 'components/dorknamic-island';
import YouTube from '../components/youtube';
import HeroSecondary from 'components/HeroSecondary';
import PixelLogo from 'components/pixels/PixelLogo';
import ContentMaster from 'components/ContentMaster';
import Container from 'components/Container';
import Marquee from 'components/Marquee';
import SpotHeader from 'components/SpotHeader';

import IlloLeafs from 'assets/img/8bit-leafs.svg';

const textAnimation = () => keyframes`
  0% {
    content: " >"
  }
  33% {
    content: " ->"
  }
  66% {
    content: " -->"
  }
`;

const StyledTableWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
`;

const StyledCouncilMembers = styled.div`
  margin: 32px 0;

  details {
    margin: 24px 0;
    transition: 0.2s ease;
    background: linear-gradient(
      180deg,
      rgba(124, 127, 255, 0) 0%,
      rgba(124, 127, 255, 0.2) 100%
    );
    border: 1px solid ${(props) => props.theme.psybeam};
    border-radius: 24px;

    &:hover {
      box-shadow: 0px 0px 12px ${(props) => props.theme.psybeam};

      summary {
        img {
          transform: rotate(0deg) translateY(-10px) !important;
          filter: hue-rotate(140deg) contrast(150%) !important;
        }
      }
    }

    > div {
      padding-right: 40px;
    }

    ul {
      margin-top: 24px;
    }

    a {
      text-transform: none;
      transition: color 0.2s ease, filter 0.2s ease;
      font-variant-ligatures: none;

      &:after {
        content: ' >';
      }

      &:hover,
      &:focus {
        &:after {
          filter: ${(props) => props.theme.glowLiteDS};
          animation: ${textAnimation} 1.5s linear infinite;
        }
      }
    }

    &:nth-of-type(2n) {
      summary {
        img {
          transform: rotate(4deg);
        }
      }
    }

    summary {
      flex-wrap: wrap;

      @media (max-width: 600px) {
        padding: 16px 40px;
        align-items: center;
      }

      img {
        transition: 0.2s ease;
        transform: rotate(-4deg);
        border-radius: 24px;
        margin-right: 24px;
      }
    }
  }
`;

export const StyledCouncilMemberContent = styled.div`
  margin: 32px 0;
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
            {council.map((member) => (
              <Collapse
                key={member.name}
                title={
                  <>
                    <img
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      style={{ objectFit: 'cover' }}
                    />
                    <h3>{member.name}</h3>
                  </>
                }
                collapsed
              >
                <StyledCouncilMemberContent>
                  <p>{member.role}</p>
                  <p>{member.skills}</p>
                  <p>{member.bio}</p>
                  {!!member.links.length && (
                    <ul>
                      {member.links.map((link) => (
                        <li key={link.title}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </StyledCouncilMemberContent>
              </Collapse>
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
      </Container>
    </>
  );
};

export default About;
