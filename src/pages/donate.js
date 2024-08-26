import Head from 'next/head';
import React, { useEffect, useMemo, useState } from 'react';
import { knuthShuffle } from 'knuth-shuffle';
import styled, { useTheme } from 'styled-components';

import fetchProjects from 'lib/donate';

import Section from 'components/Section';

import HeroSecondary from 'components/HeroSecondary';
import asciiDonate from 'assets/img/ascii-donate.svg';
import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import Divider from 'components/Divider';
import AccordionCouncil from 'components/AccordionCouncil';
import ButtonMain from 'components/ButtonMain';
import { body20 } from 'themes/typography';
import createMetaTitle from 'lib/createMetaTitle';

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
  margin-top: 60px;

  input {
    padding: 16px 24px;
    width: 100%;
    color: ${({ theme }) => theme.colors.black};
    ${body20};
    border-radius: 0;
    border: 1px solid ${({ theme }) => theme.colors.black};
    background: transparent;
    backdrop-filter: blur(5px);
    font-weight: 500;
    transition: box-shadow 300ms ease-in-out;

    &:focus {
      box-shadow:
        -1px -1px 10px 0px ${({ theme }) => theme.colors.deepPink},
        1px 1px 10px 0px ${({ theme }) => theme.colors.deepPink};
      color: ${({ theme }) => theme.colors.deepPink};
      outline: 0;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.black};
    }
  }
`;

const Donate = ({ projects }) => {
  const theme = useTheme();
  const [projectsShuffled, setProjectsShuffled] = useState([]);
  useEffect(() => setProjectsShuffled(knuthShuffle([...projects])), [projects]);

  const [projectsSearch, setProjectsSearch] = useState('');
  const projectsFiltered = useMemo(
    () =>
      projectsShuffled.filter((project) =>
        project.name.toLowerCase().includes(projectsSearch.toLowerCase()),
      ),
    [projectsShuffled, projectsSearch],
  );

  const [projectsCount, setProjectsCount] = useState(3);
  const projectsList = useMemo(
    () => projectsFiltered.slice(0, projectsCount),
    [projectsFiltered, projectsCount],
  );
  useEffect(() => setProjectsCount(3), [projectsFiltered]);

  return (
    <>
      <Head>
        <title>{createMetaTitle('Donate')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('Donate')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('Donate')}
        />
      </Head>

      <HeroSecondary
        title="Donate"
        icon={<img src={asciiDonate.src} alt="" width="608" height="608" />}
      />

      <Section>
        <Container>
          <ContentMaster size="xl" title="Find a project">
            Open-source projects keep the internet humming—but they can’t do it
            without resources. Projects are always in need of financial support
            so they can develop new features, cover expenses, and continue their
            regular activities. Find a project to donate money to right here.
          </ContentMaster>

          <StyledSearch>
            <input
              type="text"
              placeholder="[ Search projects... ]"
              value={projectsSearch}
              onChange={(e) => setProjectsSearch(e.target.value)}
            />
          </StyledSearch>

          <StyledProjects>
            <Divider type="doubledashed" />

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
                    alt: `Project profile of ${project.name}`,
                  }}
                  imageRotatation={index % 2 ? 'left' : 'right'}
                  title={project.name}
                  subtitle={`[${project.source}]`}
                  skills={project.short}
                  iframe={
                    project.source === 'OpenCollective'
                      ? project.link.url
                      : null
                  }
                  links={
                    project.source !== 'OpenCollective' ? project.link : null
                  }
                  collapsed
                />
                <Divider />
              </React.Fragment>
            ))}

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

            <Divider type="doubledashed" />
          </StyledProjects>

          <ContentMaster
            size="xl"
            children={
              'Projects shown here are randomly picked from all those on GitHub that have the “hacktoberfest” topic and are sponsorable, and from all those on OpenCollective using the “hacktoberfest” tag and have custom contributions enabled.\n\n Not seeing the project you want to support? You don’t have to donate through this page, we encourage you to use other means to donate to the open-source project you’re most passionate about, or reach out to them if they don’t have an obvious way to support them.'
            }
          />
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
