import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

import { fetchGiftCodes, fetchPullRequests, fetchUserAvatars, triggerIngest } from 'lib/api';
import { trackingStart } from 'lib/config';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Button from 'components/button';
import Loader from 'components/loader';
import PullRequest from 'components/profile/pull-request';

import useAuth from 'hooks/useAuth';

const Profile = () => {
  const auth = useAuth();

  // Track the data we need to render
  const [ loaded, setLoaded ] = useState(null);
  const [ avatar, setAvatar ] = useState(null);
  const [ pullRequests, setPullRequests ] = useState([]);
  const [ giftCodes, setGiftCodes ] = useState([]);

  // Once initial auth has completed, load the data we need to render
  useEffect(() => {
    (async () => {
      if (auth.loading) return;
      if (loaded === true || loaded === false) return;
      setLoaded(false);

      // Fetch the user's avatar
      setAvatar((await fetchUserAvatars(auth.user.id, auth.token))?.[0] || null);

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

  return (
    <>
      <Head>
        <title>Profile | Hacktoberfest 2022</title>
        <meta name="twitter:title" key="twitterTitle" content="Profile | Hacktoberfest 2022" />
        <meta property="og:title" key="opengraphTitle" content="Profile | Hacktoberfest 2022" />
      </Head>

      {auth.loading || !loaded ? (
        <Section type="sub_content">
          <Divider />
          <Anchor href="#" />
          <Loader message=">> Loading /usr/lib/profile..." />
        </Section>
      ) : (
        <Section type="sub_content">
          <Divider />
          <Anchor href="#" />
          <p>Profile</p>
          <p>Hello, {auth.user.name}</p>
          {avatar && <div><img src={avatar} alt="" width={256} height={256} style={{ objectFit: 'cover' }} /></div>}

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

          <Button onClick={() => auth.reset()}>Logout</Button>
        </Section>
      )}

    </>
  );
};

export default Profile;
