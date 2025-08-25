import { useCallback, useMemo, useRef, useState } from 'react';
import Head from 'next/head';

import { providerMap, trackingEndExtended } from 'lib/config';
import { createExcludedRepository } from 'lib/api';

import Section from 'components/Section';
import Loader from 'components/loader';
import Form from 'components/form';

import useAuth from 'hooks/useAuth';
import HeroSecondary from 'components/HeroSecondary';
import Container from 'components/Container';
import ContentMaster from 'components/ContentMaster';
import { reportContent, reportEnded, reportTitle } from 'lib/report';
import Input from 'components/Input';
import Select from 'components/Select';
import ButtonMain from 'components/ButtonMain';
import createMetaTitle from 'lib/createMetaTitle';
import report from 'assets/img/heroes/report.svg';
import loading from 'assets/img/heroes/loading.svg';
import Image from 'next/image';
import CardCallout from '../components/CardCallout';
import Layout from '../components/Layout';
import styled from 'styled-components';

import globeSmile from 'assets/img/globe-smile.svg';

const StyledReportHeader = styled(ContentMaster)`
  > div {
    text-align: left;
  }

  h2 {
    font-family: 'Atkinson Hyperlegible';
    letter-spacing: 0.48px;
    text-shadow: none;
  }
`;

const StyledSubmitContainer = styled.div`
  margin-top: 32px;
`;

const StyledSuccessMessage = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${StyledReportHeader} {
    > div > div {
      justify-content: center;
    }

    > div {
      text-align: center;
    }
  }
`;

const Report = () => {
  const auth = useAuth(false);

  const hasTrackingEnded = useMemo(
    () => new Date() >= new Date(trackingEndExtended),
    [],
  );

  // Track the data the user enters
  const [provider, setProvider] = useState(Object.keys(providerMap)[0]);
  const [repository, setRepository] = useState('');

  // Track the state of the form
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const form = useRef();
  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (submitting) return;
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      // Check the form is valid, fail if not
      // TODO: Aid the native error reporting?
      if (!form.current?.reportValidity()) {
        setSubmitting(false);
        return;
      }

      // Create the report
      await createExcludedRepository(auth.user.id, auth.token, {
        provider,
        name: repository,
      })
        .then(() => {
          setSuccess(true);
          setRepository('');
        })
        .catch(async (err) => {
          const data = await err.response.json().catch(() => null);
          console.error(err, data);

          // Handle known errors we can show the user
          if (
            data?.code === 'NotFound' &&
            data?.message ===
              `Could not locate repository name '${repository}' with provider ${provider}`
          ) {
            setError(
              `The repository name you provided could not be found on ${providerMap[provider].name}.`,
            );
            return;
          }
          if (
            data?.code === 'NotAuthorized' &&
            data?.message === 'User is not authorized with provider'
          ) {
            setError(
              `You need to link a ${providerMap[provider].name} account to your registration to report repositories from that provider.`,
            );
            return;
          }
          if (
            data?.code === 'InvalidContent' &&
            data?.message ===
              'User has already reported this repository for this event'
          ) {
            setError(
              "You've already reported this repository to us! We'll review it as soon as possible.",
            );
            return;
          }
          if (
            data?.code === 'TooManyRequests' &&
            /Requests too fast, try again in \d+ seconds/.test(
              data?.message || '',
            )
          ) {
            const seconds = Number(data.message.match(/in (\d+) seconds/)[1]);
            setError(
              `You're reporting repositories too quickly! Please wait ${seconds.toLocaleString()} second${
                seconds === 1 ? '' : 's'
              } before trying again.`,
            );
            return;
          }

          // Handle unknown errors
          setError(
            'An unknown error occurred while submitting your report. Please try again later.',
          );
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [auth, provider, repository],
  );

  return (
    <>
      <Head>
        <title>{createMetaTitle('Report')}</title>
        <meta
          name="twitter:title"
          key="twitterTitle"
          content={createMetaTitle('Report')}
        />
        <meta
          property="og:title"
          key="opengraphTitle"
          content={createMetaTitle('Report')}
        />
      </Head>

      <HeroSecondary
        title={auth.active ? 'Report' : 'Coming Soon'}
        icon={<Image src={auth.active ? report : loading} alt="" />}
        iconSize="sm"
        titleSize="sm"
        body={
          !auth.active &&
          'The ability to report repositories will be available when registration opens.'
        }
      />

      {auth.active && (
        <Layout>
          <Section>
            <Container inner>
              <CardCallout>
                {success ? (
                  <StyledSuccessMessage>
                    <Image src={globeSmile} alt="" />
                    <StyledReportHeader
                      size="sm"
                      title="Successfully reported"
                      align="center"
                    >
                      Thanks for letting us know about this repository. We'll
                      review it as soon as possible.
                    </StyledReportHeader>
                  </StyledSuccessMessage>
                ) : hasTrackingEnded ? (
                  <ContentMaster size="xl2" children={reportEnded} />
                ) : auth.loading ? (
                  <Loader message=">> Loading /usr/lib/report..." />
                ) : auth.state !== 'profile' ? (
                  <StyledReportHeader
                    size="sm"
                    title="User not registered"
                    align="left"
                    cta={{
                      href: '/auth',
                      children: 'Start Hacking',
                    }}
                  >
                    You must be registered for Hacktoberfest to report
                    repositories.
                  </StyledReportHeader>
                ) : (
                  <>
                    <StyledReportHeader size="sm" title={reportTitle}>
                      {reportContent}
                    </StyledReportHeader>
                    <Form ref={form} onSubmit={submit}>
                      <Select
                        name="provider"
                        label="Provider"
                        value={provider}
                        items={Object.entries(providerMap).map(
                          ([provider, { name }]) => [provider, name],
                        )}
                        onChange={(e) => setProvider(e.target.value)}
                        disabled={submitting}
                        required
                      />
                      <Input
                        name="repository"
                        label="Repository"
                        placeholder="Owner/Target"
                        value={repository}
                        onChange={(e) => setRepository(e.target.value)}
                        disabled={submitting}
                        error={'aaa'}
                        required
                      />

                      <StyledSubmitContainer>
                        <ButtonMain
                          as="button"
                          type="submit"
                          onClick={submit}
                          disabled={submitting}
                        >
                          Report
                        </ButtonMain>
                      </StyledSubmitContainer>
                    </Form>
                  </>
                )}
              </CardCallout>
            </Container>
          </Section>
        </Layout>
      )}
    </>
  );
};

export default Report;
