/* The season's activities: what a participant completes to earn a sticker
   pack, and enough of to complete Hacktoberfest.

   The API supplies ids and completion only, as `challenges` on
   GET /api/me/progress — the backend's word; lib/progress.mjs translates
   it and nothing else on the site says "challenge". Every word and every
   destination a participant sees lives here, so a backend change can never
   alter the page's copy, and an activity the backend has not heard of still
   renders correctly.

   The ids are the slugs FestNet creates for the season. An id the API sends
   that is not here is dropped; an id here the API does not send reads as
   not done. `requiresDevLink` is kept as a field ActivityCard honours, though
   no activity needs it this season. `surface` says which band on /my owns
   the completion attribution: 'fests' puts the note beside the Fests
   themselves. Presentation only — eligibility math never reads it. */
export const ACTIVITIES = Object.freeze([
  Object.freeze({
    id: 'livestreams',
    label: 'Attend two livestreams',
    detail:
      'Turn up to any two of the October sessions and check in with the code on screen.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
  }),
  Object.freeze({
    id: 'ghw',
    label: 'Complete Global Hack Week',
    detail:
      'A week of sessions, one check-in each. Finish the week and it counts.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
  }),
  Object.freeze({
    id: 'fest',
    label: 'Attend a Fest in person',
    detail:
      'A one-day, in-person event in your city. Checking in at the door is what counts.',
    href: '/fests/',
    ctaLabel: 'Find a Fest',
    surface: 'fests',
  }),
  Object.freeze({
    id: 'dev-relay',
    label: 'Install Dev Relay',
    detail: 'Connect your editor and it counts automatically.',
    href: 'https://example.invalid/hacktoberfest/dev-relay',
    ctaLabel: 'Install',
    surface: 'card',
  }),
]);
