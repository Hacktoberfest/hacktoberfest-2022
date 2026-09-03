/* The data seam for /my/fest/.

   One Fest, as its hosts see it: the card /my already shows, plus the numbers
   MLH keeps about the event. Live by default; the mocked build (an explicit
   NEXT_PUBLIC_API_BASE_URL=mocked, see lib/apiBase.mjs) serves fixtures so the
   page is reviewable before any of these numbers are real.

   The endpoint is authorized server-side: it answers 403 to a signed-in user
   who does not organize the event and 404 to an id with no Fest behind it.
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
   this whole page unreviewable in the one build where it can be reviewed. */
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
