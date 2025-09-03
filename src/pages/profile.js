import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import styled, { keyframes, useTheme } from 'styled-components';

import { fetchUserAvatars } from 'lib/api';

import useAuth from 'hooks/useAuth';

import Loader from 'components/loader';
import Section from 'components/Section';
import Container from 'components/Container';
import ButtonMain from 'components/ButtonMain';
import { StyledButtonGroup } from 'components/ButtonMain/ButtonMain.styles';
import Settings from 'components/profile/settings';
import Progress from 'components/profile/progress';
import Header from 'components/profile/header';
import createMetaTitle from 'lib/createMetaTitle';
import Layout from '../components/Layout';

const Profile = () => {
  const auth = useAuth();
  const router = useRouter();

  const theme = useTheme();

  // Track if we're in the edit view
  const edit = useMemo(
    () => /\/profile\/edit\/?/.test(router.asPath),
    [router.asPath],
  );

  // Once initial auth has completed, load the avatar (and only load it once)
  const [loaded, setLoaded] = useState(null);
  const [avatar, setAvatar] = useState(null);
  useEffect(() => {
    (async () => {
      if (auth.loading) return;
      if (loaded === true || loaded === false) return;
      setLoaded(false);

      // Fetch the user's avatar
      setAvatar(
        (
          await fetchUserAvatars(auth.user.id, auth.token).catch(() => {})
        )?.[0] || null,
      );

      // Show the page
      setLoaded(true);
    })();
  }, [auth, loaded]);

  return (
    <>
      <Head>
        <title>{createMetaTitle('Profile')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('Profile')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('Profile')}
        />
      </Head>

      {auth.loading || !loaded ? (
        <Section
          bgColor={theme.colors.darkGreen}
          color={theme.colors.typography}
        >
          <Container>
            <Section>
              <Loader message=">> Loading /usr/lib/profile..." />
            </Section>
          </Container>
        </Section>
      ) : (
        <>
          <Layout>
            <Header
              avatar={avatar}
              name={auth.user.name}
              isEdit={edit}
              type="Profile"
            >
              <StyledButtonGroup>
                {!edit && (
                  <ButtonMain
                    as="button"
                    onClick={() =>
                      router.push('/profile/edit', undefined, { shallow: true })
                    }
                    children="Edit Profile"
                  />
                )}
                {edit && (
                  <ButtonMain
                    as="button"
                    onClick={() =>
                      router.push('/profile', undefined, { shallow: true })
                    }
                    children="Back to Profile"
                  />
                )}
                <ButtonMain
                  as="button"
                  onClick={() => auth.reset()}
                  children="Logout"
                />
              </StyledButtonGroup>
            </Header>
          </Layout>

          {edit ? <Settings auth={auth} isEdit /> : <Progress auth={auth} />}
        </>
      )}
    </>
  );
};

export default Profile;
