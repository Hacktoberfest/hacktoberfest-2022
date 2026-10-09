/* Which stickers were earned since this participant last looked at the
   book, so the page can make a moment of them: the DigitalOcean flow
   lands back on /my with the sticker just granted, a check-in scanned
   while this page is open arrives with the next fetch, and both deserve
   more than a quiet change of state.

   The record is the ids the participant has already seen earned, per
   user, in localStorage: like lib/myView.mjs, and unlike the experience
   cache, because it has to outlive a trip to DigitalOcean and back and
   the tab that trip may have been in. The first look seeds the record
   without ceremony, since nothing on it was earned just now; only what
   turns up after that is new. Milestones ride along under their own
   ids, so a reached reward card gets its moment too.

   Pure functions take their storage and session as arguments, the way
   the experience cache does, so the tests never mock a browser. */

export const SEEN_STICKERS_KEY = 'hacktoberfest.seenStickers';

const localStore = () => {
  try {
    return globalThis.localStorage || null;
  } catch (_) {
    return null;
  }
};

/* Email, not id, as the experience cache keys: parseSession guarantees a
   non-empty email on every session it returns. */
const userKey = (session) =>
  session && session.user && typeof session.user.email === 'string'
    ? session.user.email
    : null;

/* The ids of every earned sticker in the book, in book order. Never a
   secret's placeholder (lib/stickerBook.mjs), even one marked complete by
   mistake: its id is its place in one response, not a sticker, and the
   next response may give it to another secret. An earned secret carries
   its own id, which the record has never held, so the placeholder turning
   into it is news and the sticker slaps on like any other. */
export const earnedIds = (stickers) =>
  (Array.isArray(stickers) ? stickers : [])
    .filter(
      (sticker) =>
        sticker &&
        sticker.completed === true &&
        sticker.placeholder !== true &&
        typeof sticker.id === 'string',
    )
    .map((sticker) => sticker.id);

/* The reached milestones, as ids in the same record. Prefixed so a
   sticker slug can never collide with one. */
export const MILESTONE_IDS = Object.freeze({
  pack: 'milestone:pack',
  complete: 'milestone:complete',
  completionist: 'milestone:completionist',
  completionistPlusPlus: 'milestone:completionist-plus-plus',
});

/* A record written before Completionist++ existed lacks its id, so
   someone already past it sees its moment once, on their next visit. */
export const milestoneIds = (rewards) => {
  if (!rewards) return [];
  return [
    rewards.pack && rewards.pack.earned && MILESTONE_IDS.pack,
    rewards.completion && rewards.completion.earned && MILESTONE_IDS.complete,
    rewards.completionist &&
      rewards.completionist.earned &&
      MILESTONE_IDS.completionist,
    rewards.completionistPlusPlus &&
      rewards.completionistPlusPlus.earned &&
      MILESTONE_IDS.completionistPlusPlus,
  ].filter(Boolean);
};

/* What is earned now that was not in the record. A null record is a
   first look: nothing is new, everything is simply there. */
export const newlyEarned = (earned, seen) => {
  if (!Array.isArray(seen)) return [];
  const known = new Set(seen);
  return (Array.isArray(earned) ? earned : []).filter((id) => !known.has(id));
};

/* The record for this user: an array of ids, or null when there is none
   (no storage, no user, nothing written, or junk). */
export const readSeen = (session, storage = localStore()) => {
  const forUser = userKey(session);
  if (!storage || !forUser) return null;
  try {
    const parsed = JSON.parse(storage.getItem(SEEN_STICKERS_KEY));
    const ids = parsed && parsed[forUser];
    return Array.isArray(ids) && ids.every((id) => typeof id === 'string')
      ? ids
      : null;
  } catch (_) {
    return null;
  }
};

/* Record these ids as seen for this user, keeping other users' records
   and never removing an id: an earned sticker that is later revoked and
   re-granted is not news either. A no-op without storage or a user. */
export const writeSeen = (session, ids, storage = localStore()) => {
  const forUser = userKey(session);
  if (!storage || !forUser) return;
  let all = {};
  try {
    const parsed = JSON.parse(storage.getItem(SEEN_STICKERS_KEY));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      all = parsed;
    }
  } catch (_) {
    all = {};
  }
  const before = Array.isArray(all[forUser]) ? all[forUser] : [];
  const merged = [...new Set([...before, ...(Array.isArray(ids) ? ids : [])])];
  try {
    storage.setItem(
      SEEN_STICKERS_KEY,
      JSON.stringify({ ...all, [forUser]: merged }),
    );
  } catch (_) {
    /* Quota or a private window: the moment is lost, nothing else is. */
  }
};

/* One step for the page: what is new against the record, and the record
   brought up to date. Returns the new ids, in the order given. */
export const noteEarned = (session, ids, storage = localStore()) => {
  const seen = readSeen(session, storage);
  const fresh = newlyEarned(ids, seen);
  writeSeen(session, ids, storage);
  return fresh;
};
