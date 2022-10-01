import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

import Button, { StyledButtonGroup } from 'components/button';
import Form from 'components/form';
import Loader from 'components/loader';
import Section from 'components/section';

import MetadataFields from './metadata-fields';

const Settings = ({ auth, isEdit = false }) => {
  const router = useRouter();

  // Track the data we need to render
  const [loaded, setLoaded] = useState(null);
  const loading = useRef(false);
  const [emails, setEmails] = useState([]);
  const [oauth, setOauth] = useState([]);
  const [metadata, setMetadata] = useState([]);

  // Track the data the user enters
  const [data, setData] = useState({
    email: null,
    metadata: {},
  });

  // Track the state of the form
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Handle fetching OAuth accounts
  const fetchOAuth = useCallback(async () => {
    setOauth(
      await fetchUserOAuth(auth.user.id, auth.token).then((data) =>
        data.reduce(
          (obj, item) => ({
            ...obj,
            [item.provider]: item,
          }),
          {}
        )
      )
    );
  }, [auth.user?.id, auth.token]);

  // Handle linking OAuth accounts
  const linkOAuth = useCallback(
    async (e, provider) => {
      e.preventDefault();

      const link = await createUserOAuth(
        auth.user.id,
        auth.token,
        provider
      ).catch(async (err) => {
        const data = await err.response.json().catch(() => null);
        console.error(err, data);
        setError(
          `An unknown error occurred while linking your ${providerMap[provider]} account. Please try again later.`
        );
      });
      window.location.href = link.redirect;
    },
    [auth.user?.id, auth.token]
  );

  // Handle unlinking OAuth accounts
  const unlinkOAuth = useCallback(
    async (e, provider) => {
      e.preventDefault();
      if (
        !confirm(
          `Are you sure you want to unlink your ${providerMap[provider]} account from your Hacktoberfest registration?`
        )
      )
        return;

      await removeUserOAuth(auth.user.id, auth.token, provider).catch(
        async (err) => {
          const data = await err.response.json().catch(() => null);
          console.error(err, data);
          setError(
            `An unknown error occurred while unlinking your ${providerMap[provider]} account. Please try again later.`
          );
        }
      );
      await fetchOAuth();
    },
    [auth.user?.id, auth.token]
  );

  // Check if we have multiple OAuth accounts linked (unlinking is disabled if not)
  const hasMultipleOAuth = useMemo(() => Object.keys(oauth).length > 1, [oauth]);

  // Load the data we need to render
  useEffect(() => {
    if (loaded) return;
    if (loading.current) return;
    loading.current = true;

    (async () => {
      // Fetch all emails and
      try {
        setEmails(await fetchUserEmails(auth.user.id, auth.token));
      } catch (err) {
        const data = await err.response.json().catch(() => null);
        console.error(err, data);

        // If emails fail to load, show an error and stop early
        setError(
          'An error occurred while fetching your email addresses. If you previously participated in Hacktoberfest with both GitHub and GitLab linked, try authenticating again with the other.'
        );
        setLoaded(true);
        setSubmitting(true); // Disable everything
        return;
      }

      // Default to the user's current name/email
      setData((prev) => ({ ...prev, name: auth.user.name, email: auth.user.email }));

      // Fetch the user's linked OAuth accounts
      await fetchOAuth();

      // Fetch all the metadata for the event
      const rawMetadata = await fetchMetadata(auth.token);
      setMetadata(rawMetadata);

      // Get the user's current metadata (or none if this is registration)
      const currentMetadata = isEdit ? auth.registration.metadata : {};

      // Store default values for each metadata item, preferring the user's exising value
      setData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          ...rawMetadata.reduce(
            (obj, item) => ({
              ...obj,
              [item.name]:
                item.datatype === 'boolean'
                  ? currentMetadata[item.name]?.value === 'true'
                  : item.datatype === 'string'
                  ? currentMetadata[item.name]?.value || ''
                  : currentMetadata[item.name]?.value || null,
            }),
            {}
          ),
        },
      }));

      // Show the page
      setLoaded(true);
    })();
  }, [
    loaded,
    auth.user?.id,
    auth.user?.name,
    auth.user?.email,
    auth.token,
    auth.registration?.metadata,
    fetchOAuth,
  ]);

  // Handle form submission
  const form = useRef();
  const top = useRef();
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

      try {
        // Update the user name/email if needed
        const userChanged = data.name !== auth.user.name || data.email !== auth.user.email;
        if (userChanged)
          await updateUser(auth.user.id, auth.token, { name: data.name, email: data.email });

        // Create/update the registration
        const registrationHandler = isEdit
          ? updateRegistration
          : createRegistration;
        await registrationHandler(auth.user.id, auth.token, {
          metadata: data.metadata,
        });

        // Reload the auth user + registration (silently when editing)
        if (userChanged) await auth.getUser(isEdit);
        await auth.getRegistration(isEdit);

        // Done
        setSuccess(true);
      } catch (err) {
        const data = await err.response.json().catch(() => null);
        console.error(err, data);

        // Handle known errors we can show the user
        if (
          data?.code === 'InvalidArgument' &&
          data?.message === 'User is excluded from registering for given event'
        ) {
          setError(
            `Sorry, you've been disqualified from Hacktoberfest and cannot register.`
          );
          return;
        }
        if (
          data?.code === 'InvalidArgument' &&
          data?.message === 'User has previously registered for given event'
        ) {
          setError(
            `Sorry, you've already registered for this event before and cannot register again.`
          );
          return;
        }

        // Handle unknown errors
        setError(
          'An unknown error occurred while saving your registration. Please try again later.'
        );
      } finally {
        setSubmitting(false);
        top.current?.scrollIntoView();
      }
    },
    [submitting, data, auth, isEdit]
  );

  const logout = useCallback(
    (e) => {
      e.preventDefault();
      auth.reset();
    },
    [auth.reset]
  );

  // Don't render anything until we have the data we need
  if (!loaded)
    return (
      <Section>
        <Loader
          message={
            isEdit
              ? '>> Loading /usr/lib/edit...'
              : '>> Loading /usr/lib/register...'
          }
        />
      </Section>
    );

  // Render the user's settings
  return (
    <Section>
      <div ref={top} />

      <Form
        ref={form}
        onSubmit={submit}
        success={success && 'Your Hacktoberfest registration has been saved.'}
        error={error}
      >
        {isEdit && (
          <fieldset>
            <StyledButtonGroup>
              {Object.keys(providerMap).map((provider) => (
                <Fragment key={provider}>
                  {oauth[provider] ? (
                    hasMultipleOAuth && router.query.unlink === 'enabled' ? (
                      <Button onClick={(e) => unlinkOAuth(e, provider)} type="button">
                        Unlink {providerMap[provider]} account (@{oauth[provider].providerUsername})
                      </Button>
                    ) : (
                      <Button onClick={(e) => e.preventDefault()} type="button" disabled>
                        {providerMap[provider]} linked (@{oauth[provider].providerUsername})
                      </Button>
                    )
                  ) : (
                    <Button onClick={(e) => linkOAuth(e, provider)} type="button">
                      Link {providerMap[provider]} account
                    </Button>
                  )}
                </Fragment>
              ))}
            </StyledButtonGroup>
          </fieldset>
        )}

        <MetadataFields
          emails={emails}
          metadata={metadata}
          value={data}
          onChange={setData}
          exclude={isEdit ? ['agree'] : []}
          disabled={submitting}
        />

        <StyledButtonGroup>
          {!isEdit && (
            <Button onClick={logout}>
              Logout
            </Button>
          )}
          {!!metadata.length && (
            <Button onClick={submit} type="submit" disabled={submitting}>
              {isEdit ? 'Save' : 'Register'}
            </Button>
          )}
        </StyledButtonGroup>
      </Form>
    </Section>
  );
};

export default Settings;
