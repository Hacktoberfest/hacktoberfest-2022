import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchRegistration, fetchUser } from 'lib/api';
import { profileEnd, registrationEnd, registrationStart } from 'lib/config';

const useAuth = (redirect = true) => {
  // Check if auth is active
  const active = useMemo(
    () =>
      new Date() >= new Date(registrationStart) &&
      new Date() < new Date(profileEnd),
    [],
  );

  // Track key data about the user and their registration
  // NOTE: token is now stored as an httpOnly cookie by the server and is not readable from JS.
  // We keep a `token` value (null) for backwards compatibility with components that reference it.
  const token = null;
  const [user, setUser] = useState(null);
  const [registration, setRegistration] = useState(null);

  /**
   * Logic to handle updating our route based on state changes
   */

  // Track what auth state we're in: 'loading', '', 'auth', 'register', 'profile'
  // Values map to expected routes, except loading
  const [state, setState] = useState('loading');

  // Track if we're still loading the state we expect to be in
  const router = useRouter();
  const loading = useMemo(
    () => state === 'loading' || (redirect && router.pathname !== `/${state}`),
    [state, redirect, router.pathname],
  );

  // Ensure we're on the right page that matches the state we're in
  useEffect(() => {
    // If we've not yet established the auth state, wait
    if (state === 'loading') return;

    // If we're on the right page, do nothing
    if (router.pathname === `/${state}`) return;

    // Log the state change
    console.log(`useAuth: switching to ${state}`);

    // If we're not supposed to redirect, do nothing
    if (!redirect) return;

    // Otherwise, redirect to the right page
    router.push(`/${state}`).then();
  }, [state, router.pathname, redirect, router.push]);

  /**
   * Logic to handle updating our state based on loading changes
   */

  // Track what we've loaded via the effect chain
  const [loaded, setLoaded] = useState({
    user: false,
    registration: false,
  });

  // Once we've loaded everything, decide what to do
  useEffect(() => {
    if (!loaded.user) return;
    if (!loaded.registration) return;

    // If we've already loaded everything, do nothing
    if (state !== 'loading') return;

    // If we're not active, go to the homepage
    if (!active) {
      setState('');
      return;
    }

    // If we don't have a user, we need to go to auth
    if (!user) {
      setState('auth');
      return;
    }

    // If we don't have a registration, we need to go to register
    if (!registration) {
      setState('register');
      return;
    }

    // Otherwise, we're good to go to profile
    setState('profile');
  }, [loaded, state, user, registration]);

  /**
   * Logic to handle updating our token based on router changes
   */

  // Allow the auth state to be reset (client-side); server can clear the cookie via a separate endpoint
  const reset = useCallback(() => {
    setState('loading');
    setUser(null);
    setRegistration(null);
  }, []);

  // Fetch the user from the API, identified by their token
  const getUser = useCallback(
    async (silent = false) => {
      if (!silent) {
        setState('loading');
        setLoaded((prev) => ({ ...prev, user: false }));
      }
      console.log('useAuth: user loading');

      // Fetch the user from /users/@me (server will identify the user via cookie)
      setUser(
        await fetchUser('@me').catch((e) => {
          // If we get a 401, the session is not valid
          if (e.status === 401) {
            reset();
            return;
          }

          throw e;
        }),
      );
      setLoaded((prev) => ({ ...prev, user: true }));
    },
    [reset],
  );

  // Whenever the router changes or on mount, attempt to load the user relying on the server-set httpOnly cookie.
  useEffect(() => {
    (async () => {
      // If auth flow isn't active, clear values
      if (!active) {
        setUser(null);
        setLoaded((prev) => ({ ...prev, user: true }));
        return;
      }

      // Clean up token params from URL if present (server should have set the cookie already on redirect)
      const url = new URL(window.location.origin + router.asPath);
      if (url.searchParams.has('token')) {
        url.searchParams.delete('token');
        url.searchParams.delete('expiration');
        router.replace(url.toString()).then();
      }

      // Attempt to fetch the current user (server will validate from httpOnly cookie)
      await getUser();
      console.log('useAuth: user loaded (initial)');
    })();
  }, [router.asPath, router.replace, active, getUser]);

  /**
   * Logic to handle updating our registration based on user changes
   */

  // Fetch the registration from the API
  const getRegistration = useCallback(
    async (silent = false) => {
      if (!silent) {
        setState('loading');
        setLoaded((prev) => ({ ...prev, registration: false }));
      }
      console.log('useAuth: registration loading', user?.id);

      // Fetch the registration from /events/:id/registrations/:id (server uses cookie)
      setRegistration(
        await fetchRegistration(user.id).catch((e) => {
          // If we get a 401, the session is not valid
          if (e.status === 401) {
            reset();
            return null;
          }

          // If we get a 404, the user has no registration
          if (e.status === 404) {
            return null;
          }

          throw e;
        }),
      );
      setLoaded((prev) => ({ ...prev, registration: true }));
    },
    [user?.id, reset],
  );

  // When the user ID changes, fetch the registration
  useEffect(() => {
    (async () => {
      // Wait until we've loaded the user
      if (!loaded.user) return;

      if (user) {
        await getRegistration();
      } else {
        setRegistration(null);
        setLoaded((prev) => ({ ...prev, registration: true }));
      }

      console.log('useAuth: registration loaded');
    })();
  }, [loaded.user, getRegistration, user]);

  // Expose everything
  return {
    loading,
    active,
    state,
    token,
    reset,
    user,
    getUser,
    registration,
    getRegistration,
  };
};

export default useAuth;
