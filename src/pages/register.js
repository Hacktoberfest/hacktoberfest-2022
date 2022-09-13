import Head from 'next/head';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Button from 'components/button';

import useAuth from 'hooks/useAuth';

const Register = () => {
  const auth = useAuth();

  return (
    <>
      <Head>
        <title>Register | Hacktoberfest 2022</title>
        <meta name="twitter:title" key="twitterTitle" content="Register | Hacktoberfest 2022" />
        <meta property="og:title" key="opengraphTitle" content="Register | Hacktoberfest 2022" />
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
          <p>Registration</p>
          <p>Hello, {auth.user.name}</p>
          {/* TODO: Registration flow */}

          <Button onClick={() => auth.reset()}>Logout</Button>
        </Section>
      )}

    </>
  );
};

export default Register;
