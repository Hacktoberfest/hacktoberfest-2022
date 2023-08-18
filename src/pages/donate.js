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
import HeroSecondary from 'components/HeroSecondary';
import PixelFlower from 'components/pixels/PixelFlower';
import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import Divider from 'components/Divider';
import Project from 'components/Project';

export const StyledProject = styled.div`
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


export const StyledDonateProjects = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
`;

// const Project = ({ project }) => {
//   const allLinks = useMemo(
//     () => (Array.isArray(project.link) ? project.link : [project.link]),
//     [project]
//   );
//   const color = useMemo(
//     () => typesToColors[project.source.toLowerCase()],
//     [project]
//   );

//   return (
//     <StyledProject color={color[0]}>
//       <Collapse
//         collapsed
//         title={
//           <div>
//             <p>[ {project.source} ]</p>
//             <div>
//               <img
//                 src={project.icon}
//                 alt=""
//                 width={64}
//                 height={64}
//                 style={{ objectFit: 'cover' }}
//               />
//               <div>
//                 <h3>{project.name}</h3>
//                 <span>{project.short}</span>
//               </div>
//             </div>
//           </div>
//         }
//       >
//         {project.source === 'OpenCollective' ? (
//           <StyledFrame
//             src={allLinks[0].url}
//             width="100%"
//             height="920"
//             frameBorder="0"
//             scrolling="no"
//           />
//         ) : (
//           <p>
//             {allLinks.map((link) => (
//               <Button
//                 key={link.title}
//                 color_bg={color[0]}
//                 color_text={color[1]}
//                 as="a"
//                 href={link.url}
//                 target="_blank"
//                 rel="noreferrer noopener"
//               >
//                 {link.title}
//               </Button>
//             ))}
//           </p>
//         )}
//       </Collapse>
//     </StyledProject>
//   );
// };

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

      <Container inner>
        <Section>
          <StyledDonateProjects>
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

            <div>
              <Divider type="doubledashed" />
              <StyledList>
                {projectsShuffled.length === 0 && (
                  <p>[ Sorry, there are no projects listed currently ]</p>
                )}
                {projectsShuffled.length > 0 && projectsList.length === 0 && (
                  <p>[ Sorry, no projects matched your search query ]</p>
                )}
                {projectsList.map((project, index) => (
                  <>
                    <Project
                      key={`${project.source}:${project.name}`}
                      project={project}
                    />
                    {projectsList.length !== (index + 1) && (
                      <Divider />
                    )}
                  </>
                ))}
              </StyledList>
              <Divider type="doubledashed" />
            </div>

            {projectsCount < projectsFiltered.length && (
              <Button
                onClick={() => setProjectsCount((count) => count + 3)}
              >
                Load More Projects
              </Button>
            )}
          </StyledDonateProjects>
        </Section>
      </Container>
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
