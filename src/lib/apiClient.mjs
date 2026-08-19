/* Every authenticated call goes through here, so token refresh exists in
   exactly one place.

   The API issues a 15-minute access token and a 30-day refresh token, and it
   ROTATES the refresh token on every use: the old one dies the moment it is
   spent. Persisting only the new access token would look fine for fifteen
   minutes and then sign the participant out for no visible reason. */
import {
  API_BASE_URL,
  clearSession,
  getSession,
  saveSession,
} from './session.mjs';

const unauthorized = () => {
  const error = new Error('Session expired');
  error.status = 401;
  return error;
};

const failure = (status) => {
  const error = new Error(`Request failed: ${status}`);
  error.status = status;
  return error;
};

/* One shared in-flight refresh. Without this, two calls that 401 together
   would both refresh, and the second would present a token the first had
   already rotated away. */
let refreshInFlight = null;

/* Test seam: node:test keeps the module between cases, so the in-flight
   promise has to be clearable. */
export const resetRefreshState = () => {
  refreshInFlight = null;
};

const requestRefresh = async (refreshToken) => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) throw unauthorized();
  return response.json();
};

/* Returns the new access token, or null when the session is beyond saving. */
const refreshSession = async () => {
  if (!refreshInFlight) {
    const attempt = (async () => {
      const session = getSession();
      if (!session || !session.refreshToken) return null;

      try {
        const tokens = await requestRefresh(session.refreshToken);
        if (
          !tokens ||
          typeof tokens.accessToken !== 'string' ||
          typeof tokens.refreshToken !== 'string'
        ) {
          // A response missing either token is treated as a failed refresh.
          // In particular, falling back to the old refreshToken here would
          // persist a credential the API has already rotated away.
          return null;
        }

        saveSession({
          accessToken: tokens.accessToken,
          // Both tokens, always — see the note at the top of this file.
          refreshToken: tokens.refreshToken,
          user: session.user,
        });
        return tokens.accessToken;
      } catch (_) {
        return null;
      }
    })();

    refreshInFlight = attempt;

    // Cleared via a queued microtask, never assigned inline: some exit
    // paths above (e.g. "nothing to refresh with") settle `attempt`
    // synchronously, with no `await` in between. Clearing refreshInFlight
    // from inside that same synchronous call would run *before* the
    // `refreshInFlight = attempt` assignment above completes, and get
    // immediately clobbered back to a stale, already-settled promise —
    // wedging refresh "on" forever with nothing left to reset it, even once
    // a good refreshToken is available later. A settlement callback is always
    // scheduled as a job, so it is guaranteed to run after the assignment
    // above, however fast `attempt` settles.
    //
    // then(cleanup, cleanup) rather than finally(cleanup) because the promise
    // either one returns is dropped on the floor. `attempt` cannot reject
    // today — every throwing path sits inside its own try — but `.finally()`
    // re-raises whatever it observes, so the day an edit lets `attempt`
    // reject, that discarded promise becomes an unhandled rejection. The
    // two-argument form absorbs both settlements and leaves nothing to
    // reject, so this is robust by construction rather than by audit.
    const clearInFlight = () => {
      if (refreshInFlight === attempt) refreshInFlight = null;
    };
    attempt.then(clearInFlight, clearInFlight);
  }

  return refreshInFlight;
};

/* How close to expiry a token has to be before it is refreshed up front.
   Thirty seconds comfortably covers clock skew plus the request's own
   travel time; anything healthier is used as-is. */
const REFRESH_SKEW_MS = 30_000;

/* True when the access token is a JWT that is expired or about to be. The
   API's tokens are 15-minute JWTs, so any visit after a break used to go:
   request → 401 → refresh → retry — two wasted serial round trips on
   exactly the return-visit case where /my already feels slowest. Reading
   exp locally moves the refresh in front of the request.

   Reads, never verifies: the signature is the API's business, and the 401
   path in apiFetch remains the authority on whether a session is actually
   dead. Anything unreadable — the mocked build's opaque tokens included —
   is "not expiring", which lands on today's exact behavior. */
export const tokenNeedsRefresh = (accessToken, nowMs = Date.now()) => {
  if (typeof accessToken !== 'string') return false;
  const parts = accessToken.split('.');
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')),
    );
    if (!payload || typeof payload.exp !== 'number') return false;
    return payload.exp * 1000 - nowMs < REFRESH_SKEW_MS;
  } catch (_) {
    return false;
  }
};

const authorizedFetch = (path, options, accessToken) =>
  fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options && options.headers),
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const apiFetch = async (path, options = {}) => {
  const session = getSession();
  if (!session) throw unauthorized();

  let accessToken = session.accessToken;
  if (tokenNeedsRefresh(accessToken)) {
    /* Best-effort: a refresh that fails here falls through to the old
       token, and the 401 path below keeps its role as the one place that
       declares a session dead. refreshSession dedupes concurrent callers,
       so parallel fetches share one rotation. */
    const refreshed = await refreshSession();
    if (refreshed) accessToken = refreshed;
  }

  let response = await authorizedFetch(path, options, accessToken);

  if (response.status === 401) {
    const accessToken = await refreshSession();
    if (!accessToken) {
      clearSession();
      throw unauthorized();
    }

    // Exactly one retry: a second 401 means the session is genuinely dead.
    response = await authorizedFetch(path, options, accessToken);
    if (response.status === 401) {
      clearSession();
      throw unauthorized();
    }
  }

  if (!response.ok) throw failure(response.status);

  return response.json();
};

/* Signing out on purpose, as opposed to a session that died on its own.

   The refresh token is good for thirty days and the API honours it until it
   is revoked, so clearing localStorage alone leaves a live credential behind
   — the shared-machine case: someone signs out, walks away, and their session
   is still reissuable by anyone holding what was in that browser.

   Fire-and-forget, deliberately. The caller clears nothing itself and waits
   for nothing: a participant signing out on a dead connection is still signed
   out locally, immediately, and an API outage cannot delay the redirect by so
   much as a tick. Nothing here is awaited, and nothing can surface to the
   caller — fetch rejects on offline/DNS/CORS, and in an environment without
   it at all the call throws synchronously — because a console error at
   sign-out helps nobody and an unhandled rejection is worse.

   Unauthenticated, mirroring /auth/refresh rather than apiFetch: the endpoint
   takes the refresh token in the body and revokes it, with no bearer header
   and nothing to retry. A failure means the token lives out its thirty days,
   which is exactly where it stood before this call existed. */
export const endSession = () => {
  // Read before the clear below: the token has to come out of storage first.
  const session = getSession();

  if (API_BASE_URL && session && session.refreshToken) {
    try {
      const request = fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
        /* The sign-out navigation follows immediately. Without keepalive the
           browser is free to cancel an in-flight request when the document
           goes away, which is the one request here worth surviving. */
        keepalive: true,
      });

      if (request && typeof request.catch === 'function') {
        request.catch(() => {});
      }
    } catch (_) {
      // Never at the expense of signing out locally.
    }
  }

  clearSession();
};

/* Trading the backend's single-use code for a session. Deliberately does not
   store anything — the callback page owns that decision. */
export const exchangeCode = async (code) => {
  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) throw failure(response.status);

  return response.json();
};
