/* The pre-event survey sticker's button. The survey is the same Qualtrics
   form Customer.io emails, with the same query, so a response from the site
   reaches FestNet's survey webhook exactly as one from the email does:
   `mymlh_id` is what Customer.io matches the person on, and `link_source`
   is the only thing that says which door they came through.

   Relative imports, matching lib/: Node's test runner never sees jsconfig's
   alias. */
import { tokenClaims } from './apiClient.mjs';
import { getSession } from './session.mjs';

const PRE_SURVEY_URL =
  'https://mlh.pdx1.qualtrics.com/jfe/form/SV_bjcurJG0ZNS7Lvw';
export const LINK_SOURCE = 'sticker';

/* The survey URL for a session. The MyMLH id is the access token's `mlhId`
   claim; session.user.id is the API's own id and would match nobody. With
   no readable id the link still opens the survey, it just cannot earn the
   sticker. */
export const preSurveyUrl = (session) => {
  const mlhId = tokenClaims(session && session.accessToken)?.mlhId;
  const params = new URLSearchParams();
  if (typeof mlhId === 'string' && mlhId) params.set('mymlh_id', mlhId);
  params.set('cohort', 'hacktoberfest_2026');
  params.set('link_source', LINK_SOURCE);
  return `${PRE_SURVEY_URL}?${params}`;
};

export const openPreSurvey = ({
  session = getSession(),
  open = (url) => globalThis.open(url, '_blank', 'noopener,noreferrer'),
} = {}) => open(preSurveyUrl(session));
