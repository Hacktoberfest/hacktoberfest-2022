import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Head from 'next/head';

import iconLite from 'assets/img/icon-lite.svg';

import { fetchUserAvatars } from 'lib/api';

import Section from 'components/Section';
import Loader from 'components/loader';
import Settings from 'components/profile/settings';
import Type from 'components/type';

import useAuth from 'hooks/useAuth';
import Button, { StyledButtonGroup } from '../components/button';
import { registrationEnd, registrationStart } from '../lib/config';

const loadAvi = () => keyframes`
  to {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
`;

export const StyledAvatar = styled.div`
  position: relative;
  transform: translateY(200px) rotate(-16deg);
  opacity: 0;
  animation ${loadAvi} 0.5s 0.5s ease forwards;

  img {
    border-radius: 24px;
    object-fit: cover;
    transform: rotate(8deg);
    box-shadow: ${(props) => props.theme.glowLite};
    background: ${(props) => props.theme.body};
    transition: 0.2s ease;

    ${(props) =>
  props.isDefault &&
  `
      opacity: 0.5;
      pointer-events: none;
    `}

    &:hover {
      transform: rotate(0deg);
      filter: hue-rotate(140deg) contrast(100%);
      box-shadow: -1px -1px 20px rgba(255, 215, 77, 1),
        1px 1px 20px rgba(124, 127, 255, 1);
    }
  }
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  flex-flow: row wrap;
  position: absolute;
  top: 40px;
  left: 0;

  @media (max-width: 964px) {
    height: auto;
    flex-flow: row wrap;

    div {
      margin-top: 12px;
    }
  }

  @media (max-width: 450px) {
    div {
      margin-top: 4px;
    }
  }
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
            <Link href="/" passHref>
              <Button as="a">Home</Button>
            </Link>
            <Button onClick={logout}>Logout</Button>
          </StyledButtonGroup>
        </Section>
      ) : (
        auth.loading ? (
          <div
            h="220"
            s="8"
            b="0.4"
            gradientLeft="#E800FF"
            gradientRight="#0F00FF"
            height="600px"
          >
            <StyledHeader>
              <Loader message=">> Authorization in progress..." />
            </StyledHeader>
          </div>
        ) : (
          <>
            <div
              h="220"
              s="8"
              b="0.4"
              gradientLeft="#E800FF"
              gradientRight="#0F00FF"
              height="600px"
              spacing_btm="-80px"
            >
              <StyledHeader>
                <Type
                  text={`Hello, ${auth.user.name}`}
                  prefix=">> Boot Registration:"
                />
              </StyledHeader>

              <StyledAvatar isDefault={!avatar}>
                <img
                  src={avatar || iconLite.src}
                  alt=""
                  width={256}
                  height={256}
                />
              </StyledAvatar>
            </div>
            <Section>
              <Settings auth={auth} />
            </Section>
          </>
        ))}
    </>
  );
};

export default Register;
