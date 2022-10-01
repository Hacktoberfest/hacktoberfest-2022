import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import styled, { keyframes } from 'styled-components';

import iconLite from 'assets/img/icon-lite.svg';

import { fetchUserAvatars } from 'lib/api';

import Button, { StyledButtonGroup } from 'components/button';
import Loader from 'components/loader';
import { FauxHero } from 'components/hero';
import Type from 'components/type';
import Settings from 'components/profile/settings';
import Progress from 'components/profile/progress';
import { PixelFirework1, PixelFirework2 } from 'components/pixels';

import useAuth from 'hooks/useAuth';

import { StyledAnimations } from './index';
import { StyledAvatar, StyledHeader } from './register';

const opacityFade = () => keyframes`
  to {
    opacity: 1;
  }
`;

const StyledProgressWrapper = styled.div`
  opacity: 0;
  animation: ${opacityFade} 0.5s 0.5s ease forwards;
`;

const Profile = () => {
  const auth = useAuth();
  const router = useRouter();

  // Track if we're in the edit view
  const edit = useMemo(() => /\/profile\/edit\/?/.test(router.asPath), [router.asPath]);

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
            <StyledHeader>
              <Type
                text={`Hello, ${auth.user.name}`}
                prefix=">> Boot Profile:"
              />
              <StyledButtonGroup>
                {!edit && (
                  <Button onClick={() => router.push('/profile/edit', undefined, { shallow: true })}>Edit Info</Button>
                )}
                {edit && (
                  <Button onClick={() => router.push('/profile', undefined, { shallow: true })}>
                    Back to Profile
                  </Button>
                )}
                <Button onClick={() => auth.reset()}>Logout</Button>
              </StyledButtonGroup>
            </StyledHeader>

            <StyledAvatar isDefault={!avatar}>
              <img
                src={avatar || iconLite.src}
                alt=""
                width={256}
                height={256}
              />
            </StyledAvatar>
            <StyledAnimations>
              <PixelFirework1
                width="840"
                scale="1"
                timing="1.5"
                frames="7"
                id="f1"
              />
              <PixelFirework2
                width="840"
                scale="1"
                timing="1"
                frames="7"
                id="f2"
              />
              <PixelFirework1
                width="840"
                scale="1.5"
                timing="1.25"
                frames="7"
                id="f3"
              />
            </StyledAnimations>
          </FauxHero>
          <StyledProgressWrapper>
            {edit ? <Settings auth={auth} isEdit /> : <Progress auth={auth} />}
          </StyledProgressWrapper>
        </>
      )}
    </>
  );
};

export default Profile;
