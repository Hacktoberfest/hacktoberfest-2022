import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { fetchGiftCodes, fetchPullRequests, triggerIngest } from 'lib/api';
import { trackingStart } from 'lib/config';

import Loader from 'components/loader';
import Section from 'components/section';
import Notification from 'components/notification';
import EmailWarning from './email-warning';

import PullRequest from './pull-request';

const StyledProgressWrapper = styled.div`
  h1,
  h3 {
    padding-bottom: 24px;
    box-shadow: 0px 1px 0px rgba(229, 225, 230, 0.25);
  }

  h1 {
    margin-bottom: 40px;
  }

  h3 {
    margin: 80px 0 24px;
  }

  h4 {
    background: linear-gradient(
      160deg,
      ${(props) => props.theme.spark} 0%,
      ${(props) => props.theme.surf} 30%,
      ${(props) => props.theme.psybeam} 85%
    );
    background-size: 100% 100%;
    color: ${(props) => props.theme.body};
    box-shadow: ${(props) => props.theme.glowLite};
    text-shadow: none;
    padding: 24px 32px;
    border-radius: 16px;
    width: max-content;
    transform: rotate(-4deg);
    transition: transform 0.2s ease;

    &:hover {
      transform: rotate(4deg);
    }
  }
`;

const Progress = ({ auth }) => {
  // Track the data we need to render
  const [loaded, setLoaded] = useState(false);
  const loading = useRef(false);
  const [pullRequests, setPullRequests] = useState([]);
  const [giftCodes, setGiftCodes] = useState([]);

  // Load the data we need to render
  useEffect(() => {
    if (loaded) return;
    if (loading.current) return;
    loading.current = true;

    (async () => {
      // Fetch the user's pull requests
      const rawPullRequests = await fetchPullRequests(
        auth.user.id,
        auth.token,
        ['out-of-bounds']
      ).then((data) =>
        data.filter(
          (pr) => pr.state?.state && pr.state.state !== 'out-of-bounds'
        )
      );
      setPullRequests(
        rawPullRequests.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );

      // Fetch the user's gift codes
      const rawGiftCodes = await fetchGiftCodes(auth.user.id, auth.token);
      setGiftCodes(
        rawGiftCodes.reduce(
          (obj, code) => ({
            ...obj,
            [code.type]: code,
          }),
          {}
        )
      );

      // Trigger a PR ingest in the background, ignoring the result and any errors
      triggerIngest(auth.user.id, auth.token).catch(() => {});

      // Show the page
      setLoaded(true);
    })();
  }, [loaded, auth.user?.id, auth.token]);

  // Determine the user's progress
  const hasStarted = useMemo(() => new Date() >= new Date(trackingStart), []);
  const acceptedCount = useMemo(
    () => pullRequests.filter((pr) => pr.state.state === 'accepted').length,
    [pullRequests]
  );
  const waitingCount = useMemo(
    () => pullRequests.filter((pr) => pr.state.state === 'waiting').length,
    [pullRequests]
  );

  // Don't render anything until we have the data we need
  if (!loaded)
    return (
      <Section>
        <Loader message=">> Loading /usr/lib/progress..." />
      </Section>
    );

  // Render the user's progress
  return (
    <Section>
      <StyledProgressWrapper>
        <h1>Progress</h1>
        <h4>
          {Math.min(acceptedCount, 4).toLocaleString()}
          {acceptedCount > 4
            ? ` + ${(acceptedCount - 4).toLocaleString()}`
            : ''}{' '}
          / 4
          {/*!!waitingCount && (
            <>
              {' '}
              <i>[{waitingCount.toLocaleString()} waiting]</i>
            </>
          )*/}
        </h4>

        {/* Handle a user that has been disqualified */}
        {auth.registration.state.state.includes('disqualified') && (
          <Notification title="Disqualification" color="spark">
            <p>
              You have been disqualified from Hacktoberfest for submitting two
              or more PR/MRs that have been identified as spam.
              <br />
              Due to being disqualified, you will be ineligible to recieve any
              further rewards for your participation in Hacktoberfest.
            </p>
          </Notification>
        )}

        {/* Handle a user that has been disqualified */}
        {auth.registration.state.state.includes('warning') && (
          <Notification title="Warning: Disqualification" color="spark">
            <p>
              You have had a PR/MR identified as spam.
              <br />
              If you submit another PR/MR that is identified as spam, you will
              be disqualified from Hacktoberfest.
            </p>
          </Notification>
        )}

        {/* Handle a user that has a no-reply email selected */}
        <EmailWarning
          email={auth.user.email}
          hasHolopin={auth.registration.metadata['operational-holopin']?.value === 'true'}
        />

        {/* Show any gift codes the user has been awarded */}
        {!!Object.keys(giftCodes).length && (
          <>
            {/* TODO: Kotis code */}
            {/* TODO: DEV badge code */}

            {Object.keys(giftCodes).some((type) =>
              type.startsWith('holopin')
            ) && (
              <Notification title="Rewards: Holopin Badges" color="surf">
                <ul>
                  {giftCodes['holopin-registered-badge'] && (
                    <li>
                      <p>
                        You've been awarded a Holopin badge for registering for
                        Hacktoberfest!
                      </p>
                    </li>
                  )}
                  {giftCodes['holopin-level-1-badge'] && (
                    <li>
                      <p>
                        You've been awarded a Holopin badge for completing one
                        accepted PR/MR!
                      </p>
                    </li>
                  )}
                  {giftCodes['holopin-level-2-badge'] && (
                    <li>
                      <p>
                        You've been awarded a Holopin badge for completing two
                        accepted PR/MRs!
                      </p>
                    </li>
                  )}
                  {giftCodes['holopin-level-3-badge'] && (
                    <li>
                      <p>
                        You've been awarded a Holopin badge for completing three
                        accepted PR/MRs!
                      </p>
                    </li>
                  )}
                  {giftCodes['holopin-level-4-badge'] && (
                    <li>
                      <p>
                        You've been awarded a Holopin badge for completing four
                        accepted PR/MRs!
                      </p>
                    </li>
                  )}
                </ul>

                <p>
                  Check your email for more information on how to claim each
                  badge.
                </p>
              </Notification>
            )}
          </>
        )}

        <h3>Pull/Merge Requests</h3>

        {pullRequests.length ? (
          <ul>
            {pullRequests.map((pr) => (
              <PullRequest key={pr.id} data={pr} as="li" />
            ))}
          </ul>
        ) : hasStarted ? (
          <p>
            Uh oh! You haven't made any pull/merge requests yet. Submit your
            first contribution to a participating project to get started with
            Hacktoberfest!
          </p>
        ) : (
          <p>
            Hacktoberfest has not yet begun, hold off on those pull/merge
            requests until October so they can count!
          </p>
        )}
      </StyledProgressWrapper>
    </Section>
  );
};

export default Progress;
