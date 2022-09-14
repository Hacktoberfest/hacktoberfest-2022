import { useEffect, useState } from 'react';
import Head from 'next/head';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Button from 'components/button';
import Loader from 'components/loader';

import useAuth from 'hooks/useAuth';

import { fetchGiftCodes, fetchPullRequests, fetchUserAvatars, triggerIngest } from 'lib/api';

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
      setPullRequests(await fetchPullRequests(auth.user.id, auth.token));

      // Fetch the user's gift codes
      setGiftCodes(await fetchGiftCodes(auth.user.id, auth.token));

      // Trigger a PR ingest in the background, ignoring the result and any errors
      triggerIngest(auth.user.id, auth.token).catch(() => {});

      // Show the page
      setLoaded(true);
    })();
  }, [ auth, loaded ]);

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

          {/* TODO: Profile view */}

          <Button onClick={() => auth.reset()}>Logout</Button>
        </Section>
      )}

    </>
  );
};

export default Profile;
