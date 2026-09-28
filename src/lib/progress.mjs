/* The data seam for /activities/, and the progress half of /my.

   getProgress returns the thresholds and the merged activities. Mocked by
   default (NEXT_PUBLIC_API_BASE_URL=mocked), live otherwise, exactly as
   lib/experience.mjs decides it, so the two seams can never disagree about
   which mode the build is in.

   This is the one place the backend's word meets the site's. The API calls
   these `challenges`, on GET /api/me/progress; the site calls them
   activities. Nothing downstream of this file says "challenge". */
import {
  DEFAULT_SCENARIO,
  SCENARIOS,
  selectScenario,
} from '../data/fixtures.mjs';
import { apiFetch } from './apiClient.mjs';
import {
  DEFAULT_THRESHOLDS,
  mergeActivities,
  thresholdsOf,
} from './eligibility.mjs';
import { REQUIRED_STICKERS } from '../data/eligibility.mjs';
import { API_BASE_URL } from './session.mjs';

/* The two required stickers the book knows. A required slug the API adds
   later is dropped here exactly as an unknown activity is. */
const REQUIRED_IDS = new Set(REQUIRED_STICKERS.map((sticker) => sticker.id));

/* Pure. `challenges` in, `activities` and `required` out. Activities are
   merged onto the catalogue by slug so an id the API invents is dropped
   and an id it forgets reads as not done. `required` is the payload's
   required entries the book knows, in payload order, trimmed to what the
   book reads; the sticker book merges them onto REQUIRED_STICKERS itself.
   `source` rides along for the activities page, which says how a
   completion was earned; the hub ignores it. */
export const progressFromPayload = (payload) => {
  const body = payload && typeof payload === 'object' ? payload : {};
  const challenges = Array.isArray(body.challenges) ? body.challenges : [];

  const sources = new Map(
    challenges
      .filter((entry) => entry && typeof entry.id === 'string')
      .map((entry) => [
        entry.id,
        entry.completed ? (entry.source ?? null) : null,
      ]),
  );

  const activities = mergeActivities(challenges).map((activity) => ({
    ...activity,
    source: sources.get(activity.id) ?? null,
  }));

  const required = challenges
    .filter(
      (entry) =>
        entry &&
        typeof entry.id === 'string' &&
        entry.required === true &&
        REQUIRED_IDS.has(entry.id),
    )
    .map((entry) => ({
      id: entry.id,
      completed: Boolean(entry.completed),
      completedAt: (entry.completed && entry.completedAt) || null,
      source: entry.completed ? (entry.source ?? null) : null,
    }));

  return { thresholds: thresholdsOf(body), activities, required };
};

/* Signed out, or nothing to merge: the catalogue, undone. */
const undone = () => ({
  thresholds: DEFAULT_THRESHOLDS,
  activities: mergeActivities([]).map((activity) => ({
    ...activity,
    source: null,
  })),
  required: [],
});

const mockedProgress = (scenario) => {
  const fixture =
    SCENARIOS[selectScenario(scenario)] || SCENARIOS[DEFAULT_SCENARIO];
  return progressFromPayload({
    thresholds: fixture.thresholds,
    challenges: fixture.activities,
  });
};

export const getProgress = async (session, options) => {
  const scenario = options && options.scenario;

  if (!API_BASE_URL) {
    /* The mocked build has no sessions to speak of beyond the fixture one;
       a mocked visitor with no session is the signed-out shape. */
    return session
      ? { ...mockedProgress(scenario), signedIn: true }
      : { ...undone(), signedIn: false };
  }

  if (!session) return { ...undone(), signedIn: false };

  /* apiFetch handles the refresh dance and throws a 401-shaped error when
     the session is dead. The activities page treats that as signed out; /my
     treats it as a redirect. Both decisions are the callers', not this
     file's. */
  const body = await apiFetch('/api/me/progress');
  return { ...progressFromPayload(body), signedIn: true };
};

/* What /my folds into its experience: the same call, minus `signedIn`,
   which the hub already knows. Exported so experience.mjs does not
   re-implement the merge. */
export const progressForExperience = async () =>
  progressFromPayload(await apiFetch('/api/me/progress'));
