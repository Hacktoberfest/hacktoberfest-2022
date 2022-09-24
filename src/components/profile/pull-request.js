import styled from 'styled-components';

import { MarkdownInline } from '../markdown';

import useCountdown from 'hooks/useCountdown';

import { providerMap, prWaitingTime } from 'lib/config';
import { pullRequestStates, pullRequestValidation } from 'lib/profile';

const stateColors = {
  excluded: theme => theme.spark,
  spam: theme => theme.spark,
  'not-participating': theme => theme.surf,
  invalid: theme => theme.spark,
  'not-accepted': theme => theme.surf,
  waiting: theme => theme.surf,
  accepted: theme => theme.giga,
};

const providerColors = {
  github: theme => theme.psybeam,
  gitlab: theme => theme.spark,
};

const StyledState = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: -1px;
  right: -1px;
  padding: 8px;
  background: linear-gradient(to bottom, rgba(23, 15, 30, 0.8) 0%, rgba(23, 15, 30, 0.95) 100%);
  z-index: 1;
  border-radius: 0 0 8px 8px;
  border: solid transparent;
  border-width: 0 1px 1px 1px;
`;

const StyledEyebrow = styled.p``;

const StyledProvider = styled.span``;

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
      border-color: ${props => stateColors[props.state](props.theme)};
      
      &::before {
        display: block;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: ${props => stateColors[props.state](props.theme)} 0px 0px 12px;
        clip-path: inset(-12px -12px 0 -12px);
      }
      
      ${StyledState} {
        display: block;
        border-color: ${props => stateColors[props.state](props.theme)};
        box-shadow: ${props => stateColors[props.state](props.theme)} 0px 0px 12px;
        clip-path: inset(0 -12px -12px -12px);
      }
    }
    
    p {
      margin: 4px 0 !important;
    }
    
    ${StyledEyebrow} {
      color: ${props => stateColors[props.state](props.theme)};
      text-shadow: 0 0 3px ${props => stateColors[props.state](props.theme)};
    }
    
    ${StyledProvider} {
      color: ${props => providerColors[props.provider](props.theme)};
      text-shadow: 0 0 3px ${props => providerColors[props.provider](props.theme)};
    }
  }
`;

const PullRequest = ({ data, as }) => {
  // Get countdown for waiting PRs
  const [ days, hours, minutes, seconds ] = useCountdown(new Date(data.state.timestamp || 0).getTime() + prWaitingTime);

  return (
    <StyledPullRequest as={as} state={data.state.state} provider={data.provider}>
      <a href={data.url} target="_blank" rel="noreferrer">
        <StyledEyebrow>
          [ {data.state.state} ]
          {data.state.state === 'waiting' && (
            <>
              {' '}
              [ {days}:{hours}:{minutes}:{seconds} ]
            </>
          )}
        </StyledEyebrow>

        <p>
          <StyledProvider>[ {providerMap[data.provider]} ]</StyledProvider>
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
