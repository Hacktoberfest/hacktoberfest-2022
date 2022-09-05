import { useCallback, useEffect, useMemo, useState } from 'react';
import { knuthShuffle } from 'knuth-shuffle';
import fetchProjects from 'lib/donate';
import styled from 'styled-components';
import Button from 'components/button';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

import { StyledContainer, StyledList, StyledListItem } from './events';

export const StyledSearch = styled.input`
  padding: 16px;
  width: 100%;
  height: 56px;
  background: linear-gradient(90deg, rgba(255, 226, 125, 0.1) 0%, rgba(100, 227, 255, 0.1) 50.52%, rgba(145, 146, 255, 0.1) 100%);
  border: 1px solid #E5E1E6;
  border-radius: 4px;
  color: #fff;

  &::placeholder {
    color: #fff;
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
  color: #E5E1E6;
  opacity: 0.75;
  text-shadow: -1px -1px 6px rgba(255, 227, 126, 0.5), 1px 1px 6px rgba(144, 148, 255, 0.5);

  ${mQ(bp.tablet, 'max')} {
    width: 100%;
  }
`;

export const StyledFrame = styled.iframe`
  background: #fff;

`;

const Project = ({ project }) => {
  const [ showEmbed, setShowEmbed ] = useState(false);
  const clickHandler = useCallback(event => {
    event.preventDefault();
    setShowEmbed(current => !current);
  }, []);

  const allLinks = useMemo(() => Array.isArray(project.link) ? project.link : [ project.link ], [ project ]);

  return (
    <StyledListItem>
      <a href={allLinks[0].url} onClick={clickHandler}>
        <img src={project.icon} alt={project.name} width={64} height={64} style={{ objectFit: "cover" }} />
        <p>[ {project.source} ]</p>
        <h3>{project.name}</h3>
        <span>{project.short}</span>
      </a>
      {showEmbed && (project.source === 'OpenCollective'
        ? <StyledFrame src={allLinks[0].url} width="100%" height="920" frameBorder="0" scrolling="no" />
        : allLinks.map(link => <a key={link.title} href={link.url} target="_blank"
                                  rel="noreferrer noopener">{link.title}</a>))}
    </StyledListItem>
  );
};

const Donate = ({ projects }) => {
  const [ projectsShuffled, setProjectsShuffled ] = useState([]);
  useEffect(() => setProjectsShuffled(knuthShuffle([ ...projects ])), [ projects ]);

  const [ projectsSearch, setProjectsSearch ] = useState('');
  const projectsFiltered = useMemo(() => projectsShuffled.filter(project => project.name.toLowerCase().includes(projectsSearch.toLowerCase())), [ projectsShuffled, projectsSearch ]);

  const [ projectsCount, setProjectsCount ] = useState(3);
  const projectsList = useMemo(() => projectsFiltered.slice(0, projectsCount), [ projectsFiltered, projectsCount ]);
  useEffect(() => setProjectsCount(3), [ projectsFiltered ]);

  return (
    <StyledContainer>
      <h1>Donate</h1>
      <StyledSubText>
        Open-source projects keep the internet humming—but they can’t do it without resources.
        Projects are always in need of financial support so they can develop new features, cover expenses, and continue
        their regular activities.
        Find a project to donate money to right here.
      </StyledSubText>
      <StyledSearch type="text" placeholder="[ Search projects... ]" value={projectsSearch} onChange={e => setProjectsSearch(e.target.value)} />
      <StyledList>
        {projectsList.map(project => (
          <Project key={`${project.source}:${project.name}`} project={project} />
        ))}
      </StyledList>
      {projectsCount < projectsFiltered.length &&
        <Button special onClick={() => setProjectsCount(count => count + 3)}>Load More Projects</Button>}
    </StyledContainer>
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
