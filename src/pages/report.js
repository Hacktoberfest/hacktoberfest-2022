import { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { providerMap, registrationEnd, registrationStart } from 'lib/config';
import { createExcludedRepository } from 'lib/api';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Loader from 'components/loader';
import Button from 'components/button';
import Hero from 'components/hero';
import { PixelPus } from 'components/pixels';
import Form from 'components/form';

import useAuth from 'hooks/useAuth';

const Report = () => {
  const auth = useAuth(false);

  const hasRegistrationEnded = useMemo(() => new Date() >= new Date(registrationEnd), []);

  // Track the data the user enters
  const [ provider, setProvider ] = useState(Object.keys(providerMap)[0]);
  const [ repository, setRepository ] = useState('');

  // Track the state of the form
  const [ submitting, setSubmitting ] = useState(false);
  const [ success, setSuccess ] = useState(false);
  const [ error, setError ] = useState(null);

  // Handle form submission
  const form = useRef();
  const submit = useCallback(async e => {
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
    await createExcludedRepository(auth.user.id, auth.token, { provider, name: repository })
      .then(() => {
        setSuccess(true);
        setRepository('');
      })
      .catch(async err => {
        const data = await err.response.json().catch(() => null);
        console.error(err, data);

        // Handle known errors we can show the user
        if (data?.code === 'NotFound' && data?.message === `Could not locate repository name '${repository}' with provider ${provider}`) {
          setError(`The repository name you provided could not be found on ${providerMap[provider]}.`);
          return;
        }
        if (data?.code === 'NotAuthorized' && data?.message === 'User is not authorized with provider') {
          setError(`You need to link a ${providerMap[provider]} account to your registration to report repositories from that provider.`);
          return;
        }
        if (data?.code === 'InvalidContent' && data?.message === 'User has already reported this repository for this event') {
          setError('You\'ve already reported this repository to us! We\'ll review it as soon as possible.');
          return;
        }
        if (data?.code === 'TooManyRequests' && /Requests too fast, try again in \d+ seconds/.test(data?.message || '')) {
          const seconds = Number(data.message.match(/in (\d+) seconds/)[1]);
          setError(`You're reporting repositories too quickly! Please wait ${seconds.toLocaleString()} second${seconds === 1 ? '' : 's'} before trying again.`);
          return;
        }

        // Handle unknown errors
        setError('An unknown error occurred while submitting your report. Please try again later.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  }, [ auth, provider, repository ]);

  return (
    <>
      <Head>
        <title>Report | Hacktoberfest 2022</title>
        <meta name="twitter:title" key="twitterTitle" content="Report | Hacktoberfest 2022" />
        <meta property="og:title" key="opengraphTitle" content="Report | Hacktoberfest 2022" />
      </Head>

      <Hero
        h="200"
        s="10"
        b="0.5"
        gradientLeft="#9131ff"
        gradientRight="#2effcd"
        title="Report"
      >
        <PixelPus />
      </Hero>

      <Section type="sub_content">
        <Divider />
        <Anchor href="#" />

        <h4>Found a repository that doesn't follow the values of Hacktoberfest? Let us know and we'll review it.</h4>

        {hasRegistrationEnded ? (
          <p>
            We are no longer accepting new repository reports, as Hacktoberfest #{new Date(registrationStart).getFullYear() - 2013} {new Date(registrationStart).getFullYear()} has now ended.
            We look forward to seeing you for Hacktoberfest {new Date(registrationStart).getFullYear() + 1}!
          </p>
        ) : (
          !auth.active ? (
            <p>
              Coming soon: The ability to report repositories will be available when registration opens.
            </p>
          ) : (
            auth.loading ? (
              <Loader message=">> Loading /usr/lib/report..." />
            ) : (
              auth.state !== 'profile' ? (
                <>
                  <p>
                    You must be registered for Hacktoberfest to report repositories.
                  </p>
                  <Link href="/auth" passHref>
                    <Button as="a" special>Start Hacking</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Form
                    ref={form}
                    onSubmit={submit}
                    success={success && 'Thanks for letting us know about this repository. We\'ll review it as soon as possible.'}
                    error={error}
                  >
                    <fieldset>
                      <label htmlFor="provider">Provider</label>
                      <select
                        name="provider"
                        id="provider"
                        value={provider}
                        onChange={e => setProvider(e.target.value)}
                        disabled={submitting}
                        required
                      >
                        {Object.entries(providerMap).map(([ key, value ]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </fieldset>

                    <fieldset>
                      <label htmlFor="repository">Repository</label>
                      <input
                        type="text"
                        placeholder="owner/target"
                        name="repository"
                        id="repository"
                        value={repository}
                        onChange={e => setRepository(e.target.value)}
                        disabled={submitting}
                        required
                      />
                    </fieldset>

                    <Button onClick={submit} type="submit" disabled={submitting}>Report</Button>
                  </Form>
                </>
              )
            )
          ))}
      </Section>
    </>
  );
};

export default Report;
