/* The data seam for /my/promos/.

   GET /api/me/offers answers one card per sponsor of the participant's
   Hacktoberfest events. Which sponsor is on which event, and the
   de-duplication across events, are MLH's and the API's: nothing here
   decides either. This module only refuses what the page cannot render
   safely, and every URL it lets through is https, because each one ends up
   in an href or in location.assign.

   Live by default; the mocked build (NEXT_PUBLIC_API_BASE_URL=mocked, see
   lib/apiBase.mjs) serves data/fixtures.mjs's OFFERS. Spec:
   hacktoberfest-2026-admin/docs/superpowers/specs/2026-09-29-sponsor-promos-design.md. */
import {
  ERROR_SCENARIO,
  MLH_DOWN_SCENARIO,
  OFFERS,
  OFFERS_BY_SCENARIO,
  selectScenario,
} from '../data/fixtures.mjs';
import { apiFetch } from './apiClient.mjs';
import { pageStateForError } from './pageState.mjs';
import { API_BASE_URL } from './session.mjs';

const text = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const httpsUrl = (value) => {
  const url = text(value);
  return url && /^https:\/\//i.test(url) ? url : null;
};

const challengeFrom = (value) => {
  if (!value || typeof value !== 'object') return null;
  const id = text(value.id);
  const name = text(value.name);
  if (!id || !name) return null;
  return {
    id,
    name,
    shortDescription: text(value.shortDescription),
    prizeDescription: text(value.prizeDescription),
    /* A challenge without a usable link still says what it is; it just
       loses its button. */
    url: httpsUrl(value.url),
    external: value.external === true,
  };
};

/* What MLH asks of an account before its claim page hands over this code,
   and whether this participant has it done. Only kinds the card has words
   for survive; a `met` that is not a boolean is the API saying it could not
   check, which the card states neutrally. An API that predates requirements
   sends none, and none is what the card shows. */
const REQUIREMENT_KINDS = ['verified_phone', 'github_oauth'];

const requirementFrom = (value) => {
  if (!value || !REQUIREMENT_KINDS.includes(value.kind)) return null;
  return {
    kind: value.kind,
    met: typeof value.met === 'boolean' ? value.met : null,
  };
};

/* The rows /my/promos/ lists: the codes. A sponsor with only a challenge
   has no row; its challenge shows only as the small link on its own code,
   and it has none. API order (by company name) is kept. */
export const offersWithCodes = (offers) =>
  offers.filter((offer) => offer.promo);

const promoFrom = (value) => {
  if (!value || typeof value !== 'object') return null;
  const poolId = text(value.poolId);
  const eventId = text(value.eventId);
  // The claim needs these two; everything else is words, and may be absent.
  if (!poolId || !eventId) return null;
  return {
    poolId,
    eventId,
    label: text(value.label),
    description: text(value.description),
    restrictions: text(value.restrictions),
    requirements: Array.isArray(value.requirements)
      ? value.requirements.map(requirementFrom).filter(Boolean)
      : [],
  };
};

const offerFrom = (value) => {
  if (!value || typeof value !== 'object') return null;
  const company = value.company;
  if (!company || typeof company !== 'object') return null;
  const id = text(company.id);
  const name = text(company.name);
  if (!id || !name) return null;

  const challenges = Array.isArray(value.challenges)
    ? value.challenges.map(challengeFrom).filter(Boolean)
    : [];
  const promo = promoFrom(value.promo);
  /* The API only sends a sponsor with something to offer; a card that has
     lost everything to the checks above has nothing left to show. */
  if (challenges.length === 0 && !promo) return null;

  return {
    company: { id, name, logoUrl: httpsUrl(company.logoUrl) },
    challenges,
    promo,
  };
};

/* null only for a response that is not a list at all: the caller treats
   that as an error. An empty list is the empty state. */
export const normalizeOffers = (body) =>
  Array.isArray(body) ? body.map(offerFrom).filter(Boolean) : null;

/* Mocked mode only, and structurally so: getOffers calls this from its
   `!API_BASE_URL` branch and nowhere else, for the reason lib/experience.mjs
   gives on mockFailure. */
export const mockOffers = async (scenario) => {
  const name = selectScenario(scenario);

  if (name === ERROR_SCENARIO) {
    throw new Error('Mock offers failure (?scenario=error)');
  }
  if (name === MLH_DOWN_SCENARIO) {
    const error = new Error('Mock MLH outage (?scenario=mlh-down)');
    error.status = 502;
    throw error;
  }

  return normalizeOffers(OFFERS_BY_SCENARIO[name] ?? OFFERS);
};

/* A claim link goes straight into location.assign, so anything that is not
   an https URL is refused rather than followed. */
export const claimLinkFrom = (body) => {
  const link = httpsUrl(body && body.claimLink);
  if (!link) throw new Error('The claim link response could not be read');
  return link;
};

/* The mocked build's claim link: MLH's own list of a participant's codes,
   the harmless place a reviewer can land. */
export const MOCK_CLAIM_LINK = 'https://www.mlh.com/account/promo_codes';

/* /my/promos/ has three failure surfaces, not /my/fest/'s five: nothing
   here is scoped to one event's hosts, so 403 and 404 are not answers this
   route gives. An API deployed before the route answers 404, which is the
   generic error with a retry. */
export const offersPageState = (error) => {
  const state = pageStateForError(error);
  return state === 'signedOut' || state === 'mlhDown' ? state : 'error';
};

export const getOffers = async (options) => {
  const scenario = options && options.scenario;

  if (!API_BASE_URL) return mockOffers(scenario);

  const offers = normalizeOffers(await apiFetch('/api/me/offers'));
  if (!offers) {
    // A 200 we cannot read is not a list of offers. The generic error state
    // offers a retry, which is the only useful move.
    throw new Error('The offers response could not be read');
  }
  return offers;
};

/* Minted on click, never ahead: MLH signs the link for this participant,
   and it only works with their own MLH session (spec, "Sign-in gated claim
   links"). Never cached, never logged. */
export const getClaimLink = async ({ poolId, eventId }) => {
  if (!API_BASE_URL) return MOCK_CLAIM_LINK;

  const body = await apiFetch('/api/me/offers/claim-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ poolId, eventId }),
  });
  return claimLinkFrom(body);
};

/* One click on "Get your code", as an outcome the button can act on. Never
   rejects. `go` is the navigation, passed in so the outcome is testable
   without a browser. 'navigated' lets the button return to idle, so a
   participant who comes back with Back finds it working rather than stuck
   on "Getting your code…". */
export const claimAndGo = async ({ promo, go }) => {
  try {
    go(await getClaimLink(promo));
    return 'navigated';
  } catch (error) {
    if (offersPageState(error) === 'signedOut') return 'signedOut';
    /* The API's 404: the offer went stale after the cards were served
       (pool withdrawn, registration cancelled). A retry cannot fix that. */
    return error && error.status === 404 ? 'unavailable' : 'failed';
  }
};
