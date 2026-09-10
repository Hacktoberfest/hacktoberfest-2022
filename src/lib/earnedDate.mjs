/* When a sticker was earned, as the activity card and the sticker book
   show it. Nothing on the site says a sticker was earned before
   Hacktoberfest began: a completion recorded earlier (a Fest checked into
   in September, a sign-in from August, a row the API wrote on a first
   visit in Preptember) shows as October 1. Presentation only; the API
   keeps the true timestamp and eligibility math never reads a date.

   Pure and import-free so node --test covers it (test/earned-date.test.mjs).
   Dates are read in UTC, as the API writes them, so the same completion
   shows the same day everywhere. */

/* The first moment a shown date may be. data/preptember.mjs carries the
   same day as a local Date for the countdown; this one is the API's UTC. */
export const EARLIEST_SHOWN = '2026-10-01T00:00:00.000Z';

export const formatEarnedDate = (value) => {
  if (typeof value !== 'string' && !(value instanceof Date)) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const floor = new Date(EARLIEST_SHOWN);
  const shown = date < floor ? floor : date;
  return shown.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};
