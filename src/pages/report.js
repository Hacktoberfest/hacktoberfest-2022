import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Loader from 'components/loader';
import Button from 'components/button';

import useAuth from 'hooks/useAuth';

import { providerMap } from 'lib/config';
import { createExcludedRepository } from 'lib/api';

const Report = () => {
  const auth = useAuth(false);

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
    if (!form.current?.reportValidity()) return;

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
        if (data?.code === 'NotFound' && data?.message === 'Could not locate repository name with provider') {
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

      <Section type="sub_hero">
        <h1>Report</h1>
        <h4>Found a repository that doesn't follow the values of Hacktoberfest? Let us know and we'll review it.</h4>
      </Section>

      <Section type="sub_content">
        <Divider />
        <Anchor href="#" />

        {!auth.active ? (
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
                <form ref={form} onSubmit={submit}>
                  {success && (
                    <>
                      <p>[ Success ]</p>
                      <p>Thanks for letting us know about this repository. We'll review it as soon as possible.</p>
                    </>
                  )}

                  {error && (
                    <>
                      <p>[ Error ]</p>
                      <p>{error}</p>
                    </>
                  )}

                  <fieldset>
                    <legend>[ Provider ]</legend>
                    <select
                      name="provider"
                      value={provider}
                      onChange={e => setProvider(e.target.value)}
                      required
                    >
                      {Object.entries(providerMap).map(([ key, value ]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </fieldset>

                  <fieldset>
                    <legend>[ Repository ]</legend>
                    <input
                      type="text"
                      placeholder="owner/target"
                      name="repository"
                      value={repository}
                      onChange={e => setRepository(e.target.value)}
                      required
                    />
                  </fieldset>

                  <Button onClick={submit} type="submit">Report</Button>
                </form>
              </>
            )
          )
        )}

      </Section>
    </>
  );
};

export default Report;
