import { useEffect, useState } from 'react';
import Head from 'next/head';

import Divider from 'components/Divider';
import Section from 'components/Section';
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
        <title>Logout | Hacktoberfest 2023</title>
        <meta name="twitter:title" key="twitterTitle" content="Logout | Hacktoberfest 2023" />
        <meta property="og:title" key="opengraphTitle" content="Logout | Hacktoberfest 2023" />
      </Head>

      <Section type="sub_content">
        <Divider />
        <Loader message=">> Loading /usr/lib/logout..." />
      </Section>
    </>
  );
};

export default Logout;
