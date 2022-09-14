import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Button from 'components/button';
import Loader from 'components/loader';
import MetadataFields from 'components/profile/metadata-fields';

import useAuth from 'hooks/useAuth';

import { fetchMetadata, fetchUserEmails } from 'lib/api';

const Register = () => {
  const auth = useAuth();

  // Track the data we need to render
  const [ loaded, setLoaded ] = useState(false);
  const [ emails, setEmails ] = useState([]);
  const [ metadata, setMetadata ] = useState([]);

  // Track the data the user enters
  const [ data, setData ] = useState({
    email: null,
    metadata: {},
  });

  // Once initial auth has completed, load the data we need to render
  useEffect(() => {
    (async () => {
      if (auth.loading) return;
      if (loaded) return;

      // Fetch all emails and default to the user's current email
      setEmails(await fetchUserEmails(auth.user.id, auth.token));
      setData(prev => ({ ...prev, email: auth.user.email }));

      // Fetch all the metadata for the event
      const rawMetadata = await fetchMetadata(auth.token);
      setMetadata(rawMetadata);

      // Store default values for each metadata item
      setData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          ...rawMetadata.reduce((obj, item) => ({
            ...obj,
            [item.name]: item.datatype === 'boolean' ? false : (item.datatype === 'string' ? '' : null),
          }), {}),
        },
      }));

      // Show the page
      setLoaded(true);
    })();
  }, [ auth, loaded ]);

  // Handle form submission
  const form = useRef();
  const submit = useCallback(e => {
    e.preventDefault();

    // Check the form is valid, fail if not
    if (!form.current.reportValidity()) return;

    // TODO: PATCH user with email
    // TODO: POST registration with metadata
  }, [ form ]);

  return (
    <>
      <Head>
        <title>Register | Hacktoberfest 2022</title>
        <meta name="twitter:title" key="twitterTitle" content="Register | Hacktoberfest 2022" />
        <meta property="og:title" key="opengraphTitle" content="Register | Hacktoberfest 2022" />
      </Head>

      {auth.loading || !loaded ? (
        <Section type="sub_content">
          <Divider />
          <Anchor href="#" />
          <Loader message=">> Loading /usr/lib/profile..." />
        </Section>
      ) : (
        <Section type="sub_content">
          <Divider />
          <Anchor href="#" />
          <p>Registration</p>
          <p>Hello, {auth.user.name}</p>

          <form ref={form} onSubmit={submit}>
            <MetadataFields emails={emails} metadata={metadata} value={data} onChange={setData} />
          </form>

          <Button onClick={() => auth.reset()}>Logout</Button>
          <Button onClick={submit}>Register</Button>
        </Section>
      )}

    </>
  );
};

export default Register;
