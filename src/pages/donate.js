import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { knuthShuffle } from 'knuth-shuffle';
import styled from 'styled-components';

import fetchProjects from 'lib/donate';

import Button, { StyledButton } from 'components/button';
import Collapse from 'components/collapse';
import Section from 'components/section';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import { StyledList, StyledListItem } from './events';

export const StyledSearch = styled.input`
  padding: 16px;
  width: 100%;
  height: 56px;
  background: linear-gradient(
    90deg,
    rgba(255, 226, 125, 0.1) 0%,
    rgba(100, 227, 255, 0.1) 50.52%,
    rgba(145, 146, 255, 0.1) 100%
  );
  border: 1px solid ${(props) => props.theme.text};
  border-radius: 4px;
  color: ${(props) => props.theme.text};

  &::placeholder {
    color: ${(props) => props.theme.text};
  }
`;

export const StyledSubText = styled.div`
  margin: 38px 0 72px;
  width: 864px;
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
  opacity: 0.75;
  text-shadow: ${(props) => props.theme.smallTextShadow};

  ${mQ(bp.tablet, 'max')} {
    width: 100%;
  }
`;

export const StyledProject = styled(StyledListItem)`
  details {
    summary {
      > div {
        > p {
          color: ${(props) =>
            props.theme[props.color] || props.color || props.theme.text};
        }

        > div {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 8px 0;
          
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
        <meta name="twitter:title" key="twitterTitle" content="Donate | Hacktoberfest 2022" />
        <meta property="og:title" key="opengraphTitle" content="Donate | Hacktoberfest 2022" />
      </Head>

      <Section>
        <h1>Donate</h1>
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
          {projectsList.map((project) => (
            <Project
              key={`${project.source}:${project.name}`}
              project={project}
            />
          ))}
        </StyledList>
        {projectsCount < projectsFiltered.length && (
          <Button special onClick={() => setProjectsCount((count) => count + 3)}>
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
