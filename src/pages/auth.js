import Head from 'next/head';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';

import Loader from 'components/loader';

import useAuth from 'hooks/useAuth';

import { oauth } from 'lib/api';
import Container from 'components/Container';
import Card from 'components/Card';
import Section from 'components/Section';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import { body24 } from 'themes/typography';

import logoGithub from 'assets/img/logo-github.svg';
import logoGitlab from 'assets/img/logo-gitlab.svg';
import Type from 'components/type';
import createMetaTitle from 'lib/createMetaTitle';

const StyledP = styled.p`
  display: inline-flex;
  margin: 0 0 40px;
  ${body24}
`;

export const StyledAuth = styled.div`
  background: ${({ theme }) => theme.colors.darkGreen};
  color: ${({ theme }) => theme.colors.typography};
  padding: 68px 0;
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
        <title>{createMetaTitle('Auth')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('Auth')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('Auth')}
        />
      </Head>
      <StyledAuth>
        <Section>
          <Container>
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
                  {'>>'} Boot dialogue: 
                  <Type text="Initiating Pilot protocol" />
                </StyledP>
                <StyledCardRow>
                  <Card
                    image={{
                      src: logoGithub.src,
                      alt: '',
                    }}
                    title="Authorize with GitHub"
                    cta={{
                      href: oauth('github'),
                      children: 'initiate',
                      variant: 'primary-green',
                    }}
                  />

                  <Card
                    imageRotatation="right"
                    image={{
                      src: logoGitlab.src,
                      alt: '',
                    }}
                    title="Authorize with GitLab"
                    cta={{
                      href: oauth('gitlab'),
                      children: 'initiate',
                      variant: 'primary-green',
                    }}
                  />
                </StyledCardRow>
              </>
            )}
          </Container>
        </Section>
      </StyledAuth>
    </>
  );
};

export default Auth;
