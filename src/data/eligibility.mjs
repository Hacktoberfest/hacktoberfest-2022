/* The season's activities: what a participant completes to earn a sticker
   pack, and enough of to complete Hacktoberfest. Twenty this season,
   from the 2026-09-10 list. The ids are the slugs of the challenges in
   FestNet, confirmed against production on 2026-09-11 (an id the API sends
   that is not here is dropped, an id here the API does not send reads as
   not done, so a mismatch shows as "not done", never as a crash).
   `livestreams-1` rather than `livestreams` because that is the row's slug
   in FestNet, and slugs cannot be renamed once created.

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
    id: 'livestreams-1',
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
    detail:
      'Link your DEV account to MyMLH. The five challenges below need it.',
    /* DEV's own account settings page, the same link the account strip
       offers (my.identity.devConnectHref): a real destination, off-site. */
    href: 'https://dev.to/settings/account',
    ctaLabel: 'Connect DEV account',
    surface: 'card',
    type: 'dev',
    art: 'link',
  }),
  /* The five DEV challenge stickers: one per DEV Hacktoberfest challenge,
     each earned once by publishing on DEV with the challenge tag inside
     that challenge's window, by the DEV account linked on MyMLH. The
     windows and the tag live on the API's challenge rows; these are the
     words and the links. */
  Object.freeze({
    id: 'dev-launch-weekend',
    label: 'Submit to the Hacktoberfest Launch Weekend DEV Challenge',
    detail:
      'Publish your entry on DEV with the challenge tag over launch weekend, October 2 to 4.',
    href: 'https://dev.to/challenges/hacktoberfest-weekend-2026-10-01',
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'weekend',
    requiresDevLink: true,
  }),
  Object.freeze({
    id: 'dev-week-1',
    label: 'Submit to the Hacktoberfest Week 1 DEV Challenge',
    detail:
      'Publish your entry on DEV with the challenge tag during week one, October 5 to 11.',
    href: 'https://dev.to/challenges/hacktoberfest-week1-2026-10-05',
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'weekone',
    requiresDevLink: true,
  }),
  Object.freeze({
    id: 'dev-week-2',
    label: 'Submit to the Hacktoberfest Week 2 DEV Challenge',
    detail:
      'Publish your entry on DEV with the challenge tag during week two, October 12 to 18.',
    href: 'https://dev.to/challenges/hacktoberfest-week2-2026-10-12',
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'weektwo',
    requiresDevLink: true,
  }),
  Object.freeze({
    id: 'dev-week-3',
    label: 'Submit to the Hacktoberfest Week 3 DEV Challenge',
    detail:
      'Publish your entry on DEV with the challenge tag during week three, October 19 to 25.',
    href: 'https://dev.to/challenges/hacktoberfest-week3-2026-10-19',
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'weekthree',
    requiresDevLink: true,
  }),
  Object.freeze({
    id: 'dev-week-4',
    label: 'Submit to the Hacktoberfest Week 4 DEV Challenge',
    detail:
      'Publish your entry on DEV with the challenge tag during week four, October 26 to 31.',
    href: 'https://dev.to/challenges/hacktoberfest-week4-2026-10-26',
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'weekfour',
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
    detail: 'Connect your DigitalOcean account from here and it counts.',
    /* Not a link: the button starts the API's connect flow
       (lib/digitalocean.mjs), which is why `action` names it and `href`
       stays null. The renderers show a button for an action and a link for
       an href; a sticker has one or the other. */
    href: null,
    action: 'digitalocean',
    ctaLabel: 'Connect DigitalOcean',
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
