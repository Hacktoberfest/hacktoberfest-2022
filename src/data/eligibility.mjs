/* The season's activities: what a participant completes to earn a sticker
   pack, and enough of to complete Hacktoberfest. Twenty-two this season:
   the 2026-09-10 list and the two surveys (2026-09-25). The ids are the
   slugs of the challenges in
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
      'Tune in to any stream on the schedule and check in with the code we show on screen.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'livestreams',
    art: 'play',
  }),
  Object.freeze({
    id: 'livestreams-3',
    label: 'Check into three livestreams',
    detail:
      'Join us for three livestreams throughout Hacktoberfest. Don’t forget to check-in!',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'livestreams',
    art: 'playlist',
  }),
  Object.freeze({
    id: 'livestreams-5',
    label: 'Check into five livestreams',
    detail:
      'Watch a total of five livestreams throughout Hacktoberfest, and learn about open intelligence.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'livestreams',
    art: 'screen',
  }),
  Object.freeze({
    id: 'livestream-launch',
    label: 'Check into the Hacktoberfest launch livestream',
    detail:
      'Hacktoberfest kicks off live on October 1. Watch the launch and check in with the code on screen.',
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
      'Learn about open-source and open-weight models by attending an in-person Hack Day or Meetup in your city.',
    href: '/fests/',
    ctaLabel: 'Find a Fest',
    surface: 'fests',
    type: 'inperson',
    art: 'pin',
  }),
  Object.freeze({
    id: 'host-fest',
    label: 'Host an in-person Fest',
    detail:
      'Run a Fest in your city. Once it concludes, you’ll be awarded this sticker.',
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
      'DevRelay makes it easier than ever to access knowledge from DEV and rewards from MLH.',
    href: 'https://devrelay.com',
    ctaLabel: 'Get started now',
    surface: 'card',
    type: 'tools',
    art: 'plug',
  }),
  Object.freeze({
    id: 'dev-connect',
    label: 'Connect your DEV account',
    detail:
      'Link DEV to MyMLH from your DEV account settings. It’s how we match your challenge entries to you.',
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
    when: 'October 2 to 4',
    cellLabel: 'Submit to the launch weekend DEV Challenge',
    label: 'Submit to the Hacktoberfest Launch Weekend DEV Challenge',
    detail:
      'The prompt is revealed at launch. Build something quick and post it on DEV with the challenge tag between October 2 and 4.',
    href: 'https://dev.to/challenges/hacktoberfest-weekend-2026-10-01',
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'weekend',
    requiresDevLink: true,
  }),
  Object.freeze({
    id: 'dev-week-1',
    when: 'October 5 to 11',
    cellLabel: 'Submit to the week 1 DEV Challenge',
    label: 'Submit to the Hacktoberfest Week 1 DEV Challenge',
    detail:
      'Build something with open source AI and write it up on DEV. Use the challenge tag and post between October 5 and 11.',
    href: 'https://dev.to/challenges/hacktoberfest-week1-2026-10-05',
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'weekone',
    requiresDevLink: true,
  }),
  Object.freeze({
    id: 'dev-week-2',
    when: 'October 12 to 18',
    cellLabel: 'Submit to the week 2 DEV Challenge',
    label: 'Submit to the Hacktoberfest Week 2 DEV Challenge',
    detail:
      'Each week has its own prompt and its own sticker. Post your entry on DEV with the challenge tag between October 12 and 18.',
    href: 'https://dev.to/challenges/hacktoberfest-week2-2026-10-12',
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'weektwo',
    requiresDevLink: true,
  }),
  Object.freeze({
    id: 'dev-week-3',
    when: 'October 19 to 25',
    cellLabel: 'Submit to the week 3 DEV Challenge',
    label: 'Submit to the Hacktoberfest Week 3 DEV Challenge',
    detail:
      'Missed a week? You can still jump in here. Post your entry on DEV with the challenge tag between October 19 and 25.',
    href: 'https://dev.to/challenges/hacktoberfest-week3-2026-10-19',
    ctaLabel: 'See the challenge',
    surface: 'card',
    type: 'dev',
    art: 'weekthree',
    requiresDevLink: true,
  }),
  Object.freeze({
    id: 'dev-week-4',
    when: 'October 26 to 31',
    cellLabel: 'Submit to the week 4 DEV Challenge',
    label: 'Submit to the Hacktoberfest Week 4 DEV Challenge',
    detail:
      'This is the last round of the month. Post your entry on DEV with the challenge tag between October 26 and 31.',
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
    detail:
      'Sign up for Global Hack Week, which runs October 9 to 15, and complete all of the registration challenges.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'ghw',
    art: 'bolt',
  }),
  Object.freeze({
    id: 'ghw-livestream',
    label: 'Check into a Global Hack Week: Hacktoberfest livestream',
    detail:
      'Drop into any stream during Global Hack Week and check in with the code on screen.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'ghw',
    art: 'play',
  }),
  /* The three GHW points stickers are 10, 20 and 30 points since
     2026-10-09. Their ids still say 15, 30 and 75, the thresholds they
     launched with: FestNet cannot change a challenge's slug, and the
     week was already running, so the ids stayed and only the numbers
     moved. The threshold itself lives in each FestNet row's rule. */
  Object.freeze({
    id: 'ghw-points-15',
    label: 'Earn 10 points at Global Hack Week: Hacktoberfest',
    detail: 'Complete challenges to earn points throughout Global Hack Week.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'ghw',
    art: 'target',
  }),
  Object.freeze({
    id: 'ghw-points-30',
    label: 'Earn 20 points at Global Hack Week: Hacktoberfest',
    detail:
      'Your points keep adding up all week. Reach 20 to earn this one on top of the 10.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'ghw',
    art: 'medal',
  }),
  Object.freeze({
    id: 'ghw-points-75',
    label: 'Earn 30 points at Global Hack Week: Hacktoberfest',
    detail:
      'This is the big one. Reach 30 points by the time Global Hack Week wraps up.',
    href: '/schedule/',
    ctaLabel: 'See the schedule',
    surface: 'card',
    type: 'ghw',
    art: 'trophy',
  }),
  Object.freeze({
    id: 'discord',
    label: 'Join the MLH Community Discord',
    detail:
      'Come hang out in MLH’s Community Discord, then connect your Discord to your MyMLH account so we know it’s you.',
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
    detail:
      'Hacktoberfest was created by DigitalOcean. Link your DigitalOcean account to earn a bonus sticker.',
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
  /* The two Hacktoberfest surveys, the stickers on the Surveys page
     (type `misc`: whatever belongs to no other). Each is earned when Customer.io tells
     FestNet the person finished it in Qualtrics (POST
     /api/webhooks/survey). The link is personal (it carries the MyMLH id
     the webhook is keyed by), so the pre-event survey is an action rather
     than an href: lib/survey.mjs builds the URL from the session on click.
     The post-event survey still only arrives by email, so it has neither
     and the renderers show no button; `ctaLabel` keeps the catalogue's
     shape. */
  Object.freeze({
    id: 'survey-pre',
    label: 'Complete the Hacktoberfest 2026 pre-event survey',
    detail:
      'Keep an eye on your email inbox for a short survey from us. Fill it out and we’ll award you a sticker.',
    href: null,
    action: 'survey',
    ctaLabel: 'Take the survey',
    surface: 'card',
    type: 'misc',
    art: 'clipboard',
  }),
  Object.freeze({
    id: 'survey-post',
    label: 'Complete the Hacktoberfest 2026 post-event survey',
    detail:
      'When October wraps up, we’ll email you one more survey about how it went. Fill it out to earn this one too.',
    href: null,
    ctaLabel: 'Take the survey',
    surface: 'card',
    type: 'misc',
    art: 'clipboard',
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
    label: 'Sign into Hacktoberfest.com',
    detail: 'The MyMLH account you signed in with. Earned by being here.',
    href: null,
    ctaLabel: null,
    doneCtaLabel: null,
    type: 'required',
    art: 'key',
  }),
  Object.freeze({
    id: 'address',
    label: 'Add your address to your MyMLH account',
    detail:
      'Where the sticker pack goes. It lives on your MyMLH account, never here.',
    href: null,
    ctaLabel: 'Add address',
    doneCtaLabel: 'Update address',
    type: 'required',
    art: 'mail',
  }),
]);
