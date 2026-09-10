/* The season's activities: what a participant completes to earn a sticker
   pack, and enough of to complete Hacktoberfest. Seventeen this season,
   from the 2026-09-10 list; the ids other than livestreams, fest,
   dev-relay and ghw are this site's guesses until FestNet confirms its
   slugs (an id the API sends that is not here is
   dropped, an id here the API does not send reads as not done, so a
   mismatch shows as "not done", never as a crash).

   The API supplies ids and completion only, as `challenges` on
   GET /api/me/progress — the backend's word; lib/progress.mjs translates
   it and nothing else on the site says "challenge". Every word and every
   destination a participant sees lives here, so a backend change can never
   alter the page's copy, and an activity the backend has not heard of still
   renders correctly.

   `type` and `art` are presentation too: the type is the chip and the
   sticker's colour on /activities/, `art` is a key into
   components/ActivitiesPage/stickerArt.js. Eligibility math reads neither.

   The ids are the slugs FestNet creates for the season. An id the API sends
   that is not here is dropped; an id here the API does not send reads as
   not done. `requiresDevLink` is kept as a field ActivityCard honours, though
   no activity needs it this season. `surface` says which band on /my owns
   the completion attribution: 'fests' puts the note beside the Fests
   themselves. Presentation only — eligibility math never reads it. */
export const ACTIVITIES = Object.freeze([
  Object.freeze({
    id: 'livestreams',
    label: 'Check into a livestream',
    detail:
      'Turn up to any October session and check in with the code on screen.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'livestreams',
    art: 'play',
  }),
  Object.freeze({
    id: 'livestreams-3',
    label: 'Check into three livestreams',
    detail: 'Any three October sessions, checked in with the code on screen.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'livestreams',
    art: 'playlist',
  }),
  Object.freeze({
    id: 'livestreams-5',
    label: 'Check into five livestreams',
    detail: 'Any five October sessions. The three you already have count.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'livestreams',
    art: 'screen',
  }),
  Object.freeze({
    id: 'livestream-launch',
    label: 'Check into the Hacktoberfest launch livestream',
    detail: 'The first stream of the month. Check in with the code on screen.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'livestreams',
    art: 'rocket',
  }),
  Object.freeze({
    id: 'fest',
    label: 'Attend an in-person Fest',
    detail:
      'A one-day, in-person event in your city. Checking in at the door is what counts.',
    href: '/fests/',
    ctaLabel: 'Find a Fest',
    surface: 'fests',
    type: 'inperson',
    art: 'pin',
  }),
  Object.freeze({
    id: 'host-fest',
    label: 'Host an in-person Fest',
    detail: 'Run a Fest of your own. Approved hosts earn it on the day.',
    href: '/host/',
    ctaLabel: 'Host a Fest',
    surface: 'card',
    type: 'inperson',
    art: 'flag',
  }),
  Object.freeze({
    id: 'dev-relay',
    label: 'Install and log in to DevRelay',
    detail:
      'Install DevRelay, sign in with your MyMLH account, and it counts on its own.',
    // The real URL is not known yet; this lands once DevRelay has one.
    href: null,
    ctaLabel: 'Install',
    surface: 'card',
    type: 'tools',
    art: 'plug',
  }),
  Object.freeze({
    id: 'dev-connect',
    label: 'Connect your DEV account',
    detail: 'Link your DEV account to MyMLH. The two challenges below need it.',
    /* DEV's own account settings page, the same link the account strip
       offers (my.identity.devConnectHref): a real destination, off-site. */
    href: 'https://dev.to/settings/account',
    ctaLabel: 'Connect DEV account',
    surface: 'card',
    type: 'dev',
    art: 'link',
  }),
  Object.freeze({
    id: 'dev-building',
    label: 'Submit to a DEV building challenge',
    detail: 'Build something for the October challenge on DEV and submit it.',
    // The challenge page is not announced yet.
    href: null,
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'blocks',
    requiresDevLink: true,
  }),
  Object.freeze({
    id: 'dev-writing',
    label: 'Submit to a DEV writing challenge',
    detail: 'Write for the October challenge on DEV and submit it.',
    href: null,
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'pen',
    requiresDevLink: true,
  }),
  Object.freeze({
    id: 'ghw',
    label: 'Complete Global Hack Week: Hacktoberfest’s registration challenges',
    detail: 'Register for the week and finish its registration challenges.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'ghw',
    art: 'bolt',
  }),
  Object.freeze({
    id: 'ghw-livestream',
    label: 'Check into a Global Hack Week: Hacktoberfest livestream',
    detail: 'Any Global Hack Week session, checked in with the code on screen.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'ghw',
    art: 'play',
  }),
  Object.freeze({
    id: 'ghw-points-5',
    label: 'Earn 5 points at Global Hack Week: Hacktoberfest',
    detail: 'Five points across the week’s challenges.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'ghw',
    art: 'target',
  }),
  Object.freeze({
    id: 'ghw-points-10',
    label: 'Earn 10 points at Global Hack Week: Hacktoberfest',
    detail:
      'Ten points across the week’s challenges. The five count toward it.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'ghw',
    art: 'medal',
  }),
  Object.freeze({
    id: 'ghw-points-20',
    label: 'Earn 20 points at Global Hack Week: Hacktoberfest',
    detail:
      'Twenty points across the week’s challenges. The ten count toward it.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'ghw',
    art: 'trophy',
  }),
  Object.freeze({
    id: 'discord',
    label: 'Join the MLH Community Discord',
    detail: 'Join the server with the account linked to MyMLH and it counts.',
    /* The same invite HOST_DISCORD_URL in data/links.js carries, restated
       here because this file is read by Node's test runner, which cannot
       resolve links.js. */
    href: 'https://discord.com/invite/mlh',
    ctaLabel: 'Join the Discord',
    surface: 'card',
    type: 'tools',
    art: 'chat',
  }),
  Object.freeze({
    id: 'digitalocean',
    label: 'Connect your DigitalOcean account',
    detail: 'Link your DigitalOcean account to MyMLH and it counts.',
    // The connect flow is not live yet.
    href: null,
    ctaLabel: 'Connect',
    surface: 'card',
    type: 'tools',
    art: 'droplet',
  }),
]);

/* The two stickers everyone must earn, ahead of the catalogue in the
   sticker book on /my. Signing in is earned by arriving; the address is
   earned when MyMLH validates one. They are `type: 'required'`, which is
   the book's own page rather than one of the activity types, and eligibility
   math never reads them: isEligible and progressLevel already gate on
   addressValidated directly. The address sticker's destination is injected
   by the renderer (data/links.js is not importable from Node's test
   runner), so `href` is null here and never a placeholder. `doneCtaLabel`
   is what the CTA says once the address is on file, since the link still
   goes somewhere useful. */
export const REQUIRED_STICKERS = Object.freeze([
  Object.freeze({
    id: 'signin',
    label: 'Signed in with MyMLH',
    detail: 'The MyMLH account you signed in with. Earned by being here.',
    href: null,
    ctaLabel: null,
    doneCtaLabel: null,
    type: 'required',
    art: 'key',
  }),
  Object.freeze({
    id: 'address',
    label: 'Address on file',
    detail:
      'Where the sticker pack goes. It lives on your MyMLH account, never here.',
    href: null,
    ctaLabel: 'Add address',
    doneCtaLabel: 'Update address',
    type: 'required',
    art: 'mail',
  }),
]);
