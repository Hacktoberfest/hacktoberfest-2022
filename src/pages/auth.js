import Head from 'next/head';
import { useRouter } from 'next/router';
import styled, { useTheme } from 'styled-components';

import Loader from 'components/loader';
import Container from 'components/Container';
import Section from 'components/Section';

import useAuth from 'hooks/useAuth';

import { oauth } from 'lib/api';
import createMetaTitle from 'lib/createMetaTitle';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';

import logoGithub from 'assets/img/logo-github.svg';
import logoGitlab from 'assets/img/logo-gitlab.svg';
import CardCallout from '../components/CardCallout';
import Image from 'next/image';
import ContentMaster from '../components/ContentMaster';
import ButtonMain from '../components/ButtonMain';
import Layout from '../components/Layout';
import { textLg } from '../themes/typography';

const StyledAuth = styled(Section)`
  padding: 120px 0 64px;

  ${mQ(bp.desktop)} {
    padding-top: 180px;
  }
`;

const StyledCardRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
  margin-top: 32px;

  ${mQ(bp.desktop)} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
    margin-top: 56px;
  }
`;

const StyledCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  button {
    margin-top: auto;
  }
`;

const StyledLogoAndTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  p {
    color: ${({ theme }) => theme.colors2025.space.white};
    font-weight: 700;
  }

  img {
    height: 88px;
    width: 88px;

    ${mQ(bp.desktop)} {
      height: 120px;
      width: 120px;
    }
  }
`;

const StyledError = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  > :first-child {
    color: ${({ theme }) => theme.colors2025.error};

    p {
      font-weight: 700;

      ${mQ(bp.desktop)} {
        ${textLg};
        font-weight: 700;
      }
    }
  }
`;

const errorMap = {
  'InvalidCredentials: Account already exists with matching email address': {
    title:
      'A Hacktoberfest account already exists with the email address you are trying to use.',
    message:
      "If you have participated in a previous year of Hacktoberfest, please make sure to use the same GitHub/GitLab account as before to log in. If you're looking to link accounts from both GitHub and GitLab, sign in with the account that you've used previously for Hacktoberfest and then link the other account under the edit profile view.",
  },
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
      <Layout>
        <StyledAuth>
          <Container>
            {auth.loading ? (
              <Loader message=">> Authorization in progress..." />
            ) : (
              <>
                {error && (
                  <CardCallout>
                    <StyledError>
                      <ContentMaster size="lg">
                        {`An error occurred while authenticating you. ${errorMap[error]?.title || ''}`}
                      </ContentMaster>
                      <ContentMaster>
                        {errorMap[error]?.message ||
                          `${router.query.error_code} ${router.query.error_message}`}
                      </ContentMaster>
                    </StyledError>
                  </CardCallout>
                )}
                <StyledCardRow>
                  <CardCallout>
                    <StyledCardContent>
                      <StyledLogoAndTitle>
                        <Image src={logoGithub} alt="Github" />
                        <ContentMaster size="xl">
                          Authorize with GitHub
                        </ContentMaster>
                      </StyledLogoAndTitle>
                      <ButtonMain href={oauth('github')}>Initiate</ButtonMain>
                    </StyledCardContent>
                  </CardCallout>

                  <CardCallout>
                    <StyledCardContent>
                      <StyledLogoAndTitle>
                        <Image src={logoGitlab} alt="GitLab" />
                        <ContentMaster size="xl">
                          Authorize with GitLab
                        </ContentMaster>
                      </StyledLogoAndTitle>
                      <ButtonMain href={oauth('gitlab')}>Initiate</ButtonMain>
                    </StyledCardContent>
                  </CardCallout>
                </StyledCardRow>
              </>
            )}
          </Container>
        </StyledAuth>
      </Layout>
    </>
  );
};

export default Auth;
