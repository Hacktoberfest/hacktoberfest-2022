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

import { body20, headline48 } from 'themes/typography';

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
import {
  providerMap,
  registrationStart,
  trackingEndExtended,
} from 'lib/config';

import Form from 'components/form';
import Loader from 'components/loader';
import Section from 'components/Section';
import ButtonMain from 'components/ButtonMain';
import Divider from 'components/Divider';

import MetadataFields from './metadata-fields';
import { StyledSectionSpacing } from 'styles/sharedStyles';

const StyledFormSectionTitle = styled.h2`
  ${headline48};
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 48px;
  justify-content: ${({ $align }) => ($align ? $align : 'flex-start')};
`;

const StyledButtonLink = styled.button`
  ${body20};
  color: ${({ theme }) => theme.colors.black};

  &:hover {
    color: ${({ theme }) => theme.colors.deepPink};

    span {
      text-decoration: none;
    }
  }

  span {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.deepPink};
  }
`;

const Settings = ({ auth, isEdit = false }) => {
  const router = useRouter();

  // Track the data we need to render
  const [loaded, setLoaded] = useState(null);
  const loading = useRef(false);
  const [emails, setEmails] = useState([]);
  const [oauth, setOauth] = useState([]);
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

  // Handle fetching OAuth accounts
  const fetchOAuth = useCallback(async () => {
    setOauth(
      await fetchUserOAuth(auth.user.id, auth.token).then((data) =>
        data.reduce(
          (obj, item) => ({
            ...obj,
            [item.provider]: item,
          }),
          {},
        ),
      ),
    );
  }, [auth.user?.id, auth.token]);

  // Handle linking OAuth accounts
  const linkOAuth = useCallback(
    async (e, provider) => {
      e.preventDefault();
      if (hasTrackingEnded) return;

      const link = await createUserOAuth(
        auth.user.id,
        auth.token,
        provider,
      ).catch(async (err) => {
        const data = await err.response.json().catch(() => null);
        console.error(err, data);
        setError(
          `An unknown error occurred while linking your ${providerMap[provider]} account. Please try again later.`,
        );
      });
      window.location.href = link.redirect;
    },
    [auth.user?.id, auth.token],
  );

  // Handle unlinking OAuth accounts
  const unlinkOAuth = useCallback(
    async (e, provider) => {
      e.preventDefault();
      if (hasTrackingEnded) return;

      if (
        !confirm(
          `Are you sure you want to unlink your ${providerMap[provider]} account from your Hacktoberfest registration?`,
        )
      )
        return;

      await removeUserOAuth(auth.user.id, auth.token, provider).catch(
        async (err) => {
          const data = await err.response.json().catch(() => null);
          console.error(err, data);
          setError(
            `An unknown error occurred while unlinking your ${providerMap[provider]} account. Please try again later.`,
          );
        },
      );
      await fetchOAuth();
    },
    [auth.user?.id, auth.token],
  );

  // Check if we have multiple OAuth accounts linked (unlinking is disabled if not)
  const hasMultipleOAuth = useMemo(
    () => Object.keys(oauth).length > 1,
    [oauth],
  );

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

      // Fetch the user's linked OAuth accounts
      await fetchOAuth();

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
    fetchOAuth,
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
            Hacktoberfest #{new Date(registrationStart).getFullYear() - 2013}{' '}
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
        {isEdit && (
          <>
            <Section>
              <StyledSectionSpacing>
                <StyledFormSectionTitle>Linked accounts</StyledFormSectionTitle>
                <StyledButtonGroup>
                  {Object.keys(providerMap).map((provider) => (
                    <Fragment key={provider}>
                      {oauth[provider] ? (
                        hasMultipleOAuth &&
                        router.query.unlink === 'enabled' ? (
                          <StyledButtonLink
                            onClick={(e) => unlinkOAuth(e, provider)}
                            type="button"
                            disabled={hasTrackingEnded}
                          >
                            Unlink {providerMap[provider]} account:{' '}
                            <span>@{oauth[provider].providerUsername}</span>
                          </StyledButtonLink>
                        ) : (
                          <StyledButtonLink
                            onClick={(e) => e.preventDefault()}
                            type="button"
                            disabled
                          >
                            {providerMap[provider]} linked:{' '}
                            <span>@{oauth[provider].providerUsername}</span>
                          </StyledButtonLink>
                        )
                      ) : (
                        <StyledButtonLink
                          onClick={(e) => linkOAuth(e, provider)}
                          type="button"
                          disabled={hasTrackingEnded}
                        >
                          Link {providerMap[provider]} account
                        </StyledButtonLink>
                      )}
                    </Fragment>
                  ))}
                </StyledButtonGroup>
              </StyledSectionSpacing>
            </Section>

            <Divider type="doubledashed" />
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

        <Section small>
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
                {isEdit ? 'Save' : 'Register'}
              </ButtonMain>
            )}
          </StyledButtonGroup>
        </Section>
      </Form>
    </>
  );
};

export default Settings;
