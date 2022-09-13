import Head from 'next/head';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Button from 'components/button';
import Loader from 'components/loader';

import useAuth from 'hooks/useAuth';

const Profile = () => {
  const auth = useAuth();

  return (
    <>
      <Head>
        <title>Profile | Hacktoberfest 2022</title>
        <meta name="twitter:title" key="twitterTitle" content="Profile | Hacktoberfest 2022" />
        <meta property="og:title" key="opengraphTitle" content="Profile | Hacktoberfest 2022" />
      </Head>

      {auth.loading ? (
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
          {/* TODO: Registration flow */}

          <Button onClick={() => auth.reset()}>Logout</Button>
        </Section>
      )}

    </>
  );
};

export default Profile;
