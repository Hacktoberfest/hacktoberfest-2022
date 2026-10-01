/* A Hack Day's digital gift cards, as its hosts see them.

   Some Fests get digital gift cards for winners who do not receive a
   physical prize. MLH's shipping sheet says how many; the API sends that
   limit as dashboard.giftCards for a Hack Day with more than zero, and
   null for anything else, before and after the Fest. After the Fest, the
   reimbursement card asks for the winners' emails once (step 2), and the
   API forwards them to MLH's gift card form.

   As with lib/reimbursement.mjs, the API decides everything that matters:
   this module only reads what it sends, holds the Hack Day rule again, and
   posts the emails. The POST is refused server-side whatever the page
   shows. */

import { apiFetch } from './apiClient.mjs';
import { emailValid } from './reimbursement.mjs';
import { API_BASE_URL } from './session.mjs';

const isObject = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const text = (value) => (typeof value === 'string' ? value.trim() : '');

/* The Fest's one request, from the dashboard or straight from the POST's
   201. A time is the one thing it cannot do without: a request with no
   readable time is no request, and the host sees the form again, where the
   API's 409 brings back the real one. byYou only on a literal true, so a
   garbled answer says "a co-host" rather than claiming the reader sent
   something they did not. */
export const normalizeGiftCardRequest = (value) => {
  if (!isObject(value)) return null;
  if (typeof value.submittedAt !== 'string') return null;
  if (!Number.isFinite(Date.parse(value.submittedAt))) return null;
  return {
    submittedAt: value.submittedAt,
    byYou: value.byYou === true,
    emails: Array.isArray(value.emails)
      ? value.emails.map(text).filter(Boolean)
      : [],
  };
};

/* dashboard.giftCards, read for the page. The limit is the whole feature:
   without a whole number above zero there is nothing to offer, so the
   block is null and every surface stays as it was. */
export const normalizeGiftCards = (value) => {
  if (!isObject(value)) return null;
  const { limit } = value;
  if (!Number.isInteger(limit) || limit <= 0) return null;
  return { limit, request: normalizeGiftCardRequest(value.request) };
};

/* The one question every surface asks: does this Fest have gift cards?
   Only a Hack Day does. The API already sends null for a Meet Up; the page
   holds the rule again, as lib/usefulInfo.mjs does for a Meet Up's
   partners, so a wrong payload cannot put gift cards in front of one. */
export const giftCardsFor = (dashboard) => {
  if (!isObject(dashboard) || dashboard.format !== 'hackDay') return null;
  return isObject(dashboard.giftCards) ? dashboard.giftCards : null;
};

/* Step 2's rows, checked against the API's own rules before the request,
   so a typo is caught on the form rather than after a round trip. Each
   address is the payee email rule (lib/reimbursement.mjs's emailValid),
   and no two may be the same person ignoring case, since each person gets
   one card. Empty rows are skipped: a host adds a row before typing in
   it. Every row empty is `empty`, and nothing is sent.

   problems lines up with the rows: null, 'invalid' (not a full address),
   or 'duplicate' (a later row naming someone an earlier row already
   does). A bad address is never anyone's duplicate. emails is what the
   request sends once nothing is wrong: every row with something in it,
   trimmed, in the order they were typed. */
export const giftCardRowProblems = (values) => {
  const rows = Array.isArray(values) ? values.map(text) : [];
  const seen = new Set();

  const problems = rows.map((email) => {
    if (!email) return null;
    if (!emailValid(email)) return 'invalid';
    const person = email.toLowerCase();
    if (seen.has(person)) return 'duplicate';
    seen.add(person);
    return null;
  });
  const emails = rows.filter(Boolean);

  return { problems, emails, empty: emails.length === 0 };
};

/* The mocked build has no backend and no MLH form, but Request still
   deserves its folded state: resolve the request the endpoint answers
   with, after a beat long enough that the requesting state is reviewable
   too. Same as submitReimbursement's mock. */
const mockRequest = (emails) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        normalizeGiftCardRequest({
          submittedAt: new Date().toISOString(),
          byYou: true,
          emails,
        }),
      );
    }, 600);
  });

/* The Fest's one gift card request: the winners' emails, in the order the
   host typed them. The API checks them again, claims the Fest's one
   request and forwards it to MLH's gift card form, answering 201
   { request }. Resolves the request read as the dashboard reads one, or
   null when the 201 cannot be read, which the page answers with a
   refetch. Failures reject with apiFetch's status and body;
   lib/reimbursement.mjs's submitOutcome says what each one means, as it
   does for the payee. */
export const requestGiftCards = async (eventId, values) => {
  const emails = (Array.isArray(values) ? values : [])
    .map(text)
    .filter(Boolean);

  if (!API_BASE_URL) return mockRequest(emails);

  const body = await apiFetch(
    `/api/me/fests/${encodeURIComponent(eventId)}/gift-cards`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails }),
    },
  );

  return normalizeGiftCardRequest(isObject(body) ? body.request : null);
};
