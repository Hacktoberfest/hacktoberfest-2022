import assert from 'node:assert/strict';
import test from 'node:test';

import {
  callbackStateForSession,
  pageStateForError,
} from '../src/lib/pageState.mjs';

/* The branch /my takes when its fetch rejects. Every case here was previously
   reachable only by rendering the page, which this repo cannot do — see the
   note at the top of src/lib/pageState.mjs. */

test('a 401 signs the participant out rather than showing an error', () => {
  assert.equal(pageStateForError({ status: 401 }), 'signedOut');
});

test('a 502 replaces the hub with the MLH outage surface', () => {
  assert.equal(pageStateForError({ status: 502 }), 'mlhDown');
});

/* Only 502 means "MLH is unreachable". A 500 is our own server falling over
   and a 4xx is our own request being wrong; neither is an MLH outage, and
   claiming otherwise would tell the participant something false. */
test('every other status falls through to the generic error surface', () => {
  [400, 403, 404, 429, 500, 503].forEach((status) =>
    assert.equal(
      pageStateForError({ status }),
      'error',
      `status ${status} should not have its own surface`,
    ),
  );
});

/* fetch reports offline, DNS and CORS failures as a bare TypeError with no
   status at all, and a cancelled promise can reject with nothing. Reading
   .status off either must not throw.

   The '502' string is the case the lookup's typeof check exists for: property
   keys are strings, so a table indexed by a string status would answer
   'mlhDown' and put a full-page claim about MLH in front of someone on the
   strength of a response shape we do not recognise. */
test('an error with no usable status is the generic error surface', () => {
  assert.equal(pageStateForError(undefined), 'error');
  assert.equal(pageStateForError(null), 'error');
  assert.equal(pageStateForError(new TypeError('Failed to fetch')), 'error');
  assert.equal(pageStateForError({ status: '502' }), 'error');
});

/* The scenario the ordering exists for: the session expired *during* an MLH
   outage. The API answers with one status, so this is what it looks like in
   the wild — a 401 with the outage visible only in the body. It must sign the
   participant out, because that is the screen they can act on. */
test('a 401 raised during an MLH outage still signs out', () => {
  assert.equal(
    pageStateForError({ status: 401, code: 'MLH_UNAVAILABLE' }),
    'signedOut',
  );
});

/* The branch /auth/callback/ takes when the exchange returned 200 but the
   response cannot be stored as a session. */

const SESSION = {
  accessToken: 'access',
  refreshToken: 'refresh',
  user: { id: '1', email: 'ada@example.invalid' },
};

test('a withheld MyMLH email gets its own screen, not the expired-link one', () => {
  assert.equal(
    callbackStateForSession({ ...SESSION, user: { id: '1', email: null } }),
    'noEmail',
  );
});

/* The whole reason this function exists. A 200 carrying a valid email but no
   refreshToken is rejected on the write side (requireRefreshToken), and
   before this it fell through to 'failed' — "that sign-in link has expired,
   start again" — whose CTA restarts the sign-in, returns the same response,
   and lands here again with nothing changed. Nothing expired and nothing
   about the link is wrong, so 'unavailable' is both the true story and the
   one whose retry is capable of working. */
test('a session that is only missing its refreshToken is unavailable, not failed', () => {
  const { refreshToken: _dropped, ...noRefresh } = SESSION;

  assert.equal(callbackStateForSession(noRefresh), 'unavailable');
  assert.equal(
    callbackStateForSession({ ...SESSION, refreshToken: null }),
    'unavailable',
  );
  assert.equal(
    callbackStateForSession({ ...SESSION, refreshToken: 12345 }),
    'unavailable',
  );
});

/* A response missing the accessToken or the user object never proved the
   exchange succeeded at all. Blaming a withheld email, or telling someone the
   server is unreachable when it answered 200, would both be guesses. */
test('a malformed response is still the expired-link screen', () => {
  const { accessToken: _dropped, ...noToken } = SESSION;

  assert.equal(callbackStateForSession(noToken), 'failed');
  assert.equal(callbackStateForSession({ accessToken: 'access' }), 'failed');
  assert.equal(callbackStateForSession(undefined), 'failed');
  assert.equal(callbackStateForSession(null), 'failed');
  assert.equal(callbackStateForSession('not an object'), 'failed');
});
