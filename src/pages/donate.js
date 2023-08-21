import Head from 'next/head';
import { Children, useEffect, useMemo, useState } from 'react';
import { knuthShuffle } from 'knuth-shuffle';
import styled from 'styled-components';

import fetchProjects from 'lib/donate';

import Button, { StyledButton } from 'components/button';

import Section from 'components/Section';

import { StyledList, StyledListItem, StyledSearch, StyledSubText } from './events';
import HeroSecondary from 'components/HeroSecondary';
import PixelFlower from 'components/pixels/PixelFlower';
import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import Divider from 'components/Divider';
import Project from 'components/Project';
import AccordionCouncil from 'components/AccordionCouncil';
import ButtonMain from 'components/ButtonMain';

export const StyledProjects = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 48px 0;
`;

export const StyledMoreProjects = styled.div`
  text-align: center;
`;

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

      <HeroSecondary
        title="Donate"
        icon={
          <PixelFlower
            width="1200"
            scale="1"
            timing="5"
            frames="5"
            id="f3"
          />
        }
      />

      <Section>
        <Container inner>
          <ContentMaster
            size="xl"
            title="Find a project"
          >
            Open-source projects keep the internet humming—but they can’t do it
            without resources. Projects are always in need of financial support so
            they can develop new features, cover expenses, and continue their
            regular activities. Find a project to donate money to right here.
          </ContentMaster>

          <StyledSearch
            type="text"
            placeholder="[ Search projects... ]"
            value={projectsSearch}
            onChange={(e) => setProjectsSearch(e.target.value)}
            />
        </Container>

        <Container>
          <Section small>
            <Divider type="doubledashed" />
            <StyledProjects>
              {projectsShuffled.length === 0 && (
                <p>[ Sorry, there are no projects listed currently ]</p>
              )}
              {projectsShuffled.length > 0 && projectsList.length === 0 && (
                <p>[ Sorry, no projects matched your search query ]</p>
              )}
              {projectsList.map((project, index) => (
                <>
                  {console.log(project.link)}
                  <AccordionCouncil
                    key={`${project.source}:${project.name}`}
                    image={{
                      src: project.icon,
                      alt: `Project profile of ${project.name}`
                    }}
                    imageRotatation={ index % 2 ? 'left' : 'right' }
                    title={project.name}
                    subtitle={`[${project.source}]`}
                    skills={project.short}
                    iframe={project.source === 'OpenCollective' ? project.link.url : null}
                    collapsed
                  />
                  {projectsList.length !== (index + 1) && (
                    <Divider />
                  )}
                </>
              ))}
            </StyledProjects>
            <Divider type="doubledashed" />
          </Section>
          {projectsCount < projectsFiltered.length && (
            <StyledMoreProjects>
              <ButtonMain
                as="button"
                onClick={() => setProjectsCount((count) => count + 3)}
              >
                Load More Projects
              </ButtonMain>
            </StyledMoreProjects>
          )}
        </Container>
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
