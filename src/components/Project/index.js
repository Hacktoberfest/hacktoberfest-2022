import { useMemo } from 'react';
import {
  StyledProject,
  StyledFrame
} from './Project.styles';
import Collapse from 'components/collapse';

const typesToColors = {
  opencollective: ['#1F87FF', '#170F1E'],
  'github sponsors': ['#EA4AAA', '#170F1E'],
};

const Project = props => {
  const { project } = props;

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

export default Project;