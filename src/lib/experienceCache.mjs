/* The render-while-revalidate seam for /my.

   The last successful experience payload, in sessionStorage: scoped to the
   tab session (closing the browser forgets it), never synced anywhere, and
   cleared by clearSession — so sign-out takes it with the tokens. A return
   visit inside the same tab session paints the hub from this immediately
   while getExperience fetches a fresh copy behind it.

   Keyed to the signed-in user's email so a sign-out/sign-in as somebody
   else on a shared machine can never serve the previous person's hub; the
   age cap is a backstop against a tab that lives for days.

   Live mode only, structurally: in mocked builds every ?scenario= review
   link must keep rendering its own fixture, and serving yesterday's
   scenario from a cache would quietly break exactly the links designers
   and QA rely on. */
import { API_BASE_URL, EXPERIENCE_CACHE_KEY } from './session.mjs';

const MAX_AGE_MS = 60 * 60 * 1000;

/* Same stance as session.mjs: Safari in private mode throws on access. */
const store = () => {
  try {
    return globalThis.sessionStorage || null;
  } catch (_) {
    return null;
  }
};

/* Email, not id: parseSession guarantees a non-empty email on every session
   it returns, while id may be null. */
const userKey = (session) =>
  session && session.user && typeof session.user.email === 'string'
    ? session.user.email
    : null;

export const readCachedExperience = (session) => {
  const storage = store();
  const forUser = userKey(session);
  if (!API_BASE_URL || !storage || !forUser) return null;

  try {
    const parsed = JSON.parse(storage.getItem(EXPERIENCE_CACHE_KEY));
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.forUser !== forUser) return null;
    if (typeof parsed.at !== 'number' || Date.now() - parsed.at > MAX_AGE_MS) {
      return null;
    }
    if (!parsed.value || typeof parsed.value !== 'object') return null;
    return parsed.value;
  } catch (_) {
    return null;
  }
};

export const writeCachedExperience = (session, experience) => {
  const storage = store();
  const forUser = userKey(session);
  if (!API_BASE_URL || !storage || !forUser) return;

  try {
    storage.setItem(
      EXPERIENCE_CACHE_KEY,
      JSON.stringify({ forUser, at: Date.now(), value: experience }),
    );
  } catch (_) {
    // A storage that refuses the write just means the next visit loads cold.
  }
};
