import Head from 'next/head';
import { useRouter } from 'next/router';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Button from 'components/button';
import Loader from 'components/loader';

import useAuth from 'hooks/useAuth';

import { oauth } from 'lib/api';

const Auth = () => {
  const auth = useAuth();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Auth | Hacktoberfest 2022</title>
        <meta name="twitter:title" key="twitterTitle" content="Auth | Hacktoberfest 2022" />
        <meta property="og:title" key="opengraphTitle" content="Auth | Hacktoberfest 2022" />
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

          {!!(router.query.error_code && router.query.error_message) && (
            <p>
              <strong>It looks like something went wrong when authenticating you.</strong>
              <br />
              <code>{router.query.error_code}: {router.query.error_message}</code>
            </p>
          )}

          <Button special as="a" href={oauth('github')}>Start Hacking with GitHub</Button>
          <Button special as="a" href={oauth('gitlab')}>Start Hacking with GitLab</Button>
        </Section>
      )}

    </>
  );
};

export default Auth;
