/* Two small, pure pieces of the /activities/ page's branching, pulled out
   so they are covered by node --test — this repo has no component-test
   harness, so anything left inside the page's effect is reachable only by
   rendering it.

   Together they are the fix for two review findings. `progressSlot`
   never answers 'signIn' for a visitor who has a session — the earlier bug
   read "signed in" off the fetch result rather than off the session, so it
   was briefly false while the fetch was still in flight and the sign-in
   link flashed at someone who did not need it. `publicActivities` is what
   the cards fall back to whenever there is nothing more specific to
   show — signed out, the signed-in fetch still in flight, or that fetch
   having failed — so a transient failure no longer collapses the whole
   page to the signed-out shape; the cards are public content regardless of
   whether the signed-in fetch ever succeeds.

   Relative import, matching every other file in lib/: Node resolves this
   file directly and never sees jsconfig's baseUrl alias. */
import { mergeActivities } from './eligibility.mjs';

/* The public catalogue, undone: every activity present, none completed, no
   source. Identical in shape to what getProgress(null, ...) itself
   resolves to (src/lib/progress.mjs's `undone()`) — this does not
   reimplement that seam, it only avoids calling it for a visitor who does
   have a session, where "signed out" would be the wrong word for what is
   happening. */
export const publicActivities = () =>
  mergeActivities([]).map((activity) => ({ ...activity, source: null }));

/* Which slot the page shows for progress. The how-it-works band no longer
   owns a milestone card — that lives on /my now — so this decides whether
   the page shows the sign-in link (no session), nothing (signed in, the
   fetch still in flight), the one-line progress strip under the hero
   (signed in and resolved), or the retry notice (the fetch failed on
   anything other than a dead session).

   `hasSession` is read synchronously from storage by the caller — whether
   a session exists at all, never whether the signed-in fetch has answered
   yet. That is what keeps this from ever answering 'signIn' for someone
   who is signed in.

   `status` is where the signed-in fetch (getExperience) stands: 'loading'
   while in flight, 'ready' once it resolves, or 'error' if it rejects with
   anything other than a dead session — a 401 is the caller's job to turn
   back into `hasSession: false` before this is ever asked again, see
   src/pages/activities.js. */
export const progressSlot = ({ hasSession, status }) => {
  if (!hasSession) return 'signIn';
  if (status === 'ready') return 'strip';
  if (status === 'error') return 'error';
  return 'placeholder';
};
