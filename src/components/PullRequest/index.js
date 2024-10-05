import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { MarkdownInline } from 'components/markdown';
import ButtonMain from 'components/ButtonMain';

import useCountdown from 'hooks/useCountdown';

import { providerMap, prWaitingTime } from 'lib/config';
import { pullRequestStates, pullRequestValidation } from 'lib/profile';

import {
  StyledState,
  StyledEyebrowWrapper,
  StyledEyebrow,
  StyledInfo,
  StyledPullRequest,
  StyledTitle,
  StyledDetails,
} from './PullRequest.styles';

const PullRequest = ({ data, as }) => {
  // Get countdown for waiting PRs
  const [days, hours, minutes, seconds] = useCountdown(
    new Date(data.state.timestamp || 0).getTime() + prWaitingTime,
  );

  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((state) => !state), []);

  const router = useRouter();
  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  return (
    <StyledPullRequest as={as} $state={data.state.state}>
      <StyledEyebrowWrapper>
        <StyledEyebrow>
          {pullRequestStates[data.state.state].title.replace(
            '${timer}',
            `${days}:${hours}:${minutes}:${seconds}`,
          )}
        </StyledEyebrow>
        <StyledState onClick={toggle} aria-selected={open}>
          ?
          <div>
            <MarkdownInline
              string={pullRequestStates[
                data.state.state
              ].description.replaceAll(
                '${pr}',
                providerMap[data.provider].prName,
              )}
            />
            <MarkdownInline
              string={pullRequestValidation.replaceAll(
                '${pr}',
                providerMap[data.provider].prName,
              )}
            />
          </div>
        </StyledState>
      </StyledEyebrowWrapper>
      <StyledInfo>
        <StyledTitle>
          <span>Title: </span> {data.title}
        </StyledTitle>
        <StyledDetails>
          <span>{providerMap[data.provider].prName}: </span> {data.target}
          {providerMap[data.provider].referenceCharacter}
          {data.number}
        </StyledDetails>
        <ButtonMain
          href={data.url}
          target="_blank"
          rel="noreferrer"
          children={`View on ${providerMap[data.provider].name}`}
        />
      </StyledInfo>
    </StyledPullRequest>
  );
};

export default PullRequest;
