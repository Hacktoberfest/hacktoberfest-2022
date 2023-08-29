import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import styled, { keyframes } from 'styled-components';

import iconLite from 'assets/img/icon-lite.svg';

import { fetchUserAvatars } from 'lib/api';

import { StyledButtonGroup } from 'components/button';
import Loader from 'components/loader';
import Settings from 'components/profile/settings';
import Progress from 'components/profile/progress';

import useAuth from 'hooks/useAuth';

import { StyledHeader, StyledHeaderContent } from './register';
import Section from 'components/Section';
import Container from 'components/Container';
import Avatar from 'components/Avatar';
import ContentMaster from 'components/ContentMaster';
import ButtonMain from 'components/ButtonMain';
import Divider from 'components/Divider';
import bgProfile from 'assets/img/bg-profile.svg';
import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

const opacityFade = () => keyframes`
  to {
    opacity: 1;
  }
`;

const StyledProfilePage = styled.div`
  background: url(${bgProfile.src}) no-repeat;
  background-position: right top;
  background-size: 400% auto;

  ${mQ(bp.tablet)} {
    background-size: 90% auto;
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
        <title>Profile | Hacktoberfest 2023</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Profile | Hacktoberfest 2023"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Profile | Hacktoberfest 2023"
        />
      </Head>

      {auth.loading || !loaded ? (
        <Section>
          <Container>
            <StyledHeader>
              <Loader message=">> Loading /usr/lib/profile..." />
            </StyledHeader>
          </Container>
        </Section>
      ) : (
        <StyledProfilePage>
          <Container>
            <StyledHeader>
              <Avatar src={avatar || iconLite.src} alt="" />
              <StyledHeaderContent>
                <ContentMaster
                  size="xl"
                  eyebrow=">> Boot Profile..."
                  title={`Hello, ${auth.user.name}`}
                />

                <StyledButtonGroup>
                  {!edit && (
                    <ButtonMain
                      as="button"
                      onClick={() => router.push('/profile/edit', undefined, { shallow: true })}
                      children="Edit Info"
                    />
                  )}
                  {edit && (
                    <ButtonMain
                      as="button"
                      onClick={() => router.push('/profile', undefined, { shallow: true })}
                      children="Back to Profile"
                    />
                  )}
                  <ButtonMain
                    as="button"
                    onClick={() => auth.reset()}
                    children="Logout"
                  />
                </StyledButtonGroup>
              </StyledHeaderContent>
            </StyledHeader>

            <Divider type="pixel" />

            <Section small>
              <StyledProgressWrapper>
                {edit ? <Settings auth={auth} isEdit /> : <Progress auth={auth} />}
              </StyledProgressWrapper>
            </Section>
          </Container>
        </StyledProfilePage>
      )}
    </>
  );
};

export default Profile;
