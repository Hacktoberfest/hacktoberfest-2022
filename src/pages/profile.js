import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled, { keyframes } from 'styled-components';

import iconLite from 'assets/img/icon-lite.svg';

import { fetchUserAvatars } from 'lib/api';

import Button from 'components/button';
import Loader from 'components/loader';
import Settings from 'components/profile/settings';
import Progress from 'components/profile/progress';
import { FauxHero } from 'components/hero';

import useAuth from 'hooks/useAuth';

const typingAnim = () => keyframes`
  from {
    width: 0ch;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  flex-flow: row wrap;

  div {
    display: flex;
    gap: 16px;
  }

  p {
    display: flex;
    
    span {
      white-space: nowrap;
      overflow: hidden;
      width: ${(props) => props.width}ch;
      animation: ${typingAnim} 1.5s steps(${(props) => props.width});
    }
    
    &.name:after {
      content: '_';
    }
  }

  @media (max-width: 964px) {
    height: auto;
    flex-flow: row wrap;

    div {
      margin-top: 12px;
    }

    p {
      width: 100%;
    }
  }

  @media (max-width: 450px) {
    p {
      display: block;
    }

    div {
      margin-top: 4px;
    }
  }
`;

const loadAvi = () => keyframes`
  to {
    transform: translateY(-40px) rotate(0deg);
    opacity: 1;
  }
`;

const StyledAvi = styled.div`
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
    
    ${(props) => props.isDefault && `
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

const Profile = () => {
  const auth = useAuth();

  // Track if we're in the edit view
  const [edit, setEdit] = useState(false);

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

  return (
    <>
      <Head>
        <title>Profile | Hacktoberfest 2022</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Profile | Hacktoberfest 2022"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Profile | Hacktoberfest 2022"
        />
      </Head>

      {auth.loading || !loaded ? (
        <FauxHero
          h="220"
          s="8"
          b="0.4"
          gradientLeft="#E800FF"
          gradientRight="#0F00FF"
          height="600px"
        >
          <StyledHeader>
            <Loader message=">> Loading /usr/lib/profile..." />
          </StyledHeader>
        </FauxHero>
      ) : (
        <>
          <FauxHero
            h="220"
            s="8"
            b="0.4"
            gradientLeft="#E800FF"
            gradientRight="#0F00FF"
            height="600px"
            spacing_btm="-80px"
          >
            <StyledHeader width={auth.user.name.length + 7}>
              <p className="name">
                {'>>'} Boot Profile: 
                <span>Hello, {auth.user.name}</span>
              </p>
              <div>
                {!edit && (
                  <Button onClick={() => setEdit(true)}>Edit Info</Button>
                )}
                {edit && (
                  <Button onClick={() => setEdit(false)}>
                    Back to Profile
                  </Button>
                )}
                <Button onClick={() => auth.reset()}>Logout</Button>
              </div>
            </StyledHeader>

            <StyledAvi isDefault={!avatar}>
              <img src={avatar || iconLite.src} alt="" width={256} height={256} />
            </StyledAvi>
          </FauxHero>
          <div>
            {edit ? (
              <Settings auth={auth} isEdit />
            ) : (
              <Progress auth={auth} />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
