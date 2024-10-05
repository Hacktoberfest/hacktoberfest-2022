import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';

import Section from 'components/Section';
import Container from 'components/Container';
import Loader from 'components/loader';

import useAuth from 'hooks/useAuth';
import createMetaTitle from 'lib/createMetaTitle';

const StyledLogout = styled.div`
  background: ${({ theme }) => theme.colors.darkGreen};
  color: ${({ theme }) => theme.colors.typography};
  padding: 68px 0;
`;

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

      <StyledLogout>
        <Section>
          <Container>
            <Loader message=">> Loading /usr/lib/logout..." />
          </Container>
        </Section>
      </StyledLogout>
    </>
  );
};

export default Logout;
