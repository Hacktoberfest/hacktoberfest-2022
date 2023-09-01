import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

import iconLite from 'assets/img/icon-lite.svg';

import { fetchUserAvatars } from 'lib/api';

import Section from 'components/Section';
import Loader from 'components/loader';
import Settings from 'components/profile/settings';
import Type from 'components/type';

import useAuth from 'hooks/useAuth';

import { registrationEnd, registrationStart } from '../lib/config';
import Divider from 'components/Divider';
import Container from 'components/Container';
import Frame from 'components/Frame';
import { StyledAvatar } from 'components/Avatar/Avatar.styles';
import ButtonMain from 'components/ButtonMain';
import { StyledButtonGroup } from 'components/ButtonMain/ButtonMain.styles';

export const StyledHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 128px 0 80px;
  gap: 64px;


  ${mQ(bp.tablet)} {
    align-items: center;
    flex-direction: row;
    padding: 224px 0 80px;
    background-size: 100% auto;
  }

  ${StyledAvatar} {
    width: 53.82262997%;

    ${mQ(bp.tablet)} {
      width: 26.484375%;
    }
  }
`;

export const StyledHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  flex-grow: 1;
`;

const Register = () => {
  const auth = useAuth();

  const hasRegistrationEnded = useMemo(() => new Date() >= new Date(registrationEnd), []);

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
        )?.[0] || null
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
    [auth.reset]
  );

  return (
    <>
      <Head>
        <title>Register | Hacktoberfest 2023</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Register | Hacktoberfest 2023"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Register | Hacktoberfest 2023"
        />
      </Head>

      {hasRegistrationEnded ? (
        <Section>
          <p>
            Registration is now closed, as Hacktoberfest #{new Date(registrationStart).getFullYear() - 2013} {new Date(registrationStart).getFullYear()} has now ended.
            We look forward to seeing you for Hacktoberfest {new Date(registrationStart).getFullYear() + 1}!
          </p>
          <br/>
          <p>
            <i>If you've already registered for Hacktoberfest and are trying to access your profile, make sure you're authenticating with the correct account!</i>
          </p>
          <br/>
          <StyledButtonGroup>
            <ButtonMain href="/" children="Home" />
            <ButtonMain as="button" onClick={logout} children="Logout" />
          </StyledButtonGroup>
        </Section>
      ) : (
        auth.loading ? (
          <Section>
            <Container>
              <StyledHeader>
                <Loader message=">> Authorization in progress..." />
              </StyledHeader>
            </Container>
          </Section>
        ) : (
          <>
            <Container>
              <Section small>
                <StyledHeader>
                  <StyledAvatarWrapper>
                    <Frame color="blue" />
                    <StyledAvatar $rotate="right">
                      <img
                        src={avatar || iconLite.src}
                        alt=""
                        width={256}
                        height={256}
                      />
                    </StyledAvatar>
                  </StyledAvatarWrapper>

                  <StyledHeaderContent>
                    <Type
                      text={`Hello, ${auth.user.name}`}
                      prefix=">> Boot Registration:"
                    />
                  </StyledHeaderContent>
                </StyledHeader>
              </Section>

              <Divider type="pixel" />

              <Section small>
                <Settings auth={auth} />
              </Section>
            </Container>
          </>
        ))}
    </>
  );
};

export default Register;
