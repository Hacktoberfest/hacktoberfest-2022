/* The survey stickers' buttons. Each survey is the same Qualtrics form
   Customer.io emails, with the same query, so a response from the site
   reaches FestNet's survey webhook exactly as one from the email does:
   `mymlh_id` is what Customer.io matches the person on, and `link_source`
   is the only thing that says which door they came through.

   Relative imports, matching lib/: Node's test runner never sees jsconfig's
   alias. */
import { tokenClaims } from './apiClient.mjs';
import { getSession } from './session.mjs';

const PRE_SURVEY_URL =
  'https://mlh.pdx1.qualtrics.com/jfe/form/SV_bjcurJG0ZNS7Lvw';
const POST_SURVEY_URL =
  'https://mlh.pdx1.qualtrics.com/jfe/form/SV_9BIhzywjnrY42xw';
export const LINK_SOURCE = 'sticker';

/* A survey's URL for a session. The MyMLH id is the access token's `mlhId`
   claim; session.user.id is the API's own id and would match nobody. With
   no readable id the link still opens the survey, it just cannot earn the
   sticker. */
const surveyUrl = (form, session) => {
  const mlhId = tokenClaims(session && session.accessToken)?.mlhId;
  const params = new URLSearchParams();
  if (typeof mlhId === 'string' && mlhId) params.set('mymlh_id', mlhId);
  params.set('cohort', 'hacktoberfest_2026');
  params.set('link_source', LINK_SOURCE);
  return `${form}?${params}`;
};

export const preSurveyUrl = (session) => surveyUrl(PRE_SURVEY_URL, session);
export const postSurveyUrl = (session) => surveyUrl(POST_SURVEY_URL, session);

const opener =
  (url) =>
  ({
    session = getSession(),
    open = (href) => globalThis.open(href, '_blank', 'noopener,noreferrer'),
  } = {}) =>
    open(url(session));

export const openPreSurvey = opener(preSurveyUrl);
export const openPostSurvey = opener(postSurveyUrl);
