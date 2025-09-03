import { useRouter } from 'next/router';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { breakpoints, determineMediaQuery as mQ } from 'themes/breakpoints';

import { textXl } from 'themes/typography';

import {
  createRegistration,
  updateRegistration,
  fetchUserEmails,
  updateUser,
} from 'lib/api';
import {
  currentHacktoberfest,
  providerMap,
  registrationStart,
  trackingEndExtended,
} from 'lib/config';

import Form from 'components/form';
import Loader from 'components/loader';
import Section from 'components/Section';
import ButtonMain from 'components/ButtonMain';

import MetadataFields from './metadata-fields';
import Layout from '../Layout';
import Divider from '../Divider';
import LinkedAccounts from './linked-accounts';

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 32px;
  justify-content: flex-start;
  margin-bottom: 64px;

  ${mQ(breakpoints.desktop)} {
    justify-content: center;
    margin-bottom: 128px;
  }
`;

const StyledFullDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
  grid-column: full-start / full-end;
  width: 100%;
`;

const Settings = ({ auth, isEdit = false }) => {
  // Track the data we need to render
  const [loaded, setLoaded] = useState(null);
  const loading = useRef(false);
  const [emails, setEmails] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const hasTrackingEnded = useMemo(
    () => new Date() >= new Date(trackingEndExtended),
    [],
  );

  // Track the data the user enters
  const [data, setData] = useState({
    email: null,
    metadata: {},
  });

  // Track the state of the form
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Load the data we need to render
  useEffect(() => {
    if (loaded) return;
    if (loading.current) return;
    loading.current = true;

    (async () => {
      // Fetch all emails and
      let currentEmails;
      try {
        currentEmails = await fetchUserEmails(auth.user.id, auth.token);
        setEmails(currentEmails);
      } catch (err) {
        const data = await err.response.json().catch(() => null);
        console.error(err, data);

        // Handle known errors we can show the user
        if (
          data?.code === 'NotFound' &&
          data?.message === 'Could not locate any verified emails for user'
        ) {
          setError(
            'No verified emails could be located. Please ensure you have a verified email on your GitHub/GitLab account.',
          );
          return;
        }

        // If emails fail to load, show an error and stop early
        setError(
          'An error occurred while fetching your email addresses. If you previously participated in Hacktoberfest with both GitHub and GitLab linked, try authenticating again with the other.',
        );
        setLoaded(true);
        setSubmitting(true); // Disable everything
        return;
      }

      // Default to the user's current name/email
      setData((prev) => ({
        ...prev,
        name: auth.user.name,
        email: currentEmails.includes(auth.user.email)
          ? auth.user.email
          : currentEmails[0],
      }));

      // Fetch all the metadata for the event
      const rawMetadata = await fetchMetadata(auth.token);
      setMetadata(rawMetadata);

      // Get the user's current metadata (or none if this is registration)
      const currentMetadata = isEdit ? auth.registration.metadata : {};

      // Store default values for each metadata item, preferring the user's existing value
      setData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          ...rawMetadata.reduce(
            (obj, item) => ({
              ...obj,
              [item.name]:
                !item.required &&
                (currentMetadata[item.name]?.value === undefined ||
                  currentMetadata[item.name]?.value === null)
                  ? null
                  : item.datatype === 'boolean'
                    ? currentMetadata[item.name]?.value === 'true'
                    : item.datatype === 'string'
                      ? currentMetadata[item.name]?.value || ''
                      : currentMetadata[item.name]?.value || null,
            }),
            {},
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
  ]);

  // Handle form submission
  const form = useRef();
  const top = useRef();
  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (hasTrackingEnded || submitting) return;

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
        const userChanged =
          data.name !== auth.user.name || data.email !== auth.user.email;
        if (userChanged)
          await updateUser(auth.user.id, auth.token, {
            name: data.name,
            email: data.email,
          });

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
            `Sorry, you've been disqualified from Hacktoberfest and cannot register.`,
          );
          return;
        }
        if (
          data?.code === 'InvalidArgument' &&
          data?.message === 'User has previously registered for given event'
        ) {
          setError(
            `Sorry, you've already registered for this event before and cannot register again.`,
          );
          return;
        }

        // Handle unknown errors
        setError(
          'An unknown error occurred while saving your registration. Please try again later.',
        );
      } finally {
        setSubmitting(false);
        top.current?.scrollIntoView();
      }
    },
    [submitting, data, auth, isEdit],
  );

  const logout = useCallback(
    (e) => {
      e.preventDefault();
      auth.reset();
    },
    [auth.reset],
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
    <>
      <div ref={top} />

      {hasTrackingEnded && (
        <>
          <p>
            It is no longer possible to edit your profile for this year, as
            Hacktoberfest #{currentHacktoberfest}{' '}
            {new Date(registrationStart).getFullYear()} has now ended.
          </p>
          <br />
          <hr />
          <br />
        </>
      )}

      <Form
        ref={form}
        onSubmit={submit}
        success={success && 'Your Hacktoberfest registration has been saved.'}
        error={error}
      >
        <Layout>
          {isEdit && (
            <>
              <Section size="sm">
                <LinkedAccounts auth={auth} setError={setError} isEdit />
              </Section>
              <StyledFullDivider />
            </>
          )}

          <MetadataFields
            emails={emails}
            metadata={metadata}
            value={data}
            onChange={setData}
            exclude={isEdit ? ['agree'] : []}
            disabled={hasTrackingEnded || submitting}
          />

          <StyledButtonGroup $align="center">
            {!isEdit && (
              <ButtonMain size="lg" as="button" onClick={logout}>
                Logout
              </ButtonMain>
            )}
            {!!metadata.length && (
              <ButtonMain
                size="lg"
                as="button"
                type="submit"
                disabled={hasTrackingEnded || submitting}
                onClick={submit}
              >
                {isEdit ? 'Save Changes' : 'Register'}
              </ButtonMain>
            )}
          </StyledButtonGroup>

          <StyledFullDivider />
        </Layout>
      </Form>
    </>
  );
};

export default Settings;
