import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchMetadata, fetchUserEmails, updateRegistration, updateUser } from 'lib/api';

import Button from '../button';
import Loader from '../loader';
import MetadataFields from './metadata-fields';

const Edit = ({ auth, onSave }) => {
  // Track the data we need to render
  const [ loaded, setLoaded ] = useState(null);
  const [ emails, setEmails ] = useState([]);
  const [ metadata, setMetadata ] = useState([]);

  // Track the data the user enters
  const [ data, setData ] = useState({
    email: null,
    metadata: {},
  });

  // Load the data we need to render
  useEffect(() => {
    (async () => {
      if (loaded === true || loaded === false) return;
      setLoaded(false);

      // Fetch all emails and default to the user's current email
      setEmails(await fetchUserEmails(auth.user.id, auth.token));
      setData(prev => ({ ...prev, email: auth.user.email }));

      // Fetch all the metadata for the event
      const rawMetadata = await fetchMetadata(auth.token);
      setMetadata(rawMetadata);

      // Group the user's current registration data by name
      const currentMetadata = auth.registration.metadata.reduce((obj, item) => ({
        ...obj,
        [item.metadataId]: item.value,
      }), {});

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

    // Create the registration
    // TODO: Error handling?
    await updateRegistration(auth.user.id, auth.token, { metadata: data.metadata });

    // Reload the auth user + registration
    // TODO: Error handling?
    if (data.email !== auth.user.email) await auth.getUser();
    await auth.getRegistration();

    onSave();
  }, [ form, data, auth?.user?.email, onSave ]);

  // Don't render anything until we have the data we need
  if (!loaded) return <Loader message=">> Loading /usr/lib/edit..." />;

  // Render the user's settings
  return (
    <form ref={form} onSubmit={submit}>
      <MetadataFields emails={emails} metadata={metadata} value={data} onChange={setData} exclude={["agree"]} />

      <Button onClick={submit}>Save</Button>
    </form>
  );
};

export default Edit;
