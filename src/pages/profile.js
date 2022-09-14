import { useEffect, useState } from 'react';
import Head from 'next/head';

import { fetchUserAvatars } from 'lib/api';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Button from 'components/button';
import Loader from 'components/loader';
import Edit from 'components/profile/edit';
import Progress from 'components/profile/progress';

import useAuth from 'hooks/useAuth';

const Profile = () => {
  const auth = useAuth();

  // Track if we're in the edit view
  const [ edit, setEdit ] = useState(false);

  // Once initial auth has completed, load the avatar (and only load it once)
  const [ loaded, setLoaded ] = useState(null);
  const [ avatar, setAvatar ] = useState(null);
  useEffect(() => {
    (async () => {
      if (auth.loading) return;
      if (loaded === true || loaded === false) return;
      setLoaded(false);

      // Fetch the user's avatar
      setAvatar((await fetchUserAvatars(auth.user.id, auth.token))?.[0] || null);

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

          {!edit && <Button onClick={() => setEdit(true)}>Edit Registration</Button>}
          {edit && <Button onClick={() => setEdit(false)}>Back to Profile</Button>}
          <Button onClick={() => auth.reset()}>Logout</Button>

          {edit ? (
            <Edit auth={auth} onSave={() => setEdit(false)} />
          ) : (
            <Progress auth={auth} />
          )}
        </Section>
      )}

    </>
  );
};

export default Profile;
