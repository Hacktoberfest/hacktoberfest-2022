import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';

import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';
import Button from 'components/button';
import Loader from 'components/loader';

import useAuth from 'hooks/useAuth';

import { fetchMetadata, fetchUserEmails } from 'lib/api';

const Register = () => {
  const auth = useAuth();

  // Track the data we need to render
  const [ loaded, setLoaded ] = useState(false);
  const [ emails, setEmails ] = useState([]);
  const [ metadata, setMetadata ] = useState({});

  // Track the data the user enters
  const [ data, setData ] = useState({
    email: null,
    metadata: {},
  });
  const updateMetadata = useCallback(obj => {
    setData(prev => ({ ...prev, metadata: { ...prev.metadata, ...obj } }));
  }, []);

  // Provide a single checkbox to opt out of all marketing
  const [ marketingDisabled, setMarketingDisabled ] = useState(false);
  useEffect(() => {
    if (marketingDisabled && metadata.marketing) {
      updateMetadata(metadata.marketing.reduce((obj, item) => ({ ...obj, [item.name]: false }), {}));
    }
  }, [ marketingDisabled, metadata, updateMetadata ]);

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

      // Store default values for each metadata item
      updateMetadata(rawMetadata.reduce((obj, item) => ({
        ...obj,
        [item.name]: item.datatype === 'boolean' ? false : (item.datatype === 'string' ? '' : null),
      }), {}));

      // Group the metadata by category for the UI
      setMetadata(rawMetadata.reduce((obj, item) => ({
        ...obj,
        [item.name.split('-')[0]]: [
          ...(obj[item.name.split('-')[0]] || []),
          item,
        ],
      }), {}));

      // Show the page
      setLoaded(true);
    })();
  }, [ auth, loaded, updateMetadata ]);

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
            <fieldset>
              <label>[ Self-identification ]</label>

              <fieldset>
                <label>Email</label>
                <select
                  name="email"
                  value={data.email}
                  onChange={e => setData(prev => ({ ...prev, email: e.target.value }))}
                >
                  {emails.map(email => (
                    <option key={email} value={email}>{email}</option>
                  ))}
                </select>
              </fieldset>

              <fieldset>
                <label>How will you be participating? (select all that apply)</label>
                {metadata.role?.map(meta => (
                  <div key={meta.name}>
                    <label>
                      <input
                        type="checkbox"
                        name={meta.name}
                        onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
                        checked={data.metadata[meta.name]}
                      />
                      {meta.title}
                      <i>{meta.message}</i>
                    </label>
                  </div>
                ))}
              </fieldset>

              <fieldset>
                <label>What is your experience level?</label>
                {metadata.stage?.map(meta => (
                  <div key={meta.name}>
                    <label>
                      <input
                        type="radio"
                        name="experience"
                        value={meta.name}
                        onChange={e => updateMetadata(metadata.stage.reduce((obj, item) => ({
                          ...obj,
                          [item.name]: meta.name === item.name && e.target.checked,
                        }), {}))}
                      />
                      {meta.title}
                      <i>{meta.message}</i>
                    </label>
                  </div>
                ))}
              </fieldset>

              <fieldset>
                <label>How would you like to contribute? (select all that apply)</label>
                {metadata.type?.map(meta => (
                  <div key={meta.name}>
                    <label>
                      <input
                        type="checkbox"
                        name={meta.name}
                        onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
                        checked={data.metadata[meta.name]}
                      />
                      {meta.title}
                      <i>{meta.message}</i>
                    </label>
                  </div>
                ))}
              </fieldset>
            </fieldset>

            <fieldset>
              <label>[ Operational opt-ins ]</label>

              {metadata.operational?.map(meta => (
                <div key={meta.name}>
                  <label>
                    <input
                      type="checkbox"
                      name={meta.name}
                      onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
                      checked={data.metadata[meta.name]}
                    />
                    {meta.title}
                    <i>{meta.message}</i>
                  </label>
                </div>
              ))}
            </fieldset>

            <fieldset>
              <label>[ Marketing opt-ins ]</label>

              {metadata.marketing?.map(meta => (
                <div key={meta.name}>
                  <label>
                    <input
                      type="checkbox"
                      name={meta.name}
                      onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
                      checked={data.metadata[meta.name]}
                      disabled={marketingDisabled}
                    />
                    {meta.title}
                    <i>{meta.message}</i>
                  </label>
                </div>
              ))}

              <div>
                <label>
                  <input
                    type="checkbox"
                    name="marketing-disable"
                    onChange={e => setMarketingDisabled(e.target.checked)}
                    checked={marketingDisabled}
                  />
                  I do not wish to receive any marketing updates from Hacktoberfest’s partners.
                </label>
              </div>
            </fieldset>

            <fieldset>
              <label>[ Rules &amp; terms ]</label>

              {metadata.agree?.map(meta => (
                <div key={meta.name}>
                  <label>
                    <input
                      type="checkbox"
                      name={meta.name}
                      onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
                      checked={data.metadata[meta.name]}
                      required
                    />
                    {meta.title}
                    <i>{meta.message}</i>
                  </label>
                </div>
              ))}
            </fieldset>
          </form>

          <Button onClick={() => auth.reset()}>Logout</Button>
          <Button onClick={submit}>Register</Button>
        </Section>
      )}

    </>
  );
};

export default Register;
