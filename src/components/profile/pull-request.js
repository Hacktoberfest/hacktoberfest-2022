import styled from 'styled-components';

import useCountdown from 'hooks/useCountdown';

const StyledPullRequest = styled.div`
  margin: 16px 8px;
  
  p {
    margin: 4px 0 !important;
  }
`;

const providerMap = {
  github: 'GitHub',
  gitlab: 'GitLab',
};

const PullRequest = ({ data, as }) => {
  // Get countdown for waiting PRs
  const [ days, hours, minutes, seconds ] = useCountdown(new Date(data.state.timestamp || 0).getTime() + (7 * 24 * 60 * 60 * 1000));

  return (
    <StyledPullRequest as={as}>
      <a href={data.url} target="_blank" rel="noreferrer">
        <p>
          [ {data.state.state} ]
          {data.state.state === 'waiting' && (
            <>
              {' '}
              [ {days}:{hours}:{minutes}:{seconds} ]
            </>
          )}
        </p>
        <p>
          [ {providerMap[data.provider]} ]
          {' '}
          {data.target}#{data.number}
        </p>
        <p>
          {data.title}
        </p>
      </a>
    </StyledPullRequest>
  );
};

export default PullRequest;
