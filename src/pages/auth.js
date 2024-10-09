import Head from 'next/head';
import { useRouter } from 'next/router';
import styled, { useTheme } from 'styled-components';

import Loader from 'components/loader';
import Container from 'components/Container';
import Card from 'components/Card';
import Section from 'components/Section';
import Notification from 'components/notification';
import Type from 'components/type';

import useAuth from 'hooks/useAuth';

import { oauth } from 'lib/api';
import createMetaTitle from 'lib/createMetaTitle';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { body24 } from 'themes/typography';

import logoGithub from 'assets/img/logo-github.svg';
import logoGitlab from 'assets/img/logo-gitlab.svg';

const StyledNotification = styled(Notification)`
  margin: 0 0 40px;
`;

const StyledP = styled.p`
  margin: 0 0 40px;
  ${body24}
`;

const StyledAuth = styled.div`
  background: ${({ theme }) => theme.colors.darkGreen};
  color: ${({ theme }) => theme.colors.typography};
  padding: 68px 0;
`;

const StyledCardRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 32px;

  ${mQ(bp.desktop)} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 64px;
  }
`;

const errorMap = {
  'InvalidCredentials: Account already exists with matching email address': (
    <>
      A Hacktoberfest account already exists with the email address you are
      trying to use.
      <br />
      <br />
      If you have participated in a previous year of Hacktoberfest, please make
      sure to use the same GitHub/GitLab account as before to log in. If you're
      looking to link accounts from both GitHub and GitLab, sign in with the
      account that you've used previously for Hacktoberfest and then link the
      other account under the edit profile view.
    </>
  ),
};

const Auth = () => {
  const auth = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const error =
    router.query.error_code && router.query.error_message
      ? `${router.query.error_code}: ${router.query.error_message}`
      : null;

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
              <Loader message=">> Authorization in progress..." />
            ) : (
              <>
                {error && (
                  <StyledNotification title="Error" color={theme.colors.error}>
                    <p>
                      An error occurred while authenticating you.{' '}
                      {errorMap[error] || (
                        <>
                          <br />
                          <code>
                            {router.query.error_code}:{' '}
                            {router.query.error_message}
                          </code>
                        </>
                      )}
                    </p>
                  </StyledNotification>
                )}
                <StyledP>
                  {'>>'} Boot dialogue:{' '}
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
