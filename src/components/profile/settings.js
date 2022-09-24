import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createRegistration,
  updateRegistration,
  fetchUserOAuth,
  createUserOAuth,
  removeUserOAuth,
  fetchMetadata,
  fetchUserEmails,
  updateUser,
} from 'lib/api';
import { providerMap } from 'lib/config';

import Button from '../button';
import Loader from '../loader';
import MetadataFields from './metadata-fields';

const Settings = ({ auth, isEdit = false }) => {
  const router = useRouter();

  // Track the data we need to render
  const [ loaded, setLoaded ] = useState(null);
  const loading = useRef(false);
  const [ emails, setEmails ] = useState([]);
  const [ oauth, setOauth ] = useState([]);
  const [ metadata, setMetadata ] = useState([]);

  // Track the data the user enters
  const [ data, setData ] = useState({
    email: null,
    metadata: {},
  });

  // Track the state of the form
  const [ submitting, setSubmitting ] = useState(false);
  const [ success, setSuccess ] = useState(false);
  const [ error, setError ] = useState(null);

  // Handle fetching OAuth accounts
  const fetchOAuth = useCallback(async () => {
    setOauth(await fetchUserOAuth(auth.user.id, auth.token).then(data => data.reduce((obj, item) => ({
      ...obj,
      [item.provider]: item,
    }), {})));
  }, [ auth.user?.id, auth.token ]);

  // Handle linking OAuth accounts
  const linkOAuth = useCallback(async (e, provider) => {
    e.preventDefault();

    const link = await createUserOAuth(auth.user.id, auth.token, provider).catch(async err => {
      const data = await err.response.json().catch(() => null);
      console.error(err, data);
      setError(`An unknown error occurred while linking your ${providerMap[provider]} account. Please try again later.`);
    });
    window.location.href = link.redirect;
  }, [ auth.user?.id, auth.token ]);

  // Handle unlinking OAuth accounts
  const unlinkOAuth = useCallback(async (e, provider) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to unlink your ${providerMap[provider]} account from your Hacktoberfest registration?`)) return;

    await removeUserOAuth(auth.user.id, auth.token, provider).catch(async err => {
      const data = await err.response.json().catch(() => null);
      console.error(err, data);
      setError(`An unknown error occurred while unlinking your ${providerMap[provider]} account. Please try again later.`);
    });
    await fetchOAuth();
  }, [ auth.user?.id, auth.token ]);

  // Load the data we need to render
  useEffect(() => {
    if (loaded) return;
    if (loading.current) return;
    loading.current = true;

    (async () => {
      // Fetch all emails and default to the user's current email
      setEmails(await fetchUserEmails(auth.user.id, auth.token));
      setData(prev => ({ ...prev, email: auth.user.email }));

      // Fetch the user's linked OAuth accounts
      await fetchOAuth();

      // Fetch all the metadata for the event
      const rawMetadata = await fetchMetadata(auth.token);
      setMetadata(rawMetadata);

      // Get the user's current metadata (or none if this is registration)
      const currentMetadata = isEdit ? auth.registration.metadata : {};

      // Store default values for each metadata item, preferring the user's exising value
      setData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          ...rawMetadata.reduce((obj, item) => ({
            ...obj,
            [item.name]: item.datatype === 'boolean'
              ? (currentMetadata[item.name]?.value === 'true')
              : (item.datatype === 'string'
                ? (currentMetadata[item.name]?.value || '')
                : (currentMetadata[item.name]?.value || null)),
          }), {}),
        },
      }));

      // Show the page
      setLoaded(true);
    })();
  }, [ loaded, auth.user?.id, auth.user?.email, auth.token, auth.registration?.metadata, fetchOAuth ]);

  // Handle form submission
  const form = useRef();
  const top = useRef();
  const submit = useCallback(async e => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // Check the form is valid, fail if not
    // TODO: Aid the native error reporting?
    if (!form.current?.reportValidity()) return;

    try {
      // Update the user email if needed
      if (data.email !== auth.user.email) await updateUser(auth.user.id, auth.token, { email: data.email });

      // Create/update the registration
      const registrationHandler = isEdit ? updateRegistration : createRegistration;
      await registrationHandler(auth.user.id, auth.token, { metadata: data.metadata });

      // Reload the auth user + registration (silently when editing)
      if (data.email !== auth.user.email) await auth.getUser(isEdit);
      await auth.getRegistration(isEdit);

      // Done
      setSuccess(true);
      top.current?.scrollIntoView();
    } catch (err) {
      // Log any errors
      const data = await err.response.json().catch(() => null);
      console.error(err, data);
      setError('An unknown error occurred while saving your registration. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  }, [ submitting, data, auth, isEdit ]);

  const logout = useCallback(e => {
    e.preventDefault();
    if (submitting) return;
    auth.reset();
  }, [ submitting, auth.reset ]);

  // Don't render anything until we have the data we need
  if (!loaded) return <Loader message={isEdit ? ">> Loading /usr/lib/edit..." : ">> Loading /usr/lib/register..."} />;

  // Render the user's settings
  return (
    <>
      <div ref={top} />

      {success && (
        <>
          <p>[ Success ]</p>
          <p>Your Hacktoberfest registration has been saved.</p>
        </>
      )}

      {error && (
        <>
          <p>[ Error ]</p>
          <p>{error}</p>
        </>
      )}

      {isEdit && (
        <div>
          {oauth.github
            ? (!!oauth.gitlab && router.query.unlink === 'enabled' && (
              <Button onClick={e => unlinkOAuth(e, 'github')}>
                Unlink GitHub account (@{oauth.github.providerUsername})
              </Button>
            )) : (
              <Button onClick={e => linkOAuth(e, 'github')}>
                Link GitHub account
              </Button>
            )}
          {oauth.gitlab
            ? (!!oauth.github && router.query.unlink === 'enabled' && (
              <Button onClick={e => unlinkOAuth(e, 'gitlab')}>
                Unlink GitLab account (@{oauth.gitlab.providerUsername})
              </Button>
            )) : (
              <Button onClick={e => linkOAuth(e, 'gitlab')}>
                Link GitLab account
              </Button>
            )}
        </div>
      )}

      <form ref={form} onSubmit={submit}>
        <MetadataFields
          emails={emails}
          metadata={metadata}
          value={data}
          onChange={setData}
          exclude={isEdit ? ["agree"] : []}
          disabled={submitting}
        />

        {!isEdit && <Button onClick={logout} disabled={submitting}>Logout</Button>}
        <Button onClick={submit} type="submit" disabled={submitting}>{isEdit ? "Save" : "Register"}</Button>
      </form>
    </>
  );
};

export default Settings;
