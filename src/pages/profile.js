import Head from 'next/head';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import useAuth from '../hooks/useAuth';

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
          <p>Loading</p>
          {/* TODO: Cute loading animation */}
        </Section>
      ) : (
        <Section type="sub_content">
          <Divider />
          <Anchor href="#" />
          <p>Coming soon</p>
          {/* TODO: Profile view */}
        </Section>
      )}

    </>
  );
};

export default Profile;
