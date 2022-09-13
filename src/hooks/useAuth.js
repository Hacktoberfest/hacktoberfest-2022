import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

const useAuth = () => {
  // Track key data about the user and their registration
  const [ token, setToken ] = useState(null);
  const [ user, setUser ] = useState(null);
  const [ registration, setRegistration ] = useState(null);

  /**
   * Logic to handle updating our route based on state changes
   */

  // Track what auth state we're in: loading, auth, register, profile
  // Values map to expected routes, except loading
  const [ state, setState ] = useState('loading');

  // Track if we're still loading the state we expect to be in
  const router = useRouter();
  const loading = useMemo(() => state === 'loading' || router.pathname !== `/${state}`, [ state, router.pathname ]);

  // Ensure we're on the right page that matches the state we're in
  useEffect(() => {
    // If we've not yet established the auth state, wait
    if (state === 'loading') return;

    // If we're on the right page, do nothing
    if (router.pathname === `/${state}`) return;

    // Otherwise, redirect to the right page
    console.log(`useAuth: switching to ${state}`);
    router.push(`/${state}`).then();
  }, [ state, router ]);

  /**
   * Logic to handle updating our state based on loading changes
   */

  // Track what we've loaded via the effect chain
  const [ loaded, setLoaded ] = useState({
    token: false,
    user: false,
    registration: false,
  });

  // Once we've loaded everything, decide what to do
  useEffect(() => {
    if (!loaded.token) return;
    if (!loaded.user) return;
    if (!loaded.registration) return;

    // If we've already loaded everything, do nothing
    if (state !== 'loading') return;

    // If we don't have a token or a user, we need to go to auth
    if (!token || !user) {
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
  }, [ loaded, state, token, user, registration ]);

  /**
   * Logic to handle updating our token based on router changes
   */

  // Gwt our token from the URL, or from local storage
  const getToken = useCallback(() => {
    // If JWT in query params, use it and remove it
    const url = new URL(window.location.origin + router.asPath);
    if (url.searchParams.has('token')) {
      const param = url.searchParams.get('token');
      url.searchParams.delete('token');
      url.searchParams.delete('expiration');
      router.replace(url.toString()).then();
      return param;
    }

    // If token in local storage, use it
    const storage = localStorage.getItem('token');
    if (storage) return storage;

    // No token
    return null;
  }, [ router ]);

  // Whenever the router changes, check for a JWT
  useEffect(() => {
    // Load the token from the URL or local storage
    setToken(getToken());

    // Track that we've attempted to load the token
    setLoaded(prev => ({ ...prev, token: true }));
    console.log('useAuth: token loaded');
  }, [ getToken ]);

  // Whenever the token changes, store it
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    if (!token && loaded.token) localStorage.removeItem('token');
  }, [ token, loaded.token ]);

  /**
   * Logic to handle updating our user based on token changes
   */

  // Fetch the user from the API, identified by their token
  const fetchUser = useCallback(async () => {
    // TODO: Fetch the user from /users/@me
    // TODO: Handle an invalid token
    console.log('useAuth: user loading', token);

    setUser(null);
  }, [ token ]);

  // When the token changes, fetch the user
  useEffect(() => {
    (async () => {
      // Wait until we've loaded the token
      if (!loaded.token) return;

      // Only fetch the user if we have a token
      if (token) {
        await fetchUser();
      } else {
        setUser(null);
      }

      // Track that we've attempted to load the user
      setLoaded(prev => ({ ...prev, user: true }));
      console.log('useAuth: user loaded');
    })();
  }, [ loaded.token, fetchUser ]);

  /**
   * Logic to handle updating our registration based on user changes
   */

  // Fetch the registration from the API
  const fetchRegistration = useCallback(async () => {
    // TODO: Fetch the registration from /events/:id/registrations/:id
    console.log('useAuth: registration loading', token);

    setRegistration(null);
  }, [ token, user?.id ]);

  // When the user ID changes, fetch the registration
  useEffect(() => {
    (async () => {
      // Wait until we've loaded the user
      if (!loaded.user) return;

      // Only fetch the registration if we have a user
      if (user) {
        await fetchRegistration();
      } else {
        setRegistration(null);
      }

      // Track that we've attempted to load the registration
      setLoaded(prev => ({ ...prev, registration: true }));
      console.log('useAuth: registration loaded');
    })();
  }, [ loaded.user, fetchRegistration ]);

  // Expose everything
  return {
    loading,
    token,
    user,
    fetchUser,
    registration,
    fetchRegistration,
  };
};

export default useAuth;
