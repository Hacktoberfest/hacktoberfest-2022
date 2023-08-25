import Head from 'next/head';
import React, { useEffect, useMemo, useState } from 'react';
import { knuthShuffle } from 'knuth-shuffle';
import styled from 'styled-components';

import fetchProjects from 'lib/donate';

import Section from 'components/Section';

import HeroSecondary from 'components/HeroSecondary';
import PixelFlower from 'components/pixels/PixelFlower';
import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import Divider from 'components/Divider';
import AccordionCouncil from 'components/AccordionCouncil';
import ButtonMain from 'components/ButtonMain';
import { body20 } from 'themes/typography';

export const StyledProjects = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 48px 0;
`;

export const StyledMoreProjects = styled.div`
  text-align: center;
`;

export const StyledSearch = styled.div`
  position: relative;
  margin-top: 64px;

  &:has(input:focus)::before {
    opacity: 1;
  }

  &:has(input:focus)::after {
    opacity: .3;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out; /* stylelint-disable-line property-no-vendor-prefix */
    mask-composite: exclude;
    padding: 1px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 300ms ease-in-out;
  }

  &::before {
    background: linear-gradient(77.9deg, #EC4237 0%, #33B6D8 100%);
  }

  &::after {
    background: linear-gradient(230deg, #FFFBA4 0%, rgba(255, 251, 164, 0) 100%);
  }

  input {
    padding: 16px 24px;
    width: 100%;
    color: ${(props) => props.theme.text};
    ${body20};
    border-radius: 16px;
    border: 1px solid ${({theme}) => theme.colors.neutral.manga400};
    background: ${({theme}) => theme.card.bg};
    backdrop-filter: blur(5px);
    transition: box-shadow 300ms ease-in-out;

    &:focus {
      box-shadow: 1px 1px 10px 0px rgba(236, 66, 55, 0.50), -1px -1px 10px 0px rgba(255, 251, 164, 0.50);
      outline: 0;
    }

    &::placeholder {
      color: ${(props) => props.theme.text};
    }
  }
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
        <title>Donate | Hacktoberfest 2023</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Donate | Hacktoberfest 2023"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Donate | Hacktoberfest 2023"
        />
      </Head>

      <HeroSecondary
        title="Donate"
        icon={
          <PixelFlower
            width="1700"
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
            Open-source projects keep the internet humming—but they can’t do it without resources. Projects are always in need of financial support so they can develop new features, cover expenses, and continue their regular activities. Find a project to donate money to right here.
          </ContentMaster>

          <StyledSearch>
            <input
              type="text"
              placeholder="[ Search projects... ]"
              value={projectsSearch}
              onChange={(e) => setProjectsSearch(e.target.value)} />
          </StyledSearch>
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
                <React.Fragment key={`${project.source}:${project.name}`}>
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
                    links={project.source !== 'OpenCollective' ? project.link : null}
                    collapsed
                  />
                  {projectsList.length !== (index + 1) && (
                    <Divider />
                  )}
                </React.Fragment>
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
