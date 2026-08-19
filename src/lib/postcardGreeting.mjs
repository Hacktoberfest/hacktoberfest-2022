/* Whether a host's first name fits the thank-you postcard's greeting.

   The card back (ThankYouBand) greets the host by name in the one live
   line the supplied artwork leaves blank: "Hey, NAME" across the top,
   with the HF logo mark occupying the top-right corner. A long enough
   name would run under the logo, so past the point where it can't fit
   the card greets a "future host" instead (thankYou.note.fallbackName).
   That decision is arithmetic over font metrics, not rendering — so it
   lives here where node:test can reach it, and the component only asks
   yes or no.

   All numbers are in the artwork's own 2720×1700 coordinate space. The
   advances are canvas-measured from Barlow Semi Condensed 800 at the
   greeting's 140px em (2026-08-18) — the greeting renders in exactly
   that face and size, so these are the widths the browser will lay
   down, off by at most a rounding pixel per glyph. Characters outside
   the table (accented capitals, mostly) charge the average cap. */

const CAP_ADVANCES = {
  A: 84.1,
  B: 76.6,
  C: 75.5,
  D: 76.9,
  E: 71.3,
  F: 68.9,
  G: 75.9,
  H: 77.1,
  I: 35,
  J: 73.2,
  K: 79.5,
  L: 70.7,
  M: 89,
  N: 82.9,
  O: 77,
  P: 75,
  Q: 74.8,
  R: 76.7,
  S: 73.6,
  T: 75.2,
  U: 77.1,
  V: 79.8,
  W: 112.6,
  X: 79.5,
  Y: 79,
  Z: 68.5,
  '-': 52.6,
  "'": 25.9,
  '’': 30.5,
  '.': 35.1,
};

const AVERAGE_ADVANCE = 77;

/* The comp's name carries a little tracking its "Hey," doesn't have;
   the component sets the same value on the name's tspan, so it belongs
   to the width the same way the advances do. */
export const NAME_TRACKING = 5;

/* Where the name's pen starts — the greeting's x=250 left margin plus
   "Hey, " at 140px — and where its ink must stop: the logo mark's left
   edge at x=2301, less breathing room. */
const NAME_START = 519;
const NAME_LIMIT = 2270;

export const greetingNameFits = (name) => {
  let width = 0;
  for (const character of name) {
    width += (CAP_ADVANCES[character] || AVERAGE_ADVANCE) + NAME_TRACKING;
  }
  return NAME_START + width <= NAME_LIMIT;
};
