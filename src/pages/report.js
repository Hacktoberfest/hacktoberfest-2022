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
import { reportEnded, reportTitle } from 'lib/report';
import Input from 'components/Input';
import Select from 'components/Select';
import ButtonMain from 'components/ButtonMain';
import createMetaTitle from 'lib/createMetaTitle';
import asciiReport from 'assets/img/ascii-report.svg';

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
              `The repository name you provided could not be found on ${providerMap[provider]}.`,
            );
            return;
          }
          if (
            data?.code === 'NotAuthorized' &&
            data?.message === 'User is not authorized with provider'
          ) {
            setError(
              `You need to link a ${providerMap[provider]} account to your registration to report repositories from that provider.`,
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
        title="Report"
        icon={<img src={asciiReport.src} alt="" />}
      />

      <Section>
        <Container>
          {!hasTrackingEnded && (
            <ContentMaster size="xl2" children={reportTitle} />
          )}

          {hasTrackingEnded ? (
            <ContentMaster size="xl2" children={reportEnded} />
          ) : !auth.active ? (
            <ContentMaster size="xl2">
              Coming soon: The ability to report repositories will be available
              when registration opens.
            </ContentMaster>
          ) : auth.loading ? (
            <Loader message=">> Loading /usr/lib/report..." />
          ) : auth.state !== 'profile' ? (
            <Section small>
              <ContentMaster
                size="xl2"
                cta={{
                  href: '/auth',
                  variant: 'secondary-deep-pink',
                  children: 'Start Hacking',
                }}
              >
                You must be registered for Hacktoberfest to report repositories.
              </ContentMaster>
            </Section>
          ) : (
            <>
              <Form
                ref={form}
                onSubmit={submit}
                success={
                  success &&
                  "Thanks for letting us know about this repository. We'll review it as soon as possible."
                }
                error={error}
                style={{ marginTop: '48px' }}
              >
                <Select
                  name="provider"
                  label="Provider"
                  value={provider}
                  items={Object.entries(providerMap)}
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
                  required
                />

                <ButtonMain
                  size="lg"
                  as="button"
                  type="submit"
                  variant="secondary-deep-pink"
                  onClick={submit}
                  disabled={submitting}
                >
                  Report
                </ButtonMain>
              </Form>
            </>
          )}
        </Container>
      </Section>
    </>
  );
};

export default Report;
