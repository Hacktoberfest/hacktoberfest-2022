/* The DigitalOcean sticker's button, and the notice /my shows on the way
   back. The flow itself lives in the API: /my asks it for a URL and
   navigates there; the API carries the participant through DigitalOcean and
   lands them on /my/?connected=digitalocean, with an error code when it
   failed. This file is the frontend's whole share of it.

   Relative imports, matching lib/: Node's test runner never sees jsconfig's
   alias. `startDigitalOceanConnect` takes its collaborators as options so
   the test can watch the navigation without a browser. */
import { apiFetch } from './apiClient.mjs';
import { API_BASE_URL } from './session.mjs';

/* The query /my reads on return. `connected` names the flow, `error` the
   way it ended; both are the API's contract (services/digitalocean/flow.ts). */
export const CONNECT_PARAM = 'connected';
export const CONNECT_FLOW = 'digitalocean';

export const OUTCOMES = Object.freeze([
  'connected',
  'denied',
  'expired',
  'already-linked',
  'unavailable',
]);

/* The outcome named by a location search string, or null when the page was
   not reached by coming back from DigitalOcean. An error code this file does
   not know reads as `unavailable`, so a new code on the API still says
   something rather than nothing. */
export const connectOutcome = (search) => {
  const params = new URLSearchParams(typeof search === 'string' ? search : '');
  if (params.get(CONNECT_PARAM) !== CONNECT_FLOW) return null;
  const error = params.get('error');
  if (!error) return 'connected';
  return OUTCOMES.includes(error) ? error : 'unavailable';
};

const START_PATH = '/api/me/digitalocean/start';
const RETURN_PATH = `/my/?${CONNECT_PARAM}=${CONNECT_FLOW}`;

/* Leave for DigitalOcean. The mocked build has no API to ask, so it comes
   straight back as connected, which is what the review link wants to show.
   Live, a failure to even get the URL lands on /my as unavailable, the same
   sentence the API would have sent the participant back with. */
export const startDigitalOceanConnect = async ({
  apiBaseUrl = API_BASE_URL,
  fetcher = apiFetch,
  navigate = (url) => globalThis.location.assign(url),
} = {}) => {
  if (!apiBaseUrl) {
    navigate(RETURN_PATH);
    return;
  }
  try {
    const body = await fetcher(START_PATH, { method: 'POST' });
    if (!body || typeof body.url !== 'string') throw new Error('no url');
    navigate(body.url);
  } catch (_) {
    navigate(`${RETURN_PATH}&error=unavailable`);
  }
};
