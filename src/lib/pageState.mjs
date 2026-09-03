/* Which page state the signed-in flow lands on when something goes wrong.

   Both decisions here were extracted from the .catch/.then they lived in so
   they can be tested at all: this repo has no component-test harness, so
   anything left inside an effect is reachable only by rendering the page. As
   plain functions they are unit tests instead.

   The callers own the side effects — 'signedOut' means clear the session and
   redirect to /login/, everything else is a setState value — because those
   are the parts that need the router and the storage. */
import { isMissingEmailOnly, parseSession } from './session.mjs';

/* Four statuses, each with a surface of its own. 401 means a stale token,
   which sends someone back to sign in rather than to an error screen they
   cannot act on; 502 is the one status that means MLH itself is unreachable;
   403 and 404 arrived with /my/fest/, which is scoped to one event's hosts:
   "this Fest is not yours" and "there is no such Fest" are different
   sentences with different next steps, and neither is worth a retry.

   A lookup rather than a chain of ifs, because the response carries exactly
   one status: none of the four can ever apply together, so there is no order
   to get right. This replaced an ordered pair of ifs whose guard was an error
   object answering 401 to the first read of .status and 502 to the second —
   the one shape that could tell the orderings apart. It failed if they were
   swapped, but it also passed silently once anyone read .status into a
   local, and it failed spuriously for anyone who added a
   behaviour-preserving branch in front. Nothing here can be reordered, so
   nothing needs guarding. */
const STATES = {
  401: 'signedOut',
  403: 'forbidden',
  404: 'notFound',
  502: 'mlhDown',
};

export const pageStateForError = (error) => {
  const status = error && error.status;

  /* The typeof check is load-bearing rather than defensive: property keys are
     strings, so STATES['502'] would answer 'mlhDown' for a status that is not
     a number — and a status that arrived as a string is a response we have
     not understood, not a proven MLH outage.

     Everything else, including a bare TypeError from a dead network (fetch
     reports those with no status at all), is the generic error surface, which
     is the one that offers a retry. */
  return typeof status === 'number' ? (STATES[status] ?? 'error') : 'error';
};

/* Which /auth/callback/ state a 200 response we cannot store lands on.

   Called only when parseSession(..., { requireRefreshToken: true }) has
   already said no, so the exchange succeeded but the payload cannot become a
   session. Three different things can be wrong, and they need three different
   sets of words:

   - A withheld MyMLH email. Restarting cannot fix it; only editing the
     profile can, so it gets its own screen and its own CTA.
   - A response that is otherwise readable — valid email, valid access token —
     but carries no refreshToken. The link was fine and the exchange worked,
     so 'failed' ("that sign-in link has expired… start again") is false, and
     its CTA sends the participant back through MyMLH to receive the same
     response and land here again, forever. 'unavailable' is the honest one:
     we could not finish the handover, their link is fine. Restarting is at
     least capable of working if the API stops omitting the token.
   - Anything else: no access token, no user object, not even an object. The
     response is malformed and blaming a withheld email for it would be a
     guess, so it keeps 'failed'.

   Deliberately re-parses without the write-side demand rather than
   re-implementing it: that is what makes "the refresh token was the only
   problem" mean exactly what the parser means by it. */
export const callbackStateForSession = (session) => {
  if (isMissingEmailOnly(session)) return 'noEmail';
  return parseSession(JSON.stringify(session)) ? 'unavailable' : 'failed';
};
