/* The auth seam.

   This repo is a static export, so it cannot run passport-mlh-oauth2: that is
   Express middleware needing a clientSecret and server sessions. The secret
   lives on the backend. This module's whole job is to hand off to whatever
   owns it and to read back the session that comes home.

   The backend redirects to /auth/callback/?code=... after MyMLH; that page
   exchanges the code for the session stored here. */

export const SESSION_STORAGE_KEY = 'hacktoberfest.session';
export const RETURN_TO_STORAGE_KEY = 'hacktoberfest.returnTo';
/* The /my render-while-revalidate cache (lib/experienceCache.mjs). Owned
   here rather than there so clearSession below can clear it without
   importing that module — which imports this one. */
export const EXPERIENCE_CACHE_KEY = 'hacktoberfest.experience';

const DEFAULT_RETURN_TO = '/my/';

/* NEXT_PUBLIC_ prefix required: next.config.js cannot be touched, and Next
   only inlines process.env.NEXT_PUBLIC_* references into the client bundle
   automatically, with no EnvironmentPlugin entry needed. */
const AUTH_START_URL = process.env.NEXT_PUBLIC_AUTH_START_URL || '';
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || ''
).replace(/\/*$/, '');

/* Safari in private mode throws on storage access rather than returning
   null, so every touch goes through here. A browser that will not give us
   storage is treated as signed out: worst case the participant signs in
   again, never a white screen. */
const storage = () => {
  try {
    return globalThis.localStorage || null;
  } catch (_) {
    return null;
  }
};

const sessionStore = () => {
  try {
    return globalThis.sessionStorage || null;
  } catch (_) {
    return null;
  }
};

const str = (value) => (typeof value === 'string' ? value : null);

/* `options.requireRefreshToken` is the write side's extra demand, and the
   asymmetry is deliberate.

   Reading, a session with no refreshToken is simply one near the end of its
   life: apiFetch and refreshSession both cope, and refusing it here would sign
   somebody out who is still perfectly able to browse for the next fifteen
   minutes. Storing one is a different act. The API rotates refresh tokens on
   every use, so a session saved without one works until the access token
   expires and then dies with nothing to explain it — refreshSession returns
   null, apiFetch clears the session, /my bounces to /login/. That is exactly
   the failure the note at the top of lib/apiClient.mjs warns about, and
   refreshSession already validates both tokens strictly; without this the
   guard that decides what gets written was the weaker of the two. */
export const parseSession = (raw, options) => {
  if (typeof raw !== 'string' || raw.length === 0) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    const accessToken = str(parsed.accessToken);
    if (!accessToken) return null;

    const user = parsed.user;
    if (!user || typeof user !== 'object' || Array.isArray(user)) return null;

    const email = str(user.email);
    if (!email) return null;

    const refreshToken = str(parsed.refreshToken);
    if (options && options.requireRefreshToken && !refreshToken) return null;

    return {
      accessToken,
      refreshToken,
      user: {
        id: str(user.id),
        email,
        firstName: str(user.firstName),
        lastName: str(user.lastName),
      },
    };
  } catch (_) {
    return null;
  }
};

/* Why parseSession returning null is not one story.

   MyMLH lets people withhold their email address, so /auth/token can answer
   200 with a perfectly well-formed session whose user.email is null.
   parseSession rejects it, correctly — /my cannot use it — but "we could not
   read that response" and "your MyMLH account has no email on it" need
   opposite words and opposite next steps, and the second one is the only
   failure on this page that restarting the sign-in cannot fix.

   Deliberately requires an accessToken and a user object: those are what
   prove the exchange itself succeeded. A response missing them is malformed,
   and blaming a withheld email for it would be a guess. */
export const isMissingEmailOnly = (session) => {
  if (!session || typeof session !== 'object' || Array.isArray(session)) {
    return false;
  }
  if (!str(session.accessToken)) return false;

  const user = session.user;
  if (!user || typeof user !== 'object' || Array.isArray(user)) return false;

  /* Absent or empty, and nothing else. `!str(user.email)` was true for any
     non-string — 12345, { primary: … }, ['a@b.c'] — so a change to the API's
     contract would tell the participant MyMLH shared no address and send them
     to add one they already have. That is a wrong story with a CTA attached.
     A field that is present but the wrong shape is a response we do not
     understand, which is what `failed` is for. */
  return user.email === null || user.email === undefined || user.email === '';
};

export const getSession = () => {
  const store = storage();
  if (!store) return null;

  try {
    return parseSession(store.getItem(SESSION_STORAGE_KEY));
  } catch (_) {
    return null;
  }
};

export const saveSession = (session) => {
  const store = storage();
  if (!store) return;

  try {
    store.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (_) {
    // A storage we cannot write leaves the participant signed out, which the
    // next getSession will discover. Nothing useful to do here.
  }
};

/* Local only, and that is the whole of it. A participant pressing "sign out"
   wants the thirty-day refresh token revoked server-side too, which needs the
   API: that is endSession in lib/apiClient.mjs, and it calls this. Reach for
   this one directly only where there is nothing left to revoke — apiFetch
   after a refresh the API has already rejected. */
export const clearSession = () => {
  /* The cached hub payload is personalized data keyed to this session;
     signing out must take it with the tokens. sessionStorage, not the
     localStorage the session itself lives in — see lib/experienceCache.mjs
     for why it lives there. */
  const cacheStore = sessionStore();
  if (cacheStore) {
    try {
      cacheStore.removeItem(EXPERIENCE_CACHE_KEY);
    } catch (_) {
      // Same stance as below: a storage we cannot touch has nothing to keep.
    }
  }

  const store = storage();
  if (!store) return;

  try {
    store.removeItem(SESSION_STORAGE_KEY);
  } catch (_) {
    // Nothing to do: a storage we cannot write is already "signed out".
  }
};

/* The greeting and the account strip both want one string; the API gives us
   two fields. Empty when there is no name at all, which WelcomeBand already
   falls back on. */
export const displayName = (user) => {
  if (!user || typeof user !== 'object') return '';
  const first = str(user.firstName) || '';
  const last = str(user.lastName) || '';
  return `${first} ${last}`.trim();
};

/* A leading "/" alone is not enough to prove a same-origin path. Blacklisting
   specific bytes (e.g. rejecting "/" or "\" as the second character) is
   whack-a-mole: the WHATWG URL parser that location.assign() actually uses
   strips ASCII tab/newline/CR before resolving, so "/\t/evil.example" slips
   past a character blacklist -- once the tab is stripped it is "//evil.example",
   protocol-relative, and off-origin. Instead of guessing at every normalization
   rule, resolve the value with the same parser against a throwaway base and
   check that the resulting origin didn't move -- anything that escapes it,
   by any mechanism, is rejected. */
const isSafeReturnTo = (value) => {
  if (typeof value !== 'string' || !value.startsWith('/')) return false;

  try {
    const base = 'https://return-to-check.invalid';
    return new URL(value, base).origin === base;
  } catch (_) {
    return false;
  }
};

/* Reads the stashed destination and clears it in one go: it is only ever
   meaningful once, for the login currently in flight. */
export const takeReturnTo = () => {
  const store = sessionStore();
  if (!store) return DEFAULT_RETURN_TO;

  try {
    const value = store.getItem(RETURN_TO_STORAGE_KEY);
    store.removeItem(RETURN_TO_STORAGE_KEY);
    return isSafeReturnTo(value) ? value : DEFAULT_RETURN_TO;
  } catch (_) {
    return DEFAULT_RETURN_TO;
  }
};

/* Mocked sign-in only. Never reachable once API_BASE_URL is set. */
const MOCK_SESSION = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: {
    id: 'mock-user',
    email: 'ada@example.invalid',
    firstName: 'Ada',
    lastName: 'Lovelace',
  },
};

export const startLogin = (returnTo = DEFAULT_RETURN_TO) => {
  if (API_BASE_URL) {
    /* The API ignores query parameters and always redirects to
       {FRONTEND_URL}/auth/callback, so the destination is ours to remember. */
    const store = sessionStore();
    if (store) {
      try {
        store.setItem(RETURN_TO_STORAGE_KEY, returnTo);
      } catch (_) {
        // takeReturnTo falls back to /my/, which is where we were going anyway.
      }
    }

    globalThis.location.assign(AUTH_START_URL || `${API_BASE_URL}/oauth/mlh`);
    return;
  }

  const store = storage();
  if (store) {
    try {
      store.setItem(SESSION_STORAGE_KEY, JSON.stringify(MOCK_SESSION));
    } catch (_) {
      // Storage refused us; the redirect below will bounce back to /login/.
    }
  }

  /* Same check the real branch gets, just applied here instead of in
     takeReturnTo: this path never round-trips through storage, so nothing
     else would sanitise it. Today's only caller passes the literal '/my/',
     but an asymmetry between the two branches is exactly the kind of thing
     the next caller walks into. */
  globalThis.location.assign(
    isSafeReturnTo(returnTo) ? returnTo : DEFAULT_RETURN_TO,
  );
};

/* MyMLH's own sign-out, and the mirror of startLogin above.

   Revoking our refresh token (endSession, lib/apiClient.mjs) ends our half of
   the session but leaves MLH's cookie on www.mlh.com untouched -- so the next
   sign-in completes without ever showing a form, which on a shared machine
   means the next person lands in the previous participant's account. Only a
   first-party navigation to MLH can clear that, so sign-out ends there rather
   than here: /signout ignores return_to and redirect_uri and always lands on
   mlh.com/signin. Confirmed against every other spelling -- /logout,
   /sign_out, /users/sign_out, /oauth/logout -- all of which 404.

   Untagged, and not in data/links.js with the other MLH URLs: those are links
   a participant chooses to follow, where the campaign parameters mean
   something. This is an auth endpoint, and it belongs beside the two already
   in this file.

   Mock mode goes to '/' instead. Mocked startLogin writes MOCK_SESSION and
   returns, so a mocked sign-out that went anywhere near /login/ would be
   signed straight back in -- and sending it to mlh.com would throw a
   developer out of their own dev server. */
const MLH_SIGNOUT_URL = 'https://www.mlh.com/signout';

export const signOutDestination = () => (API_BASE_URL ? MLH_SIGNOUT_URL : '/');
