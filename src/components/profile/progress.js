import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { fetchGiftCodes, fetchPullRequests, triggerIngest } from 'lib/api';
import { trackingStart } from 'lib/config';

import Loader from 'components/loader';
import Section from 'components/section';
import Notification from 'components/notification';

import EmailWarning from './email-warning';
import Holopin from './holopin';
import PullRequest from './pull-request';
import GiftCode from './gift-code';

const textAnimation = () => keyframes`
  0% {
    content: "oOo";
  }
  33% {
    content: "ooO";
  }
  66% {
    content: "Ooo";
  }
`;

const StyledProgressWrapper = styled.div`
  > h1 {
    padding-bottom: 32px;
    margin-bottom: 48px;
    box-shadow: 0px 1px 0px rgba(229, 225, 230, 0.25);
  }
  
  > h3 {
    padding: 64px 0 32px;
    margin: 64px 0 32px;
    line-height: 1.25;
    box-shadow:
      0px 1px 0px rgba(229, 225, 230, 0.25),
      0px -1px 0px rgba(229, 225, 230, 0.25);
  }
`;

const StyledProgressSummary = styled.div`
  display: flex;
  gap: 32px;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 48px;
  margin-bottom: 64px;
  box-shadow: 0px 1px 0px rgba(229, 225, 230, 0.25);
  
  h2 {
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
    font-size: 32px;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1.25;

    &:hover {
      transform: rotate(4deg);
    }
  }
  
  h3 {
    font-size: 24px;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1.25;
    
    &::before {
      content: 'oOo';
      text-transform: none;
      animation: ${textAnimation} 2s linear infinite;
      padding-right: 1ch;
    }
  }
`;

const StyledFootNote = styled.p`
  font-style: italic;
  opacity: 0.8;
  margin: 48px 0 0;
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
        <StyledProgressSummary>
          <h2>
            {Math.min(acceptedCount, 4).toLocaleString()}
            {acceptedCount > 4
              ? ` + ${(acceptedCount - 4).toLocaleString()}`
              : ''}{' '}
            / 4
          </h2>

          {!!waitingCount && (
            <h3>
              [{waitingCount.toLocaleString()} waiting]
            </h3>
          )}
        </StyledProgressSummary>

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
            {giftCodes.tshirt && (
              <Notification title="Rewards: Swag Pack or Tree" color="surf" linkColor="spark">
                <p>
                  Congratulations on completing Hacktoberfest 2022! You've been
                  awarded a swag pack (or a tree planted in your name, if you'd
                  prefer) for your participation.
                </p>
                <GiftCode code={giftCodes.tshirt.code} />
                <p>
                  Head to
                  {' '}
                  <a
                    href={`https://stores.kotisdesign.com/hf22?redemption_code=${giftCodes.tshirt.code}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    https://stores.kotisdesign.com/hf22
                  </a>
                  {' '}
                  to redeem your code.
                </p>
              </Notification>
            )}

            {giftCodes['dev-badge'] && (
              <Notification title="Rewards: DEV Badge" color="surf" linkColor="spark">
                <p>
                  Congratulations on completing Hacktoberfest 2022!
                  You've been awarded a badge from DEV for your participation
                  that you can show off on your DEV profile.
                </p>
                <GiftCode code={giftCodes['dev-badge'].code} />
                <p>
                  Make sure to register for an account on
                  {' '}
                  <a
                    href="https://dev.to/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    DEV
                  </a>
                  , and then head to
                  {' '}
                  <a
                    href="https://shop.forem.com/products/dev-hacktoberfest-badge-2022"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    https://shop.forem.com/products/dev-hacktoberfest-badge-2022
                  </a>
                  {' '}
                  to redeem your code.
                </p>
              </Notification>
            )}

            {Object.keys(giftCodes).some((type) =>
              type.startsWith('holopin')
            ) && (
              <Notification title="Rewards: Holopin Badges" color="surf" linkColor="spark">
                <ul>
                  {giftCodes['holopin-level-4-badge'] && (
                    <Holopin code={giftCodes['holopin-level-4-badge']} reason="completing four accepted PR/MRs" />
                  )}
                  {giftCodes['holopin-level-3-badge'] && (
                    <Holopin code={giftCodes['holopin-level-3-badge']} reason="completing three accepted PR/MRs" />
                  )}
                  {giftCodes['holopin-level-2-badge'] && (
                    <Holopin code={giftCodes['holopin-level-2-badge']} reason="completing two accepted PR/MRs" />
                  )}
                  {giftCodes['holopin-level-1-badge'] && (
                    <Holopin code={giftCodes['holopin-level-1-badge']} reason="completing one accepted PR/MR" />
                  )}
                  {giftCodes['holopin-registered-badge'] && (
                    <Holopin code={giftCodes['holopin-registered-badge']} reason="registering for Hacktoberfest" />
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

        <StyledFootNote>
          Not seeing what you expect here? Hacktoberfest profiles only show
          contributor activity, not maintainer activity (we calculate this
          after Hacktoberfest ends). Profiles update once every 15 minutes
          if you're loading the page often, or once every 6 hours in the
          background.
        </StyledFootNote>
      </StyledProgressWrapper>
    </Section>
  );
};

export default Progress;
