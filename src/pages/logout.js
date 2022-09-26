import { useEffect, useState } from 'react';
import Head from 'next/head';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Loader from 'components/loader';

import useAuth from 'hooks/useAuth';

const Logout = () => {
  const [ redirect, setRedirect ] = useState(false);
  const auth = useAuth(redirect);

  useEffect(() => {
    if (!auth.loading) {
      auth.reset();
      setRedirect(true);
    }
  }, [ auth.loading ]);

  return (
    <>
      <Head>
        <title>Logout | Hacktoberfest 2022</title>
        <meta name="twitter:title" key="twitterTitle" content="Logout | Hacktoberfest 2022" />
        <meta property="og:title" key="opengraphTitle" content="Logout | Hacktoberfest 2022" />
      </Head>

      <Section type="sub_content">
        <Divider />
        <Anchor href="#" />
        <Loader message=">> Loading /usr/lib/logout..." />
      </Section>
    </>
  );
};

export default Logout;
