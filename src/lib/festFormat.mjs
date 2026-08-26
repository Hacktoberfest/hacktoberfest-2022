/* A Fest's format, read out of its name.

   Not out of the API's `format` field, which cannot answer this: every
   Hacktoberfest event in /api/events returns "hackathon", MLH's generic
   event type, including the record named "Quinn's non-hack day
   hacktoberfest test". The two Fest formats live in the naming convention
   instead — hosts name a Fest for what it is — so this reads the name.

   Two passes. An anchored one that trusts the naming convention, and a
   loose whole-name fallback for anything off-convention.

   A heuristic over free text, and treated like one. It badges only when
   confident and returns null otherwise, which is the right answer for a
   name that does not follow the convention rather than a failure to
   handle. Replace it the day MLH exposes a real field; until then a
   missing badge costs a reader nothing, and a wrong one costs them a
   Saturday. */

/* Word-bounded so the site's own name never badges itself: "Hacktoberfest"
   and "SharkHacks Day One" both have to miss. The optional hyphen and
   loose whitespace cover "Hack Day", "Hack-Day" and "Hackday" in one
   pattern. */
const HACK_DAY = /\bhack\s*-?\s*day\b/;
const MEET_UP = /\bmeet\s*-?\s*up\b/;

/* The convention MLH actually names Fests by:

     Hacktoberfest Meet Up Toronto x Hack the 6ix
     Hacktoberfest Hack Day New York x IBM

   Format first, then the city, then a partner after an "x". That partner
   is a second place words live and a partner can be called anything — a
   Meet Up run with a "Hack Day" something reads as both formats under the
   loose match below and resolves to neither, quietly losing a badge it had
   every right to. Anchoring to the front settles which half of the name is
   making the claim.

   "Hacktober Fest" as two words because this repo's own fixtures wrote it
   that way, and a name is not worth failing over a space. */
const ANCHORED = /^hacktober\s?fest\s+(hack\s*-?\s*day|meet\s*-?\s*up)\b/;

/* The guard that earns this file. "non-hack day" contains "hack day", so
   a plain substring test labels it the exact opposite of what it says —
   and this is not a hypothetical, it is in the live payload today. */
const NOT_HACK_DAY = /\bnon\s*-?\s*hack\s*-?\s*day\b/;

export const festFormatFromName = (name) => {
  if (typeof name !== 'string') return null;

  const folded = name.toLowerCase().replace(/\s+/g, ' ').trim();

  /* Tried first and trusted absolutely: a name that opens with the
     convention has already said which format it is, and nothing later in
     it gets a vote. */
  const anchored = ANCHORED.exec(folded);
  if (anchored) return HACK_DAY.test(anchored[1]) ? 'hackDay' : 'meetUp';

  const hackDay = HACK_DAY.test(folded) && !NOT_HACK_DAY.test(folded);
  const meetUp = MEET_UP.test(folded);

  /* A name claiming to be both is a name to trust for neither. */
  if (hackDay && meetUp) return null;
  if (hackDay) return 'hackDay';
  if (meetUp) return 'meetUp';

  return null;
};
