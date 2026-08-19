/* Preptember mode: the September state of /my, before the campaign opens.
   While the flag is true the hub hides "Your progress." and "Pick an
   activity." — neither means anything before October — and shows a
   countdown to the start in their place. Flipped off by a deploy on
   October 1st; the countdown clamps at zero in the gap (lib/countdown.mjs)
   so a late flip never shows negative numbers. */
export const PREPTEMBER = true;

/* Local midnight on purpose: Hacktoberfest starts when October does
   wherever the participant is, not at a single UTC instant. */
export const HACKTOBERFEST_START = new Date(2026, 9, 1);
