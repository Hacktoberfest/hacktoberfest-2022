import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import styled, { keyframes, useTheme } from 'styled-components';

import { createUserOAuth, fetchUserAvatars, fetchUserOAuth } from 'lib/api';

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
import { providerMap, trackingEndExtended } from '../lib/config';

const Profile = () => {
  const auth = useAuth();
  const router = useRouter();

  const theme = useTheme();

  // Track if we're in the edit view
  const edit = useMemo(
    () => /\/profile\/edit\/?/.test(router.asPath),
    [router.asPath],
  );

  const hasTrackingEnded = useMemo(
    () => new Date() >= new Date(trackingEndExtended),
    [],
  );

  // Once initial auth has completed, load the avatar (and only load it once)
  const [loaded, setLoaded] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [oauth, setOauth] = useState([]);

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

      // Fetch the user's OAuth providers
      const rawOauth = await fetchUserOAuth(auth.user.id, auth.token);

      setOauth(
        rawOauth.reduce(
          (obj, item) => ({
            ...obj,
            [item.provider]: item,
          }),
          {},
        ),
      );

      // Show the page
      setLoaded(true);
    })();
  }, [auth, loaded]);

  // Handle linking OAuth accounts
  const linkOAuth = useCallback(
    async (e, provider) => {
      e.preventDefault();
      if (hasTrackingEnded) return;

      const link = await createUserOAuth(
        auth.user.id,
        auth.token,
        provider,
      ).catch(async (err) => {
        const data = await err.response.json().catch(() => null);
        console.error(err, data);
      });
      window.location.href = link.redirect;
    },
    [auth.user?.id, auth.token],
  );

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

      <Layout>
        {auth.loading || !loaded ? (
          <Section
            bgColor={theme.colors.darkGreen}
            color={theme.colors.typography}
          >
            <Container>
              <Loader message=">> Loading /usr/lib/profile..." />
            </Container>
          </Section>
        ) : (
          <>
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
                  <>
                    <ButtonMain
                      as="button"
                      onClick={() =>
                        router.push('/profile', undefined, { shallow: true })
                      }
                      children="Back to Profile"
                    />
                    {Object.keys(providerMap).map((provider) => (
                      <Fragment key={provider}>
                        {!oauth[provider] && (
                          <ButtonMain
                            onClick={(e) => linkOAuth(e, provider)}
                            as="button"
                            disabled={hasTrackingEnded}
                          >
                            Link alternate provider
                          </ButtonMain>
                        )}
                      </Fragment>
                    ))}
                  </>
                )}
                <ButtonMain
                  as="button"
                  onClick={() => auth.reset()}
                  children="Logout"
                />
              </StyledButtonGroup>
            </Header>
            {edit ? <Settings auth={auth} isEdit /> : <Progress auth={auth} />}
          </>
        )}
      </Layout>
    </>
  );
};

export default Profile;
