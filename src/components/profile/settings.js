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

import Button from '../button';
import Loader from '../loader';
import MetadataFields from './metadata-fields';

const Settings = ({ auth, isEdit = false, onSave = undefined }) => {
  // Track the data we need to render
  const [ loaded, setLoaded ] = useState(null);
  const [ emails, setEmails ] = useState([]);
  const [ oauth, setOauth ] = useState([]);
  const [ metadata, setMetadata ] = useState([]);

  // Track the data the user enters
  const [ data, setData ] = useState({
    email: null,
    metadata: {},
  });

  // Handle fetching OAuth accounts
  const fetchOAuth = useCallback(async () => {
    setOauth(await fetchUserOAuth(auth.user.id, auth.token).then(data => data.reduce((obj, item) => ({
      ...obj,
      [item.provider]: item,
    }), {})));
  }, [ auth ]);

  // Handle linking OAuth accounts
  const linkOAuth = useCallback(async provider => {
    // TODO: Error handling?
    const link = await createUserOAuth(auth.user.id, auth.token, provider);
    window.location.href = link.redirect;
  }, [ auth ]);

  // Handle unlinking OAuth accounts
  const unlinkOAuth = useCallback(async provider => {
    // TODO: Error handling?
    await removeUserOAuth(auth.user.id, auth.token, provider);
    await fetchOAuth();
  }, [ auth ]);

  // Load the data we need to render
  useEffect(() => {
    (async () => {
      if (loaded === true || loaded === false) return;
      setLoaded(false);

      // Fetch all emails and default to the user's current email
      setEmails(await fetchUserEmails(auth.user.id, auth.token));
      setData(prev => ({ ...prev, email: auth.user.email }));

      // Fetch the user's linked OAuth accounts
      await fetchOAuth();

      // Fetch all the metadata for the event
      const rawMetadata = await fetchMetadata(auth.token);
      setMetadata(rawMetadata);

      // Group the user's current registration data by name (or use an empty object if not editing)
      const currentMetadata = isEdit ? auth.registration.metadata.reduce((obj, item) => ({
        ...obj,
        [item.metadataId]: item.value,
      }), {}) : {};

      // Store default values for each metadata item, preferring the user's exising value
      setData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          ...rawMetadata.reduce((obj, item) => ({
            ...obj,
            [item.name]: item.datatype === 'boolean'
              ? (currentMetadata[item.id] === 'true')
              : (item.datatype === 'string'
                ? (currentMetadata[item.id] || '')
                : (currentMetadata[item.id] || null)),
          }), {}),
        },
      }));

      // Show the page
      setLoaded(true);
    })();
  }, [ auth, loaded ]);

  // Handle form submission
  const form = useRef();
  const submit = useCallback(async e => {
    e.preventDefault();

    // Check the form is valid, fail if not
    // TODO: Aid the native error reporting?
    if (!form.current?.reportValidity()) return;

    // Update the user email if needed
    // TODO: Error handling?
    if (data.email !== auth.user.email) await updateUser(auth.user.id, auth.token, { email: data.email });

    // Create/update the registration
    // TODO: Error handling?
    const registrationHandler = isEdit ? updateRegistration : createRegistration;
    await registrationHandler(auth.user.id, auth.token, { metadata: data.metadata });

    // Reload the auth user + registration
    // TODO: Error handling?
    if (data.email !== auth.user.email) await auth.getUser();
    await auth.getRegistration();

    // Call the save handler
    if (typeof onSave === 'function') onSave();
  }, [ form, data, auth, isEdit, onSave ]);

  // Don't render anything until we have the data we need
  if (!loaded) return <Loader message={isEdit ? ">> Loading /usr/lib/edit..." : ">> Loading /usr/lib/register..."} />;

  // Render the user's settings
  return (
    <form ref={form} onSubmit={submit}>
      {isEdit && (
        <>
          {oauth.github
            ? (oauth.gitlab && (
              <Button onClick={e => {
                e.preventDefault();
                unlinkOAuth('github').then();
              }}>
                Unlink GitHub account (@{oauth.github.providerUsername})
              </Button>
            )) : (
              <Button onClick={e => {
                e.preventDefault();
                linkOAuth('github').then();
              }}>
                Link GitHub account
              </Button>
            )}
          {oauth.gitlab
            ? (oauth.github && (
              <Button onClick={e => {
                e.preventDefault();
                unlinkOAuth('gitlab').then();
              }}>
                Unlink GitLab account (@{oauth.gitlab.providerUsername})
              </Button>
            )) : (
              <Button onClick={e => {
                e.preventDefault();
                linkOAuth('gitlab').then();
              }}>
                Link GitLab account
              </Button>
            )}
        </>
      )}

      <MetadataFields
        emails={emails}
        metadata={metadata}
        value={data}
        onChange={setData}
        exclude={isEdit ? ["agree"] : []}
      />

      {!isEdit && <Button onClick={e => {
        e.preventDefault();
        auth.reset();
      }}>Logout</Button>}
      <Button onClick={submit}>{isEdit ? "Save" : "Register"}</Button>
    </form>
  );
};

export default Settings;
