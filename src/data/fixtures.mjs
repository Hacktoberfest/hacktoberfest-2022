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
      'Fifteen stickers in the book',
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

/* The demo secret sticker's art: a plain hexagon in the site's own
   sticker shape, a 200-unit square (lib/secretStickers.mjs secretArt),
   colors.skyDeep. Invented for the mocked build: a real secret's art
   lives in the API, never here. */
const DEMO_SECRET_ART =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><path d="M100 0 L186.6 50 L186.6 150 L100 200 L13.4 150 L13.4 50 Z" fill="#1f4e6b"/></svg>';

/* Fest dates: entries meant to read as "attended" are dated 2026-08-01 —
   before any plausible review date — so the past group is visible from a
   share link all campaign long, not only after mid-October. Upcoming
   entries sit late in October for the same reason. */
/* A first-time sign-in with nothing done yet. Its own const so the
   applicant scenario below can be the same person with applications. */
const NOTHING_DONE = {
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
  thresholds: { stickers: 1, complete: 8, completionist: 13 },
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
      earnedBy: 'Fifteen stickers in the book',
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
};

/* Someone whose only link to hosting is their applications: a draft and
   one with MLH, no Fest of theirs live yet. The review link for /my's
   hosting link in its applications wording (lib/fests.mjs
   hasOnlyApplications). /my/ sends them on to the hosting hub unless
   their last hub was attending, as it does every host. */
const APPLICANT = {
  ...NOTHING_DONE,
  fests: [
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
  ],
};

/* Milestone 3 (Completionist): fifteen activities done, past the
   thirteen it takes, so the third card shows earned; with the earned demo
   secret that is eighteen stickers in the book, so the fourth card
   (Completionist++) shows pending at eighteen of twenty. Its own const so
   the two Completionist++ scenarios below can be the same person, further
   on or a little short. */
const COMPLETIONIST = {
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
  thresholds: { stickers: 1, complete: 8, completionist: 13 },
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
  /* Two secret stickers, invented for the mocked build: one earned,
     with a plain hexagon for art, and one still a placeholder. Both are
     revealed by the Global Hack Week sticker this scenario has earned,
     as the API only sends a secret once its revealer is earned. Shaped
     as GET /api/me/progress sends them among its challenges; kept apart
     here as lib/progress.mjs keeps them apart, and read by the same
     lib/secretStickers.mjs. */
  secrets: [
    {
      id: 'demo-secret',
      secret: true,
      name: 'A demo secret',
      description: 'Invented for the mocked build.',
      art: DEMO_SECRET_ART,
      revealedBy: 'ghw',
      required: false,
      completed: true,
      completedAt: '2026-10-14',
      source: 'manual',
    },
    {
      id: 'secret-1',
      secret: true,
      hint: 'A demo hint',
      revealedBy: 'ghw',
      required: false,
      completed: false,
      completedAt: null,
      source: null,
    },
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
      earnedBy: 'Fifteen stickers in the book',
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
};

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
    thresholds: { stickers: 1, complete: 8, completionist: 13 },
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
        earnedBy: 'Fifteen stickers in the book',
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
    thresholds: { stickers: 1, complete: 8, completionist: 13 },
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
        earnedBy: 'Fifteen stickers in the book',
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
  'nothing-done': NOTHING_DONE,
  applicant: APPLICANT,
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
    thresholds: { stickers: 1, complete: 8, completionist: 13 },
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
        earnedBy: 'Fifteen stickers in the book',
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
  completionist: COMPLETIONIST,
  /* Milestone 4 (Completionist++), /my's alone: the Completionist above
     with three more DEV stickers, eighteen activities and the required
     two, twenty in the book, so the fourth card shows earned, dated the
     day the twentieth landed. No secrets, on this one or the next, so the
     book's count is the catalogue's alone. */
  'completionist-plus-plus': {
    ...COMPLETIONIST,
    activities: [
      ...COMPLETIONIST.activities,
      { id: 'dev-launch-weekend', completed: true, completedAt: '2026-10-04' },
      { id: 'dev-week-1', completed: true, completedAt: '2026-10-08' },
      { id: 'dev-week-2', completed: true, completedAt: '2026-10-15' },
    ],
    secrets: [],
  },
  /* The near miss: a Completionist with fourteen activities, sixteen
     stickers in the book, the fourth card pending at sixteen of twenty. */
  'completionist-plus-plus-pending': {
    ...COMPLETIONIST,
    activities: COMPLETIONIST.activities.slice(0, 14),
    secrets: [],
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
    thresholds: { stickers: 1, complete: 8, completionist: 13 },
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
        earnedBy: 'Fifteen stickers in the book',
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

/* Ended Fests for reviewing the wrap-up, one per state of the "Get
   reimbursed" card (and the Meet Up's thank-you). Reachable in a mocked
   build at /my/fest/?id=<id>, because mockDashboard searches them after the
   scenarios, but listed on no scenario's /my: an ended Fest on the hub
   would change what every other review link there shows. Each one ended in
   late September 2026, so they read as ended for as long as anyone reviews
   them.

   Canadian, like the canvas, so the limit is the handbook's Canada rate of
   $5.80 a check-in: fest-review-not-ready and fest-review-ready have the
   canvas's 42 check-ins and $243.60.

   fest-review-not-ready     one challenge without a winner, photos in
   fest-review-pending       just ended: MLH and SmugMug not read yet
   fest-review-winners-pending
                             winners still checking, the other three pass:
                             the common state while MLH refuses us winner
                             data (a 403 as of 2026-09-30)
   fest-review-failing       every check failing, for every fix line
   fest-review-ready         all four in: the claim opens at step 2
   fest-review-sent          sent by you
   fest-review-sent-cohost   sent by a co-host
   fest-review-approved      force-approved by MLH, checks still out
   fest-review-no-rate       Iraq, which has no rate in the handbook
   fest-review-over-50       63 check-ins, 50 of them counted
   fest-review-meetup        a Meet Up: thanks, no claim
   fest-review-gift-cards    4 digital gift cards, step 1 done: step 2
                             (Award digital gift cards) open
   fest-review-gift-cards-requested
                             3 of its 4 gift cards requested: step 2
                             folded, step 3 open

   The gift card states before the Fest are UPCOMING_REVIEW_FESTS below. */
const reviewFest = ({
  id,
  number,
  name,
  city,
  country,
  date,
  times,
  ...rest
}) => {
  const slug = id.replace(/^fest-review-/, '');
  return {
    id,
    name,
    city,
    country: country || 'Canada',
    date,
    startTime: times[0],
    endTime: times[1],
    status: null,
    role: 'organizing',
    registrationUrl: `https://example.invalid/fests/review-${slug}`,
    websiteUrl: `https://example.invalid/events/review-${slug}`,
    applicationStatus: null,
    manageUrl: `https://example.invalid/events/${number}-hacktoberfest-review-${slug}`,
    mlhPublished: true,
    hacktoberfestPublished: true,
    acknowledgedAt: '2026-09-02T14:00:00.000Z',
    publicationChecks: [
      { id: 'coordinates', passed: true },
      { id: 'name', passed: true },
      { id: 'duration', passed: true },
      { id: 'description', passed: true },
    ],
    ...rest,
  };
};

export const REVIEW_FESTS = Object.freeze([
  reviewFest({
    id: 'fest-review-not-ready',
    number: 14801,
    name: 'Hacktoberfest Hack Day Toronto x SharkHacks3',
    city: 'Toronto',
    date: '2026-09-26',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-09-26T22:00:00.000Z',
    timeZone: 'America/Toronto',
    latitude: 43.6532,
    longitude: -79.3832,
    venueAddress: '100 Queen Street West, Toronto, ON, M5H 2N2, Canada',
  }),
  reviewFest({
    id: 'fest-review-pending',
    number: 14802,
    name: 'Hacktoberfest Hack Day Hamilton',
    city: 'Hamilton',
    date: '2026-09-29',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-09-29T22:00:00.000Z',
    timeZone: 'America/Toronto',
    latitude: 43.2557,
    longitude: -79.8711,
    venueAddress: '71 Main Street West, Hamilton, ON, L8P 4Y5, Canada',
  }),
  reviewFest({
    id: 'fest-review-winners-pending',
    number: 14803,
    name: 'Hacktoberfest Hack Day Montreal',
    city: 'Montreal',
    date: '2026-09-27',
    times: ['9:00 AM', '5:00 PM'],
    endsAt: '2026-09-27T21:00:00.000Z',
    timeZone: 'America/Toronto',
    latitude: 45.5019,
    longitude: -73.5674,
    venueAddress: '275 Rue Notre-Dame Est, Montreal, QC, H2Y 1C6, Canada',
  }),
  reviewFest({
    id: 'fest-review-failing',
    number: 14804,
    name: 'Hacktoberfest Hack Day Guelph',
    city: 'Guelph',
    date: '2026-09-27',
    times: ['10:00 AM', '4:00 PM'],
    endsAt: '2026-09-27T20:00:00.000Z',
    timeZone: 'America/Toronto',
    latitude: 43.5448,
    longitude: -80.2482,
    venueAddress: '1 Carden Street, Guelph, ON, N1H 3A1, Canada',
  }),
  reviewFest({
    id: 'fest-review-ready',
    number: 14805,
    name: 'Hacktoberfest Hack Day Ottawa',
    city: 'Ottawa',
    date: '2026-09-26',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-09-26T22:00:00.000Z',
    timeZone: 'America/Toronto',
    latitude: 45.4215,
    longitude: -75.6972,
    venueAddress: '110 Laurier Avenue West, Ottawa, ON, K1P 1J1, Canada',
  }),
  reviewFest({
    id: 'fest-review-sent',
    number: 14806,
    name: 'Hacktoberfest Hack Day Waterloo',
    city: 'Waterloo',
    date: '2026-09-26',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-09-26T22:00:00.000Z',
    timeZone: 'America/Toronto',
    latitude: 43.4643,
    longitude: -80.5204,
    venueAddress: '100 Regina Street South, Waterloo, ON, N2J 4A8, Canada',
  }),
  reviewFest({
    id: 'fest-review-sent-cohost',
    number: 14807,
    name: 'Hacktoberfest Hack Day Halifax',
    city: 'Halifax',
    date: '2026-09-25',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-09-25T21:00:00.000Z',
    timeZone: 'America/Halifax',
    latitude: 44.6488,
    longitude: -63.5752,
    venueAddress: '1790 Granville Street, Halifax, NS, B3J 1X7, Canada',
  }),
  reviewFest({
    id: 'fest-review-approved',
    number: 14808,
    name: 'Hacktoberfest Hack Day Calgary',
    city: 'Calgary',
    date: '2026-09-27',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-09-28T00:00:00.000Z',
    timeZone: 'America/Edmonton',
    latitude: 51.0447,
    longitude: -114.0719,
    venueAddress: '800 Macleod Trail SE, Calgary, AB, T2G 2M3, Canada',
  }),
  reviewFest({
    id: 'fest-review-no-rate',
    number: 14809,
    name: 'Hacktoberfest Hack Day Baghdad',
    city: 'Baghdad',
    country: 'Iraq',
    date: '2026-09-26',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-09-26T15:00:00.000Z',
    timeZone: 'Asia/Baghdad',
    latitude: 33.3152,
    longitude: 44.3661,
    venueAddress: '14 Abu Nuwas Street, Baghdad, 10011, Iraq',
  }),
  reviewFest({
    id: 'fest-review-over-50',
    number: 14810,
    name: 'Hacktoberfest Hack Day Vancouver',
    city: 'Vancouver',
    date: '2026-09-27',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-09-28T01:00:00.000Z',
    timeZone: 'America/Vancouver',
    latitude: 49.2827,
    longitude: -123.1207,
    venueAddress: '555 West Hastings Street, Vancouver, BC, V6B 4N6, Canada',
  }),
  reviewFest({
    id: 'fest-review-meetup',
    number: 14811,
    name: 'Hacktoberfest Meet Up Kingston',
    city: 'Kingston',
    date: '2026-09-28',
    times: ['6:00 PM', '9:00 PM'],
    endsAt: '2026-09-29T01:00:00.000Z',
    timeZone: 'America/Toronto',
    latitude: 44.2312,
    longitude: -76.486,
    venueAddress: '216 Ontario Street, Kingston, ON, K7L 2Z3, Canada',
  }),
  reviewFest({
    id: 'fest-review-gift-cards',
    number: 14812,
    name: 'Hacktoberfest Hack Day Winnipeg',
    city: 'Winnipeg',
    date: '2026-09-26',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-09-26T23:00:00.000Z',
    timeZone: 'America/Winnipeg',
    latitude: 49.8951,
    longitude: -97.1384,
    venueAddress: '510 Main Street, Winnipeg, MB, R3B 1B9, Canada',
  }),
  reviewFest({
    id: 'fest-review-gift-cards-requested',
    number: 14813,
    name: 'Hacktoberfest Hack Day Regina',
    city: 'Regina',
    date: '2026-09-26',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-09-27T00:00:00.000Z',
    timeZone: 'America/Regina',
    latitude: 50.4452,
    longitude: -104.6189,
    venueAddress: '2405 Legislative Drive, Regina, SK, S4S 0B3, Canada',
  }),
]);

/* Review Fests that have not happened yet, for the digital gift cards'
   pre-event surfaces: reachable by id in a mocked build, like
   REVIEW_FESTS, and on no scenario's /my. Both are on the last weekend of
   October, so they read as upcoming for as long as anyone reviews them.

   fest-review-gift-cards-upcoming
                             a Gemma Hack Day with 4 gift cards: the Event
                             pack's chip and hint, both prize lines
                             offering gift cards, and the ochre count row
   fest-review-gift-cards-meetup
                             a Meet Up whose payload carries a gift card
                             block anyway (the API sends null for one):
                             the page holds the rule, and nothing shows */
export const UPCOMING_REVIEW_FESTS = Object.freeze([
  reviewFest({
    id: 'fest-review-gift-cards-upcoming',
    number: 14814,
    name: 'Hacktoberfest Hack Day Kitchener x SharkHacks4',
    city: 'Kitchener',
    date: '2026-10-31',
    times: ['10:00 AM', '6:00 PM'],
    endsAt: '2026-10-31T22:00:00.000Z',
    timeZone: 'America/Toronto',
    latitude: 43.4516,
    longitude: -80.4925,
    venueAddress: '200 King Street West, Kitchener, ON, N2G 4G7, Canada',
  }),
  reviewFest({
    id: 'fest-review-gift-cards-meetup',
    number: 14815,
    name: 'Hacktoberfest Meet Up London',
    city: 'London',
    date: '2026-10-30',
    times: ['6:00 PM', '9:00 PM'],
    endsAt: '2026-10-31T01:00:00.000Z',
    timeZone: 'America/Toronto',
    latitude: 42.9849,
    longitude: -81.2453,
    venueAddress: '251 Dundas Street, London, ON, N6A 6H9, Canada',
  }),
]);

/* The handbook's Canada rate, and a limit worked out from it the way the
   API does. Amounts are written out rather than multiplied, because 42 x
   5.8 in floating point is 243.59999999999997. */
const canada = (checkIns, checkInsCounted, amount) => ({
  country: 'Canada',
  perCheckIn: 5.8,
  checkIns,
  checkInsCounted,
  amount,
});

const ALL_IN = Object.freeze({
  checkIns: true,
  submissions: true,
  winners: { missing: [] },
  photos: { count: 86 },
});

const reviewDashboard = (id, { reimbursement, ...counts }) => {
  const slug = id.replace(/^fest-review-/, '');
  return {
    trackingNumbers: ['877489462372'],
    packContents: ['arduino', 'tshirts', 'beltBags', 'infoCards', 'stickers'],
    checkInCode: 'W7RAP2',
    photos: {
      galleryUrl: `https://example.invalid/smugmug/review-${slug}/gallery`,
      uploadUrl: `https://example.invalid/smugmug/review-${slug}/upload`,
    },
    format: 'hackDay',
    partners: [],
    ...counts,
    reimbursement: {
      checks: ALL_IN,
      forceApproved: false,
      eligible: false,
      limit: null,
      submission: null,
      ...reimbursement,
    },
  };
};

const REVIEW_FEST_DASHBOARDS = {
  'fest-review-not-ready': reviewDashboard('fest-review-not-ready', {
    registrationsCount: 68,
    checkInsCount: 42,
    partners: ['gemma'],
    reimbursement: {
      checks: { ...ALL_IN, winners: { missing: ['Best Use of Gemma 4'] } },
      limit: canada(42, 42, 243.6),
    },
  }),
  'fest-review-pending': reviewDashboard('fest-review-pending', {
    registrationsCount: 40,
    checkInsCount: 27,
    reimbursement: {
      checks: {
        checkIns: true,
        submissions: null,
        winners: null,
        photos: null,
      },
      limit: canada(27, 27, 156.6),
    },
  }),
  'fest-review-winners-pending': reviewDashboard(
    'fest-review-winners-pending',
    {
      registrationsCount: 51,
      checkInsCount: 36,
      reimbursement: {
        checks: { ...ALL_IN, winners: null, photos: { count: 112 } },
        limit: canada(36, 36, 208.8),
      },
    },
  ),
  'fest-review-failing': reviewDashboard('fest-review-failing', {
    registrationsCount: 9,
    checkInsCount: 2,
    partners: ['gemma'],
    reimbursement: {
      checks: {
        checkIns: false,
        submissions: false,
        winners: {
          missing: ['Best Use of Gemma 4', 'Best Open-Source AI Project'],
        },
        photos: { count: 0 },
      },
      limit: canada(2, 2, 11.6),
    },
  }),
  'fest-review-ready': reviewDashboard('fest-review-ready', {
    registrationsCount: 59,
    checkInsCount: 42,
    reimbursement: { eligible: true, limit: canada(42, 42, 243.6) },
  }),
  'fest-review-sent': reviewDashboard('fest-review-sent', {
    registrationsCount: 68,
    checkInsCount: 42,
    reimbursement: {
      eligible: true,
      limit: canada(42, 42, 243.6),
      submission: {
        submittedAt: '2026-09-27T15:12:00.000Z',
        byYou: true,
        payee: {
          firstName: 'Jamie',
          lastName: 'Rivera',
          email: 'jamie@sharkhacks.ca',
        },
      },
    },
  }),
  'fest-review-sent-cohost': reviewDashboard('fest-review-sent-cohost', {
    registrationsCount: 47,
    checkInsCount: 38,
    reimbursement: {
      eligible: true,
      limit: canada(38, 38, 220.4),
      submission: {
        submittedAt: '2026-09-26T13:40:00.000Z',
        byYou: false,
        payee: {
          firstName: 'Priya',
          lastName: 'Natarajan',
          email: 'priya@haligonians.dev',
        },
      },
    },
  }),
  'fest-review-approved': reviewDashboard('fest-review-approved', {
    registrationsCount: 61,
    checkInsCount: 42,
    reimbursement: {
      checks: {
        checkIns: true,
        submissions: null,
        winners: null,
        photos: null,
      },
      forceApproved: true,
      eligible: true,
      limit: canada(42, 42, 243.6),
    },
  }),
  'fest-review-no-rate': reviewDashboard('fest-review-no-rate', {
    registrationsCount: 44,
    checkInsCount: 30,
    reimbursement: { eligible: true, limit: null },
  }),
  'fest-review-over-50': reviewDashboard('fest-review-over-50', {
    registrationsCount: 92,
    checkInsCount: 63,
    reimbursement: { eligible: true, limit: canada(63, 50, 290) },
  }),
  /* The API sends the block for every Fest; a Meet Up's page ignores it. */
  'fest-review-meetup': reviewDashboard('fest-review-meetup', {
    registrationsCount: 31,
    checkInsCount: 19,
    format: 'meetUp',
    reimbursement: { limit: canada(19, 19, 110.2) },
  }),
  'fest-review-gift-cards': reviewDashboard('fest-review-gift-cards', {
    registrationsCount: 64,
    checkInsCount: 42,
    partners: ['gemma'],
    giftCards: { limit: 4, request: null },
    reimbursement: { eligible: true, limit: canada(42, 42, 243.6) },
  }),
  'fest-review-gift-cards-requested': reviewDashboard(
    'fest-review-gift-cards-requested',
    {
      registrationsCount: 55,
      checkInsCount: 38,
      giftCards: {
        limit: 4,
        request: {
          submittedAt: '2026-09-27T16:05:00.000Z',
          byYou: true,
          emails: [
            'jamie@sharkhacks.ca',
            'priya@utoronto.ca',
            'sam.o@queensu.ca',
          ],
        },
      },
      reimbursement: { eligible: true, limit: canada(38, 38, 220.4) },
    },
  ),
};

/* The upcoming review Fests' dashboards: nothing checked in yet, the pack
   shipped with everything in it, the album's links. */
const upcomingDashboard = (id, rest) => {
  const slug = id.replace(/^fest-review-/, '');
  return {
    registrationsCount: 47,
    checkInsCount: 0,
    trackingNumbers: ['1Z999AA10123456784'],
    packContents: ['arduino', 'tshirts', 'beltBags', 'infoCards', 'stickers'],
    checkInCode: 'G1FT4U',
    photos: {
      galleryUrl: `https://example.invalid/smugmug/review-${slug}/gallery`,
      uploadUrl: `https://example.invalid/smugmug/review-${slug}/upload`,
    },
    ...rest,
  };
};

const UPCOMING_REVIEW_FEST_DASHBOARDS = {
  'fest-review-gift-cards-upcoming': upcomingDashboard(
    'fest-review-gift-cards-upcoming',
    {
      format: 'hackDay',
      partners: ['gemma'],
      giftCards: { limit: 4, request: null },
    },
  ),
  /* The API blanks a Meet Up's partners and sends it no gift cards; this
     one keeps the block to show the page holds the rule too. */
  'fest-review-gift-cards-meetup': upcomingDashboard(
    'fest-review-gift-cards-meetup',
    {
      registrationsCount: 22,
      format: 'meetUp',
      partners: [],
      giftCards: { limit: 4, request: null },
    },
  ),
};

/* The per-Fest dashboards, keyed by the fest ids used in SCENARIOS above.
   Mocked builds only, same as everything else here — and the only way this
   page is reviewable before October, since MLH's real counters read 0 for
   almost every event until the day.

   fest-melbourne has already happened, so it is the one that demonstrates
   the check-ins card; fest-tokyo and fest-azores are both still ahead, so
   they show registrations only. Since the wrap-up shipped, fest-melbourne
   is also an ended Fest whose API sends no format and no reimbursement
   block, so its page is the two counts alone: its pack and code rows
   below are no longer on screen (the pre-event cards are not shown once a
   Fest has ended). The ended states proper are REVIEW_FESTS above.

   The event pack card has one state per Fest, so every state is a review
   link away: fest-tokyo has one FedEx number (the shape MLH writes for a
   real shipment), fest-melbourne has two packages on two carriers,
   fest-toronto has a number whose shape we do not recognise, and
   fest-azores has not shipped. The numbers are real formats, not real
   shipments. fest-toronto also has no check-in code, for the card's
   no-code state, and fest-melbourne's code is eight characters, the
   longest MLH issues; the codes are made up.

   The Useful info card, one review link per row of the spec's table:
   fest-toronto is a Gemma Hack Day, fest-guimaraes a Hack Day with Gemma
   and Snowflake (Gemma's deck and line, no Snowflake), fest-braga a Hack
   Day whose one partner is Snowflake (a prize line with no Event pack
   link), fest-tokyo a Hack Day with no partner, and fest-azores a Meetup
   that MLH lists all four partners on (the Meetup deck, no prizes). The
   API blanks a Meetup's partners before they get here; this one keeps
   them to show the page holds the rule too. fest-melbourne sends neither
   key, as an API from before partners does, and gets no card; the Fests
   on EMPTY_FEST_DASHBOARD have a format nobody could place, and get none
   either.

   fest-tokyo and fest-braga name no format. The API reads the format off
   the host's application before the name, so they are Hack Days here by
   application, and the photo card (which reads only the name) leaves out
   its reimbursement line on them, exactly as it would on a live Fest
   named that way.

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
    format: 'hackDay',
    partners: [],
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
    format: 'hackDay',
    partners: ['gemma'],
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
    format: 'meetUp',
    partners: ['solana', 'snowflake', 'github', 'gemma'],
  },
  /* fest-guimaraes and fest-braga: nothing registered or shipped yet, like
     EMPTY_FEST_DASHBOARD below, plus the Useful info facts. */
  'fest-guimaraes': {
    registrationsCount: 0,
    checkInsCount: 0,
    trackingNumbers: [],
    checkInCode: null,
    photos: { galleryUrl: null, uploadUrl: null },
    format: 'hackDay',
    partners: ['snowflake', 'gemma'],
  },
  'fest-braga': {
    registrationsCount: 0,
    checkInsCount: 0,
    trackingNumbers: [],
    checkInCode: null,
    photos: { galleryUrl: null, uploadUrl: null },
    format: 'hackDay',
    partners: ['snowflake'],
  },
  /* The review Fests above, ended and upcoming, reachable by id only. */
  ...REVIEW_FEST_DASHBOARDS,
  ...UPCOMING_REVIEW_FEST_DASHBOARDS,
});

/* What an event with no dashboard row of its own shows: a Fest nobody has
   registered for yet, and whose album MLH has not made yet, which is the
   truthful September answer. fest-guimaraes, a Hack Day, has a copy of
   this row with partners added, so its page is still the "coming soon"
   state with its reimbursement line. The format is null, as the API sends
   for a Fest neither its application nor its name places, so the Fests
   that land here (fest-horta, fest-coimbra) show no Useful info card. */
export const EMPTY_FEST_DASHBOARD = Object.freeze({
  registrationsCount: 0,
  checkInsCount: 0,
  trackingNumbers: [],
  packContents: [],
  checkInCode: null,
  photos: { galleryUrl: null, uploadUrl: null },
  format: null,
  partners: [],
});

/* GET /api/me/offers for the mocked build's /my/promos/: one card per
   sponsor, in the API's order (by company name). The three shapes a card
   takes: a code with a native MLH challenge, a code with a DEV challenge,
   and a challenge with no code. DigitalOcean's pool is the real one the
   spec names; the other two sponsors are made up, so a review build never
   says a real sponsor runs something it does not. Logos are null: there is
   no real MLH logo to point at, and the card must read without one.
   Requirements follow the same rule: the made-up Acme pool carries one met
   and two unmet (an account step and a check-in), so every line is
   reviewable, and DigitalOcean's carries
   none, so the review build says nothing about what the real pool asks. */
export const OFFERS = Object.freeze([
  {
    company: { id: 'company-acme-cloud', name: 'Acme Cloud', logoUrl: null },
    challenges: [
      {
        id: 'challenge-acme-dev',
        name: 'Ship It with Acme Cloud',
        shortDescription:
          'Write up something you deployed on Acme Cloud this October.',
        prizeDescription: 'A year of Acme Cloud Pro for three winners.',
        url: 'https://dev.to/challenges/hacktoberfest-week2-2026-10-12',
        external: true,
      },
    ],
    promo: {
      poolId: 'pool-acme-cloud',
      eventId: '01a0ced1-50e8-1335-a5c2-33b29d7d155a',
      label: 'Acme Cloud credit for Hacktoberfest',
      description: '$50 of Acme Cloud credit for your Hacktoberfest projects.',
      restrictions: null,
      requirements: [
        { kind: 'verified_phone', met: true },
        { kind: 'github_oauth', met: false },
        { kind: 'checked_in', met: false },
      ],
    },
  },
  {
    company: {
      id: 'company-digitalocean',
      name: 'DigitalOcean',
      logoUrl: null,
    },
    challenges: [
      {
        id: 'challenge-open-source-ai',
        name: 'Best Open-Source AI Project',
        shortDescription: 'Build an open-source AI project at your Hack Day.',
        prizeDescription: 'Belt bags for the winning team.',
        url: 'https://example.invalid/events/toronto',
        external: false,
      },
    ],
    promo: {
      poolId: 'pool-digitalocean',
      eventId: 'fest-toronto',
      label: 'DigitalOcean $25 Credit for Hacktoberfest',
      description: '$25 of DigitalOcean credit.',
      restrictions: 'New DigitalOcean accounts only. One per person.',
      requirements: [],
    },
  },
  {
    company: { id: 'company-gizmo-ai', name: 'Gizmo AI', logoUrl: null },
    challenges: [
      {
        id: 'challenge-gizmo',
        name: 'Best Use of Gizmo AI',
        shortDescription: null,
        prizeDescription: 'Gizmo AI hoodies for the winning team.',
        url: 'https://example.invalid/events/toronto',
        external: false,
      },
    ],
    promo: null,
  },
]);

/* Scenarios with a card list of their own. Anything not named here gets
   OFFERS. `nothing-done` is someone with no sponsor anything yet: the
   empty state. `eligible` is OFFERS for someone whose MLH account the API
   could not check (its MLH read failed): every account requirement stated,
   none marked done or not. A check-in keeps its status, as the API answers
   it from the attendee's own registration, never from that read. The status
   is the attendee's, not the card's, so it is a scenario rather than a
   fourth card. */
export const OFFERS_BY_SCENARIO = Object.freeze({
  eligible: Object.freeze(
    OFFERS.map((offer) =>
      offer.promo
        ? {
            ...offer,
            promo: {
              ...offer.promo,
              requirements: offer.promo.requirements.map((requirement) =>
                requirement.kind === 'checked_in'
                  ? requirement
                  : { kind: requirement.kind, met: null },
              ),
            },
          }
        : offer,
    ),
  ),
  'nothing-done': Object.freeze([]),
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
