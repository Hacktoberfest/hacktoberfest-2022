/* Which /my hub to open.

   /my/ is the attending hub and /my/hosting/ the hosting hub. A host who
   arrives at /my/ is sent on to hosting unless the hub they last chose was
   attending, so the header's one "My Hacktoberfest" link lands hosts on
   the hub they use. Attendees never write the memory and nothing reads it
   for them: hubToOpen is null the moment there is no organizing entry.

   localStorage, where the session lives, so the choice survives a closed
   tab; clearSession removes it with the tokens. */
import { isOrganizing } from './fests.mjs';
import { LAST_HUB_STORAGE_KEY } from './session.mjs';

export const ATTENDING = 'attending';
export const HOSTING = 'hosting';
export const HOSTING_HUB_PATH = '/my/hosting/';

const HUBS = new Set([ATTENDING, HOSTING]);

/* Same stance as session.mjs: Safari in private mode throws on access. */
const storage = () => {
  try {
    return globalThis.localStorage || null;
  } catch (_) {
    return null;
  }
};

export const readLastHub = () => {
  const store = storage();
  if (!store) return null;
  try {
    const value = store.getItem(LAST_HUB_STORAGE_KEY);
    return HUBS.has(value) ? value : null;
  } catch (_) {
    return null;
  }
};

export const writeLastHub = (hub) => {
  if (!HUBS.has(hub)) return;
  const store = storage();
  if (!store) return;
  try {
    store.setItem(LAST_HUB_STORAGE_KEY, hub);
  } catch (_) {
    // A storage that refuses the write just means /my/ decides afresh next time.
  }
};

/* The redirect decision for /my/: a path to replace to, or null to stay.
   isOrganizing, not isHost: someone with a draft needs the hosting hub to
   finish it. */
export const hubToOpen = ({ fests, lastHub }) =>
  isOrganizing(fests) && lastHub !== ATTENDING ? HOSTING_HUB_PATH : null;
