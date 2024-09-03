import { useEffect, useState } from 'react';
import Head from 'next/head';

import Divider from 'components/Divider';
import Section from 'components/Section';
import Loader from 'components/loader';

import useAuth from 'hooks/useAuth';
import createMetaTitle from 'lib/createMetaTitle';

const Logout = () => {
  const [redirect, setRedirect] = useState(false);
  const auth = useAuth(redirect);

  useEffect(() => {
    if (!auth.loading) {
      auth.reset();
      setRedirect(true);
    }
  }, [auth.loading]);

  return (
    <>
      <Head>
        <title>{createMetaTitle('Logout')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('Logout')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('Logout')}
        />
      </Head>

      <Section type="sub_content">
        <Divider />
        <Loader message=">> Loading /usr/lib/logout..." />
      </Section>
    </>
  );
};

export default Logout;
