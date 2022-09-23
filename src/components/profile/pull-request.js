import styled from 'styled-components';

import { MarkdownInline } from '../markdown';

import useCountdown from 'hooks/useCountdown';

import { providerMap, prWaitingTime } from 'lib/config';
import { pullRequestStates, pullRequestValidation } from 'lib/profile';

const StyledState = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: -1px;
  right: -1px;
  padding: 8px;
  background: ${props => props.theme.body};
  z-index: 1;
  border-radius: 0 0 8px 8px;
  border: solid ${props => props.theme.text};
  border-width: 0 1px 1px 1px;
`;

const StyledPullRequest = styled.div`
  > a {
    margin: 8px 0;
    padding: 8px;
    border-radius: 8px 8px 0 0;
    display: block;
    position: relative;
    min-width: 60rem;
    max-width: 100%;
    border: solid transparent;
    border-width: 1px 1px 0 1px;
    
    &:hover {
      background: ${props => props.theme.body};
      border-color: ${props => props.theme.text};
      
      ${StyledState} {
        display: block;
      }
    }
    
    p {
      margin: 4px 0 !important;
    }
  }
`;

const PullRequest = ({ data, as }) => {
  // Get countdown for waiting PRs
  const [ days, hours, minutes, seconds ] = useCountdown(new Date(data.state.timestamp || 0).getTime() + prWaitingTime);

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

        <StyledState>
          <MarkdownInline string={pullRequestStates[data.state.state]} />
          <MarkdownInline string={pullRequestValidation} />
        </StyledState>
      </a>
    </StyledPullRequest>
  );
};

export default PullRequest;
