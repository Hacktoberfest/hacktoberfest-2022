import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import Button from 'components/button';
import { MarkdownInline } from 'components/markdown';

import useCountdown from 'hooks/useCountdown';

import { providerMap, prWaitingTime } from 'lib/config';
import { pullRequestStates, pullRequestValidation } from 'lib/profile';

const stateColors = {
  excluded: (theme) => theme.spark,
  spam: (theme) => theme.spark,
  'not-participating': (theme) => theme.surf,
  invalid: (theme) => theme.spark,
  'not-accepted': (theme) => theme.surf,
  waiting: (theme) => theme.surf,
  accepted: (theme) => theme.giga,
};

const providerColors = {
  github: (theme) => theme.psybeam,
  gitlab: (theme) => theme.spark,
};

const StyledState = styled.button`
  width: 32px;
  height: 32px;
  background: green;
  position: relative;
  transition: 0.2s;
  cursor: pointer;
  border-radius: 6px;
  color: ${(props) => props.theme.body};
  background: rgba(229, 225, 230, 0.3);

  &:hover,
  &:focus {
    background: rgba(229, 225, 230, 0.5);
  }

  div {
    background: ${(props) => props.theme.text};
    display: none;
    width: 600px;
    z-index: 100;
    padding: 16px 48px 16px 24px;
    border-radius: 6px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: left;

    &:after {
      content: 'x';
      position: absolute;
      text-align: center;
      top: 8px;
      right: 8px;
      line-height: 24px;
      border-radius: 4px;
      width: 28px;
      height: 24px;
      color: ${(props) => props.theme.text};
      background: ${(props) => props.theme.body};
      transition: 0.2s ease;
      opacity: 0.5;
    }

    &:hover {
      &:after {
        opacity: 1;
      }
    }

    p {
      color: ${(props) => props.theme.body};

      a {
        text-decoration: underline;

        &:hover {
          text-decoration: none;
        }
      }
    }

    button {
      width: 24px;
      height: 24px;
      border: 2px solid ${(props) => props.theme.body};
      color: ${(props) => props.theme.body};
    }
  }

  &[aria-selected='true'] {
    opacity: 1;
    div {
      display: block;
    }
  }

  @media (max-width: 550px) {
    position: static;
    div {
      top: 48px;
      width: 100%;
    }
  }
`;

const StyledEyebrowWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0 32px;
  gap: 12px;
  flex-flow: row wrap;
`;

const StyledEyebrow = styled.p``;

const StyledProvider = styled.a``;

const StyledInfo = styled.div``;

const StyledPullRequest = styled.div`
  padding: 24px 0;
  box-shadow: 0px 1px 0px rgba(229, 225, 230, 0.25);
  display: block;
  position: relative;
  width: 100%;
  max-width: 100%;
  transition: 0.2s ease;

  &:hover {
    box-shadow: 0px 1px 0px ${(props) => stateColors[props.state](props.theme)};
  }

  ${StyledEyebrow} {
    color: ${(props) => props.theme.body};
    text-shadow: 0 0 3px ${(props) => stateColors[props.state](props.theme)};
    font-size: 20px;
    line-height: 32px;
    background: ${(props) => stateColors[props.state](props.theme)};
    filter: drop-shadow(
      0px 0px 4px ${(props) => stateColors[props.state](props.theme)}
    );
    width: max-content;
    padding: 2px 12px;
    border-radius: 4px;
  }

  ${StyledProvider} {
    padding: 8px 12px;
    background: ${(props) => providerColors[props.provider](props.theme)};
    color: ${(props) => props.theme.body};
    text-shadow: 0 0 3px
      ${(props) => providerColors[props.provider](props.theme)};
  }

  ${StyledInfo} {
    margin: 16px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-flow: row wrap;

    a {
      margin-top: 24px;
    }

    h5 {
      margin-bottom: 12px;
    }

    p {
      span {
        opacity: 0.5;
        text-shadow: none;
      }
    }
  }
`;

const PullRequest = ({ data, as }) => {
  // Get countdown for waiting PRs
  const [days, hours, minutes, seconds] = useCountdown(
    new Date(data.state.timestamp || 0).getTime() + prWaitingTime
  );

  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((state) => !state), []);

  const router = useRouter();
  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  return (
    <StyledPullRequest
      as={as}
      state={data.state.state}
      provider={data.provider}
    >
      <StyledEyebrowWrapper>
        <StyledEyebrow>
          {' '}
          {data.state.state}
          {data.state.state === 'waiting' && (
            <>
              {' '}
              [{days}:{hours}:{minutes}:{seconds}]
            </>
          )}
        </StyledEyebrow>
        <StyledState onClick={toggle} aria-selected={open}>
          ?
          <div>
            <MarkdownInline string={pullRequestStates[data.state.state]} />
            <MarkdownInline string={pullRequestValidation} />
          </div>
        </StyledState>
      </StyledEyebrowWrapper>
      <StyledInfo>
        <div>
          <p>
            <span>PR/MR: </span>
            {data.target}#{data.number}
          </p>

          <p>
            <span>Title: </span>
            {data.title}
          </p>
        </div>
        <Button as="a" href={data.url} target="_blank" rel="noreferrer">
          View on {providerMap[data.provider]}
        </Button>
      </StyledInfo>
    </StyledPullRequest>
  );
};

export default PullRequest;
