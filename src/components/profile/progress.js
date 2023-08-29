import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

import { fetchGiftCodes, fetchPullRequests, triggerIngest } from 'lib/api';
import { trackingStart } from 'lib/config';

import Loader from 'components/loader';
import Section from 'components/Section';
import Notification from 'components/notification';

import EmailWarning from './email-warning';
import Holopin from './holopin';
import GiftCode from './gift-code';
import { body20, body24, headline48 } from 'themes/typography';
import Divider from 'components/Divider';
import PullRequest from 'components/PullRequest';

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
  display: flex;
  flex-direction: column;
  gap: 48px;

  > h1 {
    ${headline48};
  }

  > h3 {
    ${headline48};
  }
`;

const StyledProgressSummary = styled.div`
  background: ${({theme}) => theme.card.bg};
  backdrop-filter: blur(5px);
  border-radius: 16px;
  padding: 24px 48px;
  text-align: center;
  max-width: 608px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out; /* stylelint-disable-line property-no-vendor-prefix */
    mask-composite: exclude;
    background: linear-gradient(77.9deg, #EC4237 0%, #33B6D8 100%);
    padding: 1px;
    border-radius: inherit;
    pointer-events: none;
  }

  h2 {
    ${body24};
    color: ${({theme}) => theme.colors.bavarian.blue200};
  }
`;

const StyledPullRequests = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const StyledFootNote = styled.p`
  margin: 0;
  ${body20};
  max-width: 1012px;
  color: ${({theme}) => theme.colors.neutral.manga300};

  strong {
    color: ${({theme}) => theme.colors.bavarian.gold200};
  }
`;

const Progress = ({ auth }) => {
  // Track the data we need to render
  const [loaded, setLoaded] = useState(false);
  const loading = useRef(false);
  const [pullRequests, setPullRequests] = useState([]);
  const [giftCodes, setGiftCodes] = useState([]);
  const theme = useTheme();

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
    <StyledProgressWrapper>
      <h1>Progress</h1>
      <StyledProgressSummary>
        <h2>
          {Math.min(acceptedCount, 4).toLocaleString()}
          {acceptedCount > 4
            ? ` + ${(acceptedCount - 4).toLocaleString()}`
            : ''}{' '}
          / 4
          {!!waitingCount && (
            <>
              {' '}
              <span>
                [{waitingCount.toLocaleString()} waiting]
              </span>
            </>
          )}
        </h2>
      </StyledProgressSummary>

      <Divider type="doubledashed" />

      {/* Handle a user that has been disqualified */}
      {auth.registration.state.state.includes('disqualified') && (
        <Notification title="Disqualification" color={theme.colors.bavarian.red200}>
          <p>
            You have been disqualified from Hacktoberfest for submitting two
            or more PR/MRs that have been identified as spam.
          </p>
          <p>
            Due to being disqualified, you will be ineligible to recieve any
            further rewards for your participation in Hacktoberfest.
          </p>
        </Notification>
      )}

      {/* Handle a user that has been disqualified */}
      {auth.registration.state.state.includes('warning') && (
        <Notification title="Warning: Disqualification" color={theme.colors.bavarian.red200}>
          <p>
            You have had a PR/MR identified as spam.
          </p>
          <p>
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
      {giftCodes.tshirt ? (
        <Notification title="Rewards: Prize Kit" color={theme.colors.bavarian.gold200}>
          <p>
            Congratulations on completing Hacktoberfest 2023! You’ve been
            awarded a prize kit for your participation – t-shirts are
            available for the first 40,000 participants that complete
            Hacktoberfest, and you can always have a tree planted in your
            name!
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
      ) : (auth.registration.state.state.includes('contributor') && (
        <Notification title="Rewards: Prize Kit" color={theme.colors.bavarian.gold200}>
          <p>
            Congratulations on completing Hacktoberfest 2023! It looks like
            we’re all out of prizes to allocate for now (the first 40,000
            participants to complete Hacktoberfest were eligible this year).
            Keep an eye on your profile though, as we may allocate more
            prizes later!
          </p>
        </Notification>
      ))}

      {giftCodes['dev-badge'] && (
        <Notification title="Rewards: DEV Badge" color={theme.colors.bavarian.gold200}>
          <p>
            Congratulations on completing Hacktoberfest 2023!
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
              href="https://shop.forem.com/products/dev-hacktoberfest-badge-2023"
              target="_blank"
              rel="noreferrer noopener"
            >
              https://shop.forem.com/products/dev-hacktoberfest-badge-2023
            </a>
            {' '}
            to redeem your code.
          </p>
        </Notification>
      )}

      {Object.keys(giftCodes).some((type) =>
        type.startsWith('holopin')
      ) && (
        <Notification title="Rewards: Holopin Badges" color={theme.colors.bavarian.gold200}>
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
            {giftCodes['holopin-docker-badge'] && (
              <Holopin code={giftCodes['holopin-docker-badge']} reason="registering for Hacktoberfest" from="Docker" />
            )}
            {giftCodes['holopin-registered-badge'] && (
              <Holopin code={giftCodes['holopin-registered-badge']} reason="registering for Hacktoberfest" from="DigitalOcean" />
            )}
          </ul>

          <p>
            Check your email for more information on how to claim each
            badge.
          </p>
        </Notification>
      )}

      <h3>Pull/Merge Requests</h3>

      {pullRequests.length ? (
        <StyledPullRequests>
          {pullRequests.map((pr, index) => (
            <>
              <PullRequest key={pr.id} data={pr} as="li" />
              {pullRequests.length !== (index + 1) && (
                <li aria-hidden><Divider /></li>
              )}
            </>
          ))}
        </StyledPullRequests>
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

      <Divider type="doubledashed" />

      <StyledFootNote>
        <strong>Not seeing what you expect here?</strong> Hacktoberfest profiles only show
        contributor activity, not maintainer activity (we calculate this
        after Hacktoberfest ends). Profiles update once every 15 minutes
        if you're loading the page often, or once every 6 hours in the
        background.
      </StyledFootNote>
    </StyledProgressWrapper>
  );
};

export default Progress;
