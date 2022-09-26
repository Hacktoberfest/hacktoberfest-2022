import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { knuthShuffle } from 'knuth-shuffle';
import styled from 'styled-components';

import fetchProjects from 'lib/donate';

import Button, { StyledButton } from 'components/button';
import Collapse from 'components/collapse';
import Section from 'components/section';
import { PixelCoin } from 'components/pixels';
import Hero from 'components/hero';

import { StyledList, StyledListItem, StyledSearch, StyledSubText } from './events';

export const StyledProject = styled(StyledListItem)`
  details {
    summary {
      @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        position: relative;

        &::before {
          position: absolute;
          top: 0;
          left: 0;
          margin: 0;
        }
      }

      > div {
        > p {
          color: ${(props) =>
            props.theme[props.color] || props.color || props.theme.text};

          @media (max-width: 600px) {
            margin-left: 48px;
          }
        }

        > div {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 8px 0;

          @media (max-width: 600px) {
            flex-direction: column;
            align-items: flex-start;
          }

          > img {
            border-radius: 16px;
            filter: ${(props) => props.theme.glowLiteDS};
          }

          > div {
            margin: 8px 0;

            h3 {
              margin: 0 0 16px;
            }
          }
        }
      }
    }

    > div {
      @media (max-width: 600px) {
        margin: 0;
      }
    }

    ${StyledButton} {
      filter: ${(props) => props.theme.glowLiteDS};
      margin: 8px;
    }
  }
`;

export const StyledFrame = styled.iframe`
  background: #fff;
`;

const typesToColors = {
  opencollective: ['#1F87FF', '#170F1E'],
  'github sponsors': ['#EA4AAA', '#170F1E'],
};

const Project = ({ project }) => {
  const allLinks = useMemo(
    () => (Array.isArray(project.link) ? project.link : [project.link]),
    [project]
  );
  const color = useMemo(
    () => typesToColors[project.source.toLowerCase()],
    [project]
  );

  return (
    <StyledProject color={color[0]}>
      <Collapse
        collapsed
        title={
          <div>
            <p>[ {project.source} ]</p>
            <div>
              <img
                src={project.icon}
                alt=""
                width={64}
                height={64}
                style={{ objectFit: 'cover' }}
              />
              <div>
                <h3>{project.name}</h3>
                <span>{project.short}</span>
              </div>
            </div>
          </div>
        }
      >
        {project.source === 'OpenCollective' ? (
          <StyledFrame
            src={allLinks[0].url}
            width="100%"
            height="920"
            frameBorder="0"
            scrolling="no"
          />
        ) : (
          <p>
            {allLinks.map((link) => (
              <Button
                key={link.title}
                color_bg={color[0]}
                color_text={color[1]}
                as="a"
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {link.title}
              </Button>
            ))}
          </p>
        )}
      </Collapse>
    </StyledProject>
  );
};

const Donate = ({ projects }) => {
  const [projectsShuffled, setProjectsShuffled] = useState([]);
  useEffect(() => setProjectsShuffled(knuthShuffle([...projects])), [projects]);

  const [projectsSearch, setProjectsSearch] = useState('');
  const projectsFiltered = useMemo(
    () =>
      projectsShuffled.filter((project) =>
        project.name.toLowerCase().includes(projectsSearch.toLowerCase())
      ),
    [projectsShuffled, projectsSearch]
  );

  const [projectsCount, setProjectsCount] = useState(3);
  const projectsList = useMemo(
    () => projectsFiltered.slice(0, projectsCount),
    [projectsFiltered, projectsCount]
  );
  useEffect(() => setProjectsCount(3), [projectsFiltered]);

  return (
    <>
      <Head>
        <title>Donate | Hacktoberfest 2022</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Donate | Hacktoberfest 2022"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Donate | Hacktoberfest 2022"
        />
      </Head>

      <Hero
        h="110"
        s="5"
        b="0.5"
        gradientLeft="#0AFFA2"
        gradientRight="#B5FF0A"
        title="Donate"
      >
        <PixelCoin />
      </Hero>

      <Section>
        <StyledSubText>
          Open-source projects keep the internet humming—but they can’t do it
          without resources. Projects are always in need of financial support so
          they can develop new features, cover expenses, and continue their
          regular activities. Find a project to donate money to right here.
        </StyledSubText>
        <StyledSearch
          type="text"
          placeholder="[ Search projects... ]"
          value={projectsSearch}
          onChange={(e) => setProjectsSearch(e.target.value)}
        />
        <StyledList>
          {projectsShuffled.length === 0 && (
            <p>[ Sorry, there are no projects listed currently ]</p>
          )}
          {projectsShuffled.length > 0 && projectsList.length === 0 && (
            <p>[ Sorry, no projects matched your search query ]</p>
          )}
          {projectsList.map((project) => (
            <Project
              key={`${project.source}:${project.name}`}
              project={project}
            />
          ))}
        </StyledList>
        {projectsCount < projectsFiltered.length && (
          <Button
            special
            onClick={() => setProjectsCount((count) => count + 3)}
          >
            Load More Projects
          </Button>
        )}
      </Section>
    </>
  );
};

export const getStaticProps = async () => {
  const projects = await fetchProjects();

  return {
    props: {
      projects,
    },
  };
};

export default Donate;
