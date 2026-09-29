/* Mock eligibility states, used only in the mocked build — the explicit
   NEXT_PUBLIC_API_BASE_URL=mocked opt-out (see lib/apiBase.mjs).

   These double as test data, which is why they live in src/ rather than in
   test/: a fixture that drifts from the real shape fails the unit suite before
   anyone sees it in a browser. */

/* avatarUrl is always null in these fixtures — there is no real MyMLH avatar
   to point at — but it must still be present so WelcomeBand's fallback path
   (initials, not a missing prop) is what every scenario actually exercises. */
const USER = {
  name: 'Ada Lovelace',
  email: 'ada@example.invalid',
  avatarUrl: null,
};

/* The three DEV badges as GET /api/me/items serves them: one row each,
   after the certificates (the API's sortOrder 40, 41, 42), earned exactly
   when the Attend sticker (`fest`), the Host sticker (`host-fest`) or
   milestone 3 is. `earnedAt` maps a slug to when it was earned; a slug not
   in it is not earned yet. Every scenario's catalogue ends with all
   three, as the API's does. */
const DEV_BADGE_GETS_TO_YOU =
  'A badge on your DEV profile, added by DEV. Not linked to MyMLH yet? It’s added the moment you connect.';

const devBadges = (earnedAt = {}) =>
  [
    ['dev-badge-fest-2026', 'Fest Attendee DEV badge', 'Attending a Fest'],
    ['dev-badge-host-2026', 'Fest Host DEV badge', 'Hosting a Fest'],
    [
      'dev-badge-completionist-2026',
      'Completionist DEV badge',
      'Seventeen stickers in the book',
    ],
  ].map(([id, name, earnedBy]) => ({
    id,
    name,
    kind: 'digital',
    earnedBy,
    getsToYou: DEV_BADGE_GETS_TO_YOU,
    cta: null,
    requiresDevLink: true,
    earned: Boolean(earnedAt[id]),
    earnedAt: earnedAt[id] || null,
  }));

/* Fest dates: entries meant to read as "attended" are dated 2026-08-01 —
   before any plausible review date — so the past group is visible from a
   share link all campaign long, not only after mid-October. Upcoming
   entries sit late in October for the same reason. */
export const SCENARIOS = Object.freeze({
  'no-address': {
    user: { ...USER, devLinked: false },
    addressValidated: false,
    /* The two required stickers as the API serves them on /api/me/progress:
       what the book reads for completedAt and source. Kept consistent with
       addressValidated above so a fixture never shows an address sticker
       the mailing gate disagrees with. */
    required: [
      {
        id: 'signin',
        completed: true,
        completedAt: '2026-09-20T09:00:00.000Z',
        source: 'api',
      },
      { id: 'address', completed: false, completedAt: null, source: null },
    ],
    thresholds: { stickers: 1, complete: 8, completionist: 15 },
    /* The Attend sticker, from a Fest in August, so the default review
       link shows a DEV badge earned with no DEV account linked:
       Unclaimed. */
    activities: [
      { id: 'fest', completed: true, completedAt: '2026-08-01' },
      { id: 'livestreams-1', completed: true, completedAt: '2026-10-12' },
    ],
    /* The catalogue as GET /api/me/items serves it: the pack and the
       holographic sticker, earned by the milestones, and the DEV badges,
       the Attend one earned and Unclaimed. */
    items: [
      {
        id: 'sticker-pack-2026',
        name: 'The 2026 sticker pack',
        kind: 'physical',
        earnedBy: 'Your first sticker',
        getsToYou:
          'Mailed to the address on your MyMLH account after Hacktoberfest. Please allow 8-12 weeks for shipping.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      {
        id: 'holographic-sticker-2026',
        name: 'The holographic sticker',
        kind: 'physical',
        earnedBy: 'Ten stickers in the book',
        getsToYou:
          'Mailed with your sticker pack to the address on your MyMLH account after Hacktoberfest.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      {
        id: 'completionist-certificate-2026',
        name: 'Completionist certificate',
        kind: 'digital',
        earnedBy: 'Seventeen stickers in the book',
        getsToYou:
          'A certificate with your name and the year on it, made the moment you ask for it, as a PDF or a PNG.',
        cta: null,
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      ...devBadges({ 'dev-badge-fest-2026': '2026-08-01T10:00:00.000Z' }),
    ],
    fests: [
      {
        id: 'fest-brooklyn',
        name: 'Hacktober Fest Brooklyn',
        city: 'Brooklyn',
        country: 'United States',
        date: '2026-10-24',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-24T22:00:00.000Z',
        timeZone: 'America/New_York',
        status: 'registered',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
    ],
  },
  eligible: {
    user: { ...USER, devLinked: true },
    addressValidated: true,
    required: [
      {
        id: 'signin',
        completed: true,
        completedAt: '2026-09-20T09:00:00.000Z',
        source: 'api',
      },
      {
        id: 'address',
        completed: true,
        completedAt: '2026-09-21T09:00:00.000Z',
        source: 'api',
      },
    ],
    thresholds: { stickers: 1, complete: 8, completionist: 15 },
    activities: [{ id: 'fest', completed: true, completedAt: '2026-08-01' }],
    /* The catalogue as GET /api/me/items serves it: the pack and the
       holographic sticker, earned by the milestones. */
    items: [
      {
        id: 'sticker-pack-2026',
        name: 'The 2026 sticker pack',
        kind: 'physical',
        earnedBy: 'Your first sticker',
        getsToYou:
          'Mailed to the address on your MyMLH account after Hacktoberfest. Please allow 8-12 weeks for shipping.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: true,
        earnedAt: '2026-10-01T09:00:00.000Z',
      },
      {
        id: 'holographic-sticker-2026',
        name: 'The holographic sticker',
        kind: 'physical',
        earnedBy: 'Ten stickers in the book',
        getsToYou:
          'Mailed with your sticker pack to the address on your MyMLH account after Hacktoberfest.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      {
        id: 'completionist-certificate-2026',
        name: 'Completionist certificate',
        kind: 'digital',
        earnedBy: 'Seventeen stickers in the book',
        getsToYou:
          'A certificate with your name and the year on it, made the moment you ask for it, as a PDF or a PNG.',
        cta: null,
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      ...devBadges({ 'dev-badge-fest-2026': '2026-08-01T10:00:00.000Z' }),
    ],
    fests: [
      {
        id: 'fest-london',
        name: 'Hacktober Fest London',
        city: 'London',
        country: 'United Kingdom',
        date: '2026-08-01',
        startTime: '9:30 AM',
        endTime: '5:00 PM',
        endsAt: '2026-08-01T16:00:00.000Z',
        timeZone: 'Europe/London',
        status: 'checked_in',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
    ],
  },
  'nothing-done': {
    user: { ...USER, devLinked: false },
    addressValidated: false,
    required: [
      {
        id: 'signin',
        completed: true,
        completedAt: '2026-09-20T09:00:00.000Z',
        source: 'api',
      },
      { id: 'address', completed: false, completedAt: null, source: null },
    ],
    thresholds: { stickers: 1, complete: 8, completionist: 15 },
    activities: [{ id: 'livestreams-1', completed: false }],
    /* The catalogue as GET /api/me/items serves it: the pack and the
       holographic sticker, earned by the milestones. */
    items: [
      {
        id: 'sticker-pack-2026',
        name: 'The 2026 sticker pack',
        kind: 'physical',
        earnedBy: 'Your first sticker',
        getsToYou:
          'Mailed to the address on your MyMLH account after Hacktoberfest. Please allow 8-12 weeks for shipping.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      {
        id: 'holographic-sticker-2026',
        name: 'The holographic sticker',
        kind: 'physical',
        earnedBy: 'Ten stickers in the book',
        getsToYou:
          'Mailed with your sticker pack to the address on your MyMLH account after Hacktoberfest.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      {
        id: 'completionist-certificate-2026',
        name: 'Completionist certificate',
        kind: 'digital',
        earnedBy: 'Seventeen stickers in the book',
        getsToYou:
          'A certificate with your name and the year on it, made the moment you ask for it, as a PDF or a PNG.',
        cta: null,
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      ...devBadges(),
    ],
    fests: [],
  },
  /* Milestone 2 (Hacktoberfest complete): eight activities done, same
     address gate as every other eligible scenario. Exists so that state has
     a shareable review link too, matching every other scenario here. */
  complete: {
    user: { ...USER, devLinked: true },
    addressValidated: true,
    required: [
      {
        id: 'signin',
        completed: true,
        completedAt: '2026-09-20T09:00:00.000Z',
        source: 'api',
      },
      {
        id: 'address',
        completed: true,
        completedAt: '2026-09-21T09:00:00.000Z',
        source: 'api',
      },
    ],
    thresholds: { stickers: 1, complete: 8, completionist: 15 },
    activities: [
      { id: 'fest', completed: true, completedAt: '2026-08-01' },
      { id: 'livestreams-1', completed: true, completedAt: '2026-10-05' },
      { id: 'livestreams-3', completed: true, completedAt: '2026-10-12' },
      { id: 'livestream-launch', completed: true, completedAt: '2026-10-01' },
      { id: 'dev-relay', completed: true, completedAt: '2026-10-02' },
      { id: 'dev-connect', completed: true, completedAt: '2026-10-02' },
      { id: 'discord', completed: true, completedAt: '2026-10-03' },
      { id: 'digitalocean', completed: true, completedAt: '2026-10-04' },
    ],
    /* The catalogue as GET /api/me/items serves it: the pack and the
       holographic sticker, earned by the milestones. */
    items: [
      {
        id: 'sticker-pack-2026',
        name: 'The 2026 sticker pack',
        kind: 'physical',
        earnedBy: 'Your first sticker',
        getsToYou:
          'Mailed to the address on your MyMLH account after Hacktoberfest. Please allow 8-12 weeks for shipping.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: true,
        earnedAt: '2026-10-01T09:00:00.000Z',
      },
      {
        id: 'holographic-sticker-2026',
        name: 'The holographic sticker',
        kind: 'physical',
        earnedBy: 'Ten stickers in the book',
        getsToYou:
          'Mailed with your sticker pack to the address on your MyMLH account after Hacktoberfest.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: true,
        earnedAt: '2026-10-17T12:00:00.000Z',
      },
      {
        id: 'completionist-certificate-2026',
        name: 'Completionist certificate',
        kind: 'digital',
        earnedBy: 'Seventeen stickers in the book',
        getsToYou:
          'A certificate with your name and the year on it, made the moment you ask for it, as a PDF or a PNG.',
        cta: null,
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      ...devBadges({ 'dev-badge-fest-2026': '2026-08-01T10:00:00.000Z' }),
    ],
    fests: [
      {
        id: 'fest-london',
        name: 'Hacktober Fest London',
        city: 'London',
        country: 'United Kingdom',
        date: '2026-08-01',
        startTime: '9:30 AM',
        endTime: '5:00 PM',
        endsAt: '2026-08-01T16:00:00.000Z',
        timeZone: 'Europe/London',
        status: 'checked_in',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
    ],
  },
  /* Milestone 3 (Completionist): fifteen activities done, so the third
     card shows earned. A review link for the fullest book the season can
     hold short of every sticker. */
  completionist: {
    user: { ...USER, devLinked: true },
    addressValidated: true,
    required: [
      {
        id: 'signin',
        completed: true,
        completedAt: '2026-09-20T09:00:00.000Z',
        source: 'api',
      },
      {
        id: 'address',
        completed: true,
        completedAt: '2026-09-21T09:00:00.000Z',
        source: 'api',
      },
    ],
    thresholds: { stickers: 1, complete: 8, completionist: 15 },
    activities: [
      { id: 'fest', completed: true, completedAt: '2026-08-01' },
      { id: 'livestreams-1', completed: true, completedAt: '2026-10-05' },
      { id: 'livestreams-3', completed: true, completedAt: '2026-10-12' },
      { id: 'livestream-launch', completed: true, completedAt: '2026-10-01' },
      { id: 'dev-relay', completed: true, completedAt: '2026-10-02' },
      { id: 'dev-connect', completed: true, completedAt: '2026-10-02' },
      { id: 'discord', completed: true, completedAt: '2026-10-03' },
      { id: 'digitalocean', completed: true, completedAt: '2026-10-04' },
      { id: 'livestreams-5', completed: true, completedAt: '2026-10-19' },
      { id: 'host-fest', completed: true, completedAt: '2026-10-10' },
      { id: 'dev-week-3', completed: true, completedAt: '2026-10-22' },
      { id: 'ghw', completed: true, completedAt: '2026-10-13' },
      { id: 'ghw-livestream', completed: true, completedAt: '2026-10-14' },
      { id: 'ghw-points-15', completed: true, completedAt: '2026-10-15' },
      { id: 'ghw-points-30', completed: true, completedAt: '2026-10-16' },
    ],
    /* The catalogue as GET /api/me/items serves it: the pack and the
       holographic sticker, earned by the milestones. */
    items: [
      {
        id: 'sticker-pack-2026',
        name: 'The 2026 sticker pack',
        kind: 'physical',
        earnedBy: 'Your first sticker',
        getsToYou:
          'Mailed to the address on your MyMLH account after Hacktoberfest. Please allow 8-12 weeks for shipping.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: true,
        earnedAt: '2026-10-01T09:00:00.000Z',
      },
      {
        id: 'holographic-sticker-2026',
        name: 'The holographic sticker',
        kind: 'physical',
        earnedBy: 'Ten stickers in the book',
        getsToYou:
          'Mailed with your sticker pack to the address on your MyMLH account after Hacktoberfest.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: true,
        earnedAt: '2026-10-17T12:00:00.000Z',
      },
      {
        id: 'completionist-certificate-2026',
        name: 'Completionist certificate',
        kind: 'digital',
        earnedBy: 'Seventeen stickers in the book',
        getsToYou:
          'A certificate with your name and the year on it, made the moment you ask for it, as a PDF or a PNG.',
        cta: null,
        requiresDevLink: false,
        earned: true,
        earnedAt: '2026-10-22T12:00:00.000Z',
      },
      {
        id: 'fest-certificate-2026',
        name: 'Fest attendance certificate',
        kind: 'digital',
        earnedBy: 'Attending a Fest',
        getsToYou:
          'A certificate with your name, the Fest and the date, one for every Fest you attend.',
        cta: null,
        requiresDevLink: false,
        key: 'fest-london',
        variant: { title: 'Hacktober Fest London', date: '2026-08-01' },
        earned: true,
        earnedAt: '2026-08-01T10:00:00.000Z',
      },
      ...devBadges({
        'dev-badge-fest-2026': '2026-08-01T10:00:00.000Z',
        'dev-badge-host-2026': '2026-10-10T12:00:00.000Z',
        'dev-badge-completionist-2026': '2026-10-22T12:00:00.000Z',
      }),
    ],
    fests: [
      {
        id: 'fest-london',
        name: 'Hacktober Fest London',
        city: 'London',
        country: 'United Kingdom',
        date: '2026-08-01',
        startTime: '9:30 AM',
        endTime: '5:00 PM',
        endsAt: '2026-08-01T16:00:00.000Z',
        timeZone: 'Europe/London',
        status: 'checked_in',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
    ],
  },
  organizer: {
    user: { ...USER, devLinked: true },
    addressValidated: true,
    required: [
      {
        id: 'signin',
        completed: true,
        completedAt: '2026-09-20T09:00:00.000Z',
        source: 'api',
      },
      {
        id: 'address',
        completed: true,
        completedAt: '2026-09-21T09:00:00.000Z',
        source: 'api',
      },
    ],
    thresholds: { stickers: 1, complete: 8, completionist: 15 },
    /* The Attend sticker, and the Host sticker for the Fest hosted in
       Melbourne in August, so the DEV badges for both show earned. */
    activities: [
      { id: 'fest', completed: true, completedAt: '2026-08-01' },
      { id: 'host-fest', completed: true, completedAt: '2026-08-01' },
    ],
    /* The catalogue as GET /api/me/items serves it: the pack and the
       holographic sticker, earned by the milestones. */
    items: [
      {
        id: 'sticker-pack-2026',
        name: 'The 2026 sticker pack',
        kind: 'physical',
        earnedBy: 'Your first sticker',
        getsToYou:
          'Mailed to the address on your MyMLH account after Hacktoberfest. Please allow 8-12 weeks for shipping.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      /* The host's certificate of appreciation, one per Fest hosted, as
         the API keys it: by the event, with the Fest as the variant. */
      {
        id: 'fest-host-certificate-2026',
        name: 'Fest host certificate',
        kind: 'digital',
        earnedBy: 'Hosting an in-person Fest',
        getsToYou:
          'A certificate of appreciation with your name, the Fest and the date, one for every Fest you host.',
        cta: null,
        requiresDevLink: false,
        key: 'fest-london',
        variant: { title: 'Hacktober Fest London', date: '2026-08-01' },
        earned: true,
        earnedAt: '2026-08-01T09:00:00.000Z',
      },
      {
        id: 'holographic-sticker-2026',
        name: 'The holographic sticker',
        kind: 'physical',
        earnedBy: 'Ten stickers in the book',
        getsToYou:
          'Mailed with your sticker pack to the address on your MyMLH account after Hacktoberfest.',
        cta: {
          label: 'Update shipping address',
          url: 'https://www.mlh.com/account/settings#addresses',
        },
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      {
        id: 'completionist-certificate-2026',
        name: 'Completionist certificate',
        kind: 'digital',
        earnedBy: 'Seventeen stickers in the book',
        getsToYou:
          'A certificate with your name and the year on it, made the moment you ask for it, as a PDF or a PNG.',
        cta: null,
        requiresDevLink: false,
        earned: false,
        earnedAt: null,
      },
      ...devBadges({
        'dev-badge-fest-2026': '2026-08-01T10:00:00.000Z',
        'dev-badge-host-2026': '2026-08-01T09:00:00.000Z',
      }),
    ],
    fests: [
      /* Co-branded, the way MLH actually names a partnered Fest: the
         partner arrives welded to the event name after an "x". Here so the
         split treatment - the Fest as the heading, "Hosted by" underneath -
         is reviewable, since it is common in the live series and no other
         fixture exercises it. */
      {
        id: 'fest-toronto',
        name: 'Hacktoberfest Hack Day Toronto x SharkHacks3',
        city: 'Toronto',
        country: 'Canada',
        date: '2026-10-24',
        startTime: '9:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-24T22:00:00.000Z',
        timeZone: 'America/Toronto',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/toronto',
        websiteUrl: 'https://example.invalid/events/toronto',
        applicationStatus: null,
        manageUrl:
          'https://example.invalid/events/14695-hacktoberfest-hack-day-toronto',
        mlhPublished: true,
        hacktoberfestPublished: true,
        acknowledgedAt: '2026-08-22T09:00:00.000Z',
        latitude: 43.6532,
        longitude: -79.3832,
        venueAddress: '100 Queen Street West, Toronto, ON, M5H 2N2, Canada',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      {
        id: 'fest-tokyo',
        name: 'Hacktober Fest Tokyo',
        city: 'Tokyo',
        country: 'Japan',
        date: '2026-10-17',
        startTime: '10:00 AM',
        endTime: '7:00 PM',
        endsAt: '2026-10-17T10:00:00.000Z',
        timeZone: 'Asia/Tokyo',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/tokyo',
        websiteUrl: 'https://example.invalid/events/tokyo',
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: true,
        hacktoberfestPublished: true,
        acknowledgedAt: '2026-08-20T14:00:00.000Z',
        latitude: 35.6595,
        longitude: 139.7005,
        venueAddress: '1-2-3 Shibuya, Shibuya City, Tokyo, 150-0002, Japan',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* A hosted Fest already behind us: same "Hosting" role, past-tensed
         to "Hosted" by the date, so the past-tense badge is reviewable all
         campaign long. */
      {
        id: 'fest-melbourne',
        name: 'Hacktober Fest Melbourne',
        city: 'Melbourne',
        country: 'Australia',
        date: '2026-08-01',
        startTime: '10:00 AM',
        endTime: '5:00 PM',
        endsAt: '2026-08-01T07:00:00.000Z',
        timeZone: 'Australia/Melbourne',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/melbourne',
        websiteUrl: 'https://example.invalid/events/melbourne',
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: true,
        hacktoberfestPublished: true,
        acknowledgedAt: '2026-08-20T14:00:00.000Z',
        latitude: -37.8102,
        longitude: 144.9628,
        venueAddress: '120 Spencer Street, Melbourne, VIC, 3000, Australia',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* Published in MLH but not here yet: the acknowledgements ask. The
         "One step left" badge and the modal are reviewable from a share
         link on this card. Its description check misses on purpose - this
         is the fixture that demos the advisory nudge, the pane pausing on
         Continue instead of blocking. Named as a Meet Up so the first
         statement's bold no-reimbursement line is reviewable here too. */
      {
        id: 'fest-azores',
        name: 'Hacktoberfest Meet Up Azores',
        city: 'Ponta Delgada',
        country: 'Portugal',
        date: '2026-10-12',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-12T18:00:00.000Z',
        timeZone: 'Atlantic/Azores',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/azores',
        websiteUrl: 'https://example.invalid/events/azores',
        applicationStatus: null,
        manageUrl: 'https://example.invalid/events/14690-hacktober-fest-azores',
        mlhPublished: true,
        hacktoberfestPublished: false,
        acknowledgedAt: null,
        latitude: 37.7412,
        longitude: -25.6756,
        venueAddress: '12 Rua do Mercado, Ponta Delgada, 9500-326, Portugal',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: false },
        ],
      },
      /* Published in MLH but failing an automated check: the checks pane
         blocks the acknowledgements and shows the warning. Reviewable
         from a share link like every other state. */
      {
        id: 'fest-horta',
        name: 'Horta Hacktober Bash',
        city: 'Horta',
        country: 'Portugal',
        date: '2026-10-15',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-15T18:00:00.000Z',
        timeZone: 'Atlantic/Azores',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/horta',
        websiteUrl: 'https://example.invalid/events/horta',
        applicationStatus: null,
        manageUrl: 'https://example.invalid/events/14693-horta-hacktober-bash',
        mlhPublished: true,
        hacktoberfestPublished: false,
        acknowledgedAt: null,
        latitude: 38.5347,
        longitude: -28.6346,
        venueAddress: '7 Rua Vasco da Gama, Horta, 9900-017, Portugal',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: false },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* Acknowledged, waiting on FestNet's checks - the quiet rung
         between the host's last act and the directory. */
      {
        id: 'fest-braga',
        name: 'Hacktober Fest Braga',
        city: 'Braga',
        country: 'Portugal',
        date: '2026-10-20',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
        endsAt: '2026-10-20T16:00:00.000Z',
        timeZone: 'Europe/Lisbon',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/braga',
        websiteUrl: 'https://example.invalid/events/braga',
        applicationStatus: null,
        manageUrl: 'https://example.invalid/events/14691-hacktober-fest-braga',
        mlhPublished: true,
        hacktoberfestPublished: false,
        acknowledgedAt: '2026-08-24T09:30:00.000Z',
        latitude: 41.5454,
        longitude: -8.4265,
        venueAddress: '45 Rua do Souto, Braga, 4700-329, Portugal',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* Acknowledged, and then renamed in Organizer HQ to lead with the
         partner. FestNet re-runs the checks every sync, so the name now
         fails and the Fest is not listed: the rung where nothing is
         running and the move is the host's. */
      {
        id: 'fest-guimaraes',
        name: 'Sparkfleet x Hacktoberfest Hack Day Guimaraes',
        city: 'Guimaraes',
        country: 'Portugal',
        date: '2026-10-21',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-21T17:00:00.000Z',
        timeZone: 'Europe/Lisbon',
        status: null,
        role: 'organizing',
        registrationUrl: 'https://example.invalid/fests/guimaraes',
        websiteUrl: 'https://example.invalid/events/guimaraes',
        applicationStatus: null,
        manageUrl:
          'https://example.invalid/events/14692-hacktober-fest-guimaraes',
        mlhPublished: true,
        hacktoberfestPublished: false,
        acknowledgedAt: '2026-08-24T11:15:00.000Z',
        latitude: 41.4425,
        longitude: -8.2918,
        venueAddress: '12 Rua de Santa Maria, Guimaraes, 4800-443, Portugal',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: false },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* The event exists but the host has not published it in MLH - the
         approved rung, told apart from the Porto application card by its
         source: this one is a real Event row. */
      {
        id: 'fest-coimbra',
        name: 'Hacktober Fest Coimbra',
        city: 'Coimbra',
        country: 'Portugal',
        date: '2026-10-27',
        startTime: '10:00 AM',
        endTime: '4:00 PM',
        endsAt: '2026-10-27T16:00:00.000Z',
        timeZone: 'Europe/Lisbon',
        status: null,
        role: 'organizing',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl:
          'https://example.invalid/events/14692-hacktober-fest-coimbra',
        mlhPublished: false,
        hacktoberfestPublished: false,
        acknowledgedAt: null,
        latitude: 40.2033,
        longitude: -8.4103,
        venueAddress: '3 Largo da Portagem, Coimbra, 3000-337, Portugal',
        publicationChecks: [
          { id: 'coordinates', passed: true },
          { id: 'name', passed: true },
          { id: 'duration', passed: true },
          { id: 'description', passed: true },
        ],
      },
      /* An event application in flight: the Fest-to-be exists only as the
         organizer's draft on MLH's form. No venue, no registration link —
         the CTA sends them back to finish the application. */
      {
        id: 'application-reykjavik',
        name: 'Hacktober Fest Reykjavík',
        city: null,
        country: null,
        date: '2026-10-10',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-10T18:00:00.000Z',
        timeZone: null,
        status: null,
        role: 'organizing',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: 'draft',
        manageUrl: 'https://example.invalid/applications/47507',
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      /* The next rung: submitted, waiting on MLH's review. Exists so the
         submitted badge and its view-application CTA are reviewable from
         a share link like every other variant. */
      {
        id: 'application-lisbon',
        name: 'Hacktober Fest Lisbon',
        city: null,
        country: null,
        date: '2026-10-31',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-31T18:00:00.000Z',
        timeZone: null,
        status: null,
        role: 'organizing',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: 'submitted',
        manageUrl: 'https://example.invalid/applications/47812',
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      /* Sent back for changes: MLH's `rejected`, which OHQ uses when the
         reviewers request revisions. The revise CTA returns the host to
         the same MLH form the draft rung links. */
      {
        id: 'application-madeira',
        name: 'Hacktober Fest Madeira',
        city: null,
        country: null,
        date: '2026-10-18',
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        endsAt: '2026-10-18T18:00:00.000Z',
        timeZone: null,
        status: null,
        role: 'organizing',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: 'rejected',
        manageUrl: 'https://example.invalid/applications/47901',
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      /* The top rung: approved, but the event not yet public — the gap
         where the approved application card renders. Its manageUrl is the
         Organizer HQ event page (the API swaps the link at this rung),
         mirroring the live {ohqId}-{slug} path shape, so the "Manage
         event" CTA is reviewable from a share link too. */
      {
        id: 'application-porto',
        name: 'Hacktober Fest Porto',
        city: null,
        country: null,
        date: '2026-10-25',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
        endsAt: '2026-10-25T16:00:00.000Z',
        timeZone: null,
        status: null,
        role: 'organizing',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: 'approved',
        manageUrl: 'https://example.invalid/events/14683-hacktober-fest-porto',
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      {
        id: 'fest-berlin',
        name: 'Hacktober Fest Berlin',
        city: 'Berlin',
        country: 'Germany',
        date: '2026-10-24',
        startTime: '11:00 AM',
        endTime: '8:00 PM',
        endsAt: '2026-10-24T18:00:00.000Z',
        timeZone: 'Europe/Berlin',
        status: 'registered',
        role: 'attending',
        registrationUrl: 'https://example.invalid/fests/berlin',
        websiteUrl: 'https://example.invalid/events/berlin',
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      {
        id: 'fest-lagos',
        name: 'Hacktober Fest Lagos',
        city: 'Lagos',
        country: 'Nigeria',
        date: '2026-08-01',
        startTime: '9:30 AM',
        endTime: '5:00 PM',
        endsAt: '2026-08-01T16:00:00.000Z',
        timeZone: 'Africa/Lagos',
        status: 'checked_in',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
      /* Still 'registered' with an endsAt twelve-plus hours gone: renders
         the derived grey "Did not attend" badge all campaign long. */
      {
        id: 'fest-oslo',
        name: 'Hacktober Fest Oslo',
        city: 'Oslo',
        country: 'Norway',
        date: '2026-08-01',
        startTime: '10:00 AM',
        endTime: '4:00 PM',
        endsAt: '2026-08-01T14:00:00.000Z',
        timeZone: 'Europe/Oslo',
        status: 'registered',
        role: 'attending',
        registrationUrl: null,
        websiteUrl: null,
        applicationStatus: null,
        manageUrl: null,
        mlhPublished: null,
        hacktoberfestPublished: null,
        acknowledgedAt: null,
        latitude: null,
        longitude: null,
        venueAddress: null,
        publicationChecks: null,
      },
    ],
  },
});

/* The per-Fest dashboards, keyed by the fest ids used in SCENARIOS above.
   Mocked builds only, same as everything else here — and the only way this
   page is reviewable before October, since MLH's real counters read 0 for
   almost every event until the day.

   fest-melbourne has already happened, so it is the one that demonstrates
   the check-ins card; fest-tokyo and fest-azores are both still ahead, so
   they show registrations only.

   The event pack card has one state per Fest, so every state is a review
   link away: fest-tokyo has one FedEx number (the shape MLH writes for a
   real shipment), fest-melbourne has two packages on two carriers,
   fest-toronto has a number whose shape we do not recognise, and
   fest-azores has not shipped. The numbers are real formats, not real
   shipments. fest-toronto also has no check-in code, for the card's
   no-code state, and fest-melbourne's code is eight characters, the
   longest MLH issues; the codes are made up.

   The packing list follows the approved preview's states: fest-tokyo has
   all five items (shipped), fest-melbourne three (no Arduino, no belt
   bags), fest-toronto stickers only, fest-azores all five before it ships,
   and a Fest with no row of its own (EMPTY_FEST_DASHBOARD) is not on the
   sheet yet. */
export const FEST_DASHBOARDS = Object.freeze({
  'fest-tokyo': {
    registrationsCount: 48,
    checkInsCount: 31,
    trackingNumbers: ['877489462372'],
    packContents: ['arduino', 'tshirts', 'beltBags', 'infoCards', 'stickers'],
    checkInCode: 'K7RQ2W',
    /* "Hacktober Fest Tokyo" names no format, so no reimbursement line. */
    photos: {
      galleryUrl: 'https://example.invalid/smugmug/tokyo/gallery',
      uploadUrl: 'https://example.invalid/smugmug/tokyo/upload',
    },
  },
  'fest-melbourne': {
    registrationsCount: 52,
    checkInsCount: 38,
    trackingNumbers: ['1ZK943J80322840185', '9434650206217265901828'],
    packContents: ['tshirts', 'infoCards', 'stickers'],
    checkInCode: 'M3LB8QX2',
  },
  'fest-toronto': {
    registrationsCount: 31,
    checkInsCount: 0,
    trackingNumbers: ['AB123456789XY'],
    packContents: ['stickers'],
    checkInCode: null,
    /* A Hack Day with its album: the reimbursement line and both links. */
    photos: {
      galleryUrl: 'https://example.invalid/smugmug/toronto/gallery',
      uploadUrl: 'https://example.invalid/smugmug/toronto/upload',
    },
  },
  'fest-azores': {
    registrationsCount: 12,
    checkInsCount: 0,
    trackingNumbers: [],
    packContents: ['arduino', 'tshirts', 'beltBags', 'infoCards', 'stickers'],
    checkInCode: 'AZ4R3S',
    /* A Meet Up: both links, no reimbursement line. */
    photos: {
      galleryUrl: 'https://example.invalid/smugmug/azores/gallery',
      uploadUrl: 'https://example.invalid/smugmug/azores/upload',
    },
  },
});

/* What an event with no dashboard row of its own shows: a Fest nobody has
   registered for yet, and whose album MLH has not made yet, which is the
   truthful September answer. fest-guimaraes, a Hack Day, lands here: the
   "coming soon" state with its reimbursement line. */
export const EMPTY_FEST_DASHBOARD = Object.freeze({
  registrationsCount: 0,
  checkInsCount: 0,
  trackingNumbers: [],
  packContents: [],
  checkInCode: null,
  photos: { galleryUrl: null, uploadUrl: null },
});

export const DEFAULT_SCENARIO = 'no-address';

/* `error` is deliberately not in SCENARIOS: it is the one value that is not a
   data shape. It makes getExperience reject, so the error state can be
   reviewed from a link like any other. */
export const ERROR_SCENARIO = 'error';

/* Same reasoning, same convention, for /my's fourth state. `mlh-down` is not
   a data shape either: it makes getExperience reject with an error carrying
   status 502, exactly as apiFetch does when the API reports MLH unreachable,
   so the outage surface can be reviewed from a link like every other state.
   Without it that surface is unreachable in the mocked build — the only
   build designers, QA and CI ever see — and a dead API is no substitute,
   since fetch reports that as a bare TypeError with no status, which lands
   on the generic error screen instead. */
export const MLH_DOWN_SCENARIO = 'mlh-down';

export const selectScenario = (raw) => {
  if (typeof raw !== 'string') return DEFAULT_SCENARIO;
  if (raw === ERROR_SCENARIO) return ERROR_SCENARIO;
  if (raw === MLH_DOWN_SCENARIO) return MLH_DOWN_SCENARIO;
  return Object.prototype.hasOwnProperty.call(SCENARIOS, raw)
    ? raw
    : DEFAULT_SCENARIO;
};
