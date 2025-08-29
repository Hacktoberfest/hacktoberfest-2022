import Head from 'next/head';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { knuthShuffle } from 'knuth-shuffle';
import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import styled, { useTheme } from 'styled-components';

import fetchProjects from 'lib/donate';

import Section from 'components/Section';

import HeroSecondary from 'components/HeroSecondary';
import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import Divider from 'components/Divider';
import AccordionCouncil from 'components/AccordionCouncil';
import ButtonMain from 'components/ButtonMain';
import { textSm } from 'themes/typography';
import createMetaTitle from 'lib/createMetaTitle';

import donate from 'assets/img/heroes/donate.svg';
import Image from 'next/image';
import Layout from '../components/Layout';
import CardCallout from '../components/CardCallout';

export const StyledProjects = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 0;

  ${mQ(bp.desktop)} {
    padding: 88px 0;
  }
`;

export const StyledMoreProjects = styled.div`
  text-align: left;

  ${mQ(bp.desktop)} {
    text-align: center;
  }
`;

export const StyledSearch = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;

  ${mQ(bp.desktop)} {
    flex-direction: row;
    gap: 32px;
    margin-top: 40px;
  }

  input {
    padding: 16px;
    color: ${({ theme }) => theme.colors2025.space.white};
    ${textSm};
    border-radius: 0;
    border: 1px solid ${({ theme }) => theme.colors2025.eastBay};
    background: transparent;

    ${mQ(bp.desktop)} {
      width: 100%;
    }
    &:focus {
      outline: 0;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors2025.space.white};
    }
  }

  button {
    width: max-content;
  }
`;

const StyledDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
`;

const StyledContentMaster = styled(ContentMaster)`
  p {
    ${mQ(bp.desktop)} {
      font-size: 18px;
    }
  }
`;

const StyledHeroSecondary = styled(HeroSecondary)`
  ${mQ(bp.desktop)} {
    > div > div {
      padding: 16px 0;
    }
  }
`;

const Donate = ({ projects }) => {
  const theme = useTheme();
  const searchRef = useRef();
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

      <StyledHeroSecondary
        title="Donate"
        icon={<Image src={donate} alt="" />}
      />

      <Layout>
        <Section>
          <Container>
            <Container inner>
              <StyledContentMaster
                size="lg"
                align="center"
                title="Find a project"
              >
                Open-source projects keep the internet humming—but they can’t do
                it without resources. Projects are always in need of financial
                support so they can develop new features, cover expenses, and
                continue their regular activities. Find a project to donate
                money to right here.
              </StyledContentMaster>

              <StyledSearch>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="[Search projects...]"
                  value={projectsSearch}
                  onChange={(e) => setProjectsSearch(e.target.value)}
                />
                <ButtonMain
                  as="button"
                  onClick={() =>
                    setProjectsSearch(searchRef.current.value || '')
                  }
                >
                  Search
                </ButtonMain>
              </StyledSearch>
            </Container>

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
                  {index !== projectsList.length - 1 && (
                    <StyledDivider type="solid" />
                  )}
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
            </StyledProjects>

            <CardCallout
              body={
                <ContentMaster
                  children={
                    'Projects shown here are randomly picked from all those on GitHub that have the “hacktoberfest” topic and are sponsorable, and from all those on OpenCollective using the “hacktoberfest” tag and have custom contributions enabled.\n\n Not seeing the project you want to support? You don’t have to donate through this page, we encourage you to use other means to donate to the open-source project you’re most passionate about, or reach out to them if they don’t have an obvious way to support them.'
                  }
                />
              }
            />
          </Container>
        </Section>
      </Layout>
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
