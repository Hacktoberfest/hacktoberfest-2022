import { useEffect, useMemo, useState } from 'react';

import { fetchGiftCodes, fetchPullRequests, triggerIngest } from 'lib/api';
import { trackingStart } from 'lib/config';

import Loader from '../loader';
import PullRequest from './pull-request';

const Progress = ({ auth }) => {
  // Track the data we need to render
  const [ loaded, setLoaded ] = useState(null);
  const [ pullRequests, setPullRequests ] = useState([]);
  const [ giftCodes, setGiftCodes ] = useState([]);

  // Load the data we need to render
  useEffect(() => {
    (async () => {
      if (loaded === true || loaded === false) return;
      setLoaded(false);

      // Fetch the user's pull requests
      const rawPullRequests = await fetchPullRequests(auth.user.id, auth.token)
        .then(data => data.filter(pr => pr.state?.state && pr.state.state !== 'out-of-bounds'));
      setPullRequests(rawPullRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

      // Fetch the user's gift codes
      const rawGiftCodes = await fetchGiftCodes(auth.user.id, auth.token);
      setGiftCodes(rawGiftCodes.reduce((obj, code) => ({
        ...obj,
        [code.type]: code,
      }), {}));

      // Trigger a PR ingest in the background, ignoring the result and any errors
      triggerIngest(auth.user.id, auth.token).catch(() => {});

      // Show the page
      setLoaded(true);
    })();
  }, [ auth, loaded ]);

  // Determine the user's progress
  const hasStarted = useMemo(() => new Date() >= new Date(trackingStart), []);
  const acceptedCount = useMemo(() => pullRequests.filter(pr => pr.state.state === 'accepted').length, [ pullRequests ]);
  const waitingCount = useMemo(() => pullRequests.filter(pr => pr.state.state === 'waiting').length, [ pullRequests ]);

  // Don't render anything until we have the data we need
  if (!loaded) return <Loader message=">> Loading /usr/lib/progress..." />;

  // Render the user's progress
  return (
    <>
      <p>[ Progress ]</p>
      <p>
        {Math.min(acceptedCount, 4).toLocaleString()}
        {acceptedCount > 4 ? ` + ${(acceptedCount - 4).toLocaleString()}` : ''}
        {' '}
        / 4
        {!!waitingCount && (
          <>
            {' '}
            <i>({waitingCount.toLocaleString()} waiting)</i>
          </>
        )}
      </p>

      {/* Handle a user that has been disqualified */}
      {auth.registration.state.state.includes('disqualified') && (
        <>
          <p>[ Disqualification ]</p>
          <p>
            You have been disqualified from Hacktoberfest for submitting two or more PR/MRs that have been identified as spam.
            <br />
            Due to being disqualified, you will be ineligible to recieve any further rewards for your participation in Hacktoberfest.
          </p>
        </>
      )}

      {/* Handle a user that has been disqualified */}
      {auth.registration.state.state.includes('warning') && (
        <>
          <p>[ Warning: Disqualification ]</p>
          <p>
            You have had a PR/MR identified as spam.
            <br />
            If you submit another PR/MR that is identified as spam, you will be disqualified from Hacktoberfest.
          </p>
        </>
      )}

      {/* Show any gift codes the user has been awarded */}
      {!!Object.keys(giftCodes).length && (
        <>
          <p>[ Rewards ]</p>

          <ul>
            {/* TODO: Show different reward codes */}
          </ul>
        </>
      )}

      <p>[ Pull/Merge Requests ]</p>

      {pullRequests.length ? (
        <ul>
          {pullRequests.map(pr => (
            <PullRequest key={pr.id} data={pr} as="li" />
          ))}
        </ul>
      ) : (
        hasStarted ? (
          <p>
            Uh oh! You haven't made any pull/merge requests yet. Submit your first contribution to a participating
            project to get started with Hacktoberfest!
          </p>
        ) : (
          <p>
            Hacktoberfest has not yet begun, hold off on those pull/merge requests until October so they can count!
          </p>
        )
      )}
    </>
  );
};

export default Progress;
