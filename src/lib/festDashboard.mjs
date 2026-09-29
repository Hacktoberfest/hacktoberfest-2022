/* The data seam for /my/fest/.

   One Fest, as its hosts see it: the card /my already shows, plus the numbers
   MLH keeps about the event. Live by default; the mocked build (an explicit
   NEXT_PUBLIC_API_BASE_URL=mocked, see lib/apiBase.mjs) serves fixtures so the
   page is reviewable before any of these numbers are real.

   The endpoint is authorized server-side: it answers 403 to a signed-in user
   who does not organize the event and 404 to an id with no Fest behind it,
   or to a Fest nobody has taken through the final acknowledgements yet.
   Nothing here re-implements that check — a static export cannot enforce
   anything, and pretending otherwise would be theatre. */
import {
  EMPTY_FEST_DASHBOARD,
  FEST_DASHBOARDS,
  SCENARIOS,
  DEFAULT_SCENARIO,
  selectScenario,
} from '../data/fixtures.mjs';
import { apiFetch } from './apiClient.mjs';
import { API_BASE_URL } from './session.mjs';

const number = (value) =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

/* Same stance as the API's own trackingNumbersFrom: MLH had not shipped this
   field on any event as of 2026-09-02, so anything that is not a usable
   string is dropped rather than rendered at a host. */
const trackingNumbers = (value) =>
  Array.isArray(value)
    ? value
        .filter((entry) => typeof entry === 'string')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
    : [];

/* The Fest's self check-in code, or null when MLH has none for it. Only a
   host ever receives one: the API builds this half of the payload after its
   host check and answers everyone else 403. */
const checkInCode = (value) => {
  if (typeof value !== 'string') return null;
  const code = value.trim();
  return code.length > 0 ? code : null;
};

/* One of the Fest's SmugMug links, or null. The API already refuses
   anything that is not an https SmugMug link; this only makes sure nothing
   but an https URL can ever land in an href. */
const httpsUrl = (value) => {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  return /^https:\/\//i.test(url) ? url : null;
};

const photos = (value) => {
  const links = value && typeof value === 'object' ? value : {};
  return {
    galleryUrl: httpsUrl(links.galleryUrl),
    uploadUrl: httpsUrl(links.uploadUrl),
  };
};

/* The Fest's format as the API resolved it, from the host's application
   and then the name. Anything but the two formats is the API saying it
   could not tell, which is null, and lib/usefulInfo.mjs shows no card. */
const format = (value) =>
  value === 'hackDay' || value === 'meetUp' ? value : null;

/* The partner keys MLH lists on the Fest. Strings only; which of them
   count, and which one wins, is lib/usefulInfo.mjs's call. A value that is
   not a list at all is null rather than [], because [] would read as "no
   partner" and put the generic Hack Day deck in front of a Fest that may
   well have Gemma. */
const partners = (value) =>
  Array.isArray(value)
    ? value.filter((entry) => typeof entry === 'string')
    : null;

/* The event pack's items, in the order the card lists them: the same five
   keys the API and FestNet's shipping-sheet pass use. Anything else is
   dropped, so a key this build has no label for never renders. */
export const PACK_ITEMS = Object.freeze([
  'arduino',
  'tshirts',
  'beltBags',
  'infoCards',
  'stickers',
]);

const packContents = (value) =>
  Array.isArray(value) ? PACK_ITEMS.filter((item) => value.includes(item)) : [];

/* The deploy-order seam, in the same spirit as lib/experience.mjs: an API
   answering without the dashboard half degrades to zeros rather than
   rendering undefined. A payload with no fest is not a page at all, and the
   caller treats null as an error. */
export const normalizeDashboard = (body) => {
  if (!body || typeof body !== 'object') return null;

  const fest = body.fest;
  if (!fest || typeof fest !== 'object') return null;

  const dashboard =
    body.dashboard && typeof body.dashboard === 'object' ? body.dashboard : {};

  return {
    fest,
    dashboard: {
      registrationsCount: number(dashboard.registrationsCount),
      checkInsCount: number(dashboard.checkInsCount),
      trackingNumbers: trackingNumbers(dashboard.trackingNumbers),
      /* Kept only when the API sent the key at all. An API from before the
         check-in code shipped omits it, and the page then shows no code card
         rather than telling a host their Fest has no code. null is the API
         saying so; absence is the API not knowing to. */
      ...('checkInCode' in dashboard
        ? { checkInCode: checkInCode(dashboard.checkInCode) }
        : {}),
      /* Same seam as the check-in code. An API from before the Photo
         gallery omits the key, and the page shows no card rather than
         telling a host their links are coming. Present with nulls is the
         API saying MLH has not sent them yet. */
      ...('photos' in dashboard ? { photos: photos(dashboard.photos) } : {}),
      /* Same seam again, for the Useful info card. An API from before
         partners sends neither key, and the page shows no card rather than
         the generic deck. */
      ...('format' in dashboard ? { format: format(dashboard.format) } : {}),
      ...('partners' in dashboard
        ? { partners: partners(dashboard.partners) }
        : {}),
      /* Same seam again. An API from before the packing list omits the
         key, and the card shows no box block at all. Sent, an empty list
         is a Fest the shipping sheet has no row for yet, and the block
         says its contents are coming. */
      ...('packContents' in dashboard
        ? { packContents: packContents(dashboard.packContents) }
        : {}),
    },
  };
};

/* The mocked build's answer: the fest out of whichever scenario is showing,
   with its dashboard fixture. An unknown id rejects with a 404-shaped error,
   so the not-found surface is reachable from a review link exactly as it is
   in a live build.

   The named scenario is asked first, then every other one, because the link
   that gets here comes off a card on /my and carries no scenario of its own.
   Only the `organizer` scenario has organizing Fests at all, so without the
   sweep every click through from a review link would 404 — which would make
   this whole page unreviewable in the one build where it can be reviewed.

   Unlike the API, the mock does not refuse a Fest before its final
   acknowledgements. fest-azores is both /my's "One step left" card and the
   only Meetup and unshipped-pack dashboard, so refusing it would take those
   states off every review link; and the mocked Confirm writes nothing, so
   the card's fresh dashboard link would 404 straight after the confetti.
   The card still hides the link until the step is done (hasFestDashboard),
   so only a hand-typed review link reaches an unacknowledged Fest here. */
const mockDashboard = async (festId, scenario) => {
  const named =
    SCENARIOS[selectScenario(scenario)] || SCENARIOS[DEFAULT_SCENARIO];
  const searched = [named, ...Object.values(SCENARIOS)];

  const fest = searched
    .flatMap((fixture) => fixture.fests || [])
    .find((entry) => entry.id === festId);

  if (!fest) {
    const error = new Error(`No mocked Fest for id ${festId}`);
    error.status = 404;
    throw error;
  }

  return {
    fest,
    dashboard: FEST_DASHBOARDS[festId] || EMPTY_FEST_DASHBOARD,
  };
};

export const getFestDashboard = async (festId, options) => {
  const scenario = options && options.scenario;

  if (!API_BASE_URL) return mockDashboard(festId, scenario);

  const body = await apiFetch(`/api/me/fests/${encodeURIComponent(festId)}`);
  const result = normalizeDashboard(body);

  if (!result) {
    // A 200 we cannot read is not a dashboard. Surfacing it as the generic
    // error state offers a retry, which is the only useful move.
    throw new Error('The Fest dashboard response could not be read');
  }

  return result;
};
