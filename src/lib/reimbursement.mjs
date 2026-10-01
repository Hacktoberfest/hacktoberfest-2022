/* A Hack Day's reimbursement, as its hosts see it once the Fest has ended.

   The API decides everything that matters: the four wrap-up checks (read
   by FestNet's sweep from MLH and SmugMug), MLH's force-approval, whether
   the Fest is eligible, the limit from the host handbook's rate table, and
   the one submission per Fest. This module only reads what it sends, says
   it in the card's terms, and posts the payee. Nothing here re-derives
   eligibility: a static export cannot enforce anything, and the POST is
   refused server-side whatever the card shows. */
import { apiFetch } from './apiClient.mjs';
import { formatFestDate } from './fests.mjs';
import { API_BASE_URL } from './session.mjs';

const isObject = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const text = (value) => (typeof value === 'string' ? value.trim() : '');

const wholeCount = (value) => Number.isInteger(value) && value >= 0;

/* Challenge names still waiting on a winner. A list whose entries are all
   unreadable is still checking rather than an empty list, which would read
   as every winner picked. */
const winners = (value) => {
  if (!isObject(value) || !Array.isArray(value.missing)) return null;
  const missing = value.missing.map(text).filter(Boolean);
  if (missing.length === 0 && value.missing.length > 0) return null;
  return { missing };
};

const photos = (value) =>
  isObject(value) && wholeCount(value.count) ? { count: value.count } : null;

/* checkIns is a plain yes or no: the threshold never leaves the API, and
   the count is MLH's, on the card above. The other three are null until
   FestNet has read them, which the card says as "still checking". */
const checks = (value) => {
  const raw = isObject(value) ? value : {};
  return {
    checkIns: raw.checkIns === true,
    submissions: typeof raw.submissions === 'boolean' ? raw.submissions : null,
    winners: winners(raw.winners),
    photos: photos(raw.photos),
  };
};

/* The limit, or null when the Fest's country has no rate. A limit with any
   field the card cannot show truthfully is null too, which puts the "email
   us" note in front of the host instead of a wrong amount. */
const limit = (value) => {
  if (!isObject(value)) return null;
  const country = text(value.country);
  const { perCheckIn, checkIns, checkInsCounted, amount } = value;
  if (!country) return null;
  if (!(Number.isFinite(perCheckIn) && perCheckIn > 0)) return null;
  if (!wholeCount(checkIns) || !wholeCount(checkInsCounted)) return null;
  if (checkInsCounted > checkIns) return null;
  if (!(Number.isFinite(amount) && amount >= 0)) return null;
  return { country, perCheckIn, checkIns, checkInsCounted, amount };
};

/* The Fest's one submission, from the dashboard or straight from the
   POST's 201. A time is the one thing it cannot do without: a submission
   with no readable time is no submission, and the host sees the form
   again, where the API's 409 brings back the real one. byYou only on a
   literal true, so a garbled answer says "a co-host" rather than claiming
   the reader sent something they did not. */
export const normalizeSubmission = (value) => {
  if (!isObject(value)) return null;
  if (typeof value.submittedAt !== 'string') return null;
  if (!Number.isFinite(Date.parse(value.submittedAt))) return null;
  const payee = isObject(value.payee) ? value.payee : {};
  return {
    submittedAt: value.submittedAt,
    byYou: value.byYou === true,
    payee: {
      firstName: text(payee.firstName),
      lastName: text(payee.lastName),
      email: text(payee.email),
    },
  };
};

/* dashboard.reimbursement, read for the card. eligible and forceApproved
   hold only on a literal true: bad data must never open a claim. */
export const normalizeReimbursement = (value) => {
  if (!isObject(value)) return null;
  return {
    checks: checks(value.checks),
    forceApproved: value.forceApproved === true,
    eligible: value.eligible === true,
    limit: limit(value.limit),
    submission: normalizeSubmission(value.submission),
  };
};

/* "$243.60". The handbook's rates and limits are in US dollars wherever
   the Fest is, so the currency never follows the reader's locale. */
const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatUsd = (amount) =>
  Number.isFinite(amount) && amount >= 0 ? USD.format(amount) : null;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/* A calendar date some days after another, as YYYY-MM-DD. UTC throughout,
   because these are dates rather than instants: no zone should be able to
   move a receipts deadline by a day. */
const addDays = (isoDate, days) => {
  const [, year, month, day] = ISO_DATE.exec(isoDate);
  const shifted = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day) + days),
  );
  return shifted.toISOString().slice(0, 10);
};

/* MLH's two deadlines, counted from the Fest's own date: receipts within
   30 days, and the Ramp account closes 60 days after. Null for a Fest with
   no usable date, and the card then says it in days instead. */
export const festDeadlines = (isoDate) => {
  if (typeof isoDate !== 'string' || !ISO_DATE.test(isoDate)) return null;
  const receipts = formatFestDate(addDays(isoDate, 30));
  const rampCloses = formatFestDate(addDays(isoDate, 60));
  if (!receipts || !rampCloses || !formatFestDate(isoDate)) return null;
  return { receipts, rampCloses };
};

/* The day the claim went to MLH, in the Fest's zone like every other date
   on its page. An absent or unknown zone falls back to the reader's own
   clock, as checkInsVisible does. */
export const formatSentDate = (isoInstant, timeZone) => {
  const ms = typeof isoInstant === 'string' ? Date.parse(isoInstant) : NaN;
  if (!Number.isFinite(ms)) return null;
  const options = { month: 'long', day: 'numeric' };

  try {
    return new Intl.DateTimeFormat('en-US', {
      ...options,
      timeZone: timeZone || undefined,
    }).format(new Date(ms));
  } catch (_) {
    return new Intl.DateTimeFormat('en-US', options).format(new Date(ms));
  }
};

/* Step 1's rows, in card order. Check-ins are never pending: the count is
   MLH's own and the API always has it. The other three are pending until
   FestNet's sweep has read them. */
export const wrapUpChecks = (checks) => {
  const verdict = (passed) => (passed ? 'pass' : 'fail');
  const { checkIns, submissions, winners, photos } = checks;

  return [
    { id: 'checkIns', verdict: verdict(checkIns === true) },
    {
      id: 'submissions',
      verdict: submissions === null ? 'pending' : verdict(submissions),
    },
    winners === null
      ? { id: 'winners', verdict: 'pending' }
      : {
          id: 'winners',
          verdict: verdict(winners.missing.length === 0),
          missing: winners.missing,
        },
    photos === null
      ? { id: 'photos', verdict: 'pending' }
      : {
          id: 'photos',
          verdict: verdict(photos.count > 0),
          count: photos.count,
        },
  ];
};

/* Where the card opens: the sent state once anyone has sent the claim,
   else step 1 until the API calls the Fest eligible (MLH's force-approval
   included), else step 2. Step 3 is reached only by Continue, so a reload
   before sending starts at step 2 again with both boxes unticked. */
export const openingStep = (reimbursement) => {
  if (reimbursement.submission) return 'sent';
  return reimbursement.eligible ? 2 : 1;
};

/* Steps whose being done is the API's record rather than this card's own
   state, so they read as done wherever they sit on the rail. */
const RECORDED = new Set(['wrapUp', 'giftCards']);

/* The rail of an unsent claim, in order, each step done, the one the host
   is on (here), or still to come (todo). Three steps, or four when the
   Fest has gift cards (lib/giftCards.mjs's giftCardsFor), the gift cards
   second: they open once step 1 is done (the checks, or MLH's
   force-approval) and fold once a request is on record, for every host.
   The API refuses the reimbursement until then (409
   GIFT_CARDS_NOT_REQUESTED), so the card asks in the same order.

   `advanced` is Continue on the claim step, this card's own state; with
   no rate there is no Continue, so the payee step never opens. The host
   is on the first step not done. After it, only a step the API has on
   record can read as done: a request MLH has had since step 1 reopened
   (a force-approval cleared) stays done rather than unsent. */
export const railSteps = (reimbursement, giftCards, { advanced } = {}) => {
  const ids = giftCards
    ? ['wrapUp', 'giftCards', 'claim', 'payee']
    : ['wrapUp', 'claim', 'payee'];
  const done = {
    wrapUp: reimbursement.eligible === true,
    giftCards: Boolean(giftCards && giftCards.request),
    claim: advanced === true && Boolean(reimbursement.limit),
    payee: false,
  };
  let reached = false;

  return ids.map((id, index) => {
    let state = 'todo';
    if (!reached && !done[id]) {
      state = 'here';
      reached = true;
    } else if (done[id] && (!reached || RECORDED.has(id))) {
      state = 'done';
    }
    return { id, number: index + 1, state };
  });
};

/* The API's body rules, run before the request so a typo is caught on the
   form rather than after a round trip: names 1 to 100 characters once
   trimmed, with no control characters (a pasted line break or tab); the
   email trimmed, at most 254, no whitespace or control characters, and
   one @ with a dot after it. The API is that much stricter than the spec,
   and this mirrors the API. Returns the fields that fail, in form order. */
const NAME_MAX = 100;
const EMAIL_MAX = 254;

/* Both as the API has them (services/reimbursement/submit.service.ts):
   something before the @, a dot after it with something on both sides,
   no whitespace; and no control characters in a name or an email. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL = /\p{Cc}/u;

const nameValid = (value) => {
  const name = text(value);
  return name.length > 0 && name.length <= NAME_MAX && !CONTROL.test(name);
};

/* Exported for the gift card rows (lib/giftCards.mjs), which the API holds
   to this same rule. */
export const emailValid = (value) => {
  const email = text(value);
  return email.length <= EMAIL_MAX && EMAIL.test(email) && !CONTROL.test(email);
};

export const payeeInvalidFields = (payee) => {
  const value = isObject(payee) ? payee : {};
  return [
    nameValid(value.firstName) ? null : 'firstName',
    nameValid(value.lastName) ? null : 'lastName',
    emailValid(value.email) ? null : 'email',
  ].filter(Boolean);
};

/* What the card does about a failed send.

   refetch: someone already sent it (409 ALREADY_SUBMITTED), the Fest's
   gift cards are not requested yet (409 GIFT_CARDS_NOT_REQUESTED), the
   session died (401), or the Fest is no longer this host's or no longer
   there (403, 404). The page reloads the dashboard, and the sent state,
   the gift card step or the page's own surface for that answer takes
   over. The gift card request (lib/giftCards.mjs) is read the same way.
   invalid: the API refused the body (400).
   changed: any other 409 (not ended, not a Hack Day, not eligible, no
   rate): the page is out of date.
   unavailable: MLH's form (502) or anything else, so try again.

   `giftCardsOn` is whether this page shows the Fest's gift cards. A
   GIFT_CARDS_NOT_REQUESTED on a page that shows none would refetch into
   the same form with no word said, so there it is "changed" instead, and
   the reload it asks for shows the step. */
export const submitOutcome = (error, { giftCardsOn = true } = {}) => {
  const status = error ? error.status : undefined;
  const code = error && isObject(error.body) ? error.body.error : undefined;

  if (status === 409 && code === 'ALREADY_SUBMITTED') return 'refetch';
  /* The Fest has gift cards and no forwarded request: they were turned on
     after this page loaded, or the request it read was still being
     forwarded and then failed. The fresh dashboard shows the step. */
  if (status === 409 && code === 'GIFT_CARDS_NOT_REQUESTED') {
    return giftCardsOn ? 'refetch' : 'changed';
  }
  if (status === 401 || status === 403 || status === 404) return 'refetch';
  if (status === 400) return 'invalid';
  if (status === 409) return 'changed';
  return 'unavailable';
};

/* The mocked build has no backend and no MLH form, but Send still deserves
   its sent state: resolve the submission the endpoint answers with, after
   a beat long enough that the sending state is reviewable too. Same as
   acknowledgeFest's mock. */
const mockSubmission = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        normalizeSubmission({
          submittedAt: new Date().toISOString(),
          byYou: true,
          payee: payload,
        }),
      );
    }, 600);
  });

/* The host's one claim for the Fest: who gets paid, and the two ticks.
   The API checks the body again, claims the Fest's one submission and
   forwards it to MLH's form, answering 201 { submission }. Resolves the
   submission read as the dashboard reads one, or null when the 201 cannot
   be read, which the page answers with a refetch. Failures reject with
   apiFetch's status and body; submitOutcome says what each one means. */
export const submitReimbursement = async (eventId, form) => {
  const value = isObject(form) ? form : {};
  const payload = {
    firstName: text(value.firstName),
    lastName: text(value.lastName),
    email: text(value.email),
    readHandbook: value.readHandbook === true,
    agreedToPolicy: value.agreedToPolicy === true,
  };

  if (!API_BASE_URL) return mockSubmission(payload);

  const body = await apiFetch(
    `/api/me/fests/${encodeURIComponent(eventId)}/reimbursement`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );

  return normalizeSubmission(isObject(body) ? body.submission : null);
};
