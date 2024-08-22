import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

import { fetchUserAvatars } from 'lib/api';
import { registrationEnd, registrationStart } from 'lib/config';

import useAuth from 'hooks/useAuth';

import Section from 'components/Section';
import Loader from 'components/loader';
import Divider from 'components/Divider';
import Container from 'components/Container';
import ButtonMain from 'components/ButtonMain';
import { StyledButtonGroup } from 'components/ButtonMain/ButtonMain.styles';
import Settings from 'components/profile/settings';
import Header from 'components/profile/header';
import createMetaTitle from 'lib/createMetaTitle';

const Register = () => {
  const auth = useAuth();

  const hasRegistrationEnded = useMemo(
    () => new Date() >= new Date(registrationEnd),
    [],
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

  const logout = useCallback(
    (e) => {
      e.preventDefault();
      auth.reset();
    },
    [auth.reset],
  );

  return (
    <>
      <Head>
        <title>{createMetaTitle('Register')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('Register')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('Register')}
        />
      </Head>

      {hasRegistrationEnded ? (
        <Section>
          <p>
            Registration is now closed, as Hacktoberfest #
            {new Date(registrationStart).getFullYear() - 2013}{' '}
            {new Date(registrationStart).getFullYear()} has now ended. We look
            forward to seeing you for Hacktoberfest{' '}
            {new Date(registrationStart).getFullYear() + 1}!
          </p>
          <br />
          <p>
            <i>
              If you've already registered for Hacktoberfest and are trying to
              access your profile, make sure you're authenticating with the
              correct account!
            </i>
          </p>
          <br />
          <StyledButtonGroup>
            <ButtonMain href="/" children="Home" />
            <ButtonMain as="button" onClick={logout} children="Logout" />
          </StyledButtonGroup>
        </Section>
      ) : auth.loading ? (
        <Section>
          <Container>
            <Loader message=">> Authorization in progress..." />
          </Container>
        </Section>
      ) : (
        <>
          <Container>
            <Header avatar={avatar} name={auth.user.name} type="Registration" />

            <Divider type="doubledashed" />

            <Section small>
              <Settings auth={auth} />
            </Section>
          </Container>
        </>
      )}
    </>
  );
};

export default Register;
