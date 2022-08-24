import { knuthShuffle } from 'knuth-shuffle';
import fetchProjects from 'lib/donate';
import { useCallback, useEffect, useMemo, useState } from 'react';

const Project = ({ project }) => {
    const [ showEmbed, setShowEmbed ] = useState(false);
    const clickHandler = useCallback(event => {
        event.preventDefault();
        setShowEmbed(current => !current);
    }, []);

    const firstLink = useMemo(() => Array.isArray(project.link) ? project.link[0] : project.link, [ project ]);
    const allLinks = useMemo(() => Array.isArray(project.link) ? project.link : [ project.link ], [ project ]);
    return (
        <div>
            <a href={firstLink.url} onClick={clickHandler}>
                <img src={project.icon} alt={project.name} width={64} height={64} style={{ objectFit: "cover" }} />
                <p>[ { project.source } ]</p>
                <h3>{ project.name }</h3>
                <p>{ project.short }</p>
            </a>
            { showEmbed && (project.source === 'OpenCollective'
                ? <iframe src={firstLink.url} width="100%" height="800" frameBorder="0" scrolling="no" />
                : allLinks.map(link => <a key={link.title} href={link.url} target="_blank" rel="noreferrer noopener">{ link.title }</a>)) }
        </div>
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
        <>
            <h1>Donate</h1>
            <p>Open-source projects keep the internet humming—but they can’t do it without resources. Projects are always in need of financial support so they can develop new features, cover expenses, and continue their regular activities. Find a project to donate money to right here.</p>

            <input type="text" placeholder="Search for a project" value={projectsSearch} onChange={e => setProjectsSearch(e.target.value)} />

            <div>
                { projectsList.map(project => (
                    <Project key={ `${project.source}:${project.name}` } project={project} />
                )) }
            </div>

            { projectsCount < projectsFiltered.length &&
                <button onClick={() => setProjectsCount(count => count + 3)}>Load More Projects</button> }
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
