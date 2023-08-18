import Head from 'next/head';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';

import Button from 'components/button';
import Loader from 'components/loader';
import { FauxHero } from 'components/hero';

import useAuth from 'hooks/useAuth';

import { oauth } from 'lib/api';
import Container from 'components/Container';
import Card from 'components/Card';
import Section from 'components/section';

import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

import { headline20 } from 'themes/typography';

import bgAuthTopRight from 'assets/img/bg-auth-topright.svg';
import bgAuthBottomLeft from 'assets/img/bg-auth-bottomleft.svg';
import logoGithub from 'assets/img/logo-github.svg';
import logoGitlab from 'assets/img/logo-gitlab.svg';
import pixelFrameYellow from 'assets/img/pixel-frame-yellow.svg';
import pixelFrameBlue from 'assets/img/pixel-frame-blue.svg';

const typingAnim = () => keyframes`
  from {
    width: 0ch;
  }
`;

const StyledP = styled.p`
  display: flex;
  margin: 0 0 40px;
  ${headline20};

  span {
    white-space: nowrap;
    overflow: hidden;
    width: ${(props) => props.width}ch;
    animation: ${typingAnim} 1.5s steps(${(props) => props.width});
  }
`;

export const StyledAuth = styled.div`
  background: url(${bgAuthTopRight.src}) no-repeat, url(${bgAuthBottomLeft.src}) no-repeat;
  background-position: top right, bottom left;
`;

export const StyledCardRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 32px;

  ${mQ(bp.desktop)} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 64px;
  }
`;

const Auth = () => {
  const auth = useAuth();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Auth | Hacktoberfest 2022</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content="Auth | Hacktoberfest 2022"
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content="Auth | Hacktoberfest 2022"
        />
      </Head>
      <StyledAuth>
        <Container>
          <Section>
            {auth.loading ? (
              <div>
                <Loader message=">> Authorization in progress..." />
              </div>
            ) : (
              <>
                {!!(router.query.error_code && router.query.error_message) && (
                  <p>
                    <strong>ERROR: Authentication process failed.</strong>
                    <br />
                    <code>
                      {router.query.error_code}: {router.query.error_message}
                    </code>
                  </p>
                )}
                <StyledP width="25">
                  {'>>'} Boot dialogue: <span>Initiating Pilot protocol</span>_
                </StyledP>
                <StyledCardRow>
                  <Card
                    bgImage={pixelFrameYellow.src}
                    image={{
                      src: logoGithub.src,
                      alt: ''
                    }}
                    title="Authorize with github"
                    cta={{
                      href: oauth('github'),
                      children: 'initiate',
                    }}
                  />

                  <Card
                    bgImage={pixelFrameBlue.src}
                    imageRotatation="right"
                    image={{
                      src: logoGitlab.src,
                      alt: ''
                    }}
                    title="Authorize with gitlab"
                    cta={{
                      href: oauth('gitlab'),
                      children: 'initiate',
                    }}
                  />
                </StyledCardRow>
              </>
            )}
          </Section>
        </Container>
      </StyledAuth>
    </>
  );
};

export default Auth;
