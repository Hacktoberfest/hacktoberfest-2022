/* The Today strip: the band under the nav that says what is on today
   (components/TodayStrip). On for October, and off by a deploy once the
   month is over, the way PREPTEMBER (data/preptember.mjs) was.

   A late flip is harmless. The strip also judges the date for itself and
   stays hidden on any day outside October 2026 (lib/todayStrip.mjs), so
   what this flag controls is whether the markup, the pre-paint script and
   the two idle fetches ship at all, not whether November sees a stale
   strip.

   Off for now (Jacklyn, 2026-09-28): the strip stays in the codebase,
   ready to turn back on, but no page carries it. */
export const TODAY_STRIP = false;
